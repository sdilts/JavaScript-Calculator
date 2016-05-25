/**
 * This file provides the data structures needed throughout the
 * parsing program, namely the linked list and the tree
 **/

//use a namespace for all caclulator functions:
(function (calculator, undefined) {

    /**
     * CAUTION: no one-letter functions are allowed in the
     * table. Several methods rely on this fact, and if they do exist,
     * they will break the system.
     **/
    functions = new Object();
    functions["+"] = function(x, y) {return x + y;}
    functions["-"] = function(x, y) {return x - y;}
    functions["*"] = function(x, y) {return x * y;}
    functions["/"] = function(x, y) {return x / y;}
    functions["%"] = function(x, y) {return x % y;}
    functions["^"] = Math.pow;
    functions["cos"] = Math.cos;
    functions["sin"] = Math.sin;
    functions["tan"] = Math.tan;
    functions["sqrt"] = Math.sqrt;
    
    constants = new Object();
    constants["e"] = Math.E;
    constants["pi"] = Math.PI;


    var typeEnum = {
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

    //add definitions for stack/queue usage:
    calculator.LinkedList.prototype.push = calculator.LinkedList.prototype.addFirst;
    calculator.LinkedList.prototype.pop = calculator.LinkedList.prototype.removeFirst;

    calculator.LinkedList.prototype.add = calculator.LinkedList.prototype.addLast;
    calculator.LinkedList.prototype.remove = calculator.LinkedList.prototype.removeFirst;

} (window.calculator = window.calculator || {}))