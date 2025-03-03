/*  Parser
    Project 2

    Using Recursive Descent Parsing
    and a Concrete Syntax Tree
*/
var Compiler;
(function (Compiler) {
    class Parser {
        static parseProgram() {
            Compiler.Control.putMessage("PARSE: parseProgram()");
            this.parseBlock();
            this.match("EOP");
        }
        static parseBlock() {
            Compiler.Control.putMessage("PARSE: parseBlock()");
            this.match("OPEN BRACE");
            this.parseStatementList();
            this.match("CLOSE BRACE");
        }
        //INCOMPLETE
        static parseStatementList() {
            Compiler.Control.putMessage("PARSE: parseStatementList()");
            //if (token in print, assignment, vardec...)
            this.parseStatement();
            this.parseStatementList();
            //else
            //do nothing
            //Final statement
        }
        //INCOMPLETE
        static parseStatement() {
            Compiler.Control.putMessage("PARSE: parseStatement()");
        }
        static parsePrintStatement() {
            Compiler.Control.putMessage("PARSE: parsePrintStatement()");
            this.match("PRINT");
            this.match("OPEN PARENTHESIS");
            this.parseExpr();
            this.match("CLOSE PARENTHESIS");
        }
        static parseAssignmentStatement() {
            Compiler.Control.putMessage("PARSE: parseAssignmentStatement()");
            this.match("ID");
            this.match("ASSIGNMENT");
            this.parseExpr();
        }
        static parseVarDecl() {
            Compiler.Control.putMessage("PARSE: parseVarDecl()");
            this.parseType();
            this.parseId();
        }
        static parseWhileStatement() {
            Compiler.Control.putMessage("PARSE: parseWhileStatement()");
            this.match("WHILE");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        static parseIfStatement() {
            Compiler.Control.putMessage("PARSE: parseIfStatement()");
            this.match("IF");
            this.parseBooleanExpr();
            this.parseBlock();
        }
        //INCOMPLETE
        static parseExpr() {
            Compiler.Control.putMessage("PARSE: parseExpr()");
        }
        //INCOMPLETE
        static parseIntExpr() {
            Compiler.Control.putMessage("PARSE: parseIntExpr()");
        }
        static parseStringExpr() {
            Compiler.Control.putMessage("PARSE: parseStringExpr()");
            this.match("QUOTATION");
            this.parseCharList();
            this.match("QUOTATION");
        }
        static parseBooleanExpr() {
            Compiler.Control.putMessage("PARSE: parseBooleanExpr()");
        }
        static parseId() {
            Compiler.Control.putMessage("PARSE: parseId()");
        }
        static parseCharList() {
            Compiler.Control.putMessage("PARSE: parseCharList()");
        }
        static parseType() {
            Compiler.Control.putMessage("PARSE: parseType()");
            this.match("VARIABLE TYPE");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseChar() {
            Compiler.Control.putMessage("PARSE: parseChar()");
            this.match("CHAR");
        }
        //INCOMPLETE - check with space and char dictionary
        static parseSpace() {
            Compiler.Control.putMessage("PARSE: parseSpace()");
            this.match("SPACE CHAR");
        }
        static parseDigit() {
            Compiler.Control.putMessage("PARSE: parseDigit()");
            this.match("DIGIT");
        }
        static parseBoolOp() {
            Compiler.Control.putMessage("PARSE: parseBoolOp()");
        }
        static parseBoolVal() {
            Compiler.Control.putMessage("PARSE: parseBoolVal()");
        }
        static parseIntOp() {
            Compiler.Control.putMessage("PARSE: parseIntOp()");
            this.match("ADDITION");
        }
        static match(str, strList) {
        }
    }
    Compiler.Parser = Parser;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=parser.js.map