/**
 * This file provides the data structures needed throughout the
 * parsing program, namely the linked list and the tree
 **/

//use a namespace for all caclulator functions:
(function (calculator, undefined) {

    /**
     * CAUTION: no one-letter functions are allowed in the
     * table. Several methods rely on this fact, and if they do exist,
     * they will break the system. Operators must be one char each.
     **/
    functions = new Object();
    functions["+"] = function(array, y) {return array[0] + array[1];}
    functions["-"] = function(array, y) {return array[0] - array[1];}
    functions["*"] = function(array, y) {return array[0] * array[1];}
    functions["/"] = function(array, y) {return array[0] / array[1];}
    functions["%"] = function(array, y) {return array[0] % array[1];}
    functions["^"] = function(array, y) {return Math.pow(array[0], array[1]);}
    functions["cos"] = function(array) {return Math.cos(array[0]);}
    functions["sin"] = function(array) {return Math.sin(array[0]);}
    functions["tan"] = function(array) {return Math.tan(array[0]);}
    functions["sqrt"] = function(array) {return Math.sqrt(array[0]);}
    
    constants = new Object();
    constants["e"] = Math.E;
    constants["pi"] = Math.PI;


    typeEnum = {
	UNKNOWN: 7,
	SEPARATOR: 6, //includes commas
	FUNCTION: 5, 
	NUMBER: 4,
	OPERATOR: 3, //three different precidences
    }

    //node constructor:
    var Node = function(data) {
	this.data = data;
	this.next = null;
    }

    calculator.LinkedList = function() {
	this.head = null;
	this.tail = null;
	this.size = 0;
    }

    calculator.LinkedList.prototype.addFirst = function(data) {
	var newNode = new Node(data);
	if(this.head === null) {
	    //list is empty:
	    this.head = newNode;
	    this.tail = newNode;
	} else {
	    newNode.next = this.head;
	    this.head = newNode;
	}
	this.size++;
    }

    calculator.LinkedList.prototype.addLast = function(data) {
	var newNode = new Node(data);
	if(this.size == 0) {
	    this.head = newNode;
	    this.tail = newNode;
	} else {
	    this.tail.next = newNode;
	    this.tail = newNode;
	}
	this.size++;
    }

    
    calculator.LinkedList.prototype.removeFirst = function() {
	var data = null;
	if(this.size !== 0) {
	    data = this.head.data;
	    this.head = this.head.next;
	    this.size--;
	    if(this.size === 0) {
		this.tail = null;
	    }
	}
	return data;
    }

    calculator.LinkedList.prototype.print = function() {
	var node = this.head
	var output = "";
	while(node !== null) {
	    output += " " + node.data;
	    node = node.next;
	}
	//console.log(output);
	return output;
    }
    /**
     * Returns the value that will be removed next
     * This is possible because both the stack and the queue remove
     * items from the head of the list:
     **/
    calculator.LinkedList.prototype.peek = function() {
	if(this.head === null) {
	    return null;
	} else {
	    return this.head.data;
	}
    }

    //add definitions for stack/queue usage:
    calculator.LinkedList.prototype.push = calculator.LinkedList.prototype.addFirst;
    calculator.LinkedList.prototype.pop = calculator.LinkedList.prototype.removeFirst;

    calculator.LinkedList.prototype.add = calculator.LinkedList.prototype.addLast;
    calculator.LinkedList.prototype.remove = calculator.LinkedList.prototype.removeFirst;

    calculator.simplify = function(equation) {
	var tokens = tokenizer.tokenize(equation);
	var rpn = ShuntingYard.toRPN(tokens);
	var tree = Tree.fromRPN(rpn);
	tree.evalute();
	return tree.toPostfix();
    }

} (window.calculator = window.calculator || {}))