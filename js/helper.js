function $(s) {
  q = document.querySelector(s);
  if (q === undefined) {
    console.log("$('"+s+"') is undefined.");
  }
  return q;
}

function $$(s) {
  var elements = document.querySelectorAll(s);
  function each(f) {
    for (var i = 0; i < elements.length; i++) {
      f(i, elements[i]);
    }
  }
  return { 'each': each };
}

function hide(e) {
  e.style.display = 'none';
}

function show(e) {
  e.style.display = 'block';
}

function removeClass(e, className) {
  re = new RegExp(className, 'g');
  e.className = e.className.replace(re, '').replace(/ /g, '');
}

function addClass(e, className) {
  removeClass(e, className);
  e.className = (e.className+' '+className).trim();
}

var helper = function(){
  var self = {};

  /* setCookie creates a cookie with the given name, value and (optional) the
   * given expire date in days */
  self.setCookie = function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(1000*60*60*24*days));
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  /* getCookie returns the value of the cookie with the given key */
  self.getCookie = function(key) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
      while (cookies[i].charAt(0) == ' ') {
        cookies[i] = cookies[i].substring(1, cookies[i].length);
      }
      if (cookies[i].indexOf(key + "=") == 0) {
        return cookies[i].substring(key.length + 1, cookies[i].length);
      }
    }
    return "";
  }


  /* getURLparam returns the value of the URL query with the given key */
  self.getURLparam = function(key) {
    var parser = document.createElement('a');
    parser.href = location.href;
    var queries = parser.search.replace(/^\?/, '').replace(/\/$/, '').split('&');
    for(var i = 0; i < queries.length; i++) {
      var query = queries[i].split('=');
      if (query.length == 2 && query[0] == key) {
        return query[1];
      }
    }

    return "";
  }

  /* updateLanguage updates the language according to the "data-studimat-lang"
   * tags of the HTML elements with the given language array */
  self.updateLanguage = function(language_array) {
    var langElements = document.querySelectorAll('[data-studimat-lang]');
    if (langElements === null) return;

    for(var i = 0; i < langElements.length; i++) {
      var element = langElements[i];
      var lang_val = element.getAttribute('data-studimat-lang');
      if (language_array[lang_val] !== undefined &&
          element.getAttribute("data-studimat-lang-lastval") != language_array[lang_val]) {
        element.innerHTML = language_array[lang_val];
        element.setAttribute("data-studimat-lang-lastval", language_array[lang_val]);
      }
    }
  };

  return self;
}();
