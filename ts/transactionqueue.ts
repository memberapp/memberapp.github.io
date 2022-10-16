"use strict";

class UTXO {
  satoshis: number;
  vout: number;
  txid: string;
  height: number;

  constructor(satoshis: number, vout: number, txid: string, height: number) {
    this.satoshis = satoshis;
    this.vout = vout;
    this.txid = txid;
    this.height = height;
  }

  getSatsWithInterest(chainheight: number, interestexponent:number) {
    if(interestexponent==0){
      return this.satoshis;
    }
    if (this.height == 0 || !this.height) {//not in blockchain yet. unconfirmed, no interest earned yet
      return this.satoshis;
    }
    if (!chainheight) {//we don't know chainheight - we must or we may lose interest
      throw Error('Chainheight not found - we must know this or may lose interest');
    }
    //Interest rate on each block 1+(1/2^22)
    let blocksheld = chainheight - this.height;
    let withInterest = this.satoshis * Math.pow(1 + (1 / Math.pow(2, 22)), blocksheld);
    return Math.floor(withInterest);
  }
}

class UTXOPool {
  readonly extraSatoshis = 5;
  readonly maxfee = 5;

  theAddress: string;
  utxoPool: Array<UTXO>;
  utxoServer: string;
  statusMessageFunction: Function;
  chainheight: number;
  chainheighttime: number;
  resendWait = 2000;
  translationFunction: Function;
  updateBalanceFunction: Function;
  fetchFunction: Function;
  interestexponent = 22;
  dustlimit = 546;

  constructor(address: string, utxoServer: string, statusMessageFunction: Function, translationFunction: Function, updateBalanceFunction: Function, fetchFunction: Function, interestexponent:number = 22, dustlimit:number = 546) {
    //address is the legacy address of the account
    //utxoServer is server that will send utxo set
    //status message function is a function to call with progress updates
    //translation function will return localized string for identifier
    //updateBalanceFunction will be called when the pool refreshes and may have different utxos

    this.utxoPool = new Array();
    this.theAddress = address;
    this.utxoServer = utxoServer;
    this.chainheight = 0;
    this.chainheighttime = 0;
    this.statusMessageFunction = statusMessageFunction;
    this.translationFunction = translationFunction;
    this.updateBalanceFunction = updateBalanceFunction;
    this.fetchFunction = fetchFunction;
    this.interestexponent = interestexponent;
    this.dustlimit = dustlimit;
  }

  getSafeTranslation(id: string, defaultstring: string) {
    if (this.translationFunction) {
      return this.translationFunction(id, defaultstring);
    } else {
      return defaultstring;
    }
  }

  setUTXOServer(utxoServer: string) {
    this.utxoServer = utxoServer;
  }

  updateStatus(message: string) {
    console.log(message);
    if (this.statusMessageFunction) {
      this.statusMessageFunction(message);
    } else {
      alert(message);
    }
  }

  //Return a copy of the array of utxo
  getUTXOs() {
    return Array.from(this.utxoPool);
  }

