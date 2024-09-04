!function(){for(var e={defaultSettings:{url:"https://imgbb.com/upload",vendor:"auto",mode:"auto",lang:"auto",autoInsert:"bbcode-embed-thumbnail",palette:"default",init:"onload",containerClass:1,buttonClass:1,sibling:0,siblingPos:"after",fitEditor:0,observe:0,observeCache:1,html:'<div class="%cClass"><button %x class="%bClass"><span class="%iClass">%iconSvg</span><span class="%tClass">%text</span></button></div>',css:".%cClass{display:inline-block;margin-top:5px;margin-bottom:5px}.%bClass{line-height:normal;-webkit-transition:all .2s;-o-transition:all .2s;transition:all .2s;outline:0;color:%2;border:none;cursor:pointer;border:1px solid rgba(0,0,0,.15);background:%1;border-radius:.2em;padding:.5em 1em;font-size:12px;font-weight:700;text-shadow:none}.%bClass:hover{background:%3;color:%4;border-color:rgba(0,0,0,.1)}.%iClass,.%tClass{display:inline-block;vertical-align:middle}.%iClass svg{display:block;width:1em;height:1em;fill:currentColor}.%tClass{margin-left:.25em}"},ns:{plugin:"imgbb"},palettes:{default:["#ececec","#333","#2980b9","#fff"],clear:["inherit","inherit","inherit","#2980b9"],turquoise:["#16a085","#fff","#1abc9c","#fff"],green:["#27ae60","#fff","#2ecc71","#fff"],blue:["#2980b9","#fff","#3498db","#fff"],purple:["#8e44ad","#fff","#9b59b6","#fff"],darkblue:["#2c3e50","#fff","#34495e","#fff"],yellow:["#f39c12","#fff","#f1c40f","#fff"],orange:["#d35400","#fff","#e67e22","#fff"],red:["#c0392b","#fff","#e74c3c","#fff"],grey:["#ececec","#000","#e0e0e0","#000"],black:["#333","#fff","#666","#fff"]},classProps:["button","container"],iconSvg:'<svg class="%iClass" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M76.7 87.5c12.8 0 23.3-13.3 23.3-29.4 0-13.6-5.2-25.7-15.4-27.5 0 0-3.5-0.7-5.6 1.7 0 0 0.6 9.4-2.9 12.6 0 0 8.7-32.4-23.7-32.4 -29.3 0-22.5 34.5-22.5 34.5 -5-6.4-0.6-19.6-0.6-19.6 -2.5-2.6-6.1-2.5-6.1-2.5C10.9 25 0 39.1 0 54.6c0 15.5 9.3 32.7 29.3 32.7 2 0 6.4 0 11.7 0V68.5h-13l22-22 22 22H59v18.8C68.6 87.4 76.7 87.5 76.7 87.5z" style="fill: currentcolor;"/></svg>',l10n:{ar:"تحميل الصور",cs:"Nahrát obrázky",da:"Upload billeder",de:"Bilder hochladen",es:"Subir imágenes",fi:"Lataa kuvia",fr:"Importer des images",id:"Unggah gambar",it:"Carica immagini",ja:"画像をアップロード",nb:"Last opp bilder",nl:"Upload afbeeldingen",pl:"Wyślij obrazy",pt_BR:"Enviar imagens",ru:"Загрузить изображения",tr:"Resim Yukle",uk:"Завантажити зображення",zh_CN:"上传图片",zh_TW:"上傳圖片"},vendors:{default:{check:function(){return 1},getEditor:function(){var t,e={textarea:{name:["recaptcha","search","recipients","coppa","^comment_list","username_list","add","filecomment","poll_option_text"]},ce:{dataset:["gramm"]}},i=["~","|","^","$","*"],s={};for(t in e){s[t]="";var n,r=e[t];for(n in r)for(var o=0;o<r[n].length;o++){var a="",l=r[n][o],u=l.charAt(0);-1<i.indexOf(u)&&(a=u,l=l.substring(1)),s[t]+=":not(["+("dataset"==n?"data-"+l:n+a+'="'+l+'"')+"])"}}return document.querySelectorAll('[contenteditable=""]'+s.ce+',[contenteditable="true"]'+s.ce+",textarea:not([readonly])"+s.textarea)}},bbpress:{settings:{autoInsert:"html-embed-medium",html:'<input %x type="button" class="ed_button button button-small" aria-label="%text" value="%text">',sibling:"#qt_bbp_reply_content_img",siblingPos:"before"},check:"bbpEngagementJS"},discourse:{settings:{autoInsert:"markdown-embed-medium",html:'<button %x title="%text" class="upload btn no-text btn-icon ember-view"><i class="fa fa-cloud-upload d-icon d-icon-upload"></i></button>',sibling:".upload.btn",siblingPos:"before",observe:".create,#create-topic,.usercard-controls button",observeCache:0,onDemand:1},check:"Discourse"},discuz:{settings:{buttonClass:1,html:'<a %x title="%text" class="%bClass">%iconSvg</a>',sibling:".fclr,#e_attach",css:"a.%bClass,.bar a.%bClass{box-sizing:border-box;cursor:pointer;background:%1;color:%2;text-indent:unset;position:relative}.b1r a.%bClass:hover,a.%bClass:hover{background:%3;color:%4}a.%bClass{font-size:14px}.b1r a.%bClass{border:1px solid rgba(0,0,0,.15)!important;font-size:20px;padding:0;height:44px}.%bClass svg{font-size:1em;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}",palette:"purple"},palettes:{default:["transparent","#333","#2980b9","#fff"]},check:"DISCUZCODE",getEditor:function(){return document.querySelector('.area textarea[name="message"]')}},ipb:{settings:{autoInsert:"html-embed-medium",html:'<a %x class="cke_button cke_button_off %bClass" title="%text" tabindex="-1" hidefocus="true" role="button"><span class="cke_button_icon">%iconSvg</span><span class="cke_button_label" aria-hidden="false">%text</span><span class="cke_button_label" aria-hidden="false"></span></a>',sibling:".cke_button__ipslink",siblingPos:"before",css:".cke_button.%bClass{background:%1;position:relative}.cke_button.%bClass:hover{background:%3;border-color:%5}.cke_button.%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:%2}.cke_button.%bClass:hover svg{fill:%4}"},palettes:{default:["inherit","#444","","inherit"]},check:"ips",getEditorFn:function(){var t=this.getEditor().dataset.ipseditorName;return CKEDITOR.instances[t]},getEditor:function(){return document.querySelector("[data-ipseditor-name]")},editorValue:function(t){t=CKEDITOR.dom.element.createFromHtml("<p>"+t+"</p>");this.getEditorFn().insertElement(t)},useCustomEditor:function(){return 1}},mybb:{settings:{sibling:"#quickreply_e > tr > td > *:last-child, .sceditor-container",fitEditor:0,extracss:".trow2 .%cClass{margin-bottom:0}"},check:"MyBB",getEditor:function(){return MyBBEditor?MyBBEditor.getContentAreaContainer().parentElement:document.querySelector("#quickreply_e textarea")},editorValue:function(t){var e;MyBBEditor?(e=MyBBEditor.inSourceMode()?"insert":"wysiwygEditorInsertHtml",MyBBEditor[e]("insert"==e?t:MyBBEditor.fromBBCode(t))):this.getEditor().value+=t},useCustomEditor:function(){return!!MyBBEditor}},nodebb:{settings:{autoInsert:"markdown-embed-medium",html:'<li %x tabindex="-1" title="%text"><i class="fa fa-cloud-upload"></i></li>',sibling:'[data-format="picture-o"]',siblingPos:"before",observe:'[component="category/post"],[component="topic/reply"],[component="topic/reply-as-topic"],[component="post/reply"],[component="post/quote"]',observeCache:0,onDemand:1},check:"__nodebbSpamBeGoneCreateCaptcha__",callback:function(){for(var t=document.querySelectorAll(".btn-toolbar .img-upload-btn"),e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])}},phpbb:{settings:{html:document.querySelector("#format-buttons *:first-child")&&"BUTTON"==document.querySelector("#format-buttons *:first-child").tagName?' <button %x type="button" class="button button-icon-only" title="%text"><i class="icon fa-cloud-upload fa-fw" aria-hidden="true"></i></button> ':' <input %x type="button" class="button2" value="%text"> ',sibling:document.querySelector("#format-buttons *:first-child")&&"BUTTON"==document.querySelector("#format-buttons *:first-child").tagName?".bbcode-img":"#message-box textarea.inputbox",siblingPos:"after"},check:"phpbb",getEditor:function(){if("undefined"!=typeof form_name&&"undefined"!=typeof text_name)return document.forms[form_name].elements[text_name]}},proboards:{settings:{html:' <input %x type="submit" value="%text"> ',css:"",sibling:"input[type=submit]",siblingPos:"before"},check:"proboards",editorValue:function(t){var e=$(".wysiwyg-textarea").data("wysiwyg"),e=e.editors[e.currentEditorName];e.setContent(e.getContent()+t)},useCustomEditor:function(){return 1!==$(".container.quick-reply").size()},getEditor:function(){return document.querySelector("textarea[name=message]")}},redactor2:{getEditor:function(){var t=this.getEditorFn();return t?(this.useCustomEditor()?t.$box:t)[0]:null},getEditorEl:function(){return(this.useCustomEditor()?this.getEditorFn().$editor:this.getEditorFn())[0]},editorValue:function(t){var e,i=this.useCustomEditor()?"innerHTML":"value";{if("string"!=typeof t)return e=this.getEditorEl()[i],this.useCustomEditor()&&"<p><br></p>"==e?"":this.getEditorEl()[i];this.useCustomEditor()?(e="<p>"+t+"</p>",this.getEditorFn().insert.html(""!==this.editorValue()?"<p><br></p>"+e:e)):this.getEditorEl()[i]=t}},useCustomEditor:function(){return!(this.getEditorFn()instanceof jQuery)}},smf:{settings:{html:' <button %x title="%text" class="%bClass"><span class="%iClass">%iconSvg</span><span class="%tClass">%text</span></button> ',css:"%defaultCSS #bbcBox_message .%bClass{margin-right:1px;transition:none;color:%2;padding:0;width:23px;height:21px;border-radius:5px;background-color:%1}#bbcBox_message .%bClass:hover{background-color:%3}#bbcBox_message .%tClass{display:none}",sibling:"#BBCBox_message_button_1_1,.quickReplyContent + div",siblingPos:"before",fitEditor:1},palettes:{default:["#E7E7E7","#333","#B0C4D6","#333"]},check:"smf_scripturl",getEditor:function(){return 0<smf_editorArray.length?smf_editorArray[0].oTextHandle:document.querySelector(".quickReplyContent textarea")}},quill:{settings:{autoInsert:"html-embed-medium",html:'<li class="richEditor-menuItem richEditor-menuItem_f1af88yq" role="menuitem"><button %x class="richEditor-button richEditor-embedButton richEditor-button_f1fodmu3" type="button" aria-pressed="false"><span class="richEditor-iconWrap_f13bdese"></span>%iconSvg</button></li>',sibling:"ul.richEditor-menuItems li.richEditor-menuItem:last-child",css:".%iClass {display: block; height: 24px; margin: auto; width: 24px;}"},check:"quill",editorValue:function(t){quill.clipboard.dangerouslyPasteHTML("\n"==quill.getText()?0:quill.getLength(),t)},useCustomEditor:function(){return 1},getEditor:function(){return quill.container}},vanilla:{settings:{autoInsert:"markdown-embed-medium",html:'<span %x class="icon fas fa-cloud-upload-alt" title="%text"></span>',sibling:".editor-dropdown-upload"},check:"Vanilla",getEditor:function(){return document.getElementById("Form_Body")}},vbulletin:{settings:{autoInsert:"html-embed-medium",html:'<li %x class="%bClass b-toolbar__item b-toolbar__item--secondary" title="%text" tabindex="0">%iconSvg</li>',sibling:".b-toolbar__item--secondary:first-child",siblingPos:"before",css:".%bClass{background:%1;color:%2;position:relative}.%bClass:hover{background:%3;color:%4;border-color:%5}.%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}"},palettes:{default:["","#4B6977","","#007EB8"]},check:"vBulletin",getEditorFn:function(){var t=this.getEditor().getAttribute("ck-editorid");return CKEDITOR.instances[t]},getEditor:function(){return document.querySelector("[data-message-type]")},editorValue:function(t){t=CKEDITOR.dom.element.createFromHtml("<p>"+t+"</p>");this.getEditorFn().insertElement(t)},useCustomEditor:function(){return 1}},WoltLab:{settings:{autoInsert:"html-embed-medium",sibling:'li[data-name="settings"]',html:'<li %x><a><span class="icon icon16 fa-cloud-upload"></span> <span>%text</span></a></li>'},check:"WBB",getEditorFn:function(){var t=$("#text").data("redactor");return t||null}},XF1:{settings:{autoInsert:"html-embed-medium",containerClass:1,buttonClass:1,html:'<li class="%cClass"><a %x class="%bClass" unselectable="on" title="%text">%iconSvg</a></li>',sibling:".redactor_btn_container_image",siblingPos:"before",css:"li.%cClass .%bClass{background:%1;color:%2;text-indent:unset;border-radius:3px;position:relative}li.%cClass a.%bClass:hover{background:%3;color:%4;border-color:%5}.%cClass .%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}",observe:".edit.OverlayTrigger",observeCache:1},palettes:{default:["none","inherit","none","inherit",""]},check:"XenForo",getEditorFn:function(){var t=document.querySelector("#exposeMask")&&document.querySelector("#exposeMask").offsetParent?".xenOverlay form":"form";if("form"!==t)for(var e=document.querySelectorAll(t),i=0;i<e.length;i++)if(e[i].offsetParent){t+='[action="'+e[i].getAttribute("action")+'"]';break}return XenForo.getEditorInForm(t)},getEditor:function(){var t=this.getEditorFn();return t?(this.useCustomEditor()?t.$box:t)[0]:null},getEditorEl:function(){return(this.useCustomEditor()?this.getEditorFn().$editor:this.getEditorFn())[0]},editorValue:function(t){var e,i=this.useCustomEditor()?"innerHTML":"value";{if("string"!=typeof t)return e=this.getEditorEl()[i],this.useCustomEditor()&&"<p><br></p>"==e?"":this.getEditorEl()[i];this.useCustomEditor()?(e="<p>"+t+"</p>",this.getEditorFn().insertHtml(""!==this.editorValue()?"<p><br></p>"+e:e)):this.getEditorEl()[i]=t}},useCustomEditor:function(){return!(this.getEditorFn()instanceof jQuery)}},XF2:{settings:{autoInsert:"html-embed-medium",containerClass:1,buttonClass:"button--link js-attachmentUpload button button--icon button--icon--upload fa--xf",html:'<div class="formButtonGroup"><div class="formButtonGroup-extra"><button type="button" tabindex="-1" role="button" title="%text" class="%bClass" %x><span class="button-text">%text</span></button></div></div>',sibling:"",siblingPos:"after",observe:'[data-xf-click="quick-edit"]',observeCache:1},palettes:{default:["transparent","#505050","rgba(20,20,20,0.06)","#141414"]},check:"XF",getEditorFn:function(t){var e=".js-editor";return"string"==typeof t&&(e=this.getEditorSel(t)),XF.getEditorInContainer($(e))},getEditorSel:function(t){return"["+e.ns.dataPluginTarget+'="'+t+'"]'},getEditor:function(t){return"string"==typeof t?document.querySelector(this.getEditorSel(t)):document.querySelectorAll(".js-editor")},getBbCode:function(t){return t.getTextArea()[0].value},editorValue:function(t,e){var i,s="<p><br></p>",n=this.getEditorFn(e),r=n.ed.bbCode.isBbCodeView()?["bbCode","getBbCode","insertBbCode"]:["html","get","insert"],o=n.ed[r[0]];return"string"==typeof t?(i=""!==this.editorValue(!1,e),void("html"==r[0]?(n="<p>"+t+"</p>",o[r[2]](i?s+n:n)):XF.ajax("POST",XF.canonicalizeUrl("index.php?editor/to-bb-code"),{html:t}).done(function(t){o[r[2]](i?"\n"+t.bbCode:t.bbCode)}))):(e=void 0===o[r[1]]?this.getBbCode(o):o[r[1]](),this.useCustomEditor()&&e==s?"":e)},useCustomEditor:function(){return void 0!==XF.getEditorInContainer($(".js-editor"))}}},generateGuid:function(){var i=(new Date).getTime();return"undefined"!=typeof performance&&"function"==typeof performance.now&&(i+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=(i+16*Math.random())%16|0;return i=Math.floor(i/16),("x"===t?e:3&e|8).toString(16)})},getNewValue:function(t,e){var i="string"!=typeof t.getAttribute("contenteditable")?"value":"innerHTML",s="value"==i?"\n":"<br>",t=t[i],i=e;if(!1,0==t.length)return i;e="",t=t.match(/\n+$/g),t=t?t[0].split("\n").length:0;return t<=2&&(e+=s.repeat(0==t?2:1)),e+i},insertTrigger:function(){var t,e=this.vendors[this.settings.vendor],i=this.settings.sibling?document.querySelectorAll(this.settings.sibling+":not(["+this.ns.dataPlugin+"])")[0]:0;if("auto"==this.settings.mode)t=this.vendors[e.hasOwnProperty("getEditor")?this.settings.vendor:"default"].getEditor();else{for(var s=document.querySelectorAll("["+this.ns.dataPluginTrigger+"][data-target]:not(["+this.ns.dataPluginId+"])"),n=[],r=0;r<s.length;r++)n.push(s[r].dataset.target);0<n.length&&(t=document.querySelectorAll(n.join(",")))}if(t){!document.getElementById(this.ns.pluginStyle)&&this.settings.css&&(o=document.createElement("style"),a=this.settings.css,a=this.appyTemplate(a),o.type="text/css",o.innerHTML=a.replace(/%p/g,"."+this.ns.plugin),o.setAttribute("id",this.ns.pluginStyle),document.body.appendChild(o)),t instanceof NodeList||(t=[t]);for(var o,a,l,u=0,r=0;r<t.length;r++)t[r].getAttribute(this.ns.dataPluginTarget)||((l=i||t[r]).setAttribute(this.ns.dataPlugin,"sibling"),l.insertAdjacentHTML({before:"beforebegin",after:"afterend"}[this.settings.siblingPos],this.appyTemplate(this.settings.html)),l=l.parentElement.querySelector("["+this.ns.dataPluginTrigger+"]"),this.setBoundId(l,t[r]),u++);this.triggerCounter=u,"function"==typeof e.callback&&e.callback.call()}},appyTemplate:function(t){if(!this.cacheTable){var e=[{"%iconSvg":this.iconSvg},{"%text":this.settings.langString}];if(this.palette){for(var i=/%(\d+)/g,s=i.exec(t),n=[];null!==s;)-1==n.indexOf(s[1])&&n.push(s[1]),s=i.exec(t);if(n){n.sort(function(t,e){return e-t});this.vendors[this.settings.vendor];for(var r=0;r<n.length;r++){var o=n[r]-1,a=this.palette[o]||"",o=(a||"default"===this.settings.vendor||"default"===this.settings.palette||(a=this.palette[o-2]),{});o["%"+n[r]]=a,e.push(o)}}}for(var l=this.settings.buttonClass||this.ns.plugin+"-button",u=[{"%cClass":this.settings.containerClass||this.ns.plugin+"-container"},{"%bClass":l},{"%iClass":l+"-icon"},{"%tClass":l+"-text"},{"%x":this.ns.dataPluginTrigger},{"%p":this.ns.plugin}],r=0;r<u.length;r++)e.push(u[r]);this.cacheTable=e}return this.strtr(t,this.cacheTable)},strtr:function(t,e){if(!(t=t.toString())||void 0===e)return t;for(var i=0;i<e.length;i++){var s,n=e[i];for(s in n)void 0!==n[s]&&(re=new RegExp(s,"g"),t=t.replace(re,n[s]))}return t},setBoundId:function(t,e){var i=this.generateGuid();t.setAttribute(this.ns.dataPluginId,i),e.setAttribute(this.ns.dataPluginTarget,i)},openPopup:function(t){if("string"==typeof t){var e=this;if(void 0===this.popups&&(this.popups={}),void 0===this.popups[t]){this.popups[t]={};var i,s={l:null!=window.screenLeft?window.screenLeft:screen.left,t:null!=window.screenTop?window.screenTop:screen.top,w:window.innerWidth||document.documentElement.clientWidth||screen.width,h:window.innerHeight||document.documentElement.clientHeight||screen.height},n={w:720,h:690},r={w:.5,h:.85};for(i in n)n[i]/s[i]>r[i]&&(n[i]=s[i]*r[i]);var o=Math.trunc(s.w/2-n.w/2+s.l),a=Math.trunc(s.h/2-n.h/2+s.t);this.popups[t].window=window.open(this.settings.url,t,"width="+n.w+",height="+n.h+",top="+a+",left="+o),this.popups[t].timer=window.setInterval(function(){e.popups[t].window&&!1===e.popups[t].window.closed||(window.clearInterval(e.popups[t].timer),e.popups[t]=void 0)},200)}else this.popups[t].window.focus()}},postSettings:function(t){this.popups[t].window.postMessage({id:t,settings:this.settings},this.settings.url)},liveBind:function(n,t,r){document.addEventListener(t,function(t){var e=document.querySelectorAll(n);if(e){for(var i=t.target,s=-1;i&&-1===(s=Array.prototype.indexOf.call(e,i));)i=i.parentElement;-1<s&&(t.preventDefault(),r.call(t,i))}},!0)},prepare:function(){var e=this,t=(this.ns.dataPlugin="data-"+this.ns.plugin,this.ns.dataPluginId=this.ns.dataPlugin+"-id",this.ns.dataPluginTrigger=this.ns.dataPlugin+"-trigger",this.ns.dataPluginTarget=this.ns.dataPlugin+"-target",this.ns.pluginStyle=this.ns.plugin+"-style",this.ns.selDataPluginTrigger="["+this.ns.dataPluginTrigger+"]",document.currentScript||document.getElementById(this.ns.plugin+"-src")),i=(t?t.dataset.buttonTemplate&&(t.dataset.html=t.dataset.buttonTemplate):t={dataset:{}},0);for(n in this.settings={},this.defaultSettings){var s=(t&&t.dataset[n]?t.dataset:this.defaultSettings)[n];"string"==typeof(s="1"===s||"0"===s?"true"==s:s)&&-1<this.classProps.indexOf(n.replace(/Class$/,""))&&(i=1),this.settings[n]=s}if("auto"==this.settings.vendor)for(var n in this.settings.vendor="default",this.settings.fitEditor=0,this.vendors)if("default"!=n&&void 0!==window[this.vendors[n].check]){this.settings.vendor=n;break}var r=["lang","url","vendor","target"],o=("default"==this.settings.vendor&&(this.vendors.default.settings={}),this.vendors[this.settings.vendor]);if(o.settings)for(var n in o.settings)t&&t.dataset.hasOwnProperty(n)||(this.settings[n]=o.settings[n]);else for(var n in o.settings={},this.defaultSettings)-1==r.indexOf(n)&&(o.settings[n]=this.defaultSettings[n]);if("default"!==this.settings.vendor)if(o.settings.hasOwnProperty("fitEditor")||t.dataset.hasOwnProperty("fitEditor")||(this.settings.fitEditor=1),this.settings.fitEditor)i=!o.settings.css;else{r=["autoInsert","observe","observeCache"];for(n in o.settings)-1!=r.indexOf(n)||t.dataset.hasOwnProperty(n)||(this.settings[n]=this.defaultSettings[n])}i?this.settings.css="":(this.settings.css=this.settings.css.replace("%defaultCSS",this.defaultSettings.css),o.settings.extracss&&this.settings.css&&(this.settings.css+=o.settings.extracss),1<(l=this.settings.palette.split(",")).length?this.palette=l:this.palettes.hasOwnProperty(l)||(this.settings.palette="default"),this.palette||(this.palette=(this.settings.fitEditor&&o.palettes&&o.palettes[this.settings.palette]?o:this).palettes[this.settings.palette]));for(var d=this.classProps,a=0;a<d.length;a++){var c=d[a]+"Class";"string"!=typeof this.settings[c]&&(this.settings[c]=this.ns.plugin+"-"+d[a],this.settings.fitEditor&&(this.settings[c]+="--"+this.settings.vendor))}var l=("auto"==this.settings.lang?navigator.language||navigator.userLanguage:this.settings.lang).replace("-","_"),l=(this.settings.langString="Upload images",l in this.l10n?l:l.substring(0,2)in this.l10n?l.substring(0,2):null),l=(l&&(this.settings.langString=this.l10n[l]),document.createElement("a")),u=(l.href=this.settings.url,this.originUrlPattern="^"+(l.protocol+"//"+l.hostname).replace(/\./g,"\\.").replace(/\//g,"\\/")+"$",document.querySelectorAll(this.ns.selDataPluginTrigger+"[data-target]"));if(0<u.length)for(a=0;a<u.length;a++){var g=document.querySelector(u[a].dataset.target);this.setBoundId(u[a],g)}this.settings.observe&&(l=this.settings.observe,this.settings.observeCache&&(l+=":not(["+this.ns.dataPlugin+"])"),this.liveBind(l,"click",function(t){t.setAttribute(e.ns.dataPlugin,1),e.observe()}.bind(this))),this.settings.sibling&&!this.settings.onDemand?this.waitForSibling():"onload"==this.settings.init?"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(t){e.init()},!1):this.init():this.observe()},observe:function(){this.waitForSibling("observe")},waitForSibling:function(t){var e=this.initialized?"insertTrigger":"init";if(this.settings.sibling)var i=document.querySelector(this.settings.sibling+":not(["+this.ns.dataPlugin+"])");else if("observe"==t&&(this[e](),this.triggerCounter))return;i?this[e]():"complete"===document.readyState&&"observe"!==t||setTimeout(("observe"==t?this.observe:this.waitForSibling).bind(this),250)},init:function(){this.insertTrigger();var o=this,a=this.vendors[this.settings.vendor];this.liveBind(this.ns.selDataPluginTrigger,"click",function(t){t=t.getAttribute(o.ns.dataPluginId);o.openPopup(t)}),window.addEventListener("message",function(t){if(new RegExp(o.originUrlPattern,"i").test(t.origin)||void 0!==t.data.id&&void 0!==t.data.message){
    if(t.data.message){t.data.message=t.data.message.replace(/\[[^\]]*\]/g, '');}   
var e,i=t.data.id;if(i&&t.source===o.popups[i].window)if(t.data.requestAction&&o.hasOwnProperty(t.data.requestAction))o[t.data.requestAction](i);else{if("default"!==o.settings.vendor){if(a.hasOwnProperty("useCustomEditor")&&a.useCustomEditor())return void a.editorValue(t.data.message,i);a.hasOwnProperty("getEditor")&&(e=a.getEditor())}if(e=e||document.querySelector("["+o.ns.dataPluginTarget+'="'+i+'"]'))for(var i=null===e.getAttribute("contenteditable")?"value":"innerHTML",s=(e[i]+=o.getNewValue(e,t.data.message),["blur","focus","input","change","paste"]),n=0;n<s.length;n++){var r=new Event(s[n]);e.dispatchEvent(r)}
else if(i=='208909ee-fe1f-4f6f-9491-8c639baed6eb'){setPicExternal(t.data.message);}
else if(i=='208909ee-fe1f-4f6f-9491-8c639baed6ec'){addFilesToMemorandum(t.data.message);}
else alert("Target not found")}}},!1),this.initialized=1}},t=["WoltLab","XF1"],i=0;i<t.length;i++)e.vendors[t[i]]=Object.assign(Object.assign({},e.vendors.redactor2),e.vendors[t[i]]);e.prepare()}();