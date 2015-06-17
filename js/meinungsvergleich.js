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

var currentContainer = 0;

var wahlomat_started = false;
var wahlomat_language = "";
var wahlomat_accepted_languages = ["de", "en"];

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
	$.each(jsondata, function(a,b){

		if(b != 0){ // fehler im json converter erzeugt eine nullzeile, die soll ignoriert werden
		// second level loop
		$.each(b, function(c,d){
			// a = line of the table
			// b = content of the line (array)
			// c = column of the table
			// d = content of the table cell defined by a and c

			// if first line, then we save the parties
			if(a == 0 ){

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
				if(c == 0 ){
					daten.kurzfragen.push(d);
					// make an own array for each question to save value (wertung) and the reasons (gruende):
					daten.wertung[(parseInt(a)-1)] = new Array();
					daten.gruende[(parseInt(a)-1)] = new Array();
				}else if(c == 1){
					// it is a long question
					daten.frage.push(d);
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
					//console.log(numberofreason,partienumber);
					// save the reason
					daten.gruende[numberofreason].push(d)
				}
			}
		});
		}
	});
}


/*
 * This function takes the data and makes the questionscontainer
*/
function makeHTML (){

	// hide the questions first
	$('#questioncontainer').hide();

	// loop the questions and make them into html
	$.each(daten.frage, function(num,quest){

		// create the question with all its beauty
		newquestion = '<div class="question question'+num+'" data-number="'+num+'"><span class="shortquestion"><!--'+daten.kurzfragen[num]+'--> <span class="fragencounter">'+(parseInt(num)+1)+' <span data-studimat-lang="of"></span> '+(daten.frage.length)+'</span></span><br /><p class="questiontext">' + quest + '</p></div>';
		newquestion += '<div class="voting voting'+num+'" data-number="'+num+'"><a href="#" class="vote vote-ja" data-vote="1" data-number="'+num+'" data-studimat-lang="yes"></a><a href="#" class="vote vote-enth" data-vote="0" data-number="'+num+'" data-studimat-lang="maybe"></a><a href="#" class="vote vote-nein" data-vote="-1" data-number="'+num+'" data-studimat-lang="no"></a><a href="#" class="vote vote-ueber" data-vote="99" data-number="'+num+'" data-studimat-lang="skip"></a></div>';
		// append it to the DOM
		$('#questions').append(newquestion);


		// create the small jump to points
		number = parseInt(num) + 1;
		jumppoint = '<a href="#" title="Frage '+(parseInt(num)+1)+'" class="jumpto jumpto'+num+'" data-number="'+num+'">'+number+'</a>';
		// append it also to the DOM
		$('#jumpto').append(jumppoint);

	});


	// js enable clicking on the voting elements
	$('.voting .vote').on('click',function(){
		number = $(this).attr("data-number");
		voting = $(this).attr("data-vote");

		// the actual voting part, as in "save the vote"
		numberOfParties = daten.partei.length;
		daten.wertung[number][numberOfParties] = voting;

		// also show the next question or whatever
		showQuestion(parseInt(number)+1);

	});

	// enable jumping to questions
	$('.jumpto').on('click',function(){
		number = $(this).attr("data-number");
		showQuestion(number);
	});

	helper.updateLanguage(lang[wahlomat_language]);
}



/*
 * This function can show you a question if called
*/
function showQuestion(num){

	if(num < daten.frage.length){
		$('#questioncontainer').show();
		$('#questions .question, #questions .voting').hide();
		$('#questions .question'+num+', #questions .voting'+num).show();

		// blur focus:
		$("a.vote").blur();

	}else{
		// ask if some questions are more important
		gewichtung(); // jumps to the next container
	}
	// always go to the top:
	window.scrollTo(0, 0);
}