  //Remove a specific utxo
  removeUTXO(txid: string, vout: number) {
    for (let i = 0; i < this.utxoPool.length; i++) {
      if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
        this.utxoPool.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  //Add a utxo to the array
  addUTXO(txid: string, vout: number, satoshis: number, height: number) {
    //Ensure it is not already in the pool
    for (let i = 0; i < this.utxoPool.length; i++) {
      if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
        return false;
      }
    }
    this.utxoPool.push(new UTXO(satoshis, vout, txid, height));
    return true;
  }

  //Get the balance of the array of utxos at a specific chain height
  getBalance(chainheight2: number) {
    var total = 0;
    for (let i = 0; i < this.utxoPool.length; i++) {
      total = total + this.utxoPool[i].getSatsWithInterest(chainheight2 + 1, this.interestexponent);
    }
    return total;
  }

refreshPool() {

    let outputInfo = new Array();

    (async () => {

    var response;
    if (this.fetchFunction) {
      response = await this.fetchFunction(this.utxoServer + this.theAddress);
    } else {
      response = await fetch(this.utxoServer + this.theAddress);
    }
    outputInfo = await response.json();

    let utxos = outputInfo;
    let utxosOriginalNumber = outputInfo.length;

    this.utxoPool = new Array();
    //Check no unexpected data in the fields we care about
    for (let i = 0; i < utxos.length; i++) {
      utxos[i].satoshis = Number(utxos[i].satoshis);
      utxos[i].vout = Number(utxos[i].vout);
      utxos[i].txid = this.sane(utxos[i].txid);

      //Electrum format
      utxos[i].satoshis = Number(utxos[i].value);
      utxos[i].vout = Number(utxos[i].tx_pos);
      utxos[i].txid = this.sane(utxos[i].tx_hash);
      utxos[i].height = this.sane(utxos[i].height);
      if (utxos[i].chainheight) {
        this.chainheight = utxos[i].chainheight;
        this.chainheighttime = new Date().getTime();
      }
      if (utxos[i].satoshis > this.dustlimit) {
        //Remove any utxos with less or equal to dust limit, they may be SLP tokens
        this.utxoPool.push(new UTXO(utxos[i].satoshis, utxos[i].vout, utxos[i].txid, utxos[i].height));
      }
    }

    let usableUTXOScount = this.utxoPool.length;
    this.updateStatus(utxosOriginalNumber + this.getSafeTranslation('utxosreceived', " utxo(s) received. usable") + ' ' + usableUTXOScount);

    if (this.updateBalanceFunction) {
      this.updateBalanceFunction(this.chainheight, this.chainheighttime);
    }

    return this.getBalance(this.chainheight);
    })();
  }

  sane(input: string) {
    if (input === undefined || input == null) { return ""; }
    input = input + "";
    return input.replace(/[^A-Za-z0-9\-_\.]/g, '');
  }
}

class TransactionData {
  to: string;
  toAmount: number;
  data: Array<string>;
  successFunction: Function;

  constructor(to: string, toAmount: number, data: Array<string>, successFunction: Function) {
    this.to = to;
    this.toAmount = toAmount;
    this.data = data;
    this.successFunction = successFunction;
  }
}

class TransactionQueue extends UTXOPool {

  readonly OP_RETURN = 106;
  readonly SIGHASH_BITCOINCASHBIP143 = 0x40;
  readonly SIGHASH_ALL = 0x01
  readonly BCH_SIGHASH_ALL = this.SIGHASH_ALL | this.SIGHASH_BITCOINCASHBIP143;
  queue: Array<TransactionData>;
  isSending: boolean; //Sending from the queue
  transactionInProgress: boolean; //Transaction sending, not necessarily from queue
  privateKey: string;
  broadcastServer: string;
  keyPair: any;
  BitcoinJS: any;
  transactionsPossible: boolean;
  miningFeeSats = 1;
  sighashtouse = this.SIGHASH_ALL;
  
  constructor(address: string, privateKey: string, utxoServer: string, statusMessageFunction: Function, translationFunction: Function, updateBalanceFunction: Function, fetchFunction: Function, BitcoinJS: any, broadcastServer: string, miningFeeSats:number = 1, interestexponent:number = 22, dustlimit:number = 546) {
    super(address, utxoServer, statusMessageFunction, translationFunction, updateBalanceFunction, fetchFunction, interestexponent, dustlimit);
    this.BitcoinJS = BitcoinJS;
    this.queue = new Array();
    this.isSending = false; //Sending from the queue
    this.transactionInProgress = false; //Transaction sending, not necessarily from queue
    this.privateKey = privateKey;
    this.broadcastServer = broadcastServer;
    if (this.privateKey) {
      this.keyPair = this.BitcoinJS.ECPair.fromWIF(this.privateKey);
    }
    let transactionBuilder = new this.BitcoinJS.TransactionBuilder();
    this.transactionsPossible = true;//transactionBuilder.enableBitcoinCash;
    this.miningFeeSats = miningFeeSats;
  
  }

  setbroadcastServer(broadcastServer: string) {
    this.broadcastServer = broadcastServer;
  }

  // compose script
  _script(opcode: number, pushdata: Array<string>) {
    var s = new Array();
    if (pushdata) {
      if (Array.isArray(pushdata)) {
        // Add op_return
        s.push(opcode);
        pushdata.forEach(function (item) {
          // add push data
          if (/^0x/i.test(item)) {
            // ex: 0x6d02
            s.push(Buffer.from(item.slice(2), "hex"));
          } else {
            // ex: "hello"
            s.push(Buffer.from(item));
          }
        })
      }
    }
    return s;
  }

