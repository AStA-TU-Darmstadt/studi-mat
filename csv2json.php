<?php
//header("Content-Type: text/html; charset=utf-8");
header('Content-Type: application/javascript;charset=utf-8');
session_start();


$file   = "data/daten_".$_SESSION['lang'].".csv";


# old loading, without linebreaks:
#$myfile = fopen($file, "r") or die("Unable to open file!");
#$csv    = fread($myfile,filesize($file));


# all this is to create valid html5 breaks from csv \n \r are considered breaks
$csv = '';
$templine = '';

$handle = fopen($file, "r");
if ($handle) {
    while (($line = fgets($handle)) !== false) {

        # if we did not start a templine, do it normally
        if ($templine == ''){

		# check if " is round:
		$n = substr_count($line, '"');
		
		if ($n % 2 == 0 or $n == 0) {
			$csv .= $line;
			$templine = '';
		}else{
			$templine .= preg_replace( "/\r|\n/", "", $line);
		}
        }else{
        	
        	# we have a templine

		$line = preg_replace( "/\r|\n/", "", $line );
		
		
		
        	$templine .= "<br />".$line;	# add current line

        	$n = substr_count($templine, '"');
        	if ($n % 2 == 0) {
        		
        		# templine ended:
        		$csv .= $templine."\n";
			$templine = '';
        		
        	}
        	
        }
  
        
    }

    fclose($handle);
} else {
    // error opening the file.
} 

# make double <br /> into </p><p>
$csv = str_replace( "<br /><br />", "</p><p>", $csv);



$array = array_map("str_getcsv", explode("\n", $csv));
//print_r($array);

print "var rohdaten = ".json_encode($array, JSON_UNESCAPED_UNICODE);


fclose($myfile);
?>
