/**
 * This file provides the code for the tokenizer, which splits the
 * input into tokens and does some pre-proccessing in order to deal
 * with some of the problems that can come with interpreting
 * left/right associvity
 *
 * Preprocessing includes the following:
 *    subtraction is converted into addition by a negative number
 *    Something may be done with division as well
 **/

//use calc namespace:
(function (calculator, undefined) {
    
    //create namspace for the tokenizer:
    (function (tokenizer, undefined) {

	//code goes in here

    }(calculator.tokenizer = calculator.tokenizer || {}))


} (window.calculator = window.calculator || {}))