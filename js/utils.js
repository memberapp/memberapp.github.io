"use strict";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function timeSince(timestamp) {
  let date = new Date(timestamp * 1000);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

var getJSON = function (url) {
  updateStatus("loading " + url);
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    addListeners(xhr);
    xhr.open('get', url, true);
    xhr.responseType = 'json';

    xhr.onerror = function (e) {
      if (XMLHttpRequest.readyState == 4) {
        // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
        reject('Error HTTP: ' + XMLHttpRequest.statusText);
      }
      else if (XMLHttpRequest.readyState == 0) {
        // Network error (i.e. connection refused, access denied due to CORS, etc.)
        reject('Error:' + XMLHttpRequest.statusText);
      }
      else {
        reject('Error.');
      }
    };

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

function addListeners(xhr) {
  xhr.addEventListener('loadstart', handleEvent);
  xhr.addEventListener('load', handleEvent);
  //xhr.addEventListener('loadend', handleEvent);
  xhr.addEventListener('progress', handleEvent);
  //xhr.addEventListener('error', handleEvent);
  xhr.addEventListener('abort', handleEvent);
}

function handleEvent(e) {
  updateStatus(`${e.type}: ${e.loaded} bytes transferred\n`);
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



function updateStatus(message) {
  document.getElementById("status").innerHTML = message;
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function san(input) {
  return sanitizeAlphanumeric(input);
}

function sanitizeAlphanumeric(input) {
  if (input == null) { return ""; }
  return input.replace(/[^A-Za-z0-9]/g, '');
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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function scrollTo(name) {
  var element = document.getElementById(name);
  if (element != undefined) {
    ScrollToResolver(element);
  }
}

function ScrollToResolver(elem) {
  var jump = parseInt(elem.getBoundingClientRect().top * .2);
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


// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
    node.setAttribute('rel', 'noopener noreferrer');
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