/*  Parser
    Project 2

    Using Recursive Descent Parsing
    and a Concrete Syntax Tree
*/
var Compiler;
(function (Compiler) {
    class Parser {
        static parse() {
            Compiler.Control.putParseMessage("parse()");
            //Set the token stream
            parseToken = tokenStream[0];
            parseTokenIndex = 0;
            Compiler.Control.putDebug("First token: " + parseToken.str + " " + parseToken.description);
            //Dive in and start:
            this.parseProgram();
            //We made it back safely!
            return true;
        }
        static parseProgram() {
            Compiler.Control.putParseMessage("parseProgram()");
            _CST.addNode("Program", false);
            this.parseBlock();
            this.match("EOP");
            _CST.moveUp();
        }
        static parseBlock() {
            Compiler.Control.putParseMessage("parseBlock()");
            _CST.addNode("Block", false);
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
            _CST.moveUp();
        }
        static parseStatementList() {
            Compiler.Control.putParseMessage("parseStatementList()");
            _CST.addNode("Statement List", false);
            //Acceptable tokens
            switch (parseToken.description) {
                case "PRINT":
                case "ID":
                case "VARIABLE TYPE":
                case "WHILE":
                case "IF":
                case "OPEN BRACE":
                    //??Only add the statement list Node if there is a statement??
                    //_CST.addNode("Statement List", false);
                    this.parseStatement();
                    this.parseStatementList();
                    break;
                case "CLOSE BRACE":
                    //Do nothing
                    //Final statement
                    break;
                default:
                    //Error with info
                    var newError = new Compiler.ErrorCompiler("Invalid Statement", "Found: " + parseToken.description +
                        " Expected: PRINT, ID, VARIABLE TYPE, WHILE, IF, OPEN BRACE, CLOSE BRACE", parseToken.startIndex);
            }
            _CST.moveUp();
        }
        static parseStatement() {
            Compiler.Control.putParseMessage("parseStatement()");
            _CST.addNode("Statement", false);
            //Acceptable tokens
            switch (parseToken.description) {
                case "PRINT":
                    this.parsePrintStatement();
                    break;
                case "ID":
                    this.parseAssignmentStatement();
                    break;
                case "VARIABLE TYPE":
                    this.parseVarDecl();
                    break;
                case "WHILE":
                    this.parseWhileStatement();
                    break;
                case "IF":
                    this.parseIfStatement();
                    break;
                case "OPEN BRACE":
                    this.parseBlock();
                    break;
                default:
                    Compiler.Control.putMessage("How did we get here?");
                //Should not be possible    
                //No statement found
            }
            _CST.moveUp();
        }
        static parsePrintStatement() {
            Compiler.Control.putParseMessage("parsePrintStatement()");
            _CST.addNode("Print Statement", false);
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
            _CST.moveUp();
        }
        static parseAssignmentStatement() {
            Compiler.Control.putParseMessage("parseAssignmentStatement()");
            _CST.addNode("Assignment Statement", false);
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
            _CST.moveUp();
        }
        static parseVarDecl() {
            Compiler.Control.putParseMessage("parseVarDecl()");
            _CST.addNode("Var Decl", false);
            this.match("VARIABLE TYPE");
            this.match("ID");
            _CST.moveUp();
        }
        static parseWhileStatement() {
            Compiler.Control.putParseMessage("parseWhileStatement()");
            _CST.addNode("While Statement", false);
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
            _CST.moveUp();
        }
        static parseIfStatement() {
            Compiler.Control.putParseMessage("parseIfStatement()");
            _CST.addNode("If Statement", false);
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
            _CST.moveUp();
        }
        static parseExpr() {
            Compiler.Control.putParseMessage("parseExpr()");
            _CST.addNode("Expr", false);
            //Acceptable tokens
            switch (parseToken.description) {
                case "DIGIT":
                    this.parseIntExpr();
                    break;
                case "QUOTATION":
                    this.parseStringExpr();
                    break;
                case "OPEN PARENTHESIS":
                case "BOOLEAN VALUE":
                    this.parseBooleanExpr();
                    break;
                case "ID":
                    this.match("ID");
                    break;
                default:
                    //Error with info
                    var newError = new Compiler.ErrorCompiler("Invalid Expr", "Found: " + parseToken.description +
                        " Expected: DIGIT, QUOTATION, OPEN PARENTHESIS, BOOLEAN VALUE, ID", parseToken.startIndex);
            }
            _CST.moveUp();
        }
        static parseIntExpr() {
            Compiler.Control.putParseMessage("parseIntExpr()");
            _CST.addNode("Int Expr", false);
            this.match("DIGIT");
            //num + ...
            if (parseToken.description === "ADDITION") {
                this.match("ADDITION");
                this.parseExpr();
            }
            _CST.moveUp();
        }
        static parseStringExpr() {
            Compiler.Control.putParseMessage("parseStringExpr()");
            _CST.addNode("String Expr", false);
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
            _CST.moveUp();
        }
        static parseBooleanExpr() {
            Compiler.Control.putParseMessage("parseBooleanExpr()");
            _CST.addNode("Boolean Expr", false);
            //CHECK CODE
            //how do i want to handle error i guess..
            //Acceptable tokens
            switch (parseToken.description) {
                case "OPEN PARENTHESIS":
                    this.match("OPEN PARENTHESIS");
                    this.parseExpr();
                    this.parseBoolOp();
                    this.parseExpr();
                    this.match("CLOSE PARENTHESIS");
                    break;
                case "BOOLEAN VALUE":
                    this.match("BOOLEAN VALUE");
                    break;
                default:
                    //Error with info
                    var newError = new Compiler.ErrorCompiler("Invalid Boolean Expr", "Found: " + parseToken.description +
                        " Expected: OPEN PARENTHESIS, BOOLEAN VALUE", parseToken.startIndex);
            }
            _CST.moveUp();
        }
        static parseCharList() {
            Compiler.Control.putParseMessage("parseCharList()");
            _CST.addNode("Char List", false);
            if (parseToken.description === "CHAR") {
                this.match("CHAR");
                this.parseCharList();
            }
            else {
                //End of char list
            }
            _CST.moveUp();
        }
        static parseBoolOp() {
            Compiler.Control.putParseMessage("parseBoolOp()");
            _CST.addNode("Bool Op", false);
            //Acceptable tokens
            switch (parseToken.description) {
                case "EQUALITY":
                    this.match("EQUALITY");
                    break;
                case "INEQUALITY":
                    this.match("INEQUALITY");
                default:
                    //Error with info
                    var newError = new Compiler.ErrorCompiler("Invalid Bool Op", "Found: " + parseToken.description +
                        " Expected: EQUALITY, INEQUALITY", parseToken.startIndex);
            }
            _CST.moveUp();
        }
        /*
                public static parseId() {
                    Control.putParseMessage("parseId()");
                    
                    this.match("ID");
                    
                }
        
                public static parseType() {
                    Control.putParseMessage("parseType()");
                    
                    this.match("VARIABLE TYPE");
                }
        
                //INCOMPLETE - check with space and char dictionary
                public static parseChar() {
                    Control.putParseMessage("parseChar()");
                    
                    this.match("CHAR");
                }
        
                //INCOMPLETE - check with space and char dictionary
                public static parseSpace() {
                    Control.putParseMessage("parseSpace()");
                    
                    this.match("SPACE CHAR");
                }
        
                public static parseDigit() {
                    Control.putParseMessage("parseDigit()");
                    
                    this.match("DIGIT");
                }
        
                
        
                public static parseBoolVal() {
                    Control.putParseMessage("parseBoolVal()");
                    
                    
                }
        
                public static parseIntOp() {
                    Control.putParseMessage("parseIntOp()");
                    
                    this.match("ADDITION");
                }
        */
        static match(goalDescription, strList) {
            //Match found
            if (parseToken.description === goalDescription) {
                //Print success
                //Control.putDebug(goalDescription);
                _CST.addNode(parseToken.str, true, parseToken); //true == Add leaf node
                //Node should point to corresponding Token object
                _CST.current.tokenPointer = parseToken;
                //Next token
                parseTokenIndex++;
                parseToken = tokenStream[parseTokenIndex];
            }
            //Match not found
            else {
                //Track the FIRST Error
                //if (errorCount <= 0) {
                //errorCount += 1;
                var newError = new Compiler.ErrorCompiler("Incorrect Token", "Found: '" + parseToken.description + "' Expected: '" + goalDescription + "'", parseToken.startIndex);
                //Control.putMessage("Found: ['"+parseToken.description+"'] Expected: ['"+goalDescription+"'] at "+Utils.address(parseToken.startIndex));
                //}                
            }
        }
    }
    Compiler.Parser = Parser;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=parser.js.map