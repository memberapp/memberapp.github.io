"use strict";

const DUSTLIMIT = 546;
const MAXPOSSNUMBEROFINPUTS = 10;
const Buffer = buffer.Buffer;
const BITBOX = bitboxSdk;

//Note, these can be overwritten in config.js
//let utxoServer = "https://rest.bitcoin.com/v2/";
//let txbroadcastServer = "https://rest.bitcoin.com/v2/";

//These are variable
let extraSatoshis = 5;
let miningFeeMultiplier = 1;

//For BCHDRPC
//let trxserver = "bchdgrpc";
//let bchrpcClient = window.bchrpcClient;

class UTXOPool {

  constructor(address, statusMessageFunction, storageObject, onscreenElementName) {
    //This takes legacy address format
    this.theAddress = address;
    this.utxoPool = {};
    this.statusMessageFunction = statusMessageFunction;
    this.storageObject = storageObject;
    this.onscreenElementName = onscreenElementName;

    //Try to retrieve utxopool from localstorage and set balance
    try {
      if (this.storageObject != null) {
        let loadup = JSON.parse(localStorageGet(this.storageObject, "utxopool" + this.theAddress));
        if (loadup != "null" && loadup != null && loadup != "") {
          this.utxoPool = loadup;
          this.updateBalance();
        }
      }
    }
    catch (err) {
      this.statusMessageFunction(err);
    }
  }

  updateStatus(message) {
    console.log(message);
    if (this.statusMessageFunction == null) {
      alert(message);
    } else {
      this.statusMessageFunction(message);
    }
  }

  getUTXOs() {
    //deep copy array
    return Array.from(this.utxoPool);
  }

  removeUTXO(txid, vout) {
    for (let i = 0; i < this.utxoPool.length; i++) {
      if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
        this.utxoPool.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  addUTXO(txid, vout, satoshis) {
    //Ensure it is not already in the pool
    for (let i = 0; i < this.utxoPool.length; i++) {
      if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
        return false;
      }
    }
    this.utxoPool.push({ satoshis: satoshis, vout: vout, txid: txid });
    return true;
  }

  updateBalance() {

    try {
      if (this.storageObject != undefined && this.storageObject != null) {
        localStorageSet(this.storageObject, "utxopool" + this.theAddress, JSON.stringify(this.utxoPool));
      }
    } catch (err) {
    }

    var total = 0;
    for (let i = 0; i < this.utxoPool.length; i++) {
      total = total + this.utxoPool[i].satoshis;
    }

    //var balString=(Math.floor(total/1000)).toLocaleString()+"<span class='sats'>"+(total%1000)+"</span>";
    if (this.onscreenElementName != null) {
      document.getElementById(this.onscreenElementName).innerHTML = balanceString(total, true);


      if (total < 2000) {
        document.getElementById('satoshiamount').innerHTML = total;
        document.getElementById('lowfundswarning').style.display = 'block';
        showQRCode('lowfundsaddress', 100);
      } else {
        document.getElementById('lowfundswarning').style.display = 'none';
      }
    }


  }

  refreshPool() {

    let outputInfo = new Array();

    //Create Keypair
    //const ECPair = BITBOX.ECPair;
    //let keyPair = new ECPair().fromWIF(options.cash.key);
    //let thePublicKey = keyPair.getAddress();// BITBOX.ECPair.toLegacyAddress(keyPair);
    //
    //



    //Get the cashAddr format
    //const Address2 = bch.Address;
    //let thePublicKeyQFormat = new Address2(this.theAddress).toString(bch.Address.CashAddrFormat);
    let thePublicKeyQFormat = new BITBOX.Address().toCashAddress(this.theAddress);

    const Address = BITBOX.Address;
    let address = new Address();
    address.restURL = dropdowns.utxoserver;

    (async () => {
      outputInfo = await address.utxo(thePublicKeyQFormat);


      //console.log(outputInfo);
      let utxos = outputInfo.utxos;
      let utxosOriginalNumber = outputInfo.utxos.length;

      //Check no unexpected data in the fields we care about
      for (let i = 0; i < utxos.length; i++) {
        utxos[i].satoshis = Number(utxos[i].satoshis);
        utxos[i].vout = Number(utxos[i].vout);
        utxos[i].txid = sanitizeAlphanumeric(utxos[i].txid);
      }

      //Remove any utxos with less or equal to dust limit, they may be SLP tokens
      for (let i = 0; i < utxos.length; i++) {
        if (utxos[i].satoshis <= DUSTLIMIT) {
          utxos.splice(i, 1);
          i--;
        }
      }
      let usableUTXOScount = utxos.length;
      this.updateStatus("Received " + utxosOriginalNumber + " utxo(s) of which " + usableUTXOScount + " are usable.");
      this.utxoPool = utxos;
      this.updateBalance();
    })();
  }
}

class TransactionQueue {

