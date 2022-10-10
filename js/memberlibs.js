var errorTemplate=`
<p>
    <span class='connectionerror'>
        <span class='connectionerrortitle' data-vavilon="VV0169">Oops. This request failed.</span><br />
        <span data-vavilon="VV0170">There may be a problem with your internet connection, or the server may be
            having
            problems.</span><br />
        <span data-vavilon="VV0171">The error code is</span> <span>{status}</span><br />
        <span data-vavilon="VV0172">The resource was</span> <span>{url}</span><br />
    </span>
</p>
`;

var topicHeaderHTML=`
<div class='content'>
    <h1 class='topicheader'>#{topic}</h1>
    <table>
        <thead>
            <tr>
                <td data-vavilon="VV0003" class='tltopicname'>Topic</td>
                <td data-vavilon="VV0004" class='tlmessagescount'>Posts</td>
                <td data-vavilon="VV0005" class='tlsubscount'>Subs</td>
                <td data-vavilon="VV0006" class='tlaction'>Action</td>
            </tr>
        </thead>
        <tbody>
            {tablecontents}
        </tbody>
    </table>
</div>
`;

var ratingAndReasonHTML=`
<tr>
    <td data-vavilon_data_label="VV0007" data-label='Member'>{rater}</td>
    <td data-vavilon_data_label="VV0008" data-label='Rates As' align='center'>
        <div data-disabledtext="{disabletext}" data-ratingsize="24" data-ratingaddress="{rateraddress}"
            data-ratingraw="{rating}" id='{stem}{rateraddress}'></div>
    </td>
    <td data-vavilon_data_label="VV0007" data-label='Member'>{ratee}</td>
</tr>
<tr>
    <td data-vavilon_data_label="VV0009" data-label='Commenting...' colspan='3'>
        <a href='#thread?root={txid}'>{reason}</a>
    </td>
</tr>
`;

var trustRatingTableHTML=`
<span data-vavilon="VV0010" class="overallrating">Overall Rating:</span>
<span class="overallrating">{rating}</span>
<br />
<div id="overall"></div>
<br />
<div id="cy" style="width:100%;height:600px;"></div>
<div id="cynote" style="width:100%">&nbsp;</div>
<br />
<a href="https://member.cash/a/804fc6e860" data-vavilon="ratingnotes" id="trustgraphnotes">*Notes: A coin purchase is
    interpreted as a 4.5-star rating. Follow, 3.5-star. Mute, 2-star.</a>
<br />
<table>{tablecontents}</table>
`;

var indirectRatingHTML=`
<tr>
    <td data-vavilon_data_label="VV0011" data-label='You'>
        <span class='ratermember'>{member}</span>
    </td>
    <td data-vavilon_data_label="VV0012" data-label='Rate as'>
        <span class='trustratingintermediate'>
            <div onclick="if({membertxid}){nlc();location.href='#thread?root={membertxid};}'"; id='trust{memberid}{interid}'></div>
        </span>
    </td>
    <td data-vavilon_data_label="VV0013" align='center' data-label='Member'>
        <span class='intermediatemember'>{inter}</span>
    </td>
    <td data-vavilon_data_label="VV0014" data-label='Who Rates as'>
        <span class='trustratingbyintermediate'>
            <div onclick="if({intertxid}){nlc();location.href='#thread?root={intertxid};}'"; id='trust{interid}{targetid}'></div>
        </span>
    </td>
    <td data-vavilon_data_label="VV0007" data-label='Member'>
        <span class='ratedmember'>{target}</span>
    </td>
</tr>
`;

var directRatingHTML=`
<tr>
    <td data-vavilon_data_label="VV0007" data-label='Member'>{member}</td>
    <td></td>
    <td></td>
    <td data-vavilon_data_label="VV0015" data-label='Rates as' align='center'>
        <div id='trust{memberid}{targetid}'></div>
    </td>
    <td></td>
    <td></td>
    <td align='center'>
    <td data-vavilon_data_label="VV0007" data-label='Member'>{target}</td>
</tr>`;

var mainbodyHTML=`
<div class="newheader" id="header"></div>
<div class="mainbody mcapplicationpage">
    <div id="loading" class="loading" style="display: none;">
        <div class="loading"></div>
    </div>

    <div id="lowfundswarning" class="alert" style="display: none;"></div>

    <div id="toolsanchor" class="tools" style="display: none;"></div>

    <div id="newpost" class="newpost" style="display: none;"></div>

    <div id="feed" class="feed" style="display: none;"></div>

    <div id="notifications" class="notifications" style="display: none;">
        <div id="notificationtabs" class="tabs">
            <nav id="notificationtypes" class="filters">

            </nav>

        </div>
        <div id="notificationsbody" class="pageundertabs"></div>
    </div>

    <div id="mcidmemberheader" class="mcmemberheader" style="display: none;">
        <div id="mcidmembertabs" class="filters" style="display:none;"></div>
        <div id="mcidmemberanchor" class="memberanchor"></div>
        <div id="trustgraph" class="trustgraph" style="display:none;"></div>
        <div id="besties" class="besties" style="display:none;"></div>
        <!--<div id="community" class="community" style="display: none;"></div>
        <div id="anchorratings" class="ratings" style="display: none;"></div>-->
    </div>

    <div id="settingsanchor" class="settings" style="display: none;"></div>

    <div id="followers" class="followers" style="display: none;"></div>

    <div id="following" class="following" style="display: none;"></div>

    <div id="blockers" class="blockers" style="display: none;"></div>

    <div id="blocking" class="blocking" style="display: none;"></div>

    <div id="messagesanchor" class="messages" style="display: none;"></div>

    <div id="topicmeta" class="topics" style="display: none;"></div>

    <div id="posts" class="posts" style="display: none;"></div>

    <div id="comments" class="comments" style="display: none;"></div>

    <div id="thread" class="thread" style="display: none;"></div>

    <div id="loginbox" class="loginbox" style="display: none;"></div>

    <div id="topiclistanchor" class="topics" style="display: none;"></div>
</div>`;

var loginboxHTML=`
<div class="content">
    <br />
    <br />
    <br />
    <button data-vavilon="VV0016" class="loginbutton" type="button" href="#settings" onclick="createNewAccount();">Make
        New
        Phrase</button>
    <br />
    <div id="newseedphrasedescription" style="display: none;">
        <br /><span data-vavilon="VV0173">Here is your password. It is a phrase. Write it down.</span><br /><br /><label
            data-vavilon="VV0017">12 Word Seed
            Phrase</label>
        <div id="newseedphrase"></div>
    </div>
    <br />
    <hr />
    <br />
    <br />
    <br /><span data-vavilon="VV0018u">Phrase (12 words), Username, Public or Private Key</span>
    <br />
    <div class="formgroup">
        <input size="64" id="loginkey">
        <button data-vavilon="VV0174" class="loginbutton" type="button" href="#feed"
            onclick="trylogin(document.getElementById('loginkey').value,'#firehose');">login</button>
    </div>
    <br />
    <div id="loginerror">
    </div>
    <br />
    <br />
    <div class="loginnotes">
        <span data-vavilon="VV0019n2">*Deso/BitClout Users. Use your 'BC...' address or username for read only
            access.</span><br />
    </div>
    <div class="loginnotes">
        <span>*Memo Users. Your <a rel='noopener noreferrer' target="memo" href="https://memo.cash/key/export">private
                key</a> starts with 'L..' or 'K..'</span>
    </div>

    <br />
    <br />
</div>
`;

var lowfundswarningHTML=`
<div class="content">
    <span data-vavilon="existen"></span> <span id="satoshiamount">0</span> <span
        data-vavilon="satoshisinaccount">satoshis
        exist in your member.cash account - each
        action (posting, liking, subscribing, following, messaging etc)
        requires a small amount of Membercoin.</span>
    <br />
    <br />
    <span data-vavilon="VV0022">Your address is</span> <span id="lowfundsaddress">{cashaddress}</span>
    <br />
    <br />
    <span data-vavilon="minemembercoin">Get some Membercoin here in exchange for processing power - It may take a few
        seconds.</span>
    <br />
    <br />
    <iframe frameborder="0" width="100%" height="80px" src="mining/index.html?{version}#{bcaddress}"></iframe>
    <a href="" onclick="refreshPool();return false;"><span data-vavilon="VV0025">Refresh
            your balance</span></a> or
    <a href="" onclick="document.getElementById('lowfundswarning').style.display = 'none';return false;"><span
            data-vavilon="VV0026">Dismiss
            this message</span></a>
</div>
`;

var walletanchorHTML=`
<div class="content">

    <div id="walletbalance">
        <label data-vavilon="VVbalance" data-vavilon="address">Balance</label>
        <span class="balancebch" id="balancebch">0</span>
        <span class="satoshis">(M3M)</span>
        <span class="balancesatoshis" id="balancesatoshis">0</span>
        <span class="satoshis">(satoshis)</span>
        <span class="approximatelyequal" style="display: none;">≈</span>
        <span class="balanceusd" id="balanceusd">0</span>
        <span class="usd">(USD)</span>
        <span data-vavilon_title="refreshbalance" onclick="refreshPool();return false;" title="Refresh Balance"
            class="balancedetails">
            <img src="img/icons/reload.png" alt="">
        </span>
    </div>


    <div id="walletaddress" onclick="copyToClipboard('{cashaddress}')">
        <label data-vavilon="VV0065" data-vavilon="address">Address</label>
        <span class="copytoclipboard"><img src="img/icons/copy.png" width="20" height="20" alt="copy"></span>
        <span id="cashaddrformat">{cashaddress}</span>
        <div id="cashaddrformatdiv">
            <span class="qrcodeclick" onclick="showQRCode('cashaddrformat',200);">
                <img width="24" height="24" src='img/qrcodeicon.svg'><span data-vavilon="VV0066">Click to enlarge QR
                    code</span>
            </span>
        </div>
    </div>
    <div id="walletlegacyaddress" onclick="copyToClipboard('{address}')">
        <label data-vavilon="VV0068">Legacy Address</label>
        <span class="copytoclipboard"><img src="img/icons/copy.png" width="20" height="20" alt="copy"></span>
        <span id="legacyformat">{address}</span>
        <div id="legacyformatdiv">
            <span class="qrcodeclick" onclick="showQRCode('legacyformat',200);">
                <img width="24" height="24" src='img/qrcodeicon.svg'><span data-vavilon="VV0066">Click to enlarge QR
                    code</span>
            </span>
        </div>
    </div>

    <div id="walletsendfunds">
        <label data-vavilon="VV0028" for="sendfundsname">Send Funds To Another Address</label>
        <p data-vavilon="VV0029">You can send funds to another Membercoin address.</p>

        <label data-vavilon="VV0031" for="fundsamount">Membercoin Address (Any format)</label>
        <input class="sendfundsaddress" id="sendfundsaddress" maxlength="200" size="60">

        <label data-vavilon="VV0030" for="fundsamount">Amount (In Satoshi)</label>
        <input id="fundsamount" size="12" type="number" maxlength="12" onchange="sendFundsAmountChanged();"
            onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">

        <span class="sendusd" id="sendusd">($0.00 USD)</span>

        <button data-vavilon="VV0032" class="memberstandardbutton" id="sendfundsbutton" type="button"
            onclick="sendfunds();">Send
            Funds</button>
        <br />
    </div>
    <div id="walletprivatekey">
        <label data-vavilon="VV0176">Seed Phrase / Private Key / WIF</label>
        <span id="privatekeydisplay" style="display: none;">{seedphrase}</span>
        <span id="privatekey"><a data-vavilon="showpriv" id="privatekeyclicktoshow"
                onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">text</a></span>
        <div id="privatekeydisplaydiv"></div>
        <span id="privatekeyformat" style="display: none;">{privatekey}</span>
        <div id="privatekeyformatdiv">
            <span class="qrcodeclick" onclick="showQRCode('privatekeyformat',200);">
                <img width="24" height="24" src='img/qrcodeicon.svg'><span data-vavilon="VV0066">Click to enlarge QR
                    code</span>
            </span>
        </div>
    </div>
    <div id="walletblockexplorer">
        <!--
        <label data-vavilon="VV0067" for="settingsblockexplorer">Block Explorers</label>
        <a class="blockexplorerlink" rel="noopener noreferrer" target="bitcoincom" id="settingsbitcoincom"
            href="https://explorer.bitcoin.com/bch/address/{address}">bitcoin.com</a>
        <a class="blockexplorerlink" rel="noopener noreferrer" target="blockchair" id="settingsblockchair"
            href="https://blockchair.com/bitcoin-cash/address/{address}">blockchair</a>
        <a class="blockexplorerlink" rel="noopener noreferrer" target="btccom" id="settingsbtccom"
            href="https://bch.btc.com/{address}">btc.com</a>
        <a class="blockexplorerlink" rel="noopener noreferrer" target="bitcoinunlimited" id="settingsbitcoinunlimited"
            href="https://explorer.bitcoinunlimited.info/address/{address}">bitcoin
            unlimited</a>
        -->
    </div>
</div>
`;

var newpostHTML=`
<br />
<div id="newpostprofilepic" class="newpostprofilepic">
</div>
<div id="memorandumarea">
    <input type="hidden" name="quotetxid" value="" id="quotetxid">
    <input type="hidden" name="quotetxidnetwork" value="" id="quotetxidnetwork">
    <input type="hidden" name="memberimageurl" value="" id="memberimageurl">
    <!-- //Remove topic - use tags to introduce a topic
    <div id="memorandumtopicbutton">
        <a data-vavilon="VV0037" href=""
            onclick="document.getElementById('memorandumtopicarea').style.display = 'block';document.getElementById('memorandumtopicbutton').style.display = 'none'; return false;">+add
            topic</a>
    </div>
    <div id="memorandumtopicarea" style="display: none;">
        <label data-vavilon="VV0038" for="memorandumtopic">topic (optional)</label><label for="memorandumtopic"><span
                id="memorandumtopiclengthadvice">(0/214)</span></label>
        <input class="memorandumtopic" id="memorandumtopic" maxlength="217" onchange="topictitleChanged('memorandum');"
            onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
    </div>
    -->
    <div>
        <textarea class="memorandumtitle" id="memorandumtitle" rows="4" cols="60" maxlength="4000"
            onchange="memorandumPreview();" onkeypress="this.onchange();" onpaste="this.onchange();"
            oninput="this.onchange();">#newmember</textarea>
        <!--<label for="memorandumtitle"><span id="memorandumtitlelengthadvice">(0/217)</span></label>-->
    </div>
    <form id="memorandumtitlefile" method="post" enctype="multipart/form-data" action="{fileuploadurl}">
        <label>
            <input name='firstfile' type="file" style="display: none;"
                onchange="uploadFile('memorandumtitlefile','{fileuploadurl}','memorandumtitle','memorandumpreviewarea','uploadimagelink','uploadimagestatus',showMemorandumPreview,'memberimageurl');"
                accept="image/*">
            <a id="uploadimagelink" data-vavilon="addimage">+add image</a>
        </label>
        <span style="display:none;" id="uploadimagestatus">uploading image . . .</span>
    </form>
    <div id="memorandumtextbutton">
        <a data-vavilon="VV0039" href=""
            onclick="document.getElementById('memorandumtextarea').style.display = 'block';document.getElementById('memorandumtextbutton').style.display = 'none'; return false;">+add
            article</a>
    </div>
    <div id="memorandumtextarea" style="display: none;">
        <label data-vavilon="VV0040" for="newposttamemorandum">article (optional)</label>
        <textarea id="newposttamemorandum" name="text" rows="20" cols="80" onchange="memorandumPreview();"
            onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></textarea>
    </div>
    <div id="quotepost" class="quotepost"></div>
    <div>
        <input data-vavilon_value="VV0041" id="newpostmemorandumbutton" value="Post" type="submit"
            onclick="postmemorandum();">
        <input data-vavilon_value="VV0042" id="newpostmemorandumstatus" style="display: none;" value="Sending . . ."
            type="submit" disabled>
        <div id="newpostmemorandumcompleted"></div>
    </div>
    <br />
    <div id="memorandumpreviewareabutton">
        <br />
        <a data-vavilon="VV0043" href="javascript:;" onclick="showMemorandumPreview(); return false;">+see
            preview</a>
    </div>
    <div id="memorandumpreviewarea" style="display: none;">
        <label data-vavilon="VV0044" for="memorandumpreview">Preview</label>
        <label for="memorandumpreview">
            <div id="switchToArticleMode" class="switchToArticleMode"><a data-vavilon="VV0045" href='javascript:;'
                    onclick="switchToArticleMode();">(Switch to Article Mode)</a></div>
            <div id="switchToRegularMode" class="switchToRegularMode"><a data-vavilon="VV0046" href='javascript:;'
                    onclick="switchToRegularMode();">(Switch to Regular Mode)</a></div>
        </label>
        <div id="memorandumpreview" class="fatitem">
        </div>
    </div>
</div>
`;

var messagesanchorHTML=`
<div class="content">
    <div id="sendmessagecontainer">
        <div id="sendmessagebox" style="display: none;">
            <p data-vavilon="VV0048">Warning: The metadata of your private messages will be public on the blockchain
                (that's the
                sender, recipient, size and time of your message).
                Additionally, if the recipient's private key is made public in the future, the recipient's
                messages will become public. Using the blockchain for
                messaging is generally not advised. Nevertheless, you're a big boy and this facility is made
                available to you if you wish to use it.
            </p>
            <span class="messagerecipient">To:</span>
            <span id="messagerecipient" class="messagerecipient"></span>
            <span id="messageaddress" class="messageaddress" style="display:none;"></span>
            <span id="messagepublickey" class="messagepublickey" style="display:none;"></span>

            <label data-vavilon="VV0053" for="stampamount">Stamp Amount (in sats, minimum 547)</label>
            <input id="stampamount" size="8" type="number" value="547">
            <div>
                <label data-vavilon="VV0054" for="newposttamessage">Message</label>
                <textarea id="newposttamessage" name="text" rows="20" cols="80"></textarea>
            </div>
            <div>
                <input data-vavilon_value="VV0055" id="newpostmessagebutton" value="Send Message" type="submit"
                    onclick="postprivatemessage();">
                <input data-vavilon_value="VV0175" id="newpostmessagestatus" style="display: none;"
                    value="Sending . . ." type="submit" disabled>
                <div id="newpostmessagecompleted"></div>
            </div>
        </div>
        <br />
    </div>
    <div id="messageschoice" class="filters">
        <a data-vavilon_title="allmessages" class="filteroff" href="#messages?messagetype=all" onclick="nlc();">All</a>
        <a data-vavilon_title="sentmessages" class="filteroff" href="#messages?messagetype=sent"
            onclick="nlc();">Sent</a>
        <a data-vavilon_title="receivedmessages" class="filteroff" href="#messages?messagetype=received"
            onclick="nlc();">Received</a>
    </div>
    <br />
    <div id="messageslist" class="messageslist"></div>
</div>
`;

var fbHTML={};
fbHTML.followers=`
<div class="content">
    <h2>Followers</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th></th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="followerstable">
        </tbody>
    </table>
</div>
`;

fbHTML.following=`
<div class="content">
    <h2>Following</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th></th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="followingtable">
        </tbody>
    </table>
</div>
`;

fbHTML.blockers=`
<div class="content">
    <h2>Muters</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th></th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="blockerstable">
        </tbody>
    </table>
</div>
`;

fbHTML.blocking=`
<div class="content">
    <h2>Muting</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th></th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="blockingtable">
        </tbody>
    </table>
</div>
`;

var communityHTML=`
<div class="content">
    <h2>Ratings Of This Member</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th data-vavilon="VV0056">Rates</th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="communityratingtable">
        </tbody>
    </table>
    <br /><br />
</div>
`;

var anchorratingsHTML=`
<div class="content">
    <h2>Ratings By This Member</h2>
    <br />
    <table class="table">
        <thead>
            <tr>
                <th data-vavilon="VV0007">Member</th>
                <th data-vavilon="VV0056">Rates</th>
                <th data-vavilon="VV0007">Member</th>
            </tr>
        </thead>
        <tbody id="memberratingtable">
        </tbody>
    </table>
</div>
`;

var trustgraphHTML=`
<div class="content">
    <h2 data-vavilon="VV0057">Trust Graph</h2>
    <div id="trustgraphdetails"></div>
    <br />
</div>
`;

var bestiesHTML=`
<div class="content">
    <div id="bestiesdetails">
        <div id="bestiescy" style="width:100%;height:600px;"></div>
        <div id="cynote" style="width:100%">&nbsp;</div>
    </div>
    <br />
</div>
`;

var membertabsHTML=`
<div class="filterssecondset">
    <a data-vavilon="VV0063" data-vavilon_title="VV0063" title="Profile" class="{profileclass}"
        href="#member?qaddress={address}">Profile</a>
    <span class="separator"></span>
    <a data-vavilon="VVreputation" data-vavilon_title="VVreputation" title="Reputation" class="{reputationclass}"
        href="#rep?qaddress={address}">Reputation</a>
    <span class="separator"></span>
    <!--<a data-vavilon="VVsupport" data-vavilon_title="VVsupport" title="Support" class="{bestiesclass}"
        href="#support?qaddress={address}">Top 5</a>-->
    <span class="separator"></span>
    <a data-vavilon="VVlist" data-vavilon_title="VVlist" title="List" class="filteroff"
        href="#list?qaddress={address}">List</a>
    <span class="separator"></span>
    <a data-vavilon="VV0004" data-vavilon_title="VV0004" title="Posts" class="{postsclass}"
        href="#show?start=0&limit=25&order=new&content=both&filter=everyone&qaddress={address}&topicname=">Posts</a>
</div>
`;

var pages = {};
pages.member = `
<div class="content">
    <div class="memberpiccontainer">
        <label data-vavilon="VV0059" id="memberpiclargelabel" for="memberpic" style="display:inline;">Profile
            Picture</label>
        <span class="memberpiclarge" style="display:inline;">
            {profilepiclargehtml}
        </span>
    </div>
    <!--<label for="memberidenticon">Identicon</label>
    <div id="memberidenticon"><svg width="20" height="20" class="jdenticonlarge" data-jdenticon-value="{address}"></svg>
    </div>
    <label data-vavilon="VV0065">Address</label>-->

    <div class="profileactions" id="memberprofileactions"><br /><br />
        {followbuttonhtml}
        <span class="dropdown">
            <button onclick="dropDownMenuAction(this);" class="dropbtn">☰</button>
            <div class="dropdown-content mainhamburger" id="dropdown-content">
                <a data-vavilon="VV0061" class="populate-send-message"
                    onclick="populateSendMessage('{address}','{handlefunction}','{publickey}');"
                    href="javascript:;">Send Message</a>
                {mutebuttonhtml}
                <a href="https://member.cash/#member?qaddress={address}" id="memberprofilelink">member.cash</a><span
                    class="separatorwide"></span><a rel="noopener noreferrer" target="memo"
                    href="https://memo.cash/profile/{address}" id="membermemoprofilelink">Memo</a><span
                    class="separatorwide"></span><a rel="noopener noreferrer" target="bitclout"
                    href="https://bitclout.com/u/{pagingid}" id="bitcloutprofilelink">BitClout</a><span
                    class="separatorwide"></span>
            </div>
        </span>
    </div>



    <!-- *** -->
    <div class="memberdetails">
        <span class="profile-handle">{handle}</span>
        <br />
        <span class="profile-pagingid" id="memberpagingid">@{pagingid}</span>
    </div>

    <div id="memberprofiletext">{profile}</div>

    <div class="memberstats">
        <div class="membrain">
            <a href="https://member.cash/a/804fc6e860"></a><label data-vavilon="membrain">MemBrain</label></a>
            <a id="membrainnumber" href="https://member.cash/a/804fc6e860">{membrain}</a>
        </div>
        <div class="followers">
            <label data-vavilon="VV0071">Followers</label>
            <a id="memberfollowersnumber" href="#followers?qaddress={address}">{followers}</a>
        </div>
        <div class="following">
            <label data-vavilon="VV0072">Following</label>
            <a id="memberfollowingnumber" href="#following?qaddress={address}">{following}</a>
        </div>
        <div class="muters">
            <label data-vavilon="VV0073">Muters</label>
            <a id="memberblockersnumber" href="#blockers?qaddress={address}">{muters}</a>
        </div>
        <div class="muting">
            <label data-vavilon="VV0074">Muting</label>
            <a id="memberblockingnumber" href="#blocking?qaddress={address}">{muting}</a>
        </div>
    </div>
    <div id="memberratinggroup" style="display: none;">
        <label data-vavilon="VV0075" for="memberratingcomment">You Rate</label>
        <div class="memberratinggroup">
            <div class="memberratingcomment" id="memberratingcomment"></div>
            <div class="memberrating" id="memberrating"></div>
        </div>
    </div>
    {pinnedpostHTML}
    <div id="walletaddress" onclick="copyToClipboard('{cashaddress}')">
        <span class="copytoclipboard"><img src="img/icons/copy.png" width="20" height="20" alt="copy"></span>
        <span id="membercashaddrformat">{cashaddress}</span>
        <div id="membercashaddrformatdiv">
            <span class="qrcodeclick" onclick="showQRCode('membercashaddrformat',200);">
                <img width="24" height="24" src='img/qrcodeicon.svg'><span data-vavilon="VV0066">Click to enlarge QR
                    code</span>
            </span>
        </div>
    </div>
    <div id="walletbcaddress" onclick="copyToClipboard('{bcaddress}')">
        <span class="copytoclipboard"><img src="img/icons/copy.png" width="20" height="20" alt="copy"></span>
        <span id="memberbcformat">{bcaddress}</span>
        <div id="memberbcformatdiv">
            <span class="qrcodeclick" onclick="showQRCode('memberbcformat',200);">
                <img width="24" height="24" src='img/qrcodeicon.svg'><span data-vavilon="VV0066">Click to enlarge QR
                    code</span>
            </span>
        </div>
    </div>


</div>`;

pages.settings = `
<div class="content">
    <input id="settingspagingid" value="{pagingid}" style="display:none;">
    <input id="settingspublickey" value="{publickey}" style="display:none;">
    <input id="settingspicurl" value="{picurl}" style="display:none;">
    <input id="settingstokens" value="{tokens}" style="display:none;">
    <input id="settingsnametime" value="{nametime}" style="display:none;">
    <input id="settingsrating" value="{rating}" style="display:none;">
    <input id="settingsaddress" value="{addressnumber}" style="display:none;">

    <h2 data-vavilon="VV0166">Settings</h2>
    <div id="settingsloggedin">
        <div class="settingspiccontainer">

            <!--<label id="settingspiclargelabel" for="settingspic" style="display:inline;">
                <span data-vavilon="VV0076" class="profilepicdirections">(Must be imgur link in this format or .png
                    format)</span></label>-->
                    <label data-vavilon="VV0059" id="settingspiclargelabel"  style="display:inline;">Profile
                        Picture</label><br><br>
            <form id="profilepicfile" method="post" enctype="multipart/form-data" action="{fileuploadurl}">
                <label>
                    <input style="display: none;" name='firstfile' type="file" id="uploadprofilepicinput"
                        onchange="uploadFile('profilepicfile','{fileuploadurl}','settingspic','memorandumpreviewarea','chooseimagebutton','uploadimagestatus',setPic,null);"
                        accept="image/*">
                    <a data-vavilon="chooseimage" id="chooseimagebutton" class="memberlinkbutton">Choose Image</a>
                </label>
            </form>
            <div class="formgroup" style="display: none;">
                <input maxlength="217" size="30" id="settingspic" value="https://i.imgur.com/XXXXXXXX.jpg"
                    onchange="document.getElementById('settingspicbutton').disabled=false;"
                    onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                <button data-vavilon="VV0077" id="settingspicbutton" type="button" onclick="setPic();"
                    disabled="">update</button>
            </div>
            <span class="settingspiclarge" style="display:inline;">
                {profilepiclargehtml}
            </span>

        </div>
        <div>
            <label data-vavilon="VV0060" for="settingsnametext">Handle</label>
            <div class="formgroup">
                <input maxlength="217" size="30" id="settingsnametext" value="{handle}"
                    onchange="document.getElementById('settingsnametextbutton').disabled=false;"
                    onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                <button data-vavilon="VV0077" id="settingsnametextbutton" type="button"
                    onclick="setName();">update</button>
            </div>
        </div>
        <label data-vavilon="VV0062" for="settingspagingid">Paging ID</label>
        <div id="settingspagingid">@{pagingid}</div>
        <div>
            <label data-vavilon="VV0063" for="settingsprofiletext">Profile</label>
            <div class="formgroup">
                <input maxlength="217" size="30" id="settingsprofiletext" value="{profile}"
                    onchange="document.getElementById('settingsprofiletextbutton').disabled=false;"
                    onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
                <button data-vavilon="VV0077" id="settingsprofiletextbutton" type="button" onclick="setProfile();"
                    data-vavilon="update" disabled="">update</button>
            </div>
        </div>
        <div>
            <label data-vavilon="VV0079" for="notificationbutton">Notifications</label>
            <span class="allownotifications"><a data-vavilon="VV0080" class="memberlinkbutton" href="javascript:;"
                    onclick="requestNotificationPermission(); this.style.display='none';">Allow
                    Notifications</a></span>
        </div>
        <div>
            <label data-vavilon="VV0082" for="oneclicktip">One-Click Tip Amount</label>
            <input id="oneclicktip" size="8" type="number" onchange="updateSettingsNumber('oneclicktip');"
                onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
            <p data-vavilon="VV0177">(Amount to tip when clicking up arrow. Minimum 547)</p>
        </div>
        <div>
            <label data-vavilon="maxfee" for="maxfee">Max Fee</label>
            <input id="maxfee" size="3" type="number" step="1" onchange="updateSettingsNumber('maxfee');"
                onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
            <p data-vavilon="VV0083">(Max satoshis per byte to pay during network congestion. Minimum 2)</p>
        </div>
    </div>
    <input type="hidden" id="usdrate" step="1" onchange="updateSettingsNumber('usdrate');" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
    <div>
        <label for="languageselector">Language / 语言 / Idioma / Lengguwahe</label>
        <select id="languageselector" onchange="updateSettingsDropdown('languageselector');">
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
            <option value="fil">Filipino</option>
        </select>
    </div>
    <div>
        <label data-vavilon="VV0081" for="cssselector">Theme</label>
        <select id="cssselector" onchange="changeStyle(document.getElementById('cssselector').value, true);">
            <option data-vavilon="VV0167" value="feels compact">Choose Theme</option>
            <option value="feels compact">Feels Compact</option>
            <option value="feels-night compact compactnight">Feels Compact Night Mode</option>
            <option data-vavilon="VV0168" value="none">None</option>
        </select>
    </div>
    <div>
        <label data-vavilon="resultsnumber" for="results">Number Of Results To Show</label>
        <input id="results" size="3" type="number" step="1" onchange="updateSettingsNumber('results');"
            onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">
        <p data-vavilon="VV0084">(Max results to show per page. Maximum 100)</p>
    </div>
    <div>
        <label data-vavilon="mineheader" for="notificationbutton">Mining</label>
        <iframe frameborder="0" width="100%" height="80px" src="mining/index.html?{version}#{address}"></iframe>
    </div>
    <!--<div>
        <label data-vavilon="VV0085" for="currencydisplay">Currency Display</label>
        <select id="currencydisplay" onchange="updateSettingsDropdown('currencydisplay');">
            <option value="USD">USD</option>
            <option value="BCH">BCH</option>
        </select>
    </div>
    <div>
        <label data-vavilon="VVtwitterfeed" for="twitterfeed">Twitter User</label>
        <input class="sendfundsaddress" id="twitterfeed" maxlength="200" size="60">
        <button data-vavilon="VVaddtwitterfeedbutton" class="memberstandardbutton" id="addtwitterfeedbutton" type="button"
            onclick="addRSSFeed('twitter','addtwitterfeedbutton');">Add Twitter User</button>
    </div>
    <div>
        <label data-vavilon="VVrssfeed" for="rssfeed">RSS Feed</label>
        <input class="sendfundsaddress" id="rssfeed" maxlength="200" size="60">
        <button data-vavilon="VVaddrssfeedbutton" class="memberstandardbutton" id="addrssfeedbutton" type="button"
            onclick="addRSSFeed('plain','addrssfeedbutton');">Add RSS Feed</button>
    </div>-->
    <br />
    <br />
    <div>
        <label data-vavilon="VV0086" for="mutedwords">Muted Words (Comma Separate)</label>
        <textarea id="mutedwords" name="text" rows="4" cols="60" onchange="updatemutedwords();"
            onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></textarea>
    </div>
    <div>
        <label data-vavilon="VV0087" for="mediasettings" class="labelheader">Media Settings</label>
    </div>
    <div class="customcheckbox">
        <input type="checkbox" id="showyoutube" onchange="updateSettingsCheckbox('showyoutube');">
        <label data-vavilon="VV0088" for="showyoutube" class="checkboxlabel">Show YouTube Preview Images</label>
    </div>
    <div class="customcheckbox">
        <input type="checkbox" id="showimgur" onchange="updateSettingsCheckbox('showimgur');">
        <label data-vavilon="VV0089" for="showimgur" class="checkboxlabel">Show Imgur Images</label>
    </div>
    <div class="customcheckbox">
        <input type="checkbox" id="showtwitter" onchange="updateSettingsCheckbox('showtwitter');">
        <label data-vavilon="VV0090" for="showtwitter" class="checkboxlabel">Show Tweets</label>
    </div>
    <!--<div class="customcheckbox">
        <input type="checkbox" id="showlbry" onchange="updateSettingsCheckbox('showlbry');">
        <label data-vavilon="showlbry" for="showlbry" class="checkboxlabel">Show lbry.tv</label>
    </div>-->
    <div class="customcheckbox">
        <input type="checkbox" id="showbitclout" onchange="updateSettingsCheckbox('showbitclout');">
        <label data-vavilon="showbitclout" for="showbitclout" class="checkboxlabel">Show BitClout Images</label>
    </div>


    <!-- Too slow on server side-->

    <div>
        <label data-vavilon="VV0181" for="filtersettings" class="labelheader">Filter Settings</label>
    </div>
    <div class="customcheckbox">
        <input type="checkbox" id="shownonameposts" onchange="updateSettingsCheckbox('shownonameposts');">
        <label data-vavilon="VV0182" for="shownonameposts" class="checkboxlabel">Show Posts From Members With No
            Handle</label>
    </div>
    <div class="customcheckbox">
        <input type="checkbox" id="shownopicposts" onchange="updateSettingsCheckbox('shownopicposts');">
        <label data-vavilon="VV0183" for="shownopicposts" class="checkboxlabel">Show Posts From Members With No
            Picture</label>
    </div>
    <div>
        <label data-vavilon="VVcontentnetwork" for="contentnetwork">Only Show Content From Network</label>
        <select id="contentnetwork" onchange="updateSettingsDropdown('contentnetwork');">
            <option value="-1">All Networks</option>
            <option value="3">Membercoin (M3M)</option>
        </select>
    </div>
    <div>
        <label data-vavilon="VV0091" for="contentserver">Content Server</label>
        <select id="contentserver" onchange="updateSettingsDropdown('contentserver');">
            <option value="https://member.cash/v2/member.js">member.cash</option>
            <option value="http://127.0.0.1:3123/v2/member.js">Localhost</option>
        </select>
    </div>
    <div>
        <label data-vavilon="VV0092" for="txbroadcastserver">TX Broadcast Server</label>
        <select id="txbroadcastserver" onchange="updateSettingsDropdown('txbroadcastserver');">
            <option value="https://member.cash/v2/">member.cash</option>
            <option value="http://127.0.0.1:3123/v2/">Localhost</option>
        </select>
    </div>

    <div>
        <label data-vavilon="VV0093" for="mcutxoserver">UTXO Server</label>
        <select id="mcutxoserver" onchange="updateSettingsDropdown('mcutxoserver');">
            <option value="https://member.cash/v2/">member.cash</option>
            <option value="http://127.0.0.1:3123/v2/">Localhost</option>
        </select>
    </div>
    <div>
        <label data-vavilon="debuginfo" for="debuginfo">Debug Info</label>
        <textarea id="debuginfo" name="text" rows="2" cols="60" readonly></textarea>
        <br />
        <a href="javascript:;" onclick="getJSON(dropdowns.contentserver + '/invalidatecache/')" ;
            class="memberlinkbutton">Invalidate cache (will force reload of client)</a>
    </div>


</div>`;

var hamburgerMenuHTML=`
<span class="dropdown">
    <button onclick="dropDownMenuAction(this);" class="dropbtn">☰</button>
    <div class="dropdown-content mainhamburger" id="dropdown-content">
        <a data-vavilon_title="VV0063" id="profilebutton" title="Profile" class="hamburgerbutton" href="#profile"
            onclick="nlc();" style="display:none;">
            <img src="img/icons/user.png" alt="profile">
            <span data-vavilon="VV0063">Profile</span></a>
        <a data-vavilon_title="VVwallet" id="walletbutton" title="Wallet" class="hamburgerbutton" href="#wallet"
            onclick="nlc();" style="display:none;">
            <img src="img/icons/wallet.png" alt="wallet">
            <span data-vavilon="VVwallet">Wallet</span></a>
        <a data-vavilon_title="VV0100" id="topiclistbutton" title="Tag List" class="hamburgerbutton" href="#topiclist"
            onclick="nlc();">
            <img src="img/icons/hashtag.png" alt="MyFeed">
            <span data-vavilon="VV0100">Tag List</span></a>
        <a data-vavilon_title="VV0101" id="mapbutton" title="Map" class="hamburgerbutton" href="#map" onclick="nlc();">
            <img src="img/icons/map.png" alt="map">
            <span data-vavilon="VV0101">Map</span></a>
        <a data-vavilon_title="VV0098" id="settingsbutton" title="Settings" class="hamburgerbutton" href="#settings"
            onclick="nlc();">
            <img src="img//Icons/settings.png" alt="settings">
            <span data-vavilon="VV0098">Settings</span></a>
        <a data-vavilon_title="VV0078" id="logoutbutton" title="Logout" class="hamburgerbutton" href="#logout"
            onclick="logout();" style="display:none;">
            <img src="img/icons/exit.png" alt="logout">
            <span data-vavilon="VV0078">Logout</span></a>
    </div>
</span>
`;

var pageTitleHTML = `
<div class="pageTitlediv" id="pagetitledivid">Topic</div>
`

var majorNavButtonsHTML=`
<div id="majornavbuttonsdivid" class="majornavbuttonsdiv">
    <span id="loggedin" class="loggedin" style="display:none;">
        <a data-vavilon_title="VV0095" onclick="nlc();" id="notificationsbutton" title="Notifications"
            href="#notifications">
            <img src="img/icons/notification.png" alt="notificatons">
            <span class="alertcount noselect" id="alertcount"></span></a>
        <a data-vavilon_title="VV0094a" onclick="nlc();" id="myfeedbutton"
            title="My People (Latest posts from your follows)" href="#mypeople">
            <img src="img/icons/group.png" alt="MyFeed">
        </a>
        <a data-vavilon_title="VVfirehose" onclick="nlc();" id="firehosebutton" title="Firehose (Everything)"
            href="#firehose">
            <img src="img/icons/fire-hose.png" alt="FireHose">
        </a>
        <a data-vavilon_title="VV0100a" onclick="nlc();" id="topiclistbutton"
            title="My Tags  (Latest posts from your tags)" href="#mytags">
            <img src="img/icons/hashtaglarge.png" alt="MyFeed">
        </a>
        <a data-vavilon_title="VV0097" onclick="nlc();" id="privatemessagesbutton" title="Messages" href="#messages">
            <img src="img/icons/messages.png" alt="message">
            <span class="alertcount noselect" id="alertcountpm"></span></a>
        <a data-vavilon_title="VV0096" onclick="nlc();" id="newbutton" title="New Post" href="#new">
            <img src="img/icons/plus.png" alt="newpost">
        </a>
    </span>
    <span id="loggedout" class="loggedout">
        <a data-vavilon_title="VVfirehose" class="largenavbtn" onclick="nlc();" id="firehosebuttonloggedout"
            title="Firehose (Everything)"
            href="#show?order=hot&content=posts&topicname=&filter=everyone&start=0&limit=25">
            <!-- 📰 -->
            <img src="img/icons/fire-hose.png" alt="firehose">
        </a>
        <a data-vavilon="VV0102a" id="loginbutton" class="btn vavilon" href="#login" onclick="nlc();">Login</a>
        <span class="separatorwide"></span>
        <a data-vavilon="VV0103a" id="loginbutton" class="btn vavilon" href="#login" onclick="nlc();">Start</a>
    </span>

</div>
`;

