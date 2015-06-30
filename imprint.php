<!DOCTYPE html>
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
		<a href="./" id="logo"></a>

		<h1>Impressum</h1>

		<p>AStA der TU Darmstadt<br />
		Hochschulstr. 1<br />
		64289 Darmstadt</p>

		<p>Tel: <a href="tel:+496151162117">+49 (0) 6151 - 16-2117</a><br />
		Fax: +49 (0) 6151 - 16-6026</p>
		<p>Der Allgemeine Studierendenausschuss (AStA) der TU-Darmststadt vertritt die Studierendenschaft der TU-Darmstadt als Körperschaft des öffentlichen Rechts.</p>
		<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: 120593 DE 111 608 636</p>
		<p>Verantwortlich für den Inhalt: <a href="/asta/gewaehlte">Gewählte Referent_innen des AStA der TU-Darmstadt</a></p>
		<p>Technische Realisierung: Webmaster des AStA</p>
		<p>Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber_innen verantwortlich.</p>

		<h2>Technisches</h2>

		<p>Wir nutzen auch das social sharing plugin <a href="https://github.com/heiseonline/shariff">shariff</a> um deine Privatsphäre zu schützen unter der MIT Lizenz</p>
		<p>Das Projekt ist ein Fork von <a href="http://www.mat-o-wahl.de/">Mat-O-Wahl</a>, wobei es kaum noch übereinstimmenden Code gibt. Nicht desto trotz steht das Projekt wie sein Ursprungsprojekt unter der <a href="https://www.gnu.org/licenses/gpl.html">GNU General Public License Version 3</a>.</p>
		<p>Wir haben bei der Entwicklung Wert darauf gelegt, dass keine Daten an externe Webseite gesendet werden. Dein Besuch auf dieser Webseite hinterlässt also nur einen minimalen Fingerabdruck im Internet. Wir speichern nur anonymisierte Aufrufe um zu evaluieren ob das Projekt ein Erfolg ist oder nicht (mittels Piwik).</p>
		<p><a href="https://github.com/AStA-TU-Darmstadt/studi-mat">Studi-Mat auf Github</a></p>

		<div class="shariff" data-theme="standard" data-orientation="vertical" data-lang="de" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>
	</div>

	<script src="vendor/jquery/jquery-1.11.3.js"></script>
	<script src="vendor/angular/angular.min.js"></script>
	<script src="vendor/angular/angular-sanitize.min.js"></script>
	<script src="vendor/shariff/shariff.min.js"></script>
	<script src="js/helper.js"></script>
	<script src="js/app.js"></script>

	<?php
		if(file_exists('_tracking.php'))
			include '_tracking.php';
	?>

</body>
</html>
