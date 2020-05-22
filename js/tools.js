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
    getJSON(dropdowns.contentserver + '?action=usersearch&address=' + pubkey + '&searchterm=' + encodeURIComponent(searchtermHOSTILE)).then(function (data) {
        var test = data;
        var contents = `<label for="usersearchresults">Results</label>`;
        for (var i = 0; i < data.length; i++) {
            contents = contents + userHTML(data[i].address, data[i].name, i + searchbox + data[i].address, data[i].rating, 16)
                + sendEncryptedMessageHTML(data[i].address, data[i].name, data[i].publickey)
                + "<br/>";
        }
        document.getElementById(targetelement).innerHTML = contents;
        addStarRatings(data, searchbox);

    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById('usersearch').innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
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

function privateMessagePosted(){
    document.getElementById('newpostmessagebutton').disabled = false;
    document.getElementById('newpostmessagebutton').value="Send Message";
    document.getElementById('newposttamessage').value="";
    document.getElementById('newpostmessagecompleted').innerText="Message Sent";

}