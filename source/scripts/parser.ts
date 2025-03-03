/*  Parser
    Project 2

    Using Recursive Descent Parsing 
    and a Concrete Syntax Tree
*/

namespace Compiler {
    export class Parser {


        public static parseProgram() {
            Control.putMessage("PARSE: parseProgram()");

            this.parseBlock();
            this.match("EOP");
        }

        public static parseBlock() {
            Control.putMessage("PARSE: parseBlock()");
            
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }

        //INCOMPLETE
        public static parseStatementList() {
            Control.putMessage("PARSE: parseStatementList()");
            
            //if (token in print, assignment, vardec...)
                this.parseStatement();
                this.parseStatementList();
            //else
                //do nothing
                //Final statement
        }

        //INCOMPLETE
        public static parseStatement() {
            Control.putMessage("PARSE: parseStatement()");
            
        }

        public static parsePrintStatement() {
            Control.putMessage("PARSE: parsePrintStatement()");
            
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }

        public static parseAssignmentStatement() {
            Control.putMessage("PARSE: parseAssignmentStatement()");
            
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        
        public static parseVarDecl() {
            Control.putMessage("PARSE: parseVarDecl()");
            
            this.parseType();
            this.parseId();
        }

        public static parseWhileStatement() {
            Control.putMessage("PARSE: parseWhileStatement()");
            
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        public static parseIfStatement() {
            Control.putMessage("PARSE: parseIfStatement()");
            
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        //INCOMPLETE
        public static parseExpr() {
            Control.putMessage("PARSE: parseExpr()");
            
            
        }

        //INCOMPLETE
        public static parseIntExpr() {
            Control.putMessage("PARSE: parseIntExpr()");
            
            
        }

        public static parseStringExpr() {
            Control.putMessage("PARSE: parseStringExpr()");
            
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }

        public static parseBooleanExpr() {
            Control.putMessage("PARSE: parseBooleanExpr()");
            
        }

        public static parseId() {
            Control.putMessage("PARSE: parseId()");
            
            
        }

        public static parseCharList() {
            Control.putMessage("PARSE: parseCharList()");
            
        }

        public static parseType() {
            Control.putMessage("PARSE: parseType()");
            
            this.match("VARIABLE TYPE");
        }

        //INCOMPLETE - check with space and char dictionary
        public static parseChar() {
            Control.putMessage("PARSE: parseChar()");
            
            this.match("CHAR");
        }

        //INCOMPLETE - check with space and char dictionary
        public static parseSpace() {
            Control.putMessage("PARSE: parseSpace()");
            
            this.match("SPACE CHAR");
        }

        public static parseDigit() {
            Control.putMessage("PARSE: parseDigit()");
            
            this.match("DIGIT");
        }

        public static parseBoolOp() {
            Control.putMessage("PARSE: parseBoolOp()");
            
            
        }

        public static parseBoolVal() {
            Control.putMessage("PARSE: parseBoolVal()");
            
            
        }

        public static parseIntOp() {
            Control.putMessage("PARSE: parseIntOp()");
            
            this.match("ADDITION");
        }



        public static match(str?, strList?) {

        }

        
    }
}