var userSearchHTML=`
<div id="usersearchnav" class="usersearchnavclass">
    <input class="usersearchnav" id="usersearchnavid" maxlength="40"
        onchange="userSearchChanged('usersearchnavid','usersearchnavresults');" onkeypress="this.onchange();"
        onfocus="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"
        data-vavilon_data_placeholder="VVsearchplaceholder" placeholder="Search..." />
    <div id="usersearchnavresults"></div>
</div>
`;



var headerHTML = `
<div id="ddcover" class="ddcover"></div>
<div class="headerleftgroup">
    <span class="memberlogo">
        <a href="./index.html">
            <img class="memberlogoimagefull" src="img/logos/logowide.svg" width="130" height="26"
                alt="Site Logo Full" />
            <img class="memberlogoimage" src="img/logos/membericon.svg" width="26" height="26" alt="Site Logo Icon" />
        </a>
    </span>
    <a class="profilepicwrapper" href="#profile" onclick="nlc();"><span id="profilepicheader"
            class="profilepicheader"></a>
    </span>
    </a>
    <div id="pagetitle" class="pagetitleclass"></div>
</div>
<div class="headercentergroup">
    <nav id="majornavbuttons" class="majornavbuttonsclass"></nav>
</div>
<div class="headerrightgroup">
    <!--<input class="balance" id="membalance" maxlength="11" size="11" disabled value="0.00000000M̈" style="text-align: right;">-->
    <a href="#wallet" onclick="nlc();"><span id="membalance" class="membalance"></span></a>
    <div class="searchwrapper">
        <nav id="usersearch" class="usersearchclass"></nav>
        <nav id="hamburgermenu" class="hamburgermenuclass"></nav>
    </div>
</div>
`;

var footerHTML = `
<div class="content">
    <hr />
    <span id="developmentversion" class="developmentversion" style="display: none;"><span data-vavilon="VV0137">You're
            viewing the development
            preview version
            of Member You may need to SHIFT + Reload to get the very latest changes. Generally, It's recommended
            to</span>
        <a data-vavilon="VV0138" rel='noopener noreferrer' target="member" href="https://member.cash">use the stable
            version at https://member.cash</a><br /><br />
        <hr />
    </span>
    <span id="readonlyversion" class="developmentversion" style="display: none;"><span
            data-vavilon="readonlymodewarning">You're in read-only mode.
            Log out and login with a seedphrase or private key to create or like posts</span><br /><br />
        <hr />
    </span>
    <span class="footerlinks">
        <a data-vavilon="VVinfluencers" href="https://member.cash/#topinfluencers">Influencers</a>
        <span class="separatorwide"></span>
        <a rel='noopener noreferrer' target="github" href="https://github.com/memberapp/memberapp.github.io">Github</a>
        <span class="separatorwide"></span>
        <a data-vavilon="VV0141" rel='noopener noreferrer' target="github"
            href="https://github.com/memberapp/protocol">Protocol</a>
        <span class="separatorwide"></span>
        <a data-vavilon="VV0142" onclick="populateSendMessage('1M77BV2DExpLY6mepv86CTGpGMSoL2pLa9','\x46\x72\x65\x65\x54\x72\x61\x64\x65','03cd56864fe8b0533e9d0ad36001c5ee50d2fa5264e57c7a46d4a05fb0881609db');" href="javascript:;">Contact</a>
        <span class="separatorwide"></span>
        <span data-vavilon="VV0143">version</span> <span id="version" title="version">loading</span>.<u>9</u>
    </span>
    <br />
    <br />
</div>
`;var postCompactTemplate = `
<div class="post" onmouseover="changeClass(this,'post highlighted')" onmouseout="changeClass(this,'post')">
    {directlink}
    <div class="post-content">
        <div class="post-side-bar" onclick="nlc();location.href='#thread?root={roottxid}&amp;post={txid}';">
            {authorsidebar}
        </div>
        <div class="post-right-contents">
            <div class="post-header">
                {author}
                <span data-vavilon="VV0151" class="fulltext">submitted</span>
                <span class="post-metadata">
                    <span class="elapsed-time">
                        {elapsed}
                    </span>
                    <span class="elapsed-time-compressed">
                        {elapsedcompressed}
                    </span>
                    <span class="topic">
                        {topic}
                    </span>
                </span>
                <span class="network-source">
                    {sourceNetworkImage}
                </span>
            </div>
            <div class="post-body-wrapper">
                <div id="postbody{txid}" class="post-body"
                    onclick="if(document.getSelection().type === 'Range'){return;}else{nlc();location.href='#thread?root={roottxid}&amp;post={txid}'};">
                    {message}
                </div>
                <div class="post-quote">
                    {quote}
                </div>
                <div class="post-footer">
                    <span class="post-footer-reply post-footer-relative">
                        <a id="replylink{txid}{page}{diff}" onclick="showReplyBox('{txid}{page}{diff}');"
                            href="javascript:;" class="btn-icon" data-action="reply">
                            <span class="replyicon">
                                <span class="emojiicon">💬</span>
                            </span>
                            <span class="iconcount">
                                {replies}
                            </span>
                            <span data-vavilon="VV0153" class="text footerlabel">replies</span>
                        </a>
                    </span>
                    <span class="post-footer-upvote{likeactivated} post-footer-relative" id="upvotecontainer{txid}">
                        <a id="upvoteaction{txid}" href="javascript:;"
                            onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',0)" class="btn-icon"
                            data-action="like">
                            <span class="likeicon">
                                <span class="emojiicon">💙</span>
                            </span>
                            <span class="iconcount likestext" id="likescount{txid}">
                                {likes}
                            </span>
                            <span class="iconcount likesbalance" id="score{txid}">
                                {likesbalance}
                            </span>
                            <span data-vavilon="likes" class="text footerlabel">likes</span>
                        </a>
                    </span>
                    <span class="post-footer-downvote{dislikeactivated} post-footer-relative"
                        id="downvotecontainer{txid}">
                        <a id="downvoteaction{txid}" href="javascript:;" onclick="dislikePost('{txid}','{origtxid}')"
                            class="btn-icon" data-action="dislike">
                            <span class="dislikeicon">
                                <span class="emojiicon">👎</span>
                            </span>
                            <span class="iconcount" id="dislikescount{txid}">
                                {dislikes}
                            </span>
                            <span data-vavilon="dislikes" class="text footerlabel">dislikes</span>
                        </a>
                    </span>
                    <span class="post-footer-remembers{rememberactivated} post-footer-relative" id="remembers{txid}">
                        <a id="quotelinkposts{diff}{txid}" class="btn-icon" data-action="remember"
                            onclick="dropDownMenuAction(this);">
                            <span class="remembersicon">
                                <span class="emojiicon">♻</span>
                            </span>
                            <span class="iconcount" id="repostscount{txid}">{remembers}</span>
                            <span data-vavilon="VV0156" class="text footerlabel">remembers</span>
                            <div class="dropdown-content remember-dropdown" id="dropdown-content{diff}{txid}">
                                <a onclick="repostPost('{txid}','{origtxid}','{sourcenetwork}');"><span
                                        data-vavilon="remember">remember</span></a>
                                <a
                                    onclick="if (!checkForPrivKey()) return false; nlc(); location.href='#new?txid={origtxid}';"><span
                                        data-vavilon="VV0158">quote</span></a>
                            </div>
                        </a>
                    </span>
                    <span class="post-footer-tips post-footer-relative">
                        <a id="tiplinkposts{diff}{txid}" class="btn-icon" data-action="tip"
                            onclick="dropDownMenuAction(this);">
                            <span class="tipicon">
                                <span class="emojiicon">💰</span>
                            </span>
                            <span id="tipscount{txid}" class="iconcount" data-amount="{tipsinsatoshis}">{tips}</span>
                            <span data-vavilon="tips" class="text footerlabel">tips</span>
                            <div class="dropdown-content remember-dropdown" id="dropdown-content{diff}{txid}">
                                <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',     10000000)"><span
                                    data-vavilon="remember">0.1 M3M ({MEMUSD1C})</span></a>
                                <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',    100000000)"><span
                                        data-vavilon="remember">1 M3M ({MEMUSD1})</span></a>
                                <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',    500000000)"><span
                                        data-vavilon="remember">5 M3M ({MEMUSD5})</span></a>
                                <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',   1000000000)"><span
                                        data-vavilon="remember">10 M3M ({MEMUSD10})</span></a>
                                <a
                                    onclick="if (confirm('Tip 20 M3M ({MEMUSD20})?')){likePost('{txid}','{origtxid}','{bitcoinaddress}',    2000000000);}"><span
                                        data-vavilon="remember">20 M3M ({MEMUSD20})</span></a>
                                <a
                                    onclick="if (confirm('Tip 100 M3M ({MEMUSD100})?')){likePost('{txid}','{origtxid}','{bitcoinaddress}', 10000000000);}"><span
                                        data-vavilon="remember">100 M3M ({MEMUSD100})</span></a>
                            </div>
                        </a>
                    </span>
                    <span class="dropdown">
                        <button onclick="dropDownMenuAction(this);" class="dropbtn">
                            <div class="options">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </button>
                        <div class="dropdown-content" id="dropdown-content">
                            <a onclick="showScoresExpanded('{txid}','scoresexpanded{txid}{diff}')"
                                href="javascript:;"><span data-vavilon="VV0147">likes and</span> <span
                                    data-vavilon="tips">tips</span></a>
                            <a onclick="showRemembersExpanded('{txid}','remembersexpanded{txid}{diff}')"
                                href="javascript:;"><span data-vavilon="VV0156">Remembers</span></a>
                            <a class="permalink" id="permalinkposts{diff}{txid}" href="{permalink}"><span
                                    data-vavilon="permalink">Permalink</span></a>
                            <a id="articlelinkposts{diff}{txid}" href="{articlelink}"><span
                                    data-vavilon="article">Article</span></a>
                            <a id="dislikepost{diff}{txid}" onclick="dislikePost('{txid}','{origtxid}')"
                                href="javascript:;"><span data-vavilon="downvote">Downvote</span></a>

                            <!--<a id="hidepostlinkposts{diff}{txid}" onclick="sendHidePost('{txid}');"
                                href="javascript:;"><span data-vavilon="VV0161">Flag post</span></a>
                            <a id="hideuserlinkposts{diff}{txid}"
                                onclick="hideuser('{address}','','hideuserlinkposts{diff}{txid}');"
                                href="javascript:;"><span data-vavilon="flaguser">Flag user</span></a>
                            <a id="hideuserlinkposts{diff}{txid}"
                                onclick="hideuser('{address}','{topicescaped}','hideuserlinkposts{diff}{txid}');"
                                href="javascript:;"><span data-vavilon="flagusertopic">Flag user for
                                    topic</span></a>
                            <a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/{txid}">Memo</a>
                            <a rel="noopener noreferrer" target="bitcoincom"
                                href="https://explorer.bitcoin.com/bch/tx/{txid}">Bitcoin.com</a>
                            <a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/{txid}">BitClout</a>-->
                            {pinnedpostHTML}
                            {sourceNetworkHTML}
                        </div>
                    </span>
                </div>
                <span id="tipboxposts{diff}{txid}" style="display:none">
                    <input id="tipamountposts{diff}{txid}" type="number" value="0" min="0" style="width: 6em;"
                        step="1000">
                    <input id="tipbuttonposts{diff}{txid}" value="tip" type="submit"
                        onclick="sendTip('{txid}','{origtxid}','{bitcoinaddress}','posts{diff}');">
                    <input id="tipstatusposts{diff}{txid}" value="sending" type="submit" style="display:none"
                        disabled="">
                </span>
                <div id="scoresexpanded{txid}{diff}" class="scoreexpanded"></div>
                <div id="remembersexpanded{txid}{diff}" class="remembersexpanded"></div>
                {replydiv}
            </div>
        </div>
    </div>
</div>
`;

var completedPostTemplate=`
<span data-vavilon="messagesent">Sent.</span>
<a data-vavilon="VV0145" onclick="showThread('{txid}')" href="#thread?post={txid}" onclick="nlc();">View It</a> or
<!--<a data-vavilon="VV0146" href="javascript;"
    onclick="window.open('{encodedurl}', 'twitterwindow', 'width=300,height=250');return false;">Also
    Post To Twitter (opens a new window)</a>-->
`;




var userCompactTemplate=`
<span class="membercompact" onclick="event.stopPropagation();">
    {directlink}
    <span id="memberinfo{diff}posts{address}">
        <a href="#member?qaddress={address}" onclick="nlc();" class="memberdetails">
            <span class="memberpicsmallcompact" style="display:inline;">{profilepicsmall}</span>
            <span class="member-handle">{handle}</span>
        </a>
    </span>
    <span class="starratingcompact">
        <span data-ratingsize="10" data-ratingname="{pagingidattrib}" data-ratingaddress="{bitcoinaddress}"
            data-ratingraw="{rating}" id="ratingposts{diff}" data-ratingsystem={systemscoreclass}
            class="star-rating-compact"></span>
    </span>
    {flair}
    {profilecard}
</span>
`;

var userProfileCompactTemplate=`
<span style="display: none;" id="profileinfo{diff}posts{address}" data-profileaddress="{address}"
    class="profilepreview">
    <div class="profile-card-meta">
        <div class="profile-side-bar">
            <a href="#member?qaddress={address}" onclick="nlc();" class="hnuser">
                <span class="memberpicsmallcompact" style="display:inline;">{profilepicsmall}</span>
            </a>
            {authorsidebar}
        </div>
        <div class="profile-right-contents">
            <a href="#member?qaddress={address}" onclick="nlc();" class="hnuser">
                <span class="member-handle">{handle}</span>
            </a>
            <span class="starrating">
                <span data-ratingsize="16" data-ratingaddress="{bitcoinaddress}" data-ratingraw="{rating}"
                    data-ratingsystem={systemscoreclass} id="ratingprofilecard{diff}" class="star-rating"></span>
            </span>
            {flair}
            <br />
            <a href="#member?qaddress={address}" onclick="nlc();" class="hnuser">
                <span class="member-pagingid">@{pagingid}</span>
            </a>
            <span class="member-onlinestatus age">{onlinestatus}</span>
            <div class="profile-text">
                <span class="profilepreviewtext">{profile}</span>
            </div>
        </div>
    </div>
    <div class="profile-actions">
        <span class="profilepreviewfollowers">
            <a href="#followers?qaddress={address}" onclick="nlc();">{followers} <span
                    data-vavilon="VV0149">followers</span></a>
        </span>
        <span class="profilepreviewfollowers">
            <a href="#following?qaddress={address}" onclick="nlc();">{following} <span
                    data-vavilon="VV0150">following</span></a>
        </span>
        <span class="profilepreviewfollowbutton">
            {followbutton}
        </span>
    </div>
</span>
`;


var nestedPostTemplate= `
<li style="display:{unmuteddisplay};" id="LI{txid}" class="{hightlightedclass}">{replyHTML}{nestedPostHTML}</li>
<li style="display:{muteddisplay};" id="CollapsedLI{txid}" class="collapsed">
    <div class="subtext2">
        <a onclick="uncollapseComment('{txid}');" href="javascript:;">[+] </a>
        {user}
        <span class='subtextbuttons2'>{age}</span>
    </div>
    <div id="scoresexpanded{txid}{diff}" class="scoreexpanded"></div>
    <div id="remembersexpanded{txid}{diff}" class="remembersexpanded"></div>
</li>`;


var notificationCompactTemplate=`
<li class="{highlighted}notificationitem notification{type}" id='notification{txid}'>
    <div class="notificationdetails">
        <div class="notificationminheight">
            <span class="notificationIcon">
                <img src='{iconHTML}'>
            </span>
            <div class="notificationtitlecompact">
                {title}
                <span class="age">{age}</span>
            </div>
            {post}
        </div>
        <hr class="notificationhr" />
    </div>
</li>
`;


var replyTemplate=`
<div class="reply{highlighted}" id="{id}">
    <div class="{blocked} {deleted}">
        <div class="votelinks">{votebuttons}</div>
        <div class="commentdetails">
            <div class="comhead"> <a onclick="collapseComment('{txid}');" href="javascript:;">[-]</a>
                {author}<span class="subtextbuttons2">{likes}{age}</span>{retracted}
            </div>
            <div class="comment">
                <div class="commentbody">
                    {message}
                </div>
                <div class="subtextbuttons2">{replyandtips} {tips}{remembers}</div>
                {replydiv}
            </div>
            <div id="scoresexpanded{txid}{diff}" class="scoreexpanded"></div>
            <div id="remembersexpanded{txid}{diff}" class="remembersexpanded"></div>
        </div>
    </div>
</div>
`;

var replyDivTemplate = `
<div id="reply{txid}{page}" style="display:none">
    <div class="replyprofilepic">
        <a href="#member?qaddress={address}" onclick="nlc();" class="hnuser">
            <span class="memberpicsmallcompact" style="display:inline;">{profilepicsmall}</span>
        </a>
    </div>
    <div class="replyform">
        <br />
        <textarea id="replytext{page}{txid}" rows="3" maxlength="4000"></textarea>
        <br />
        <input id="replybutton{page}{txid}" value="reply" type="submit"
            onclick="sendReply('{txid}','{page}','replystatus{page}{txid}','{sourcenetwork}','{origtxid}');" />
        <input data-vavilon_value="VV0154" id="replystatus{page}{txid}" value="sending..." type="submit"
            style="display:none" disabled />
        <div id="replycompleted{page}{txid}" value=""></div>
    </div>
</div>`;

var remembersTemplate=`
<span {display} onclick="showRemembersExpanded('{txid}','remembersexpanded{txid}{diff}')" id="repostlink{page}{txid}" class="subtextremembers">
    <a href="javascript:"><span id="repostscount{txid}">{repostcount}</span>&hairsp;<span data-vavilon="VV0156">remembers</span></a>
</span>`;

var likesTemplate=`
<span {display} onclick="showScoresExpanded('{txid}','scoresexpanded{txid}{diff}')" id="scores{txid}{diff}" class="subtextlikes">
    <a href="javascript:"><span id="likescount{txid}">{likesbalance}</span>&hairsp;<span data-vavilon="likes">likes</span></a>
</span>`;

var tipsTemplate=`
<span {display} onclick="showScoresExpanded('{txid}','scoresexpanded{txid}{diff}')" id="scores{txid}{diff}" class="subtexttips">
    <a href="javascript:"><span id="tipscount{txid}" data-amount="{tips}">{balancestring}</span>&hairsp;<span data-vavilon="tips">tips</span></a>
</span>`;


var replyAndTipsTemplate = `
<a data-vavilon="VV0155" id="replylink{txid}{page}" onclick="showReplyBox('{txid}{page}');"
    href="javascript:;">reply</a>
<!--<a data-vavilon="VV0157" id="tiplink{page}{txid}" onclick="showTipBox('{page}{txid}');" href="javascript:;">tip</a>-->

<a id="tiplinkposts{diff}{txid}" class="btn-icon" onclick="dropDownMenuAction(this);">
    <span data-vavilon="VV0157">tip</span><div class="dropdown-content remember-dropdown" id="dropdown-content{diff}{txid}" style="position: relative;">
        <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',     10000000)"><span data-vavilon="remember">0.1
            M3M ({MEMUSD1C})</span></a>
        <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',    100000000)"><span data-vavilon="remember">1
                M3M ({MEMUSD1})</span></a>
        <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',    500000000)"><span data-vavilon="remember">5
                M3M ({MEMUSD5})</span></a>
        <a onclick="likePost('{txid}','{origtxid}','{bitcoinaddress}',   1000000000)"><span data-vavilon="remember">10
                M3M ({MEMUSD10})</span></a>
        <a
            onclick="if (confirm('Tip 20 M3M ({MEMUSD20})?')){likePost('{txid}','{origtxid}','{bitcoinaddress}',    2000000000);}"><span
                data-vavilon="remember">20 M3M ({MEMUSD20})</span></a>
        <a
            onclick="if (confirm('Tip 100 M3M ({MEMUSD100})?')){likePost('{txid}','{origtxid}','{bitcoinaddress}', 10000000000);}"><span
                data-vavilon="remember">100 M3M ({MEMUSD100})</span></a>
    </div></a>
<a data-vavilon="VV0158" id="quotelink{page}{txid}" href="#new?txid={origtxid}">quote</a>
<a data-vavilon="VV0160" class="permalink" id="permalink{page}{txid}" href="{permalink}">permalink</a>
<!--<a data-vavilon="VV0161" id="hidepostlink{page}{txid}" onclick="sendHidePost('{txid}');" href="javascript:;">flag</a>

<a data-vavilon="VV0159" id="morelink{page}{txid}" onclick="showMore('more{page}{txid}','morelink{page}{txid}');"
    href="javascript:;">+more</a>
<span id="more{page}{txid}" style="display:none">
    {articlelink2}
    {sourceNetworkHTML}
    {hideuser}
</span>-->

<span id="tipbox{page}{txid}" style="display:none">
    <input id="tipamount{page}{txid}" type="number" value="0" min="0" style="width: 6em;" step="1000" />
    <input data-vavilon_value="VV0162" id="tipbutton{page}{txid}" value="tip" type="submit"
        onclick="sendTip('{txid}','{origtxid}','{bitcoinaddress}','{page}');" />
    <input data-vavilon_value="VV0163" id="tipstatus{page}{txid}" value="sending" type="submit" style="display:none"
        disabled />
</span>`;


var mapPostTemplate=`
<div id="newgeopost" class="bgcolor">
    <input id="lat" size="10" type="hidden" value="{lat}">
    <input id="lon" size="10" type="hidden" value="{lng}">
    <input id="geohash" size="15" type="hidden">
    <div class="replyprofilepic">
        <a href="#member?qaddress={address}" onclick="nlc();" class="hnuser">
            <span class="memberpicsmallcompact" style="display:inline;">{profilepicsmall}</span>
        </a>
    </div>
    <textarea maxlength="4000" class="geoposttextarea" id="newgeopostta" name="text" rows="4"></textarea><br />
    <input data-vavilon_value="VV0164" id="newpostgeobutton" value="Post" type="submit" onclick="geopost();">
    <input data-vavilon_value="VV0165" id="newpostgeostatus" style="display: none;" value="Sending . . ." type="submit"
        disabled>
    <div id="newpostgeocompleted"></div>
</div>`;
var lastidprovider = 'https://identity.bitclout.com';
function bitcloutlogin(idprovider) {
  lastidprovider = idprovider;
  insertBitcloutIdentityFrame(idprovider);
  identityWindow = window.open(
    idprovider + "/log-in?accessLevelRequest=3",
    null,
    "toolbar=no, width=800, height=1000, top=0, left=0"
  );
}

function insertBitcloutIdentityFrame(idprovider) {
  document.getElementById('bitcloutframe').innerHTML = `<iframe id="identity" frameborder="0" class="" src="${idprovider}/embed?v=2" style="height: 100vh; width: 100vw; display: none;"></iframe>`;
}

function showBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').style.display = 'block';
}

function hideBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').style.display = 'none';
}


function bitcloutlogout() {
  /*identityWindow = window.open(
    "https://identity.bitclout.com/logout?publicKey="+bitCloutUser,
    null,
    "toolbar=no, width=800, height=1000, top=0, left=0"
  );*/
  bitCloutUser = null;
  bitCloutUserData = null;
  bitCloutIDProvider = null;
}

function handleInit(e) {
  if (!bcinit) {
    bcinit = true;
    iframe = document.getElementById("identity");
    //uniqueid = e.data.id;

    postMessage({
      id: 'testpermissions',
      service: 'identity',
      method: 'info'
    });

    for (const e of pendingRequests) {
      postMessage(e);
    }

    pendingRequests = [];
  }
  respond(e.source, e.data.id, {});
}

function getBitCloutLoginFromLocalStorage() {
  bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");
  try {
    bitCloutUserData = JSON.parse(localStorageGet(localStorageSafe, "bitcloutuserdata"));
  } catch (err) {
    console.log("bitCloutUserData not available - should not happen!");
  }
  bitCloutIDProvider = localStorageGet(localStorageSafe, "bitcloutidprovider");
  if (bitCloutIDProvider) {
    bitCloutIDProvider = bitCloutIDProvider.replace(/\"/g, '');
  }
  if (!bitCloutIDProvider) { //legacy
    bitCloutIDProvider = 'https://identity.bitclout.com';
  }

  if (bitCloutUserData) {
    insertBitcloutIdentityFrame(bitCloutIDProvider);
  }
}

function handleLoginBitclout(payload) {
  console.log("Handle Login");
  console.log(payload);

  if (identityWindow) {
    identityWindow.close();
    identityWindow = null;
  }

  if (payload && payload.publicKeyAdded) {
    bitCloutUser = payload.publicKeyAdded;
    bitCloutIDProvider = lastidprovider;
    if (payload.users[bitCloutUser]) {
      bitCloutUserData = payload.users[bitCloutUser];
    } else {
      alert(bitCloutIDProvider + " did not send back the relevant payload.users in the payload. This may be a read only login.");
    }
    localStorageSet(localStorageSafe, "bitcloutuser", bitCloutUser);
    localStorageSet(localStorageSafe, "bitcloutuserdata", JSON.stringify(bitCloutUserData));
    localStorageSet(localStorageSafe, "bitcloutidprovider", bitCloutIDProvider);
    trylogin(payload.publicKeyAdded);
  }
}

function respond(e, t, n) {
  e.postMessage(
    {
      id: t,
      service: "identity",
      payload: n,
    },
    "*"
  );
}

function postMessage(e) {
  console.log("post message: ");
  console.log(e);

  bcinit
    ? this.iframe.contentWindow.postMessage(e, "*")
    : pendingRequests.push(e);
}

// const childWindow = document.getElementById('identity').contentWindow;
window.addEventListener("message", (message) => {
  console.log("bitclout message: ");
  console.log(message);

  const {
    data: { id: id, method: method, payload: payload },
  } = message;

  console.log(id);
  console.log(method);
  console.log(payload);
  //localStorage.setItem("identity", JSON.stringify(payload));

  if (method == "initialize") {
    handleInit(message);
  } else if (method == "storageGranted") {
    if (payload.hasStorageAccess == true) {
      hideBitcloutIdentityFrame();
    }
  } else if (id == "testpermissions") {
    if (payload.hasStorageAccess == false) {
      showBitcloutIdentityFrame();
    }
    if (payload.browserSupported == false) {
      alert("This browser does not support BitClout Identity login.");
    }
  } else if (method == "login") {
    handleLoginBitclout(payload);
  } else if (payload && payload.signedTransactionHex) {
    console.log(payload.signedTransactionHex);
    submitSignedTransaction(payload.signedTransactionHex, id);
  } else if (payload && payload.decryptedHexes) {
    for (var key in payload.decryptedHexes) {
      identityresponses.set(id, payload.decryptedHexes[key]);
    }
  } else if (payload && payload.approvalRequired) {
    if (!alertShown) {
      alert("Your OS/Browser may not be compatible with Write Mode BitClout Identity Service - identity.bitclout.com returned error " + JSON.stringify(payload));
      alertShown = true;
    }
    identityresponses.set(id, "identity.bitclout.com returned error " + JSON.stringify(payload));
  } else if(payload && payload.encryptedMessage) {
    identityresponses.set(id, payload.encryptedMessage);
  } else {
    identityresponses.set(id, JSON.stringify(payload));
  }

});

var alertShown = false;

function submitSignedTransaction(signedTrx, id) {
  var submitpayload = `{"TransactionHex":"` + signedTrx + `"}`;
  var url2 = dropdowns.txbroadcastserver + "bitclout?bcaction=submit-transaction";
  getJSON(url2, "&payload=" + encodeURIComponent(submitpayload)).then(function (data) {
    if (!data) {
      serverresponses.set(id, "Error no data");
      return;
    }
    console.log(data);

    if (data.error) {
      serverresponses.set(id, data.error);
      return;
    }

    serverresponses.set(id, data.TxnHashHex);
  });
}

async function checkIfBitcloutUser(pubkeyhex1) {
  var bcAddress = await pubkeyToBCaddress(pubkeyhex1);
  //var submitpayload = `{"PublicKeyBase58Check":"` + bcAddress + `"}`;
  //var url2 = dropdowns.txbroadcastserver + "bitclout?bcaction=get-single-profile";
  var submitpayload = `{"PublicKeysBase58Check":["` + bcAddress + `"]}`;
  var url2 = dropdowns.txbroadcastserver + "bitclout?bcaction=get-users-stateless";
  
  getJSON(url2, "&payload=" + encodeURIComponent(submitpayload)).then(function (data) {
    console.log(data);
    if (data.UserList[0].BalanceNanos > 0) {
      //This is a BC user
      bitCloutUser = bcAddress;
      localStorageSet(localStorageSafe, "bitcloutuser", bitCloutUser);
    }
  });
}

var bcinit = false;
var iframe = null;
var pendingRequests = [];
var identityWindow = null;

var bitCloutUser = null;
var bitCloutUserData = null;
var bitCloutIDProvider = null;

let identityresponses = new Map();
let serverresponses = new Map();




async function putBitCloutDecryptedMessageInElement(message, elementid, publicKeySender) {
  var decryptedMessage = await bitcloutDecryptMessage(message, publicKeySender);
  document.getElementById(elementid).textContent = decryptedMessage;
}

async function bitcloutDecryptMessage(message, publicKeySender) {

  var uniqueid = getRandomInt(1000000000);

  //Not sure if message is v1 or v2, try both and the wrong one should error out harmlessly 

  //v1
  postMessage({
    id: uniqueid,
    service: 'identity',
    method: 'decrypt',
    payload: {
      accessLevel: bitCloutUserData.accessLevel,
      accessLevelHmac: bitCloutUserData.accessLevelHmac,
      encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
      encryptedHexes: [
        message
      ]
    }
  });

  //publicKeySender
  let messageObj = {
    EncryptedHex: message,
    IsSender: false,
    PublicKey: await pubkeyToBCaddress(publicKeySender),
    V2: true
  }

  //v2
  postMessage({
    id: uniqueid,
    service: 'identity',
    method: 'decrypt',
    payload: {
      accessLevel: bitCloutUserData.accessLevel,
      accessLevelHmac: bitCloutUserData.accessLevelHmac,
      encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
      encryptedMessages: [
        messageObj
      ]
    }
  });


  return await waitForResponse(uniqueid);

}

async function waitForResponse(key) {
  for (var i = 0; i < 15; i++) {
    if (identityresponses.has(key)) {
      return identityresponses.get(key);
    }
    await sleep(200);
  }
  //alert("Error: identity.bitclout.com Service did not return a value.");
  throw Error("Error: identity.bitclout.com Service did not return a value.");
}

async function waitForServerResponse(key) {
  for (var i = 0; i < 250; i++) {
    if (serverresponses.has(key)) {
      return serverresponses.get(key);
    }
    await sleep(200);
  }
  //alert("Error: identity.bitclout.com Service did not return a value.");
  throw Error("Error: bitclout.com Server did not return a value.");
}

async function sendBitCloutTransaction(payload, action, divForStatus) {
  let confirmation = '';
  let retrywait = 0;
  do {
    if (retrywait > 0) {
      if (divForStatus) {
        let statusElement = document.getElementById(divForStatus);
        if (statusElement) statusElement.value = "Retry in ms:" + retrywait;
      }
      await sleep(retrywait);
    }

    try {
      confirmation = await constructAndSendBitCloutTransaction(payload, action, divForStatus);
    } catch (err) {
      console.log("error sending:" + err);
      //sometime may error out, means we'll try again.
    }

    if (confirmation && confirmation.includes('RuleErrorFollowingNonexistentProfile')) {
      //alert('Oops. This user does not exist on BitClout. Cannot Follow. RuleErrorFollowingNonexistentProfile');
      //throw new Error('RuleErrorFollowingNonexistentProfile');
      return confirmation;
    }

    if (confirmation && confirmation.includes('RuleErrorCannotLikeNonexistentPost')) {
      //alert('Oops. This post no longer exists on BitClout. Cannot like it. RuleErrorCannotLikeNonexistentPost');
      //throw new Error('RuleErrorCannotLikeNonexistentPost');
      return confirmation;
    }

    if (confirmation && confirmation.includes('RuleErrorSubmitPostParentNotFound')) {
      //alert('Oops. This post no longer exists on BitClout. Cannot reply to it. RuleErrorSubmitPostParentNotFound');
      throw new Error('RuleErrorSubmitPostParentNotFound');
    }


    retrywait = (retrywait * 1.5) + 2000;
  } while (!confirmation || confirmation.length != 64); //txid should be 64 chars in length

  return confirmation;
}


async function constructAndSendBitCloutTransaction(payload, action, divForStatus) {

  if (divForStatus) {
    var statusElement = document.getElementById(divForStatus);
  }
  var uniqueid = getRandomInt(1000000000);
  var url = dropdowns.txbroadcastserver + "bitclout?bcaction=" + action;
  //var url = dropdowns.txbroadcastserver + "bitclout";
  if (statusElement) statusElement.value = "Constructing BitClout Tx";

  getJSON(url, "&payload=" + encodeURIComponent(payload)).then(async function (data) {

    if (!data) {
      serverresponses.set(uniqueid, "Error: No Data");
      return;
    }

    //Now sign the transaction
    if (bitCloutUserData) {
      //Use identity
      if (statusElement) statusElement.value = "Signing Tx With Identity";
      postMessage({
        id: uniqueid,
        service: 'identity',
        method: 'sign',
        payload: {
          accessLevel: bitCloutUserData.accessLevel,
          accessLevelHmac: bitCloutUserData.accessLevelHmac,
          encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
          transactionHex: data.TransactionHex
        }
      });
    } else {
      //Use privkey to sign
      if (statusElement) statusElement.value = "Signing Tx With Key";
      var signedTx = await signTransaction(data.TransactionHex);
      submitSignedTransaction(signedTx, uniqueid, divForStatus);
    }
  }).catch(err => serverresponses.set(uniqueid, err.message));

  return await waitForServerResponse(uniqueid);
}

async function bitCloutLikePost(likedPostHashHex) {
  //First get the unsigned tx
  var payload = `{"ReaderPublicKeyBase58Check":"` + bitCloutUser + `","LikedPostHashHex":"` + likedPostHashHex + `","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`;
  return await sendBitCloutTransaction(payload, "create-like-stateless");
}

async function bitCloutPinPost(pinPostHashHex, pubkey) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: pinPostHashHex,
    BodyObj: { Body: `pinpost https://member.cash/ba/${pubkey}` },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Pinpost: "true" };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}


async function sendBitCloutFollow(followpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ await pubkeyToBCaddress(followpubkey) + `",
      "IsUnfollow      ":false,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}

async function sendBitCloutUnFollow(unfollowpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ await pubkeyToBCaddress(unfollowpubkey) + `",
      "IsUnfollow":true,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}


async function sendBitCloutSub(topicHOSTILE) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'subscribe ' + topicHOSTILE },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Subscribe: topicHOSTILE };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutUnSub(topicHOSTILE) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'unsubscribe ' + topicHOSTILE },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Unsubscribe: topicHOSTILE };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}



async function sendBitCloutMute(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'mute ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Mute: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutUnMute(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'unmute ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { UnMute: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

/*
async function sendBitCloutFollow(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'follow ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Follow: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutUnFollow(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'unfollow ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { UnFollow: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}*/


async function sendBitCloutRating(posttext, topic, divForStatus, successFunction, postExtraData) {
  //var bcAddress=pubkeyToBCaddress(followpubkey);
  if (topic) {
    posttext = posttext + " #" + topic;
  }
  var body = { Body: posttext, ImageURLs: [] };
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: body,
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = postExtraData;

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}



async function sendBitCloutReply(txid, replytext, divForStatus, successFunction, parentSourceNetwork, membertxid, imageURL=null) {
  let postExtraData;
  /*if (parentSourceNetwork != 1) {
    //Bitclout does not allow a reply to post that does not exist on its network
    //We'll send reply to a different post, and make a note of the real reply below
    postExtraData = { Overideretxid: txid };
    txid = 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3';
  }*/
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };

  replytext="https://member.cash/p/"+membertxid.substr(0,10);

  if (parentSourceNetwork != 1) {
    payload.PostExtraData = { Overideretxid: txid };
    //replytext="https://member.cash/p/"+txid.substr(0,10)+"\n\n"+replytext;
    //replytext="https://member.cash/p/"+txid.substr(0,10);
  }else{
    payload.ParentStakeID = txid;
  }

  var body = { Body: replytext, ImageURLs: [] };
  if(imageURL){body.ImageURLs[0]=imageURL;}
  payload.BodyObj = body;
  
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if (successFunction) { successFunction(txid, replytext) };
  return txid;
}


//todo check if special characters work in posttext
async function sendBitCloutPost(posttext, topic, divForStatus, successFunction, postExtraData, imageURL=null) {
  if (topic) {
    posttext = posttext + " #" + topic;
  }
  var body = { Body: posttext, ImageURLs: [] };
  if(imageURL){body.ImageURLs[0]=imageURL;}
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };

  if (postExtraData) {
    payload.PostExtraData = postExtraData;
  }
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if (successFunction) { successFunction(txid, posttext) };
  return txid;
}

async function sendBitCloutQuotePost(posttext, topic, txid, divForStatus, successFunction, network, imageURL=null) {
  if (network == 1) {
    if (topic) {
      posttext = posttext + " #" + topic;
    }
    var body = { Body: posttext, ImageURLs: [] };
    if(imageURL){body.ImageURLs[0]=imageURL;}
    var payload = {
      UpdaterPublicKeyBase58Check: bitCloutUser,
      RepostedPostHashHex: txid,
      BodyObj: body,
      IsHidden: false,
      MinFeeRateNanosPerKB: 1000
    };
    var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
    if (successFunction) { successFunction(txid, posttext) };
    return txid;
  } else {
    return await sendBitCloutPost(posttext + "\n\nhttps://member.cash/p/" + txid.substr(0, 10), topic, divForStatus, successFunction, null);
  }
}

async function sendBitCloutPostLong(posttext, postbody, topic, divForStatus, successFunction, imageURL=null) {
  var txid = await sendBitCloutPost(posttext, topic, divForStatus, null, null, imageURL);
  if (postbody) {
    return await sendBitCloutReply(txid, postbody, divForStatus, successFunction, imageURL);
  } else {
    if (successFunction) { successFunction(txid, posttext) };
    return txid;
  }
}

async function bitCloutRePost(txid, sourcenetwork) {
  var body = {};
  if (sourcenetwork == 1) {
    var payload = {
      UpdaterPublicKeyBase58Check: bitCloutUser,
      RepostedPostHashHex: txid,
      BodyObj: body,
      IsHidden: false,
      MinFeeRateNanosPerKB: 1000
    };
    return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post");
  } else {
    return await sendBitCloutPost("https://member.cash/p/" + txid.substr(0, 10), '', null, null, null);
  }
}


