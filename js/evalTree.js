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

    Tree.Node.prototype.isLeaf = function() {
	return this.children.length === 0;
    }

    Tree.Node.prototype.reduce = function() {
	


    }

    /**
     * Rough version of converting the tree to infix
     * notation. Assumes that only operators take two arguments, which
     * is true at the moment.
     **/
    Tree.Node.prototype.toInfix = function() {
	if(this.isLeaf()) {
	    return this.data.toString();
	} else {
	    var s;
	    var isOperator = this.children.length == 2
	    if(!isOperator) {
		s = this.data + "(";
	    } else {
		s = "(";
	    }
	    for(var i = 0; i < this.children.length; i++) {
		if(!isOperator && i !== 0) {
		    s += ", ";
		} else if(this.children.length / i == 2) {
		    s += this.data;
		}
		s += this.children[i].toInfix();
	    }
	    s += ")";	    
	    return s;
	}
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
		    this.children.length = 0;
		    return this.data;
		} else return false;
		
	    } else throw new UserException("wrong number of arguments for \"" + data + "\" operator");
	} else if(this.children.length === 0) {
	    return this.data;
	} else throw new UserException( "Something is wrong here");
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
	    if(functions[item.data] !== undefined) {
		if(stack.size >= functions[item.data].length) {
		    for(var i = 0; i < functions[item.data].length; i++) {
			item.addChild(stack.pop());
		    }
		    stack.push(item);
		} else throw new UserException("Too many operators");
	    } else if(!isNaN(item.data) || isLetter(item.data)) {
		stack.push(item);
	    } else throw "Unexpected token: " + item;
	    item = new Tree.Node(tokens.remove());
	}
	if(stack.size !== 1) {
	    throw new UserException( "Error interpreting equation: too few operators?");
	} else {
	    //tree.root = stack.pop();
	    return stack.pop();
	}
    }

    Tree.prototype.toInfix = function() {
	return tree.root.toInfix(this.root);
    }



} (window.calculator = window.calculator || {}))