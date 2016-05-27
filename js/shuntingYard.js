//use calc namespace:
(function (calculator, undefined) {

    //create namespace for the tokenizer:
    (function (ShuntingYard, undefined) {
	

	ShuntingYard.toRPN = function(tokens) {
	    //used to hold the values:
	    var list = new LinedList();
	    
	    var item = tokens.head;
	    while(item !== null) {
		var type = getType(item.data);
		switch(type) {
		case typeEnum.SEPARATOR:
		    //handle parenthesis, commas here
		    break;
		case typeEnum.FUNCTION:
		    //handle functions here
		    break;
		case typeEnum.NUMBER:
		    //handle numbers here
		    break;
		default:
		    //handle operators and unkowns here:
		    if(type <= typeEnum.OPERATOR) {

		    } else {
			throw "Unkown token" + item.data;
		    }
		    break;
		}
	    }
	    
	    
	}

    }(calculator.ShuntingYard = calculator.ShuntingYard || {}));

} (window.calculator = window.calculator || {}));