async function sendBitCloutPrivateMessage(messageRecipientpubkey, text, divForStatus, successFunction, preEncryptedMessage) {

  let recipient = await pubkeyToBCaddress(messageRecipientpubkey);
  let payload;
  let encryptedMessage;

  if (preEncryptedMessage) {
    encryptedMessage = preEncryptedMessage;
  } else if (bitCloutUserData) {
    //First encrypt the message with identity
    let uniqueid = getRandomInt(1000000000);
    if (divForStatus) divForStatus.value = "Encrypting Message With Identity";
    postMessage({
      id: uniqueid,
      service: 'identity',
      method: 'encrypt',
      payload: {
        accessLevel: bitCloutUserData.accessLevel,
        accessLevelHmac: bitCloutUserData.accessLevelHmac,
        encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
        recipientPublicKey: recipient,
        message: text
      }
    });
    //Wait for reply
    encryptedMessage = await waitForResponse(uniqueid);
  }

  payload = {
    SenderPublicKeyBase58Check: bitCloutUser,
    RecipientPublicKeyBase58Check: recipient,
    EncryptedMessageText: encryptedMessage,
    MinFeeRateNanosPerKB: 1000
  };

  /*} else {
    //message signed by server with recpients public key only - 
    payload = {
      SenderPublicKeyBase58Check: bitCloutUser,
      RecipientPublicKeyBase58Check: recipient,
      MessageText: text,
      MinFeeRateNanosPerKB: 1000
    };
  }*/

  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "send-message-stateless", divForStatus);
  if (successFunction) { successFunction(txid, '') };
  return txid;
}

async function pubkeyToBCaddress(publickey) {
  return window.bs58check.encode(new Buffer('cd1400' + san(publickey), 'hex'));
}

uvarint64ToBuf = function (uint) {
  var result = [];
  while (uint >= 0x80) {
    result.push((uint & 0xFF) | 0x80);
    uint >>>= 7;
  }
  result.push(uint | 0);
  return new Buffer(result);
};

async function signTransaction(transactionHex) {
  if (!eccryptoJs) {
    await loadScript("js/lib/eccrypto-js.js");
  }
  //might be possible to remove this lib and use the eccryptoJs lib instead
  if (!window.elliptic) {
    await loadScript("js/lib/elliptic.min.js");
  }

  var ec = new window.elliptic.ec('secp256k1');
  privateKey = ec.keyFromPrivate(privkeyhex);

  var transactionBytes = new Buffer(transactionHex, 'hex');
  var transactionHash = await eccryptoJs.sha256(await eccryptoJs.sha256(transactionBytes));

  var signature = privateKey.sign(transactionHash);
  var signatureBytes = new Buffer(signature.toDER());
  var signatureLength = uvarint64ToBuf(signatureBytes.length);
  var signedTransactionBytes = Buffer.concat([
    transactionBytes.slice(0, -1),
    signatureLength,
    signatureBytes,
  ]);
  return signedTransactionBytes.toString('hex');
};

function isBitCloutUser() {
  return (bitCloutUser);
}

function isBitCloutIdentityUser() {
  return (bitCloutUserData);
}
"use strict";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function timeSince(timestamp, compress) {
  let date = new Date(timestamp * 1000);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("y", "y") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("yearsago", "years ago"));
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("mo", "mo") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("monthsago", "months ago"));
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("d", "d") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("daysago", "days ago"));
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("h", "h") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("hoursago", "hours ago"));
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("m", "m") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("minutesago", "minutes ago"));
  }
  return (compress ? Math.floor(seconds) + getSafeTranslation("s", "s") : " " + getSafeTranslation("hace", "") + Math.floor(seconds) + " " + getSafeTranslation("secondsago", "seconds ago"));
}

var ordinal_suffix_of = function (i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

var getJSON = function (url, postparams, oFormElement) {
  //force a reload by appending time so no cached versions
  if (url.contains('?')) {
    url += "&r=" + (new Date().getTime() % 100000);
  }
  try {
    updateStatus(getSafeTranslation('loading', "loading") + " " + url);
  } catch (noworries) { }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    addListeners(xhr);
    xhr.onerror = function (e) {
      reject(xhr.status);
    };

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };

    xhr.responseType = 'json';
    if (postparams || oFormElement) {
      xhr.open('post', url, true);

      if (oFormElement) {
        xhr.open(oFormElement.method, oFormElement.getAttribute("action"));
        xhr.send(new FormData(oFormElement));
      } else {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(postparams);
      }
    } else {
      xhr.open('get', url, true);
      xhr.send();
    }

  });
};

function addListeners(xhr) {
  //xhr.addEventListener('loadstart', handleEvent);
  //xhr.addEventListener('load', handleEvent);
  //xhr.addEventListener('loadend', handleEvent);
  xhr.addEventListener('progress', handleEvent);
  //xhr.addEventListener('error', handleEvent);
  xhr.addEventListener('abort', handleEvent);
}

function handleEvent(e) {
  updateStatus(`${e.type}: ${e.loaded} ` + getSafeTranslation('bytestransferred', `bytes transferred`));
}



function ds(input) {
  //if (input === undefined) { return ""; };
  try {
    //If this error out 'input.replace not a number' probably input is not a string type
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    input = input.replace(/"/g, '&quot;');
    input = input.replace(/'/g, '&#x27;');
  } catch (e) {
    //Anything funky goes on, we'll return safe empty string
    return "";
  }
  return input;
}

function dslite(input) {
  //if (input === undefined) { return ""; };
  try {
    //If this error out 'input.replace not a number' probably input is not a string type
    input = input.replace(/&/g, '&amp;');
    //input = input.replace(/</g, '&lt;');
    //input = input.replace(/>/g, '&gt;');
    input = input.replace(/"/g, '&quot;');
    input = input.replace(/'/g, '&#x27;');
  } catch (e) {
    //Anything funky goes on, we'll return safe empty string
    return "";
  }
  return input;
}

function quoteattr(s, preserveCR) {
  preserveCR = preserveCR ? '&#13;' : '\n';
  return ('' + s) /* Forces the conversion to string. */
    .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
    .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    /*
    You may add other replacements here for HTML only 
    (but it's not necessary).
    Or for XML, only if the named entities are defined in its DTD.
    */
    .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
    .replace(/[\r\n]/g, preserveCR);
  ;
}


var debuginfo = "";

function updateStatus(message) {
  document.getElementById("status").innerHTML = message;
  debuginfo = message + '\n' + debuginfo;
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function san(input) {
  return sane(input);
}

function sanhl(input) { //hive link
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9\-_\./]/g, '');
}
/*
function sanitizeAlphanumeric(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9]/g, '');
}

function sanitizeAlphanumericUnderscore(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9_]/g, '');
}*/

function sane(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9\-_\.]/g, '');
}

function unicodeEscape(str) {
  if (str == undefined) return "";
  var result = '', index = 0, charCode, escape;
  while (!isNaN(charCode = str.charCodeAt(index++))) {
    escape = charCode.toString(16);
    result += charCode < 256
      ? '\\x' + (charCode > 15 ? '' : '0') + escape
      : '\\u' + ('0000' + escape).slice(-4);
  }
  return result;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getHeight() {
  var myWidth = 0, myHeight = 0;
  if (typeof (window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}

function getWidth() {
  var myWidth = 0, myHeight = 0;
  if (typeof (window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myWidth;
}

String.prototype.contains = function (segment) { return this.indexOf(segment) !== -1; };

function safeGPBN(name) {
  return sane(getParameterByName(name));
}

function numberGPBN(name) {
  return Number(getParameterByName(name));
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function scrollToElement(name) {
  var element = document.getElementById(name);
  if (element != undefined) {
    ScrollToResolver(element);
  }
}

function ScrollToResolver(elem) {
  var jump = parseInt((elem.getBoundingClientRect().top - 50) * .2);
  document.body.scrollTop += jump;
  document.documentElement.scrollTop += jump;
  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
    elem.lastjump = Math.abs(jump);
    setTimeout(function () { ScrollToResolver(elem); }, "100");
  } else {
    elem.lastjump = null;
  }
}

function localStorageGet(theSO, itemName) {
  try {
    let theString = theSO.getItem(itemName);
    return theString;
  } catch (err) {
    return null;
  }
}

function localStorageSet(theSO, itemName, theString) {
  try {
    theSO.setItem(itemName, theString);
    return true;
  } catch (err) {
    return false;
  }
}


function satsToUSD(sats) {
  return sats * numbers.usdrate / 10000;
}

function satsToUSDString(sats) {
  return usdString(satsToUSD(sats), true);
}

function usdString(total, includeSymbol) {
  var usd = Number(total / 10000).toFixed(2);
  if (usd < 1) {
    return (usd * 100).toFixed(0) + "¢";
  } else {
    return "$" + usd;
  }
}

function updateUSDRate(data) {
  let element=document.getElementById('usdrate');
  if (data && data[0] && data[0].usdrate && element) { 
    element.value = data[0].usdrate;
    updateSettingsNumber('usdrate');
  }
}

function balanceString(total) {
  if (numbers.usdrate === undefined || numbers.usdrate === 0) {
    //var balString = (Number(total) / 1000).toFixed(3);
    //balString = Number(balString.substr(0, balString.length - 4)).toLocaleString() + "<span class='sats'>" + balString.substr(balString.length - 3, 3) + "</span>";
    var balString = "" + Number(total);
    if (balString.length > 3) {
      balString = Number(balString.substr(0, balString.length - 3)).toLocaleString() + "k";
    } else {
      balString = Number(total);
    }
  }
  var usd = ((Number(total) * numbers.usdrate) / 100000000).toFixed(2);
  if (usd < 1) {
    return (usd * 100).toFixed(0) + "¢";
  } else {
    return "$" + usd;
  }
}

function detectMultipleIDS() {
  //console.log("Run Multiple ID check");
  var elms = document.getElementsByTagName("*"), i, len, ids = {}, id;
  for (i = 0, len = elms.length; i < len; i += 1) {
    id = elms[i].id || null;
    if (id) {
      ids[id] = ids.hasOwnProperty(id) ? ids[id] += 1 : 0;
    }
  }
  for (id in ids) {
    if (ids.hasOwnProperty(id)) {
      if (ids[id]) {
        console.warn("Multiple IDs #" + id);
      }
    }
  }
}


// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    //don't set target for internal links, like member profile links
    if (!node.outerHTML.startsWith('<a href="#member')) {
      node.setAttribute('target', '_blank');
      // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('onclick', 'event.stopPropagation();');
    }
  }
  // set non-HTML/MathML links to xlink:show=new
  if (!node.hasAttribute('target')
    && (node.hasAttribute('xlink:href')
      || node.hasAttribute('href'))) {
    node.setAttribute('xlink:show', 'new');
  }
});


//Twitter stuff, doesn't seem to be working
/*
window.$ = document.querySelectorAll.bind(document);

window.onmessage = (event) => {
  console.log(`Received message: ${event.data}`);
  var oe = e.originalEvent;
  if (oe.origin != "https://twitframe.com")
      return;

  if (oe.data.height && oe.data.element.match(/^tweet_/))
      $("#" + oe.data.element).css("height", parseInt(oe.data.height) + "px");

};*/

/* listen for the return message once the tweet has been loaded */

function listenForTwitFrameResizes() {
  /* find all iframes with ids starting with "tweet_" */
  var tweetIframes = document.querySelectorAll("*[id^='tweet_']");
  tweetIframes.forEach(element => {
    //onload doesn't seem to always have the tweet loaded, so return 133 as height
    //maybe could use readyState instead.
    element.onload = function () {
      this.contentWindow.postMessage({ element: this.id, query: "height" }, "https://twitframe.com");
    };
  });

}

/* listen for the return message once the tweet has been loaded */
window.onmessage = (oe) => {
  console.log("twit message: ");
  console.log(oe);
  if (oe.origin != "https://twitframe.com")
    return;
  if (oe.data.height && oe.data.element.match(/^tweet_/)) {
    try {
      //console.log("element "+oe.data.element);
      //console.log("prev height "+document.getElementById(oe.data.element).style.height);
      //console.log("new height "+parseInt(oe.data.height) + "px");
      if (parseInt(oe.data.height) < 140) {
        console.log("Error, twitter resize height must be 140 or greater.");

        /*
        //This attempt to repost the message doesn't work. I don't know why
        var that=document.getElementById(oe.data.element);
        setTimeout(function(){
          that.contentWindow.postMessage({ element: that.id, query: "height" }, "https://twitframe.com");
        },1000);*/
        return;
      }
      document.getElementById(oe.data.element).style.height = parseInt(oe.data.height) + "px";
    } catch (err) {
      console.log("Tweet frame resize error: Probably due to running from filesystem: " + err);
    }
  }
}

//short delay showing profile card
var delay = function (elem, callback, target) {
  var timeout = null;
  elem.onmouseover = function () {
    // Set timeout to be a timer which will invoke callback after 1s
    timeout = setTimeout(function () { callback(target) }, 1000);
  };

  elem.onmouseout = function () {
    // Clear any timers set to timeout
    clearTimeout(timeout);
  }
};

//replace items in a template
function templateReplace(templateString, obj, skipdebug) {
  //var templateString=document.getElementById(template).innerHTML;
  return templateString.replace(/\{(\w+)\}/g, function (_, k) {
    if (obj[k] == undefined && !skipdebug) {
      console.log("missing template value:" + k);
      //console.log(templateString);
    }
    return obj[k];
  });
}

function loadScript(src) {
  //console.log("background loading " + src);
  return new Promise(function (resolve, reject) {
    var s;
    s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}


function getBrowserLanguageCode() {
  const zhTraditional = ["zh-hk", "zh-tw", "zh-hant"];
  const zhSimplified = ["zh-cn", "zh-sg", "zh-hans"];
  const allowedInput = ["af", "an", "ar", "as", "azb", "az", "bal", "bel",
    "bg", "bn", "bo", "bs", "ca", "ckb", "cs", "cy", "da", "de", "el",
    "en", "eo", "es", "et", "eu", "fa", "fi", "fo", "fr", "fy", "ga", "gd",
    "gl", "gu", "haz", "he", "hi", "hr", "hsb", "hu", "id", "is", "it",
    "ja", "jv", "kab", "ka", "kir", "kk", "km", "kmr", "kn", "ko", "lt",
    "lv", "me", "mg", "mk", "ml", "mn", "mr", "ms", "mya", "nb", "ne",
    "nl", "nn", "os", "pa", "pl", "ps", "pt", "ro", "ru", "si", "sk",
    "skr", "sl", "snd", "so", "sq", "sr", "sv", "sw", "szl", "ta", "te",
    "th", "tl", "tr", "ug", "uk", "ur", "uz", "vi", "zh", "zht"];
  var language = (window.navigator.language || window.browserLanguage).toLowerCase();

  if (zhSimplified.includes(language)) {
    language = 'zh';
  } else if (zhTraditional.includes(language)) {
    language = 'zh'; //we only support zh atm
  } else {
    language = language.substring(0, 3).split('-')[0]
  }
  // As the language is controlled by the users browser,
  // the input is restricted to a known set of possibilities
  const src = allowedInput.includes(language) ? language : 'en';
  return src;
}

function changeClass(element, newClass) {
  element.className = newClass;
}

//Fade in, move Fareed

function elementInViewport2(ele, newclass) {
  if (ele) {
    var elements = Array.from(ele);
    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];
      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      if (
        top < window.pageYOffset + window.innerHeight &&
        left < window.pageXOffset + window.innerWidth &&
        top + height > window.pageYOffset &&
        left + width > window.pageXOffset
      ) {
        elements[i].setAttribute('class', newclass);
      }
    }
  }
}

function setVisibleContentFinal() {
  if (document.getElementsByClassName('post-list-li')) {
    elementInViewport2(document.getElementsByClassName('post-list-li'), 'post-list-final');
  }
}


//When item is scrolled into view, it is set to fade in
window.addEventListener('scroll', function (e) {
  elementInViewport2(document.getElementsByClassName('post-list-li'), 'post-list-item');
});


function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      updateStatus("Copied to clipboard.");
      return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    }
    catch (ex) {
      updateStatus("Copy to clipboard failed.");
      console.warn("Copy to clipboard failed.", ex);
      return false;
    }
    finally {
      document.body.removeChild(textarea);
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function outOfFive(theRating) {
  theRating = (Number(theRating) / 64) + 1;
  theRating = Math.round(theRating * 10) / 10;
  return theRating;
}

function transposeStarRating(rating) {
  var transposed = 0;
  switch (rating) {
    case 1:
      transposed = 1;
      break;
    case 2:
      transposed = 64;
      break;
    case 3:
      transposed = 128;
      break;
    case 4:
      transposed = 192;
      break;
    case 5:
      transposed = 255;
      break;
  }
  return transposed;
}

function dropDownMenuAction(that) {
  //var ddmenu = that.parentElement.querySelector('#dropdown-content');
  var ddmenu = that.parentElement.querySelector("[id^='dropdown-content']");

  ddmenu.style.display = 'block';
  var ddcover = document.getElementById('ddcover');
  ddcover.style.display = 'block';
  ddcover.onclick = ddmenu.onclick = function () { ddmenu.style.display = ddcover.style.display = 'none'; };
}

function getSatsWithInterest(principle, utxoheight, chainheight) {
  if (utxoheight == 0 || !utxoheight) {//not in blockchain yet. unconfirmed, no interest earned yet
    return principle;
  }
  if (!chainheight) {//we don't know chainheight - we must or we may lose interest
    throw Error('Chainheight not found - we must know this or may lose interest');
  }
  //Interest rate on each block 1+(1/2^22)
  let blocksheld = chainheight - utxoheight;
  let withInterest = principle * Math.pow(1 + (1 / Math.pow(2, 22)), blocksheld);
  return Math.floor(withInterest);
}

window.document.addEventListener('miningtxreceived', handleMiningTXReceivedEvent, false);
function handleMiningTXReceivedEvent(e) {
  //note - making a guess here the vout is 0, 50/50 chance. could get the full transaction data from server and parse but this should do for now
  tq.addUTXO(e.detail.data.txid, 0, e.detail.data.satoshis, 0);
  //addUTXO(txid: string, vout: number, satoshis: number, height: number)
  //do proper update after 5 seconds, utxo should be availabe from electrum by then
  setTimeout(refreshPool, 5000);
}

const reloadImageEverywhere = url =>
  fetch(url, { cache: 'reload', mode: 'no-cors' })
    .then(() => document.body.querySelectorAll(`img[src='${url}']`)
      .forEach(img => img.src = url))

//Some refactoring is possible in these functions

"use strict";

var eccryptoJs = null;

function getAndPopulateNew(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, hasNavButtons) {
    if (order == "") order = "hot";
    if (content == "") content = "posts";
    if (filter == "") filter = "everyone";
    if (start == "") start = 0;
    if (limit == "") limit = numbers.results;
    if (page == "") page = "posts";

    //Show the relevant html element
    show(page);

    if (qaddress) {
        //hideAll();
        if (filter != "list") {
            showOnly("mcidmemberheader");
            showOnly("mcidmembertabs");
            var obj2 = { address: qaddress, profileclass: 'filteroff', reputationclass: 'filteroff', postsclass: 'filteron', bestiesclass: 'filteroff' };
            document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
        }
        setPageTitleRaw("List");
    } else if (topicnameHOSTILE.toLowerCase() == "mytopics") {
        setPageTitleFromID("VV0128");
    } else if (topicnameHOSTILE) {
        setPageTitleRaw("#" + topicnameHOSTILE);
    } else if (filter.toLowerCase() == "myfeed") {
        setPageTitleFromID("VV0134a");
    } else if (filter == "everyone") {
        setPageTitleFromID("VVfirehose");
    }

    //Show loading animation
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    if (topicnameHOSTILE == null || topicnameHOSTILE == "") {
        setTopic('');
        topicnameHOSTILE = '';
    }

    var networkOnly = '';
    if (dropdowns['contentnetwork'] != "-1") {
        networkOnly = `&network=${dropdowns['contentnetwork']}`;
    }



    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=show&shownoname=' + settings["shownonameposts"] + '&shownopic=' + settings["shownopicposts"] + '&order=' + order + '&content=' + content + '&topicname=' + encodeURIComponent(topicnameHOSTILE) + '&filter=' + filter + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit + networkOnly;
    getJSON(theURL).then(function (data) {

        updateUSDRate(data);

        if (qaddress && data[0] && data[0].pagingid && filter != "list") {
            setPageTitleRaw("@" + data[0].pagingid);
        }

        let end = start;
        if (order == 'new' && data.length && data[0]) {
            end = data[data.length - 1].firstseen;
        } else {
            end = start + limit;
        }

        //var navheader = getNavHeaderHTML(order, content, topicnameHOSTILE, filter, start, limit, 'show', qaddress, "getAndPopulateNew", data.length > 0 ? data[0].unduplicatedlength : 0);
        var navheader = getNavHeaderHTML(order, content, topicnameHOSTILE, filter, start, limit, 'show', qaddress, "getAndPopulateNew", data.length);
        //if(data.length>0){updateStatus("QueryTime:"+data[0].msc)};
        //Show navigation next/back buttons
        var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, end, limit, 'show', qaddress, "getAndPopulateNew", data.length);
        //var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, end, limit, 'show', qaddress, "getAndPopulateNew", data.length > 0 ? data[0].unduplicatedlength : 0);
        if(!hasNavButtons){
            navheader='';
            navbuttons='';
        }

        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        //Why is this here? Should only be required in thread. removing 20/01/2022
        //data = mergeRepliesToRepliesBySameAuthor(data, false);

        var contents = "";

        
        if (!pubkey && order == 'hot' && !qaddress && Math.random()<0.05) {//Show member.cash explainer video
            let membervid = { "address": "-2124810688269680833", "message": "Hit Play to Understand #Member in 90 seconds.\n\nhttps://youtu.be/SkaaPcjKI2E", "txid": "4828901585208465235", "firstseen": 1657702206, "retxid": "", "roottxid": "4828901585208465235", "likes": 2, "dislikes": 0, "tips": 1500, "topic": "member", "lat": null, "lon": null, "geohash": null, "repliesdirect": 0, "repliesroot": 0, "repliestree": 0, "repliesuniquemembers": 0, "repost": null, "canonicalid": "4828901585208465235", "repostcount": 0, "language": "", "amount": 0, "score": 1500000, "score2": 208943.26776183146, "network": 3, "posttype": 0, "memberscore": 236, "weightedlikes": 120721, "weighteddislikes": 0, "weightedreposts": 0, "weightedtips": 0, "contentflags": 1, "deleted": 0, "hivelink": "c303b46839abd7538da5ed16bbfb139bdabce45bf5013e178dcbc36179de1a9a", "format": null, "title": null, "scoretop": 12007.604013087894, "isfollowing": null, "name": "member.cash", "pagingid": "membercash", "publickey": "02b5a809307637d405a3165830bc603794cf5d67ce69a381424eca9a2e2f4d9c17", "picurl": "-8772705979516345993", "tokens": 55, "followers": 5252, "following": 1696, "blockers": 2, "blocking": 14, "profile": "Aggregator for multiple decentralized social networks\n\nhttps://member.cash\n\nCovering social posts from \n\nDeso, Bitcoin Cash and Hive\n\n@FreeTrade\n\n", "nametime": 1625985623, "lastactive": 1657702333, "sysrating": 236, "hivename": null, "bitcoinaddress": "19ytLgLYamSdx6spZRLMqfFr4hKBxkgLj6", "rpname": null, "rppagingid": null, "rppublickey": null, "rppicurl": null, "rptokens": null, "rpfollowers": null, "rpfollowing": null, "rpblockers": null, "rpblocking": null, "rpprofile": null, "rpnametime": null, "rplastactive": null, "rpsysrating": null, "rphivename": null, "rpbitcoinaddress": null, "rating": null, "rprating": null, "replies": 0, "likedtxid": null, "likeordislike": null, "rplikedtxid": null, "rplikeordislike": null, "rpaddress": null, "rpamount": null, "rpdislikes": null, "rpfirstseen": null, "rpgeohash": null, "rplanguage": null, "rplat": null, "rplikes": null, "rplon": null, "rpmessage": null, "rprepliestree": null, "rprepliesuniquemembers": null, "rprepost": null, "rprepostcount": null, "rpretxid": null, "rproottxid": null, "rptips": null, "rptopic": null, "rptxid": null, "rpreplies": null, "rprepliesroot": null, "rphivelink": null, "rpsourcenetwork": null };
            contents = contents + getPostListItemHTML(getHTMLForPost(membervid, 10000 + 1, page, 10000, null, false, true, false));
        }

        for (var i = 0; i < data.length; i++) {
            try {
                if (settings["shownonameposts"] == 'false' && !data[i].name && !data[i].hivelink) { continue; } //nb, if there is a hive link, hiveid can be used for name
                if (settings["shownopicposts"] == 'false' && !data[i].picurl) { continue; }
                contents = contents + getPostListItemHTML(getHTMLForPost(data[i], i + 1, page, i, null, false, true, false));
            } catch (err) {
                console.log(err);
            }
        }

        if (contents == "") {

            contents = getDivClassHTML('message', getSafeTranslation("nothinghere2", "Nothing here yet"));

            if (filter == "mypeeps" || filter == "myfeed" || topicnameHOSTILE == "MyFeed" || topicnameHOSTILE == "MyTopics") {
                contents = getDivClassHTML('message', getSafeTranslation("nothinginfeed2", "Nothing in your feed"));
            }

            if (data && data[0] && data[0].interrupted == "query timed out") {
                contents = getDivClassHTML('message', getSafeTranslation("servertimeout", "This request timed out - maybe it is too difficult or the server is under heavy load."));
            }

        }
        if (topicnameHOSTILE != null && topicnameHOSTILE != "" && topicnameHOSTILE.toLowerCase() != "mytopics" && topicnameHOSTILE.toLowerCase() != "myfeed" && topicnameHOSTILE.toLowerCase() != "mypeeps") {
            showOnly("topicmeta");
        }

        if (!pubkey && !topicnameHOSTILE) {
            //contents=`<div><iframe src="https://www.youtube.com/embed/SkaaPcjKI2E" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" style="max-width: 100vw;max-height: 56.25vw;" width="770" height="433" frameborder="0"></iframe>`+contents;
        }


        displayItemListandNavButtonsHTML(navheader + contents, navbuttons, page, data, "posts", start, true);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getAndPopulateMessages(messagetype, start, limit) {

    if (!messagetype) {
        messagetype = 'all';
    }

    try {
        document.getElementById('messageslist').innerHTML = document.getElementById("loading").innerHTML;
    }
    catch (err) {
        console.log(err);
    }

    var theURL = dropdowns.contentserver + '?action=messages&address=' + pubkey + '&messagetype=' + messagetype;
    getJSON(theURL).then(async function (data) {

        if (!eccryptoJs) {
            await loadScript("js/lib/eccrypto-js.js");
        }

        lastViewOfNotificationspm = parseInt(new Date().getTime() / 1000);
        localStorageSet(localStorageSafe, "lastViewOfNotificationspm", lastViewOfNotificationspm);
        setAlertCount("alertcountpm", 0);
        //document.title = "member.cash";


        data = mergeRepliesToRepliesBySameAuthor(data, true);
        var contents = "";
        for (let i = 0; i < data.length; i++) {
            data[i].address = data[i].senderaddress;
            contents += getMessageHTML(data[i], i);
        }
        if (contents == "") { contents = getSafeTranslation('nomessagesfound', "No messages found."); }


        document.getElementById('messageslist').innerHTML = contents;
        for (let i = 0; i < data.length; i++) {
            populateMessages(data[i], i);
        }
        addDynamicHTMLElements(data);
        scrollToPosition();
    }, function (status) { //error detection....
        showErrorMessage(status, 'messageslist', theURL);
    });
}

function getAndPopulateThread(roottxid, txid, pageName) {
    if (pageName != "mapthread") {
        show(pageName);
        document.getElementById(pageName).innerHTML = document.getElementById("loading").innerHTML;
    }

    //Roottxid is used to get all the posts, txid is used to highligh the required post

    //If no post is specified, we'll use it as a top level
    if (txid === undefined || txid == "") { txid = roottxid; }

    var theURL = dropdowns.contentserver + '?action=thread&address=' + pubkey + '&txid=' + txid;
    getJSON(theURL).then(async function (data) {
        updateUSDRate(data);
        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);
        
        txid = setHighlightedPost(data, txid); //set the highlight posts - also use the number id for txid rather than hex if txid is hex

        data = await removeDuplicatesFromDifferentNetworks(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        //Make sure we have id of the top level post
        if (data.length > 0) { roottxid = data[0].roottxid; }

        //setTopic(data[0].topic);

        //Find who started the thread
        var threadstarter = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                threadstarter = data[i].address;
            }
        }

        //Find the first reply by the thread starter
        var earliestReply = "none";
        var earliestReplyTXID = "none";
        var earliestReplyTime = 9999999999;
        for (var i = 0; i < data.length; i++) {
            if (data[i].retxid == roottxid && data[i].address == threadstarter) {
                if (data[i].firstseen < earliestReplyTime) {
                    earliestReply = i;
                    earliestReplyTime = data[i].firstseen;
                    earliestReplyTXID = data[i].txid
                }
            }
        }

        //Treat entries in polls topic as special
        if (data.length > 0 && data[0].topic.toLowerCase() == 'polls') {
            earliestReply = "none";
            earliestReplyTXID = "none";
            earliestReplyTime = 9999999999;
        }

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                contents += getDivClassHTML("fatitem", getHTMLForPost(data[i], 1, pageName, i, data[earliestReply], true, false, true));

                var commentTree = getNestedPostHTML(data, data[i].txid, 0, pageName, earliestReplyTXID)

                if (commentTree == '<ul></ul>') {
                    commentTree = getNoCommentsYetHTML();
                } else {
                    commentTree = getDivClassHTML("comment-tree", commentTree);
                }

                contents += commentTree;
            }
        }


        //Threads have no navbuttons
        displayItemListandNavButtonsHTML(contents, "", pageName, data, "", 0, false);

        //Repeat the title for article mode
        //This doesn't seem essential, but was causing some problems when viewing thread directly after post, so put in a try/catch
        try{
            let articleheaderelement=document.querySelector('[id^="articleheader' + roottxid + '"]');
            let postbodyroottxidelement=document.querySelector('[id^="postbody' + roottxid + '"]');
            articleheaderelement.innerHTML = postbodyroottxidelement.innerHTML;
        }catch(errortitle){
            console.log("Article mode header set error");
            console.log(errortitle);
        }

        if (popup != undefined) {
            popup.setContent(getDivClassHTML('mapthread', contents));
        }
        addDynamicHTMLElements(data);
        scrollToPosition();

        if (!articlemode) {
            showReplyBox(san(txid) + pageName);
        }

        //Comment might be hidden because of mutes/low rating etc, make sure to uncollapse
        uncollapseCommentRecursive(txid);
        scrollToElement("highlightedcomment");

    }, function (status) { //error detection....
        showErrorMessage(status, pageName, theURL);
    });
}

function getAndPopulateTopic(topicNameHOSTILE) {
    var page = "topicmeta";
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=topiclist&topicname=' + encodeURIComponent(topicNameHOSTILE) + '&qaddress=' + pubkey;
    getJSON(theURL).then(function (data) {
        updateUSDRate(data);
        //todo, move this to htmlquarantine.
        var contents = "";
        //group data rows by moderator before displaying
        var modsArray = [];
        for (var i = 0; i < data.length; i++) {
            if (i == 0 || (i < data.length && data[i].topicname == data[i - 1].topicname)) {
                modsArray.push(data[i]);
            }
        }
        if (modsArray.length == 0) {
            var newData = [];
            //These may be out of date, but better than showing NaN
            newData.mostrecent = 0;
            newData.subscount = 0;
            newData.messagescount = 0;
            newData.topicname = topicNameHOSTILE;
            modsArray.push(newData);
        }
        contents += getHTMLForTopicArray(modsArray, 'modmoresingle');


        document.getElementById(page).innerHTML = getHTMLForTopicHeader(topicNameHOSTILE, contents);

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateTopicList(showpage) {
    var page = "topiclistanchor";
    if (showpage) {
        show(page);
    }
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=topiclist&qaddress=' + pubkey;
    getJSON(theURL).then(function (data) {
        updateUSDRate(data);
        /*
        var selectboxIndex = 5;
        var selectbox = document.getElementById('topicselector');
        while (selectbox.options[selectboxIndex]) {
            selectbox.remove(selectboxIndex)
        }


        var lastValue = "";
        for (var i = 0; i < Math.min(40, data.length); i++) {
            var option = document.createElement("option");
            //Caution, topicname can contain anything
            if (data[i].topicname == null) continue;

            option.text = capitalizeFirstLetter(data[i].topicname.substr(0, 13));
            option.value = data[i].topicname.trim();
            if (option.value == lastValue) continue;
            lastValue = option.value;
            selectbox.add(option, [selectboxIndex]);
            selectboxIndex++;
        }
        */
        if (showpage) {
            //group data rows by moderator before displaying
            var modsArray = [];
            var contents = "";
            for (var i = 0; i < data.length; i++) {
                if (i == 0 || (i < data.length && data[i].topicname == data[i - 1].topicname)) {
                    modsArray.push(data[i]);
                } else {
                    contents += getHTMLForTopicArray(modsArray, 'modmore');
                    modsArray = [];
                    modsArray.push(data[i]);
                }
            }
            document.getElementById(page).innerHTML = getHTMLForTopicHeader("", contents);
            addDynamicHTMLElements();
        }
        //Threads have no navbuttons
        //displayItemListandNavButtonsHTML(contents, "", "thread", data, "",0);
        //document.getElementById(page).innerHTML = contents;
        //detectMultipleIDS();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateQuoteBox(txid) {
    var page = 'quotepost';
    showOnly(page);
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=singlepost&address=' + pubkey + '&txid=' + txid;
    getJSON(theURL).then(function (data) {
        var contents = "";
        if (data[0]) {
            contents = getHTMLForPost(data[0], 1, page, 0, null, true, true, false);
            document.getElementById(page).innerHTML = contents;
            document.getElementById('quotetxidnetwork').value = data[0].network;
        } else {
            throw error(getSafeTranslation('noresult', 'no result returned'));
        }
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function displayItemListandNavButtonsHTML(contents, navbuttons, page, data, styletype, start, adddynamic) {
    contents = getItemListandNavButtonsHTML(contents, navbuttons, styletype, start);
    var pageElement = document.getElementById(page);
    pageElement.innerHTML = contents; //display the result in the HTML element
    listenForTwitFrameResizes();
    if (adddynamic) {
        addDynamicHTMLElements(data);
        scrollToPosition();
    }
    //window.scrollTo(0, scrollhistory[window.location.hash]);
    //detectMultipleIDS();
    return;
}



function addDynamicHTMLElements(data) {

    if (data != null && data != undefined && data[0]) {
        //if (data.length > 0) {
        //let qt = (Math.round(data[0].msc * 100) / 100).toFixed(2);
        updateStatus(`QT: ${data[0].msc-data[0].qtmsc}/${data[0].qtmsc}`);
        //document.getElementById("version").title = qt;

        if (data[0].chainheight) {
            chainheight = data[0].chainheight;
            chainheighttime = new Date().getTime();
        }
        updateUSDRate(data);
        //}
    }
    //Add ratings, disable controls if the star rating can be updated
    addStarRatings('rating');

    //Add mouseoverprofiles
    addMouseoverProfiles();

    //Add scoremouseovers
    //addClickScores();
    translatePage();

    //Add identicons
    jdenticon();

    //delay by half a second to allow time to appear
    setTimeout(setVisibleContentFinal, 500);

    loadBigLibs();
}

/*
function addClickScores() {
    var matches = document.querySelectorAll("[id^='scores']");
    for (var i = 0; i < matches.length; i++) {
        var profileElement = matches[i].id.replace('scores', 'scoresexpanded');
        //document.getElementById(profileElement).onmouseleave=setDisplayNone;
        matches[i].onclick = showScoresExpanded;
    }
}*/

function addMouseoverProfiles() {
    var matches = document.querySelectorAll("[id^='memberinfo']");
    for (var i = 0; i < matches.length; i++) {
        var profileElement = document.getElementById(matches[i].id.replace('member', 'profile'));
        if (profileElement) {
            profileElement.onmouseleave = setDisplayNone;
            delay(matches[i], showPreviewProfile, profileElement);
        }
    }
}

function setDisplayNone() {
    this.style.display = "none";
}

function showScoresExpanded(retxid, profileelement) {
    /*if (this) {
        var profileelement = this.id.replace('scores', 'scoresexpanded');
        var retxid = profileelement.substr(14, 64);
    }*/
    var closeHTML = getCloseButtonHTML(profileelement);
    document.getElementById(profileelement).innerHTML = closeHTML + document.getElementById("loading").innerHTML;
    document.getElementById(profileelement).style.display = "block";
    //load scores
    var theURL = dropdowns.contentserver + '?action=likesandtips&txid=' + san(retxid) + '&address=' + san(pubkey);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var amount = Number(data[i].amount);
            contents += getTipDetailsHTML(userFromDataBasic(data[i], san(retxid) + i, 16), amount, data[i].type);
        }
        document.getElementById(profileelement).innerHTML = closeHTML + contents;
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, profileelement, theURL);
    });
}

function showRemembersExpanded(retxid, profileelement) {

    var closeHTML = getCloseButtonHTML(profileelement);
    document.getElementById(profileelement).innerHTML = closeHTML + document.getElementById("loading").innerHTML;
    document.getElementById(profileelement).style.display = "block";
    //load scores
    var theURL = dropdowns.contentserver + '?action=remembers&txid=' + san(retxid) + '&address=' + san(pubkey);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents += getRememberDetailsHTML(userFromDataBasic(data[i], san(retxid) + i, 16), data[i].message, data[i].topic, data[i].txid);
        }
        document.getElementById(profileelement).innerHTML = closeHTML + contents;
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, profileelement, theURL);
    });
}



function showPreviewProfile(profileelement) {
    profileelement.style.display = "block";
}

function addStarRatings(stem) {
    var matches = document.querySelectorAll("[id^='" + stem + "']");
    for (var i = 0; i < matches.length; i++) {
        addSingleStarsRating(matches[i]);
        //var test=matches[i];
    }
}

function addSingleStarsRating(theElement) {
    //var theElement = document.querySelector(querySelector);
    if (theElement == undefined) return;
    if (theElement.isdone) return;
    let name = theElement.dataset.ratingname;
    let theAddress = theElement.dataset.ratingaddress;
    let rawRating = theElement.dataset.ratingraw;
    let starSize = theElement.dataset.ratingsize;
    //this is very slow
    //let starSize = Number(getComputedStyle(theElement).fontSize);

    let disabledtext = theElement.dataset.disabledtext;

    var theRatingRound = 0;
    if (rawRating) {
        theRatingRound = outOfFive(rawRating);
    }
    if (theElement.dataset.ratingsystem == 'systemscore') {
        disabledtext = 'MemBrain score ' + theRatingRound + '/5';
    }


    var starRating1 = raterJs({
        extraClass: theElement.dataset.ratingsystem,
        starSize: starSize,
        rating: theRatingRound,
        element: theElement,
        disableText: disabledtext ? disabledtext : getSafeTranslation('thisuserrates', 'This user rates ') + ds(name) + ' {rating}/{maxRating}',
        rateCallback: function rateCallback(rating, done) {
            var ratingText = document.getElementById("memberratingcommentinputbox" + theAddress);
            this.setRating(rating);
            sendRating(rating, ratingText, name, theAddress);
            done();
        }
    });
    starRating1.theAddress = theAddress;
    if (disabledtext) {
        starRating1.disable();
    }
    theElement.isdone = true;
    return starRating1;
}

function sendRating(rating, ratingText, pageName, theAddress) {
    if (!checkForPrivKey()) return false;
    var comment = "";
    if (ratingText) {
        comment = ratingText.value;
    }

    if (checkForNativeUserAndHasBalance()) {
        rateCallbackAction(rating, comment, theAddress);
    }

    if (isBitCloutUser()) {
        sendBitCloutRating("user: @" + pageName + "\nrating:" + rating + "/5\ncomment:" + comment + "\nmember.cash/ba/" + theAddress, 'rating', null, null, { RatedMember: theAddress, RatingComment: comment, Rating: "" + rating });
    }
}


function getHTMLForPost(data, rank, page, starindex, dataReply, alwaysShow, truncate, includeArticleHeader) {

    //Always show if post is directly requested
    if (!alwaysShow) {
        if (checkForMutedWords(data)) return "";
        if (data.moderated != null) return "";
    }

    let mainRatingID = starindex + page + ds(data.address);
    var retHTML = "";
    var repostHTML1 = "";
    var repostHTML2 = "";

    if (data.repost) {
        //repost
        let repostRatingID = starindex + "repost" + ds(data.rpaddress);
        repostHTML1 = getRepostHeaderHTML(userFromDataBasic(data, repostRatingID, 8));
        let member = MemberFromData(data, "rp", mainRatingID + "qr");
        //repostHTML2 = getHTMLForPostHTML(data.rptxid, data.rpaddress, data.rpname, data.rplikes, data.rpdislikes, data.rptips, data.rpfirstseen, data.rpmessage, data.rproottxid, data.rptopic, data.rpreplies, data.rpgeohash, page, mainRatingID + "qr", data.rplikedtxid, data.rplikeordislike, data.rprepliesroot, data.rprating, starindex, data.rprepostcount, data.repostidtxid, data.rppagingid, data.rppublickey, data.rppicurl, data.rptokens, data.rpfollowers, data.rpfollowing, data.rpblockers, data.rpblocking, data.rpprofile, data.rpisfollowing, data.rpnametime, '', data.rplastactive, truncate, data.rpsysrating, data.rpsourcenetwork, data.rphivename, data.rphivelink, data.rpbitcoinaddress);
        repostHTML2 = getHTMLForPostHTML3(member, data, 'rp', page, starindex, '', truncate);
        
        //if (repostHTML2) {
        //    repostHTML2 = getDivClassHTML("quotepost", repostHTML2);
        //}
    }

    if (data.message) {

        //this is a quick hack to filter out multiple edits
        //a genuine response to self is also removed. look at this when revisiting edited posts
        if(data.address==data.opaddress){ 
            return ''; 
        }

        //post with message
        if (repostHTML2) {
            repostHTML2 = getDivClassHTML("quotepost", repostHTML2);
        }
        
        let member = MemberFromData(data, "", mainRatingID);
        retHTML = getHTMLForPostHTML3(member, data, '', page, starindex, repostHTML2, truncate);
        
        //reply post, include original post
        if(data.opaddress){
            let opmember = MemberFromData(data, "op", mainRatingID+'op');
            retHTML = getHTMLForPostHTML3(opmember, data, 'op', page, starindex+'op', repostHTML2, truncate) +
            `<div class="replyinmainfeed">` + retHTML + `</div>`;
        }

        

    } else {
        //repost with no message
        retHTML = getDivClassHTML("repostnoquote", repostHTML1 + getDivClassHTML("noquote", repostHTML2));
    }
    if (includeArticleHeader) {
        retHTML += `<div id="articleheader` + san(data.txid) + `" class="articleheader"></div>`;
    }

    if (dataReply != null) {
        retHTML += getHTMLForReply(dataReply, 0, page, starindex);
    }
    return retHTML;
}

function getHTMLForReply(data, depth, page, starindex) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID = starindex + page + ds(data.address);
    let member = MemberFromData(data,'',mainRatingID);
    return getHTMLForReplyHTML2(member, data.txid, data.likes, data.dislikes, data.tips, data.firstseen, data.message, page, data.highlighted, data.likedtxid, data.likeordislike, data.blockstxid, starindex, data.topic, data.moderated, data.repostcount, data.repostidtxid, data.network, data.hivelink, data.deleted);
}

