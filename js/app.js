/*
 * This file is part of studi-mat.
 *
 * studi-mat is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 or 3 of the License, or
 * (at your option) any later version.

 * studi-mat is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Library General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 */

var studimat = angular.module('studimat', ['ngSanitize']);

studimat.controller('studimatCtrl', ['$scope', '$http', '$sce', function($scope, $http) {
  'use strict';

  $scope.activeContainer = 'welcome';
  //$scope.activeContainer = 'results';
  $scope.activeQuestion = 0;
  $scope.lang = {};           // the current language object loaded from the server
  $scope.data = {};           // the questions, statements, ... in the current
                              // language loaded from the server
  $scope.decisions = {};      // the users decisions (stored independ from $scope.data)
  $scope.doubleWeighted = {}; // the selected questions to be weighted twice

  var wahlomat_language = "de";
  var wahlomat_accepted_languages = ["de", "en"];

  // $scope.vote saves the users decision for the current question and loads the
  // next question
  $scope.vote = function(value) {
    $scope.decisions[$scope.activeQuestion] = value;

    if ($scope.activeQuestion == $scope.data.questions.length-1) {
      // no more questions
      $scope.activeContainer = 'weighting';
    } else {
      // show the next question
      $scope.activeQuestion++;
    }
  };

  // $scope.showPreviousQuestion returns to the previous question or shows the
  // welcome page if the current question is the first
  $scope.showPreviousQuestion = function() {
    if ($scope.activeQuestion > 0) {
      // show the previous question
      $scope.activeQuestion--;
    } else {
      // no more previous questions
      $scope.activeContainer = 'welcome';
    }
  };

  // TODO
  // $scope.calculateResult calculates the score for each party
  $scope.calculateResult = function(){
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
    // questions selected in 'weighting' are counted twice

    // flush the array:
    daten.gewichtung = [];
    $('.checkbox_gewichtung').each(function(a, b){
      if($(this).is(':checked')){
        frage = parseInt($(this).attr('data-gewichtung'));
        daten.gewichtung.push(frage);
      }
    });

    numberOfQuestion = 0;

    $.each(daten.wertung, function(frage, array){
      if(array.length > 0){

        if(array.length > daten.partei.length){
          // get own opinion
          ownscore = array[array.length-1];
          //console.log(ownscore, array, array.length);
          $.each(array, function(a,b){
            currentValue = daten.result[a];

            if(currentValue === undefined || frage == "0"){
              //console.log("reload");
              daten.result[a] = 0;
              currentValue    = 0;
            }

            // gewichtung abchecken , multiplicate?
            if($.inArray(parseInt(frage), daten.gewichtung) != -1){
              mult = 2;
            }else{
              mult = 1;
            }

            // only important if he or she did not skip ownscore == 99
            if(ownscore < 5 ){
              // the score is according to the rules above
              if((ownscore == 1 || ownscore == -1) && ownscore == b){
                currentValue = currentValue + 1 * mult;
              }else if(ownscore === 0 && b === 0){
                currentValue = currentValue + 1 * mult;
              }else if((ownscore == 1 || ownscore == -1) && (b == 1 || b == -1)){
                currentValue = currentValue - 1 * mult;
              }else if ((ownscore == 1 || ownscore == -1) && b === 0){
                currentValue = currentValue - 0.5 * mult;
              }else if(ownscore === 0 && b !== 0){
                currentValue = currentValue - 0.5 * mult;
              }else {
                //console.log("Scheinbar sind nicht alle Regeln integriert", b,ownscore);
              }
            }

            // save result
            daten.result[a] = currentValue;
          });
        }else{
          //console.log("Frage nicht beantwortet", array);
        }
      }
      numberOfQuestion++;
    });

    //console.log("Result: ", daten.result);
    createResult();
  };

  // $scope.getPartyById returns the party with the given id
  $scope.getPartyById = function(id) {
    for (var i = 0; i < $scope.data.parties.length; i++) {
      if ($scope.data.parties[i].id == id) {
        return $scope.data.parties[i];
      }
    }
    return null;
  };


  // $scope.showResultStatements shows the statements for the question with the
  // given id
  $scope.showResultStatements = function(id) {
    if ($('.expandRow' + id).hasClass('showResult')) {
      // the current statements are already shown -> hide all statements
      $('.showResult').removeClass('showResult');
      $('.result_reason').slideUp(150);
    } else {
      // show the current statements and hide all the rest of them
      $('.showResult').removeClass('showResult');
      $('.expandRow' + id).addClass('showResult');
      $('.result_reason').slideUp(150);
      $('.result_reason' + id).slideDown(150);
    }
  };

  // getLanguageSelection determines the language selected by the user
  var getLanguageSelection = function() {
    var lang_url = helper.getURLparam("lang");
    var lang_cookie = helper.getCookie("lang");

    if (lang_cookie !== '' && $.inArray(lang_cookie, wahlomat_accepted_languages) != -1) {
      // return the language stored in the cookie
      return lang_cookie;
    } else if (lang_url !== '' && $.inArray(lang_url, wahlomat_accepted_languages) != -1) {
      // return the language from the URL and set the cookie
      helper.setCookie("lang", lang_url);
      return lang_url;
    } else {
      // return the default language
      return wahlomat_accepted_languages[0];
    }
  };

  // fetchLanguage fetchs the given language and triggers a GUI update
  var fetchLanguage = function(lang) {
    $http({
      url: "data/lang_"+lang+".json",
      responseType: "json"
    }).success(function(data){
      $scope.lang = data;
    }).error(function(){
      // TODO
    });
  };
  fetchLanguage(getLanguageSelection());

  // fetchData fetchs the data in the given language and triggers a GUI update
  var fetchData = function(lang) {
    $http({
      url: "data/data_"+lang+".json",
      responseType: "json"
    }).success(function(data){
      $scope.data = data;
    }).error(function(){
      // TODO
    });
  };
  fetchData(getLanguageSelection());

  // $scope.toggleLanguage toggles the current language and triggers a GUI update
  $scope.toggleLanguage = function(){
    if ($.isEmptyObject($scope.decisions) || confirm($scope.lang.switchLanguage)) {
      var new_lang = wahlomat_accepted_languages[($.inArray(getLanguageSelection(), wahlomat_accepted_languages) + 1) % wahlomat_accepted_languages.length];
      helper.setCookie("lang", new_lang);
      fetchLanguage(new_lang);
      fetchData(new_lang);
    }
  };

  // == Event handlers ==
  $('#logo').click(function(){
    if(!$.isEmptyObject($scope.decisions)){
      return (confirm($scope.lang.logoClick));
    }else{
      return true;
    }
  });
}]);
