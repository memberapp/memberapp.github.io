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

  getSatsWithInterest(chainheight: number) {
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
  readonly DUSTLIMIT = 546;
  readonly extraSatoshis = 5;
  readonly maxfee = 5;

  theAddress: string;
  utxoPool: Array<UTXO>;
  utxoServer: string;
  statusMessageFunction: Function;
  chainheight: number;
  chainheighttime: number;
  getSafeTranslation: Function;
  resendWait = 2000;
  miningFeeMultiplier = 1;


  constructor(address: string, statusMessageFunction: Function, utxoServer: string) {
    //address is the legacy address of the account
    //status message function is a function to call with progress updates
    //utxoServer is server that will send utxo set

    this.utxoPool = new Array();
    this.theAddress = address;
    this.statusMessageFunction = statusMessageFunction;
    this.utxoServer = utxoServer;
    this.chainheight = 0;
    this.chainheighttime = 0;
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
      total = total + this.utxoPool[i].getSatsWithInterest(chainheight2 + 1);
    }
    return total;
  }

  refreshPool() {

    let outputInfo = new Array();

    (async () => {

      const response = await fetch(this.utxoServer + this.theAddress);
      outputInfo = await response.json();

      let utxos = outputInfo;
      let utxosOriginalNumber = outputInfo.length;

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
      }

      //Remove any utxos with less or equal to dust limit, they may be SLP tokens
      for (let i = 0; i < utxos.length; i++) {
        if (utxos[i].satoshis <= this.DUSTLIMIT) {
          utxos.splice(i, 1);
          i--;
        }
      }
      let usableUTXOScount = utxos.length;
      this.updateStatus(utxosOriginalNumber + this.getSafeTranslation('utxosreceived', " utxo(s) received. usable") + ' ' + usableUTXOScount);
      this.utxoPool = utxos;
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
  queue: Array<TransactionData>;
  isSending: boolean; //Sending from the queue
  transactionInProgress: boolean; //Transaction sending, not necessarily from queue
  privateKey: string;
  broadcastServer: string;
  keyPair: any;
  BitcoinJS: any;

  constructor(address: string, statusMessageFunction: Function, utxoServer: string, BitcoinJS: any, privateKey: string, broadcastServer: string) {
    super(address, statusMessageFunction, utxoServer);
    this.BitcoinJS = BitcoinJS;
    this.queue = new Array();
    this.isSending = false; //Sending from the queue
    this.transactionInProgress = false; //Transaction sending, not necessarily from queue
    this.privateKey = privateKey;
    this.broadcastServer = broadcastServer;
    if (this.privateKey) {
      this.keyPair = this.BitcoinJS.ECPair.fromWIF(this.privateKey);
    }
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
    let toAddress = '';
    let toAmount = 0;
    try {
      toAmount = transaction.cash.to.value;
      toAddress = transaction.cash.to.address;
    } catch (err) {
      //usually no recipient, send change to self.
    }
    let data = transaction.data;
    this.queue.push(new TransactionData(toAddress, toAmount, data, onSuccessFunction));
    this.sendNextTransaction();
  }

  sendNextTransaction() {
    //If the queue has run out of transactions
    if (this.queue.length == 0) {
      this.isSending = false;
      return;
    }

    //If the queue is already sending
    if (this.isSending) {
      return;
    }

    //else
    this.isSending = true;
    this.memberBoxSend(this.queue[0], this.serverResponseFunction);

  }

  async serverResponseFunction(HOSTILEerr, res, returnObject: TransactionQueue) {
    //Possibly error message could have hostile code - must sanitize it

    returnObject.isSending = false;
    if (HOSTILEerr) {
      let errcode = "";
      let errmessage = "";
      try {
        errcode = this.sane(HOSTILEerr.code);
        errmessage = this.sane(HOSTILEerr.message);
      } catch (noerr) {
        //usually no err
      }
      console.log(errcode + " " + errmessage);
      let errorMessage = errmessage;
      returnObject.updateStatus(this.getSafeTranslation('error', "Error:") + errcode + " " + errorMessage);
      if (errorMessage === undefined) {
        errorMessage = this.getSafeTranslation('networkerror', "Network Error");
      }

      if (errorMessage.startsWith("64")) {
        //Error:64: 
        //May mean not enough mining fee was provided or chained trx limit reached 
        returnObject.updateStatus(errorMessage + " (" + returnObject.queue.length + " " + this.getSafeTranslation('transactionstillqueued', "Transaction(s) Still Queued. Waiting for new block, Retry in 60 seconds)"));
        await this.sleep(60000);
        returnObject.updateStatus(this.getSafeTranslation('sending again', "Sending Again . . ."));
        await this.sleep(1000);
        returnObject.sendNextTransaction();
        return;
      }

      if (errorMessage.startsWith("1000")) { //Covers 1000
        //1000 No Private Key
        returnObject.updateStatus(errorMessage + " " + this.getSafeTranslation('removefromqueue', "Removing Transaction From Queue."));
        //returnObject.onSuccessFunctionQueue.shift();
        returnObject.queue.shift();
        returnObject.sendNextTransaction();
        return;
      }

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

      returnObject.updateStatus(errorMessage + " " + returnObject.queue.length + this.getSafeTranslation('stillqueued', " Transaction(s) Still Queued, Try changing UTXO server on settings page. Retry in (seconds)") + " " + (this.resendWait / 1000));
      await this.sleep(this.resendWait);
      this.resendWait = this.resendWait * 1.5;
      try {
        //Try refreshing the utxo pool
        //let keyPair = new ECPair().fromWIF(returnObject.queue[0].cash.key);
        let theAddress = this.theAddress;
        returnObject.refreshPool();
      } catch (err) {
        returnObject.updateStatus(err);
        console.log(err);
      }
      await this.sleep(1000);
      returnObject.updateStatus(this.getSafeTranslation('sendingagain', "Sending Again . . ."));
      await this.sleep(1000);
      returnObject.sendNextTransaction();
      return;
      //}
      //alert("There was an error processing the transaction required for this action. Make sure you have sufficient funds in your account and try again. Error:" + errorMessage);
      //return;
    }
    this.resendWait = 2000;
    if (res.length == 64) {
      returnObject.updateStatus("txid:" + this.sane(res));
      //returnObject.updateStatus("<a  rel='noopener noreferrer' target='blockchair' href='https://blockchair.com/bitcoin-cash/transaction/" + san(res) + "'>txid:" + san(res) + "</a>");

      //console.log("https://blockchair.com/bitcoin-cash/transaction/" + res);
      //let successCallback = returnObject.onSuccessFunctionQueue.shift();
      let completedtrx = returnObject.queue.shift();
      if (completedtrx && completedtrx.successFunction) {
        completedtrx.successFunction(res);
      };
      //1 second wait to avoid mem-pool confusion
      await this.sleep(1000);
      returnObject.sendNextTransaction();
    } else {
      returnObject.updateStatus(res);
    }
  }

  async memberBoxSend(txdata: TransactionData, callback: Function) {

    if (!this.privateKey) {
      callback(new Error(this.getSafeTranslation('noprivatekey', "1000:No Private Key, Cannot Make Transaction")), null, this);
      return;
    }

    try {
      this.transactionInProgress = true;

      //Choose the UTXOs to use
      let utxos = this.selectUTXOs();

      //Make the trx and estimate the fees
      let tx = this.constructTransaction(utxos, 0, txdata);
      let transactionSize = tx.byteLength();
      //Add extra satoshis for safety
      console.log("Transaction size:" + transactionSize);
      let fees = Math.round(transactionSize * this.miningFeeMultiplier) + this.extraSatoshis;
      //Make the trx again, with fees included
      tx = this.constructTransaction(utxos, fees, txdata);

      //Send to node
      this.broadcastTransaction(tx, utxos, txdata, callback);

    } catch (HOSTILEerr) {
      this.transactionInProgress = false;
      callback(HOSTILEerr, null, this);
      return;
    }
  }

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

    let transactionBuilder = new this.BitcoinJS.TransactionBuilder();
    if (scriptArray.length > 0) {
      transactionBuilder.addOutput(script2, 0);
    }


    let fundsRemaining = 0;
    //Calculate sum of tx outputs and add inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].getSatsWithInterest(this.chainheight + 1);
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
      if (txdata.toAmount >= this.DUSTLIMIT) {
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
    if (changeAmount >= this.DUSTLIMIT) {
      transactionBuilder.addOutput(changeAddress, changeAmount);
      hasChange = true;
    }

    //Sign inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].satoshis;
      // sign w/ HDNode
      let redeemScript;
      transactionBuilder.sign(i, this.keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);
    }

    // build tx
    let tx = transactionBuilder.build();
    tx.outs[tx.outs.length - 1].isChange = true;
    return tx;

  }

  async broadcastTransaction(tx: any, utxos: Array<UTXO>, txdata: TransactionData, callback: Function) {

    const response = await fetch(this.broadcastServer, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify([tx.toHex()])
    });
    if (!response.ok) {
      this.transactionInProgress = false;
      callback(new Error(this.sane(response.status + " " + response.statusText)), null, this);
      return;
    }
    let result = await response.json();
    if (result.txid) {
      this.updateTransactionPool(utxos, txdata, tx);
      this.transactionInProgress = false;
      callback(null, result.txid, this);
    } else {
      this.transactionInProgress = false;
      callback(new Error(this.sane(response.status + " " + response.statusText)), null, this);
    }
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


