/*  Semantic Analysis
    Project 3

    Build an Abstract Syntax Tree (using similar methods to CST)
    Check scope and type
    Create and display symbol table with s&t info
    Report errors and warnings
*/
var Compiler;
(function (Compiler) {
    class Semantic {
        static createAST() {
            astToken = tokenStream[0];
            astTokenIndex = 0;
            this.astProgram();
        }
        static astProgram() {
            Compiler.Control.putASTMessage("astProgram()");
            this.astBlock();
            this.skip("EOP");
        }
        static astBlock() {
            Compiler.Control.putASTMessage("astBlock()");
            _AST.addNode("Block", false);
            this.skip("OPEN BRACE");
            this.astStatementList();
            //If the block has no children, add a fake child for tree printing purposes
            if (_AST.current.children.length == 0) {
                _AST.addNode("SKIP", false);
                _AST.moveUp();
            }
            this.skip("CLOSE BRACE");
            _AST.moveUp();
            //Let SEMANTIC know we are moving up the scope as well
            _AST.nodeList.push(new Compiler.Node("SCOPE UP"));
        }
        static astStatementList() {
            Compiler.Control.putASTMessage("astStatementList()");
            //Acceptable tokens
            switch (astToken.description) {
                case "PRINT":
                case "ID":
                case "VARIABLE TYPE":
                case "WHILE":
                case "IF":
                case "OPEN BRACE":
                    this.astStatement();
                    this.astStatementList();
                    break;
                case "CLOSE BRACE":
                    //Do nothing
                    //Final statement
                    break;
            }
        }
        static astStatement() {
            Compiler.Control.putASTMessage("astStatement()");
            //Acceptable tokens
            switch (astToken.description) {
                case "PRINT":
                    this.astPrintStatement();
                    break;
                case "ID":
                    this.astAssignmentStatement();
                    break;
                case "VARIABLE TYPE":
                    this.astVarDecl();
                    break;
                case "WHILE":
                    this.astWhileStatement();
                    break;
                case "IF":
                    this.astIfStatement();
                    break;
                case "OPEN BRACE":
                    this.astBlock();
                    break;
            }
        }
        static astPrintStatement() {
            Compiler.Control.putASTMessage("astPrintStatement()");
            _AST.addNode("Print", false);
            this.skip("PRINT");
            this.skip("OPEN PARENTHESIS");
            this.astExpr();
            this.skip("CLOSE PARENTHESIS");
            _AST.moveUp();
        }
        static astAssignmentStatement() {
            Compiler.Control.putASTMessage("astAssignmentStatement()");
            _AST.addNode("Assignment", false);
            this.match("ID");
            this.skip("ASSIGNMENT");
            this.astExpr();
            _AST.moveUp();
        }
        static astVarDecl() {
            Compiler.Control.putASTMessage("astVarDecl()");
            _AST.addNode("Var Decl", false);
            this.match("VARIABLE TYPE");
            this.match("ID");
            _AST.moveUp();
        }
        static astWhileStatement() {
            Compiler.Control.putASTMessage("astWhileStatement()");
            _AST.addNode("While", false);
            this.skip("WHILE");
            this.astBooleanExpr();
            this.astBlock();
            _AST.moveUp();
        }
        static astIfStatement() {
            Compiler.Control.putASTMessage("astIfStatement()");
            _AST.addNode("If", false);
            this.skip("IF");
            this.astBooleanExpr();
            this.astBlock();
            _AST.moveUp();
        }
        static astExpr() {
            Compiler.Control.putASTMessage("astExpr()");
            //Acceptable tokens
            switch (astToken.description) {
                case "DIGIT":
                    //digit + ______
                    if (tokenStream[astTokenIndex + 1].description === "ADDITION") {
                        this.astIntExpr();
                    }
                    //digit
                    else {
                        this.match("DIGIT");
                    }
                    break;
                case "QUOTATION":
                    this.astStringExpr();
                    break;
                case "OPEN PARENTHESIS":
                case "BOOLEAN VALUE":
                    this.astBooleanExpr();
                    break;
                case "ID":
                    this.match("ID");
                    break;
            }
        }
        static astIntExpr() {
            Compiler.Control.putASTMessage("astIntExpr()");
            _AST.addNode("Addition", false);
            this.match("DIGIT");
            //num + ...
            if (astToken.description === "ADDITION") {
                this.skip("ADDITION");
                this.astExpr();
            }
            _AST.moveUp();
        }
        static astStringExpr() {
            Compiler.Control.putASTMessage("astStringExpr()");
            //this.skip("QUOTATION");
            this.astCharList();
            this.skip("QUOTATION");
        }
        static astBooleanExpr() {
            Compiler.Control.putASTMessage("astBooleanExpr()");
            //Acceptable tokens
            switch (astToken.description) {
                case "OPEN PARENTHESIS":
                    var newNode = _AST.addNode("Boolean Expr TEMPORARY NAME", false);
                    this.skip("OPEN PARENTHESIS");
                    this.astExpr();
                    var boolOpName = this.astBoolOp(); //whatever the op is here, change the name to boolean expr
                    newNode.name = boolOpName;
                    this.astExpr();
                    this.skip("CLOSE PARENTHESIS");
                    _AST.moveUp();
                    break;
                case "BOOLEAN VALUE":
                    this.match("BOOLEAN VALUE");
                    break;
            }
        }
        static astCharList() {
            Compiler.Control.putASTMessage("astCharList()");
            var charList = "\""; //begin quote
            var firstCharToken = astToken; //point to first quote
            this.skip("QUOTATION");
            while (astToken.description === "CHAR") {
                charList += astToken.str;
                //Next token
                astTokenIndex++;
                astToken = tokenStream[astTokenIndex];
            }
            charList += "\""; //end quote
            _AST.addNode(charList, true, firstCharToken);
        }
        static astBoolOp() {
            Compiler.Control.putASTMessage("astBoolOp()");
            //Acceptable tokens
            switch (astToken.description) {
                case "EQUALITY":
                    this.skip("EQUALITY");
                    return "Equality";
                //break;
                case "INEQUALITY":
                    this.skip("INEQUALITY");
                    return "Inequality";
                //break;
            }
        }
        static match(goalDescription, strList) {
            //Match found
            if (astToken.description === goalDescription) {
                //Print success
                _AST.addNode(astToken.str, true, astToken); //true == Add leaf node
                //Node should point to corresponding Token object
                _AST.current.tokenPointer = astToken;
                //Next token
                astTokenIndex++;
                astToken = tokenStream[astTokenIndex];
            }
        }
        static skip(str) {
            //Next token
            astTokenIndex++;
            astToken = tokenStream[astTokenIndex];
        }
        static checkTypeScope() {
            //Traverse the AST
            /*
            A note on the Symbol Table STRUCTURE:

            Symbol Table Tree: a tree of symbol tables
            Symbol Table: name of scope, parent pointer, table of ids and their symbol nodes
            Symbol Node: info about an id like type, isInherited, isInitialized, isUsed
            */
            //Scope 0
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;
            //currentSymbolTable = null;
            Compiler.Control.putDebug("AST Node list: ");
            for (var i = 0; i < _AST.nodeList.length; i++) {
                Compiler.Control.putDebug(i + ") " + _AST.nodeList[i].name);
            }
            //Go through the AST until we reach the end
            while (currentNode != null) {
                switch (currentNode.name) {
                    case "Block":
                        Compiler.Control.putSemanticMessage("Block Type/Scope Check");
                        //New scope, grow up the tree
                        _SymbolTableTree.addScope();
                        //Go to first statement inside the block
                        this.nextNode();
                        break;
                    case "Var Decl":
                        Compiler.Control.putSemanticMessage("Var Decl Type/Scope Check");
                        //Get type
                        this.nextNode();
                        var type = currentNode.tokenPointer.str; //"int" "boolean" "string"
                        //Get id
                        this.nextNode();
                        var id = currentNode.tokenPointer.str; //"a" "b" "c"...
                        //Put it in the symbol table
                        _SymbolTableTree.newVariable(type, id);
                        //Next statement
                        this.nextNode();
                        break;
                    case "Print":
                        Compiler.Control.putSemanticMessage("Print Type/Scope Check");
                        //What we are printing:
                        this.nextNode();
                        //If printing a variable...
                        if (currentNode.tokenPointer.description === "ID") {
                            //Check that it's not undeclared!
                            if (!_SymbolTableTree.isDeclaredAnyScope(currentNode.tokenPointer.str)) {
                                var newError = new Compiler.ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
                            }
                            else {
                                //_SymbolTableTree.setUsed(id);
                                Compiler.Control.putDebug("Print id " + id + " exists");
                            }
                        }
                        //If printing an expr...
                        else {
                        }
                        //Next statement
                        this.nextNode();
                        break;
                    case "Assignment":
                        Compiler.Control.putSemanticMessage("Assignment Type/Scope Check");
                        //Get id
                        this.nextNode();
                        var id = currentNode.tokenPointer.str; //"a" "b" "c"...
                        Compiler.Control.putDebug("GET NODE ANY SCOPE " + id + ": " + _SymbolTableTree.getSymbolAnyScope(id).type + " " + _SymbolTableTree.getSymbolAnyScope(id).IsUsed);
                        //Check if id has been declared
                        //if (!_SymbolTableTree.isDeclaredAnyScope(currentNode.tokenPointer.str)) {
                        if (_SymbolTableTree.getTypeAnyScope(currentNode.tokenPointer.str) == null) {
                            var newError = new Compiler.ErrorCompiler("UNDECLARED VARIABLE", "Cannot assign a value to " + id, currentNode.tokenPointer.startIndex);
                        }
                        //Get value
                        this.nextNode();
                        //If it's a string constant...
                        if (currentNode.name.charAt(0) === "\"") {
                            //But the id isnt a string
                            if (_SymbolTableTree.getTypeAnyScope(id) !== "string") {
                                var newError = new Compiler.ErrorCompiler("TYPE MISMATCH", "Cannot assign string value to " + _SymbolTableTree.getTypeAnyScope(id) + " variable " + id, currentNode.tokenPointer.startIndex);
                            }
                            Compiler.Control.putDebug("String " + id + " = " + currentNode.name);
                        }
                        //If it's a digit...
                        else if (currentNode.tokenPointer.description === "DIGIT") {
                            //But the id isnt an int
                            if (_SymbolTableTree.getTypeAnyScope(id) !== "int") {
                                var newError = new Compiler.ErrorCompiler("TYPE MISMATCH", "Cannot assign int value to " +
                                    _SymbolTableTree.getTypeAnyScope(id) + " variable " + id, currentNode.tokenPointer.startIndex);
                            }
                            Compiler.Control.putDebug("Int " + id + " = " + currentNode.name);
                        }
                        //If it's a boolean...
                        else if (currentNode.tokenPointer.description === "BOOLEAN VALUE") {
                            //But the id isnt a boolean
                            if (_SymbolTableTree.getTypeAnyScope(id) !== "boolean") {
                                var newError = new Compiler.ErrorCompiler("TYPE MISMATCH", "Cannot assign boolean value to " +
                                    _SymbolTableTree.getTypeAnyScope(id) + " variable " + id, currentNode.tokenPointer.startIndex);
                            }
                            Compiler.Control.putDebug("Int " + id + " = " + currentNode.name);
                        }
                        //If it's an id...
                        else if (currentNode.tokenPointer.description === "ID") {
                            //But the id is undeclared
                            if (!_SymbolTableTree.getTypeAnyScope(currentNode.tokenPointer.str)) {
                                var newError = new Compiler.ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
                            }
                            //But the id types dont match
                            else if (_SymbolTableTree.getTypeAnyScope(id) !== _SymbolTableTree.getTypeAnyScope(currentNode.name)) {
                                var newError = new Compiler.ErrorCompiler("TYPE MISMATCH", "Cannot assign " +
                                    _SymbolTableTree.getTypeAnyScope(currentNode.name) + " variable " + currentNode.name + " to " +
                                    _SymbolTableTree.getTypeAnyScope(id) + " variable " + id, currentNode.tokenPointer.startIndex);
                            }
                            Compiler.Control.putDebug("Int " + id + " = " + currentNode.name);
                        }
                        //If it's addition...
                        //keep checking down and down until you reach the end to see if its all ints
                        //Next statement
                        this.nextNode();
                        break;
                    //End of block, scope up
                    case "SCOPE UP":
                        Compiler.Control.putSemanticMessage("Scope Up");
                        _SymbolTableTree.moveUp();
                        //Next statement
                        this.nextNode();
                        //this.nextNode();
                        break;
                    default:
                        Compiler.Control.putSemanticMessage("ERROR, unknown Node name: " + currentNode.name);
                        this.nextNode();
                    // //Type match
                    // switch (type) {
                    //     case "int":
                    //     case "boolean":
                    //     case "string":
                    // }
                }
            }
            //Control.putASTMessage("DONE WITH TYPE SCOPE CHECK WHILE LOOP");
        }
        static nextNode() {
            nodeCounter++;
            //Control.putDebug("prev node: " +currentNode.name);
            if (nodeCounter >= (_AST.nodeList).length) {
                currentNode = null;
            }
            else {
                currentNode = _AST.nodeList[nodeCounter];
            }
            // if (currentNode != null) {
            //     Control.putDebug("next node " +nodeCounter+") "+currentNode.name);
            // }
        }
    }
    Compiler.Semantic = Semantic;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=semantic.js.map