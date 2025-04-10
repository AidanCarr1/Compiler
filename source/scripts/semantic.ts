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
            Control.putParseMessage("astProgram()");
            //_AST.addNode("Program", false);

            this.astBlock();
            this.skip("EOP");

            //_AST.moveUp();
        }

        public static astBlock() {
            Control.putParseMessage("astBlock()");
            _AST.addNode("Block", false);

            this.skip("OPEN BRACE");
            this.astStatementList();
            this.skip("CLOSE BRACE");

            _AST.moveUp();
        }

        public static astStatementList() {
            Control.putParseMessage("astStatementList()");
            //_AST.addNode("Statement List", false);

            //Acceptable tokens
            switch (astToken.description) {
                
                case "PRINT":
                case "ID":
                case "VARIABLE TYPE":
                case "WHILE":
                case "IF":
                case "OPEN BRACE":
                    //??Only add the statement list Node if there is a statement??
                    //_AST.addNode("Statement List", false);

                    this.astStatement();
                    this.astStatementList();
                    break;

                case "CLOSE BRACE":
                    //Do nothing
                    //Final statement
                    break;

                // default:
                //     //Error with info
                //     var newError = new ErrorCompiler("Invalid Statement", "Found: "+astToken.description+
                //         " Expected: PRINT, ID, VARIABLE TYPE, WHILE, IF, OPEN BRACE, CLOSE BRACE", astToken.startIndex);
            
                    
            }
            
            //_AST.moveUp();
        }

        public static astStatement() {
            Control.putParseMessage("astStatement()");
            //_AST.addNode("Statement", false);

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
                
                default:
                    Control.putMessage("How did we get here?");
                    //Should not be possible    
                    //No statement found
            }  
            
            //_AST.moveUp();  
        }

        public static astPrintStatement() {
            Control.putParseMessage("astPrintStatement()");
            _AST.addNode("Print Statement", false);

            this.skip("PRINT");
            this.skip("OPEN PARENTHESIS");
            this.astExpr();
            this.skip("CLOSE PARENTHESIS");
            
            _AST.moveUp();
        }

        public static astAssignmentStatement() {
            Control.putParseMessage("astAssignmentStatement()");
            _AST.addNode("Assignment Statement", false);

            this.match("ID");
            this.skip("ASSIGNMENT");
            this.astExpr();
            
            _AST.moveUp();
        }
        
        public static astVarDecl() {
            Control.putParseMessage("astVarDecl()");
            _AST.addNode("Var Decl", false);

            this.match("VARIABLE TYPE");
            this.match("ID");
            
            _AST.moveUp();
        }

        public static astWhileStatement() {
            Control.putParseMessage("astWhileStatement()");
            _AST.addNode("While Statement", false);

            this.skip("WHILE");
            //this.match("OPEN PARENTHESIS");
            this.astBooleanExpr();
            //this.match("CLOSE PARENTHESIS");
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astIfStatement() {
            Control.putParseMessage("astIfStatement()");
            _AST.addNode("If Statement", false);

            this.skip("IF");
            //this.match("OPEN PARENTHESIS");
            this.astBooleanExpr();
            //this.match("CLOSE PARENTHESIS");
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astExpr() {
            Control.putParseMessage("astExpr()");
            //_AST.addNode("Expr", false);

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
                
                default:
                    //Error with info
                    var newError = new ErrorCompiler("Invalid Expr", "Found: "+astToken.description+
                        " Expected: DIGIT, QUOTATION, OPEN PARENTHESIS, BOOLEAN VALUE, ID", astToken.startIndex);
            }    
            
            //_AST.moveUp();      
        }

        public static astIntExpr() {
            Control.putParseMessage("astIntExpr()");
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
            Control.putParseMessage("astStringExpr()");
            //_AST.addNode("String Expr", false);

            this.skip("QUOTATION");
            this.astCharList();
            this.skip("QUOTATION");
            
            //_AST.moveUp();
        }

        public static astBooleanExpr() {
            Control.putParseMessage("astBooleanExpr()");



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

                // default:
                //     //Error with info
                //     var newError = new ErrorCompiler("Invalid Boolean Expr", "Found: "+astToken.description+
                //         " Expected: OPEN PARENTHESIS, BOOLEAN VALUE", astToken.startIndex);
            }
            
            
        }

        public static astCharList() {
            Control.putParseMessage("astCharList()");
            //_AST.addNode("Char List", false);

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
            
            //_AST.moveUp();
        }
        
        public static astBoolOp(): String {
            Control.putParseMessage("astBoolOp()");
            //_AST.addNode("Bool Op", false);

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

                // default:
                //     //Error with info
                //     var newError = new ErrorCompiler("Invalid Bool Op", "Found: "+astToken.description+
                //         " Expected: EQUALITY, INEQUALITY", astToken.startIndex);
            }
            
            //_AST.moveUp();
        }


        public static match(goalDescription?, strList?) {
            
            //Match found
            if (astToken.description === goalDescription) {
                //Print success
                //Control.putDebug(goalDescription);
                _AST.addNode(astToken.str, true, astToken); //true == Add leaf node
                //Node should point to corresponding Token object
                _AST.current.tokenPointer = astToken;

                //Next token
                astTokenIndex ++;
                astToken = tokenStream[astTokenIndex];
            }

            //Match not found
            // else {
            //     //Track the FIRST Error
            //     //if (errorCount <= 0) {
            //         //errorCount += 1;
            //         var newError = new ErrorCompiler("Incorrect Token","Found: '"+astToken.description+"' Expected: '"+goalDescription+"'", astToken.startIndex);
            //         //Control.putMessage("Found: ['"+astToken.description+"'] Expected: ['"+goalDescription+"'] at "+Utils.address(astToken.startIndex));
            //     //}                
            // }
        }

        public static skip(str?){
            //Next token
            astTokenIndex ++;
            astToken = tokenStream[astTokenIndex];
        }

        public static checkTypeScope(){

        } 

        

        
    }
}
