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
            </div>
        </div>
        <div class="post-body">
        {message}
        </div>
            <div class="btn-actions">
                        <div class="dropdown">
                            <span><a href="#">Permalink</a></span>
                            <span><a href="#">Article</a></span>
                            <span><a href="#">Tweet</a></span>
                            <span class="divider"></span>
                            <span class="actions-title">Blockchain</span>
                            <span><a href="#">Memo</a></span>
                            <span><a href="#">Bitcoin.com</a></span>
                            <span><a href="#">BTC.com</a></span>
                            <span><a href="#">Blockchair</a></span>
                            <span class="divider"></span>
                            <span class="actions-title">Moderate</span>
                            <span><a class="danger" href="#">Flag post</a></span>
                            <span><a class="danger" href="#">Flag user</a></span>
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
