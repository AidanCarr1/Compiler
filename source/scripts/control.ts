/*  Control class
    To modify and interact with HTML and I/O
*/

namespace Compiler {
    export class Control {


        public static init() {
            // Clear the message box.
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML = `<pre class='centered'>\n\n\n\n\n\n
<mark style="color:lightgray">                                )  
                               (  \`  
                              )   ) (  </mark> <mark style="color:orange">
                           __..---..__
                       ,-='  <mark style="color:darkorange">/  |  \\ </mark> \`=-.
                      :--..___________..--</mark><mark style="color:gray">;
                       \\.,_____________,./ </mark></pre>`;
            //Pie credit: https://ascii.co.uk/art/pie
    
            // Set the initial values for our globals.
            tokens = "";
            tokenCount = 0;
            currentToken = ' ';
            //errorCount = 0;        
        }
    
        
        public static btnCompile_click() {        
            // This is executed as a result of the usr pressing the 
            // "compile" button between the two text areas, above.  
            // Note the <input> element's event handler: onclick="btnCompile_click();
            
            this.init();
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML = "";
            //this.putMessage("Compilation Started!");
            //this.putLine(3);
            
            //Separate the user generated source code into programs
            var programs = Utils.getPrograms();
            //Add more spacing to each program so indexing reveals correct numbers to the user
            programs = Utils.addSpacing(programs);
    
            //Run process one by one
            for (var i = 0; i < programs.length; i++) {

                //Reset program variables
                errorCount = 0; 
                warningCount = 0;
                tokenCount = 0;
                var isLexSuccessful = false;
                var isParseSuccessful = false;

                //Display program start
                this.putHeader1("PROGRAM #"+ (i+1));
                this.putLine();
    
                //Lex
                this.putMessage("Begin LEX");
                Lexer.lex(programs[i]);

                //Print result
                if (errorCount == 0){
                    this.putMessage("LEX complete with " + warningCount +" warning(s) and 0 errors");
                    isLexSuccessful = true;
                }
                else {
                    this.putMessage("LEX exited with " + warningCount +" warning(s) and "+ errorCount+" error(s)");
                }
                this.putLine();

                //Reset errors and CST
                warningCount = 0;
                errorCount = 0;
                _CST.reset();
                _AST.reset();
                _SymbolTableTree.reset();
                
                //Was Lex completed?
                if (isLexSuccessful) {

                    //Parse
                    this.putMessage("Begin PARSE");
                    Parser.parse();

                    //Print result
                    if (errorCount == 0) {
                        this.putMessage("PARSE complete with " + warningCount +" warning(s) and 0 errors");
                        isParseSuccessful = true;
                    }
                    else {
                        this.putMessage("PARSE exited with " + warningCount +" warning(s) and "+ errorCount+" error(s)");
                    }

                    //CST
                    if (isParseSuccessful) {
                        this.putLine();
                        this.putMessage("Concrete Syntax Tree");
                        _CST.printTree();
                    }
                }
                else {
                    this.putMessage("PARSE Skipped");
                }

                //Was Parse completed?
                if (isParseSuccessful) {

                    //Creat AST
                    this.putLine();
                    this.putMessage("Begin SEMANTIC ANALYSIS");
                    Semantic.createAST();

                    //Print AST
                    this.putLine();
                    this.putMessage("Abstract Syntax Tree");
                    _AST.printTree();

                    //Check type and scope
                    this.putLine();
                    Semantic.checkTypeScope();
                    this.putMessage("SEMANTIC complete with " + warningCount +" warning(s) and 0 errors");

                }


                //Next Program
                this.putLine(2);
            }

            //All programs are done
            this.putHeader1("END");
        }
    
    
        public static btnVerbose_click() {        
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if ((<HTMLInputElement> document.getElementById("btnVerbose")).value === "OFF") {
                (<HTMLInputElement> document.getElementById("btnVerbose")).value = "ON";
                debug = true;
            }
            else {
                (<HTMLInputElement> document.getElementById("btnVerbose")).value = "OFF";
                debug = false;
            }
        }


        public static putMessage(msg) {
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
            += "<p>"+msg + "</p>";
        }
        public static putDebug(msg) {
            if (debug) {
                this.putMessage("<mark class='debug'>>> "+msg+"</mark>");
            }
        }
        public static putHeader1(msg) {
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
            += "<h1>"+msg + "</h1>";
        }
        public static putHeader2(msg) {
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
            += "<h2>"+msg + "</h2>";
        }
        public static putLine(numOfLines?) {
            if (!numOfLines){
                numOfLines = 1;
            }
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
            += "<br>".repeat(numOfLines);
        }
        public static putParseMessage(msg) {
            if (errorCount <= 0) {
                (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                += "<p><mark class='label'>PARSE</mark> <mark class='info'>"+msg+"</mark></p>";
            }
        }
        public static putASTMessage(msg) {
            if (errorCount <= 0) {
                (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                += "<p><mark class='label'>Semantic AST</mark> <mark class='info'>"+msg+"</mark></p>";
            }
        }

        public static putSemanticMessage(msg) {
            if (errorCount <= 0) {
                (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                += "<p><mark class='label'>Semantic</mark> <mark class='info'>"+msg+"</mark></p>";
            }
        }        

    }
}