/*
 * creates an container which allows selecting questions
 * that are more important to the user
*/
function gewichtung() {
	$('#gewichtung table').html("");
	$.each(daten.frage, function(a,b){

		b = trimQuestion(b);
		$('#gewichtung table').append('<tr><td><input class="checkbox_gewichtung" type="checkbox" id="gewichtung_frage_'+a+'" data-gewichtung="'+a+'" /></td><td><label for="gewichtung_frage_'+a+'">'+b+'</label><td></tr>');
	});
	// show this container
	$('.container_2').hide();
	$('.container_3').show();
	// always go to the top:
	window.scrollTo(0, 0);

	helper.updateLanguage(lang[wahlomat_language]);
}

// function that trims the question if there are breaks or </p> etc
function trimQuestion(q){
	// trim question to its first sentence:
	pIndex = q.indexOf("</p");
	if(pIndex !== -1){
		q = q.substr(0,	pIndex);
	}
	brIndex = q.indexOf("<br");
	if(brIndex !== -1){
		q = q.substr(0,	brIndex);
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

    // empty the array:
    daten.gewichtung = new Array();
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
				ownscore = array[array.length-1]
				//console.log(ownscore, array, array.length);
				$.each(array, function(a,b){
					currentValue = daten.result[a];

					if(currentValue == undefined || frage == "0"){
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


				});
			}else{
				//console.log("Frage nicht beantwortet", array);
			}
		}
		numberOfQuestion++;
	});

	//console.log("Result: ", daten.result);
	createResult();
}


function createResult() {
	// create associative array we can sort:
	sortable = new Array();
	resorted = new Object();
	$.each(daten.parteiKurz,function(a,b){
		sortable[b] = daten.result[a];
	});

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
	//console.log(resorted)

	$('#result_short').html("");

	$.each(resorted, function(a,b){
		// prozentual value:
		doubles = daten.gewichtung.length
		possiblePoint = 2*daten.frage.length + 2*doubles // daten.frage.length ist quasi die mitte, also 0 punkte
		reachedPoints = daten.frage.length+doubles + b
		prozentual = Math.round(parseFloat(reachedPoints)/parseFloat(possiblePoint) * 10000)/100

		langerParteiname = daten.partei[daten.parteiKurz.indexOf(a)];

		nameForBarChart  = langerParteiname
		/* // if you want to restrict the name length, I dont
		if (langerParteiname.length < 20){
			nameForBarChart  = a
		}*/

		$('#result_short').append('<div class="result_new_partie"><div class="barchart_name" >'+nameForBarChart+'</div><div class="barchart" style="width:'+prozentual+'%">'+prozentual+'%</div></div>');
	});

	// make the long result:

	// so far we only make a table to make it pretty
	// we have time later:
	$('#result_long table').html("");

	listP = ''
	colspan = 0
	$.each(resorted, function(n, na){
		listP = listP + '<th>' + n + '</th>';
		colspan++
	});

	$('#result_long table').append('<tr><th></th><th>Du</th>'+listP+'</tr>');
	colspan = colspan + 2;
	alternatingClass = "alternate-1"; // for alternating the rows gray and not gray


	$.each(daten.frage, function(n, frage){
		index         = n;

		eigeneMeinung = daten.wertung[n][daten.wertung[n].length-1];
		kurzfrage     = daten.kurzfragen[n];

		console.log("gewichtung", daten.gewichtung, index)

		doubleclass=""
		if (daten.gewichtung.indexOf(index) >= 0){
			doubleclass="double"
		}
		frage = trimQuestion(frage);

		id=kurzfrage.split()
		id = id[0] + index

		reasonDiv = '<div id="'+id+'" class="reasonDiv">';
		listP = '';

		$.each(resorted, function(kurz, b){

			i = daten.parteiKurz.indexOf(kurz)

			wertung    = daten.wertung[n][i];
			parteikurz = daten.parteiKurz[i];
			grund      = daten.gruende[n][i];
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
		});
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

		$('#result_long table').append('<tr class="expandRow ' + alternatingClass + ' ' + doubleclass +'" data-question="'+id+'"><td>' +frage+'</td><td class="ownresult">'+div+'</td>'+listP+'</tr>');
		$('#result_long table').append('<tr data-reason="'+id+'" class="result_reason"><td colspan="'+colspan+'">'+reasonDiv+'</td></tr>');
	});


	$('.container_3').hide();
	$('.container_4').show();
	// always go to the top:
	window.scrollTo(0, 0);

	// show first answer:
	$('#0').show();
	$('tr.expandRow[data-question="0"]').addClass("showResult");

	// click on result
	$('tr.expandRow').on("click",function(){
		//console.log("id");
		id = $(this).attr('data-question');

		// remove all classes and highligth current:
		$('tr.showResult').removeClass('showResult');


		// check if it is already visible:
		show = $('#'+id).css("display");
		//console.log(show);
		if (show != "block"){

			// make all small:
			$('#result_long table tr .reasonDiv').slideUp(150);

			// show the clicked one:
			$('#'+id).slideDown(150);
			$(this).addClass('showResult');
		}else{
			// hide the clicked one:
			$('#'+id).slideUp(150);
		}
	});

	helper.updateLanguage(lang[wahlomat_language]);
}


