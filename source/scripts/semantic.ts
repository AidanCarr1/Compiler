/*  Semantic Analysis
    Project 3

    Build an Abstract Syntax Tree (using similar methods to CST)
    Check scope and type
    Create and display symbol table with s&t info
    Report errors and warnings
*/

namespace Compiler {
    export class Semantic {


        public static createAST(){
            astToken = tokenStream[0];
            astTokenIndex = 0;

            this.astProgram();
        }

        public static astProgram() {
            Control.putASTMessage("astProgram()");

            this.astBlock();
            this.skip("EOP");
        }

        public static astBlock() {
            Control.putASTMessage("astBlock()");
            _AST.addNode("Block", false);

            this.skip("OPEN BRACE");
            this.astStatementList();
            this.skip("CLOSE BRACE");

            _AST.moveUp();
        }

        public static astStatementList() {
            Control.putASTMessage("astStatementList()");

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

        public static astStatement() {
            Control.putASTMessage("astStatement()");

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

        public static astPrintStatement() {
            Control.putASTMessage("astPrintStatement()");
            _AST.addNode("Print", false);

            this.skip("PRINT");
            this.skip("OPEN PARENTHESIS");
            this.astExpr();
            this.skip("CLOSE PARENTHESIS");
            
            _AST.moveUp();
        }

        public static astAssignmentStatement() {
            Control.putASTMessage("astAssignmentStatement()");
            _AST.addNode("Assignment", false);

            this.match("ID");
            this.skip("ASSIGNMENT");
            this.astExpr();
            
            _AST.moveUp();
        }
        
        public static astVarDecl() {
            Control.putASTMessage("astVarDecl()");
            _AST.addNode("Var Decl", false);

            this.match("VARIABLE TYPE");
            this.match("ID");
            
            _AST.moveUp();
        }

        public static astWhileStatement() {
            Control.putASTMessage("astWhileStatement()");
            _AST.addNode("While", false);

            this.skip("WHILE");
            this.astBooleanExpr();
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astIfStatement() {
            Control.putASTMessage("astIfStatement()");
            _AST.addNode("If", false);

            this.skip("IF");
            this.astBooleanExpr();
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astExpr() {
            Control.putASTMessage("astExpr()");

            //Acceptable tokens
            switch (astToken.description) {
                
                case "DIGIT":
                    //digit + ______
                    if (tokenStream[astTokenIndex+1].description === "ADDITION") {
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

        public static astIntExpr() {
            Control.putASTMessage("astIntExpr()");
            _AST.addNode("Addition", false);

            this.match("DIGIT");
            //num + ...
            if (astToken.description === "ADDITION") {
                this.skip("ADDITION");
                this.astExpr();
            }
            
            _AST.moveUp();
        }

        public static astStringExpr() {
            Control.putASTMessage("astStringExpr()");

            this.skip("QUOTATION");
            this.astCharList();
            this.skip("QUOTATION");
        }

        public static astBooleanExpr() {
            Control.putASTMessage("astBooleanExpr()");



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

        public static astCharList() {
            Control.putASTMessage("astCharList()");

            var charList = "\""; //begin quote
            var firstCharToken = astToken;
            while (astToken.description === "CHAR") {
                charList += astToken.str;
                
                //Next token
                astTokenIndex ++;
                astToken = tokenStream[astTokenIndex];

            }
            charList += "\""; //end quote
            _AST.addNode(charList, true, firstCharToken);
            
        }
        
        public static astBoolOp(): String {
            Control.putASTMessage("astBoolOp()");

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


        public static match(goalDescription?, strList?) {
            
            //Match found
            if (astToken.description === goalDescription) {
                //Print success
                _AST.addNode(astToken.str, true, astToken); //true == Add leaf node
                //Node should point to corresponding Token object
                _AST.current.tokenPointer = astToken;

                //Next token
                astTokenIndex ++;
                astToken = tokenStream[astTokenIndex];
            }
        }

        public static skip(str?){
            //Next token
            astTokenIndex ++;
            astToken = tokenStream[astTokenIndex];
        }


        public static checkTypeScope(){

            //Traverse the AST
            //Scope 0
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;
            
            //Go through the AST until we reach the end
            while (currentNode != null) {

                switch (currentNode.name) {

                    case "Block":
                        Control.putDebug("Block");

                        //New scope, grow up the tree
                        this.newScope();
                        //Go to first statement inside the block
                        this.nextNode();
                        break;

                    case "Var Decl":
                        Control.putDebug("Var Decl");

                        //Get type
                        this.nextNode();
                        var type:String = currentNode.tokenPointer.str; //"int" "boolean" "string"
                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        //Put it in the symbol table
                        this.newVariable(type, id);

                        //Next statement
                        this.nextNode();
                        break;
                    
                    case "Print":
                        Control.putDebug("Print");

                        //What we are printing:
                        this.nextNode();

                        //If printing a variable...
                        if (currentNode.tokenPointer.description === "ID") {
                            
                            //Is it declared?
                            var symbolTable = _ScopeTree.current.symbolTable;
                            if (symbolTable.isDeclared(currentNode.tokenPointer.str)) {
                                //Then we are fine
                            }
                            else {
                                var newError = new ErrorCompiler("UNDELCARED VARIABLE REFERENCE", id, currentNode.tokenPointer.startIndex);
                            }
                        } 
                        break;

                    default:
                        Control.putDebug("unknown:"+currentNode.name);
                        this.nextNode();

                        // //Type match
                        // switch (type) {

                        //     case "int":

                        //     case "boolean":

                        //     case "string":


                        // }


                }
            }

            Control.putASTMessage("DONE WITH TYPE SCOPE CHECK WHILE LOOP");


        } 

        public static newScope() {
            Control.putDebug("new scope");
            _ScopeTree.addNode("SCOPE "+scopeCounter);
            scopeCounter++;
            //Control.putDebug("done new scope");
        }

        public static nextNode() {
            Control.putDebug("next node");
            //Control.putDebug("list: "+(_AST.nodeList));
            //Control.putDebug("len: "+(_AST.nodeList).length);
            nodeCounter++;
            if (nodeCounter >= (_AST.nodeList).length) {
                //Control.putDebug("no more nodes");
                currentNode = null;
            }
            else {
                //Control.putDebug("found a next node");
                currentNode = _AST.nodeList[nodeCounter];
            }
            //Control.putDebug("done next node");
        }

        public static newVariable(type, id) {
            Control.putDebug("new var");
            var symbolTable = _ScopeTree.current.symbolTable;
            Control.putDebug(symbolTable);
            symbolTable.newVariable(type, id);
            Control.putDebug("done new var");
        }
    }
}
