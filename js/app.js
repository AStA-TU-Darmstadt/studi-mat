/*

This file is part of studi-mat.

studi-mat is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 or 3 of the License, or
(at your option) any later version.

studi-mat is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Library General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA

*/

function hide(e) {
  e.style.display = 'none';
}

function show(e) {
  e.style.display = 'block';
}

var studimat = function() {
  var self = {};
  self.currentContainer = 0;
  self.currentQuestion = 0;
  self.wahlomat_started = false;
  self.wahlomat_language = "";
  var wahlomat_accepted_languages = ["de", "en"];

  // global variables to be accessed everywhere
  // some variables are in german, comments should be in english
  var daten        = new Object();
  daten.partei     = new Array();
  daten.parteiKurz = new Array();
  daten.kurzfragen = new Array();
  daten.frage      = new Array();
  daten.wertung    = new Object();
  daten.gruende    = new Object();
  daten.gewichtung = new Array();
  daten.result     = new Array();

  // the object "daten" has the following structure
  // can be seen in the console of any browser (F12)
  /*
  var daten = {
    parteien     = ["bla bla", "andere partei", ...],
    parteienkurz = [abc, dcf, ...]
    fragen       = ["erste Frage", "zweite Frage", ...],
    kurzfragen   = [kurzfrage1, kurzfrage2, ...],
    kurzfrage1   = [Meinungabc, Meinungdcf, ... ... ... , meinungclient],
    kurzfrage2   = ...
    kurzfrage3   = ...
    ...
    kurzfrageN   = ...
    fargenlang   = [...,...,...]
    gewichtung   = [gewichtung1, gewichtung2,...]

  }
  */

  /*
   * This function turns the data from the json
   * into our data-structure "daten"
  */
  function readData(jsondata) {
    numberofquestion = -1; // at wich question are we looking
    numberofreason   = -1; // helper to count the reasons of the partys

    // loop trough data (supplied as json "jsondata")
    for(var a = 0; a < jsondata.length; a++) {
      var b = jsondata[a];

      if(b != 0){ // fehler im json converter erzeugt eine nullzeile, die soll ignoriert werden
      // second level loop
      for(var c = 0; c < b.length; c++) {
        var d = b[c];
        // a = line of the table
        // b = content of the line (array)
        // c = column of the table
        // d = content of the table cell defined by a and c

        // if first line, then we save the parties
        if(a == 0){

          // if its an even number greater then 1 it is a short version of the partys name (eg. SPD etc.)
          if (c % 2 != 0 && c > 1) {
            daten.parteiKurz.push(d);
          }else if(c > 1){
          // otherwise it is the long description of the party (eg. Sozialdemokratische Partei ...)
            daten.partei.push(d);
          }
        }
        // lines > 0 --> data
        if(a > 0){
          // first column is the question in short as a descriptor
          if(c == 0){
            daten.kurzfragen.push(d);
            // make an own array for each question to save value (wertung) and the reasons (gruende):
            daten.wertung[(parseInt(a)-1)] = new Array();
            daten.gruende[(parseInt(a)-1)] = new Array();
          }else if(c == 1){
            // it is a long question
            daten.frage.push(d.replace(/\n/, '</p><p>'));
          }else if(c > 1 && c % 2 != 0){
            // second column or bigger and no reason but a number
            // but for which partie?
            // the partienumber is (n-first 2 columns)/2 -1
            partienumber = (c-1)/2 -1;

            // the questionnumber is up and rising:
            if(partienumber == 0){
              numberofquestion++;
            }

            fragenname = daten.kurzfragen[numberofquestion];
            // save the value of this question/party
            daten.wertung[numberofquestion].push(d);


          }else if(c > 1 && c % 2 == 0){
            partienumber = (c-1)/2 - 0.5;
            // the reason is up and rising:
            if(partienumber == 0){
              numberofreason++;
            }
            // save the reason
            daten.gruende[numberofreason].push(d)
          }
        }
      }
      }
    }
  }


  /*
   * This function takes an array of questions and prepares the DOM
  */
  function initHTML(questions) {
    // create the small dots that link to the questions
    for (var i = 0; i < questions.length; i++) {
      var a = document.createElement('a');
      a.href = '#';
      a.title = 'Frage '+(parseInt(i) + 1);
      a.innerText = parseInt(i) + 1;
      a.addEventListener('click', showNextQuestion);
      $('#jumpto').appendChild(a);
    }

    // js enable clicking on the voting elements
    $$('.voting .vote').each(function(i, elem) {
      elem.onclick = function() {
        voting = elem.getAttribute("data-vote");

        // the actual voting part, as in "save the vote"
        numberOfParties = daten.partei.length;
        daten.wertung[currentQuestion][numberOfParties] = voting;

        // also show the next question or whatever
        showQuestion(parseInt(currentQuestion)+1);

        return false;
      };
    });

    helper.updateLanguage(lang[self.wahlomat_language]);
  }



  /*
   * This function can show you a question if called
  */
  function showQuestion(id){
    currentQuestion = id;

    if(id < daten.frage.length){
      show($('#questioncontainer'));

      $('.question .title').innerHTML = daten.kurzfragen[id];
      $('.question .question-number').innerHTML = id+1;
      $('.question .question-count').innerHTML = daten.kurzfragen.length;
      $('.question .description').innerHTML = daten.frage[id];


      // blur focus:
      $("a.vote").blur();

    }else{
      // ask if some questions are more important
      gewichtung(); // jumps to the next container
    }
    // always go to the top:
    window.scrollTo(0, 0);
  }

  function showNextQuestion() {
    showQuestion(self.currentQuestion + 1);
  }


  /*
   * creates an container which allows selecting questions
   * that are more important to the user
  */
  function gewichtung() {
    $('#gewichtung table').innerHTML = "";
    for(var i = 0; i < daten.frage.length; i++) {
      question = trimQuestion(daten.frage[i]);

      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var input = document.createElement('input');
      input.id = 'checkbox_gewichtung' + i;
      input.className = 'checkbox_gewichtung';
      input.type = 'checkbox';
      input.setAttribute('data-gewichtung', i);
      td1.appendChild(input);

      var td2 = document.createElement('td');
      var label = document.createElement('label');
      label.setAttribute('for', input.id);
      label.innerText = question;
      td2.appendChild(label);

      tr.appendChild(td1);
      tr.appendChild(td2);
      $('#gewichtung table').appendChild(tr);
    }
    // show this container
    hide($('.container_2'));
    show($('.container_3'));
    // always go to the top:
    window.scrollTo(0, 0);

    helper.updateLanguage(lang[self.wahlomat_language]);
  }

  // function that trims the question if there are breaks or </p> etc
  function trimQuestion(q){
    // trim question to its first sentence:
    pIndex = q.indexOf("</p");
    if(pIndex !== -1){
      q = q.substr(0,  pIndex);
    }
    brIndex = q.indexOf("<br");
    if(brIndex !== -1){
      q = q.substr(0,  brIndex);
    }
    return q
  }


  function calculateResult(){
    // here we calculate the result
    // for each party we calculate a score based on the following rules
    //
    // Party    |   students  |  score
    //   1              1          +1
    //  -1             -1          +1
    //   0              0          +1
    //   1             -1          -1
    //  -1              1          -1
    //   0             1/-1        -0.5
    //  1/-1            0          -0.5
    //
    // a question which was checked in the "gewichtung" we count twice as much

    daten.gewichtung = [];
    $$('.checkbox_gewichtung').each(function(i, elem){
      if(elem.checked){
        frage = parseInt(elem.getAttribute('data-gewichtung'));
        daten.gewichtung.push(frage);
      }
    });

    numberOfQuestion = 0;
    for (var i in daten.wertung) {
      if (daten.wertung.hasOwnProperty(i)) {
        var array = daten.wertung[i];
        if(array.length > daten.partei.length){
          // get own opinion
          ownscore = array[array.length-1];
          for(var a = 0; a < array.length; a++) {
            var b = array[a];
            currentValue = daten.result[a];

            if(currentValue === undefined || i === 0){
              daten.result[a] = 0;
              currentValue    = 0;
            }

            // gewichtung abchecken , multiplicate?
            if(daten.gewichtung.indexOf(parseInt(frage)) != -1){
              mult = 2;
            }else{
              mult = 1;
            }

            // only important if he or she did not skip ownscore == 99
            if(ownscore < 5 ){
              // the score is according to the rules above
              if((ownscore == 1 || ownscore == -1) && ownscore == b){
                currentValue = currentValue + 1 * mult;
              }else if(ownscore == 0 && b == 0){
                currentValue = currentValue + 1 * mult;
              }else if((ownscore == 1 || ownscore == -1) && (b == 1 || b == -1)){
                currentValue = currentValue - 1 * mult;
              }else if ((ownscore == 1 || ownscore == -1) && b == 0){
                currentValue = currentValue - 0.5 * mult;
              }else if(ownscore == 0 && b != 0){
                currentValue = currentValue - 0.5 * mult;
              }else {
                //console.log("Scheinbar sind nicht alle Regeln integriert", b,ownscore);
              }
            }

            // save result
            daten.result[a] = currentValue;
          }
        } else {
          console.log("Frage nicht beantwortet", array);
        }
        numberOfQuestion++;
      }
    }

    console.log("Result: ", daten.result);
    createResult();
  }


  function createResult() {
    // create associative array we can sort:
    sortable = new Array();
    resorted = new Object();
    for(var i = 0; i < daten.parteiKurz.length; i++) {
      sortable[daten.parteiKurz[i]] = daten.result[i];
    }

    // we need an array orderd from high to low...
    // thats what this code does...
    var tuples = [];
    for (var key in sortable) tuples.push([key, sortable[key]]);

    tuples.sort(function(a, b) { return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0 });

    var length = tuples.length;

    while (length--) {
      resorted[tuples[length][0]] = tuples[length][1];
    }


    // now we should have an ordered result:
    $('#result_short').innerHTML = '';

    for (var party in resorted) {
      if (resorted.hasOwnProperty(party)) {
        b = resorted[party];
        // prozentual value:
        doubles = daten.gewichtung.length
        possiblePoint = 2*daten.frage.length + 2*doubles // daten.frage.length ist quasi die mitte, also 0 punkte
        reachedPoints = daten.frage.length+doubles + b;
        prozentual = Math.round(parseFloat(reachedPoints)/parseFloat(possiblePoint) * 10000)/100

        langerParteiname = daten.partei[daten.parteiKurz.indexOf(party)];

        nameForBarChart  = langerParteiname
        /* // if you want to restrict the name length, I dont
        if (langerParteiname.length < 20){
          nameForBarChart  = i
        }*/

        var result = document.createElement('div');
        result.className = 'result_new_partie';
        var bar_chart_name = document.createElement('div');
        bar_chart_name.className = 'barchart_name';
        bar_chart_name.innerText = nameForBarChart;
        var bar_chart = document.createElement('div');
        bar_chart.className = 'barchart';
        bar_chart.style.width = prozentual+'%';
        bar_chart.innerText = prozentual+'%';
        result.appendChild(bar_chart_name);
        result.appendChild(bar_chart);
        $('#result_short').append(result);
      }
    }

    $('#result_long table').innerHTML = '';
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('th'));
    tr.appendChild(document.createElement('th'));
    var th_you = document.createElement('th');
    th_you.innerText = "Du";
    colspan = 0;
    for (var j in resorted) {
      if (resorted.hasOwnProperty(j)) {
        var th = document.createElement('th');
        th.innerText = j;
        tr.appendChild(th);
        colspan++;
      }
    }
    $('#result_long table').appendChild(tr);

    colspan = colspan + 2;
    alternatingClass = "alternate-1"; // for alternating the rows gray and not gray

    for(var index = 0; index < daten.frage.length; index++) {
      var frage = daten.frage[index];

      eigeneMeinung = daten.wertung[index][daten.wertung[index].length-1];
      kurzfrage     = daten.kurzfragen[index];

      doubleclass=""
      if (daten.gewichtung.indexOf(index) >= 0){
        doubleclass="double"
      }
      frage = trimQuestion(frage);

      id=kurzfrage.split()
      id = id[0] + index

      reasonDiv = '<div id="reasonDiv'+id+'" class="reasonDiv">';
      listP = '';

      for (var k in resorted) {
        if (resorted.hasOwnProperty(k)) {
          kurz = k;
          b = resorted[k];
          i = daten.parteiKurz.indexOf(kurz)

          wertung    = daten.wertung[index][i];
          parteikurz = daten.parteiKurz[i];
          grund      = daten.gruende[index][i];
          partei     = daten.partei[i];

          switch(wertung) {
            case "1":
              div ='<div class="w_pro"></div>';
              break;
            case "-1":
              div ='<div class="w_against"></div>';
              break;
            case "0":
              div ='<div class="w_equal"></div>';
              break;
              default:
            div ='<div class="w_skip"></div>'
          }
          listP = listP + '<td class="center">' + div + '</td>';

          reasonDiv = reasonDiv + '<h3>'+partei+' ('+parteikurz+')</h3><p>' + grund + '</p>';
        }
      }
      reasonDiv = reasonDiv + "</div>";

      switch(eigeneMeinung) {
        case "1":
          div ='<div class="w_pro"></div>';
          break;
        case "-1":
          div ='<div class="w_against"></div>';
          break;
        case "0":
          div ='<div class="w_equal"></div>';
          break;
          default:
        div ='<div class="w_skip"></div>'
      }

      if(alternatingClass == "alternate-1") {
        alternatingClass = "alternate-2";
      }else{
        alternatingClass = "alternate-1";
      }

      var dummyDiv1 = document.createElement('tbody');
      dummyDiv1.innerHTML = '<tr class="expandRow ' + alternatingClass + ' ' + doubleclass +'" data-question="'+id+'"><td>' +frage+'</td><td class="ownresult">'+div+'</td>'+listP+'</tr>';
      $('#result_long table').appendChild(dummyDiv1.childNodes[0]);
      var dummyDiv2 = document.createElement('tbody');
      dummyDiv2.innerHTML = '<tr data-reason="'+id+'" class="resultReason"><td colspan="'+colspan+'">'+reasonDiv+'</td></tr>';
      $('#result_long table').appendChild(dummyDiv2.childNodes[0]);
    }


    hide($('.container_3'));
    show($('.container_4'));
    // always go to the top:
    window.scrollTo(0, 0);

    // click on result
    $$('tr.expandRow').each(function(i1, elem) {
      elem.addEventListener('click', function(){
        var id = elem.getAttribute('data-question');

        // remove all classes and highlight current:
        $$('tr.expandRow').each(function(i2, elem2) {
          if(id == elem2.getAttribute('data-question') &&
             elem2.className.search('showResult') == -1) {
              elem2.className += ' showResult';
              return;
          }
          elem2.className = elem2.className.replace(' showResult', '');
        });
        $$('tr.resultReason').each(function(i2, elem2) {
          if(id == elem2.getAttribute('data-reason') &&
             elem2.className.search('showResult') == -1) {
              elem2.className += ' showResult';
              return;
          }
          elem2.className = elem2.className.replace(' showResult', '');
        });
      });
    });

    helper.updateLanguage(lang[self.wahlomat_language]);
  }


  function showContainer(num){
    if(num != 1) {
      //console.log("Zeige Container", num);
      hide($('.container'));
      show($('.container_'+num));
    } else {
      // enable back for each question
      if(self.currentQuestion > 0) {
        showQuestion(self.currentQuestion - 1);
      } else {
        hide($('.container'));
        show($('.container_'+num));
      }
    }

    // always go to the top:
    window.scrollTo(0, 0);
  }


  function wahlomat(){
    // load the data
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
     alert('Giving up :( Cannot create an XMLHTTP instance');
     return false;
    }
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          // convert csv data to json
          var parse_result = Papa.parse(httpRequest.responseText);

          // move json data to global variable "daten"
          readData(parse_result.data);

          // data is prepared, show it
          initHTML(daten.frage); // TODO: rename daten.frage to data.questions

          hide($('.container'));
          show($('.container_1'));
          $$('.container .containerFooter').each(function(i, elem){
            if(i !== 0){
              var btn = document.createElement('div');
              btn.className = "back button";
              btn.id = "showContainer"+i;
              btn.setAttribute('data-studimat-lang', 'back');
              elem.parentNode.insertBefore(btn, elem);
              $('#showContainer' + i).onclick = function(){ showContainer(i); };
              helper.updateLanguage(lang[self.wahlomat_language]);
            }
          });
        } else {
          alert("Could not fetch questions from the server. Sorry. :(");
        }
      }
    }
    httpRequest.open('GET', "data/daten_"+self.wahlomat_language+".csv");
    httpRequest.send();
  }


  function toggleLanguage(){
    console.log('hi');
    if (!self.wahlomat_started || confirm(lang[self.wahlomat_language]['switchLanguage'])) {
      // change the language
      self.wahlomat_language = wahlomat_accepted_languages[1 - wahlomat_accepted_languages.indexOf(self.wahlomat_language)];
      location.href = "?lang="+self.wahlomat_language;
    }
  }


  window.onload = function() {
    // Determine the current language
    var lang_url = helper.getURLparam("lang");
    var lang_cookie = helper.getCookie("lang");

    if (lang_url != "" && wahlomat_accepted_languages.indexOf(lang_url) != -1) {
      console.log("setting language (URL) to", lang_url);
      self.wahlomat_language = lang_url;
      helper.setCookie("lang", lang_url);
    } else if (lang_cookie != "" && wahlomat_accepted_languages.indexOf(lang_cookie) != -1) {
      console.log("setting language (cookie) to", lang_cookie);
      self.wahlomat_language = lang_cookie;
    } else {
      self.wahlomat_language = wahlomat_accepted_languages[0];
    }

    // update all elements which have a data-studimat-lang attribute
    helper.updateLanguage(lang[self.wahlomat_language]);

    // start the "wahlomat"
    wahlomat();

    $('#startmatowahl').onclick = function() {
      hide($('.container_1'));
      wahlomat_started = true;
      showQuestion(0);
    };

    $('#zumresult').onclick = function() {
      calculateResult();
    };

    $('#language').onclick = function() {
      toggleLanguage();
    };


    // callback for clicking on the logo
    // it will remove all answers givven to this point
    // check the current status though, as it does only matter after clicking
    // start
    $('#logo').onclick = function() {
      if(wahlomat_started){
        return (confirm(lang[self.wahlomat_language]['logoClick']));
      }else{
        return true;
      }
    };

    // social media
    var a = document.createElement('a');
    a.href = './';
    var own_url = a.href;
    var FACEBOOK_BASE_URL = 'https://www.facebook.com/sharer/sharer.php?u=';
    var TWITTER_BASE_URL = 'https://twitter.com/intent/tweet?text=Studi-Mat%20-%20AStA%20der%20TU%20Darmstadt&url=';
    // TODO: Tweet-Text ändern
    $('.social-media a.facebook').href = FACEBOOK_BASE_URL + encodeURIComponent(own_url);
    $('.social-media a.twitter').href = TWITTER_BASE_URL + encodeURIComponent(own_url);
  };
}();
