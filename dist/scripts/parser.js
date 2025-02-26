/*  Parser
    Project 2

    Using Recursive Descent Parsing
    and a Concrete Syntax Tree
*/
var Compiler;
(function (Compiler) {
    class Parser {
        static parseProgram() {
            this.parseBlock();
            this.match("EOP");
        }
        static parseBlock() {
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }
        //INCOMPLETE
        static parseStatementList() {
            //if (token in print, assignment, vardec...)
            this.parseStatement();
            this.parseStatementList();
            //else
            //do nothing
            //Final statement
        }
        //INCOMPLETE
        static parseStatement() {
        }
        static parsePrintStatement() {
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }
        static parseAssignmentStatement() {
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        static parseVarDecl() {
            this.parseType();
            this.parseId();
        }
        static parseWhileStatement() {
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        static parseIfStatement() {
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        //INCOMPLETE
        static parseExpr() {
        }
        //INCOMPLETE
        static parseIntExpr() {
        }
        static parseStringExpr() {
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }
        static parseBooleanExpr() {
        }
        static parseId() {
        }
        static parseCharList() {
        }
        static parseType() {
            this.match("VARIABLE TYPE");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseChar() {
            this.match("CHAR");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseSpace() {
            this.match("SPACE CHAR");
        }
        static parseDigit() {
            this.match("DIGIT");
        }
        static parseBoolOp() {
        }
        static parseBoolVal() {
        }
        static parseIntOp() {
            this.match("ADDITION");
        }
        static match(str, strList) {
        }
    }
    Compiler.Parser = Parser;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=parser.js.map