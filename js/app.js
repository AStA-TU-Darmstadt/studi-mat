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
var studimat = function() {
  var self = {};
  self.currentContainer = 0;
  self.currentQuestion = 0;
  self.wahlomat_started = false;
  self.wahlomat_language = "";
  self.data = null; // content of data/*.json
  self.votes = []; // e.g. ["+", "-", "0", "skip", ...]
  self.weights = []; // e.g. [1, 1, 2, 1, ...]
  self.scores = {}; // e.g. {party1: 13, party2: 11}
  self.maxScore = 0; // used to calculate percentual values; increased by 2 for
                     // each question, increased by 4 for each weighted question

  var wahlomat_accepted_languages = ["de", "en"];
  var OPINION_MAP = {
    "-": -1,
    "0": 0,
    "+": 1
  };
  var OPINION_CLASS_MAP = {
    '-': 'w_against',
    '0': 'w_neutral',
    '+': 'w_pro',
    'skip': 'w_skip'
  };

  /*
    get the party with the given short name `shortName
  */
  function getPartyByShortname(shortName) {
    for (var i = 0; i < self.data.parties.length; i++) {
      if(self.data.parties[i].shortName == shortName) {
        return self.data.parties[i];
      }
    }
  }


  /*
   * show the question with id `id`
  */
  function showQuestion(id){
    self.currentQuestion = id;

    // update the "jumpto" dots
    $$('#jumpto a').each(function(i, elem) {
      if (i == id) {
        addClass(elem, 'active');
        addClass(elem, 'shown');
      } else {
        removeClass(elem, 'active');
      }
    });

    // update question box
    if(id < self.data.questions.length){
      $('.question .title').innerHTML = self.data.questions[id].title;
      $('.question .description').innerHTML = self.data.questions[id].description;
      $('.question .question-number').innerHTML = id+1;
      $('.question .question-count').innerHTML = self.data.questions.length;

      // blur focus:
      $("a.vote").blur();

    } else {
      showContainer(3); // jumps to the next container
    }
    // always go to the top:
    window.scrollTo(0, 0);
  }

  function showNextQuestion() {
    showQuestion(self.currentQuestion + 1);
  }


  /*
   * creates a dialog which allows selecting questions that are especially
   * important to the user
  */
  function updateWeightingTable() {
    $('#weighting table').innerHTML = "";
    for(var i = 0; i < self.data.questions.length; i++) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var input = document.createElement('input');
      input.id = 'checkbox_weighting' + i;
      input.className = 'checkbox_weighting';
      input.type = 'checkbox';
      input.setAttribute('data-weighting', i);
      td1.appendChild(input);

      var td2 = document.createElement('td');
      var label = document.createElement('label');
      label.setAttribute('for', input.id);

      // TODO: improve visual representation
      label.innerText = self.data.questions[i].title + ' - ' + self.data.questions[i].description;
      td2.appendChild(label);

      tr.appendChild(td1);
      tr.appendChild(td2);
      $('#weighting table').appendChild(tr);
    }
  }


  /*
   * calculate the score for each party
  */
  function calculateScores(){
    // we use the same model as the Wahl-O-Mat by the German 'Bundeszentrale für
    // politische Bildung (bpb)' to calculate the conformity of the user to the
    // different parties:
    // http://www.bpb.de/system/files/dokument_pdf/Rechenmodell%20des%20Wahl-O-Mat.pdf

    self.weights = [];
    $$('.checkbox_weighting').each(function(i, elem){
      self.weights.push(1 + elem.checked);
    });

    // initialize scores for all parties
    self.scores = {};
    for(var i = 0; i < self.data.parties.length; i++) {
      self.scores[self.data.parties[i].shortName] = 0;
    }

    // loop through questions and add scores for each party
    self.maxScore = 0;
    for(i = 0; i < self.data.questions.length; i++) {
      if (self.votes[i] != 'skip') {
        self.maxScore += 2 * self.weights[i];
        for(var party in self.data.questions[i].statements) {
          var party_opinion = self.data.questions[i].statements[party][0];
          var score = 2 - Math.abs(OPINION_MAP[self.votes[i]] - OPINION_MAP[party_opinion]);
          self.scores[party] += score * self.weights[i];
        }
      }
    }
  }

  function showResult(){
    $('#result_short').innerHTML = '';

    var sortedShortNames = [];
    for (var p in self.scores) {
      sortedShortNames.push(p);
    }
    sortedShortNames.sort(function(a, b) {
      return self.scores[b] - self.scores[a];
    });

    for(i = 0; i < sortedShortNames.length; i++) { // TODO: sort by score
      var score = self.scores[sortedShortNames[i]] / self.maxScore;
      var percentage = Math.round(score * 100 * 100) / 100;

      // create bars for the bar chart
      var result = document.createElement('div');
      result.className = 'result_new_partie';
      var bar_chart_name = document.createElement('div');
      bar_chart_name.className = 'barchart_name';
      bar_chart_name.innerText = getPartyByShortname(sortedShortNames[i]).longName;
      var bar_chart = document.createElement('div');
      bar_chart.className = 'barchart';
      bar_chart.style.width = percentage+'%';
      bar_chart.innerText = percentage+' %';
      result.appendChild(bar_chart_name);
      result.appendChild(bar_chart);
      $('#result_short').append(result);
    }

    // create the table with the statements of all parties
    $('#result_long table').innerHTML = '';
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('th'));
    tr.appendChild(document.createElement('th'));
    var th_you = document.createElement('th');
    th_you.innerText = "Du";
    for (var i in sortedShortNames) {
      var th = document.createElement('th');
      th.innerText = sortedShortNames[i];
      tr.appendChild(th);
    }
    $('#result_long table').appendChild(tr);

    // add two rows for each question
    for(i = 0; i < self.data.questions.length; i++) {
      var question = self.data.questions[i];

      var expandRow = document.createElement('tr');
      expandRow.className = 'expandRow' + (self.weights[i] > 1 ? ' double':'');
      expandRow.setAttribute('data-question', i);

      var td = document.createElement('td');
      td.innerText = question.description;
      expandRow.appendChild(td);

      td = document.createElement('td');
      td.className = 'ownresult';
      var div = document.createElement('div');
      div.className = OPINION_CLASS_MAP[self.votes[i]];
      td.appendChild(div);
      expandRow.appendChild(td);

      // add the icons to the row
      for (var j in sortedShortNames) {
        td = document.createElement('td');
        td.className = 'center';
        div = document.createElement('div');
        div.className = OPINION_CLASS_MAP[question.statements[sortedShortNames[j]][0]];
        td.appendChild(div);
        expandRow.appendChild(td);
      }

      $('#result_long table').appendChild(expandRow);

      // add the row containing the statements of all parties for this question
      var statementsRow = document.createElement('tr');
      statementsRow.className = 'resultReason';
      statementsRow.setAttribute('data-reason', i);
      statementsRow.colSpan = sortedShortNames.length + 2;

      td = document.createElement('td');
      reasonDiv = document.createElement('div');
      reasonDiv.className = 'reasonDiv';

      for (var k in sortedShortNames) {
        var partyHeading = document.createElement('h3');
        var longName = getPartyByShortname(sortedShortNames[k]).longName;
        partyHeading.innerText = longName + ' (' + sortedShortNames[k] + ')';
        reasonDiv.appendChild(partyHeading);
        var statement = document.createElement('p');
        statement.innerText = question.statements[sortedShortNames[k]][1];
        reasonDiv.appendChild(statement);
      }

      td.appendChild(reasonDiv);
      statementsRow.appendChild(td);
      $('#result_long table').appendChild(statementsRow);
    }

    showContainer(4);
    // always go to the top:
    window.scrollTo(0, 0);

    // add event listeners
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
  }


  function showContainer(num){
    self.currentContainer = num;
    if(num != 1) {
      $$('.container').each(function(i, elem) { hide(elem); });
      show($('.container_'+num));
    } else {
      // enable back for each question
      if(self.currentQuestion > 0) {
        showQuestion(self.currentQuestion - 1);
      } else {
        $$('.container').each(function(i, elem) { hide(elem); });
        show($('.container_'+num));
      }
    }

    // always go to the top:
    window.scrollTo(0, 0);
  }


  function toggleLanguage(){
    self.wahlomat_language = wahlomat_accepted_languages[1 - wahlomat_accepted_languages.indexOf(self.wahlomat_language)];
    // update all elements which have a data-studimat-lang attribute
    helper.updateLanguage(lang[self.wahlomat_language]);

    fetchQuestions(self.wahlomat_language, function(data) {
      self.data = data;

      // update the small jumptp dots
      updateJumptoDots();

      // update weighting table
      updateWeightingTable();

      if (self.currentContainer == 2) {
        showQuestion(self.currentQuestion);
      } else if (self.currentContainer == 4) {
        showResult();
      }
    });
  }


  function fetchQuestions(lang, callback) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
     alert('Giving up :( Cannot create an XMLHTTP instance');
     return false;
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {

          // TODO: error handling
          var data = JSON.parse(httpRequest.responseText);
          callback(data);
        } else {
          alert("Could not fetch questions from the server. Sorry. :(");
        }
      }
    };

    // TODO: this should be configurable
    httpRequest.open('GET', "data/demo_"+self.wahlomat_language+".json");
    httpRequest.send();
  }

  // this method will return a closure that stores i and calls showQuestion
  // when invoked
  var showQuestionClosure = function(i){
    return function() {
      showQuestion(i);
    };
  };

  /*
   * create the small dots that link to the questions
   */
  function updateJumptoDots() {
    $('#jumpto').innerHTML = '';
    for (var i = 0; i < self.data.questions.length; i++) {
      var a = document.createElement('a');
      a.href = '#';
      a.title = (parseInt(i) + 1);
      var span = document.createElement('span');
      span.className = 'sr-hidden';
      span.innerText = parseInt(i) + 1;
      a.appendChild(span);
      a.addEventListener('click', showQuestionClosure(i));
      $('#jumpto').appendChild(a);
    }
  }


  window.onload = function() {
    var navigator_lang = navigator.language.split('-')[0];

    if (wahlomat_accepted_languages.indexOf(navigator_lang) != -1) {
      console.log("navigator languange:", navigator_lang);
      self.wahlomat_language = navigator_lang;
    } else {
      self.wahlomat_language = wahlomat_accepted_languages[0];
    }

    $$('.container .containerFooter').each(function(i, elem){
      if(i !== 0){
        var btn = document.createElement('div');
        btn.className = "back button";
        btn.id = "showContainer"+i;
        btn.setAttribute('data-studimat-lang', 'back');
        elem.parentNode.insertBefore(btn, elem);
        $('#showContainer' + i).onclick = function(){
          showContainer(i);
        };
      }
    });

    // update all elements which have a data-studimat-lang attribute
    helper.updateLanguage(lang[self.wahlomat_language]);

    fetchQuestions(self.wahlomat_language, function(data) {
      self.data = data;

      // update the small jumptp dots
      updateJumptoDots();

      // update weighting table
      updateWeightingTable();
    });

    showContainer(1);

    $('#startmatowahl').onclick = function() {
      wahlomat_started = true;
      showContainer(2);
      showQuestion(0);
    };

    // add click events for vote buttons
    $$('.voting .vote').each(function(i, elem) {
      elem.addEventListener('click', function() {
        self.votes[self.currentQuestion] = elem.getAttribute("data-vote");
        showQuestion(self.currentQuestion + 1);
        return false;
      });
    });

    $('#zumresult').onclick = function() {
      calculateScores();
      showResult();
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
        return (confirm(lang[self.wahlomat_language].logoClick));
      } else {
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