  isTransactionInProgress() {
    if (this.transactionInProgress || this.queue.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  queueTransaction(transaction, onSuccessFunction: Function) {
    if (!this.transactionsPossible) {
      return 'Bitcoin Cash Style Transactions Not Possible with this bitcoin library';
    }
    let toAddress = '';
    let toAmount = 0;
    try {
      toAmount = transaction.cash.to[0].value;
      toAddress = transaction.cash.to[0].address;
    } catch (err) {
      //usually no recipient, send change to self.
    }
    let data = transaction.data;
    this.queue.push(new TransactionData(toAddress, toAmount, data, onSuccessFunction));
    this.sendNextTransaction();
    return 'Sent';
  }

  async sendNextTransaction() {

    if (!this.privateKey) {
      throw new Error(this.getSafeTranslation('noprivatekey', "1000:No Private Key, Cannot Make Transaction"));
    }

    /*if(this.utxoPool.length==0){
      await this.refreshPool();
    }*/

    //If the queue is already sending
    if (this.transactionInProgress) {
      return;
    } else if (this.queue.length == 0) {
      //If the queue has run out of transactions
      return;
    } else {
      this.transactionInProgress = true;
    }

    //let callback = this.serverResponseFunction;



    for (; ;) {
      //Send to node
      let response;
      let txdata;
      let utxos;
      let tx;

      try {
        //Use the first transaction from the queue. Leave it on the queue until it is successfully sent
        txdata = this.queue[0];

        //Choose the UTXOs to use
        utxos = this.selectUTXOs();

        //Make the trx and estimate the fees
        tx = this.constructTransaction(utxos, 0, txdata);
        let transactionSize = tx.byteLength();
        //Add extra satoshis for safety
        console.log("Transaction size:" + transactionSize);
        let fees = Math.round(transactionSize * this.miningFeeSats) + this.extraSatoshis;
        //Make the trx again, with fees included
        tx = this.constructTransaction(utxos, fees, txdata);

        if (this.fetchFunction) {
          response = await this.fetchFunction(this.broadcastServer, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ hexes: [tx.toHex()] })
          });
        } else {
          response = await fetch(this.broadcastServer, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ hexes: [tx.toHex()] })
          });
        }
      } catch (err) {
        console.log(err);
      }

      //This is the only success condition
      if (response && response.ok) {
        let resulttxid;
        let resptext;
        try {
          resptext = await response.text();
          resulttxid = this.sane(resptext);
        } catch (err) {
          console.log(err);
        }
        if (resulttxid && resulttxid.length == 64) {
          this.updateStatus(resulttxid);
          //successful transaction, update the transaction pool
          this.updateTransactionPool(utxos, txdata, tx);
          //remove the transaction from front of queue
          this.queue.shift();
          //ready for next transaction
          this.transactionInProgress = false;
          //call the transactions callback success function
          if (txdata.successFunction) {
            txdata.successFunction(resulttxid);
          }
          this.resendWait = 2000;
          break;
        }
        //otherwise failure of some kind
        this.updateStatus(this.sane(response.ok) + " " + this.sane(response.status) + " " + this.sane(response.statusText) + " " + this.sane(resptext));
      }
      //TODO - should look for specific errors here and take appropriate action rather than just refreshing pool and sending again.
      //Try refreshing the utxo pool
      this.refreshPool();
      await this.sleep(this.resendWait);
      this.resendWait = this.resendWait * 1.5;
      this.updateStatus(this.queue.length + this.getSafeTranslation('stillqueued', " Transaction(s) Still Queued, Try changing UTXO server on settings page. Retry in (seconds)") + " " + (this.resendWait / 1000));
      this.sleep(1000);
      this.updateStatus(this.getSafeTranslation('sendingagain', "Sending Again . . ."));
    }

    //Send the next transaction after a short pause
    this.sleep(1000);
    if (this.queue.length > 0) {
      this.sendNextTransaction();
    }
  }
  /*
    //error code info to consider
        if (errorMessage.startsWith("64")) {
          //Error:64: 
          //May mean not enough mining fee was provided or chained trx limit reached 
        if (errorMessage.startsWith("66")) {
          if (this.miningFeeMultiplier < this.maxfee) {
            //Insufficient Priority - not enough transaction fee provided. Let's try increasing fee.
            this.miningFeeMultiplier = this.miningFeeMultiplier * 1.1;
            returnObject.updateStatus(this.getSafeTranslation('surgepricing', "Error: Transaction rejected because fee too low. Increasing and retrying. Surge Pricing now ") + Math.round(this.miningFeeMultiplier * 10) / 10);
            await this.sleep(1000);
            returnObject.sendNextTransaction();
            return;
          }
        }
  
        //if (errorMessage.startsWith("Network Error") || errorMessage.startsWith("1001") || errorMessage.startsWith("258") || errorMessage.startsWith("200")) { //covers 2000, 2001
        //1001 No UTXOs
        //Error:258: txn-mempool-conflict 
        //2000, all fetched UTXOs already spend
        //2001, insuffiencent funds from unspent UTXOs. Add funds
      
    }*/

  selectUTXOs() {
    let utxos = this.getUTXOs();
    if (utxos.length == 0) {
      throw new Error(this.getSafeTranslation('insufficientfunds', "1001:Insufficient Funds (No Suitable UTXOs)"));
    }
    return utxos;
  }

  constructTransaction(utxos: Array<UTXO>, fees: number, txdata: TransactionData) {


    let changeAddress = this.theAddress;

    let scriptArray = this._script(this.OP_RETURN, txdata.data);
    var arr = new Array();
    scriptArray.forEach(function (chunk) { arr.push(chunk); });
    let script2 = this.BitcoinJS.script.compile(arr);

    //ESTIMATE TRX FEE REQUIRED
    let changeAmount = 0;

    //let txnBuilder = new bchlib.TransactionBuilder(bchlib.networks.bitcoincash);
    //txnBuilder.enableBitcoinCash(true);
    let transactionBuilder = new this.BitcoinJS.TransactionBuilder();
    if(transactionBuilder.enableBitcoinCash){ //if enableBitcoinCash is present, assume we want to use it
      transactionBuilder.enableBitcoinCash(true);
      this.sighashtouse=this.BCH_SIGHASH_ALL;
    }
    //let transactionBuilder = new this.BitcoinJS.bitgo.createTransactionBuilderForNetwork(this.BitcoinJS.networks.bitcoincash);
    if (scriptArray.length > 0) {
      transactionBuilder.addOutput(script2, 0);
    }


    let fundsRemaining = 0;
    //Calculate sum of tx outputs and add inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].getSatsWithInterest(this.chainheight + 1, this.interestexponent);
      fundsRemaining = fundsRemaining + originalAmount;
      // index of vout
      let vout = utxos[i].vout;
      // txid of vout
      let txid = utxos[i].txid;
      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout);
    }

    let utxoFunds = fundsRemaining;
    let transactionOutputTotal = 0;

    //Add recipient
    if (txdata.to && txdata.toAmount) {
      if (txdata.toAmount >= this.dustlimit) {
        fundsRemaining = fundsRemaining - txdata.toAmount;
        transactionOutputTotal += txdata.toAmount;
        transactionBuilder.addOutput(txdata.to, txdata.toAmount);
      }
    }

    changeAmount = fundsRemaining - fees;

    if (changeAmount < 0) {
      throw new Error(this.getSafeTranslation('insufficientfunds', "2001: Insufficient Funds.") + utxoFunds + " " + this.getSafeTranslation('availableamount', "available but required amount is") + " " + (transactionOutputTotal + fees));
    }

    var hasChange = false;
    //Add funds remaining as change if larger than dust
    if (changeAmount >= this.dustlimit) {
      transactionBuilder.addOutput(changeAddress, changeAmount);
      hasChange = true;
    }

    //Sign inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].satoshis;
      // sign w/ HDNode
      let redeemScript;
      //this.sighashtouse=this.BCH_SIGHASH_ALL
      //this.SIGHASH_ALL
      transactionBuilder.sign(i, this.keyPair, redeemScript, this.sighashtouse, originalAmount, null);
      //, originalAmount, null, 0
    }
    //transactionBuilder.sign(0, this.keyPair);

    // build tx
    let tx = transactionBuilder.build();
    tx.outs[tx.outs.length - 1].isChange = true;
    return tx;

  }


  updateTransactionPool(utxos: Array<UTXO>, txdata: TransactionData, tx: any) {
    for (let i = 0; i < utxos.length; i++) {
      //Remove the utxos from the utxo pool
      this.removeUTXO(utxos[i].txid, utxos[i].vout);
    }

    //Add new utxos.
    //Note, this only deals with the change amount. If the member has send a different utxo to himself, it won't be added. 
    for (let i = 0; i < tx.outs.length; i++) {
      if (tx.outs[i].isChange == true) {
        this.addUTXO(tx.getId(), i, tx.outs[i].value, this.chainheight + 1);
      }
    }
    //this.updateBalance(chainheight);
  }

  sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

if(typeof module !== 'undefined'){
  module.exports = TransactionQueue;
}
