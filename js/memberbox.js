
// compose script
let DUSTLIMIT=546;
const Buffer = buffer.Buffer;
const BITBOX = bitboxSdk;

var _script = function(opcode, options) {
    var s = [];
    if (options.data) {
      if (Array.isArray(options.data)) {
        // Add op_return
        s.push(opcode);
        options.data.forEach(function(item) {
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
        //s = bch.Script.fromHex(options.data);
        s = [options.data];
      }
    }
    return s;
  }


function MemberBoxSend(options, callback) {

    if (!options.cash || !options.cash.key) {
        throw Error("No Private Key, Cannot Make Transaction");
    }

    
    const Address = BITBOX.Address;
    const ECPair = BITBOX.ECPair;
    const TransactionBuilder = BITBOX.TransactionBuilder;
    const Script = BITBOX.Script;
    const RawTransactions = BITBOX.RawTransactions;


    //Create Keypair
    let keyPair = new ECPair().fromWIF(options.cash.key);
    let thePublicKey = keyPair.getAddress();// BITBOX.ECPair.toLegacyAddress(keyPair);

    let totalAmount = 0;
    //Get Unspent Transactions
    (async () => {
        //try {
        let address = new Address();
        let outputInfo = await address.utxo(thePublicKey);
        console.log(outputInfo);
        utxos = outputInfo.utxos;
        if(utxos.length==0){
          throw Error("Insufficient Funds (No UTXOs)");
        }
        
        let script = new Script();
        let scriptArray=_script(script.opcodes.OP_RETURN, options);
        let script2 = script.encode(scriptArray); 
            //[script.opcodes.OP_RETURN, Buffer.from(options.data[0], 'hex'), Buffer.from(options.data[1])]);

        //ESTIMATE TRX FEE REQUIRED
        let changeAmount = 0;
        {
            let transactionBuilder = new TransactionBuilder();
            if(scriptArray.length>0){
              transactionBuilder.addOutput(script2, 0);
            }
            
            //Calculate sum of tx outputs and add inputs
            for (let i = 0; i < utxos.length; i++) {
                let originalAmount = utxos[i].satoshis;
                totalAmount = totalAmount + originalAmount;
                // index of vout
                let vout = utxos[i].vout;
                // txid of vout
                let txid = utxos[i].txid;
                // add input with txid and index of vout
                transactionBuilder.addInput(txid, vout);
            }

            //Add any transactions
            if (options.cash.to && Array.isArray(options.cash.to)) {
                options.cash.to.forEach(
                    function(receiver) {
                        if(receiver.value>=DUSTLIMIT){
                            totalAmount = totalAmount - receiver.value;
                            transactionBuilder.addOutput(receiver.address, receiver.value);
                        }
                })
              }

            //Add total amount output as change, before trx fee considered
            if(totalAmount>=DUSTLIMIT){
                transactionBuilder.addOutput(thePublicKey, totalAmount);
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
            // output rawhex
            let hex = tx.toHex();
            console.log(tx.byteLength());
            //Minus additional 5 satoshi for safety
            changeAmount = totalAmount - tx.byteLength() - 5;
            console.log(tx.byteLength());
            console.log("Fees:"+(totalAmount-changeAmount));
            
            console.log(changeAmount);

            if(changeAmount<0){
              throw Error("Insufficient Funds (No UTXOs)");
            }
        }

        //CONSTRUCT REAL TRANSACTION
        transactionBuilder = new TransactionBuilder();
        if(scriptArray.length>0){
          transactionBuilder.addOutput(script2, 0);
        }
        if(changeAmount>=DUSTLIMIT){
            transactionBuilder.addOutput(thePublicKey, changeAmount);
        }

        //Add any transactions
        if (options.cash.to && Array.isArray(options.cash.to)) {
          options.cash.to.forEach(
              function(receiver) {
                  if(receiver.value>=DUSTLIMIT){
                      transactionBuilder.addOutput(receiver.address, receiver.value);
                  }
          })
        }

        //Add inputs
        for (let i = 0; i < utxos.length; i++) {
            originalAmount = utxos[i].satoshis;
            // index of vout
            let vout = utxos[i].vout;
            // txid of vout
            let txid = utxos[i].txid;
            // add input with txid and index of vout
            transactionBuilder.addInput(txid, vout);

        }

        //sign inputs
        
        for (let i = 0; i < utxos.length; i++) {
            originalAmount = utxos[i].satoshis;
            // sign w/ HDNode
            let redeemScript;
            transactionBuilder.sign(i, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);
        }

        

        //BROADCAST THE TRANSACTION
        // build tx
        let tx = transactionBuilder.build();
        // output rawhex
        let hex = tx.toHex();
        console.log(hex);
        console.log(tx.byteLength());

        // sendRawTransaction to running BCH node
        let rawtransactions = new RawTransactions();
        rawtransactions.sendRawTransaction(hex).then((result) => { 
          callback(null,result);
          console.log(result); }, (err) => {
            console.log(err); 
            callback(err);
          });

    })()
  }