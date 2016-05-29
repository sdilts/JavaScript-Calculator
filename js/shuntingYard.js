//use calc namespace:
(function (calculator, undefined) {

    //create namespace for the tokenizer:
    (function (ShuntingYard, undefined) {

	var isFunction = function(character) {
	    return functions[character] !== undefined;
	};

	var isConstant = function(token) {
	    return constants[token] !== undefined;
	};

	var isLetter = function(c) {
	    //thanks, stack overflow
	    return c.toLowerCase() != c.toUpperCase();
	};
	

	/**
	 * This function returns the type of the token that it is
	 * given. Instead of using the OPERATOR value, the function
	 * returns a value represents the functions priority in order
	 * of operations. 1 is the highest priority.
	 **/
	var getType = function(item) {
	    switch(item) {
	    case "+":
	    case "-":
		return 3;
	    case "*":
	    case "/":
	    case "%":
		return 2;
	    case "^":
		return 1;
	    default:
		if(calculator.isFunction(item)) {
		    return typeEnum.FUNCTION;
		} else if(!isNaN(item) || isConstant(item) || isLetter(item)) {
		    return typeEnum.NUMBER;
		} else if(item === ")" || item === "(" || item === ",") {
		    return typeEnum.SEPARATOR;
		} else return typeEnum.UNKNOWN;
	    }
	}

	ShuntingYard.toRPN = function(tokens) {
	    //used to hold the values:
	    
	    var stack = new calculator.LinkedList();
	    var queue = new calculator.LinkedList();
	    
	    var popUntil = function(token) {
		while(stack.peek() !== token) {
		    if(stack.peek() === null) {
			return false;
		    }
		    queue.add(stack.pop());
		}
		return true;
	    };

	    var item = tokens.remove();
	    while(item !== null) {
		var type = getType(item);
		switch(type) {
		case typeEnum.SEPARATOR:
		    if(item === "(") {
			stack.push(item);
		    } else if(item === ")") {
			if(popUntil("(")) {
			    stack.pop();
			    if(calculator.isFunction(stack.peek())) {
				queue.add(stack.pop());
			    }
			} else throw "Mismatched Parenthesis";
			//deal with commas: (add check here?)
		    } else if(!popUntil("(")) {
			throw "Misplaced Comma or Parenthesis";
		    }
		    break;
		case typeEnum.FUNCTION:
		    stack.push(item);
		    break;
		case typeEnum.NUMBER:
		    queue.add(item);
		    break;
		default:
		    //handle operators and unknowns here:
		    if(type <= typeEnum.OPERATOR) {
			//see definition of typeEnum for how this works:
			while(getType(stack.peek()) < type) { //no left-associative operators
			    queue.add(stack.pop());
			}
			stack.push(item);
		    } else {
			throw "Unknown token" + item;
		    }
		    break;
		} //end switch
		item = tokens.remove();
	    } //end while
	    
	    if(getType(stack.peek()) === typeEnum.SEPARATOR) {
		throw "Mismatched Parenthesis";
	    } else {
		while(stack.peek() !== null) {
		    queue.add(stack.pop());
		}
		return queue;
	    }
	    
	}

    }(calculator.ShuntingYard = calculator.ShuntingYard || {}));

} (window.calculator = window.calculator || {}));