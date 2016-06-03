(function (calculator, undefined) {

    var isLetter = function(c) {
	//thanks, stack overflow
	return c.toLowerCase() != c.toUpperCase();
    };


    Tree = function(data) {
	this.root = null;
    }

    Tree.prototype.evaluate = function() {
	this.root.evalutate();
    }

    Tree.Node = function(data) {
	this.data = data;
	this.children = new Array();
    }

    Tree.Node.prototype.addChild = function(data) {
	this.children.unshift(data);
    }

    Tree.Node.prototype.reduce = function() {
	


    }
    
    Tree.Node.prototype.evaluate = function() {
	if(functions[this.data] !== undefined) {
	    if(functions[this.data].length === this.children.length) {
		var array = new Array(functions[this.data].length); //could just use the children array?
		var succeed = 0;
		for(var i = 0; i < this.children.length; i++) {
		    array[i] = this.children[i].evaluate();
		    if(array[i] !== false && !isNaN(array[i])) {
			succeed++;
		    } else {
			this.children[i].reduce();
		    }
		}
		if(succeed === this.children.length) {
		    this.data = functions[this.data](array);
		    this.children = null;
		    return this.data;
		} else return false;
		
	    } else throw "wrong number of arguments for \"" + data + "\" operator";
	} else if(this.children.length === 0) {
	    return this.data;
	} else throw "Something is wrong here";
    }


    /**
     * Converts a linked list of tokens in RPN to the correct syntax
     * tree.
     * @param tokens tokens in RPN notation
     * @returns Tree object
     **/
    Tree.fromRPN = function(tokens) {
	var stack = new calculator.LinkedList();
	//tree = new Tree();

	var item = new Tree.Node(tokens.remove());
	while(item.data !== null) {
	    if(!isNaN(item.data) || isLetter(item.data)) {
		stack.push(item);
	    } else if(functions[item.data] !== undefined) {
		if(stack.size >= functions[item.data].length) {
		    for(var i = 0; i < functions[item.data].length; i++) {
			item.addChild(stack.pop());
		    }
		    stack.push(item);
		} else throw "Too many operators";
	    } else throw "Unexpected token: " + item;
	    item = new Tree.Node(tokens.remove());
	}
	if(stack.size !== 1) {
	    throw "Error interpreting equation: too few operators?";
	} else {
	    //tree.root = stack.pop();
	    return stack.pop();
	}
    }

    Tree.toPostfix = function(tree) {
	var t = tree.root;
	

    }



} (window.calculator = window.calculator || {}))