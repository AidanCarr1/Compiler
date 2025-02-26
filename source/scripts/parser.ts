/* parser.js  



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
            
        }

        public static parseChar() {
            
        }

        public static parseSpace() {
            
        }

        public static parseDigit() {
            
        }

        public static parseBoolOp() {
            
        }

        public static parseBoolVal() {
            
        }
        public static parseIntOp() {
            
        }



        public static match(str?, strList?) {

        }

        
    }
}