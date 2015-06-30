<!DOCTYPE html>
<!--
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
-->
<html ng-app="studimat" ng-controller="studimatCtrl" class="ng-cloak">
  <head>
    <title>{{lang.title}}</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<link rel="shortcut icon" href="img/favicon.png">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="vendor/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="vendor/shariff/shariff.min.css">
  </head>
  <body>
    <div class="main-wrapper">
      <a id="logo" href="./" title="zur Startseite"></a>
      <a id="language" href="#" ng-click="toggleLanguage()">{{lang.switchLangShort}}</a>

      <h1>{{lang.header}}</h1>

      <div class="container" ng-show="activeContainer == 'welcome'">
        <span ng-bind-html="lang.einleitung"></span>

        <div class="containerFooter">
          <div id="startmatowahl" class="button" ng-click="activeContainer = 'questions'">{{lang.losgehts}}</div>
        </div>
      </div>

      <div class="container" ng-show="activeContainer == 'questions'">
        <div class="question">
          <span class="question-counter">{{activeQuestion + 1}} {{lang.of}} {{data.questions.length}}</span>
          <p class="question-short">{{data.questions[activeQuestion].short}}</p>
          <p class="question-long">{{data.questions[activeQuestion].long}}</p>
        </div>
        <div class="voting">
          <a href="#" class="vote vote-yes" ng-click="vote(1)">Ja</a>
          <a href="#" class="vote vote-abstain" ng-click="vote(0)">Enthaltung</a>
          <a href="#" class="vote vote-no" ng-click="vote(-1)">Nein</a>
          <a href="#" class="vote vote-skip" ng-click="vote(99)">Überspringen</a>
        </div>
        <div id="jumpto">
          <a href="#" title="Frage 1" class="jumpto">1</a>
        </div>
        <div class="containerFooter">
          <div class="back button" ng-click="showPreviousQuestion()">{{lang.back}}</div>
        </div>
      </div>

      <div class="container" ng-show="activeContainer == 'weighting'">
        <h2>{{lang.gewichtung}}</h2>
        <span>{{lang.gtxt}}</span>

        <ul class="unstyled">
          <li ng-repeat="question in data.questions"><label><input type="checkbox" ng-model="doubleWeighted[$index]"> {{question.short}}</label></li>
        </ul>

        <div class="button" ng-click="activeContainer = 'results'">{{lang.next}}</div>
        <div class="containerFooter">
          <div class="back button" ng-click="activeContainer = 'questions'">{{lang.back}}</div>
        </div>
      </div>


      <div class="container" ng-show="activeContainer == 'results'">
        <p>{{lang.result}}</p>

        <div id="result_short">
          <div class="result_new_partie" ng-repeat="party in data.parties">
            <div class="barchart_name">{{party.long}}</div>
            <div class="barchart" style="width:30%">30%</div>
          </div>
        </div>

        <table id="result_long">
          <tr>
            <th></th>
            <th>Du</th>
            <th ng-repeat="party in data.parties">{{party.short}}</th>
          </tr>
          <tr class="expandRow expandRow{{$index}}" ng-class="{alternate2: $even, double: doubleWeighted[$index]}" ng-repeat-start="question in data.questions" ng-click="showResultStatements($index)">
            <td>{{question.short}}</td>
            <td class="ownresult"><div class="w_equal"></div></td>
            <td class="center" ng-repeat="party in data.parties"><div class="w_negative"></div></td>
          </tr>
          <tr ng-repeat-end>
            <td colspan="{{data.parties.length + 2}}">
              <div class="result_reason result_reason{{$index}} initiallyhidden">
                <div ng-repeat="answere in question.answeres">
                  <h3>{{getPartyById(answere.partyid).long}}</h3>
                  <p>{{answere.statement}}</p>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div ng-bind-html="lang.furtherinfos"></div>

        <p><strong>CampusGrüne</strong><br>
          <a href="http://www.campusgruene.de">www.campusgrüene.de</a>
        </p>
        <p><strong>Fachwerk</strong><br>
          <a href="http://www.fachwerkhouse.de">www.fachwerkhouse.de</a>
        </p>
        <p><strong>Ing+</strong><br>
          <a href="http://ingplus.net">www.ingplus.net</a>
        </p>
        <p><strong>Jusos und Unabhängige</strong><br>
          <a href="http://jusos-tud.de">www.jusos-tud.de</a>
        </p>
        <p><strong>SDS</strong><br>
          <a href="https://sdstuda.wordpress.com/">sdstuda.wordpress.com</a>
        </p>

        <div class="containerFooter">
          <div class="back button" ng-click="activeContainer = 'weighting'">{{lang.back}}</div>
        </div>
      </div>

      <div class="shariff" data-theme="standard" data-orientation="vertical" data-lang="de" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>

    </div>
    <footer>
      <p id="extras"><a href="imprint.html">Impressum</a></p>
    </footer>

    <script src="vendor/jquery/jquery-1.11.3.js"></script>
    <script src="vendor/angular/angular.min.js"></script>
    <script src="vendor/angular/angular-sanitize.min.js"></script>
    <script src="vendor/shariff/shariff.min.js"></script>
    <script src="js/helper.js"></script>
    <script src="js/app.js"></script>

    <noscript>
      <div class="fullpage">
        <div class="fullpage-notify">
          <p>Ohne Java-Script geht hier leider nichts. Dafür berechnen wir auch alles nur auf deinem Gerät und senden deine Meinungen an keinen Server.</p>
          <p>Deal?</p>
          <p><a href="http://enable-javascript.com/de/" target="_blank">Javascript aktivieren</a></p>
          <hr>
          <p>Without Java-Script there is not much we can do here.</p>
          <p><a href="http://enable-javascript.com/de/" target="_blank">Active Javascript</a></p>
        </div>
      </div>
    </noscript>

    <?php
      if(file_exists('_tracking.php'))
        include '_tracking.php';
    ?>
  </body>
</html>
