/**
 * This file provides the data structures needed throughout the
 * parsing program, namely the linked list and the tree
 **/

//use a namespace for all caclulator functions:
(function (calculator, undefined) {
    //node constructor:
    var Node = function(data) {
	this.data = data;
	this.next = null;
    }

    var LinkedList = function() {
	this.head = null;
	this.tail = null;
    }


} (window.calculator = calculator.tokenizer || {})