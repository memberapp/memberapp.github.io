function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function timeSince(timestamp) {
  date = new Date(timestamp * 1000);
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
  xhr.addEventListener('loadend', handleEvent);
  xhr.addEventListener('progress', handleEvent);
  xhr.addEventListener('error', handleEvent);
  xhr.addEventListener('abort', handleEvent);
}

function handleEvent(e) {
  updateStatus(`${e.type}: ${e.loaded} bytes transferred\n`);
}

function ds(input) {
  if (input == undefined) { return ""; };
  input = input.replace(/&/g, '&amp;');
  input = input.replace(/</g, '&lt;');
  input = input.replace(/>/g, '&gt;');
  input = input.replace(/"/g, '&quot;');
  input = input.replace(/'/g, '&#x27;');

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

// hack Google Maps to bypass API v3 key (needed since 22 June 2016 http://googlegeodevelopers.blogspot.com.es/2016/06/building-for-scale-updates-to-google.html)
var target = document.head;
var observer = new MutationObserver(function (mutations) {
  for (var i = 0; mutations[i]; ++i) { // notify when script to hack is added in HTML head
    if (mutations[i].addedNodes[0].nodeName == "SCRIPT" && mutations[i].addedNodes[0].src.match(/\/AuthenticationService.Authenticate?/g)) {
      var str = mutations[i].addedNodes[0].src.match(/[?&]callback=.*[&$]/g);
      if (str) {
        if (str[0][str[0].length - 1] == '&') {
          str = str[0].substring(10, str[0].length - 1);
        } else {
          str = str[0].substring(10);
        }
        var split = str.split(".");
        var object = split[0];
        var method = split[1];
        window[object][method] = null; // remove censorship message function _xdc_._jmzdv6 (AJAX callback name "_jmzdv6" differs depending on URL)
        //window[object] = {}; // when we removed the complete object _xdc_, Google Maps tiles did not load when we moved the map with the mouse (no problem with OpenStreetMap)
      }
      observer.disconnect();
    }
  }
});
var config = { attributes: true, childList: true, characterData: true }
observer.observe(target, config);


String.prototype.contains = function (segment) { return this.indexOf(segment) !== -1; };


