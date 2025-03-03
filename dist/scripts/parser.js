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
            Compiler.Control.putDebug(parseToken.str + " " + parseToken.description);
            //Dive in and start:
            this.parseProgram();
            //We made it back safely!
            return true;
        }
        static parseProgram() {
            Compiler.Control.putParseMessage("parseProgram()");
            this.parseBlock();
            this.match("EOP");
        }
        static parseBlock() {
            Compiler.Control.putParseMessage("parseBlock()");
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }
        static parseStatementList() {
            Compiler.Control.putParseMessage("parseStatementList()");
            //Acceptable tokens
            switch (parseToken.description) {
                case "PRINT":
                case "ID":
                case "VARIABLE TYPE":
                case "WHILE":
                case "IF":
                case "OPEN BRACE":
                    this.parseStatement();
                    this.parseStatementList();
                default:
                //Do nothing
                //Final statement
            }
        }
        static parseStatement() {
            Compiler.Control.putParseMessage("parseStatement()");
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
                //error
            }
        }
        static parsePrintStatement() {
            Compiler.Control.putParseMessage("parsePrintStatement()");
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }
        static parseAssignmentStatement() {
            Compiler.Control.putParseMessage("parseAssignmentStatement()");
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        static parseVarDecl() {
            Compiler.Control.putParseMessage("parseVarDecl()");
            this.parseType();
            this.parseId();
        }
        static parseWhileStatement() {
            Compiler.Control.putParseMessage("parseWhileStatement()");
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        static parseIfStatement() {
            Compiler.Control.putParseMessage("parseIfStatement()");
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        static parseExpr() {
            Compiler.Control.putParseMessage("parseExpr()");
            //Acceptable tokens
            switch (parseToken.description) {
                case "DIGIT":
                    this.parseIntExpr();
                    break;
                case "QUOTATION":
                    this.parseStringExpr();
                    break;
                case "OPEN PARENTHESIS":
                case "TRUE":
                case "FALSE":
                    this.parseBooleanExpr();
                    break;
                case "ID":
                    this.parseId();
                    break;
                default:
                //error  
            }
        }
        //INCOMPLETE
        static parseIntExpr() {
            Compiler.Control.putParseMessage("parseIntExpr()");
        }
        static parseStringExpr() {
            Compiler.Control.putParseMessage("parseStringExpr()");
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }
        static parseBooleanExpr() {
            Compiler.Control.putParseMessage("parseBooleanExpr()");
        }
        static parseId() {
            Compiler.Control.putParseMessage("parseId()");
        }
        static parseCharList() {
            Compiler.Control.putParseMessage("parseCharList()");
        }
        static parseType() {
            Compiler.Control.putParseMessage("parseType()");
            this.match("VARIABLE TYPE");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseChar() {
            Compiler.Control.putParseMessage("parseChar()");
            this.match("CHAR");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseSpace() {
            Compiler.Control.putParseMessage("parseSpace()");
            this.match("SPACE CHAR");
        }
        static parseDigit() {
            Compiler.Control.putParseMessage("parseDigit()");
            this.match("DIGIT");
        }
        static parseBoolOp() {
            Compiler.Control.putParseMessage("parseBoolOp()");
        }
        static parseBoolVal() {
            Compiler.Control.putParseMessage("parseBoolVal()");
        }
        static parseIntOp() {
            Compiler.Control.putParseMessage("parseIntOp()");
            this.match("ADDITION");
        }
        static match(str, strList) {
            //Match found
            if (parseToken.description === str) {
                //Print success
                Compiler.Control.putMessage(str);
                //Next token
                parseTokenIndex++;
                parseToken = tokenStream[parseTokenIndex];
            }
            //Match not found
            else {
                warningCount += 10;
                errorCount += 100;
                //Print fail
                Compiler.Control.putMessage("Found: ['" + parseToken.description + "'] Expected: ['" + str + "'] at " + Compiler.Utils.address(parseToken.startIndex));
            }
        }
    }
    Compiler.Parser = Parser;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=parser.js.map