  // compose script
  _script(opcode, options) {
    var s = [];
    if (options.data) {
      if (Array.isArray(options.data)) {
        // Add op_return
        s.push(opcode);
        options.data.forEach(function (item) {
          // add push data

          if (/^0x/i.test(item)) {
            // ex: 0x6d02
            s.push(Buffer.from(item.slice(2), "hex"))
          } else {
            // ex: "hello"
            s.push(Buffer.from(item))
          }
        })
      } else if (typeof options.data === 'string') {
        // Exported transaction 
        s = [options.data];
      }
    }
    return s;
  }

  constructor(statusMessageFunction) {
    this.queue = new Array();
    this.spentUTXO = {};
    this.onSuccessFunctionQueue = new Array();
    this.isSending = false; //Sending from the queue
    this.statusMessageFunction = statusMessageFunction;
    this.transactionInProgress = false; //Transaction sending, not necessarily from queue
    this.utxopools = {};
  }

  addUTXOPool(address, storageObject, onscreenElementName) {
    this.utxopools[address] = new UTXOPool(address, this.statusMessageFunction, storageObject, onscreenElementName);
    //This is used to display this UTXOPool balance on screen
    /*if(onscreenElementName!=null){
      this.utxopools[address].onscreenElementName=onscreenElementName;
    }*/
    try {
      this.utxopools[address].refreshPool();
    } catch (err) {
      this.statusMessageFunction(err);
    }
  }

