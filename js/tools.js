"use strict";

var globalusersearchtimeoutcount = 0;
var previousSearchTermHOSTILE = "";
async function userSearchChanged(searchbox, targetelement) {

    var searchtermHOSTILE = document.getElementById(searchbox).value;

    if (searchtermHOSTILE.length < 3) {
        return;
    }

    //onblur event was causing a new search making clicking on results impossible
    if (searchtermHOSTILE == previousSearchTermHOSTILE) {
        return;
    }
    previousSearchTermHOSTILE = searchtermHOSTILE;

    var localCountTimeOut = ++globalusersearchtimeoutcount;
    //Show loading animation
    document.getElementById(targetelement).innerHTML = document.getElementById("loading").innerHTML;
    await sleep(500);

    //Check if there has been a more recent request (from later keypress)
    if (localCountTimeOut != globalusersearchtimeoutcount) {
        return;
    }

    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=usersearch&address=' + pubkey + '&searchterm=' + encodeURIComponent(searchtermHOSTILE);
    getJSON(theURL).then(function (data) {
        var test = data;
        var contents = `<label for="usersearchresults">` + getSafeTranslation('results', 'Results') + `</label>`;
        for (var i = 0; i < data.length; i++) {
            contents = contents + getDivClassHTML('usersearchresult', userFromDataBasic(data[i], i + searchbox + data[i].address, 16) + sendEncryptedMessageHTML(data[i].address, data[i].name, data[i].publickey)) + "<br/>";
        }
        document.getElementById(targetelement).innerHTML = contents;
        addDynamicHTMLElements(data);

    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}


function createSurrogate() {
    var surrogateName = document.getElementById('surrogatename').value;
    createSurrogateUser(surrogateName, 'createsurrogatebutton', 'surrogatelink');
}

async function postprivatemessage() {
    document.getElementById('newpostmessagebutton').disabled = true;

    var text = document.getElementById('newposttamessage').value;
    var status = "newpostmessagebutton";
    var stampAmount = document.getElementById("stampamount").value;
    if (stampAmount < 547) stampAmount = 547;

    var messageRecipient = document.getElementById("messageaddress").innerText;
    var publickey = document.getElementById("messagepublickey").innerText;

    // Encrypt the message
    const pubKeyBuf = Buffer.from(publickey, 'hex');
    const data = Buffer.from(text);
    const structuredEj = await eccryptoJs.encrypt(pubKeyBuf, data);
    const encryptedMessage = eccryptoJs.serialize(structuredEj).toString('hex');
    sendMessageRaw(privkey, null, encryptedMessage, 1000, status, privateMessagePosted, messageRecipient, stampAmount);
}

function privateMessagePosted() {
    document.getElementById('newpostmessagebutton').disabled = false;
    document.getElementById('newpostmessagebutton').value = getSafeTranslation('sendmessage', "Send Message");
    document.getElementById('newposttamessage').value = "";
    document.getElementById('newpostmessagecompleted').innerText = getSafeTranslation('messagesent', "Message Sent");

}

function sendfunds() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    if (sendAmount < 547) {
        alert(getSafeTranslation('547orlarger', "Amount has to be 547 satoshis or larger."));
        return;
    }
    var totalAmountPossible = tq.updateBalance(pubkey);
    if (sendAmount > totalAmountPossible) {
        alert(getSafeTranslation('largerthanbalance', "This amount is larger than your balance.") + ' ' + totalAmountPossible);
        return;
    }

    var sendAddress = document.getElementById("sendfundsaddress").value.trim();
    if (sendAddress == "") {
        alert(getSafeTranslation('enteranaddress', "Make sure to enter an address to send to."));
    }

    document.getElementById("fundsamount").disabled = true;
    document.getElementById("sendfundsaddress").disabled = true;
    document.getElementById("sendfundsbutton").disabled = true;

    //maybe move to transactions.js
    const tx = {
        cash: {
            key: privkey,
            to: [{ address: sendAddress, value: sendAmount }]
        }
    }
    //updateStatus("Sending Funds To Surrogate Account");
    tq.queueTransaction(tx, sendFundsComplete);

}

function sendFundsComplete() {
    document.getElementById("fundsamount").value = "";
    document.getElementById("sendfundsaddress").value = "";
    document.getElementById("fundsamount").disabled = false;
    document.getElementById("sendfundsaddress").disabled = false;
    document.getElementById("sendfundsbutton").disabled = false;

}
