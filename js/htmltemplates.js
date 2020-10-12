var postTemplate = `
<div class="post">
    <div class="post-sidebar">
        {profilepic}
    </div>
    <div class="post-content">
        <div class="post-author">
            <div class="author-details">
                <div class="author-name">
                    {handle}
                </div>
                <div class="author-handle">
                    {pagingid}
                </div>
            </div>
            <div class="btn-actions">
                <ul class="">
                    <li><a class="btn-icon" href="#">
                        <div class="icon">
                            <svg class="icon-container">
                                <use href="#chevron-down" />
                            </svg>
                        </div>
                    </a>
                        <ul class="dropdown">
                            <li><a href="#">
                                <!--                         <svg class="icon-container">
                                    <use href="#link" />
                                </svg> -->
                        Permalink</a></li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#link" />
                                </svg>  -->
                        Article</a></li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#link" />
                                </svg> -->
                        Tweet</a></li>
                            <li class="divider"></li>
                            <li class="actions-title">Blockchain</li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#share" />
                                </svg> -->
                        Memo</a></li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#share" />
                                </svg> -->
                        Bitcoin.com</a></li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#share" />
                                </svg> -->
                        BTC.com</a></li>
                            <li><a href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#share" />
                                </svg> -->
                        Blockchair</a></li>
                            <li class="divider"></li>
                            <li class="actions-title">Moderate</li>
                            <li><a class="danger" href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#flag" />
                                </svg> -->
                        Flag post</a></li>
                            <li><a class="danger" href="#">
                                <!--                       <svg class="icon-container">
                                    <use href="#flag" />
                                </svg> -->
                        Flag user</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="post-body">
            {message}
          </div>
        <div class="post-footer">
            <a class="btn-icon" data-action="reply">
                <div class="icon">
                    <svg class="icon-container">
                        <use href="#reply" />
                    </svg>
                </div>
                <div class="text">
                    {replies}
              </div>
            </a>
            <a class="btn-icon" data-action="like">
                <div class="icon">
                    <svg class="icon-container">
                        <use href="#like" />
                    </svg>
                </div>
                <div class="text">
                    {likes}
              </div>
            </a>
            <a class="btn-icon" data-action="remember">
                <div class="icon">
                    <svg class="icon-container">
                        <use href="#remember" />
                    </svg>
                </div>
                <div class="text">
                    {remembers}
              </div>
            </a>
            <a class="btn-icon" data-action="tip">
                <div class="icon">
                    <svg class="icon-container">
                        <use href="#tip" />
                    </svg>
                </div>
                <div class="text">
                    {tips}
              </div>
            </a>
        </div>
    </div>
</div>`;
