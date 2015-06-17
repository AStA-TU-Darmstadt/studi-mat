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
<!DOCTYPE html>
<html>
	<head>
		<title>Studi-Mat - AStA der TU Darmstadt</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<meta name="description" content="Studi-Mat" />
		<meta name="keywords" content="studi-mat, AStA, TU Darmstadt, Hochschulwahlen"/>
		<meta name="language" content="de" />
		<meta name="Content-Language" content="de" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<link rel="stylesheet" type="text/css" href="css/style.css" >
		<link rel="stylesheet" type="text/css" href="shariff/shariff.complete.css">
	</head>
	<body>
		<div id="middle">
			<a id="logo" href="./" title="zur Startseite"></a>
			<a id="language" href="javascript:toggleLanguage()" data-studimat-lang="switchLangShort"></a>

			<h1 data-studimat-lang="header"></h1>
			<noscript data-studimat-lang="js"></noscript>

			<div class="container container_1">
				<span data-studimat-lang="einleitung"></span>

				<div class="containerFooter">
					<div id="startmatowahl" class="button" data-studimat-lang="losgehts"></div>
				</div>
			</div>

			<div id="questioncontainer"  class="container container_2">
				<div id="questions"></div>
				<div id="jumpto"></div>
				<div class="containerFooter">
				</div>
			</div>

			<div id="gewichtung"  class="container container_3">
				<h2 data-studimat-lang="gewichtung"></h2>
				<span data-studimat-lang="gtxt"></span>

				<table></table>

				<div id="zumresult" class="button" data-studimat-lang="next"></div>
				<div class="containerFooter">
				</div>
			</div>


			<div id="results"  class="container container_4">
				<span data-studimat-lang="result"></span>
				<div id="result_short">
					<!--<table></table>-->
				</div>

				<div id="result_long">
					<table></table>
				</div>

				<span data-studimat-lang="furtherinfos"></span>

				<p><strong>CampusGrüne</strong><br />
					<a href="http://www.campusgruene.de">www.campusgrüene.de</a>
				</p>
				<p><strong>Fachwerk</strong><br />
					<a href="http://www.fachwerkhouse.de">www.fachwerkhouse.de</a>
				</p>
				<p><strong>Ing+</strong><br />
					<a href="http://ingplus.net">www.ingplus.net</a>
				</p>
				<p><strong>Jusos und Unabhängige</strong><br />
					<a href="http://jusos-tud.de">www.jusos-tud.de</a>
				</p>
				<p><strong>SDS</strong><br />
					<a href="https://sdstuda.wordpress.com/">sdstuda.wordpress.com</a>
				</p>

				<div class="containerFooter">
				</div>
			</div>

			<span data-studimat-lang="sharrif"></span>

		</div>
		<footer>
			<p id="extras"><a href="imprint.html">Impressum</a></p>
		</footer>

		<script type="text/javascript" src="lang/de.js"></script>
		<script type="text/javascript" src="lang/en.js"></script>
		<script src="vendor/jquery/jquery-1.11.3.js"></script>
		<script src="vendor/papaparse/papaparse.min.js"></script>
		<script src="shariff/shariff.min.js"></script>
		<script src="js/helper.js"></script>
		<script src="js/meinungsvergleich.js"></script>

		<?php
			if(file_exists('_tracking.php'))
    		include '_tracking.php';
		?>
	</body>
</html>