  isTransactionInProgress() {
    if (this.transactionInProgress || this.queue.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  queueTransaction(transaction, onSuccessFunction) {
    this.queue.push(transaction);
    this.onSuccessFunctionQueue.push(onSuccessFunction);
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

  updateStatus(message) {
    console.log(message);
    if (this.statusMessageFunction == null) {
      alert(message);
    } else {
      this.statusMessageFunction(message);
    }
  }

  async serverResponseFunction(err, res, returnObject) {

    returnObject.isSending = false;
    if (err) {
      console.log(err);
      let errorMessage = err.message;
      returnObject.updateStatus("Error:" + errorMessage);
      if (errorMessage === undefined) {
        errorMessage = "Network Error";
      }

      if (errorMessage.startsWith("64")) {
        //Error:258: txn-mempool-conflict 
        returnObject.updateStatus(errorMessage + " (" + returnObject.queue.length + " .Transaction(s) Still Queued. Waiting for new block, Retry in 60 seconds)");
        await sleep(60000);
        returnObject.updateStatus("Sending Again . . .");
        await sleep(1000);
        returnObject.sendNextTransaction();
        return;
      }

      if (errorMessage.startsWith("1001")) {
        //1001 No UTXOs 
        returnObject.updateStatus(errorMessage + " (" + returnObject.queue.length + " .Transaction(s) Still Queued. Retry in 60 seconds)");
        await sleep(60000);
        returnObject.updateStatus("Sending Again . . .");
        await sleep(1000);
        returnObject.sendNextTransaction();
        return;
      }


      if (errorMessage.startsWith("Network Error") || errorMessage.startsWith("258") || errorMessage.startsWith("200")) { //covers 2000, 2001
        //Error:258: txn-mempool-conflict 
        //2000, all fetched UTXOs already spend
        //2001, insuffiencent funds from unspent UTXOs. Add funds
        returnObject.updateStatus(errorMessage + " (" + returnObject.queue.length + " Transaction(s) Still Queued, Retry in 5 seconds)");
        await sleep(4000);
        returnObject.updateStatus("Sending Again . . .");
        await sleep(1000);
        returnObject.sendNextTransaction();
        return;
      }

      if (errorMessage.startsWith("1000")) { //Covers 1000
        //1000 No Private Key
        returnObject.updateStatus(errorMessage + " Removing Transaction From Queue.");
        returnObject.onSuccessFunctionQueue.shift();
        returnObject.queue.shift();
        returnObject.sendNextTransaction();
        return;
      }

      if (errorMessage.startsWith("66")) {
        if (miningFeeMultiplier < maxfee) {
          //Insufficient Priority - not enough transaction fee provided. Let's try increasing fee.
          miningFeeMultiplier = miningFeeMultiplier * 1.1;
          returnObject.updateStatus("Error: Transaction rejected because fee too low. Increasing and retrying. Surge Pricing now " + Math.round(miningFeeMultiplier * 10) / 10);
          await sleep(1000);
          returnObject.sendNextTransaction();
          return;
        }
      }
      alert("There was an error processing the transaction required for this action. Make sure you have sufficient funds in your account and try again. Error:" + errorMessage);
      return;
    }

    if (res.length > 10) {
      returnObject.updateStatus("<a  rel='noopener noreferrer' target='blockchair' href='https://blockchair.com/bitcoin-cash/transaction/" + res + "'>txid:" + res + "</a>");
      //console.log("https://blockchair.com/bitcoin-cash/transaction/" + res);
      let successCallback = returnObject.onSuccessFunctionQueue.shift();
      returnObject.queue.shift();
      if (successCallback) {
        successCallback(res)
      };
      //1 second wait to avoid mem-pool confusion
      await sleep(1000);
      returnObject.sendNextTransaction();
    } else {
      returnObject.updateStatus(res);
    }
  }

  async memberBoxSend(options, callback, returnObject) {

    if (!options.cash || !options.cash.key) {
      callback(new Error("1000:No Private Key, Cannot Make Transaction"), null, this);
      return;
    }

    try {
      this.transactionInProgress = true;

      //Choose the UTXOs to use
      let utxos = this.selectUTXOs(options);

      //Make the trx and estimate the fees
      let tx = this.constructTransaction(utxos, 0, options);
      let transactionSize = tx.byteLength();
      //Add extra satoshis for safety
      let fees = Math.round(transactionSize * miningFeeMultiplier) + extraSatoshis;
      //Make the trx again, with fees included
      tx = this.constructTransaction(utxos, fees, options);

      //Send to node
      this.broadcastTransaction(tx, utxos, options, callback);

    } catch (err) {
      this.transactionInProgress = false;
      callback(err, null, this);
      return;
    }
  }

  selectUTXOs(options) {
    // return new Promise(resolve => {
    /*const ECPair = BITBOX.ECPair;
    const Address = BITBOX.Address;

    //Create Keypair
    let keyPair = new ECPair().fromWIF(options.cash.key);
    let thePublicKey = keyPair.getAddress();// BITBOX.ECPair.toLegacyAddress(keyPair);
    const Address2 = bch.Address;
    let thePublicKeyQFormat = new Address2(thePublicKey).toString(bch.Address.CashAddrFormat);

    let outputInfo = new Array();
    let address = new Address();*/

    //(async () => {
    //address.restURL = utxoServer;
    //outputInfo = await address.utxo(thePublicKeyQFormat);
    const ECPair = BITBOX.ECPair;
    let keyPair = new ECPair().fromWIF(options.cash.key);
    let theAddress = keyPair.getAddress();

    //If we're not maintaining a utxopool, create one
    if (this.utxopools[theAddress] == null) {
      //This makes a server request so may take some time to return
      this.addUTXOPool(theAddress);
    }

    let utxos = this.utxopools[theAddress].getUTXOs();

    /*
    //console.log(outputInfo);
    //let utxos = outputInfo.utxos;
    let utxosOriginalNumber = utxos.length;

    //Check no unexpected data in the fields we care about
    for (let i = 0; i < utxos.length; i++) {
      utxos[i].satoshis = Number(utxos[i].satoshis);
      utxos[i].vout = Number(utxos[i].vout);
      utxos[i].txid = sanitizeAlphanumeric(utxos[i].txid);
    }

    //Remove any utxos with less or equal to dust limit, they may be SLP tokens
    for (let i = 0; i < utxos.length; i++) {
      if (utxos[i].satoshis <= DUSTLIMIT) {
        utxos.splice(i, 1);
        i--;
      }
    }
*/
    if (utxos.length == 0) {
      throw new Error("1001:Insufficient Funds (No Suitable UTXOs)");
    }

    let usableUTXOScount = utxos.length;


    //Max size of a standard transaction is expected to be around 424 bytes - 1 input, 1 OP 220 bytes, 1 change output
    //So in most cases, one single input should be enough to cover it
    //Add 546 to try to ensure change, so none is lost due to dust limit
    var ballparkAmountRequired = 450 * miningFeeMultiplier + 546;

    //Add any larger outputs like tips etc
    if (options.cash.to && Array.isArray(options.cash.to)) {
      options.cash.to.forEach(
        function (receiver) {
          if (receiver.value >= DUSTLIMIT) {
            ballparkAmountRequired = ballparkAmountRequired + receiver.value;
          }
        })
    }

    //Choose UTXOs at random until we have more than our ballpark figure
    let totalUseUtxos = 0;
    let useUtxos = new Array();
    while (totalUseUtxos < ballparkAmountRequired && utxos.length > 0) {
      let randomUTXOindex = Math.floor(Math.random() * utxos.length);
      //Check we haven't already spent this utxo
      if (!this.spentUTXO[utxos[randomUTXOindex].txid + utxos[randomUTXOindex].vout] == 1) {
        totalUseUtxos = totalUseUtxos + utxos[randomUTXOindex].satoshis;
        useUtxos.push(utxos[randomUTXOindex]);
      }
      utxos.splice(randomUTXOindex, 1);
    }
    //If we exit here because utxo.length is 0, we're trying sending with all the utxos even though our ballpark figure hasn't been reached
    utxos = useUtxos;
    this.updateStatus("Pool has " + usableUTXOScount + " utxo(s). Using " + utxos.length);
    if (utxos.length == 0) {
      throw new Error("2000:All UTXOs are already spent");
    }

    return utxos;

    //        resolve(utxos);
    //      })()
    //    });

  }



  constructTransaction(utxos, fees, options) {

    const TransactionBuilder = BITBOX.TransactionBuilder;
    const Script = BITBOX.Script;

    const ECPair = BITBOX.ECPair;
    let keyPair = new ECPair().fromWIF(options.cash.key);
    let changeAddress = keyPair.getAddress();

    //let keyPair = new ECPair().fromWIF(options.cash.key);
    //let thePublicKey = keyPair.getAddress();// BITBOX.ECPair.toLegacyAddress(keyPair);

    //let maxNumberOfInputs = utxos.length < MAXPOSSNUMBEROFINPUTS ? utxos.length : MAXPOSSNUMBEROFINPUTS;


    let script = new Script();
    let scriptArray = this._script(script.opcodes.OP_RETURN, options);
    let script2 = script.encode(scriptArray);
    //[script.opcodes.OP_RETURN, Buffer.from(options.data[0], 'hex'), Buffer.from(options.data[1])]);



    //ESTIMATE TRX FEE REQUIRED
    let changeAmount = 0;

    let transactionBuilder = new TransactionBuilder();
    if (scriptArray.length > 0) {
      transactionBuilder.addOutput(script2, 0);
    }


    let fundsRemaining = 0;
    //Calculate sum of tx outputs and add inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].satoshis;
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

    //Add any transactions
    if (options.cash.to && Array.isArray(options.cash.to)) {
      options.cash.to.forEach(
        function (receiver) {
          if (receiver.value >= DUSTLIMIT) {
            fundsRemaining = fundsRemaining - receiver.value;
            transactionOutputTotal += receiver.value;
            transactionBuilder.addOutput(receiver.address, receiver.value);
          }
        })
    }

    changeAmount = fundsRemaining - fees;

    if (changeAmount < 0) {
      throw new Error("2001: Insufficient Funds. Amount available " + utxoFunds + " in " + utxos.length + " UTXOs but " + (transactionOutputTotal + fees) + " required. Add Funds.");
    }

    var hasChange = false;
    //Add funds remaining as change if larger than dust
    if (changeAmount >= DUSTLIMIT) {
      transactionBuilder.addOutput(changeAddress, changeAmount);
      hasChange = true;
    }

    //Sign inputs
    for (let i = 0; i < utxos.length; i++) {
      let originalAmount = utxos[i].satoshis;
      // sign w/ HDNode
      let redeemScript;
      transactionBuilder.sign(i, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);
    }

    // build tx
    let tx = transactionBuilder.build();
    tx.outs[tx.outs.length - 1].isChange = true;
    return tx;

  }

  broadcastTransaction(tx, utxos, options, callback) {

    let hex = tx.toHex();
    let hash = tx.getHash().toString('hex');
    let id = tx.getId();

    const RawTransactions = BITBOX.RawTransactions;
    let rawtransactions = new RawTransactions();
    rawtransactions.restURL = dropdowns.txbroadcastserver;
    rawtransactions.sendRawTransaction(hex).then((result) => {
      this.updateTransactionPool(utxos, options, tx);
      this.transactionInProgress = false;
      //Remove unexpected input in result
      result = sanitizeAlphanumeric(result);
      callback(null, result, this);
    }, (err) => {
      //console.log(err);
      this.transactionInProgress = false;
      //Remove unexpected input in error message
      err.message = sanitizeAlphanumeric(err.error);
      if (err.message === undefined || err.message == "") {
        err.message = "Network Error";
      }
      callback(err, null, this);
    });
  }

  updateTransactionPool(utxos, options, tx) {
    const ECPair = BITBOX.ECPair;
    let keyPair = new ECPair().fromWIF(options.cash.key);
    let changeAddress = keyPair.getAddress();

    let theUTXOPool = this.utxopools[changeAddress];
    for (let i = 0; i < utxos.length; i++) {
      //Mark the utxos as spent, to ensure we don't accidentally try to double spend them
      this.spentUTXO[utxos[i].txid + utxos[i].vout] = 1;
      //Remove the utxos from the utxo pool
      theUTXOPool.removeUTXO(utxos[i].txid, utxos[i].vout);
    }

    //Add new utxos.
    //Note, this only deals with the change amount. If the member has send a different utxo to himself, it won't be added. 
    for (let i = 0; i < tx.outs.length; i++) {
      if (tx.outs[i].isChange == true) {
        theUTXOPool.addUTXO(tx.getId(), i, tx.outs[i].value);
      }
    }
    theUTXOPool.updateBalance();


  }

}