function showContainer(num){
	if(num != 1){
		//console.log("Zeige Container", num);
		$('.container').hide();
		$('.container_'+num).show();
	}else{
		// enable back for each question
		currentQuestion = 0
		currentQuestion = $('.question:visible').attr("data-number");

		if(currentQuestion > 0){
			showQuestion(currentQuestion-1);
		}else{
			$('.container').hide();
			$('.container_'+num).show();
		}
	}

	// always go to the top:
	window.scrollTo(0, 0);
}


function wahlomat(){
	// load the data
	var jqxhr = $.ajax({
		url: "data/daten_"+wahlomat_language+".csv",
		dataType: "text",
		mimeType: "textPlain"
	}).done(function(csvdata) {

		// convert csv data to json
		var parse_result = Papa.parse(csvdata);

		// move json data to global variable "daten"
		readData(parse_result.data);

		// data is prepared, show it
		makeHTML();

		$('.container').hide();
		$('.container_1').show();
		$('.container .containerFooter').each(function(a, b){
			if(a != 0){
				$(this).prepend('<div class="back button" id="showContainer'+a+'" data-studimat-lang="back"></div>');
				$('#showContainer'+a).on("click", function(){showContainer(a)});
				helper.updateLanguage(lang[wahlomat_language]);
			}
		});

	}).fail(function() {
		alert("Could not fetch questions from the server. Sorry. :(");
	})
}


function toggleLanguage(){
	if (!wahlomat_started || confirm(lang[wahlomat_language]['switchLanguage'])) {
		// change the language
		wahlomat_language = wahlomat_accepted_languages[1 - $.inArray(wahlomat_language, wahlomat_accepted_languages)];
		location.href = "?lang="+wahlomat_language;
	}
}


$(document).ready(function(){
	// Determine the current language
	var lang_url = helper.getURLparam("lang");
	var lang_cookie = helper.getCookie("lang");

	if (lang_url != "" && $.inArray(lang_url, wahlomat_accepted_languages) != -1) {
		console.log("setting language (URL) to", lang_url);
		wahlomat_language = lang_url;
		helper.setCookie("lang", lang_url);
	} else if (lang_cookie != "" && $.inArray(lang_cookie, wahlomat_accepted_languages) != -1) {
		console.log("setting language (cookie) to", lang_cookie);
		wahlomat_language = lang_cookie;
	} else {
		wahlomat_language = wahlomat_accepted_languages[0];
	}

	// update all elements which have a data-studimat-lang attribute
	helper.updateLanguage(lang[wahlomat_language]);

	// start the "wahlomat"
	wahlomat();

	$('#startmatowahl').click(function(){
		$('.container_1').hide();
		wahlomat_started = true;
		showQuestion(0);
	});

	$('#zumresult').click(function(){
		calculateResult();
	});


	// callback for clicking on the logo
	// it will remove all answers givven to this point
	// check the current status though, as it does only matter after clicking
	// start
	$('#logo').click(function(){
		if(wahlomat_started){
			return (confirm(lang[wahlomat_language]['logoClick']));
		}else{
			return true;
		}
	});
});
