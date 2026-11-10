// If you can get ahold of this, it is free to use.
import _ from 'lodash';
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();

//JSONs
var iso_abbreviations = {Croatia:"HR", Denmark:"DK", Germany:"DE",Greece:"GR", Ireland:"IE", Italy:"IT",  Luxembourg:"LU",  Netherlands:"NL", Switzerland:"CH", Turkey:"TR", UK:"GB", };
var country_length = {Croatia:21, Denmark:18, Germany:22, Greece:27, Ireland:22, Italy:27, Luxembourg:20, Netherlands:18, Switzerland:21, Turkey:26, UK:22, };
var letter_map = {A:10, B:11, C:12, D:13, E:14, F:15, G:16, H:17, I:18, J:19, K:20, L:21, M:22, N:23, O:24, P:25, Q:26, R:27, S:28, T:29, U:30, V:31, W:32, X:33, Y:34, Z:35};
var character_countries = {Croatia:0, Denmark:0, Germany:0, Greece:0, Ireland:4, Italy:1, Luxembourg:0, Netherlands:4, Switzerland:0, Turkey:0, UK:4, }


// Arrays
var Greek_sort = ["010", "011", "014", "017"]
var Croatia_sort = ["2340009", "2500009", "2402006", "2360000", "2484008"]

function num_gen3(span) {
	var num2 = chance.string({length: span, pool: '123456789'});
	return num2;
}


function char_gen(span) {
	var char2 = chance.string({length: span, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'})
	return char2;
}

String.prototype.bankAccountKey=function() {
	var str = this.toString(),deb,rst;
	while (deb=str.substr(0,12),str=str.substr(12)) {str=(deb%97).toString()+str;}
	rst=98-deb%97;
	return rst<10?'0'+rst:''+rst;
}

function replaceChars(conv_string) {
	for(var i = 0; i < conv_string.length; i++) {
		var conv_char = conv_string[i];
		if(conv_char in letter_map) {
			var IBAN_conv = letter_map[conv_char];
			conv_string = conv_string.replace(conv_char, IBAN_conv.toString());
		}
	}
	return conv_string;
}



function calcChecksum(countryCode, randomPart) {
	var checkString = randomPart + countryCode + "00";
	checkString = replaceChars(checkString);
	var checksum = checkString.bankAccountKey();
	
	return countryCode + checksum.toString() + randomPart;
}

export function buildIbans(country_input) {
  var ISO = iso_abbreviations[country_input];
  var IBAN_length = country_length[country_input];
  var middle_characters = character_countries[country_input];
  switch(country_input) {
   
  case "Switzerland":
		var CH_numeric_suffix = IBAN_length - 9;
		var CH_really = "89144" + num_gen3(CH_numeric_suffix);
		var CH_IBAN = calcChecksum(ISO, CH_really);
		return CH_IBAN;

  case "Greece":
		var GR_numeric_part = _.sample(Greek_sort) + num_gen3(IBAN_length - 7);
		var interIBAN = calcChecksum(ISO, GR_numeric_part);
		return interIBAN;

  case "Germany":
		var DE_randomPart = "50010517" + num_gen3(IBAN_length - 12);
		var DE_IBAN = calcChecksum(ISO, DE_randomPart);
		return DE_IBAN;
		// Method C1, Variant 2, Account 5559749181, Bank Code 50010517, Check digit 1 is at position 10, expected check digit: 1. Overview of the calculation: Take the digits in positions 1 to 9 - here: 555974918 -, Multiply them from the left to the right by the weights 1,2,1,2,1,2,1,2,1, add the transverse sums of the products, form the remainder of the division by 11, subtract the result from 10, Result modulo 11 is the expected reference number.
  case "Denmark":
		var DK_randomPart = "5051" + num_gen3(IBAN_length - 8);
		var DK_IBAN = calcChecksum(ISO, DK_randomPart);
		return DK_IBAN;

  case "Italy":
		var numeric_part = "0300203280" + num_gen3(IBAN_length - 15);
		var Italy_map = {0:"1", 1:"0", 2:"5", 3:"7", 4:"9", 5:"13", 6:"15", 7:"17", 8:"19", 9:"21"}
		var Italy_CIN = {0:"A", 1:"B", 2:"C", 3:"D", 4:"E", 5:"F", 6:"G", 7:"H", 8:"I", 9:"J", 10:"K", 11:"L", 12:"M", 13:"N", 14:"O", 15:"P", 16:"Q", 17:"R", 18:"S", 19:"T", 20:"U", 21:"V", 22:"W", 23:"X", 24:"Y", 25:"Z"}
		var yy = 0;
		var xx = 0;
		for(var i = 1; i < 22; i += 2) {
			yy +=  Number(numeric_part.charAt(i));

		}
		for(var j = 0; j < 22; j += 2) {
			var jj = Number(numeric_part.charAt(j));
			var ii = Italy_map[jj];
			xx += Number(ii);
		}
		var uu = xx + yy;
		var ll = uu % 26;
		var kk = Italy_CIN[ll];
		var randomPart = kk + numeric_part;
		interIBAN = calcChecksum(ISO, randomPart);
		return interIBAN;

  case "Luxembourg":
		var LX_numeric_part = "010" + num_gen3(IBAN_length - 7);
		var LX_IBAN = calcChecksum(ISO, LX_numeric_part);
		return LX_IBAN;

 
  case "Ireland":
		var IR_numeric_part =  num_gen3(IBAN_length - 16);
		var IR_randomPart = "BOFI900017" + IR_numeric_part;
		var IR_IBAN = calcChecksum(ISO, IR_randomPart);
		return IR_IBAN;

  
  case "Croatia":
		var CRT_numeric_part = _.sample(Croatia_sort) + num_gen3(IBAN_length - 11);
		var CRT_IBAN = calcChecksum(ISO, CRT_numeric_part);
		return CRT_IBAN;

  case "Turkey":
		var TR_numeric_part = "00062" + num_gen3(IBAN_length - 9);
		var TR_IBAN = calcChecksum(ISO, TR_numeric_part);
		return TR_IBAN;

  default:
    ISO = iso_abbreviations[country_input];
	IBAN_length = country_length[country_input];
	middle_characters = character_countries[country_input];
	var numeric_suffix = Number(IBAN_length - 4 - middle_characters);
	
	var BIC = char_gen(middle_characters);
	randomPart = BIC + num_gen3(numeric_suffix) + "";
	
	return calcChecksum(ISO, randomPart);
  }
}

