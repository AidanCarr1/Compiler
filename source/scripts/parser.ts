/*  Parser
    Project 2

    Using Recursive Descent Parsing 
    and a Concrete Syntax Tree
*/

namespace Compiler {
    export class Parser {


        public static parse() {
            Control.putParseMessage("parse()");

            //Set the token stream
            parseToken = tokenStream[0];
            parseTokenIndex = 0;
            Control.putDebug(parseToken.str + " " +parseToken.description);

            //Dive in and start:
            this.parseProgram();
            //We made it back safely!
            return true;
        }

        public static parseProgram() {
            Control.putParseMessage("parseProgram()");

            this.parseBlock();
            this.match("EOP");
        }

        public static parseBlock() {
            Control.putParseMessage("parseBlock()");
            
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }

        //INCOMPLETE
        public static parseStatementList() {
            Control.putParseMessage("parseStatementList()");
            
            //Acceptable tokens
            if (["PRINT", "ID", "VARIABLE TYPE", "WHILE", "IF", "OPEN BRACKET"].includes(parseToken.description)) {
                this.parseStatement();
                this.parseStatementList();
            }
            else {
                //do nothing
                //Final statement
            }
        }

        //INCOMPLETE
        public static parseStatement() {
            Control.putParseMessage("parseStatement()");
            
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
                case "OPEN BRACKET":
                    this.parseBlock();
                    break;
                default:
                    //error
            }
            
        }

        public static parsePrintStatement() {
            Control.putParseMessage("parsePrintStatement()");
            
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }

        public static parseAssignmentStatement() {
            Control.putParseMessage("parseAssignmentStatement()");
            
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        
        public static parseVarDecl() {
            Control.putParseMessage("parseVarDecl()");
            
            this.parseType();
            this.parseId();
        }

        public static parseWhileStatement() {
            Control.putParseMessage("parseWhileStatement()");
            
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        public static parseIfStatement() {
            Control.putParseMessage("parseIfStatement()");
            
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        //INCOMPLETE
        public static parseExpr() {
            Control.putParseMessage("parseExpr()");
            //TEMPORARY!!!!!!
            this.match("ID");
            
        }

        //INCOMPLETE
        public static parseIntExpr() {
            Control.putParseMessage("parseIntExpr()");
            
            
        }

        public static parseStringExpr() {
            Control.putParseMessage("parseStringExpr()");
            
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }

        public static parseBooleanExpr() {
            Control.putParseMessage("parseBooleanExpr()");
            
        }

        public static parseId() {
            Control.putParseMessage("parseId()");
            
            
        }

        public static parseCharList() {
            Control.putParseMessage("parseCharList()");
            
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

        public static parseBoolOp() {
            Control.putParseMessage("parseBoolOp()");
            
            
        }

        public static parseBoolVal() {
            Control.putParseMessage("parseBoolVal()");
            
            
        }

        public static parseIntOp() {
            Control.putParseMessage("parseIntOp()");
            
            this.match("ADDITION");
        }



        public static match(str?, strList?) {
            
            //Match found
            if (parseToken.description === str) {
                //Print success
                Control.putMessage(str);
                //Next token
                parseTokenIndex ++;
                parseToken = tokenStream[parseTokenIndex];
            }
            //Match not found
            else {
                warningCount += 10;
                errorCount += 100;
                //Print fail
                Control.putMessage("Expected: ['"+str+"'] found: ['"+parseToken.description+"']");
            }
        }

        
    }
}