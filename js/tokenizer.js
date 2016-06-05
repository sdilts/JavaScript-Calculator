/**
 * This file provides the code for the tokenizer, which splits the
 * input into tokens and does some pre-proccessing in order to deal
 * with some of the problems that can come with interpreting
 * left/right associvity.
 *
 * Preprocessing includes the following:
 *    subtraction is converted into addition by a negative number
 *    Something may be done with division as well
 * 
 * Future improvements may include making this similar to an iterator
 * rather than processing the whole thing in one chunk.
 **/

//use calc namespace:
(function (calculator, undefined) {
    "use strict";

    //create namespace for the tokenizer:
    (function (tokenizer, undefined) {

	var isFunction = function(character) {
	    return functions[character] !== undefined;
	};

	var isConstant = function(token) {
	    return constants[token] !== undefined;
	};

	/**
	 * A "." is not considered a number when the second argument
	 * is true
	 **/
	var isNumber = function(character, first) {
	    return (48 <= character.charCodeAt() &&
		character.charCodeAt()  <= 57) ||
		!first && character.charCodeAt() === 46;
	};

	//fails when input is more than one char long:
	var isLetter = function(c) {
	    //thanks, stack overflow
	    return c.toLowerCase() != c.toUpperCase();
	};


	var determineProcess = function(output) {
	    //can this be cleaned at all?
	    if(output.tail !== null &&
	       !isFunction(output.tail.data) &&	       
	       (!isNaN(output.tail.data) ||
		isConstant(output.tail.data) ||
		isLetter(output.tail.data) ||
		output.tail.data === ")")) {
		output.add("*");
	    }
	};


	/**
	 * Function that interprets characters and adds the necessary "-" and "*" characters.
	 **/
	//isolate just the function grabing portion and leave what part of the string
	//is processed to another function?
	var getChunk = function(index, input, output) {
	    var i;
	    for(i = index; i < input.length &&
		isLetter(input.charAt(i)); i++) {
		let searchIndex = i + 1;
		let found = false;
		let token;
		while(searchIndex < input.length &&
		      isLetter(input.charAt(searchIndex))) {
		    token = input.substring(i, searchIndex);
		    //console.log(token);
		    if(isFunction(token)) {
			determineProcess(output);
			output.add(token);
			found = true;
			i = searchIndex -1;
			break;
		    } else if(isConstant(token)) {
			determineProcess(output);
			output.add(constants[token]);
			found = true;
			i = searchIndex -1;
			break;
		    }
		    searchIndex++;
		}
		token = input.substring(i, searchIndex);
		if(!found && (isFunction(token))) {
		    determineProcess(output);
		    output.add(token);
		    i = searchIndex -1;
		    //found = true;
		} else if(isConstant(token)) {
		    determineProcess(output);
		    output.add(constants[token]);
		    i = searchIndex -1;
		    //found = true;
		} else if(!found) {
		    determineProcess(output);
		    output.add(input.charAt(i));
		}
	    }
	    return i;
	};

	
	tokenizer.tokenize = function(input) {
	    //linked list to hold tokens:
	    var output = new calculator.LinkedList();
	    var index = 0;
	    var searchIndex = 0;
	    
	    var checkNegative = function() {
		if(searchIndex !== index) {
		    //console.log("Negative function");
		    if(input.substring(index, searchIndex) === "-") {
			output.add("-1");
			output.add("*");
			index++;
		    } else throw "Something wrong around " + substring(index, searchIndex);
		}
	    };
	    
	    //remove whitespace:
	    input = input.replace(/\s/g, "");
	    
	    while(searchIndex < input.length) {
		var character = input.charAt(searchIndex);
		//operators are stored in the function array, so this
		//will tell us if it is an operator:
		if(isFunction(character)) {
		    if(character == "-") {
			//is it arithmetic or a negative number?
			if(index !== 0 && !isFunction(output.tail.data) &&
			  output.tail.data !== "(") {
			    output.add("+");
			}
			searchIndex++
		    } else {
			output.add(character);
			index++;
			searchIndex++;
		    }
		} else if(isNumber(character)) {
		    determineProcess(output);
		    //grab the entire number:
		    //move into its own function?
		    searchIndex += 1;
		    while(searchIndex < input.length &&
			  isNumber(input.charAt(searchIndex))) {
			searchIndex++;
		    }
		    output.add(Number(input.substring(index, searchIndex)));
		    index = searchIndex;
		} else if(isLetter(character)) {
		    checkNegative();
		    //get the whole chunk of letters and process them:
		    searchIndex = getChunk(index, input, output);
		    index = searchIndex;
		} else if(character === "(") {
		    determineProcess(output);
		    checkNegative();
		    if(output.size !== 0 && (isNumber(output.tail.data) || output.tail.data === ")")) {
			output.add("*");
		    }
		    output.add(character);
		    index++
		    searchIndex++;
		} else if(character === ")" || character === ",") { //add to another case?
		    output.add(character);
		    index++;
		    searchIndex++;
		} else throw new Error("Unkown token: " + character);
		    
	    }
	    return output;
	};
		   
    }(calculator.tokenizer = calculator.tokenizer || {}));


} (window.calculator = window.calculator || {}));