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

    //create namespace for the tokenizer:
    (function (tokenizer, undefined) {
	"use strict";

	var getType = function(item) {
	    switch(item) {
	    case "+":
	    case "-":
	    case "*":
	    case "/":
	    case "%":
	    case "^":
		return typeEnum.OPERATOR;
	    default:
		if(isFunction(item)) {
		    return typeEnum.FUNCTION;
		} else if(!isNaN(item)) {
		    return typeEnum.NUMBER;
		} else if(character === ")" || character === "(") {
		    return typeEnum.SEPARATOR;
		} else return typeEnum.UNKNOWN;	  
	    }
	}


	var isFunction = function(character) {
	    return functions[character] !== undefined;
	}

	var isConstant = function(token) {
	    return constants[token] !== undefined;
	}

	/**
	 * A "." is not considered a number when the second argument
	 * is true
	 **/
	var isNumber = function(character, first) {
	    return (48 <= character.charCodeAt() &&
		character.charCodeAt()  <= 57) ||
		!first && character.charCodeAt() === 46;
	}

	//fails when input is more than one char long:
	var isLetter = function(c) {
	    //thanks, stack overflow
	    return c.toLowerCase() != c.toUpperCase();
	}


	var determineProcess = function(output) {
	    if(output.tail !== null &&
	       (!isNaN(output.tail.data) ||
		isConstant(output.tail.data))) {
		output.add("*");
	    }
	}


	/**
	 * Function that interprets characters and adds the necessary "-" and "*" characters.
	 **/
	var getChunk = function(index, input, output) {
	    var i;
	    for(i = index; i < input.length &&
		isLetter(input.charAt(i)); i++) {
		let searchIndex = i + 1;
		var found = false;
		while(searchIndex < input.length &&
		      isLetter(input.charAt(searchIndex))) {
		    var token = input.substring(i, searchIndex);
		    console.log(token);
		    if(isFunction(token) || isConstant(token)) {
			determineProcess(output);
			output.add(token);
			found = true;
			i = searchIndex -1;
			break;
		    } else {
			searchIndex++;
		    }
		}
		var token = input.substring(i, searchIndex);
		if(!found && (isFunction(token) || isConstant(token))) {
		    determineProcess(output);
		    output.add(token);
		    i = searchIndex -1;
		    //found = true;
		} else if(!found) {
		    output.add(input.charAt(i));
		}
	    }
	    return i;
	}


	tokenizer.tokenize = function(input) {
	    //linked list to hold tokens:
	    var output = new calculator.LinkedList();
	    var index = 0;
	    var searchIndex = 0;
	    
	    //remove whitespace:
	    input = input.replace(/\s/g, "");
	    
	    while(searchIndex < input.length) {
		var character = input.charAt(searchIndex);
		//operators are stored in the function array, so this
		//will tell us if it is an operator:
		if(isFunction(character)) {
		    if(character == "-") {
			if(index !== 0 && !isFunction(output.tail.data)) {
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
		    searchIndex += 1;
		    while(searchIndex < input.length &&
			  isNumber(input.charAt(searchIndex))) {
			searchIndex++;
		    }
		    output.add(input.substring(index, searchIndex));
		    index = searchIndex;
		} else if(isLetter(character)) {
		    if(searchIndex !== index) {
			console.log("Negative function");
			if(input.substring(index, searchIndex) === "-") {
			    output.add("-1");
			    output.add("*");
			    index++;
			} else throw "Something wrong around " + substring(index, searchIndex);
		    }
		    searchIndex = getChunk(index, input, output);
		    index = searchIndex;
		} else throw "Unkown token: " + character;
		    
	    }
	    return output;
	}
		   
    }(calculator.tokenizer = calculator.tokenizer || {}))


} (window.calculator = window.calculator || {}))