function showReplyButton(txid, page, divForStatus) {
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replytext" + page + txid).value = "";
}

function sendReply(txid, page, divForStatus, parentSourceNetwork, origtxid, network) {
    if (!checkForPrivKey()) return false;

    var replytext = document.getElementById("replytext" + page + txid).value;
    if (replytext.length == 0) {
        alert("Nothing to send");
        return false;
    }
    //Hide the reply button, show the reply status button
    document.getElementById("replybutton" + page + txid).style.display = "none";
    document.getElementById("replystatus" + page + txid).style.display = "block";
    document.getElementById("replycompleted" + page + txid).textContent = "";

    var replytext = document.getElementById("replytext" + page + txid).value;
    const replyhex = new Buffer(replytext).toString('hex');
    //const decoded = new Buffer(encoded, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"
    //no wait for the first reply

    var successFunction = 
    function (membertxid) { 
        replySuccessFunction(page, txid);
        if (isBitCloutUser()) {
            sendBitCloutReply(origtxid, replytext, divForStatus, null, parentSourceNetwork, membertxid);
            //sendBitCloutQuotePost("https://member.cash/p/"+membertxid.substr(0,10)+"\n\n"+replytext, '', origtxid, divForStatus, null, parentSourceNetwork);
        }
    };
    
    if (checkForNativeUserAndHasBalance()) {
        sendReplyRaw(privkey, origtxid, replyhex, 0, divForStatus, successFunction);
        successFunction = null;
    }
    
    return true;
}

function replySuccessFunction(page, txid) {
    //document.getElementById(divForStatus).innerHTML = "";
    document.getElementById("replytext" + page + txid).value = "";
    document.getElementById("replystatus" + page + txid).style.display = "none";
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replycompleted" + page + txid).innerHTML = "Message Sent. " + getRefreshButtonHTML();
}

function showReplyBox(txid) {
    //if (!checkForPrivKey()) return false;
    var replybox = document.querySelector("[id^='" + "reply" + txid + "']");
    //document.getElementById("reply" + txid);
    if (replybox)
        replybox.style.display = "block";

    //set focus here .focus()
    //document.getElementById("replylink"+txid).style.display = "none";
    return true;
}

function decreaseGUILikes(txid) {

    var downarrow = document.getElementById('downvote' + txid);
    var downarrowAction = document.getElementById('downvoteaction' + txid);
    downarrowAction.onclick = null;
    var uparrow = document.getElementById('upvote' + txid);
    var likescount = Number(document.getElementById('likescount' + txid).textContent);
    document.getElementById('score' + txid).textContent = likescount - 1;

    //Change classes
    if (downarrow && uparrow) { //If post is flagged or is main post, these arrows won't be present. skip.
        downarrow.className = "votearrowactivateddown rotate180";
        uparrow.className = "votearrow";

        var dislikeElement = document.getElementById('dislikescount' + txid);
        if (dislikeElement) {
            var dislikescount = Number(dislikeElement.textContent);
            dislikeElement.textContent = dislikescount + 1;
        }
        uparrow.className = "votearrow post-footer-upvote";
        downarrow.className = "votearrowactivated rotate180 post-footer-downvote-activated";
    }

}

function increaseGUILikes(txid) {


    //increase number of likes, original themes
    var likescount = Number(document.getElementById('likescount' + txid).textContent);
    var uparrow = document.getElementById('upvote' + txid);
    var uparrowAction = document.getElementById('upvoteaction' + txid);
    uparrowAction.onclick = null;
    var downarrow = document.getElementById('downvote' + txid);
    //Change counts
    document.getElementById('likescount' + txid).textContent = likescount + 1;
    document.getElementById('score' + txid).textContent = likescount + 1;

    //Change classes
    if (uparrow)
        uparrow.className = "votearrowactivated";
    if (downarrow)
        downarrow.className = "votearrow rotate180";

    //Nifty
    //Change classes
    if (uparrow)
        uparrow.className = "votearrowactivated post-footer-upvote-activated";
    if (downarrow)
        downarrow.className = "votearrow rotate180 post-footer-downvote";
    var upvotecontainer = document.getElementById('upvotecontainer' + txid)
    if (upvotecontainer)
        upvotecontainer.className = "post-footer-upvote-activated post-footer-relative";

}

function increaseGUIReposts(txid) {
    //Change counts
    var repostscount = Number(document.getElementById('repostscount' + txid).innerHTML);
    document.getElementById('repostscount' + txid).innerHTML = repostscount + 1;
}

function pinpost(txid) {
    //If bitclout user is logged in
    if (isBitCloutUser()) {
        bitCloutPinPost(txid, pubkey);
    }

    if (checkForNativeUserAndHasBalance()) {
        memoPinPost(txid, privkey);
    }
}

function likePost(txid, origtxid, tipAddress, amountSats) {
    if (amountSats == 0) {
        amountSats = numbers.oneclicktip;
    }
    //if no identity login, then check for priv key 
    if (!checkForPrivKey()) return false;

    //GUI update
    increaseGUILikes(txid);
    if (amountSats >= 547) {
        let newAmount = Number(document.getElementById('tipscount' + txid).dataset.amount) + satsToUSD(amountSats);
        document.getElementById('tipscount' + txid).innerHTML = usdString(newAmount, false);
        document.getElementById('tipscount' + txid).dataset.amount = newAmount;
    }

    //If bitclout user is logged in
    if (isBitCloutUser()) {
        bitCloutLikePost(origtxid);
    }

    //If memo user is logged in
    if (checkForNativeUserAndHasBalance()) {
        if (amountSats >= 547) {
            sendTipRaw(origtxid, tipAddress, amountSats, privkey, null);
        } else {
            sendLike(origtxid, privkey);
        }
    }
}

function dislikePost(txid, origtxid) {
    if (!checkForNativeUser()) return false;

    decreaseGUILikes(txid);

    sendDislike(origtxid);
}

function repostPost(txid, origtxid, sourcenetwork) {
    if (!checkForPrivKey()) return false;

    increaseGUIReposts(txid);

    if (isBitCloutUser()) {
        bitCloutRePost(origtxid, sourcenetwork);
    }

    if (checkForNativeUserAndHasBalance()) {
        repost(origtxid, privkey);
    }

}

function sendTip(txid, origtxid, tipAddress, page) {
    if (!checkForNativeUser()) return false;

    //document.getElementById("tipbox" + page + txid).style.display = "none";
    //document.getElementById("tiplink" + page + txid).style.display = "block";
    increaseGUILikes(txid);

    document.getElementById('tipbutton' + page + txid).style.display = "none";
    document.getElementById('tipstatus' + page + txid).style.display = "block";

    var tipAmount = parseInt(document.getElementById("tipamount" + page + txid).value);
    if (tipAmount < 547) {
        alert(getSafeTranslation('547min', "547 (dust+1) is the minimum tip possible"));
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = getSafeTranslation('sendingtip', "Sending Tip . .") + ' ' + tipAmount;
    let newAmount = Number(document.getElementById('tipscount' + txid).dataset.amount) + satsToUSD(tipAmount);;
    document.getElementById('tipscount' + txid).dataset.amount = newAmount;
    document.getElementById('tipscount' + txid).innerHTML = balanceString(newAmount, false);

    sendTipRaw(origtxid, tipAddress, tipAmount, privkey,
        function () {
            document.getElementById('tipstatus' + page + txid).value = "sent";
        }
    );

}

function showTipBox(txid) {
    if (!checkForNativeUser()) return false;
    if (document.getElementById("tipamount" + txid).value == 0) {
        document.getElementById("tipamount" + txid).value = defaulttip;
    }

    document.getElementById("tipbox" + txid).style.display = "block";
    //document.getElementById("tiplink"+txid).style.display = "none";
    return true;
}

function showMore(show, hide) {
    document.getElementById(show).style.display = "contents";
    document.getElementById(hide).style.display = "none";
    return true;
}

function checkForMutedWords(data) {
    for (var i = 0; i < mutedwords.length; i++) {
        if (mutedwords[i] == "") continue;
        var checkfor = mutedwords[i].toLowerCase();
        if (data.message != undefined && data.message.toLowerCase().contains(checkfor)) return true;
        if (data.name != undefined && data.name.toLowerCase().contains(checkfor)) return true;
        data.address = data.address + "";//Ensure data address is a string.
        if (data.address != undefined && data.address.toLowerCase().contains(checkfor)) return true;
        if (data.topic != undefined && ("(" + data.topic.toLowerCase() + ")").contains(checkfor)) return true;

    }
    return false;
}

//Threads
async function removeDuplicatesFromDifferentNetworks(data) {
    //var replies = [];
    for (var i = 0; i < data.length; i++) {
        //for duplicates with message
        let messageWithReplacement = data[i].message.replace(/^https\:\/\/member\.cash\/p\/[0-9a-f]+\n\n/, '');
        data[i].contentauthorhash = await digestMessage(data[i].address + messageWithReplacement);

        //duplicates with just link
        let matches = data[i].message.match(/^https\:\/\/member\.cash\/p\/([0-9a-f]{10})+$/, '$2');
        if(matches){
            data[i].permalinkstub = matches[1];
        }

    }

    //There is a lot of room to optimize this if it slows things down, and will on very large threads
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            //if the message is the same, and the author is the same, combine as a single post
            if (i != j && data[i] && data[i].network == 3 && data[j].network != 3 && 
                ((data[i].contentauthorhash == data[j].contentauthorhash) 
                || (data[j].permalinkstub && (data[j].permalinkstub == data[i].hivelink.substr(0,10) ) ))) {
                //datai is on membercoin network(3) and dataj is an identical post and not on membercoin network so . . .
                //change all references to dataj to datai
                for (var k = 0; k < data.length; k++) {
                    if (data[k].retxid == data[j].txid) {
                        data[k].retxid = data[i].txid;
                        if(data[j].highlighted){//if tx is highlighted, highlight duplicate tx.
                            data[k].highlighted=true;
                        }
                    }
                }
                data[j].setforremoval = true;
            }
        }
    }
    for (var j = 0; j < data.length; j++) {
        if (data[j].setforremoval) {
            data.splice(j, 1);
            j--;
        }
    }

    return data;
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function setHighlightedPost(data,highlightedtxid) {
    for (var i = 0; i < data.length; i++) {
        data[i].txid=data[i].txid+""; //ensure it is a string.
        if (data[i].txid == highlightedtxid || data[i].hivelink.startsWith(highlightedtxid)) {
            data[i].highlighted=true;
            return data[i].txid+"";
        }
    }
    return highlightedtxid;
}

function removeDuplicates(data) {
    var replies = [];
    for (var i = 0; i < data.length; i++) {
        if (replies[data[i].txid] == null) {
            replies[data[i].txid] = 1;
        } else {
            data.splice(i, 1);
            i--;
        }
    }
    return data;
}

function mergeRepliesToRepliesBySameAuthor(data, isPrivateMessage) {

    var replies = [];
    var authors = [];
    //First build associative array
    for (var i = 0; i < data.length; i++) {
        replies[data[i].txid] = data[i].retxid;
        authors[data[i].txid] = data[i].address;
    }

    //console.log(data);
    for (var i = 0; i < data.length; i++) {

        //Do not merge root, or first reply, unless its a private message
        if (isPrivateMessage || (data[i].retxid != "" && data[i].retxid != data[i].roottxid)) {
            //if the author of the post is the same as the parent post
            if (data[i].address == authors[data[i].retxid]) {

                //Merge child post i into parent post
                //Find parent post
                for (var j = 0; j < data.length; j++) {
                    //replies must be within 6 hours of each other
                    if (data[i].retxid == data[j].txid && Math.abs(data[i].firstseen - data[j].firstseen) < 6 * 60 * 60) {
                        //After 8/11/2020 replies must begin with '|' to be mergeable
                        if (data[j].firstseen < 1604813359 || data[i].message.startsWith('|') || data[i].stamp) {
                            //Subtract one as each post is automatically liked by its own author
                            data[j].likes = (Number(data[j].likes) + Number(data[i].likes - 1)).toString();
                            data[j].dislikes = (Number(data[j].dislikes) + Number(data[i].dislikes)).toString();
                            data[j].tips = (Number(data[j].tips) + Number(data[i].tips)).toString();

                            //remove the | at the start of the string if it is present
                            data[j].message = data[j].message + data[i].message.replace(/^\|/, '');

                            //if any other posts reference the child post, have them reference the parent post instead
                            for (var k = 0; k < data.length; k++) {
                                if (data[k].retxid == data[i].txid) {
                                    data[k].retxid = data[j].txid;
                                }
                            }

                            //remove the post
                            data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            }
        }
    }
    return data;
}

function collapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'none';
    document.getElementById('CollapsedLI' + commentid).style.display = 'block';
}

function uncollapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'block';
    document.getElementById('CollapsedLI' + commentid).style.display = 'none';
}

function uncollapseCommentRecursive(commentid) {
    
    let targetElement=document.getElementById('LI' + commentid);
    //let targetElement=document.querySelector(`[id^="LI"+${commentid}]`)
    while(targetElement){
        if(targetElement.id && targetElement.id.startsWith('LI')){
            targetElement.style.display = 'block';
            let collapsedElement=document.getElementById('Collapsed' + targetElement.id);
            collapsedElement.style.display = 'none';
            
            //Also move this element to the top
            let parentNode=targetElement.parentNode;
            parentNode.insertBefore(parentNode.removeChild(targetElement),parentNode.firstChild);
            
        }
        targetElement=targetElement.parentNode;
    }
}//markdown editor
var SimpleMDE = null;
var simplemde;

async function initMarkdownEditor() {
    if (!SimpleMDE) {
        await loadScript("js/lib/mde/simplemde.1.11.2.min.js");
    }

    if (simplemde == null) {
        simplemde = new SimpleMDE({
            element: document.getElementById("newposttamemorandum"),
            autoDownloadFontAwesome: false,
            autosave: {
                enabled: true,
                uniqueId: "MyUniqueID",
                delay: 10000,
            },
            forceSync: true,
            promptURLs: true,
            spellChecker: false,
            showIcons: ["code", "table", "strikethrough", "heading-1", "heading-2", "heading-3", "quote"],
            hideIcons: ["preview", "side-by-side", "fullscreen", "guide", "heading"]
        });
        simplemde.codemirror.on("change", function () {
            memorandumPreview();
        });
    }
    memorandumPreview();

}

function getMemorandumText() {
    if (!simplemde) {
        return '';
    }

    return simplemde.value();
}

var articlemode = false;
function switchToArticleMode(roottxid) {
    //changeStyle('base none', false);
    //'articleheader'+roottxid
    //document.querySelector('[id^="articleheader'+roottxid+'"]').innerHTML=document.querySelector('[id^="postbody'+roottxid+'"]').innerHTML;
    setBodyStyle("article");
    articlemode = true;
}

function switchToRegularMode() {
    if (articlemode) {
        //loadStyle();
        setBodyStyle("none");
        articlemode = false;
    }
}

//This is used for profile upload pic as well as file upload pic
async function uploadFile(elementid, uploadURL, targettextarea, memorandumpreviewelement, uploadimagelink, uploadimagestatus, callback, hiddeninput) {
    const formData = document.getElementById(elementid);
    //document.getElementById(memorandumpreviewelement).style.display = 'block';
    document.getElementById(uploadimagelink).style.visibility = 'hidden';
    if(uploadimagestatus){
        document.getElementById(uploadimagestatus).style.display = 'block';
    }
    getJSON(uploadURL, null, formData).then(function (data) {
        //formData.firstfile.value = null;
        document.getElementById(uploadimagelink).style.visibility = 'visible';
        if(uploadimagestatus){
            document.getElementById(uploadimagestatus).style.display = 'none';
        }
        if(memorandumpreviewelement){
            document.getElementById(memorandumpreviewelement).style.display = 'block';
        }
        console.log(data);
        let textarea = document.getElementById(targettextarea);
        let initValue= "\n" + textarea.value;
        if(elementid=='profilepicfile'){
            initValue="";
        }
        if (data.error) {
            alert(sane(data.error));
        } else if (data.arweaveid) {
            textarea.value = "arweave:" + data.arweaveid + initValue;
        } else if (data.memberurl) {
            if(hiddeninput){
                document.getElementById(hiddeninput).value=data.memberurl;
            }
            textarea.value = data.memberurl + initValue;
            
        }
        callback();
    });
}

function showMemorandumPreview() {
    document.getElementById('memorandumpreviewarea').style.display = 'block';
    document.getElementById('memorandumpreviewareabutton').style.display = 'none';
    memorandumPreview();
}

function memorandumPreview() {
    if (document.getElementById('memorandumpreviewarea').style.display == 'none') {
        //Only run the preview if the preview area is visible
        return;
    }


    var time = new Date().getTime() / 1000;

    //Grab needed values from settings page
    var name = document.getElementById('settingsnametext').value;
    //var followers = document.getElementById('settingsfollowersnumber').innerHTML;
    //var following = document.getElementById('settingsfollowingnumber').innerHTML; 
    //var blockers = document.getElementById('settingsblockersnumber').innerHTML; 
    //var blocking = document.getElementById('settingsblockingnumber').innerHTML; 
    let followers = 0, following = 0, blockers = 0, blocking = 0;

    var pagingid = document.getElementById('settingspagingid').value;
    var profile = document.getElementById('settingsprofiletext').value;
    var publickey = document.getElementById('settingspublickey').value;
    var picurl = document.getElementById('settingspicurl').value;
    var tokens = document.getElementById('settingstokens').value;
    var nametime = document.getElementById('settingsnametime').value;
    var rating = document.getElementById('settingsrating').value;
    var numberaddress = document.getElementById('settingsaddress').value;

    var isfollowing = true;

    var repostedHTML = document.getElementById('quotepost').outerHTML;


    let member= new Member(numberaddress, name, "MAINRATINGID", rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, 0, 0, '', pubkey);

    document.getElementById('memorandumpreview').innerHTML =
        getHTMLForPostHTML2(member,'000', 1, 0, 0, time, document.getElementById('memorandumtitle').value, '', '', 0, 0, null, '000', 1, 0, 'preview', 0, '', repostedHTML, false, 3, '000')
        + `<div id="articleheader000" class="articleheader"></div>`
        + getHTMLForReplyHTML2(member,'000', 1, 0, 0, time, getMemorandumText(), 'page', false, 1, null, null, 'preview', '', null, 0, '', 3, '000', false);

    //Repeat the title for article mode
    document.querySelector('[id^="articleheader000"]').innerHTML = document.querySelector('[id^="postbody000"]').innerHTML;

    //document.getElementById('articleheader000').innerHTML=document.getElementById('postbody000').innerHTML;

    addDynamicHTMLElements();
}

function geopost() {
    if (!checkForPrivKey()) return false;

    var txtarea = document.getElementById('newgeopostta');
    var posttext = txtarea.value;
    if (posttext.length == 0) {
        alert(getSafeTranslation('nomessagebody', "No Message Body"));
        return false;
    }
    var lat = Number(document.getElementById("lat").value);
    var lon = Number(document.getElementById("lon").value);

    //Leaflet bug allow longitude values outside proper range
    while (lon < -180) {
        lon = lon + 180;
    }
    while (lon > 180) {
        lon = lon - 180;
    }
    var geohash = encodeGeoHash(lat, lon);


    document.getElementById('newpostgeocompleted').textContent = "";
    document.getElementById('newpostgeobutton').style.display = "none";
    document.getElementById('newpostgeostatus').style.display = "block";
    document.getElementById('newpostgeostatus').value = getSafeTranslation('posting', "Posting...");

    let successFunction = geocompleted;

    let taggedPostText = posttext + " \nhttps://member.cash/geotag/" + geohash;
    if (checkForNativeUserAndHasBalance()) {
        //postgeoRaw(posttext, privkey, geohash, "newpostgeostatus", successFunction);
        postmemorandumRaw(taggedPostText, '', privkey, '', "newpostgeostatus", successFunction, null);
        successFunction = null;
    }
    if (isBitCloutUser()) {
        sendBitCloutPost(posttext + " \nmember.cash/geotag/" + geohash, '', "newpostgeostatus", successFunction, { GeoHash: geohash });
    }

}

function postmemorandum() {
    if (!checkForPrivKey()) return false;
    var posttext = document.getElementById('memorandumtitle').value;
    if(!posttext.includes('#')){
        if(!confirm(getSafeTranslation('notagareyousure', `Are you sure you want to post this without a #hashtag?  Include a #hashtag to help members find your post. Click OK to post or Cancel to add a #hashtag.`))){
            return false;
        }
    }
    var txid = document.getElementById('quotetxid').value;
    var network = document.getElementById('quotetxidnetwork').value;
    var postbody = document.getElementById('newposttamemorandum').value;
    //var topic = document.getElementById('memorandumtopic').value;

    var postLength = new Buffer(posttext).toString('hex').length / 2;
    var bodyLength = new Buffer(postbody).toString('hex').length / 2;
    if (postLength > 20000) {
        alert("Post size is " + postLength + ". Maximum size of 20,000 chars exceeded. This can't be posted.");
        return;
    }
    if (bodyLength > 20000) {
        alert("Body size is " + bodyLength + ". Maximum size of 20,000 chars exceeded. This can't be posted.");
        return;
    }

    var topic = '';

    if (!txid) {
        if (posttext == '#newmember' || posttext.length == 0) {
            alert(getSafeTranslation('nomemo', "No Post - Try adding some text"));
            return false;
        }
    }/*else{
        if (posttext.length == 0 && topic.length == 0) {
            alert(getSafeTranslation('nopost',"No post or topic. Try a regular remember instead."));
            return false;
        }
    }*///nb allow empty remember for compact theme
    //topic may be empty string

    document.getElementById('newpostmemorandumcompleted').textContent = "";
    document.getElementById('newpostmemorandumbutton').style.display = "none";
    document.getElementById('newpostmemorandumstatus').style.display = "block";
    document.getElementById('newpostmemorandumstatus').value = getSafeTranslation('sendingtitle', "Sending Title...");

    var successFunction = memorandumpostcompleted;

    let memberImageURL = document.getElementById('memberimageurl').value

    if (txid) {
        //Repost
        if (checkForNativeUserAndHasBalance()) {
            //quotepostRaw(posttext, privkey, topic, "newpostmemorandumstatus", function (txidnew) { sendRepostNotification(txid, "newpostmemorandumstatus", topic, txidnew); }, txid);
            postmemorandumRaw(posttext, '', privkey, topic, "newpostmemorandumstatus", successFunction, txid);
            //function (txidnew) { sendRepostNotification(txid, "newpostmemorandumstatus", topic, txidnew); }//
            successFunction = null;
        }
        if (isBitCloutUser()) {
            sendBitCloutQuotePost(posttext, topic, txid, "newpostmemorandumstatus", successFunction, network, memberImageURL);
        }
    }
    else {
        //Don't post body if it is not visible - it may contain old elements that the user is not expecting to post
        if (document.getElementById('memorandumtextarea').style.display == 'none') {
            postbody = '';
        }
        if (checkForNativeUserAndHasBalance()) {
            postmemorandumRaw(posttext, postbody, privkey, topic, "newpostmemorandumstatus", successFunction, null);
            successFunction = null;
        }
        if (isBitCloutUser()) {
            sendBitCloutPostLong(posttext, postbody, topic, "newpostmemorandumstatus", successFunction, memberImageURL);
        }
    }

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

/*
function sendRepostNotification(txid, divForStatus, topic, newtxid) {

    var replytext = getSafeTranslation('postremembered', "Your post was remembered");
    if (topic) {
        replytext += " " + getSafeTranslation('intopic', "in tag") + " " + topic;
    }
    replytext += " https://member.cash/p/" + newtxid;
    var replyHex = new Buffer(replytext).toString('hex');

    sendReplyRaw(privkey, txid, replyHex, 0, divForStatus, function (txidnew) { memorandumpostcompleted(newtxid); });
}*/

function memorandumpostcompleted(txid) {
    txid = san(txid);
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a onclick="showThread('`+txid+`')" href="#thread?post=`+txid+`">View It</a> or  <a rel='noopener noreferrer' target="_blank" href="` + encodedURL + `">Also Post To Twitter (opens a new window)</a>`;
    document.getElementById('newpostmemorandumcompleted').innerHTML = completedPostHTML(txid, document.getElementById('memorandumtitle').value);
    //TODO - bit heavy to retranslate the whole page, maybe just translate the new element
    translatePage();

    /*
    var encodedURL = `https://twitter.com/intent/tweet?text=` + encodeURIComponent(document.getElementById('memorandumtitle').value + '\r\n' + ` member.cash/p/` + txid.substr(0, 10));
    `Sent. <a onclick="showThread('` + txid + `')" href="#thread?post=` + txid + `" onclick="nlc();">View It</a> or  <a href="" onclick="window.open('` + encodedURL + `', 'twitterwindow', 'width=300,height=250');return false;">Also Post To Twitter (opens a new window)</a>`;
    */
    //iframe not allowed by twitter
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a rel='noopener noreferrer' onclick="createiframe('`+encodedURL+`','posttotwitter');return false;" href="">Also Post To Twitter</a><div id="posttotwitter"></div>`;
    document.getElementById('quotetxid').value = "";
    document.getElementById('quotetxidnetwork').value = "";
    document.getElementById('memberimageurl').value = "";
    document.getElementById('memorandumtitle').value = "";
    document.getElementById('newposttamemorandum').value = "";
    document.getElementById('newpostmemorandumstatus').style.display = "none";
    document.getElementById('newpostmemorandumbutton').style.display = "block";
    if (simplemde) {
        simplemde.value("");
    }

}

function memocompleted() {
    document.getElementById('memotitle').value = "";
    document.getElementById('newpoststatus').style.display = "none";
    document.getElementById('newpostbutton').style.display = "block";
    document.getElementById('newpostcompleted').innerHTML = getSafeTranslation('messagesent', "Message Sent.");
}

function geocompleted() { 
    document.getElementById('newgeopostta').value = "";
    document.getElementById('newpostgeostatus').style.display = "none";
    document.getElementById('newpostgeobutton').style.display = "block";
    document.getElementById('newpostgeocompleted').innerHTML = getSafeTranslation('messagesent', "Message Sent.");
}"use strict";

function getAndPopulateCommunityRatings(qaddress) {

    document.getElementById('community').innerHTML = communityHTML;
    document.getElementById('communityratingtable').innerHTML = document.getElementById("loading").innerHTML;

    var page = 'communityratingtable';
    var theURL = dropdowns.contentserver + '?action=rated&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            //contents = contents + ratingAndReasonHTML(data[i]);
            contents = contents + ratingAndReasonNew(data[i].name, data[i].address, data[i].rateename, data[i].rates, data[i].rating, data[i].reason, 'comrating', data[i].trxid);
        }
        document.getElementById(page).innerHTML = contents;

        addStarRatings('comrating');
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateRatings(qaddress) {
    document.getElementById('anchorratings').innerHTML = anchorratingsHTML;
    document.getElementById('memberratingtable').innerHTML = document.getElementById("loading").innerHTML;

    var page = 'memberratingtable';
    var theURL = dropdowns.contentserver + '?action=ratings&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            //contents = contents + ratingAndReason2HTML(data[i]);
            contents = contents + ratingAndReasonNew(data[i].ratername, data[i].rateraddress, data[i].name, data[i].address, data[i].rating, data[i].reason, 'memrating', data[i].trxid);
        }
        document.getElementById(page).innerHTML = contents;
        addStarRatings('memrating');
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getDataMember(qaddress) {
    document.getElementById('mcidmemberanchor').innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=settings&address=' + pubkey + '&qaddress=' + qaddress;
    getJSON(theURL).then(function (data) {
        if (data[0] && !data[0].address) data[0].address = data[0].nameaddress; //sometimes address is empty because the user hasn't made a post yet.
        if (data) {
            getDataMemberFinally(data);
        }
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}

function getDataSettings(qaddress, cashaddress) {

    //document.getElementById('settingsanchor').innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=settings&address=' + pubkey + '&qaddress=' + qaddress;
    getJSON(theURL).then(function (data) {
        if (data[0] && !data[0].address) data[0].address = data[0].nameaddress; //sometimes address is empty because the user hasn't made a post yet.
        try {
            getDataSettingsFinally(qaddress, cashaddress, data);
        } catch (error) {
            console.log("Setting settings failed");
            console.log(error);
        }

    }, function (status) { //error detection....
        //If this fails, we still want to show settings page, so user can change server etc
        getDataSettingsFinally(qaddress, cashaddress, null);
        showErrorMessage(status, null, theURL);
    });
}

function getPicURL(picurl, profilepicbase, qaddress, hivename) {
    var pictype = '.jpg';
    picurl = picurl + "";
    /*if (picurl && picurl.toLowerCase().endsWith('.png') && !hivename) {
        //some bch pics are stored as .png
        pictype = '.png';
    }
    //not true anymore. also will transition all profile pics to webp
    */
    if (hivename) {
        return profilepicbase + sane(hivename) + `.128x128` + pictype;
    }
    return profilepicbase + san(qaddress) + `.128x128` + pictype;
}

async function getDataMemberFinally(data) {

    let qaddress = null;
    if (data[0] && data[0].bitcoinaddress) {
        qaddress = data[0].bitcoinaddress;
    }

    let cashaddress = null;
    if (qaddress) {
        cashaddress = legacyToMembercoin(qaddress);
    }

    //Note, data may not contain any rows, for new or unknown users.

    var obj = {
        address: qaddress,
        cashaddress: cashaddress,
        followers: 0,
        following: 0,
        muters: 0,
        muting: 0,
        handle: "",
        profile: "",
        pagingid: "",
        profilepiclargehtml: "",
        publickey: "",
    };

    if (data && data[0]) {
        obj.followers = Number(data[0].followers);
        obj.following = Number(data[0].following);
        obj.muters = Number(data[0].blockers);
        obj.muting = Number(data[0].blocking);
        obj.handle = ds(data[0].name);
        obj.handlefunction = unicodeEscape(data[0].name);
        obj.profile = data[0].profile;
        obj.publickey = san(data[0].publickey);
        obj.pagingid = ds(data[0].pagingid);
        obj.picurl = ds(data[0].picurl + "");
        obj.tokens = Number(data[0].tokens);
        obj.nametime = Number(data[0].nametime);
        obj.rating = Number(data[0].rating);

        let theRatingRound = outOfFive(Number(data[0].sysrating));
        obj.membrain = theRatingRound + "/5";

        //document.title = "@" + data[0].pagingid + " (" + data[0].name + ") at " + siteTitle;
    }

    if (data && (data.length < 1 || Number(data[0].isfollowing) == 0)) {
        obj.followbuttonhtml = clickActionNamedHTML("follow", qaddress, "follow", obj.publickey);
    } else {
        obj.followbuttonhtml = clickActionNamedHTML("unfollow", qaddress, "unfollow", obj.publickey);
    }

    if (data && (data.length < 1 || Number(data[0].isblocked) == 0)) {
        obj.mutebuttonhtml = clickActionNamedHTML("mute", qaddress, "mute", obj.publickey);
    } else {
        obj.mutebuttonhtml = clickActionNamedHTML("unmute", qaddress, "unmute", obj.publickey);
    }


    if (obj.picurl) {
        let picstem = sane(data[0].address);
        if (data[0].hivename) { picstem = sane(data[0].hivename); }
        obj.profilepiclargehtml = getProfilePicLargeHTML(profilepicbase + picstem + `.640x640.jpg`);
    }

    if (data && data[0] && !data[0].hivename && data[0].publickey) { //don't show bcaddress for hivename - publickey is not correct yet
        var bcaddress = await pubkeyToBCaddress(data[0].publickey);
        obj.bcaddress = bcaddress;
    }


    obj.profile = getSafeMessage(obj.profile, 'profile', false);
    if (data && data[0]) {
        //data[0].rname=data[0].name;
        let member = MemberFromData(data[0],'','???mainratingid');
        //obj.pinnedpostHTML = getHTMLForPostHTML(data[0].rtxid, data[0].raddress, data[0].name, data[0].rlikes, data[0].rdislikes, data[0].rtips, data[0].rfirstseen, data[0].rmessage, data[0].rroottxid, data[0].rtopic, data[0].rreplies, data[0].rgeohash, 'memberpage', '???mainratingid', data[0].likedtxid, data[0].likeordislike, data[0].rrepliesroot, data[0].rating, 0, data[0].rrepostcount, data[0].repostidtxid, data[0].pagingid, data[0].publickey, data[0].picurl, data[0].tokens, data[0].followers, data[0].following, data[0].blockers, data[0].blocking, data[0].profile, data[0].isfollowing, data[0].nametime, '', data[0].lastactive, false, data[0].sysrating, data[0].rsourcenetwork, data[0].hivename, data[0].hivelink, data[0].bitcoinaddress);
        obj.pinnedpostHTML = getHTMLForPostHTML3(member, data[0], 'r', 'memberpage', 0, '', false);
    }

    document.getElementById('mcidmemberanchor').innerHTML = templateReplace(pages.member, obj);

    if (data && data[0] && data[0].hivename) {
        document.getElementById('memberprofileactions').style.display = "none"; //no hive actions for now
        document.getElementById('walletaddress').style.display = "none"; //no hive actions for now
        document.getElementById('walletbcaddress').style.display = "none"; //no hive actions for now

    }

    //This condition checks that the user being viewed is not the logged in user
    if (qaddress == pubkey) {
        document.getElementById('memberratinggroup').style.display = "none";
    } else {

        document.getElementById('memberratinggroup').style.display = "block";
        document.getElementById('memberratingcomment').innerHTML = getRatingComment(data[0]);
        document.getElementById('memberratingcommentinputbox' + data[0].bitcoinaddress).onchange = function () { starRating1.setRating(0); };

        var ratingScore = 0;
        if (data.length > 0) {
            ratingScore = Number(data[0].rating);
        }
        document.getElementById('memberrating').innerHTML = getMemberRatingHTML(data[0].bitcoinaddress, ratingScore, data[0].pagingid);

        var theElement = document.getElementById(`memberrating` + data[0].bitcoinaddress);
        var starRating1 = addSingleStarsRating(theElement);
        setPageTitleRaw("@" + data[0].pagingid);

    }

    addDynamicHTMLElements();
}

async function getDataSettingsFinally(qaddress, cashaddress, data) {

    //Set the headerbar pic
    if (data && data[0]) {
        profilepic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(data[0].address) + `"></svg>`;
        var picurl = getPicURL(data[0].picurl, profilepicbase, data[0].address, data[0].hivename);
        document.getElementById('profilepicheader').innerHTML = `<img class="profilepicheaderimg" width="128" height="128" src="` + picurl + `">`;
        profilepic = `<img class="memberpicturesmallpost" width='30' height='30' src='` + picurl + `'/>`;
        try {
            document.getElementById('newpostprofilepic').innerHTML = profilepic;
        } catch (err) {
            console.log("error newpostprofilepic");
        }
        reloadImageEverywhere(picurl);
    }



    if (qaddress && !cashaddress) {
        {
            legacyToMembercoin(qaddress);
        }
    }

    //Note, data may not contain any rows, for new or unknown users.

    var obj = {
        address: qaddress,
        cashaddress: cashaddress,
        followers: 0,
        following: 0,
        muters: 0,
        muting: 0,
        handle: "",
        profile: "",
        pagingid: "",
        profilepiclargehtml: "",
        publickey: "",
        fileuploadurl: dropdowns.imageuploadserver + "uploadfile"
    };

    if (data && data[0]) {
        obj.addressnumber = san(data[0].address);
        obj.followers = Number(data[0].followers);
        obj.following = Number(data[0].following);
        obj.muters = Number(data[0].blockers);
        obj.muting = Number(data[0].blocking);
        obj.handle = ds(data[0].name);
        obj.handlefunction = unicodeEscape(data[0].name);
        obj.profile = data[0].profile;
        obj.publickey = san(data[0].publickey);
        obj.pagingid = ds(data[0].pagingid);
        obj.picurl = ds(data[0].picurl + "");
        obj.tokens = Number(data[0].tokens);
        obj.nametime = Number(data[0].nametime);
        obj.rating = Number(data[0].rating);


        let theRatingRound = outOfFive(Number(data[0].sysrating));
        obj.membrain = theRatingRound + "/5";

        //document.title = "@" + data[0].pagingid + " (" + data[0].name + ") at " + siteTitle;
    }


    if (obj.picurl) {
        let picstem = sane(data[0].address);
        if (data[0].hivename) { picstem = sane(data[0].hivename); }
        obj.profilepiclargehtml = getProfilePicLargeHTML(profilepicbase + picstem + `.640x640.jpg`);
    }


    obj.privatekey = privkey;
    obj.seedphrase = (mnemonic == "" ? "" : getSafeTranslation('seedphrase', "Seed Phrase:") + " " + mnemonic + "<br/>") + getSafeTranslation('cpk', "Compressed Private Key:") + " " + privkey;



    if (data && data[0] && data[0].publickey) {
        var bcaddress = await pubkeyToBCaddress(data[0].publickey);
        obj.bcaddress = bcaddress;
    } else if (qaddress == pubkey && pubkeyhex) {
        var bcaddress = await pubkeyToBCaddress(pubkeyhex);
        obj.bcaddress = bcaddress;
    }
    obj.version = version;
    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, obj);
    //reloadImageEverywhere(obj.profilepiclargehtml);


    updateSettings();
    document.getElementById('settingsnametextbutton').disabled = true;
    document.getElementById('settingsprofiletextbutton').disabled = true;
    document.getElementById('settingspicbutton').disabled = true;
    //After 9 ratings, members cannot change their handle
    //if (data && data[0] && data[0].ratingnumber > 9) { note - ratingnumber is not being returned in data
    //    document.getElementById('settingsnametext').disabled = true;
    //}

    if (qaddress) {
        document.getElementById('settingsloggedin').style.display = "block";
    } else {
        document.getElementById('settingsloggedin').style.display = "none";
    }

    addDynamicHTMLElements();

}

