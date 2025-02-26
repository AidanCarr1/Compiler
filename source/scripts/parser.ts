/*  Parser
    Project 2

    Using Recursive Descent Parsing 
    and a Concrete Syntax Tree
*/

namespace Compiler {
    export class Parser {


        public static parseProgram() {
            this.parseBlock();
            this.match("EOP");
        }

        public static parseBlock() {
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }

        //INCOMPLETE
        public static parseStatementList() {
            //if (token in print, assignment, vardec...)
                this.parseStatement();
                this.parseStatementList();
            //else
                //do nothing
                //Final statement
        }

        //INCOMPLETE
        public static parseStatement() {
            
        }

        public static parsePrintStatement() {
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }

        public static parseAssignmentStatement() {
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        
        public static parseVarDecl() {
            this.parseType();
            this.parseId();
        }

        public static parseWhileStatement() {
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        public static parseIfStatement() {
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }

        //INCOMPLETE
        public static parseExpr() {
            
        }

        //INCOMPLETE
        public static parseIntExpr() {
            
        }

        public static parseStringExpr() {
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }

        public static parseBooleanExpr() {
            
        }

        public static parseId() {
            
        }

        public static parseCharList() {
            
        }

        public static parseType() {
            this.match("VARIABLE TYPE");
        }

        //INCOMPLETE - check with space and char dictionary
        public static parseChar() {
            this.match("CHAR");
        }

        //INCOMPLETE - check with space and char dictionary
        public static parseSpace() {
            this.match("SPACE CHAR");
        }

        public static parseDigit() {
            this.match("DIGIT");
        }

        public static parseBoolOp() {
            
        }

        public static parseBoolVal() {
            
        }

        public static parseIntOp() {
            this.match("ADDITION");
        }



        public static match(str?, strList?) {

        }

        
    }
}