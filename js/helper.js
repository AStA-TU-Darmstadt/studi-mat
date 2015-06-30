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
  };

  /* getCookie returns the value of the cookie with the given key */
  self.getCookie = function(key) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
      while (cookies[i].charAt(0) == ' ') {
        cookies[i] = cookies[i].substring(1, cookies[i].length);
      }
      if (cookies[i].indexOf(key + "=") === 0) {
        return cookies[i].substring(key.length + 1, cookies[i].length);
      }
    }
    return "";
  };


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
  };

  return self;
}();