async function populateTools() {

    var bcaddress = await pubkeyToBCaddress(pubkeyhex);
    var obj = {
        address: pubkey,
        cashaddress: legacyToMembercoin(pubkey),
        bcaddress: bcaddress
    };

    obj.privatekey = privkey;
    obj.seedphrase = (mnemonic == "" ? "" : getSafeTranslation('seedphrase', "Seed Phrase:") + " " + mnemonic + "<br/>") + getSafeTranslation('cpk', "Compressed Private Key:") + " " + privkey;

    document.getElementById('toolsanchor').innerHTML = templateReplace(walletanchorHTML, obj);



}


async function getAndPopulateSettings() {
    let cashaddr;
    try {
        cashaddr = legacyToMembercoin(pubkey);
    } catch (err) {
        console.log(err);
    }
    getDataSettings(pubkey, cashaddr);
}

function updateSettings() {



    //These may already be switched to qrcodes, so try/catch necessary
    //try { document.getElementById('lowfundsaddress').innerHTML = qpubkey; } catch (err) { }

    var storedmutedwords = localStorageGet(localStorageSafe, "mutedwords");
    if (storedmutedwords != undefined && storedmutedwords != null) {
        document.getElementById('mutedwords').value = storedmutedwords;
        mutedwords = storedmutedwords.split(',');
    }

    //numbers
    for (var key in numbers) {
        if (key == 'defaulttip') continue;
        var theSetting = localStorageGet(localStorageSafe, key);
        try {
            if (theSetting != undefined && theSetting != null) {
                document.getElementById(key).value = theSetting;
                numbers[key] = Number(theSetting);
            } else {
                document.getElementById(key).value = numbers[key];
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Checkboxes
    for (var key in settings) {
        var theSetting = localStorageGet(localStorageSafe, key);

        try {
            if (theSetting != undefined && theSetting != null) {
                document.getElementById(key).checked = Boolean(theSetting == "true");
                settings[key] = theSetting;
            } else {
                document.getElementById(key).checked = Boolean(settings[key] == "true");
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Select boxes
    for (var key in dropdowns) {
        var theSetting = localStorageGet(localStorageSafe, key);
        try {
            if (theSetting != null) {
                dropdowns[key] = theSetting;
            } else {
                theSetting = dropdowns[key];
            }
            var selector = document.getElementById(key);

            var opts = selector.options;
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value == theSetting) {
                    selector.selectedIndex = i;
                }
            }

            if (key == "languageselector") {
                if (dictionary[theSetting]) {
                    dictionary.live = dictionary[theSetting];
                }
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Make sure users are not on the old server
    if (dropdowns.contentserver == "https://memberjs.org:8123/member.js") {
        dropdowns.contentserver = "https://member.cash/v2/member.js";
    }
    if (dropdowns.txbroadcastserver == "https://memberjs.org:8123/member.js") {
        dropdowns.txbroadcastserver = "https://member.cash/v2/";
    }

    document.getElementById("debuginfo").value = debuginfo;

}

function updateSettingsCheckbox(settingsName) {
    settings[settingsName] = "" + document.getElementById(settingsName).checked;
    localStorageSet(localStorageSafe, settingsName, settings[settingsName]);
    updateStatus(getSafeTranslation('updated', "Updated.") + " " + settings[settingsName]);
}

function updateSettingsDropdown(settingsName) {
    var selector = document.getElementById(settingsName);
    dropdowns[settingsName] = selector.options[selector.selectedIndex].value;
    settings[settingsName] = "" + dropdowns[settingsName];
    localStorageSet(localStorageSafe, settingsName, dropdowns[settingsName]);

    //if (settingsName == "currencydisplay") {
    //    tq.updateBalance(pubkey);
    //}
    if (settingsName == "mcutxoserver") {
        tq.setUTXOServer(dropdowns.mcutxoserver + "address/utxo/");
        refreshPool();
    }
    if (settingsName == "languageselector") {
        if (dictionary[dropdowns[settingsName]]) {
            dictionary.live = dictionary[dropdowns[settingsName]];
            //location.reload();
            translatePage();
        }
    }
    if (settingsName == "txbroadcastserver"){
        tq.setbroadcastServer(dropdowns.txbroadcastserver + "rawtransactions/sendRawTransactionPost");
    }

    updateStatus(getSafeTranslation('updated', "Updated.") + " " + dropdowns[settingsName]);
}

function updateSettingsNumber(settingsName) {
    numbers[settingsName] = Number(document.getElementById(settingsName).value);

    //No numbers are less than 2 except oneclicktip, which will be reset below
    /*if (numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }*/

    if (settingsName == "results" && numbers[settingsName] > 100) {
        numbers[settingsName] = 100;
    }
    if (settingsName == "maxfee" && numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }
    if (settingsName == "oneclicktip" && numbers[settingsName] < 547) {
        numbers[settingsName] = 0;
    }
    localStorageSet(localStorageSafe, settingsName, numbers[settingsName]);
    if(settingsName!='usdrate'){
        updateStatus(getSafeTranslation('updated', "Updated.") + " " + numbers[settingsName]);
    }
}

function showQRCode(spanid, size) {
    var addressToQR = document.getElementById(spanid).innerHTML;
    document.getElementById(spanid + "div").innerHTML = "";
    new QRCode(document.getElementById(spanid + "div"),
        {
            text: addressToQR,
            width: size,
            height: size,
        });
    //document.getElementById('qrclicktoshow').style.display='none';
}



function rateCallbackAction(rating, ratingtext, qaddress) {
    if (ratingtext === undefined) {
        ratingtext = "";
    }
    //var qaddress = that.theAddress;
    var transposed = transposeStarRating(rating);
    rateUser(qaddress, transposed, ratingtext);
}

function updatemutedwords() {

    var commasep = document.getElementById('mutedwords').value;
    mutedwords = commasep.split(',');
    for (var i = 0; i < mutedwords.length; i++) {
        mutedwords[i] = mutedwords[i].trim()
    }
    localStorageSet(localStorageSafe, "mutedwords", mutedwords);


}

function getAndPopulateFB(page, qaddress) {
    document.getElementById(page).innerHTML = fbHTML[page];
    show(page);
    if (!qaddress) {
        qaddress = pubkey;
    }
    var theURL = dropdowns.contentserver + '?action=' + page + '&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], '', false);
        }

        document.getElementById(page + 'table').innerHTML = contents;
        addDynamicHTMLElements(data);
        scrollToPosition();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function setPic() {
    setTrxPic(getAndPopulateSettings);
}



"use strict";

function displayContentBasedOnURLParameters(suggestedurl) {

    //Be very careful with input here . . . this is the most dangerous part of the code
    //input comes from URL so can contain any characters, so we want to sanitize it before using.
    //Use sane or safeGPBN or numberGPBN
    //If using getParameterByName - it must be marked HOSTILE in any receiving function

    if (backForwardEvent) {
        window.scrollTo(0, scrollhistory[window.location.hash]);
    } else {
        window.scrollTo(0, 0);
    }

    if (suggestedurl) {
        var url = suggestedurl;
        try {
            if (gtag && url.indexOf('#') != -1) {
                gtag('set', 'page_path', '/#' + url.split('#')[1]);
                gtag('event', 'page_view');
            }else{
                console.log('no tracking info error');
            }
        } catch (err) { }
    } else {
        var url = window.location.href;
        try {
            if (gtag) {
                gtag('set', 'page_path', window.location.pathname);
                gtag('event', 'page_view');
            }
        } catch (err) { }
    }

    //https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications



    //Clear highlighting of major nav buttons
    highlightmajornavbutton(null);

    var action;

    if (url.indexOf('#') != -1) {
        action = sane(url.substring(url.indexOf('#') + 1).toLowerCase());
        //navigation back to home page, clear topic

    } else if (url.indexOf('/p/') != -1) {
        //var postid = sane(url.substr(url.indexOf('/p/') + 3, 10).toLowerCase().trim());
        let postid = document.getElementById('threadid').innerHTML;
        showThread(sane(postid), sane(postid), 'thread');
        return;
    } else if (url.indexOf('/a/') != -1) {
        //var postid = sane(url.substr(url.indexOf('/a/') + 3, 10).toLowerCase().trim());
        let postid = document.getElementById('threadid').innerHTML;
        showThread(sane(postid), sane(postid), 'article');
        return;
    } else if (url.indexOf('/m/') != -1) {
        var pagingidHOSTILE = decodeURI(url.substring(url.indexOf('/m/') + 3).replace('@', '').toLowerCase()).trim();
        showMember('', sane(pagingidHOSTILE));
        return;
    } else if (url.indexOf('/t/') != -1) {
        var topicnameHOSTILE = decodeURI(url.substring(url.indexOf('/t/') + 3).toLowerCase()).trim();
        showTopic(0, numbers.results, sane(topicnameHOSTILE));
        return;
    } else if (url.indexOf('/list/') != -1) {
        var pagingidHOSTILE = decodeURI(url.substring(url.indexOf('/list/') + 6).replace('@', '').toLowerCase()).trim();
        showMember('', sane(pagingidHOSTILE), true);
        return;
    } else {
        setTopic("");
        action = "";
    }

    if (action.startsWith("show")) {
        showPostsNew(
            safeGPBN("order"),
            safeGPBN("content"),
            safeGPBN("topicname"),
            safeGPBN("filter"),
            numberGPBN("start"),
            numberGPBN("limit"),
            safeGPBN("qaddress")
        );
        setTopic(safeGPBN("topicname"));
    } else if (action.startsWith("list")) {
        showPostsNew("new", "posts", "", "list", 0, 25, safeGPBN("qaddress"));
    } else if (action.startsWith("notifications")) {
        showNotifications(numberGPBN("start"), numberGPBN("limit"), safeGPBN("qaddress"), safeGPBN("txid"), safeGPBN("nfilter"), numberGPBN("minrating"));
    } else if (action.startsWith("profile")) {
        showMember(sane(pubkey), '');
    } else if (action.startsWith("membersonly")) {
        showPostsNew('new', 'both', 'membersonly', 'everyone', 0, numbers.results, '');
    } else if (action.startsWith("topinfluencers")) {
        getAndPopulateNew('top50', 'both', '', '', 0, 50, 'posts', '', false);
    } else if (action.startsWith("member")) {
        showMember(safeGPBN("qaddress"), safeGPBN("pagingid"));
    } else if (action.startsWith("followers")) {
        showFollowers(safeGPBN("qaddress"));
    } else if (action.startsWith("following")) {
        showFollowing(safeGPBN("qaddress"));
    } else if (action.startsWith("blockers")) {
        showBlockers(safeGPBN("qaddress"));
    } else if (action.startsWith("blocking")) {
        showBlocking(safeGPBN("qaddress"));
    } else if (action.startsWith("rep")) {
        showReputation(safeGPBN("qaddress"));
    } else if (action.startsWith("posts")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'both');
    } else if (action.startsWith("feed")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'both');
    } else if (action.startsWith("comments")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'replies');
    } else if (action.startsWith("trustgraph")) {
        showReputation(safeGPBN("target"));
    } else if (action.startsWith("support")) {
        showBesties(safeGPBN("qaddress"));
    } else if (action.startsWith("topiclist")) {
        showTopicList();
    } else if (action.startsWith("topic")) {
        showTopic(numberGPBN("start"), numberGPBN("limit"), safeGPBN("topicname"), safeGPBN("type"));
    } else if (action.startsWith("article")) {
        showThread(safeGPBN("root"), safeGPBN("post"), 'article');
    } else if (action.startsWith("thread")) {
        showThread(safeGPBN("root"), safeGPBN("post"), 'thread');
    } else if (action.startsWith("settings")) {
        showSettings();
    } else if (action.startsWith("messages")) {
        showMessages(safeGPBN("messagetype"));
    } else if (action.startsWith("new")) {
        showNewPost(safeGPBN("txid"));
    } else if (action.startsWith("map")) {
        showMap(safeGPBN("geohash"), safeGPBN("post"));
    } else if (action.startsWith("myfeed") || action.startsWith("mypeople")) {
        showPostsNew('new', 'both', '', 'myfeed', 0, numbers.results, '');
    } else if (action.startsWith("mytags")) {
        showPostsNew('new', 'both', 'mytopics', 'everyone', 0, numbers.results, '');
    } else if (action.startsWith("firehose")) {
        showPostsNew('hot', 'both', '', 'everyone', 0, numbers.results, '');
    } else if (action.startsWith("wallet")) {
        showWallet();
    } else if (action.startsWith("custom")) {
        showCustom();
    } else if (action.startsWith("login")) {
        if (pubkey == "" || pubkey == null || pubkey == undefined) {
            showLogin();
        } else {
            showPFC(0, numbers.results, 'both');
        }
    } else {
        showPostsNew('hot', 'posts', '', 'everyone', 0, numbers.results, '');
    }
}

function hideAll() {
    switchToRegularMode();

    //This should just hide and empty the main tabs (exception of settings)
    //member page
    document.getElementById('mcidmemberheader').style.display = "none";
    document.getElementById('mcidmemberanchor').style.display = "none";
    document.getElementById('mcidmemberanchor').innerHTML = "";
    document.getElementById('trustgraph').style.display = "none";
    document.getElementById('trustgraph').innerHTML = "";
    document.getElementById('besties').style.display = "none";
    document.getElementById('besties').innerHTML = "";

    document.getElementById('feed').style.display = "none";
    document.getElementById('posts').style.display = "none";
    document.getElementById('comments').style.display = "none";
    document.getElementById('thread').style.display = "none";
    document.getElementById('notifications').style.display = "none";
    //remove the content too, so that we don't get conflicting ids
    document.getElementById('feed').innerHTML = "";
    document.getElementById('posts').innerHTML = "";
    document.getElementById('comments').innerHTML = "";
    document.getElementById('thread').innerHTML = "";
    document.getElementById('notificationsbody').innerHTML = "";

    document.getElementById('settingsanchor').style.display = "none";
    document.getElementById('loginbox').style.display = "none";
    document.getElementById('followers').style.display = "none";
    document.getElementById('following').style.display = "none";
    document.getElementById('blockers').style.display = "none";
    document.getElementById('blocking').style.display = "none";

    document.getElementById('newpost').style.display = "none";
    //document.getElementById('anchorratings').style.display = "none";
    document.getElementById('map').style.display = "none";
    document.getElementById('footer').style.display = "block";//show the footer - it may have been hidden when the map was displayed

    //document.getElementById('trustgraph').style.display = "none";
    //document.getElementById('community').style.display = "none";
    document.getElementById('topiclistanchor').style.display = "none";
    document.getElementById('toolsanchor').style.display = "none";
    document.getElementById('messagesanchor').style.display = "none";
    document.getElementById('topicmeta').style.display = "none";

}

function highlightmajornavbutton(thebutton) {
    document.getElementById("notificationsbutton").classList = "";
    document.getElementById("firehosebutton").classList = "";
    document.getElementById("myfeedbutton").classList = "";
    document.getElementById("topiclistbutton").classList = "";
    document.getElementById("privatemessagesbutton").classList = "";
    document.getElementById("newbutton").classList = "";
    if (thebutton) {
        document.getElementById(thebutton).classList = "majornavbuttonson";
    }
}

function setPageTitleFromID(translationID) {
    var pageTitle = getUnSafeTranslation(translationID);
    setPageTitleRaw(pageTitle);
}

function setPageTitleRaw(newContent) {
    document.getElementById('pagetitledivid').textContent = newContent;
}

function show(theDiv) {
    hideAll();
    document.getElementById(theDiv).style.display = "block";
}

function showOnly(theDiv) {
    document.getElementById(theDiv).style.display = "block";
}

function hide(theDiv) {
    document.getElementById(theDiv).style.display = "none";
}

function showWallet() {
    setPageTitleFromID("VVwallet");
    show('toolsanchor');
}

function showLogin() {
    show("loginbox");
    setPageTitleFromID("VV0102a");
}

function showMap(geohash, posttrxid) {
    show("map");
    document.getElementById('footer').style.display = "none";
    setPageTitleFromID("VV0101");
    getAndPopulateMap(geohash, posttrxid);
    document.getElementById('map').style.display = "block";
}

function hideMap() {
    //show("map");
    //getAndPopulateMap();
    document.getElementById('map').style.display = "none";
}

function showNewPost(txid, sourcenetwork) {
    highlightmajornavbutton("newbutton");
    show("newpost");
    setPageTitleFromID("VV0096");
    let mpelement = document.getElementById('memorandumpreview')
    if (mpelement && mpelement.innerHTML) {
        mpelement.innerHTML = "";
    }
    //let topicNameHOSTILE = "";
    //document.getElementById('memorandumtopic').value = topicNameHOSTILE;
    /*if (topicNameHOSTILE != "") {
        document.getElementById('memorandumtopicarea').style.display = "block";
        document.getElementById('memorandumtopicbutton').style.display = "none";
    } else {
        document.getElementById('memorandumtopicarea').style.display = "none";
        document.getElementById('memorandumtopicbutton').style.display = "block";
    }*/
    //Do calculations on maxlengths for topics and titles
    //topictitleChanged();

    if (txid) {
        getAndPopulateQuoteBox(txid);

        document.getElementById('quotetxid').value = txid;
        document.getElementById('memorandumtextarea').style.display = 'none';
        document.getElementById('memorandumtextbutton').style.display = 'none';

    } else {
        document.getElementById('quotetxid').value = '';
        document.getElementById('quotepost').style.display = 'none';
        document.getElementById('memorandumtextarea').style.display = 'none';
        document.getElementById('memorandumtextbutton').style.display = 'block';

        //Markdown editor doesn't seem to work well on Android
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        if (!isAndroid) {
            initMarkdownEditor();
        }
    }
}


function showNotifications(start, limit, qaddress, txid, nfilter, minrating) {

    highlightmajornavbutton("notificationsbutton");
    if (pubkey == "" || pubkey == null || pubkey == undefined) {
        showPFC(0, numbers.results, 'posts');
        return;
    }
    setPageTitleFromID("VV0095");

    if (!minrating) {
        minrating = 2;
    }
    getAndPopulateNotifications(start, limit, "notifications", pubkey, txid, nfilter, minrating);

}

function showSettings() {
    //Need to be logged in
    /*if (pubkey == "" || pubkey == null || pubkey == undefined) {
        showPosts(0, numbers.results, 'all');
        return;
    }*/
    hideAll();
    setPageTitleFromID("VV0166");
    show('settingsanchor');
    getAndPopulateSettings();

}


function showMember(qaddress, pagingID, isList) {
    //if pagingid is not empty - await qaddress
    if (!typeof headeraddress === 'undefined') {
        qaddress = headeraddress;
        headeraddress = undefined;
    }

    if (qaddress == '' && pagingID) {
        var theURL = dropdowns.contentserver + '?action=resolvepagingid&pagingid=' + encodeURIComponent(pagingID) + '&address=' + pubkey;
        getJSON(theURL).then(function (data) {
            if (data && data.length > 0) {
                showMember(san(data[0].address), sane(data[0].pagingid), isList);
                return;
            } else {
                hideAll();
                showOnly("mcidmemberheader");
                showOnly("mcidmembertabs");
                showOnly("mcidmemberanchor");
                document.getElementById('mcidmemberanchor').innerHTML = getSafeTranslation('pagingidnotfount', 'This paging id not found.');
                return;
            }
        }, function (status) { //error detection....
            showErrorMessage(status, 'messageslist', theURL);
        });
        return;
    }

    if (isList) {
        showPostsNew("new", "posts", "", "list", 0, 25, sane(qaddress));
    } else {
        //setPageTitleFromID("VV0063");
        hideAll();
        showOnly("mcidmemberheader");
        showOnly("mcidmembertabs");
        showOnly("mcidmemberanchor");
        setPageTitleRaw(". . .");
        getDataMember(sane(qaddress));
        var obj2 = { address: sane(qaddress), profileclass: 'filteron', reputationclass: 'filteroff', postsclass: 'filteroff', bestiesclass: 'filteroff' };
        document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
    }

}

function showBesties(qaddress) {
    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("besties");
    getAndPopulateBesties(qaddress);

    //Show Filter
    var obj2 = { address: qaddress, profileclass: 'filteroff', reputationclass: 'filteroff', postsclass: 'filteroff', bestiesclass: 'filteron' };
    document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showReputation(qaddress) {

    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("trustgraph");
    getAndPopulateTrustGraph(pubkey, qaddress);

    //Show Filter
    var obj2 = { address: qaddress, profileclass: 'filteroff', reputationclass: 'filteron', postsclass: 'filteroff', bestiesclass: 'filteroff' };
    document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showCustom() {
    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("besties");

    getAndPopulateCustom();

    //Show Filter
    //var obj2 = {address: qaddress, profileclass: 'filteroff', reputationclass: 'filteron', postsclass: 'filteroff', bestiesclass: 'filteroff'};
    //document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showMessages(messagetype, start, limit) {
    highlightmajornavbutton("privatemessagesbutton");
    show("messagesanchor");
    setPageTitleFromID("VV0047");
    getAndPopulateMessages(messagetype, start, limit);
}

function showPFC(start, limit, page) {
    showPostsNew('hot', page, '', 'everyone', start, limit)
}

function showPostsNew(order, content, topicname, filter, start, limit, qaddress) {
    //setTopic('');
    if (topicname == 'mytopics') {
        highlightmajornavbutton("topiclistbutton");
    } else if (filter == 'myfeed') {
        highlightmajornavbutton("myfeedbutton");
    } else if (filter == 'everyone') {
        highlightmajornavbutton("firehosebutton");
    }

    getAndPopulateNew(order, content, topicname, filter, start, limit, 'posts', qaddress, true);
}



//Topics
function showTopic(start, limit, topicname, type) {
    setTopic(topicname);
    if (!type) type = "new";
    getAndPopulateNew(type, 'both', topicname, 'everyone', start, limit, 'posts', '', true);
}

function showTopicList() {
    setTopic("");
    setPageTitleFromID("VV0100");
    getAndPopulateTopicList(true);
}

//function postsSelectorChanged() {

//get value from the 4 drop downs
//var selector;

//orderselector
//selector = document.getElementById('orderselector');
//var order = selector.options[selector.selectedIndex].value;

//contentselector
//selector = document.getElementById('contentselector');
//var content = selector.options[selector.selectedIndex].value;

//topicselector
//selector = document.getElementById('topicselector');
//var topicNameHOSTILE = selector.options[selector.selectedIndex].value;

//filterselector
//selector = document.getElementById('filterselector');
//var filter = selector.options[selector.selectedIndex].value;

//These two statements may trigger page load twice on firefox but not on other browsers

//set the document location without triggering the back/forward function
//assumeBackForwardEvent = false;
//nlc();
//document.location.hash = "#show?order=" + order + "&content=" + content + "&topicname=" + encodeURIComponent(topicNameHOSTILE) + "&filter=" + filter + "&start=0&limit=" + Number(numbers.results);
//setTimeout(function () { assumeBackForwardEvent = true; }, 100);

//show the posts
//displayContentBasedOnURLParameters();
//}

/*function exitTopic(){
    //currentTopic = "";
    //document.getElementById('memotopic').value = "";
    //document.getElementById('memorandumtopic').value = "";
    enterTopic("");    
}*/
function setOrder(selectorvalue, order) {
    var selector = document.getElementById(selectorvalue);
    for (var i = 0; i < selector.length; i++) {
        if (selector.options[i].value == order) {
            selector.selectedIndex = i;
        }
    }
}


function setTopic(topicName) {

    if (topicName == null || topicName == "") {
        //selector.selectedIndex = 0;
        //hide("topicmeta");
        return;
    }

    if (topicName.toLowerCase() == "myfeed" || topicName.toLowerCase() == "mytopics") {
        //hide("topicmeta");
    } else {
        getAndPopulateTopic(topicName);
    }

    //selector.selectedIndex = 1;
    //selector.options[selector.selectedIndex].value = topicNameHOSTILE;
    //selector.options[selector.selectedIndex].text = capitalizeFirstLetter(topicNameHOSTILE.substring(0, 13));
    if (topicName.toLowerCase() == "mytopics") {
        setPageTitleFromID("VV0128");
    } else {
        setPageTitleRaw('#' + capitalizeFirstLetter(topicName));
    }
}


function showThread(roottxid, txid, articleStyle) {
    getAndPopulateThread(roottxid, txid, 'thread');
    if (articleStyle == "article") {
        switchToArticleMode(roottxid);
    }
}

function showFollowers(qaddress) {
    getAndPopulateFB('followers', qaddress);
}

function showFollowing(qaddress) {
    getAndPopulateFB('following', qaddress);
}

function showBlockers(qaddress) {
    getAndPopulateFB('blockers', qaddress);
}

function showBlocking(qaddress) {
    getAndPopulateFB('blocking', qaddress);

}


//suspend back/forward detection for map panning
var suspendPageReload = false;

let hashHistory = [window.location.hash];
let historyLength = window.history.length;

var detectBackOrForward = function () {

    var hash = window.location.hash, length = window.history.length;
    if (navlinkclicked) {
        navlinkclicked = false;
        //not a back/foward nav event
        hashHistory.push(hash);
        historyLength = length;
        backForwardEvent = false;
        if (!suspendPageReload) {
            displayContentBasedOnURLParameters();
        }
        return true;
    }
    else {
        //this is a back/foward nav event
        backForwardEvent = true;
        if (hashHistory[hashHistory.length - 2] == hash) {
            hashHistory = hashHistory.slice(0, -1);
        } else {
            hashHistory.push(hash);
        }
        if (!suspendPageReload) {
            displayContentBasedOnURLParameters();
        }
        return true;
    }
}

var scrollhistory = [];

var navlinkclicked = false;
function nlc() {
    //navlinkclicked
    navlinkclicked = true;
}


//Onhashchange is unreliable - try testing for location change 10 times a second
var lastdocumentlocation = location.hash;

setTimeout(testForHashChange, 100);
function testForHashChange() {

    if (lastdocumentlocation != location.hash || navlinkclicked) {
        lastdocumentlocation = location.hash;
        detectBackOrForward();
    }
    setTimeout(testForHashChange, 100);
}
var backForwardEvent = false;

document.addEventListener("click", function () { scrollhistory[window.location.hash] = window.scrollY; }, true);
document.getElementsByTagName('body')[0].onmouseleave = function () { scrollhistory[window.location.hash] = window.scrollY; }

/*
var assumeBackForwardEvent = true;
window.onhashchange = function () {
    if (assumeBackForwardEvent) {
        //usually, but not always a result of back/forward click
        window.innerDocClick = false;
    }
    assumeBackForwardEvent = true;
}
//record the scroll position


//User's mouse is inside the page.
document.getElementsByTagName('body')[0].onmouseover = function () { window.innerDocClick = true; }

//User's mouse has left the page.
document.getElementsByTagName('body')[0].onmouseleave = function () { window.innerDocClick = false; }
*/

function scrollToPosition(theElement) {
    if (backForwardEvent) {
        window.scrollTo(0, scrollhistory[window.location.hash]);
    } else if (theElement) {
        scrollToElement(theElement);
    }
    else {
        window.scrollTo(0, 0);
    }
    backForwardEvent = false;
}
"use strict";

function checkForPrivKey() {
    if(isBitCloutUser()){
        return true;
    }
    return checkForNativeUser();
}

function checkForNativeUser() {
    if (privkey == "" && pubkey != "") {
        alert(getSafeTranslation('readonlymode2', "You may be logged in with a public key in read only mode. Try logging out and logging back in again."));
        return false;
    } else if (privkey == "") {
        alert(getSafeTranslation('mustlogin', "You must login to do this."));
        return false;
    }

    if (tq.getBalance(chainheight) < 547) {
        alert(getSafeTranslation('notenough2', "This is a Membercoin Action only and you do not have enough satoshis to do this. You can click on your balance to refresh it. Try logging out and logging back in again if you keep getting this message."));
        return false;
    }

    return true;
}

function checkForNativeUserAndHasBalance(){
    return (privkey && tq.getBalance(chainheight) > 546);
}

//var waitForTransactionToComplete = false;

//is this used anywhere? TODO check
function sendTransaction(tx) {
    tq.queueTransaction(tx);
}

function repost(txid, privkey) {

    //Repost memo 	0x6d0b 	txhash(32), message(184)

    //if (!checkForPrivKey()) return false;
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var tx = {
        data: ["0x6d0b", "0x" + reversetx],
        cash: { key: privkey }
    }

    /*
    if (message != null && message != '') {
        tx = {
            data: ["0x6d0b", "0x" + reversetx, message],
            cash: { key: privkey }
        }
    }*/

    updateStatus(getSafeTranslation('remembering', "Remembering"));
    tq.queueTransaction(tx);
}

function setTrxPic(callback) {
    if (!checkForNativeUser()) return false;

    document.getElementById('settingspicbutton').disabled = true;
    document.getElementById('settingspic').disabled = true;

    var newName = document.getElementById('settingspic').value;
    //if (!(newName.startsWith('https://i.imgur.com/') && (newName.endsWith('.jpg') || newName.endsWith('.png')))) {
    //    alert(getSafeTranslation('picformat', "Profile pic must of of the format") + " https://i.imgur.com/XXXXXXXX.jpg");
    //    return;
    //}
    const tx = {
        data: ["0x6d0a", newName],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingpic', "Setting Profile Pic"));

    //TODO, on error, this should really enable the text field and text button again
    tq.queueTransaction(tx,callback);
}


function setName() {
    if (!checkForNativeUser()) return false;


    document.getElementById('settingsnametextbutton').disabled = true;
    document.getElementById('settingsnametext').disabled = true;

    var newName = document.getElementById('settingsnametext').value;

    const tx = {
        data: ["0x6d01", newName],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingname', "Setting Name"));

    //TODO, on error, this should really enable the text field and text button again
    tq.queueTransaction(tx);
}



async function sendMessageRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction, messageRecipient, stampAmount) {

    document.getElementById(divForStatus).value = getSafeTranslation('bytesremaining', "Sending Message . . . bytes remaining . .") + replyHex.length / 2;

    var sendHex = "";
    if (replyHex.length > maxhexlength) {
        sendHex = replyHex.substring(0, maxhexlength);
        replyHex = replyHex.substring(maxhexlength);
    } else {
        sendHex = replyHex;
        replyHex = "";
    }

    var tx;
    if (txid == null) {
        //start of message
        tx = {
            data: ["0x6dd0", "0x" + sendHex],
            cash: {
                key: privatekey,
                to: [{ address: messageRecipient, value: Number(stampAmount) }]
            }
        }
    } else {
        var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
        tx = {
            data: ["0x6dd1", "0x" + reversetx, "0x" + sendHex],
            cash: { key: privatekey }
        }
    }

    //await sleep(500); // Wait a little to show message
    if (waitTimeMilliseconds > 0) {
        updateStatus(getSafeTranslation('waiting', "Seconds to wait") + " " + (waitTimeMilliseconds / 1000));
        await sleep(waitTimeMilliseconds);
    }

    //If there is still more to send
    if (replyHex.length > 0) {
        tq.queueTransaction(tx, function (newtxid) { sendMessageRaw(privatekey, newtxid, replyHex, 1000, divForStatus, completionFunction); }, null);
    } else {
        //last one
        tq.queueTransaction(tx, completionFunction, null);
    }

}


function postmemorandumRaw(posttext, postbody, privkey, topic, newpostmemorandumstatus, memorandumpostcompleted, quotetxid) {

    let postTitleHex = new Buffer(posttext).toString('hex');
    let replyHex = new Buffer(postbody).toString('hex');

    var maxPostLength=maxhexlength;
    if(topic){
        maxPostLength=maxPostLength-4-topic.toString('hex').length;
    }
    if(quotetxid){
        var reversetx = quotetxid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
        maxPostLength=maxPostLength-4-reversetx.toString('hex').length;
    }

    //If the title is too long, put the excess in the reply. todo - find a natural breakpoint, see sendreplyraw for code
    if (postTitleHex.length > maxPostLength) {
        replyHex=postTitleHex.substr(maxPostLength)+replyHex;
        postTitleHex=postTitleHex.substr(0,maxPostLength);
    }

    var tx = {
        data: ["0x6d02", "0x" + postTitleHex],
        cash: { key: privkey }
    }

    if (topic) {
        tx = {
            data: ["0x6d0c", topic, "0x" + postTitleHex],
            cash: { key: privkey }
        }
    }

    if(quotetxid){
        
        tx = {
            data: ["0x6d0b", "0x" + reversetx, "0x" + postTitleHex],
            cash: { key: privkey }
        }
        if (topic) {
            tx = {
                data: ["0x6d0f", "0x" + reversetx, topic, "0x" + postTitleHex],
                cash: { key: privkey }
            }
        }
        updateStatus(getSafeTranslation('quoting', "Quoting"));
    }


    let finishFunction=memorandumpostcompleted;
    if(replyHex){
        finishFunction=function (newtxid) { sendReplyRaw(privkey, newtxid, replyHex, 5000, newpostmemorandumstatus, memorandumpostcompleted); };
    }
    
    tq.queueTransaction(tx, finishFunction, null);
}

/*
function quotepostRaw(posttext, privkey, topic, newpoststatus, memocompleted, txid) {

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var tx = {
        data: ["0x6d0b", "0x" + reversetx, posttext],
        cash: { key: privkey }
    }

    if (topic != "") {
        tx = {
            data: ["0x6d0f", "0x" + reversetx, topic, posttext],
            cash: { key: privkey }
        }
    }

    updateStatus(getSafeTranslation('quoting', "Quoting"));

    tq.queueTransaction(tx, memocompleted, null);
}*/

/*
function postRaw(posttext, privkey, topic, newpoststatus, memocompleted, txid) {

    var tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }
    console.log(posttext.length);
    if (topic != "") {
        tx = {
            data: ["0x6d0c", topic, posttext],
            cash: { key: privkey }
        }
    }

    tq.queueTransaction(tx, memocompleted, null);
}*/
/*
function postgeoRaw(posttext, privkey, geohash, newpostgeostatus, geocompleted) {

    const tx = {
        data: ["0x6da8", geohash, posttext],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendinggeotag', "Sending Geotagged Post"));
    tq.queueTransaction(tx, geocompleted, null);
}*/


//var maxhexlength=368; //memo - 184*2
var maxhexlength=4000*2;
var whitespacebreak=20;

async function sendReplyRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction) {

    document.getElementById(divForStatus).value = getSafeTranslation('bytesremaining', "Sending Reply . . . bytes remaining . . ") + replyHex.length / 2;

    var sendHex = "";
    
    if (replyHex.length > maxhexlength) {
        //Search for whitespace - try to break at a whitespace
        var whitespaceIndex = maxhexlength-whitespacebreak;
        var spaceIndex = replyHex.lastIndexOf("20", maxhexlength);
        if (spaceIndex % 2 == 0 && spaceIndex > whitespaceIndex) {
            whitespaceIndex = spaceIndex;
        }
        var nlIndex = replyHex.lastIndexOf("0A", maxhexlength);
        if (nlIndex % 2 == 0 && nlIndex > whitespaceIndex) {
            whitespaceIndex = nlIndex;
        }
        var crIndex = replyHex.lastIndexOf("0D", maxhexlength);
        if (crIndex % 2 == 0 && crIndex > whitespaceIndex) {
            whitespaceIndex = crIndex;
        }

        if (whitespaceIndex > maxhexlength-whitespacebreak) {
            sendHex = replyHex.substring(0, whitespaceIndex);
            replyHex = replyHex.substring(whitespaceIndex);
        } else {
            sendHex = replyHex.substring(0, maxhexlength);
            replyHex = replyHex.substring(maxhexlength);
        }
    } else {
        sendHex = replyHex;
        replyHex = "";
    }

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d03", "0x" + reversetx, "0x" + sendHex],
        cash: { key: privatekey }
    }

    //await sleep(500); // Wait a little to show message
    if (waitTimeMilliseconds > 0) {
        updateStatus(getSafeTranslation('waiting', "Seconds to wait")) + " " + (waitTimeMilliseconds / 1000);
        await sleep(waitTimeMilliseconds);
    }

    //If there is still more to send
    if (replyHex.length > 0) {
        tq.queueTransaction(tx, function (newtxid) { sendReplyRaw(privatekey, newtxid, "7c" + replyHex, 1000, divForStatus, completionFunction); }, null);
    } else {
        //last one
        tq.queueTransaction(tx, completionFunction, null);
    }

}



function sendTipRaw(txid, tipAddress, tipAmount, privkey, successFunction) {
    if(!tipAddress || tipAddress=='null'){
        alert("No address for tip. Maybe the user needs to set a handle?");
        return;
    }
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: {
            key: privkey,
            to: [{ address: tipAddress, value: Number(tipAmount) }]
        }
    }
    updateStatus(getSafeTranslation('sendingtip', "Sending Tip"));
    tq.queueTransaction(tx, successFunction, null);
}

function sendLike(txid,privkey) {
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendinglike', "Sending Like"));
    tq.queueTransaction(tx);
}

function memoPinPost(txid, privkey){
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6da9", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('pinningpost', "Pinning Post"));
    tq.queueTransaction(tx);
}

function setProfile() {
    if (!checkForNativeUser()) return false;


    document.getElementById('settingsprofiletextbutton').disabled = true;
    var newProfile = document.getElementById('settingsprofiletext').value;

    const tx = {
        data: ["0x6d05", newProfile],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingprofile', "Setting Profile"));
    tq.queueTransaction(tx);
}


function subTransaction(topicHOSTILE) {

    if (!checkForNativeUser()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0d", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingsub', "Sending Subscribe"));
    tq.queueTransaction(tx);
}

function unsubTransaction(topicHOSTILE) {
    if (!checkForNativeUser()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0e", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingunsub', "Sending Unsubscribe"));
    tq.queueTransaction(tx);
}

function addressTransaction(removeElementID, qaddress, actionCode, statusMessage) {
    
    //document.getElementById(removeElementID).style.display = "none";
    var addressraw = getLegacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}

function follow(qaddress,targetpublickey) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        addressTransaction('memberfollow', qaddress, "0x6d06", getSafeTranslation('sendingfollow', "Sending Follow"));
    }
    if(isBitCloutUser()){
        sendBitCloutFollow(targetpublickey);
    }
}

function unfollow(qaddress,targetpublickey) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        addressTransaction('memberfollow', qaddress, "0x6d07", getSafeTranslation('sendingunfollow', "Sending Unfollow"));
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnFollow(targetpublickey);
    //}
}

function mute(qaddress,targetpublickey) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        addressTransaction('memberblock', qaddress, "0x6d16", getSafeTranslation('sendingmute', "Sending Mute"));
    }
    //if(isBitCloutUser()){
    //    sendBitCloutMute(targetpublickey);
    //}
}

function unmute(qaddress,targetpublickey) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        addressTransaction('memberblock', qaddress, "0x6d17", getSafeTranslation('sendingunmute', "Sending Unmute"));
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnMute(targetpublickey);
    //}
}

function sub(topicHOSTILE) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        subTransaction(topicHOSTILE);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutSub(topicHOSTILE);
    //}
}

