"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var UTXO = /** @class */ (function () {
    function UTXO(satoshis, vout, txid, height) {
        this.satoshis = satoshis;
        this.vout = vout;
        this.txid = txid;
        this.height = height;
    }
    UTXO.prototype.getSatsWithInterest = function (chainheight) {
        if (this.height == 0 || !this.height) { //not in blockchain yet. unconfirmed, no interest earned yet
            return this.satoshis;
        }
        if (!chainheight) { //we don't know chainheight - we must or we may lose interest
            throw Error('Chainheight not found - we must know this or may lose interest');
        }
        //Interest rate on each block 1+(1/2^22)
        var blocksheld = chainheight - this.height;
        var withInterest = this.satoshis * Math.pow(1 + (1 / Math.pow(2, 22)), blocksheld);
        return Math.floor(withInterest);
    };
    return UTXO;
}());
var UTXOPool = /** @class */ (function () {
    function UTXOPool(address, utxoServer, statusMessageFunction, translationFunction, updateBalanceFunction, fetchFunction) {
        //address is the legacy address of the account
        //utxoServer is server that will send utxo set
        //status message function is a function to call with progress updates
        //translation function will return localized string for identifier
        //updateBalanceFunction will be called when the pool refreshes and may have different utxos
        this.DUSTLIMIT = 546;
        this.extraSatoshis = 5;
        this.maxfee = 5;
        this.resendWait = 2000;
        this.miningFeeMultiplier = 1;
        this.utxoPool = new Array();
        this.theAddress = address;
        this.utxoServer = utxoServer;
        this.chainheight = 0;
        this.chainheighttime = 0;
        this.statusMessageFunction = statusMessageFunction;
        this.translationFunction = translationFunction;
        this.updateBalanceFunction = updateBalanceFunction;
        this.fetchFunction = fetchFunction;
    }
    UTXOPool.prototype.getSafeTranslation = function (id, defaultstring) {
        if (this.translationFunction) {
            return this.translationFunction(id, defaultstring);
        }
        else {
            return defaultstring;
        }
    };
    UTXOPool.prototype.setUTXOServer = function (utxoServer) {
        this.utxoServer = utxoServer;
    };
    UTXOPool.prototype.updateStatus = function (message) {
        console.log(message);
        if (this.statusMessageFunction) {
            this.statusMessageFunction(message);
        }
        else {
            alert(message);
        }
    };
    //Return a copy of the array of utxo
    UTXOPool.prototype.getUTXOs = function () {
        return Array.from(this.utxoPool);
    };
    //Remove a specific utxo
    UTXOPool.prototype.removeUTXO = function (txid, vout) {
        for (var i = 0; i < this.utxoPool.length; i++) {
            if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
                this.utxoPool.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    //Add a utxo to the array
    UTXOPool.prototype.addUTXO = function (txid, vout, satoshis, height) {
        //Ensure it is not already in the pool
        for (var i = 0; i < this.utxoPool.length; i++) {
            if (this.utxoPool[i].txid == txid && this.utxoPool[i].vout == vout) {
                return false;
            }
        }
        this.utxoPool.push(new UTXO(satoshis, vout, txid, height));
        return true;
    };
    //Get the balance of the array of utxos at a specific chain height
    UTXOPool.prototype.getBalance = function (chainheight2) {
        var total = 0;
        for (var i = 0; i < this.utxoPool.length; i++) {
            total = total + this.utxoPool[i].getSatsWithInterest(chainheight2 + 1);
        }
        return total;
    };
    UTXOPool.prototype.refreshPool = function () {
        var _this = this;
        var outputInfo = new Array();
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var response, utxos, utxosOriginalNumber, i, usableUTXOScount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.fetchFunction) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchFunction(this.utxoServer + this.theAddress)];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, fetch(this.utxoServer + this.theAddress)];
                    case 3:
                        response = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        outputInfo = _a.sent();
                        utxos = outputInfo;
                        utxosOriginalNumber = outputInfo.length;
                        this.utxoPool = new Array();
                        //Check no unexpected data in the fields we care about
                        for (i = 0; i < utxos.length; i++) {
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
                            if (utxos[i].satoshis > this.DUSTLIMIT) {
                                //Remove any utxos with less or equal to dust limit, they may be SLP tokens
                                this.utxoPool.push(new UTXO(utxos[i].satoshis, utxos[i].vout, utxos[i].txid, utxos[i].height));
                            }
                        }
                        usableUTXOScount = this.utxoPool.length;
                        this.updateStatus(utxosOriginalNumber + this.getSafeTranslation('utxosreceived', " utxo(s) received. usable") + ' ' + usableUTXOScount);
                        if (this.updateBalanceFunction) {
                            this.updateBalanceFunction(this.chainheight, this.chainheighttime);
                        }
                        return [2 /*return*/, this.getBalance(this.chainheight)];
                }
            });
        }); })();
    };
    UTXOPool.prototype.sane = function (input) {
        if (input === undefined || input == null) {
            return "";
        }
        input = input + "";
        return input.replace(/[^A-Za-z0-9\-_\.]/g, '');
    };
    return UTXOPool;
}());
var TransactionData = /** @class */ (function () {
    function TransactionData(to, toAmount, data, successFunction) {
        this.to = to;
        this.toAmount = toAmount;
        this.data = data;
        this.successFunction = successFunction;
    }
    return TransactionData;
}());
var TransactionQueue = /** @class */ (function (_super) {
    __extends(TransactionQueue, _super);
    function TransactionQueue(address, privateKey, utxoServer, statusMessageFunction, translationFunction, updateBalanceFunction, fetchFunction, BitcoinJS, broadcastServer) {
        var _this = _super.call(this, address, utxoServer, statusMessageFunction, translationFunction, updateBalanceFunction, fetchFunction) || this;
        _this.OP_RETURN = 106;
        _this.SIGHASH_BITCOINCASHBIP143 = 0x40;
        _this.SIGHASH_ALL = 0x01;
        _this.BCH_SIGHASH_ALL = _this.SIGHASH_ALL | _this.SIGHASH_BITCOINCASHBIP143;
        _this.BitcoinJS = BitcoinJS;
        _this.queue = new Array();
        _this.isSending = false; //Sending from the queue
        _this.transactionInProgress = false; //Transaction sending, not necessarily from queue
        _this.privateKey = privateKey;
        _this.broadcastServer = broadcastServer;
        if (_this.privateKey) {
            _this.keyPair = _this.BitcoinJS.ECPair.fromWIF(_this.privateKey);
        }
        var transactionBuilder = new _this.BitcoinJS.TransactionBuilder();
        _this.transactionsPossible = transactionBuilder.enableBitcoinCash;
        return _this;
    }
    TransactionQueue.prototype.setbroadcastServer = function (broadcastServer) {
        this.broadcastServer = broadcastServer;
    };
    // compose script
    TransactionQueue.prototype._script = function (opcode, pushdata) {
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
                    }
                    else {
                        // ex: "hello"
                        s.push(Buffer.from(item));
                    }
                });
            }
        }
        return s;
    };
    TransactionQueue.prototype.isTransactionInProgress = function () {
        if (this.transactionInProgress || this.queue.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    TransactionQueue.prototype.queueTransaction = function (transaction, onSuccessFunction) {
        if (!this.transactionsPossible) {
            return 'Bitcoin Cash Style Transactions Not Possible with this bitcoin library';
        }
        var toAddress = '';
        var toAmount = 0;
        try {
            toAmount = transaction.cash.to[0].value;
            toAddress = transaction.cash.to[0].address;
        }
        catch (err) {
            //usually no recipient, send change to self.
        }
        var data = transaction.data;
        this.queue.push(new TransactionData(toAddress, toAmount, data, onSuccessFunction));
        this.sendNextTransaction();
        return 'Sent';
    };
    TransactionQueue.prototype.sendNextTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, txdata, utxos, tx, transactionSize, fees, err_1, resulttxid, resptext, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.privateKey) {
                            throw new Error(this.getSafeTranslation('noprivatekey', "1000:No Private Key, Cannot Make Transaction"));
                        }
                        /*if(this.utxoPool.length==0){
                          await this.refreshPool();
                        }*/
                        //If the queue is already sending
                        if (this.transactionInProgress) {
                            return [2 /*return*/];
                        }
                        else if (this.queue.length == 0) {
                            //If the queue has run out of transactions
                            return [2 /*return*/];
                        }
                        else {
                            this.transactionInProgress = true;
                        }
                        _a.label = 1;
                    case 1:
                        response = void 0;
                        txdata = void 0;
                        utxos = void 0;
                        tx = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        //Use the first transaction from the queue. Leave it on the queue until it is successfully sent
                        txdata = this.queue[0];
                        //Choose the UTXOs to use
                        utxos = this.selectUTXOs();
                        //Make the trx and estimate the fees
                        tx = this.constructTransaction(utxos, 0, txdata);
                        transactionSize = tx.byteLength();
                        //Add extra satoshis for safety
                        console.log("Transaction size:" + transactionSize);
                        fees = Math.round(transactionSize * this.miningFeeMultiplier) + this.extraSatoshis;
                        //Make the trx again, with fees included
                        tx = this.constructTransaction(utxos, fees, txdata);
                        if (!this.fetchFunction) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchFunction(this.broadcastServer, {
                                method: 'POST',
                                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                body: JSON.stringify({ hexes: [tx.toHex()] })
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, fetch(this.broadcastServer, {
                            method: 'POST',
                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                            body: JSON.stringify({ hexes: [tx.toHex()] })
                        })];
                    case 5:
                        response = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 8];
                    case 8:
                        if (!(response && response.ok)) return [3 /*break*/, 13];
                        resulttxid = void 0;
                        resptext = void 0;
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, response.text()];
                    case 10:
                        resptext = _a.sent();
                        resulttxid = this.sane(resptext);
                        return [3 /*break*/, 12];
                    case 11:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 12];
                    case 12:
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
                            return [3 /*break*/, 16];
                        }
                        //otherwise failure of some kind
                        this.updateStatus(this.sane(response.ok) + " " + this.sane(response.status) + " " + this.sane(response.statusText) + " " + this.sane(resptext));
                        _a.label = 13;
                    case 13:
                        //TODO - should look for specific errors here and take appropriate action rather than just refreshing pool and sending again.
                        //Try refreshing the utxo pool
                        this.refreshPool();
                        return [4 /*yield*/, this.sleep(this.resendWait)];
                    case 14:
                        _a.sent();
                        this.resendWait = this.resendWait * 1.5;
                        this.updateStatus(this.queue.length + this.getSafeTranslation('stillqueued', " Transaction(s) Still Queued, Try changing UTXO server on settings page. Retry in (seconds)") + " " + (this.resendWait / 1000));
                        this.sleep(1000);
                        this.updateStatus(this.getSafeTranslation('sendingagain', "Sending Again . . ."));
                        _a.label = 15;
                    case 15: return [3 /*break*/, 1];
                    case 16:
                        //Send the next transaction after a short pause
                        this.sleep(1000);
                        if (this.queue.length > 0) {
                            this.sendNextTransaction();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
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
    TransactionQueue.prototype.selectUTXOs = function () {
        var utxos = this.getUTXOs();
        if (utxos.length == 0) {
            throw new Error(this.getSafeTranslation('insufficientfunds', "1001:Insufficient Funds (No Suitable UTXOs)"));
        }
        return utxos;
    };
    TransactionQueue.prototype.constructTransaction = function (utxos, fees, txdata) {
        var changeAddress = this.theAddress;
        var scriptArray = this._script(this.OP_RETURN, txdata.data);
        var arr = new Array();
        scriptArray.forEach(function (chunk) { arr.push(chunk); });
        var script2 = this.BitcoinJS.script.compile(arr);
        //ESTIMATE TRX FEE REQUIRED
        var changeAmount = 0;
        //let txnBuilder = new bchlib.TransactionBuilder(bchlib.networks.bitcoincash);
        //txnBuilder.enableBitcoinCash(true);
        var transactionBuilder = new this.BitcoinJS.TransactionBuilder();
        transactionBuilder.enableBitcoinCash(true);
        //let transactionBuilder = new this.BitcoinJS.bitgo.createTransactionBuilderForNetwork(this.BitcoinJS.networks.bitcoincash);
        if (scriptArray.length > 0) {
            transactionBuilder.addOutput(script2, 0);
        }
        var fundsRemaining = 0;
        //Calculate sum of tx outputs and add inputs
        for (var i = 0; i < utxos.length; i++) {
            var originalAmount = utxos[i].getSatsWithInterest(this.chainheight + 1);
            fundsRemaining = fundsRemaining + originalAmount;
            // index of vout
            var vout = utxos[i].vout;
            // txid of vout
            var txid = utxos[i].txid;
            // add input with txid and index of vout
            transactionBuilder.addInput(txid, vout);
        }
        var utxoFunds = fundsRemaining;
        var transactionOutputTotal = 0;
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
        for (var i = 0; i < utxos.length; i++) {
            var originalAmount = utxos[i].satoshis;
            // sign w/ HDNode
            var redeemScript = void 0;
            transactionBuilder.sign(i, this.keyPair, redeemScript, this.BCH_SIGHASH_ALL, originalAmount, null);
            //, originalAmount, null, 0
        }
        //transactionBuilder.sign(0, this.keyPair);
        // build tx
        var tx = transactionBuilder.build();
        tx.outs[tx.outs.length - 1].isChange = true;
        return tx;
    };
    TransactionQueue.prototype.updateTransactionPool = function (utxos, txdata, tx) {
        for (var i = 0; i < utxos.length; i++) {
            //Remove the utxos from the utxo pool
            this.removeUTXO(utxos[i].txid, utxos[i].vout);
        }
        //Add new utxos.
        //Note, this only deals with the change amount. If the member has send a different utxo to himself, it won't be added. 
        for (var i = 0; i < tx.outs.length; i++) {
            if (tx.outs[i].isChange == true) {
                this.addUTXO(tx.getId(), i, tx.outs[i].value, this.chainheight + 1);
            }
        }
        //this.updateBalance(chainheight);
    };
    TransactionQueue.prototype.sleep = function (time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
    };
    return TransactionQueue;
}(UTXOPool));
module.exports = TransactionQueue;
