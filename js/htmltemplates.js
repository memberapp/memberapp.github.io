var templatePost = `
<div class="post">
    <div class="post-sidebar">
        {profilepic}
    </div>
    <div class="post-content">
        <div class="post-author">
            <div class="author-details">
                <span class="author-name">
                    {handle}
                </span>
                <span class="author-handle">
                    @{pagingid}
                </span>
                <span class="elapsed-time">
                    {elapsed}
                </span>
                <span class="elapsed-time-compressed" style="display:none">
                    {elapsedcompressed}
                </span>
            </div>
        </div>
        <div class="post-body">
        {message}
        </div>
            <div class="btn-actions">
                        <div class="dropdown">
                            <a href="#"><span data-vavilon="VVpermalink">Permalink</span></a>
                            <a href="#"><span data-vavilon="VVarticle"><a href="#">Article</span></a>
                            <a href="#"><span data-vavilon="VVtweet"><a href="#">Tweet</span></a>
                            <span class="divider"></span>
                            <span class="actions-title">Blockchain</span>
                            <span><a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/{txid}">Memo</a></span>
                            <span><a rel="noopener noreferrer" target="bitcoincom" href="https://explorer.bitcoin.com/bch/tx/{txid}">Bitcoin.com</a></span>
                            <span><a rel="noopener noreferrer" target="btccom" href="https://bch.btc.com/{txid}">BTC.com</a></span>
                            <span><a rel="noopener noreferrer" target="blockchair" href="https://blockchair.com/bitcoin-cash/transaction/{txid}">Blockchair</a></span>
                            <span><a rel="noopener noreferrer" target="bitcoinunlimited" href="https://explorer.bitcoinunlimited.info/tx/{txid}">Bitcoin Unlimited</a></span>
                            <span class="divider"></span>
                            <span class="actions-title">Moderate</span>
                            <a class="danger" href="#"><span data-vavilon="VVflagpost">Flag post</span></a>
                            <a class="danger" href="#"><span data-vavilon="VVflaguser">Flag user</span></a>
                        </div>
            </div>
        <div class="post-footer">
            <a class="btn-icon" data-action="reply">
                <span class="icon">
                💬
                </span>
                <span class="text">
                    {replies}
              </span>
              <span class="text footerlabel" data-vavilon="VVreplies">replies</span>
            </a>
            <a class="btn-icon" data-action="like">
                <span class="icon">
                💙
                </span>
                <span class="text">
                    {likes}
              </span>
              <span class="text footerlabel" data-vavilon="VVlikes">likes</span>
            </a>
            <a class="btn-icon" data-action="remember">
                <span class="icon">
                ♻
                </span>
                <span class="text">
                    {remembers}
              </span>
              <span class="text footerlabel" data-vavilon="VVremembers">remembers</span>
            </a>
            <a class="btn-icon" data-action="tip">
                <span class="icon">
                💰
                </span>
                <span class="text">
                    {tips}
              </span>
              <span class="text footerlabel" data-vavilon="VVtips">tips</span>
            </a>
        </div>
    </div>
</div>`;