function unsub(topicHOSTILE) {
    if (!checkForPrivKey()) return false;
    if(checkForNativeUserAndHasBalance()){
        unsubTransaction(topicHOSTILE);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnSub(topicHOSTILE);
    //}
}





function sendDislike(txid) {
    txidTransaction(txid, "0x6db4", getSafeTranslation('sendingdislike', "Sending Dislike"));
}

function sendHidePost(txid) {
    txidTransaction(txid, "0x6dc5", getSafeTranslation('sendinghidepost', "Sending Hide Post"));
}

function sendSendUnhidePost(txid) {
    txidTransaction(txid, "0x6dc6", getSafeTranslation('sendingunhidepost', "Sending Unhide Post"));
}

function txidTransaction(txid, actionCode, statusMessage) {
    if (!checkForNativeUser()) return false;

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: [actionCode, "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);

}

function rateUser(qaddress, rating, ratingcomment) {
    if (!checkForNativeUser()) return false;
    if (ratingcomment === undefined) {
        ratingcomment = "";
    }

    var addressraw = getLegacyToHash160(qaddress);

    var hexRating = "0x" + toHexString([rating]);
    const tx = {
        data: ["0x6da5", "0x" + addressraw, hexRating, ratingcomment],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingrating', "Sending Rating"));
    tq.queueTransaction(tx);
    return true;
}

function designate(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc1', getSafeTranslation('sendingaddfilter', "Sending Add Filter"), topicHOSTILE);
}

function dismiss(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc2', getSafeTranslation('sendingremovefilter', "Sending Remove Filter"), topicHOSTILE);
}

function hideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc3', getSafeTranslation('sendinghidemember', "Sending Hide Member"), topicHOSTILE);
}

function unhideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc4', getSafeTranslation('sendingunhidemember', "Sending Unhide Member"), topicHOSTILE);
}


function addressTopicTransaction(removeElementID, qaddress, actionCode, statusMessage, topicHOSTILE) {
    if (!checkForNativeUser()) return false;

    document.getElementById(removeElementID).style.display = "none";
    var addressraw = getLegacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw, topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}


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
if (typeof module !== 'undefined') {
    module.exports = TransactionQueue;
}
"use strict";

var map = null;
var popup;
var postpopup;
var markersDict = {};
var firstload = true;
var mapTileProvider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var L=null;

async function getAndPopulateMap(geohash, posttrxid) {

    geohash = san(geohash);
    posttrxid = san(posttrxid);

    if (map == null) {

        if(!L){
            await loadScript("js/lib/leaflet/leaflet.js");
        }

        map = L.map('map', { attributionControl: false });

        //Use attribution control as a close button
        var att = L.control.attribution();
        att.setPrefix("");
        att.addAttribution(getMapCloseButtonHTML()).setPosition('topright').addTo(map);
        //Load locations onto map when bounds_changed event fires. Only want this to happen one time. 
        map.on('moveend', loadLocationListFromServerAndPlaceOnMap);

        //Set London location and open street map tiles
        map.setView([51.505, -0.09], 13);
        L.tileLayer(mapTileProvider, {}).addTo(map);

        //Attribution
        var att2 = L.control.attribution();
        att2.addAttribution(getOSMattributionHTML()).setPosition('bottomright').addTo(map);

        //Popup for thread related to location
        //popup = L.popup({ autoPan: true, minWidth: 550, maxWidth: getWidth(), maxHeight: getHeight() });
        popup = L.popup({ autoPan: true, minWidth: 320 });
        postpopup = L.popup({ autoPan: true, minWidth: 320 });
    }
    if (geohash == null || geohash == "") {
        //Try to zoom to current position
        setTimeout(function () { navigator.geolocation.getCurrentPosition(function (location) { map.setView([location.coords.latitude, location.coords.longitude], 13); }); }, 1000);
    } else {
        var zoomLocation = decodeGeoHash(geohash);
        zoomLocation = [zoomLocation.latitude[0], zoomLocation.longitude[0]];
        setTimeout(function () {
            if (posttrxid != null && posttrxid != "") {
                popup.txid = posttrxid;
            }

            map.setView(zoomLocation, 15);

            if (posttrxid != null && posttrxid != "") {
                popup.setLatLng(zoomLocation).setContent(mapThreadLoadingHTML("")).openOn(map);
                getAndPopulateThread(posttrxid, posttrxid, 'mapthread');
            }

        }, 1000);
    }

    //post to map by clicking on it
    map.on('click', onMapClick);

    var suspendZoom=null;
    //map.on('moveend', onMapMove);
    map.on('moveend', function () {
        suspendPageReload=true;
        if (firstload && popup.txid != null) {
            location.href = "#map?geohash=" + encodeGeoHash(map.getCenter().lat, map.getCenter().lng) + "&post=" + popup.txid;
            firstload = false;
        }
        else if (popup.isOpen() && popup.txid != null) {
            location.href = "#map?geohash=" + encodeGeoHash(popup._latlng.lat, popup._latlng.lng) + "&post=" + popup.txid;
        } else {
            location.href = "#map?geohash=" + encodeGeoHash(map.getCenter().lat, map.getCenter().lng);
        }
        clearTimeout(suspendZoom);
        suspendZoom=setTimeout(function () {suspendPageReload=false;},1000);
    });

    popup.on('close', function (e) {
        //This doesn't seem to fire.
        //Its purpose is to change the anchor link when the popup is closed
        console.log('map popup closed');
        popup.txid = null;
        map.moveend();
    });


}



function openOverlay(e) {
    var marker = e.sourceTarget;
    popup.setLatLng(e.latlng).setContent(mapThreadLoadingHTML(marker.previewHTML)).openOn(map);
    getAndPopulateThread(marker.roottxid, marker.txid, 'mapthread');
    popup.txid = marker.roottxid;
    popup.txidloc = e.latlng;
    suspendPageReload=true;
    location.href = "#map?geohash=" + encodeGeoHash(e.latlng.lat, e.latlng.lng) + "&post=" + popup.txid;
    setTimeout(function () {suspendPageReload=false;},1000);
    return;
}

function openPreview(e) {
    var marker = e.sourceTarget;
    marker.bindTooltip(marker.previewHTML).openTooltip();
    return;
}


function onMapClick(e) {

    var htmlContent = getMapPostHTML(e.latlng.lat, e.latlng.lng, (pubkey==''));

    postpopup.setLatLng(e.latlng).setContent(htmlContent).openOn(map);
}


function loadLocationListFromServerAndPlaceOnMap(event) {

    var mapBounds = map.getBounds();
    var theURL = dropdowns.contentserver + '?action=map&address=' + pubkey + "&north=" + mapBounds.getNorthEast().lat + "&east=" + mapBounds.getNorthEast().lng + "&south=" + mapBounds.getSouthWest().lat + "&west=" + mapBounds.getSouthWest().lng;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var pageName = san(data[i].txid);
            var marker = markersDict[pageName];
            if (marker == null) {
                var marker = L.marker([Number(data[i].lat), Number(data[i].lon)]).addTo(map);
                marker.txid = san(data[i].txid);
                marker.roottxid = san(data[i].roottxid);
                marker.previewHTML = ds(data[i].message);
                markersDict[pageName] = marker;
                marker.on('click', openOverlay);
                marker.on('mouseover', openPreview);
            }
        }
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}

"use strict";

function getAndPopulateTrustGraph(member, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.contentserver + '?action=trustgraph&address=' + member + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        if(data[0]){
            setPageTitleRaw("@" + data[0].targetpagingid);
        } else {
            document.getElementById('trustgraphdetails').innerHTML = "No information on this right now.";
            return;
        }

        var directrating = 0.0;
        var oneRemoveRating = 0.0;
        var oneRemoveRatingCount = 0.0;
        var overallRating = 0.0;


        var contentsHTML = "";

        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i].inter == '') {
                //Direct Rating
                contentsHTML += getDirectRatingHTML(data[i]);
                directrating = Number(data[i].memberrating);
            } else {
                contentsHTML += getIndirectRatingHTML(data[i]);
                //Try to get at least 10 ratings, or all the ratings if they are not follow based ratings 
                //if ((i < 10 && Number(data[i].memberrating) > 190) || Number(data[i].memberrating) > 191) {
                oneRemoveRating += Number(data[i].interrating);
                oneRemoveRatingCount++;
                //}
            }
        }


        //alert(contents);

        var oneRemove = 0.0;
        if (oneRemoveRatingCount > 0) {
            oneRemove = oneRemoveRating / oneRemoveRatingCount;
        }

        if (directrating > 0 && oneRemoveRatingCount > 0) {
            overallRating = (directrating + oneRemove) / 2;
        } else if (directrating > 0 && oneRemoveRatingCount == 0) {
            overallRating = directrating;
        } else if (directrating == 0 && oneRemoveRatingCount > 0) {
            overallRating = oneRemove;
        }

        overallRating = (overallRating / 64) + 1;

        if (oneRemoveRatingCount == 0) {
            overallRating = 0;
        }

        contentsHTML = getTrustRatingTableHTML(contentsHTML, overallRating.toFixed(1));

        document.getElementById(page).innerHTML = contentsHTML;


        if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

        var cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,


            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'label': 'data(label)',
                    'height': 80,
                    'width': 80,
                    'background-fit': 'cover',
                    'border-color': '#000',
                    'border-width': 3,
                    'border-opacity': 0.75,
                    'text-margin-y': 5,
                    'color': '#999',
                })
                .selector('.bottom-center')
                .css({
                    "text-valign": "bottom",
                    "text-halign": "center"
                })
                .selector('.eater')
                .css({
                    'border-width': 9
                })
                .selector('edge')
                .css({
                    'curve-style': 'bezier',
                    'width': 6,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#ffaaaa',
                    'target-arrow-color': '#ffaaaa'
                })
        }); // cy init

        var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
        cy.add(eles);
        cy.style().selector('#' + data[0].member).css({ 'background-image': getPicURL(data[0].memberpicurl, profilepicbase, data[0].member) });
        cy.style().selector('#' + data[0].target).css({ 'background-image': getPicURL(data[0].targetpicurl, profilepicbase, data[0].target) });


        var items = data.length;
        for (var i = 0; i < items; i++) {

            var position = i;
            if (i % 2 == 1) {
                position = (i + 1) / 2;
            } else {
                position = items - (i / 2);
            }

            var x = -250 * Math.sin(2 * Math.PI * position / items);
            var y = -250 * Math.cos(2 * Math.PI * position / items);

            var theRating = outOfFive(data[i].memberrating);
            var theRating2 = outOfFive(data[i].interrating);

            var textNoteNode = data[i].membername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' ' + theRating + '/5 (' + data[i].memberreason + ')';
            var textNoteEdge = data[i].intername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' ' + theRating2 + '/5 (' + data[i].interreason + ')';


            var eles = cy.add([


                { group: 'nodes', data: { label: data[i].intername, id: data[i].inter, textnote: textNoteNode }, classes: 'bottom-center', position: { x: x, y: y } },
                /*{ group: 'edges', data: { id: data[i].member+data[i].inter, source: data[i].member, target: data[i].inter }, classes: edgecolorsize1 },*/
                { group: 'edges', data: { id: data[i].inter + data[i].target, source: data[i].inter, target: data[i].target, textnote: textNoteEdge } }

            ]);
            cy.add(eles);

            cy.style().selector('#' + data[i].inter).css({ 'background-image': getPicURL(data[i].interpicurl, profilepicbase, data[i].inter) });

            let theRatingAbs = Math.abs(theRating2 - 3);
            let linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
            if (theRating2 < 3) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
            cy.style().selector('#' + data[i].inter + data[i].target).css({ 'width': (4 + theRatingAbs * 8), 'line-color': linecolor, 'target-arrow-color': linecolor });

            theRatingAbs = Math.abs(theRating - 3);
            linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
            if (theRating < 3) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
            cy.style().selector('#' + data[i].inter).css({ 'border-width': (4 + theRatingAbs * 4), 'border-color': linecolor });

            //'width': 12,
            //'line-color': '#61aff0',
            //'target-arrow-color': '#61aff0',

            //cy.data(data[i].inter,data[i].intername);
        }

        cy.userZoomingEnabled(false);
        cy.center();
        cy.fit();

        cy.on('tap', 'node', function () {
            if(this.data('membertxid')){
                window.location.href = "#thread?root=" + this.data('membertxid');
            }
            //window.location.href = "#rep?qaddress=" + this.data('id');
            //must add txid of rating to db first before can enable this
        });

        cy.on('tap', 'node', function () {
            window.location.href = "#rep?qaddress=" + this.data('id');
        });

        cy.on('mouseover', 'node', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        cy.on('mouseover', 'edge', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });


        var overallStarRating = raterJs({
            starSize: 48,
            rating: Math.round(overallRating * 10) / 10,
            element: document.querySelector("#overall"),
            //rateCallback: function rateCallback(rating, done) {
            //rateCallbackAction(rating, this);
            //    done();
            //}
        });
        overallStarRating.disable();

        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i].inter == '') {
                var rawRating = Number(data[i].memberrating);
                var textNote = "";
                var theRating = (rawRating / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 24,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].target)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating}' + textNote,
                });
                starRating1.disable();

            } else {

                var theRating = (Number(data[i].memberrating) / 64) + 1;
                var rawRating = Number(data[i].memberrating);
                var textNote = "";
                textNote = data[i].memberreason;
                var starRating1 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].inter)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' {rating}/{maxRating} (' + textNote + ')',
                });
                starRating1.disable();

                var theRating2 = (Number(data[i].interrating) / 64) + 1;
                var rawRating = Number(data[i].interrating);
                var textNote2 = "";
                textNote2 = data[i].interreason;

                var starRating2 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating2 * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].inter) + san(data[i].target)),
                    disableText: rts(data[i].intername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating} (' + textNote2 + ')',
                });
                starRating2.disable();
            }

        }

        addDynamicHTMLElements();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });

}

function getAndPopulateBesties(target) {

    var page = 'besties';
    //First clear old graph

    document.getElementById('besties').innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.contentserver + '?action=support&address=' + pubkey + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        if (data[0]) {
            setPageTitleRaw("@" + data[0].pagingid);
        } else {
            document.getElementById('besties').innerHTML = "No information on this right now.";
            return;
        }

        document.getElementById('besties').innerHTML = bestiesHTML;
        if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

        var cy = cytoscape({
            container: document.getElementById('bestiescy'),

            boxSelectionEnabled: false,
            autounselectify: true,


            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'label': 'data(label)',
                    'height': 80,
                    'width': 80,
                    'background-fit': 'cover',
                    'border-color': '#000',
                    'border-width': 3,
                    'border-opacity': 0.75,
                    'text-margin-y': 5,
                    'color': '#999',
                })
                .selector('.bottom-center')
                .css({
                    "text-valign": "bottom",
                    "text-halign": "center"
                })
                .selector('.eater')
                .css({
                    'border-width': 9
                })
                .selector('edge')
                .css({
                    'curve-style': 'bezier',
                    'width': 6,
                    'target-arrow-shape': 'triangle',
                    'line-color': 'rgb(71,137,75)',
                    'target-arrow-color': 'rgb(71,137,75)'
                })
        }); // cy init

        var eles = cy.add([{ group: 'nodes', data: { id: data[0].address, label: data[0].name, textnote: data[0].name }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
        cy.add(eles);
        cy.style().selector('#' + data[0].address).css({ 'background-image': getPicURL(data[0].picurl, profilepicbase, data[0].address), 'height': 160, 'width': 160, });


        var items = data.length;

        var max = Number(data[1].totalconnection);
        var min = Number(data[data.length - 1].totalconnection);
        var min = 0;
        var spread = max - min;

        for (var i = 1; i < items; i++) {


            var position = i;
            if (position % 2 == 1) {
                position = (position + 1) / 2;
            } else {
                position = items - (position / 2);
            }

            let distance = -250;
            var x = distance * Math.sin(2 * Math.PI * position / items);
            var y = distance * Math.cos(2 * Math.PI * position / items);

            //var theRating = outOfFive(data[i].memberrating);
            //var theRating2 = outOfFive(data[i].interrating);
            //var textNoteNode = data[i].membername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' ' + theRating + '/5 (' + data[i].memberreason + ')';
            //var textNoteEdge = data[i].intername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' ' + theRating2 + '/5 (' + data[i].interreason + ')';

            //let size=(Number(data[i].totalconnection)-min)/spread;

            let valreceived = (Number(data[i].weightedpointsfromreposts) * 5 + Number(data[i].likevaluereceivedonposts));
            let valgiven = (Number(data[i].weightedpointstoreposts) * 5 + Number(data[i].likevaluegiventoposts));

            /*
            let ratio;            
            let baseRatio=valgiven/valreceived;
            if(valgiven>valreceived){
                baseRatio=valgiven/valreceived;
            }else{
                baseRatio=valreceived/valgiven;
            }*/
            //ratio=Math.min(baseRatio,12);

            //let totalsupportgiven= (data[i].likevaluegiventoposts + data[i].likevaluegiventoreplies/5 + data[i].weightedpointstoreposts*5);
            //let totalsupportreceived= (data[i].likevaluereceivedonposts + data[i].likevaluereceivedonreplies/5 + data[i].weightedpointsfromreposts*5);

            let textNote1 = `Support Received:${(valreceived / 1000000).toFixed(0)}`;
            let textNote2 = `Support Given:${(valgiven / 1000000).toFixed(0)}`;
            //var eles = cy.add([{ group: 'nodes', data: { id: data[0].address+"-"+i, label: data[0].name, textnote: data[0].name }, classes: 'bottom-center ', position: { x: 0, y: i*100 } },]);
            //cy.add(eles);
            //cy.style().selector('#' + data[0].address+"-"+i).css({ 'background-image': getPicURL(data[0].picurl,profilepicbase,data[0].address) });


            var eles = cy.add([
                { group: 'nodes', data: { label: data[i].name, id: data[i].address, textnote: data[i].name }, classes: 'bottom-center', position: { x: x, y: y } },
                //{ group: 'nodes', data: { label: data[i].name, id: data[i].address+"-2", textnote: data[i].name }, classes: 'bottom-center', position: { x: 200, y: i*100 } },

                /*{ group: 'edges', data: { id: data[i].member+data[i].inter, source: data[i].member, target: data[i].inter }, classes: edgecolorsize1 },*/
                { group: 'edges', data: { id: data[i].address + "edge", source: data[i].address, target: data[0].address, textnote: textNote1 } },
                { group: 'edges', data: { id: data[i].address + "edge2", source: data[0].address, target: data[i].address, textnote: textNote2 } },
            ]);
            cy.add(eles);

            cy.style().selector('#' + data[i].address).css({ 'background-image': getPicURL(data[i].picurl, profilepicbase, data[i].address) });
            cy.style().selector('#' + data[i].address).css({ 'background-image': getPicURL(data[i].picurl, profilepicbase, data[i].address) });


            //let width=Math.min((8+size*12),24);
            //let styles={'width': (8+size*12), 'target-arrow-shape': 'none'};
            //if (ratio>=2){
            //    styles={'width': (8+size*12), 'target-arrow-shape': 'triangle'};
            //}
            //if(valgiven>valreceived){
            let sizeReceived = valgiven / data[1].totalconnection;
            let sizeGiven = valreceived / data[1].totalconnection;

            cy.style().selector('#' + data[i].address + "edge2").css({ 'width': Math.min((4 + sizeReceived * 24), 20) });
            cy.style().selector('#' + data[i].address + "edge").css({ 'width': Math.min((4 + sizeGiven * 24), 20) });
            //}else{
            //    cy.style().selector('#'+data[i].address+"edge").css(styles);
            //    cy.style().selector('#'+data[i].address+"edge2").css({'width': 0});    
            //}

            //let theRatingAbs=Math.abs(theRating2-3);
            //let linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            //if(theRating2<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            //let lineWidth=((Number(data[i].likevaluereceivedonposts)+Number(data[i].likevaluereceivedonreplies)/5)*10-min)/spread;
            //let lineWidth2=((Number(data[i].likevaluegivenonposts)+Number(data[i].likevaluegivenonreplies)/5)*10-min)/spread;



            //cy.style().selector('#'+data[i].address+"edge").css({'width': (4+lineWidth), 'line-color':linecolor, 'target-arrow-color': linecolor});
            //cy.style().selector('#'+data[i].address+"edge").css({'width': (4+Math.abs(ratio)*5)});
            //cy.style().selector('#'+data[i].address+"edge2").css({'width': (4+lineWidth2)});

            //theRatingAbs=Math.abs(theRating-3);
            //linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            //if(theRating<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            //cy.style().selector('#'+data[i].inter).css({'border-width': (4+theRatingAbs*4), 'border-color':linecolor});

        }

        cy.userZoomingEnabled(false);
        cy.center();
        cy.fit();

        cy.on('tap', 'node', function () {
            window.location.href = "#support?qaddress=" + this.data('id').split('-')[0];
        });

        cy.on('mouseover', 'node', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        cy.on('mouseover', 'edge', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        addDynamicHTMLElements();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });

}




"use strict";

var pubkey = ""; //Public Key (Legacy)
var mnemonic = ""; //Mnemonic BIP39
var privkey = ""; //Private Key
var privkeyhex = "";
var privateKeyBuf;
var chainheight = 0;
var chainheighttime = 0;

//var qpubkey = ""; //Public Key (q style address)
var pubkeyhex = ""; //Public Key, full hex
var bitcloutaddress = ""; //Bitclout address

let tq = null;
//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var cytoscape = null;
var bip39 = null;
//var twitterEmbeds=new Array();
var profilepic = "";
var Buffer = buffer.Buffer;



var localStorageSafe = null;
try { var localStorageSafe = localStorage; } catch (err) { }

//var ShowdownConverter = new showdown.Converter({extensions: ['youtube']});
var ShowdownConverter = new showdown.Converter();
ShowdownConverter.setFlavor('github');
ShowdownConverter.setOption('simpleLineBreaks', true);
ShowdownConverter.setOption('simplifiedAutoLink', true);
ShowdownConverter.setOption('openLinksInNewWindow', true);
ShowdownConverter.setOption('ghMentions', false);

var turndownService = new TurndownService();
TurndownService.prototype.escape = function (text) { return text; };


//ShowdownConverter.setOption('ghMentionsLink', "#member?pagingid={u}");

//Create warning if user tries to reload or exit while transactions are in progress or queued.
window.onbeforeunload = function () {
    if (tq.isTransactionInProgress())
        return getSafeTranslation('warnonexit', 'Are you sure? There are still transaction(s) in progress. They will be lost if you close the page or reload via the browser.');
};



function replaceName(match, p1, p2, p3, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return '"' + p2 + '" : ' + p3 + ',';
}

function setLanguage() {
    dictionary.live = dictionary.en;
    dictionary.fallback = dictionary.en;

    var storedLanguage = localStorageGet(localStorageSafe, "languageselector");
    if (storedLanguage && dictionary[storedLanguage]) {
        dictionary.live = dictionary[storedLanguage];
    } else {
        //guesslanguage
        var langcode = getBrowserLanguageCode();
        if (dictionary[langcode]) {
            dictionary.live = dictionary[langcode];
        }
    }
}

async function init() {

    if (window.location.protocol == "file:") {
        await loadScript("configlocal.js?"+version);
    }

    setLanguage();

    document.getElementById('previewcontent').style.display = 'none';
    document.getElementById('mainbodywrapper').innerHTML = mainbodyHTML;
    document.getElementById('header').innerHTML = headerHTML;

    document.getElementById('hamburgermenu').innerHTML = hamburgerMenuHTML;
    document.getElementById('pagetitle').innerHTML = pageTitleHTML;
    document.getElementById('majornavbuttons').innerHTML = majorNavButtonsHTML;
    document.getElementById('usersearch').innerHTML = userSearchHTML;


    document.getElementById('footer').innerHTML = footerHTML;
    document.getElementById('version').innerHTML = version;
    //setLang((navigator.language || navigator.userLanguage));
    //check local app storage for key

    if (document.location.host != 'member.cash') {
        siteTitle = "Member";
        document.title = siteTitle;
    }

    //Show message if dev version in use
    if (document.location.href.indexOf('freetrade.github.io/memberdev') != -1) {
        document.getElementById('developmentversion').style.display = 'block';
        profilepicbase = 'https://member.cash/img/profilepics/';
    }
    var loginmnemonic = localStorageGet(localStorageSafe, "mnemonic");
    var loginprivkey = localStorageGet(localStorageSafe, "privkey");
    var loginpubkey = localStorageGet(localStorageSafe, "pubkey");

    //getBitCloutLoginFromLocalStorage();

    document.getElementById('loginbox').innerHTML = loginboxHTML;

    if (loginmnemonic != "null" && loginmnemonic != null && loginmnemonic != "") {
        trylogin(loginmnemonic);
        return;
    } if (loginprivkey != "null" && loginprivkey != null && loginprivkey != "") {
        trylogin(loginprivkey);
        return;
    } else if (loginpubkey != "null" && loginpubkey != null && loginpubkey != "") {
        trylogin(loginpubkey);
        return;
    }


    
    displayContentBasedOnURLParameters();
    loadBigLibs();
}

//This method doesn't appear to be in use, also doesn't seem to work
/*
function getAndSetVersion() {
    fetch('/version')
        .then(function (response) {
            return response.text()
        }).then(function (version) {
            console.log("member" + version);
            let ver_split = version.lastIndexOf('.');
            document.getElementById('version').innerHTML = version.substring(0, ver_split) + ".<u>" + version.substring(ver_split + 1) + "</u>";
        });
}*/

function trylogin(loginkey, nextpage) {
    try {
        login(loginkey);
        displayNotificationCount();
    } catch (error) {
        document.getElementById('loginerror').innerHTML = error.message;
        console.log(error);
        updateStatus(error.message);
        loadBigLibs();
        return;
    }

    //Show message if in read only mode
    if (!privkey) {
        document.getElementById('readonlyversion').style.display = 'block';
    }

    //getAndPopulateTopicList(false);
    displayContentBasedOnURLParameters(nextpage);
    //make sure these get loaded
    setTimeout(loadBigLibs, 5000);

}

var loadBigLibsStarted = false;
async function loadBigLibs() {
    if (loadBigLibsStarted) return;
    loadBigLibsStarted = true;
    //Load big libraries that may not be immediately needed.

    if (!bip39) { loadScript("js/lib/bip39.browser.js"); }
    if (!window.bitcoinjs) { loadScript("js/lib/bitcoincashjs-lib-5.2.0.min.patched.js"); }
    if (!eccryptoJs) loadScript("js/lib/eccrypto-js.js");
    if (!window.elliptic) { loadScript("js/lib/elliptic.min.js"); }
    if (!SimpleMDE) loadScript("js/lib/mde/simplemde.1.11.2.min.js");
    if (!cytoscape) loadScript("js/lib/cytoscape3.19.patched.min.js");
    if (!bcdecrypt) loadScript("js/lib/identityencryption.js");
    if (!L) loadScript("js/lib/leaflet/leaflet.js");
}


async function login(loginkey) {

    mnemonic = localStorageGet(localStorageSafe, "mnemonic");
    privkey = localStorageGet(localStorageSafe, "privkey");
    pubkey = localStorageGet(localStorageSafe, "pubkey");
    //qpubkey = localStorageGet(localStorageSafe, "qpubkey");
    pubkeyhex = localStorageGet(localStorageSafe, "pubkeyhex");
    privkeyhex = localStorageGet(localStorageSafe, "privkeyhex");
    bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");


    if (!(pubkey) || (privkey && !privkeyhex)) {
        //slow login.
        //note, mnemonic not available to all users for fast login
        //note, user may be logged in in public key mode
        //note, pubkeyhex won't be available in public key mode

        loginkey = loginkey.trim();
        //check valid private or public key
        var publicaddress = "";

        if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
        if (!window.bitcoinjs) { await loadScript("js/lib/bitcoincashjs-lib-5.2.0.min.patched.js"); }

        if (bip39.validateMnemonic(loginkey)) {
            let seed = bip39.mnemonicToSeedSync(loginkey);
            let root = window.bitcoinjs.bip32.fromSeed(seed);
            let child1 = root.derivePath("44'/0'/0'/0/0");
            let newloginkey = child1.toWIF();
            localStorageSet(localStorageSafe, "mnemonic", loginkey);
            mnemonic = loginkey;
            loginkey = newloginkey;
        }

        try {
            if (loginkey.startsWith("q")) {
                loginkey = "member:" + loginkey;
            }
            if (loginkey.startsWith("member:") || loginkey.startsWith("bitcoincash:")) {
                publicaddress = membercoinToLegacy(loginkey);
            } else if (loginkey.startsWith("L") || loginkey.startsWith("K")) {
                let ecpair = window.bitcoinjs.ECPair.fromWIF(loginkey);
                publicaddress = window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
                privkey = loginkey;
                document.getElementById('loginkey').value = "";
            } else if (loginkey.startsWith("BC1")) {
                var preslice = window.bs58check.decode(loginkey);
                var bcpublicKey = preslice.slice(3);
                checkIfBitcloutUser(new Buffer(bcpublicKey).toString('hex'));
                var ecpair = new window.bitcoinjs.ECPair.fromPublicKey(Buffer.from(bcpublicKey));
                publicaddress = window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
            } else if (loginkey.startsWith("1") || loginkey.startsWith("3")) {
                window.bitcoinjs.address.toOutputScript(loginkey);//this will throw error if address is not valid
                publicaddress = loginkey;
            } else {
                throw Error('No login key recognized');
            }
        } catch (err) {
            if (loginkey.length < 20) {
                var theURL = dropdowns.contentserver + '?action=usersearch&searchterm=' + encodeURIComponent(loginkey);
                getJSON(theURL).then(function (data) {
                    if (data && data.length > 0) {
                        var qaddress = data[0].bitcoinaddress;
                        trylogin(qaddress);
                        return;
                    } else {
                        alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
                        return;
                    }
                }, function (status) { //error detection....
                    alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
                });
            } else {
                alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
            }

            return;
        }

        pubkey = publicaddress.toString();
        localStorageSet(localStorageSafe, "pubkey", pubkey);

        if (privkey) {
            let ecpair = new window.bitcoinjs.ECPair.fromWIF(privkey);
            pubkeyhex = ecpair.publicKey.toString('hex');
            privkeyhex = ecpair.privateKey.toString('hex');

            localStorageSet(localStorageSafe, "privkey", privkey);
            localStorageSet(localStorageSafe, "pubkeyhex", pubkeyhex);
            localStorageSet(localStorageSafe, "privkeyhex", privkeyhex);
            //dropdowns.utxoserver
            checkIfBitcloutUser(pubkeyhex);
            //bitCloutUser=pubkeyToBCaddress(pubkeyhex);
        }



    }

    if (privkey) {
        privateKeyBuf = Buffer.from(privkeyhex, 'hex');
    }


    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));

    document.getElementById('loggedin').style.display = "flex";
    document.getElementById('profilebutton').style.display = "flex";
    document.getElementById('walletbutton').style.display = "flex";
    document.getElementById('logoutbutton').style.display = "flex";

    document.getElementById('loggedout').style.display = "none";
    document.getElementById('newseedphrasedescription').style.display = "none";
    document.getElementById('newseedphrase').textContent = "";
    document.getElementById('loginkey').value = "";

    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, {version:version}, true);
    document.getElementById('lowfundswarning').innerHTML = templateReplace(lowfundswarningHTML, { version:version, bcaddress: pubkey, cashaddress: legacyToMembercoin(pubkey) }, true);

    updateSettings();
    getAndPopulateSettings();

    //Register public key hex with utxo server so that utxos can be cached    
    //getJSON(dropdowns.utxoserver + 'reg/' + pubkeyhex + '?a=100').then(function (data) { }, function (status) { });

    //Register public key with content server to prepare feeds faster    
    getJSON(dropdowns.txbroadcastserver + 'regk/' + pubkey + '?a=100').then(function (data) { }, function (status) { });

    loadStyle();

    //Transaction queue requires bitcoinjs library to be loaded which may slow things down for a fast login on page reload
    if (!window.bitcoinjs) { await loadScript("js/lib/bitcoincashjs-lib-5.2.0.min.patched.js"); }
    tq = new TransactionQueue(pubkey, privkey, dropdowns.mcutxoserver + "address/utxo/", updateStatus, getSafeTranslation, updateChainHeight, null, window.bitcoinjs, dropdowns.txbroadcastserver + "rawtransactions/sendRawTransactionPost");
    tq.refreshPool();

    if (!privkey) {
        //tq.utxopools[pubkey].showwarning = false;
        //document.getElementById('lowfundswarning').style.display = 'none';
        updateStatus(getSafeTranslation('publickeymode', "You are logging in with a public key. This is a read-only mode. You won't be able to make posts or likes etc."));
    }

    document.getElementById('messagesanchor').innerHTML = messagesanchorHTML;
    document.getElementById('newpost').innerHTML = newpostHTML;
    document.getElementById('newpost').innerHTML = templateReplace(newpostHTML, { fileuploadurl: dropdowns.imageuploadserver + "uploadfile" }, true);



    populateTools();

    return;

}

function loadStyle() {
    //Set the saved style if available
    let style = localStorageGet(localStorageSafe, "style2");
    if (style) {
        changeStyle(style, true);
    } else {
        changeStyle(theStyle, true);
    }
}

async function createNewAccount() {
    if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
    mnemonic = bip39.generateMnemonic();
    document.getElementById('newseedphrasedescription').style.display = "inline";
    document.getElementById('newseedphrase').textContent = mnemonic;
    document.getElementById('loginkey').value = mnemonic;


}

function logout() {

    if (privkey) {//only warn if there is a privkey
        var exitreally = confirm(getSafeTranslation('areyousure', `Are you sure you want to logout? 
    Make sure you have written down your 12 word seed phrase or private key to login again. 
    There is no other way to recover your seed phrase. It is on the wallet page.
    Click Cancel if you need to do that now.
    Click OK to logout.`));
        if (!exitreally) {
            return;
        }
    }

    if (localStorageSafe != null) {
        localStorageSafe.clear();
    }

    bitcloutlogout();

    privkey = "";
    pubkey = "";
    mnemonic = "";
    document.getElementById('loggedout').style.display = "flex";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('profilebutton').style.display = "none";
    document.getElementById('walletbutton').style.display = "none";
    document.getElementById('logoutbutton').style.display = "none";


    try {
        serviceWorkerLogout();
    } catch (err) {
        console.log(err);
    }

    location.href = "#login";
    //This clears any personal info that might be left in the html document.
    location.reload();

}

function changeStyle(newStyle, setStorage) {
    theStyle = newStyle;
    if (setStorage) {
        localStorageSet(localStorageSafe, "style2", newStyle);
    }
    var cssArray = newStyle.split(" ");
    if (cssArray[0]) { document.getElementById("pagestyle").setAttribute("href", "css/" + cssArray[0] + ".css?" + version); }
    else { document.getElementById("pagestyle").setAttribute("href", "css/feels.css?" + version); }
    if (cssArray[1]) { document.getElementById("pagestyle2").setAttribute("href", "css/" + cssArray[1] + ".css?" + version); }
    else { document.getElementById("pagestyle2").setAttribute("href", "css/none.css?" + version); }
    if (cssArray[2]) { document.getElementById("pagestyle3").setAttribute("href", "css/" + cssArray[2] + ".css?" + version); }
    else { document.getElementById("pagestyle3").setAttribute("href", "css/none.css?" + version); }
}

function setBodyStyle(newStyle) {
    if (newStyle) {
        document.getElementById("mainbody").setAttribute("class", newStyle);
    }
}


function refreshPool() {
    tq.refreshPool();
}"use strict";

var lastViewOfNotifications = 0;
var lastViewOfNotificationspm = 0;

function displayNotificationCount() {
    if (!pubkey) {
        return;
    }
    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));
    var theURL = dropdowns.contentserver + '?action=alertcount&address=' + pubkey + '&since=' + lastViewOfNotifications + '&sincepm=' + lastViewOfNotificationspm;
    getJSON(theURL).then(function (data) {
        try {
            if (data[0].count == null) {
                return;
            }

            setAlertCount("alertcount", Number(data[0].count));
            setAlertCount("alertcountpm", Number(data[0].countpm));

            var pageTitleCount = Number(data[0].count) + Number(data[0].countpm);
            var pageTitle = "";
            //if (pageTitleCount > 0) {
            //    pageTitle = "(" + pageTitleCount + ") ";
            //}
            //document.title = pageTitle + siteTitle;
        } catch (err) {
            console.log(err);
        }
        setTimeout(displayNotificationCount, 60000);
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
        setTimeout(displayNotificationCount, 60000);
    });
}

function setAlertCount(elementid, alertNumber) {
    var alertcount = Number(alertNumber);
    var element = document.getElementById(elementid);
    if (alertcount > 0) {
        element.innerHTML = alertcount;
        element.style.visibility = "visible";
    } else {
        element.innerHTML = "";
        element.style.visibility = "hidden";
    }

}

