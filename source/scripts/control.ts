/*  Control class
    To modify and interact with HTML and I/O
*/

namespace Compiler {
    export class Control {


        public static init() {
            // Clear the message box.
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML = `<pre class='centered'>\n\n\n\n\n\n\n
<mark style="color:lightgray">
                             )  
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
                var isSemanticSuccessful = false;

                //Display program start
                this.putHeader1("PROGRAM #"+ (i+1));
                this.putImportantLine();
    
                //Lex
                this.putMessage("Begin LEX");
                Lexer.lex(programs[i]);

                //Print result
                if (errorCount == 0){
                    this.putImportantMessage("<mark class='label'>LEX</mark> complete with " + warningCount +" warning(s) and 0 errors");
                    isLexSuccessful = true;
                }
                else {
                    this.putImportantMessage("<mark class='label'>LEX</mark> exited with " + warningCount +" warning(s) and "+ errorCount +" error(s)");
                }
                this.putImportantLine();

                //Reset errors and Trees
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
                        this.putImportantMessage("<mark class='label'>PARSE</mark> complete with " + warningCount +" warning(s) and 0 errors");
                        isParseSuccessful = true;
                    }
                    else {
                        this.putImportantMessage("<mark class='label'>PARSE</mark> exited with " + warningCount +" warning(s) and "+ errorCount +" error(s)");
                    }

                    //CST
                    if (isParseSuccessful) {
                        this.putImportantLine();
                        this.putImportantMessage("Concrete Syntax Tree");
                        _CST.printTree();
                    }
                }
                else {
                    this.putMessage("PARSE Skipped");
                }

                //Reset warnings
                warningCount = 0;

                //Was Parse completed?
                if (isParseSuccessful) {

                    //Create AST
                    this.putLine();
                    this.putMessage("Begin SEMANTIC ANALYSIS");
                    Semantic.createAST();

                    //Print AST
                    this.putImportantLine();
                    this.putImportantMessage("Abstract Syntax Tree");
                    _AST.printTree();

                    //Check type and scope
                    this.putImportantLine();
                    Semantic.checkTypeScope();

                    //Check scope tree warnings
                    _SymbolTableTree.checkWarnings(_SymbolTableTree.root);

                    //Print result
                    if (errorCount == 0) {
                        this.putImportantMessage("<mark class='label'>SEMANTIC</mark> complete with " + warningCount +" warning(s) and 0 errors");
                        isSemanticSuccessful = true;
                    }
                    else {
                        this.putImportantMessage("<mark class='label'>SEMANTIC</mark> exited with " + warningCount +" warning(s) and "+ errorCount +" error(s)");
                    }

                    //Scope Tree/Symbol Table
                    if (isSemanticSuccessful) {
                        this.putImportantLine();
                        this.putImportantMessage("Symbol Table");
                        _SymbolTableTree.printTree();
                    }  
                }

                //reset warnings
                warningCount = 0;

                //Was Semantic Completed?
                if (isSemanticSuccessful) {

                    //Generate code
                    this.putImportantLine();
                    this.putImportantMessage("Begin CODE GEN");
                    CodeGen.generate();

                    //Print result (only errors should be code is too big?)
                    // if (errorCount == 0) {
                    //     this.putImportantMessage("<mark class='label'>CODE GEN</mark> complete with " + warningCount +" warning(s) and 0 errors");
                    //     isSemanticSuccessful = true;
                    // }
                    // else {
                    //     this.putImportantMessage("<mark class='label'>CODE GEN</mark> exited with " + warningCount +" warning(s) and "+ errorCount +" error(s)");
                    // }
                    
                    //Print code
                    this.putImportantLine();
                    this.putImportantMessage("6502 Code");
                    this.putImportantMessage(Utils.separateHex(code));


                }

                //Next Program
                this.putImportantLine(2);
            }

            //All programs are done
            this.putHeader1("END");
        }
    
    
        public static btnVerbose_click() {        
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if ((<HTMLInputElement> document.getElementById("btnVerbose")).value === "OFF") {
                (<HTMLInputElement> document.getElementById("btnVerbose")).value = "ON";
                verbose = true;
            }
            else {
                (<HTMLInputElement> document.getElementById("btnVerbose")).value = "OFF";
                verbose = false;
            }
        }


        public static btnDebug_click() {        
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if ((<HTMLInputElement> document.getElementById("btnDebug")).value === "OFF") {
                (<HTMLInputElement> document.getElementById("btnDebug")).value = "ON";
                debug = true;
            }
            else {
                (<HTMLInputElement> document.getElementById("btnDebug")).value = "OFF";
                debug = false;
            }
        }


        public static putMessage(msg) {
            if (verbose || debug) {
                (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                += "<p>"+msg + "</p>";
            }
        }
        public static putImportantMessage(msg) {
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
            if (verbose || debug) {
                if (!numOfLines){
                    numOfLines = 1;
                }
                (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                += "<br>".repeat(numOfLines);
            }
        }
        public static putImportantLine(numOfLines?) {
            if (!numOfLines){
                numOfLines = 1;
            }
            (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
            += "<br>".repeat(numOfLines);
        }

        public static putParseMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                    += "<p><mark class='label'>PARSE</mark> <mark class='info'>"+msg+"</mark></p>";
                }
            }
        }
        public static putASTMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                    += "<p><mark class='label'>SEMANTIC AST</mark> <mark class='info'>"+msg+"</mark></p>";
                }
            }
        }
        public static putSemanticMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                    += "<p><mark class='label'>SEMANTIC</mark> <mark class='info'>"+msg+"</mark></p>";
                }
            }
        }  
        public static putCodeGenMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    (<HTMLInputElement> document.getElementById("taOutput")).innerHTML 
                    += "<p><mark class='label'>CODE GEN</mark> <mark class='info'>"+msg+"</mark></p>";
                }
            }
        }        
    }
}
