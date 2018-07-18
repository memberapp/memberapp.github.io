function timeSince(timestamp) {
    date=new Date(timestamp*1000);
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
  
var getJSON = function(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
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

  function ds(input) {
    if (input==undefined){return "";};
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    input = input.replace(/"/g, '&quot;');
    input = input.replace(/'/g, '&#x27;');
    
    return input;
}

function updateStatus(message){
  document.getElementById("status").innerHTML = message;
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function sanitizeAlphanumeric(input){
  return input.replace(/[^A-Za-z0-9]/g, '');
}

function unicodeEscape(str) {
  if(str==undefined)return "";
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


String.prototype.contains = function (segment) { return this.indexOf(segment) !== -1; };