function populateNotificationTab(limit, nfilter, minrating) {
    let options = '&limit=' + limit + '&minrating=' + minrating;
    document.getElementById("notificationtypes").innerHTML =
        `<a data-vavilon="notificationall" data-vavilon_title="notificationall" title="See all notifications" class="` + (nfilter == '' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=` + options + `">All</a>
    <span class="separator"></span>
    <a data-vavilon="notificationlikes" data-vavilon_title="notificationlikes" title="See only likes" class="`+ (nfilter == 'like' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=like` + options + `">Likes</a>
    <span class="separator"></span>
    <a data-vavilon="notificationfollows" data-vavilon_title="notificationfollows" title="See only follows" class="`+ (nfilter == 'follow' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=follow` + options + `">Follows</a>
    <span class="separator"></span>
    <a data-vavilon="notificationunfollows" data-vavilon_title="notificationunfollows" title="See only unfollows" class="`+ (nfilter == 'unfollow' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=unfollow` + options + `">Unfollows</a>
    <span class="separator"></span>
    <a data-vavilon="notificationreplies" data-vavilon_title="notificationreplies" title="See only replies" class="`+ (nfilter == 'reply' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=reply` + options + `">Replies</a>
    <span class="separator"></span>
    <a data-vavilon="notificationratings" data-vavilon_title="notificationratings" title="See only ratings" class="`+ (nfilter == 'rating' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=rating` + options + `">Ratings</a>
    <span class="separator"></span>
    <a data-vavilon="notificationmentions" data-vavilon_title="notificationmentions" title="See only mentions" class="`+ (nfilter == 'page' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=page` + options + `">Mentions</a>
    <span class="separator"></span>
    <a data-vavilon="notificationremembers" data-vavilon_title="notificationremembers" title="See only remembers" class="`+ (nfilter == 'repost' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=repost` + options + `">Remembers</a>
    <span class="separator"></span>
    <a data-vavilon="notificationpurchase" data-vavilon_title="notificationpurchase" title="See only creator coin purchases" class="`+ (nfilter == 'purchase' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=purchase` + options + `">Buys</a>
    <span class="separator"></span>
    <a data-vavilon="notificationsale" data-vavilon_title="notificationsale" title="See only creator coin sales" class="`+ (nfilter == 'sale' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=sale` + options + `">Sells</a>
    <span class="separator"></span>
    <nav class="filterssecondset">
        <span class="starratingnotifications">
            <span data-ratingsize="16" id="notificationsfilter" class="star-rating-notifications"></span>
        </span>
    </nav>
    `;

    //<a data-vavilon="notificationtips" data-vavilon_title="notificationremembers" title="See only tips" class="`+ (nfilter == 'tip' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=tip` + options + `">Tips</a>
    //<span class="separator"></span>


    //Activate navigation filter star ratings
    notificationFilter.element = document.getElementById('notificationsfilter');


    notificationFilter.element = raterJs({
        starSize: Number(notificationFilter.element.dataset.ratingsize),
        rating: notificationFilter.minrating,
        element: notificationFilter.element,
        showToolTip: false,
        rateCallback: function rateCallback(rating, done) {
            notificationFilter.element.setRating(rating);
            done();
            notificationFilter.minrating = rating;
            getAndPopulateNotifications(0, notificationFilter.limit, "notifications", pubkey, null, notificationFilter.type, notificationFilter.minrating);
        }
    });

    if (notificationFilter.element) {
        notificationFilter.element.setRating(minrating);
    }

}

function getAndPopulateNotifications(start, limit, page, qaddress, txid, nfilter, minrating) {
    //Clear existing content
    show(page);


    document.getElementById("notificationsbody").innerHTML = document.getElementById("loading").innerHTML;

    populateNotificationTab(limit, nfilter, minrating);


    //Show navigation next/back buttons


    //Request content from the server and display it when received
    var minRatingTransposed = transposeStarRating(minrating);
    notificationFilter.type = nfilter;
    notificationFilter.minrating = minrating;


    var theURL = dropdowns.contentserver + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit + '&nfilter=' + nfilter + '&minrating=' + minRatingTransposed;
    getJSON(theURL).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var navbuttons = getNotificationNavButtonsNewHTML(start, limit, page, qaddress, minrating, nfilter, data.length);
        //var navbuttons = getNotificationNavButtonsNewHTML(start, limit, page, qaddress, minrating, nfilter, data.length > 0 ? data[0].unduplicatedlength : 0);
        //var navbuttons = getNavButtonsHTML(start, limit, page, 'new', qaddress, "", "getAndPopulateNotifications", data.length > 0 ? data[0].unduplicatedlength : 0);

        var contents = ``;


        for (var i = 0; i < data.length; i++) {
            try {
                contents = contents + getHTMLForNotification(data[i], i + 1 + start, page, i, (data[i].txid == txid));
            } catch (err) {
                console.log(err);
            }
        }
        //console.log(contents);
        if (contents == "") {
            contents = getDivClassHTML("message", getSafeTranslation("nonotifications", "No notifications yet"));
        }


        try {
            if (window.Notification.permission != 'granted') {
                contents = allowNotificationButtonHTML() + contents;
            } else {
                requestNotificationPermission();
            }
        } catch (err) {
            //possibly catching an exception generated by ios here
            contents = allowNotificationButtonHTML() + contents;
            updateStatus(err);
        }



        contents = getNotificationsTableHTML(contents, navbuttons);

        //Update last view of notifications iff the user is looking at the first page of notifications.
        if (start == 0) {
            lastViewOfNotifications = parseInt(new Date().getTime() / 1000);
            localStorageSet(localStorageSafe, "lastViewOfNotifications", lastViewOfNotifications);
            setAlertCount("alertcount", 0);
            //document.title = siteTitle;
        }


        document.getElementById("notificationsbody").innerHTML = contents; //display the result in an HTML element
        addDynamicHTMLElements(data);
        if (txid) {
            scrollToPosition('notification' + san(txid));
        } else {
            scrollToPosition();
        }





        listenForTwitFrameResizes();
        //window.scrollTo(0, scrollhistory[window.location.hash]);


        //Put this at the end - it may be failing silently on iOS, so does least damage here
        /*if (window.Notification.permission == 'granted') {
            try {
                //notification subscriptions seem to get cancelled a lot - keep requesting subscription if granted to ensure continuity
                requestNotificationPermission();
            } catch (err) {
                //possibly catching an exception generated by ios here
                console.log(err);
            }
        }*/

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

var notificationFilterRating;
var notificationFilter = [];
notificationFilter.type = "";
notificationFilter.minrating = 0;
notificationFilter.start = 0;
notificationFilter.limit = 25;





function getHTMLForNotification(data, rank, page, starindex, highlighted) {
    if (checkForMutedWords(data)) return "";
    let type = ds(data.type);
    let mainRatingID = starindex + page + ds(data.origin);
    let postRatingID = "";

    //For root posts, we show number of replies as total
    //For comments, just the number of direct replies
    if (data.ltxid == data.lroottxid) {
        data.lreplies = data.lrepliesroot;
    }
    if (data.rtxid == data.rroottxid) {
        data.rreplies = data.rrepliesroot;
    }

    let referencedPostHTML = "";

    postRatingID = starindex + page + ds(data.raddress) + type;
    if (type != "rating") { //this is inelegant, quick fix

        if (type == "like" || type == "repost") {
            postRatingID = starindex + page + ds(data.address) + type;
            //data.useraddress=data.laddress;
            let member = MemberFromData(data, 'user', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(member, data, 'l', page, starindex, '', true);
            //referencedPostHTML = getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid, data.userpagingid, data.userpublickey, data.userpicurl, data.usertokens, data.userfollowers, data.userfollowing, data.userblockers, data.userblocking, data.userprofile, data.userisfollowing, data.usernametime, '', data.originlastactive, true, data.originsysrating, data.lsourcenetwork, data.lhivename, data.lhivelink, data.userbitcoinaddress);
        } else if (type == "page") {
            //data.originaddress=data.raddress;
            let member = MemberFromData(data, 'origin', postRatingID);
            //referencedPostHTML = getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, '', data.originlastactive, true, data.originsysrating, data.rsourcenetwork, data.rhivename, data.rhivelink, data.originbitcoinaddress);
            referencedPostHTML = getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true);
        } else  if (type == "thread")  {

            let opmember = MemberFromData(data, 'op', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(opmember, data, 'op', page, starindex, '', true);

            let member = MemberFromData(data, 'origin', postRatingID);
            referencedPostHTML += `<div class="replyinmainfeed">` + getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true) + `</div>`;            

        } else {

            //data.useraddress=data.opaddress;
            let opmember = MemberFromData(data, 'user', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(opmember, data, 'op', page, starindex, '', true);

            //data.originaddress=data.raddress;
            let member = MemberFromData(data, 'origin', postRatingID);
            //referencedPostHTML = getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, '', data.originlastactive, true, data.originsysrating, data.rsourcenetwork, data.rhivename, data.rhivelink, data.originbitcoinaddress);
            referencedPostHTML += `<div class="replyinmainfeed">` + getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true) + `</div>`;            

        }
    }

    switch (type) {
        case "message":
            /*return notificationItemHTML(
                "message",
                `img/icons/notification/message.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','messagedyou','messaged you'),
                timeSince(Number(data.time),true),
                "",
                data.txid, highlighted
            );*/
            break;
        case "thread":

            return notificationItemHTML(
                "thread",
                `img/icons/notification/discussion.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext', 'discussion', `in a discussion you're in'`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;
        case "topic":
            return notificationItemHTML(
                "topic",
                `img/icons/notification/post.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "posted") + getSpanHTML('plaintext', 'inatopic', `in a tag you're subscribed to`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;
        case "page":
            return notificationItemHTML(
                "page",
                `img/icons/notification/mentioned.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'mentionedyou', 'mentioned you in a') + postlinkHTML(data.txid, `post`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;
        case "reply":
            return notificationItemHTML(
                "reply",
                `img/icons/notification/reply.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext', 'toyour', 'to your') + postlinkHTML(data.rretxid, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;
        case "rating":
            var theRating = 0;
            if (data.rating) {
                theRating = outOfFive(data.rating);
            }
            return notificationItemHTML(
                "rating",
                `img/icons/notification/star.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'ratedyou', 'rated you as') + theRating + getSpanHTML('plaintext', 'starscommenting', 'stars, commenting ...') + getSpanClassHTML("plaintext", escapeHTML(data.reason)),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted
            );
            break;
        case "follow":
            return notificationItemHTML(
                "follow",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'followedyou', 'followed you'),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted
            );
            break;
        case "unfollow":
            return notificationItemHTML(
                "unfollow",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'unfollowedyou', 'unfollowed you'),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted
            );
            break;
        case "purchase":
            return notificationItemHTML(
                "purchase",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'purchasecoin', `purchased your creator coin. ~${usdString(data.ccamount)} `),
                timeSince(Number(data.time), true),
                ``,
                data.txid, highlighted
            );
            break;

        case "sale":
            Number(data.ccamount);
            return notificationItemHTML(
                "sale",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'soldcoin', `sold your creator coin. ~${usdString(data.ccamount * 1.33)} `),
                timeSince(Number(data.time), true),
                ``,
                data.txid, highlighted
            );
            break;

        case "like":
            //if (data.llikedtxid == null) {
                //Server returns empty likes sometimes, probably if a like is superceeded by another like
            //    return "";
            //}
            var postHTML = "";
            var messageType = postlinkHTML(data.likeretxid, "remember");
            if (data.lmessage) {
                messageType = postlinkHTML(data.likeretxid, "post");
                //This is a like of a post
                postHTML = referencedPostHTML;
            }
            return notificationItemHTML(
                "like",
                `img/icons/notification/liked.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'likedyour', 'liked your') + messageType + getSpanClassHTML("plaintext", (Number(data.amount) > 0 ? usdString(Number(data.amount), false) : "")),
                timeSince(Number(data.time), true),
                postHTML,
                data.txid, highlighted
            );
            break;
        case "repost":
            return notificationItemHTML(
                "repost",
                `img/icons/notification/repost.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'rememberedyour', 'remembered your') + postlinkHTML(data.likeretxid, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;
        case "quoterepost":
            return notificationItemHTML(
                "repost",
                `img/icons/notification/repost.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'quoterememberedyour', 'quote remembered your') + postlinkHTML(data.likeretxid, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted
            );
            break;


        // Maybe shelve these 'negative' ones
        case "mute":
            //return `Mute: User x muted you time`;
            break;
        case "unmute":
            //return `Unmute: User x unmuted you time`;
            break;
        case "dislike":
            //return `Dislike: User x disliked your post | post`;
            break;
        //reply, rating, follow, unfollow, mute, unmute, like, dislike
        default:
            return '';
            break;
    }
    return '';
}
//All functions that generate HTML should be quarantined here. 

//All HTML to be escaped should go through functions in this file
//variables ending in HTML should already be HTML escaped
//functions ending in HTML should return safely escaped HTML strings


//Functions
//san is used to strip all but alphanumeric and . _ -
//ds is used to escape as HTML
//Number is used to ensure an input is a number
//encodeURIComponent for part of uri
//unicodeEscape to escape text going into function
//quoteattr to escape text for an XML attribute

"use strict";

function userFromDataBasic(data, mainRatingID) {
    if (!data.raterrating) { data.raterrating = data.rating; }//Fix for collapsed comments not having rating. TODO - look into rating/raterrating
    return new Member(data.address, data.name, mainRatingID, data.raterrating, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime, (data.lastactive ? data.lastactive : data.pictime), data.sysrating, data.hivename, data.bitcoinaddress).userHTML(true);
}

function userFromData(data, mainRatingID) {
    return MemberFromData(data, 'origin', mainRatingID).userHTML(true);
    //data.origin should be data.originaddress
    //data.raterrating should be data.originrating
    /*return (new Member(
        data.origin, 
        data.originname, 
        mainRatingID, 
        data.raterrating, 
        data.originpagingid, 
        data.originpublickey, 
        data.originpicurl, 
        data.origintokens, 
        data.originfollowers, 
        data.originfollowing, 
        data.originblockers, 
        data.originblocking, 
        data.originprofile, 
        data.originisfollowing, 
        data.originnametime, 
        data.originlastactive, 
        data.originsysrating, 
        data.originhivename, 
        data.originbitcoinaddress)).userHTML(true);*/
}
//Members
function MemberFromData(data, stub, ratingID) {
    return new Member(
        data[stub + "address"],
        data[stub + "name"],
        ratingID,
        data[stub + "rating"],
        data[stub + "pagingid"],
        data[stub + "publickey"],
        data[stub + "picurl"],
        data[stub + "tokens"],
        data[stub + "followers"],
        data[stub + "following"],
        data[stub + "blockers"],
        data[stub + "blocking"],
        data[stub + "profile"],
        data[stub + "isfollowing"],
        data[stub + "nametime"],
        data[stub + "lastactive"],
        data[stub + "sysrating"],
        data[stub + "hivename"],
        data[stub + "bitcoinaddress"]

    );
}

function Member(address, name, ratingID, ratingRawScore, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress) {

    if (!address) {
        updateStatus('Missing address for post error - this should not happen.'); return "";
    }

    if (!bitcoinaddress) {
        updateStatus('Missing legacy address for post error - this can happen if server does not have public key for user.');
    }

    address = "" + address;//always treat address like a string.
    if (this.name == "" || this.name == null) {
        this.name = address.substring(0, 10);
    }

    /*if (!name) {
        if (sourcenetwork == 2) {//get the hive name
            name = hivelink.split('/')[0];
        } else {
            name = address.substring(0, 10);
        }
    }*/
    this.address = address;
    this.name = name;
    this.ratingID = ratingID;
    this.ratingRawScore = ratingRawScore;
    this.pagingid = pagingid;
    this.publickey = publickey;
    this.picurl = picurl;
    this.tokens = tokens;
    this.followers = followers;
    this.following = following;
    this.blockers = blockers;
    this.blocking = blocking;
    this.profile = profile;
    this.isfollowing = isfollowing;
    this.nametime = nametime;
    this.lastactive = lastactive;
    this.sysrating = sysrating;
    this.hivename = hivename;
    this.bitcoinaddress = bitcoinaddress;
}

Member.prototype.userHTML = function (includeProfile) {
    if (!this.address) {
        return "error:no address for user";
    }

    let userclass = "hnuser";
    let profilemeta = "profile-meta";
    let curTime = new Date().getTime() / 1000;

    if (!this.nametime || curTime - this.nametime < 60 * 60 * 24 * 7 * 2) {
        //if the user has changed name in the past two weeks
        userclass = "hnuser newuser";
        profilemeta = "profile-meta newuser";
    }

    let memberpic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(this.address) + `"></svg>`;
    if (this.picurl) {
        var picurlfull = getPicURL(this.picurl, profilepicbase, this.address, this.hivename);
        memberpic = `<img class="memberpicturesmall" src='` + picurlfull + `'/>`;
    }

    //let linkStart = `<a href="#member?qaddress=` + san(this.address) + `" onclick="nlc();" class="` + userclass + `">`;
    //let linkEnd = `</a> `;
    let flair = " ";
    if (this.tokens > 0) {
        flair = ` <span data-vavilon_title="TopIndex" class="flair" title="TopIndex">` + ordinal_suffix_of(Number(this.tokens)) + ` </span> `;
    }
    let followButton = `<a data-vavilon="follow" class="follow" href="javascript:;" onclick="follow('` + sane(this.bitcoinaddress) + `','` + sane(this.publickey) + `'); this.style.display='none';">follow</a>`;
    if (this.isfollowing) {
        followButton = `<a data-vavilon="unfollow" class="unfollow" href="javascript:;" onclick="unfollow('` + sane(this.bitcoinaddress) + `','` + sane(this.publickey) + `'); this.style.display='none';">unfollow</a>`;
    }

    if (this.ratingID == undefined) {
        this.ratingID = 'test';
    }

    let onlineStatus = "";
    //var lastonlineseconds=curTime - lastactive;
    onlineStatus = timeSince(this.lastactive, true);
    /*if (lastactive &&  lastonlineseconds < 60 * 10) {
        //if the user took an action in the past 3 minutes
        onlineStatus="🟠";
    }
    if (lastactive && lastonlineseconds < 60 * 3) {
        //if the user took an action in the past 3 minutes
        onlineStatus="🟢";
    }*/

    let directlink = "";

    let systemScoreClass = '';
    if (!this.ratingRawScore) {
        this.ratingRawScore = this.sysrating;
        systemScoreClass = 'systemscore';
    }

    let obj = {
        //These must all be HTML safe.
        address: san(this.address),
        profilepicsmall: memberpic,
        handle: ds(this.name),
        pagingidattrib: ds(this.pagingid),
        pagingid: ds(this.pagingid),
        flair: flair,
        rating: Number(this.ratingRawScore),
        followbutton: followButton,
        following: Number(this.following),
        followers: Number(this.followers),
        profile: getSafeMessage(this.profile, 'profilecard', false),
        diff: this.ratingID,
        onlinestatus: onlineStatus,
        systemscoreclass: systemScoreClass,
        directlink: directlink,
        bitcoinaddress: sane(this.bitcoinaddress)
    }

    obj.profilecard = "";
    if (includeProfile) {
        obj.authorsidebar = "";
        obj.profilecard = templateReplace(userProfileCompactTemplate, obj);
    }
    return templateReplace(userCompactTemplate, obj);
};

//Get html for a user, given their address and name
/*function userHTML(address, name, ratingID, ratingRawScore, ratingStarSize, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, includeProfile, lastactive, sysrating, hivename, bitcoinaddress) {
    if (!address) {
        return "error:no address for user";
    }
    if (name == "" || name == null) {
        name = address.substring(0, 10);
    }

    var userclass = "hnuser";
    var profilemeta = "profile-meta";
    var curTime = new Date().getTime() / 1000;

    if (!nametime || curTime - nametime < 60 * 60 * 24 * 7 * 2) {
        //if the user has changed name in the past two weeks
        userclass = "hnuser newuser";
        profilemeta = "profile-meta newuser";
    }

    var memberpic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(address) + `"></svg>`;
    if (picurl) {
        var picurlfull = getPicURL(picurl, profilepicbase, address, hivename);
        memberpic = `<img class="memberpicturesmall" src='` + picurlfull + `'/>`;
    }

    var linkStart = `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();" class="` + userclass + `">`;
    var linkEnd = `</a> `;
    var flair = " ";
    if (tokens > 0) {
        flair = ` <span data-vavilon_title="TopIndex" class="flair" title="TopIndex">` + ordinal_suffix_of(Number(tokens)) + ` </span> `;
    }
    var followButton = `<a data-vavilon="follow" class="follow" href="javascript:;" onclick="follow('` + sane(bitcoinaddress) + `','` + sane(publickey) + `'); this.style.display='none';">follow</a>`;
    if (isfollowing) {
        followButton = `<a data-vavilon="unfollow" class="unfollow" href="javascript:;" onclick="unfollow('` + sane(bitcoinaddress) + `','` + sane(publickey) + `'); this.style.display='none';">unfollow</a>`;
    }

    if (ratingID == undefined) {
        ratingID = 'test';
    }

    var onlineStatus = "";
    //var lastonlineseconds=curTime - lastactive;
    onlineStatus = timeSince(lastactive, true);

    var directlink = "";

    var systemScoreClass = '';
    if (!ratingRawScore) {
        ratingRawScore = sysrating;
        systemScoreClass = 'systemscore';
    }

    var obj = {
        //These must all be HTML safe.
        address: san(address),
        profilepicsmall: memberpic,
        handle: ds(name),
        pagingidattrib: ds(pagingid),
        pagingid: ds(pagingid),
        flair: flair,
        rating: Number(ratingRawScore),
        followbutton: followButton,
        following: Number(following),
        followers: Number(followers),
        profile: getSafeMessage(profile, 'profilecard', false),
        diff: ratingID,
        onlinestatus: onlineStatus,
        systemscoreclass: systemScoreClass,
        directlink: directlink,
        bitcoinaddress: sane(bitcoinaddress)
    }

    obj.profilecard = "";
    if (includeProfile) {
        obj.authorsidebar = "";
        obj.profilecard = templateReplace(userProfileCompactTemplate, obj);
    }
    return templateReplace(userCompactTemplate, obj);


}*/



//Posts and Replies
function getReplyDiv(txid, page, differentiator, address, sourcenetwork, origtxid) {
    page = page + differentiator;
    var obj = {
        //These must all be HTML safe.
        page: page,
        txid: san(txid),
        address: address,
        profilepicsmall: profilepic,
        address: pubkey,
        sourcenetwork: sourcenetwork,
        origtxid: origtxid
    }

    return templateReplace(replyDivTemplate, obj);

}

function getReplyAndTipLinksHTML(page, txid, address, article, geohash, differentiator, topicHOSTILE, sourcenetwork, hivelink, origtxid, bitcoinaddress, permalink, articlelink) {

    var page = page + differentiator; //This is so if the same post appears twice on the same page, there is a way to tell it apart
    var santxid = san(txid);
    var articleLink2 = "";
    var mapLink = " ";

    if (article) {
        articleLink2 = `<a id="articlelink` + page + santxid + `" href="` + articlelink + `">article</a> `;
    }
    if (geohash != null && geohash != "") {
        mapLink = ` <a id="maplink` + page + santxid + `" href="#map?geohash=` + san(geohash) + `&post=` + santxid + `">🌍map</a> `;
    }
    var hideuserHTML = hideuserHTML = `<a data-vavilon="flaguser" id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user)</a>`;
    if (topicHOSTILE != "") {
        hideuserHTML += `<a data-vavilon="flagusertopic" id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','` + unicodeEscape(topicHOSTILE) + `','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user for topic)</a>`;
    }

    //Can remove mispelling 'remebers' when css files are updated
    var remembersActive = "remebersactive remembersactive";
    /*var remembersOnclick = ` onclick="repostPost('${santxid}','${san(origtxid)}','${san(sourcenetwork)}'); this.class='remebersinactive remembersinactive'; this.onclick='';" href="javascript:;"`;
    if (repostidtxid != null && repostidtxid != '') {
        remembersActive = "remebersinactive remembersinactive";
        remembersOnclick = ` `;
    }*/

    let sourceNetworkHTML = '';
    if (sourcenetwork == 0) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/' + san(hivelink) + '">Memo</a>';
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/' + san(hivelink) + '">BitClout</a>';
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@' + sanhl(hivelink) + '">hive.blog</a>';
    } else if (sourcenetwork == 3) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" href="' + permalink + '">member.cash</a>';
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="rsslink" href="' + quoteattr(hivelink) + '">RSS Link</a>';
    }

    var obj = {
        //These must all be HTML safe.
        page: page,
        txid: san(txid),
        diff: differentiator,
        remembersactive: remembersActive,
        articlelink2: articleLink2,
        hideuser: hideuserHTML,
        address: san(address),
        permalink: permalink,
        maplink: mapLink,
        sourceNetworkHTML: sourceNetworkHTML,
        origtxid: san(origtxid),
        bitcoinaddress: bitcoinaddress,
        MEMUSD1C: satsToUSDString(10000000),
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000)
    }

    return templateReplace(replyAndTipsTemplate, obj);

}
/*
function getScoresHTML(txid, likes, dislikes, tips, differentiator, repostcount) {
    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        likesbalance: (Number(likes) - Number(dislikes)),
        tips: Number(tips),
        balancestring: usdString(Number(tips), false),
        repostcount: Number(repostcount)
    }
    return templateReplace(scoresTemplate, obj);
}*/

function getTipsHTML(txid, tips, differentiator, display) {
    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        tips: Number(tips),
        balancestring: usdString(Number(tips), false),
        display: (display?``:` style="display:none" `)
    }
    return templateReplace(tipsTemplate, obj);
}


function getRemembersHTML(txid, differentiator, repostcount, display) {

    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        repostcount: Number(repostcount),
        display: (display?``:` style="display:none" `)
    }
    return templateReplace(remembersTemplate, obj);
}

function getLikesHTML(txid, likesbalance, differentiator, display) {
    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        likesbalance: likesbalance,
        display: (display?``:` style="display:none" `)
    }
    return templateReplace(likesTemplate, obj);
}


function replacePageNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)@([^,\/#!$%\^&\*;:{}=`~()'"@<>\ \n?]{1,217})/g, replacePageName);
    //return target.replace(/(^|\s|>)@([A-Za-z0-9\-_\.]{1,217})/g, replacePageName);
    //we won't store . - in pagenames, but where a page includes . -, the page will be recognized.
    return target.replace(/(^|\s|>)@([0-9\-_\.\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]{1,217})/g, replacePageName); 
            

}

function replacePageName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
}

function replaceTagNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)#([^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g, replaceTagName);
    return target.replace(/(^|\s|>)#([A-Za-z0-9\-_]{1,217})/g, replaceTagName);
}

function replaceTagName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#topic?topicname=` + encodeURIComponent(p2) + `" onclick="nlc();">#` + ds(p2) + `</a>`;
}

function replaceTickerNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)$([^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g, replaceTickerName);
    return target.replace(/(^|\s|>)$([A-Za-z0-9\-_\.]{1,217})/g, replaceTickerName);
}

function replaceTickerName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">$` + ds(p2) + `</a>`;
}

/*
function getSafeInteractiveHTML(message, differentiator, includeMajorMedia) {
    //Escape as HTML
    let messageHTML = ds(message);
    //Add Line breaks
    messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //Add tag links
    messageHTML = replaceTagNamesWithLinks(messageHTML);

    //Add ticker links
    messageHTML = replaceTickerNamesWithLinks(messageHTML);

    //Add paging id links
    messageHTML = replacePageNamesWithLinks(messageHTML);

    //Add links for web addresses
    messageHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });

    //Scan for XSS vulnerabilities
    messageHTML = DOMPurify.sanitize(messageHTML);

    //Add youtube etc
    if (includeMajorMedia) {
        messageHTML = addImageAndYoutubeMarkdown(messageHTML, differentiator, false);
    }

    return messageHTML;
}*/

function getSafeMessage(messageHTML, differentiator, includeMajorMedia) {

    if (!messageHTML) {
        return '';
    }
    //Add Line breaks
    messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //First replace any allowable html tags if html tags are permitted (hive)
    messageHTML = turndownService.turndown(messageHTML);

    //Now escape any remaining html
    //messageHTML = ds(messageHTML);

    //Now allow for any markdown
    messageHTML = ShowdownConverter.makeHtml(messageHTML);

    //Add tag links
    messageHTML = replaceTagNamesWithLinks(messageHTML);

    //Add ticker links
    messageHTML = replaceTickerNamesWithLinks(messageHTML);

    //Add paging id links
    messageHTML = replacePageNamesWithLinks(messageHTML);

    //Add links for web addresses
    //messageHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });

    //Scan for XSS vulnerabilities
    messageHTML = DOMPurify.sanitize(messageHTML);

    //Add youtube etc
    if (includeMajorMedia) {
        messageHTML = addImageAndYoutubeMarkdown(messageHTML, differentiator, true);
    }

    return messageHTML;

}

/*function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, ratingID, likedtxid, likeordislike, repliesroot, rating, differentiator, repostcount, repostidtxid, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, repostedHTML, lastactive, truncate, sysrating, sourcenetwork, hivename, hivelink, bitcoinaddress) {
    let theMember= new Member(address, name, ratingID, rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress);
    return getHTMLForPostHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, likedtxid, likeordislike, repliesroot, differentiator, repostcount, repostidtxid, repostedHTML, truncate, sourcenetwork, hivelink);
}*/
function getHTMLForPostHTML3(theMember, data, stub, page, differentiator, repostedHTML, truncate) {
    return getHTMLForPostHTML2(
        theMember,
        data[stub + "txid"],
        data[stub + "likes"],
        data[stub + "dislikes"],
        data[stub + "tips"],
        data[stub + "firstseen"],
        data[stub + "message"],
        data[stub + "roottxid"],
        data[stub + "topic"],
        data[stub + "replies"],
        data[stub + "geohash"],
        page,
        data[stub + "likedtxid"],
        data[stub + "likeordislike"],
        data[stub + "repliesroot"],
        differentiator,
        data[stub + "repostcount"],
        data[stub + "repostidtxid"],
        repostedHTML,
        truncate,
        data[stub + "network"],
        data[stub + "hivelink"]);
}


function getHTMLForPostHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, likedtxid, likeordislike, repliesroot, differentiator, repostcount, repostidtxid, repostedHTML, truncate, sourcenetwork, hivelink) {
    var theAuthorHTML = theMember.userHTML(true);
    var theAuthor2HTML = theMember.userHTML(false);

    let origTXID = hivelink; //This is used when replying, reposting, or other onchain actions
    if (sourcenetwork == 2 || sourcenetwork == 99) {
        origTXID = sha256.create().update(hivelink).hex();
    }

    if (!origTXID) {
        updateStatus('Missing original TXID for post error - this is required for replies, tips etc'); return "";
    }

    if (truncate && message.length > 800) { //to do, try to break on a whitespace
        message = message.substring(0, 400) + '...';
    }

    let messageLinksHTML = getSafeMessage(message, differentiator, true);

    //let messageLinksHTML = ShowdownConverter.makeHtml(message);
    repliesroot = Number(repliesroot);
    replies = Number(replies);
    var isReply = (roottxid != txid);
    if (!isReply) {
        //only if main post
        if (repliesroot > replies) {
            replies = repliesroot;
        }
    }


    var votelinks = getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID);
    var age = getAgeHTML(firstseen);
    //var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator);
    var tipsandlinks = '';
    var replydiv = getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID);

    var santxid = san(txid);
    var permalink = `p/` + santxid;
    var articlelink = `a/` + santxid;
    if (pathpermalinks) {
        permalink = pathpermalinks + `p/` + origTXID.substr(0, 10);
        articlelink = pathpermalinks + `a/` + origTXID.substr(0, 10);
    }

    var directlink = "";

    let sourceNetworkHTML;
    let sourceNetworkImage;
    if (sourcenetwork == 0) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/${san(hivelink)}">Memo</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/${san(hivelink)}"><img src='img/networks/0.png'></a>`;
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}">BitClout</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}"><img src='img/networks/1.png'></a>`;
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}">hive.blog</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}"><img src='img/networks/2.png'></a>`;
    } else if (sourcenetwork == 3) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="memberp" href="${permalink}">member.cash</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="memberp" href="${permalink}"><img src='img/networks/3.png'></a>`;
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}">RSS Link</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}"><img src='img/networks/99.png'></a>`;
    }

    let pinnedpostHTML = '';
    if (theMember.bitcoinaddress == pubkey) {
        pinnedpostHTML = `<a data-vavilon="VVpinpost" href="javascript:;" onclick="pinpost('${san(origTXID)}')">Pin Post</a>`;
    }

    var obj = {
        //These must all be HTML safe 
        author: theAuthorHTML,
        authorsidebar: theAuthor2HTML,
        message: messageLinksHTML,
        replies: Number(replies) < 0 ? 0 : Number(replies),
        likesbalance: (Number(likes) - Number(dislikes)),
        likes: Number(likes),
        dislikes: Number(dislikes),
        remembers: Number(repostcount),
        tips: usdString(Number(tips), true),
        tipsinsatoshis: Number(tips),
        txid: san(txid),
        txidshort: san(txid).substring(0, 10),
        elapsed: getAgeHTML(firstseen, false),
        elapsedcompressed: getAgeHTML(firstseen, true),
        topic: topic ? getTopicHTML(topic, getSafeTranslation('totopic', ' #')) : "",
        topicescaped: unicodeEscape(topic),
        quote: repostedHTML,
        address: theMember.address,
        votelinks: votelinks,
        age: age,
        roottxid: roottxid,
        tipsandlinks: tipsandlinks,
        replydiv: replydiv,
        diff: differentiator,
        likeactivated: likeordislike == "1" ? "-activated" : "",
        dislikeactivated: likeordislike == "-1" ? "-activated" : "",
        rememberactivated: repostidtxid ? "-activated" : "",
        permalink: permalink,
        articlelink: articlelink,
        directlink: directlink,
        sourceNetworkHTML: sourceNetworkHTML,
        sourceNetworkImage: sourceNetworkImage,
        pinnedpostHTML: pinnedpostHTML,
        origtxid: san(origTXID),
        sourcenetwork: san(sourcenetwork),
        page: page,
        bitcoinaddress: theMember.bitcoinaddress,
        MEMUSD1C: satsToUSDString(10000000),
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000)

    };

    return templateReplace(postCompactTemplate, obj);


}


function getHTMLForReplyHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, page, ishighlighted, likedtxid, likeordislike, blockstxid, differentiator, topicHOSTILE, moderatedtxid, repostcount, repostidtxid, sourcenetwork, hivelink, deleted) {
    txid = txid + ""; //ensure txid is a string. Sometimes it is returned as a number.

    let origTXID = hivelink; //This is used when replying, reposting, or other onchain actions
    if (sourcenetwork == 2) {
        try {
            origTXID = sha256.create().update(hivelink).hex();
        } catch (err) {
            origTXID = 'na';
            //this is the case when this is a hive edit or delete post
        }
    }

    /*
    if (!name) {
        if (sourcenetwork == 2 && hivelink) {//hive
            name = hivelink.split('/')[0];
        } else {
            name = address.substring(0, 10);
        }
    }*/

    message = getSafeMessage(message, differentiator, true);

    /*
    //Remove html - use dslite here to allow for markdown including some characters
    message = dslite(message);

    message = ShowdownConverter.makeHtml(message);
    
    //check for XSS vulnerabilities
    message = DOMPurify.sanitize(message);

    //Add youtube links

    message = addImageAndYoutubeMarkdown(message, differentiator, true);
*/
    //var voteButtons = getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID);
    //var author = theMember.userHTML(true);
    //new Member(address, name, ratingID, rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress).userHTML(true);
    //var age = getAgeHTML(firstseen);
    //var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator, repostcount);
    //var replyAndTips = getReplyAndTipLinksHTML(page, txid, theMember.address, false, "", differentiator, topicHOSTILE, repostidtxid, sourcenetwork, hivelink, origTXID, theMember.bitcoinaddress);
    //var replyDiv = getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID);

    let likesbalance=Number(likes) - Number(dislikes);
    let santxid = san(txid);
    let permalink = `?` + santxid.substring(0, 4) + `#thread?post=` + santxid;
    let articlelink = `?` + santxid.substring(0, 4) + `#article?post=` + santxid;
    if (pathpermalinks) {
        permalink = pathpermalinks + `p/` + origTXID.substr(0, 10);
        articlelink = pathpermalinks + `a/` + origTXID.substr(0, 10);
    }
    var obj = {
        //These must all be HTML safe 
        txid: santxid,
        highlighted: (ishighlighted ? ` highlight` : ``),
        id: (ishighlighted ? `highlightedcomment` : ``),
        blocked: (blockstxid != null ? `blocked` : ``),
        votebuttons: getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID),
        author: theMember.userHTML(true),
        message: message,
        likes: getLikesHTML(txid, likesbalance, differentiator, (likes>0)),
        tips: getTipsHTML(txid, tips, differentiator, (tips>0)),
        remembers: getRemembersHTML(txid, differentiator, repostcount, (repostcount>0)),
        age: getAgeHTML(firstseen, false, permalink),
        replyandtips: getReplyAndTipLinksHTML(page, txid, theMember.address, false, "", differentiator, topicHOSTILE, sourcenetwork, hivelink, origTXID, theMember.bitcoinaddress, permalink, articlelink),
        replydiv: getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID),
        diff: differentiator,
        deleted: (deleted=='1' ? ` deleted`:''),
        retracted:(deleted=='1' ? ` <span class='retracted'>retracted</span>`:'')
    };

    return templateReplace(replyTemplate, obj);

}

function getNestedPostHTML(data, targettxid, depth, pageName, firstreplytxid) {
    var contents = "<ul>";
    for (var i = 0; i < data.length; i++) {
        if ((data[i].retxid == targettxid || data[i].retxid == firstreplytxid) && data[i].txid != firstreplytxid) {
            let ratingused = data[i].sysrating;
            if (data[i].rating) {
                ratingused = data[i].rating;
            }
            var isMuted = (data[i].blockstxid != null || data[i].moderated != null || ratingused < 64);

            var obj = {
                unmuteddisplay: (isMuted ? `none` : `block`),
                muteddisplay: (isMuted ? `block` : `none`),
                txid: san(data[i].txid),
                hightlightedclass: (data[i].highlighted ? `highlightli` : ``),
                replyHTML: getHTMLForReply(data[i], depth, pageName, i),
                nestedPostHTML: getNestedPostHTML(data, data[i].txid, depth + 1, pageName, "dontmatch"),
                user: userFromDataBasic(data[i], data[i].ratingID, 0),
                age: getAgeHTML(data[i].firstseen),
                diff: i
                //These must all be HTML safe.
            }

            contents += templateReplace(nestedPostTemplate, obj);
        }
    }
    contents = contents + "</ul>";
    return contents;
}

function getAgeHTML(firstseen, compress=false, link=null) {
    let agehtml = `<span class="age">•` + timeSince(Number(firstseen), compress) + `</span>`;
    if(link){
        agehtml=`<a href='${link}'>${agehtml}</a>`;
    }
    return agehtml;
}

function getPostListItemHTML(postHTML) {
    if (postHTML == "") {
        return "";
    }
    return `<li class="post-list-li">` + postHTML + `</li>`;
}

function postlinkHTML(txid, linktext) {
    return `<a href="#thread?post=` + san(txid) + `" onclick="nlc();">` + getSafeTranslation(linktext, linktext) + `</a>`;
}

