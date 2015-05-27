<?php
	/*

	This file is part of studi-mat

	LICENSE:

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
	
	session_start();
	$possiblelanguages = array("de","en");
	
	$_SESSION['lang'] = "de";
	if (isset($_GET['lang'])){
	
		if (in_array($_GET['lang'], $possiblelanguages)){
			$_SESSION['lang'] = $_GET['lang'];
		}
	
	}

	switch ($_SESSION['lang']){
		case "de": 
			include("lang/de_DE.php");
			break;
		case "en":
			include("lang/en_EN.php");
			break;
		default:
			include("lang/de_DE.php");
	}
?><html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

		<meta name="author" content="Standard"/>
		<meta name="description" content="Studi-Mat" />
		<meta name="keywords" content="studi-mat, AStA, TU Darmstadt, Hochschulwahlen"/>

		<meta name="language" content="de" />
		<meta name="Content-Language" content="de" />

		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">



		<title>Studi-Mat - AStA der TU Darmstadt</title>

		<link rel="stylesheet" type="text/css" href="css/style.css" >
		<link href="shariff/shariff.complete.css" rel="stylesheet">
		
	</head>
	<body>
		<div id="middle">

			<a href="https://www.asta.tu-darmstadt.de/studi-mat/?lang=<?php echo $_SESSION['lang']; ?>" title="zur Startseite" id="logo"></a>
	
			<div id="language">
				<?php if ($_SESSION['lang'] == "de"){
					echo '<a href="?lang=en">switch to english</a>';
				}else{
					echo '<a href="?lang=de">wechsel zu Deutsch</a>';
				}
				?>
				
			</div>
			
			<h1><?php echo $lang['header']; ?></h1>
			<noscript>
				<?php echo $lang['js']; ?>
			</noscript>
	
			<div  class="container container_1">
				<?php echo $lang['einleitung']; ?>
				
				<div class="containerFooter">
					<div id="startmatowahl" class="button">
						<?php echo $lang['losgehts']; ?>
					</div>
				
				<div class="shariff" data-theme="standard" data-orientation="vertical" data-lang="<?php echo $_SESSION['lang']; ?>" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>	<br class="clear" />
				</div>
			</div>
	

	
			<div id="questioncontainer"  class="container container_2">
				<div id="questions"></div>
				<div id="jumpto"></div>
				<br class="clear" />
				<div class="containerFooter">
				
					<div class="shariff" data-theme="standard" data-orientation="vertical"  data-lang="<?php echo $_SESSION['lang']; ?>" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>	<br class="clear" />
				</div>
			</div>
	
	
			<div id="gewichtung"  class="container container_3">
				<h2><?php echo $lang['gewichtung']; ?></h2>
				
				<?php echo $lang['gtxt']; ?>
				
				<table >
		
				</table>
		
				<div id="zumresult" class="button">
					<?php echo $lang['next']; ?>
				</div>
				<br class="clear" />
				<div class="containerFooter">
				
					<div class="shariff" data-theme="standard" data-orientation="vertical"  data-lang="<?php echo $_SESSION['lang']; ?>" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>	<br class="clear" />
				</div>
			</div>


			<div id="results"  class="container container_4">
				<?php echo $lang['result']; ?>
				
		
				<div id="result_short">
					<!--<table>
			
					</table>-->
				</div>
				
				<div id="result_long">
					<table>
			
					</table>
				</div>
				
				<?php echo $lang['furtherinfos'];?>
				
				
				
				
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
				
				
				
				
			
			
<br class="clear" />
			<div class="containerFooter">
				
					<div class="shariff" data-theme="standard" data-orientation="vertical" data-lang="<?php echo $_SESSION['lang']; ?>" data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"></div>	<br class="clear" />
				</div>
			</div>
	
	


		</div>
		<footer>
			
			  
			 
			<p id="extras">
			 <a href="imprint.html">Impressum</a>
			</p>
		</footer>




		<?php
			if ($_GET['lang'] == "en"){
		?>
		<script type="text/javascript" src="lang/en_EN.js"></script>
		<script type="text/javascript" src="csv2json.php?lang=en"></script>
		<?php	
			}else{
		?>
		<script type="text/javascript" src="lang/de_DE.js"></script>
		<script type="text/javascript" src="csv2json.php"></script>
		
		<?php
			}
		?>
		<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
		<!--<script type="text/javascript" src="csv2json.php"></script>-->
		<script type="text/javascript" src="js/meinungsvergleich.js"></script>
		<script src="shariff/shariff.min.js"></script>

		<!-- Piwik -->
		<script type="text/javascript">
		  var _paq = _paq || [];
		  _paq.push(['trackPageView']);
		  _paq.push(['enableLinkTracking']);
		  (function() {
			var u="//www.asta.tu-darmstadt.de/piwik/";
			_paq.push(['setTrackerUrl', u+'piwik.php']);
			_paq.push(['setSiteId', 1]);
			var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
			g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
		  })();
		</script>
		<noscript><p><img src="//www.asta.tu-darmstadt.de/piwik/piwik.php?idsite=1" style="border:0;" alt="" /></p></noscript>
		<!-- End Piwik Code -->

	</body>
</html>
