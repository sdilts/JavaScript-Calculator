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


	// var determineProcess = function(output) {
	//     if(getType(output.tail.data) === typeEnum.
	// }


	/**
	 * Function that interprets characters and adds the necessary "-" and "*" characters.
	 **/
	var getChunk = function(index, input, output) {
	    var i;
	    for(i = index; i < input.length &&
		isLetter(input.charAt(i)); i++) {
		var searchIndex = i + 1;
		var found = false;
		while(searchIndex < input.length &&
		      isLetter(input.charAt(searchIndex))) {
		    console.log(input.substring(i, searchIndex));
		    if(isFunction(input.substring(i, searchIndex))) {
			output.add(input.substring(i, searchIndex));
			found = true;
			i = searchIndex -1;
			break;
		    } else {
			searchIndex++;
		    }
		}
		if(isFunction(input.substring(i, searchIndex))) {
		    output.add(input.substring(i, searchIndex));
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
	    
	    //remove whitespace:
	    input = input.replace(/\s/g, "");
	    
	    while(index < input.length) {
		var character = input.charAt(index);
		//operators are stored in the function array, so this
		//will tell us if it is an operator:
		if(isFunction(character)) {
		    /* stuff for later on:
		       if(character == "-" && index != 0) {
		       output.add("+");
		       index++
		    */
		    output.add(character);
		    index++;
		} else if(isNumber(character, true)) {
		    var searchIndex = index + 1;
		    while(searchIndex < input.length &&
			  isNumber(input.charAt(searchIndex))) {
			searchIndex++;
		    }
		    output.add(input.substring(index, searchIndex));
		    index = searchIndex;
		} else if(isLetter(character)) {
		    index = getChunk(index, input, output);
		}
		    
	    }
	    return output;
	}
		   
    }(calculator.tokenizer = calculator.tokenizer || {}))


} (window.calculator = window.calculator || {}))