function getNavHeaderHTML(order, content, topicnameHOSTILE, filter, start, limit, action, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navheader = `<nav class="filters">`;
    navheader += `<a data-vavilon="VV0106" data-vavilon_title="VV0107" value="new" title="Latest posts" class="` + (order == 'new' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=new&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >New</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0104" data-vavilon_title="VV0105" value="hot" title="Hottest posts" class="` + (order == 'hot' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=hot&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Hot</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVTop" data-vavilon_title="VV0109" value="topd" title="Top posts from the past Day" class="` + (order == 'topd' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topd&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Top</a> `;
    navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0112" data-vavilon_title="VV0113" value="topw" title="Top posts from the past Week" class="` + (order == 'topw' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topw&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Week</a> `;
    //navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0114" data-vavilon_title="VV0115" value="topm" title="Top posts from the past Month" class="` + (order == 'topm' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topm&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Month</a> `;
    //navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0116" data-vavilon_title="VV0117" value="topy" title="Top posts from the past Year" class="`+(order=='topy'?'filteron':'filteroff')+`" href="#` + action + `?start=0&limit=` + limit + `&order=topy&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('new', 'new') + `</a> `;
    //navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0118" data-vavilon_title="VV0119" value="topa" title="Top posts from all time" class="` + (order == 'topa' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topa&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >All</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVold" data-vavilon_title="VVoldtitle" value="topa" title="Oldest to newest" class="` + (order == 'old' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=old&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Old</a> `;

    navheader += `<nav class="filterssecondset">`;
    navheader += `<a data-vavilon="VV0120" data-vavilon_title="VV0121" title="See only posts" class="` + (content == 'posts' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=posts&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Posts</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0122" data-vavilon_title="VV0123" title="See only replies" class="` + (content == 'replies' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=replies&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Replies</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVall" data-vavilon_title="VV0125" title="See both posts and replies" class="` + (content == 'both' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=both&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >All</a> `;
    navheader += "</nav>";
    navheader += "</nav>";
    return navheader;

}

function getNotificationNavButtonsNewHTML(start, limit, action, qaddress, minrating, notificationtype, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + action + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&minrating=` + minrating + `&nfilter=` + notificationtype + `&qaddress=` + qaddress + `" >` + getSafeTranslation('prev', 'back') + `</a> `; }

    //if (numberOfResults > numbers.results) //Sometimes an sql limit request returns fewer than the available set - nearly always include a next button
    //Always show
    { navbuttons += `<a class="back" href="#` + action + `?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&minrating=` + minrating + `&nfilter=` + notificationtype + `&qaddress=` + qaddress + `" >` + getSafeTranslation('next', 'next') + `</a>`; }

    navbuttons += "</div>";
    return navbuttons;

}


function getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, action, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    //Don't really need back button - user can click back in browser
    //if (start != 0) //Don't show back buttons if we're at the start
    //{ navbuttons += `<a class="next" href="#` + action + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('prev', 'back') + `</a> `; }

    //if (numberOfResults > numbers.results / 2) //Sometimes an sql limit request returns fewer than the available set - nearly always include a next button
    //Always show
    { navbuttons += `<a class="back" href="#` + action + `?start=` + (Number(start)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('next', 'next') + `</a>`; }

    navbuttons += "</div>";
    return navbuttons;

}


function getItemListandNavButtonsHTML(contentsHTML, navbuttonsHTML, styletype, start) {
    if (styletype != "") {
        return `<div class="itemlist"><ol start="` + (Number(start) + 1) + `" class="` + styletype + `">` + contentsHTML + `</ol></div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    } else {
        return `<div class="itemlist">` + contentsHTML + `</div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    }
}

function getVoteButtons(txid, bitcoinaddress, likedtxid, likeordislike, score, origTXID) {

    var upvoteHTML;
    let scoreHTML = `<span class="betweenvotesscore" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    var downvoteHTML;

    if (likeordislike == "1") {
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;"><span id="upvote` + san(txid) + `" class="votearrowactivated" title="` + getSafeTranslation('up') + `"></span><span class="votetext">` + getSafeTranslation('up') + `</span></a>`;
        scoreHTML = `<span class="betweenvotesscoreup" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        upvoteHTML = `<a id="upvoteaction${san(txid)}" href="javascript:;" onclick="likePost('${san(txid)}','${origTXID}','${san(bitcoinaddress)}',0)"><span id="upvote${san(txid)}" class="votearrow" title="${getSafeTranslation('up')}"></span><span class="votetext">${getSafeTranslation('up', 'up')}</span></a>`;
    }

    if (likeordislike == "-1") {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;"><span id="downvote` + san(txid) + `" class="votearrowactivateddown rotate180" title="` + getSafeTranslation('down') + `"><span class="votetext">` + getSafeTranslation('down', 'down') + `</span></span></a>`;
        scoreHTML = `<span class="betweenvotesscoredown" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;" onclick="dislikePost('` + san(txid) + `','` + san(origTXID) + `')"><span id="downvote` + san(txid) + `" class="votearrow rotate180" title="` + getSafeTranslation('down') + `"><span class="votetext">` + getSafeTranslation('down', 'down') + `</span></span></a>`;
    }

    return upvoteHTML + " " + scoreHTML + " " + downvoteHTML;
}

function getRefreshButtonHTML() {
    return `<a id="refreshbutton" class="btn" href="" onclick="displayContentBasedOnURLParameters();return false;">🔄</a>`;
}


function completedPostHTML(txid, titleHOSTILE) {

    var encodedURL = `https://twitter.com/intent/tweet?text=` + encodeURIComponent(titleHOSTILE + '\r\n' + ` member.cash/p/` + san(txid));

    var obj = {
        //These must all be HTML safe 
        txid: san(txid),
        encodedurl: encodedURL
    };

    return templateReplace(completedPostTemplate, obj);
}

function getCloseButtonHTML(profileelement) {
    return `<div class='closebutton'><a onclick="document.getElementById('` + profileelement + `').style.display='none';">` + getSafeTranslation('close', 'close') + `</a></div>`;
}

function getTipDetailsHTML(user, amount, type) {
    var theclass = "tipdetailscompact";
    return `<div class="` + theclass + `">` + user + (amount > 0 ? ` ` + getSafeTranslation('tipped', 'tipped') + ` ` + usdString(amount) : ``) + (Number(type) == -1 ? ` ` + getSafeTranslation('disliked', 'disliked') : ``) + `</div>`;
}

function getRememberDetailsHTML(user, message, topic, txid) {
    var theclass = "rememberdetailscompact";
    return `<div class="` + theclass + `">` + user + `<span class="plaintext"><a href="#thread?post=` + san(txid) + `" onclick="nlc();">` + (message ? getSafeTranslation('quoteremembered', 'quote remembered') : getSafeTranslation('remembered', 'remembered')) + "</a></span> " + getTopicHTML(topic, getSafeTranslation('totopic', ' #')) + `</div>`;
}

function getRepostHeaderHTML(user) {
    return `<span class='repost'>` + user + ` ` + getSafeTranslation('remembered', 'remembered') + `</span>`;
}

function getProfilePicLargeHTML(theURL) {
    return `<img id="settingspicturelarge" class="settingspicturelarge" src="` + theURL + `" style="display: block;" width="640" height="640">`;
}

function getNoCommentsYetHTML() {
    return `<p data-vavilon="replytostart" class='nocommentsyet'>No comments yet . . . reply to start a conversation</p>`;
}

//Media replacement
function makeYoutubeIframe(youtubeid, starttime) {
    var src = event.srcElement.parentElement;
    //setTimeout(function(){src.innerHTML='<div><br/><iframe class="youtubeiframe" src="https://www.youtube.com/embed/'+san(youtubeid)+'?rel=0&autoplay=1&showinfo=0" frameborder="0"></iframe></div>';},100);
    src.innerHTML += '<iframe width="480" height="270" class="youtubeiframe" src="https://www.youtube.com/embed/' + sane(youtubeid) + '?rel=0&autoplay=1&showinfo=0&start=' + starttime + '" frameborder="0"></iframe>';
}

function addImageAndYoutubeMarkdown(message, differentiator, global) {

    //These links should all have been generated by software, so should have a pattern of <a href=" pattern.

    if (settings["showyoutube"] == "true") {
        //Youtube
        var youtubeRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/i;
        message = message.replace(youtubeRegex,
            `<div class="youtubecontainer"><div class="youtubepreviewimage"><a onclick="event.stopPropagation();makeYoutubeIframe('$1','$4');"><div class="youtubepreview"><img loading="lazy" height="270" class="youtubepreviewimage" src="https://img.youtube.com/vi/$1/0.jpg"><img class="play-icon" alt="video post" width="100" src="img/youtubeplaybutton.svg"></div></a></div></div>`
        );
    }

    if (settings["showimgur"] == "true") {
        //Imgur
        var imgurRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(imgurRegex, replaceImgur);
    }
    

    /*if (settings["showprism"] == "true") {
        //Prism
        //If not, cdn.prism.red/*.jpeg & .png
        //Otherwise include mp4 & mp3 in that extension list
        var imgurRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(imgurRegex, replaceImgur);
    }*/

    if (settings["showtwitter"] == "true") {
        //Twitter
        var tweetRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/i;
        //This works but is ugly
        //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
        message = message.replace(tweetRegex,
            '<div class="twittercontainer"><iframe loading="lazy" height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F$1%2Fstatus%2F$3"></iframe></div>'
            //'<div class="nittercontainer"><iframe loading="lazy" height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://nitter.net/i/status/$3/embed?theme=twitter"></iframe></div>'        
        );
    }

    //Nitter
    /*
    var nitterRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?nitter\.net\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?nitter\.net\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/i;

    //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
    message = message.replace(nitterRegex,
        '<div class="nittercontainer"><iframe height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://nitter.net/embed/Tweet.html?id=$3"></iframe></div>'
    );*/

    if (settings["showlbry"] == "true") {
        var lbryRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?lbry\.tv\/@.+\/(.+?(?=:)).*<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?lbry\.tv\/@.+\/(.+?(?=:)).*<\/a>/i;
        message = message.replace(lbryRegex, `<div class="youtubecontainer"><iframe loading="lazy" width="480" height="270" class="odyseeiframe" src="https://odysee.com/$/embed/$1" allowFullScreen="false"></iframe></div>`);
    }

    if (settings["showbitclout"] == "true") {
        //Bitclout
        var bitcloutRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.bitclout\.com\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.bitclout\.com\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(bitcloutRegex, `<a href="https://images.bitclout.com/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://images.bitclout.com/$1$2"></img></div></a>`);

        var bitcloutRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(bitcloutRegex, `<a href="https://images.deso.org/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://images.deso.org/$1$2"></img></div></a>`);

    }

    var membercoinRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/i;
    message = message.replace(membercoinRegex, `<a href="https://member.cash/img/upload/$1.webp" rel="noopener noreferrer" target="_membercoin" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://member.cash/img/upload/$1.webp"></img></div></a>`);

    var memberlinksRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/i;
    message = message.replace(memberlinksRegex, replaceDiamondApp);

    var giphyRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(giphy\.com\/embed\/|media1\.giphy\.com\/media\/)([a-z0-9A-Z]{5,20})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(giphy\.com\/embed\/|media1\.giphy\.com\/media\/)([a-z0-9A-Z]{5,20})*.*?<\/a>/i;
    message = message.replace(giphyRegex, `<a href="https://i.giphy.com/media/$2/giphy.webp" rel="noopener noreferrer" target="_giphy" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://i.giphy.com/media/$2/giphy.webp"></img></div></a>`);


    var pearlRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/i;
    message = message.replace(pearlRegex, `<a href="https://cdn.pearl.app/$1.webp" rel="noopener noreferrer" target="_pearl" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://cdn.pearl.app/$1.webp"></img></div></a>`);

    var diamondappRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|diamondapp\.com\/nft\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/|node\.deso\.org\/posts\/)([a-z0-9]{64})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|diamondapp\.com\/nft\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/|node\.deso\.org\/posts\/)([a-z0-9]{64})*.*?<\/a>/i;
    message = message.replace(diamondappRegex, replaceDiamondApp);


    return message;
}

/*
function replaceLBRY(match, p1, p2, p3, p4, offset, string) {
    var differentiator = Math.floor(Math.random() * 1000000);
    populatelbry(p1,'lbry'+differentiator);
    return `<div id="lbry`+differentiator+`" class="youtubecontainer"></div>`;
}

async function populatelbry(lbrylink,elementid){
    //load lbry page
    let response = await fetch("https://lbry.tv/"+lbrylink);
    if (response.ok) { // if HTTP-status is 200-299
        let json = await response.text();
        document.getElementById(elementid).innerHTML=`<iframe width="480" height="270" class="youtubeiframe" src="https://lbry.tv/"></iframe>`;
    } else {
        //alert("HTTP-Error: " + response.status);
    }
    //parse for link
    
    //set contents
    //
}*/
function replaceDiamondApp(match, p1, p2){
    return `<a onclick="event.stopPropagation();nlc();location.href='#thread?post=${p2}'; " href="javascript:">https://member.cash/p/${p2.substring(0,10)}</a>`;
}

function replaceImgur(match, p1, p2, p3, p4, offset, string) {
    //return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
    if (!p4) { p4 = '.jpg'; }
    if (p4.toLowerCase() == '.mp4') {
        return `<a href='javascript:;'><video controls class="imgurimage" draggable="false" playsinline="true" loop="true"><source loading="lazy" type="video/mp4" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></video></a>`;
    }

    return `<a href="https://i.imgur.com` + p2 + p3 + `" rel="noopener noreferrer" target="_imgur" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></img></div></a>`;
}

//Notifications

function allowNotificationButtonHTML() {
    return `<span class="allownotifications"><a data-vavilon="VV0080" class="memberlinkbutton" href="javascript:;" onclick="requestNotificationPermission(); this.style.display='none';">Allow Notifications</a></span>`;
}

function getNotificationsTableHTML(contents, navbuttons) {
    return `<ul class="notificationslist">` + contents + `</ul>` + navbuttons;
}

function notificationItemHTML(notificationtype, iconHTML, mainbodyHTML, subtextHTML, addendumHTML, txid, highlighted) {
    //icon, mainbody and subtext should already be escaped and HTML formatted

    var obj = {
        //These must all be HTML safe.
        highlighted: (highlighted ? 'highlighted ' : ''),
        type: notificationtype,
        txid: san(txid),
        title: mainbodyHTML,
        age: subtextHTML,
        post: addendumHTML,
        iconHTML: iconHTML
    }

    return templateReplace(notificationCompactTemplate, obj);
}



//Maps

function getMapPostHTML(lat, lng, requireLogin) {

    var obj = {
        //These must all be HTML safe.
        lat: Number(lat),
        lng: Number(lng),
        profilepicsmall: profilepic,
        address: pubkey
    }

    return templateReplace(mapPostTemplate, obj);

}

function getMapCloseButtonHTML() {
    return `<font size="+3"><a href="#posts?type=all&amp;start=0&amp;limit=` + numbers.results + `">X</a></font>`;
    //onclick="hideMap();showPosts(0,numbers.results,'all');"
}

function getOSMattributionHTML() {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.';
}

function mapThreadLoadingHTML(previewHTML) {
    return `<div id='mapthread'>` + getSafeTranslation('loading', 'loading ') + previewHTML + "</div>";
}

//Trust graph and Rating
function getMembersWithRatingHTML(i, page, data, action, reverse) {
    var directlink = "";
    var field1 = `<td>` + directlink + userFromDataBasic(data, i + page + data.address, 8) + `</td>`;
    var field2 = `<td>` + getMemberLink(data.address2, data.name2) + `</td>`;
    if (reverse) {
        return `<tr>` + field2 + `<td>` + action + `</td>` + field1 + `</tr>`;
    }
    return `<tr>` + field1 + `<td>` + action + `</td>` + field2 + `</tr>`;
}

function getMemberLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();">` + ds(name) + `</a>`;
}

function getAddressLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();">` + san(address) + `</a>`;
}

function getDirectRatingHTML(data) {
    var obj = {
        //These must all be HTML safe.
        member: getMemberLink(data.member, data.membername),
        memberid: san(data.member),
        target: san(data.target),
        targetid: getMemberLink(data.target, data.targetname)
    }

    return templateReplace(directRatingHTML, obj);

    //return "<tr><td data-label='Member'>" + getMemberLink(data.member, data.membername) + "</td>" + "<td></td><td></td><td data-label='Rates as' align='center'> <div id='trust" + san(data.member) + san(data.target) + "'></div>  </td><td></td><td></td>" + "<td align='center'>" + "<td data-label='Member'>" + getMemberLink(data.target, data.targetname) + "</td></tr>";
}

function getIndirectRatingHTML(data) {
    var obj = {
        //These must all be HTML safe.
        member: getMemberLink(data.member, data.membername),
        memberid: san(data.member),
        membertxid: san(data.membertxid),
        inter: getMemberLink(data.inter, data.intername),
        interid: san(data.inter),
        intertxid: san(data.intertxid),
        target: getMemberLink(data.target, data.targetname),
        targetid: san(data.target)
    }

    return templateReplace(indirectRatingHTML, obj);

    //return "<tr><td data-label='You'><span class='ratermember'>" + getMemberLink(data.member, data.membername) + "</span></td>" + "<td data-label='Rate as'><span class='trustratingintermediate'><div id='trust" + san(data.member) + san(data.inter) + "'></div></span></td>" + "<td align='center' data-label='Member'><span class='intermediatemember'>" + getMemberLink(data.inter, data.intername) + "</span></td>" + `<td data-label='Who Rates as'><span class='trustratingbyintermediate'><div id='trust` + san(data.inter) + san(data.target) + "'></div></span></td>" + "<td data-label='Member'><span class='ratedmember'>" + getMemberLink(data.target, data.targetname) + "</span></td></tr>";
}

function getTrustRatingTableHTML(contentsHTML, rating) {

    var obj = {
        //These must all be HTML safe.
        tablecontents: contentsHTML,
        rating: (rating == 0) ? "No information" : Number(rating)
    }

    return templateReplace(trustRatingTableHTML, obj);

    /*if (rating == 0) {
        return "<span style='font-size:2em'>Overall Rating: No information</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    } else {
        return "<span style='font-size:2em'>Overall Rating:" + Number(rating) + "/5</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    }*/
}

function ratingAndReasonNew(ratername, rateraddress, rateename, rateeaddress, rating, reason, stem, txid) {
    //Careful to ensure disabletext is sanitized
    var disableText = rts(ratername) + ' rates ' + rts(rateename) + ' as {rating}/{maxRating}';

    var obj = {
        //These must all be HTML safe.
        rater: getMemberLink(rateraddress, ratername),
        disabletext: disableText,
        rateraddress: san(rateraddress),
        rating: Number(rating),
        stem: stem,
        ratee: getMemberLink(rateeaddress, rateename),
        txid: san(txid),
        reason: ds(reason)
    }

    return templateReplace(ratingAndReasonHTML, obj);


}

function getRatingComment(data) {
    return `<input placeholder="` + getSafeTranslation('VVratinginstruction', 'Add a comment and click on a star rating to rate this member...') + `" size="30" maxlength="190" id="memberratingcommentinputbox${san(data.bitcoinaddress)}" value="${ds(data.ratingreason)}" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function getMemberRatingHTML(bitcoinaddress, ratingScore, pagingid) {
    return `<div class="starrating"><div data-ratingsize="20" data-ratingname="` + ds(pagingid) + `" data-ratingaddress="` + san(bitcoinaddress) + `" data-ratingraw="` + Number(ratingScore) + `" id="memberrating` + san(bitcoinaddress) + `"></div></div>`;
}


//Settings
function clickActionNamedHTML(action, qaddress, name, targetpubkey) {
    return `<a class='${action}button' data-vavilon='` + action + `' class='` + action + `' href='javascript:;' onclick='` + action + `("` + sane(qaddress) + `","` + sane(targetpubkey) + `"); this.style.display="none";'>` + ds(name) + `</a>`;
}

/*
function privatekeyClickToShowHTML() {
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">` + getSafeTranslation('showpriv', 'Show private key') + `</a>`;
}*/

//Topics
function clickActionTopicHTML(action, qaddress, topicHOSTILE, buttonText, elementid) {
    return `<a id='` + san(elementid) + `' href='javascript:;' onclick='` + action + `("` + sane(qaddress) + `","` + unicodeEscape(topicHOSTILE) + `","` + san(elementid) + `");'>` + ds(buttonText) + `</a>`;
}

function getTopicHTML(topicHOSTILE, append) {
    //If the topic is All Topics, keep that as the display name, but use the empty string for server
    var displayNameHOSTILE = topicHOSTILE;
    if (topicHOSTILE == '') {
        if (append != '') return '';
        displayNameHOSTILE = 'All Tags';
    }
    return ` <span class="topic">` +
        `<a href="#topic?topicname=` + encodeURIComponent(topicHOSTILE) + `&start=0&limit=` + numbers.results + `&order=new" onclick="nlc();"> #` + capitalizeFirstLetter(ds(displayNameHOSTILE).substr(0, 40)) + `</a>`
        + `</span>`;
}

function getHTMLForTopicArray(data, elementStem) {

    var ret = getHTMLForTopic(data[0], elementStem);

    //This line so the alternate coloring on table rows still works
    ret += "<tr style='display:none'></tr>";

    ret += `<tr style='display:none' id='` + elementStem + data[0].mostrecent + `'><td colspan='4'>`;
    if (data[0].topic != "") {
        ret += `<div class="filterprovider">` + clickActionNamedHTML("unsub", data[0].topic, getSafeTranslation('unsubscribe', 'unsubscribe')) + "</div>";
    }
    var alreadymod = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) {
            ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", pubkey, data[i].topicname, getSafeTranslation('resign', 'resign as moderator'), "dismiss" + Number(data[i].mostrecent)) + "</div>";
            alreadymod = true;
        }
    }
    if (!alreadymod) {
        ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", pubkey, data[0].topicname, getSafeTranslation('volunteer', 'volunteer as moderator'), "designate" + Number(data[0].mostrecent)) + "</div>";
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) continue;
        if (data[i].existingmod != null) {
            if (data[i].existingmodaddress != null) {
                ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", data[i].existingmod, data[i].topicname, getSafeTranslation('removefilter', 'remove filter'), "dismiss" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + (new Member(data[i].existingmod, data[i].existingmodname, "", "")).userHTML(false) + ")</span></div>";
            } else {
                var userName = "";
                try {
                    userName = document.getElementById('settingsnametext').value;
                } catch (err) { }//means user is not logged in
                var userIsGroupFilter = userName.toLowerCase().endsWith("filter") || userName.toLowerCase().endsWith("group");
                if (!data[i].existingmodname) data[i].existingmodname = "";
                var modIsGroupFilter = data[i].existingmodname.toLowerCase().endsWith("filter") || data[i].existingmodname.toLowerCase().endsWith("group");
                if (userIsGroupFilter != modIsGroupFilter) {
                    ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", data[i].existingmod, data[i].topicname, getSafeTranslation('addfilter', 'add filter'), "designate" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + (new Member(data[i].existingmod, data[i].existingmodname, "", "")).userHTML(false) + ")</span></div>";
                }
            }
        }
    }
    ret += "</td></tr>";
    return ret;
}

function getHTMLForTopic(data, elementStem) {
    var ret = "";
    var subscribe = clickActionNamedHTML("sub", data.topicname, "sub");

    //Show more button if the user is subscribed or topic is emtpy string
    if (data.address != null || data.topicname == "") {
        subscribe = `<a id="` + elementStem + `link` + data.mostrecent + `" onclick="showMore('` + elementStem + data.mostrecent + `','` + elementStem + `link` + data.mostrecent + `'); jdenticon();" href="javascript:;">` + getSafeTranslation('more', 'more') + `</a>`;
    }
    //Special values for empty topic
    if (data.topicname == "") {
        data.messagescount = "";
        data.subscount = "";
    }
    ret += "<tr><td class='tltopicname'>" + getTopicHTML(data.topicname, '') + "</td><td class='tlmessagecount'>" + Number(data.messagescount) + "</td><td class='tlsubscount'>" + Number(data.subscount) + "</td><td class='tlaction'>" + subscribe + "</td></tr>";
    return ret;

}

function getHTMLForTopicHeader(topicNameHOSTILE, contents) {

    var obj = {
        //These must all be HTML safe.
        topic: capitalizeFirstLetter(ds(topicNameHOSTILE)),
        tablecontents: contents
    }

    return templateReplace(topicHeaderHTML, obj);

}

//Private Messages
function sendEncryptedMessageHTML(address, name, publickey) {
    return ` <a class="populate-send-message" onclick="populateSendMessage('` + san(address) + `','` + unicodeEscape(name) + `','` + san(publickey) + `');" href='javascript:;'>` + getSafeTranslation('sendmessage', 'send message') + `</a>`;
}

function populateSendMessage(address, name, publickey) {
    //show('messagesanchor');
    location.href = "#messages";

    if (publickey == null || publickey == "") {
        alert(getSafeTranslation('publickeynotavailable', "Public key is not available - maybe the user hasn't set their name/handle."));
        return;
    }
    document.getElementById('sendmessagebox').style.display = 'block';
    document.getElementById('messagerecipient').textContent = name;
    document.getElementById('messageaddress').textContent = address;
    document.getElementById('messagepublickey').textContent = publickey;
    scrollToElement("sendmessagecontainer");
}

function getMessageHTML(data, count) {
    //You sent a message
    if (data.bitcoinaddress == pubkey && data.address != data.toaddress) {
        return "<li><div class='replymessagemeta'><span class='plaintext'>" + getSafeTranslation('yousent', 'you sent') + " (" + data.message.length + " bytes) -> </span>" + (new Member(data.toaddress, data.recipientname, count + "privatemessages" + data.recipientbitcoinaddress, data.recipientrating, data.recipientpagingid, data.recipientpublickey, data.recipientpicurl, data.recipienttokens, data.recipientfollowers, data.recipientfollowing, data.recipientblockers, data.recipientblocking, data.recipientprofile, data.recipientisfollowing, data.recipientnametime, data.recipientlastactive, data.recipientsysrating, data.hivename, data.bitcoinaddress)).userHTML(true) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.recipientbitcoinaddress, data.recipientname, data.recipientpublickey) + "</div><br/><div class='privatemessagetext' id='" + san(data.roottxid) + "'>" + getSafeTranslation('processing', 'processing') + "</div><br/></li>";
    } else {
        return "<li><span class='messagemeta'>" + userFromDataBasic(data, count + "privatemessages" + data.address, 16) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.bitcoinaddress, data.name, data.publickey) + "</span><br/><div class='privatemessagetext' id='" + san(data.roottxid) + "'>" + getSafeTranslation('processing', 'processing') + "</div><br/></li>";
    }
}

async function populateMessages(data, count) {
    // Decrypt the message
    if (data.bitcoinaddress == pubkey && data.address != data.toaddress) {
        //this message was sent by the logged in user.
        await decryptMessageAndPlaceInDiv(privateKeyBuf, data.message, data.roottxid, data.recipientpublickey);
    } else {
        await decryptMessageAndPlaceInDiv(privateKeyBuf, data.message, data.roottxid, data.publickey);
    }
    return;
}


var bcdecrypt = null;

async function decryptMessageAndPlaceInDiv(privateKeyBuf, message, roottxid, publicKeySender) {

    //nb decrypted message can contain anything - don't do anything fancy with it - js/css risk!

    //Possibilities here
    //1 bitclout identity user logged in
    //2 seedphrase user logged in
    //3 no user logged in

    //a bitclout new style
    //b bitclout legacy style
    //c member legacy style

    //if bitclout identity user, only a or b is possible
    //if privkey, try member legacy style, then bitclout styles a or b

    //"Try again later: Unable to decrypt message: "
    //var decryptedMessage = getSafeTranslation('unabledecrypt', "Try again later: Unable to decrypt message: ");

    if (isBitCloutIdentityUser()) {
        putBitCloutDecryptedMessageInElement(message, roottxid, publicKeySender);
    } else if (privateKeyBuf) {
        //Bitclout message style - 
        if (bcdecrypt == null) {
            await loadScript("js/lib/identityencryption.js");
        }
        //var msgArray = new BCBuffer(message.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        var msgArray = Buffer.from(message, 'hex');
        try {
            //Try new style message
            //function (privateKeyRecipient, publicKeySender, encrypted, opts)
            let pubKeyBuf = Buffer.from(publicKeySender, 'hex');
            //var bcpublicKey = preslice.slice(3);
            //var publicKeyUncompressed = ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex');
            let uncompressedPublicKeySender = Buffer.from(window.ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex'), 'hex');

            let decryptedMessage = await bcdecryptShared(privateKeyBuf, uncompressedPublicKeySender, msgArray, { legacy: false }).toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            //console.log("new style:"+decryptedMessage);
            return;
        } catch (err) {
            document.getElementById(roottxid).textContent += " Try decrypt new style message error: " + err;
        }

        try {
            //Try old style message
            let decryptedMessage = await bcdecrypt(privateKeyBuf, msgArray, { legacy: false }).toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            return;
        } catch (err) {
            document.getElementById(roottxid).textContent += " Try decrypt legacy style message error: " + err;
        }
    } else {
        let decryptedMessage = getSafeTranslation('logintodecrypt', "Login to decrypt message: ");
        document.getElementById(roottxid).textContent = decryptedMessage;
        return;
    }

    try {
        if (privkey) {
            //If privkey login, try first, member message style
            const encrypted = eccryptoJs.deserialize(Buffer.from(message, 'hex'));
            const structuredEj = await eccryptoJs.decrypt(privateKeyBuf, encrypted);
            let decryptedMessage = structuredEj.toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            return;
        }
    } catch (err) {
        document.getElementById(roottxid).textContent += " Try decrypt member legacy style message error: " + err;
        //not a member legacy style message
    }

    document.getElementById(roottxid).textContent = " Unable to decrypt this message. May be a legacy style message that only the recipient can view.";

    return;
}


/*function getNothingFoundMessageHTML(tk, def) {
    return "<div class='message'>" + getSafeTranslation(tk, def) + "</div>";
}*/

function ___i18n(translationKey) {
    if (dictionary.live[translationKey]) {
        return dictionary.live[translationKey];
    }
    //console.log("No translation for "+translationKey);
    if (dictionary.fallback[translationKey]) {
        return dictionary.fallback[translationKey];
    }
    //console.log("No fallback translation for "+translationKey);
    return translationKey;

}

function getSafeTranslation(translationKey, fallback) {
    //return 'x';
    var translated = ___i18n(translationKey);
    if (translated == translationKey && fallback) {
        translated = fallback;
    }
    return ds(translated);
}

function getUnSafeTranslation(translationKey, fallback) {
    //return 'x';
    var translated = ___i18n(translationKey);
    if (translated == translationKey && fallback) {
        translated = fallback;
    }
    return (translated);
}

function translatePage() {
    //var matches = document.getElementsByTagName("*");
    var matches = document.querySelectorAll('[data-vavilon],[data-vavilon_title],[data-vavilon_value],[data-vavilon_data_label],[data-vavilon_data_placeholder]');
    //document.body.style.display='none';
    for (var j = 0; j < matches.length; j++) {
        var fds = matches[j].dataset;
        //if (fds.vavilon || fds.vavilon_title || fds.vavilon_value || fds.vavilon_data_label) {
        if (fds.vavilon)
            //matches[j].innerHTML=getSafeTranslation(fds.vavilon,fds.vavilon); //nb setting innerText is *a lot* faster
            //matches[j].innerText=getUnSafeTranslation(fds.vavilon,matches[j].innerText); //nb textContent is *even* faster - doesn't cause reflow problems
            matches[j].textContent = getUnSafeTranslation(fds.vavilon, matches[j].textContent);
        if (fds.vavilon_title)
            matches[j].title = getSafeTranslation(fds.vavilon_title, matches[j].title);
        if (fds.vavilon_value)
            matches[j].value = getSafeTranslation(fds.vavilon_value, matches[j].value);
        if (fds.vavilon_data_label)
            fds.label = getSafeTranslation(fds.vavilon_data_label, fds.label);
        if (fds.vavilon_data_placeholder)
            fds.placeholder = getSafeTranslation(fds.vavilon_data_placeholder, fds.placeholder);

        //}
    }
    //document.body.style.display='block';
}

//nb iframe not allowed by twitter
/*function createiframe(url, elementname) {
    document.getElementById(elementname).innerHTML = `<iframe height="400" width="550" id="alsotweet" border=0 frameborder=0 src="` + url + `"></iframe>`;
}*/

//Error

function showErrorMessage(status, page, theURL) {
    status = san(status);
    console.log(`Error:${status}`);
    var theElement = document.getElementById(page);
    if (theElement) {
        var obj = {
            //These must all be HTML safe.
            status: ds(status),
            url: ds(theURL)
        }
        theElement.innerHTML = templateReplace(errorTemplate, obj);
        //theElement.innerHTML = `<p><span class='connectionerror'>Oops. This request failed.<br/>There may be a problem with your internet connection, or the server may be having problems.<br/>The error code is ${status}<br/>The resource was ` + ds(theURL) + `</span></p>`;
    }
    updateStatus(`Error:${status}` + ds(theURL));
    updateStatus(`Error:${status}`);
}

//General
function getDivClassHTML(className, contentsHTML) {
    return `<div class="` + className + `">` + contentsHTML + `</div>`;
}

function getSpanHTML(className, localstrid, fallbacktext) {
    return ` <span class="` + className + `">` + getSafeTranslation(localstrid, fallbacktext) + `</span> `;
}

function getSpanClassHTML(className, contentsHTML) {
    return ` <span class="` + className + `">` + contentsHTML + `</span> `;
}

function escapeHTML(thetext) {
    return ds(thetext);
}

function rts(thetext) {
    //Sanitize text in ratings disabled mouseover. This is probably overkill
    return san(thetext);
}
"use strict";

var globalusersearchtimeoutcount = 0;
var previousSearchTermHOSTILE = "";
async function userSearchChanged(searchbox, targetelement) {

    var searchtermHOSTILE = document.getElementById(searchbox).value;

    if (searchtermHOSTILE.length < 1) {
        return;
    }

    //Show search results
    updateStatus(targetelement);
    var resultsElement = document.getElementById(targetelement);
    updateStatus(resultsElement);
    updateStatus(resultsElement.style.display);
    resultsElement.style.display = "block";
    updateStatus(resultsElement.style.display);
    //cover behind search results
    var ddcover = document.getElementById('ddcover');
    updateStatus(ddcover);

    ddcover.style.display = 'block';
    ddcover.onclick = resultsElement.onclick = function () { resultsElement.style.display = ddcover.style.display = 'none'; };

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
        //var contents = `<label for="usersearchresults">` + getSafeTranslation('results', 'Results') + `</label>`;
        var contents = '';
        for (var i = 0; i < data.length; i++) {
            contents = contents + getDivClassHTML('usersearchresult', userFromDataBasic(data[i], i + searchbox + data[i].address, 16));
        }
        document.getElementById(targetelement).innerHTML = contents;
        addDynamicHTMLElements(data);

    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}



/*
function createSurrogate() {
    var surrogateName = document.getElementById('surrogatename').value;
    createSurrogateUser(surrogateName, 'createsurrogatebutton', 'surrogatelink');
}*/

async function postprivatemessage() {

    var text = document.getElementById('newposttamessage').value;
    if (!text) {
        alert(getSafeTranslation('noprivatemessagefound', "Message cannot be empty!"));
        return;
    }

    document.getElementById('newpostmessagebutton').disabled = true;


    var status = "newpostmessagebutton";
    var stampAmount = document.getElementById("stampamount").value;
    if (stampAmount < 547) stampAmount = 547;

    var messageRecipient = document.getElementById("messageaddress").textContent;
    var publickey = document.getElementById("messagepublickey").textContent;

    let preEncryptedMessage;
    if (privateKeyBuf) {
        // Encrypt the message
        const pubKeyBuf = Buffer.from(publickey, 'hex');
        const data = Buffer.from(text);
        //const structuredEj = await eccryptoJs.encrypt(pubKeyBuf, data);
        //const encryptedMessage = eccryptoJs.serialize(structuredEj).toString('hex');
        let uncompressedPublicKeySender = Buffer.from(window.ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex'), 'hex');
        preEncryptedMessage = bcencryptShared(privateKeyBuf, uncompressedPublicKeySender, data, null).toString('hex');
    }

    var successFunction = privateMessagePosted;
    if (checkForNativeUserAndHasBalance()) {
        sendMessageRaw(privkey, null, preEncryptedMessage, 1000, status, successFunction, messageRecipient, stampAmount);
        successFunction = null;
    }

    if (isBitCloutUser()) {
        sendBitCloutPrivateMessage(publickey, text, status, successFunction, preEncryptedMessage);
    }
}

function privateMessagePosted() {
    document.getElementById('newpostmessagebutton').disabled = false;
    document.getElementById('newpostmessagebutton').value = getSafeTranslation('sendmessage', "Send Message");
    document.getElementById('newposttamessage').value = "";
    document.getElementById('newpostmessagecompleted').textContent = getSafeTranslation('messagesent', "Message Sent");

}

function addRSSFeed(type, buttonelement) {
    let rssURL;
    document.getElementById(buttonelement).style.visibility = 'hidden';
    if (type == 'twitter') rssURL = 'https://nitter.net/' + document.getElementById("twitterfeed").value.replace('@', '');
    if (type == 'plain') rssURL = document.getElementById("rssfeed").value;


    updateStatus("Fetching RSS");
    getJSON(dropdowns.txbroadcastserver + 'rss/add?address=' + encodeURIComponent(rssURL)).then(function (data) {
        updateStatus(sane(data.userid));
        window.location.href = "#show?order=new&qaddress=" + sane(data.userid);
    }, function (status) { });
}

function sendFundsAmountChanged() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    var usdAmount = ((Number(sendAmount) * numbers.usdrate) / 100000000).toFixed(2);
    document.getElementById("sendusd").textContent = "($" + usdAmount + ")";
}

async function sendfunds() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    if (sendAmount < 547) {
        alert(getSafeTranslation('547orlarger', "Amount has to be 547 satoshis or larger."));
        return;
    }
    var totalAmountPossible = updateBalance(chainheight);
    if (sendAmount > totalAmountPossible) {
        alert(getSafeTranslation('largerthanbalance', "This amount is larger than your balance.") + ' ' + totalAmountPossible);
        return;
    }

    var sendAddress = document.getElementById("sendfundsaddress").value.trim();
    if (sendAddress == "") {
        alert(getSafeTranslation('enteranaddress', "Make sure to enter an address to send to."));
    }

    if (sendAddress.startsWith("q")) {
        sendAddress = "member:" + sendAddress;
    }

    //sendAddress = sendAddress.replace("membercoin:", "bitcoincash:");
    if (sendAddress.startsWith("member:")) {
        sendAddress = await membercoinToLegacy(sendAddress);
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

function membercoinToLegacy(address) {
    const { prefix, type, hash } = cashaddr.decode(address);
    let hashhex = Buffer.from(hash).toString('hex');
    let toencode = new Buffer('00' + hashhex, 'hex');
    return window.bs58check.encode(toencode);
}

function legacyToMembercoin(pubkey) {
    let hash = Buffer.from(window.bs58check.decode(pubkey)).slice(1);
    return cashaddr.encode('member', 'P2PKH', hash);

    //const { prefix, type, hash } = cashaddr.decode(address);
    //let hashhex = Buffer.from(hash).toString('hex');
    //let toencode = new Buffer('00' + hashhex, 'hex');
    //return window.bs58check.encode(toencode);
    //return 'not defined yet';
}

function getLegacyToHash160(address) {
    let hash = Buffer.from(window.bs58check.decode(address)).slice(1);
    return hash.toString('hex');
}

function setBalanceWithInterest() {
    try {
        if (chainheighttime == 0) {
            return;
        }
        let elapsed = (new Date().getTime() - chainheighttime) / (78 * 1000);
        let membalance = updateBalance(chainheight + elapsed);
        let mem = (membalance / 100000000) + "";
        while (mem.length < 10) {
            mem = mem + "0";
        }
        //M̈ m̈
        //document.getElementById("membalance").textContent=mem.substring(0,10);
        document.getElementById("membalance").innerHTML = `<strong>m̈</strong>` + mem.substring(0, 10);
    } catch (err) {
        //console.log(err);
        //Error probably caused by trying to set balance before UTXO set is loaded
    }
}

setInterval(setBalanceWithInterest, 500);

//utxopool will call this after utxos updated
function updateChainHeight(chainheight2,chainheighttime2){
    chainheight=chainheight2;
    chainheighttime=chainheighttime2;
    updateBalance(chainheight2);
}

var showwarning=true;
function updateBalance(chainheight2) {

    if(tq.chainheighttime==0){
        return 0;
    }
    var total = tq.getBalance(chainheight2);
    document.getElementById('balancesatoshis').innerHTML = Math.round(total);
    document.getElementById('balancebch').innerHTML = (total / 100000000).toFixed(5);

    var usd = ((Number(total) * numbers.usdrate) / 100000000).toFixed(2);
    if (usd < 1) {
        document.getElementById('balanceusd').innerHTML = (usd * 100).toFixed(0) + "¢";
    } else {
        document.getElementById('balanceusd').innerHTML = "$" + usd;
    }

    if (document.getElementById('satoshiamount'))
        document.getElementById('satoshiamount').innerHTML = total;

    if (total < 2000 && showwarning) {
        var lowfundsElement = document.getElementById('lowfundswarning');
        if (lowfundsElement) {
            document.getElementById('lowfundswarning').style.display = 'block';
            //showQRCode('lowfundsaddress', 100);
            //only show this message once per app load
            showwarning = false;
        }
    }
    if (total >= 2000) {
        document.getElementById('lowfundswarning').style.display = 'none';
    }

    return total;
}




