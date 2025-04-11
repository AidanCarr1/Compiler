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
            this.skip("CLOSE BRACE");
            _AST.moveUp();
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
            this.skip("QUOTATION");
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
            var firstCharToken = astToken;
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
                    break;
                case "INEQUALITY":
                    this.skip("INEQUALITY");
                    return "Inequality";
                    break;
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
            //Scope 0
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;
            switch (currentNode.name) {
                case "Block":
                    //New scope, grow up the tree
                    this.newScope();
                    //Go to first statement inside the block
                    this.nextNode();
                    break;
                case "Var Decl":
                    //Get type
                    this.nextNode();
                    var type = currentNode.tokenPointer.str; //"int" "boolean" "string"
                    //Get id
                    this.nextNode();
                    var id = currentNode.tokenPointer.str; //"a" "b" "c"...
                    //Put it in the symbol table
                    this.newVariable(type, id);
                // //Type match
                // switch (type) {
                //     case "int":
                //     case "boolean":
                //     case "string":
                // }
            }
        }
        static newScope() {
            _ScopeTree.addNode("SCOPE " + scopeCounter);
            scopeCounter++;
        }
        static nextNode() {
            nodeCounter++;
            currentNode = _AST.nodeList[nodeCounter];
        }
        static newVariable(type, id) {
            var symbolTable = _ScopeTree.current.symbolTable;
            symbolTable.newVariable(type, id);
        }
    }
    Compiler.Semantic = Semantic;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=semantic.js.map