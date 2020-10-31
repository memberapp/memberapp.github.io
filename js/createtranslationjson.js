function createTranslationJSON() {
    var templateVars = [
        errorTemplate,
        topicHeaderHTML,
        ratingAndReasonHTML,
        trustRatingTableHTML,
        indirectRatingHTML,
        directRatingHTML,
        mainbodyHTML,
        loginboxHTML,
        lowfundswarningHTML,
        toolsanchorHTML,
        newpostHTML,
        messagesanchorHTML,
        fbHTML.followers,
        fbHTML.following,
        fbHTML.blockers,
        fbHTML.blocking,
        communityHTML,
        anchorratingsHTML,
        trustgraphHTML,
        pages.member,
        pages.settings,
        headerHTML,
        footerHTML,
        completedPostTemplate,
        scoresTemplate,
        userTemplate,
        nestedPostTemplate,
        postTemplate,
        notificationTemplate,
        replyTemplate,
        replyDivTemplate,
        replyAndTipsTemplate,
        mapPostTemplate
    ];

    var vvitems = [];
    for (var i = 0; i < templateVars.length; i++) {
        //document.getElementById('previewcontent').innerHTML = templateVars[i];
        var matches = document.getElementsByTagName("*");
        //document.querySelectorAll("[id^='" + stem + "']");
        for (var j = 0; j < matches.length; j++) {
            //addSingleStarsRating(matches[i]);
            //var test=matches[i];
            if (matches[j].dataset.vavilon || matches[j].dataset.vavilon_title || matches[j].dataset.vavilon_value || matches[j].dataset.vavilon_data_label) {
                if (matches[j].dataset.vavilon) console.log('"'+matches[j].dataset.vavilon +'"'+ ":" + '"'+matches[j].innerHTML+'",');
                vvitems[matches[j].dataset.vavilon]=matches[j].innerHTML;
                if (matches[j].dataset.vavilon_title) console.log('"'+matches[j].dataset.vavilon_title +'"'+ ":" + '"'+matches[j].title+'",');
                vvitems[matches[j].dataset.vavilon_title]=matches[j].title;
                if (matches[j].dataset.vavilon_value) console.log('"'+matches[j].dataset.vavilon_value +'"'+ ":" + '"'+matches[j].value+'",');
                vvitems[matches[j].dataset.vavilon_value]=matches[j].value;
                if (matches[j].dataset.vavilon_data_label) console.log('"'+matches[j].dataset.vavilon_data_label +'"'+ ":" + '"'+ matches[j].dataset.label+'",');
                vvitems[matches[j].dataset.vavilon_data_label]=matches[j].dataset.label;
            }
        }
    }

    var safetranslations=` `;

    //this regex doesn't work quite right with newlines
  var newStuff=safetranslations.replace(/(.*)getSafeTranslation\('(.*)'\s*,\s*(["'].*["'])\)(.*)/gm,replaceName);

  console.log(newStuff);

    //getSpanHTML('plaintext','rememberedyour','remembered your')

}