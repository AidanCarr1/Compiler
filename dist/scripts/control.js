/*  Control class
    To modify and interact with HTML and I/O
*/
var Compiler;
(function (Compiler) {
    class Control {
        static init() {
            // Clear the message box.
            document.getElementById("taOutput").innerHTML = `<pre class='centered'>\n\n\n\n\n\n\n
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
        static btnCompile_click() {
            // This is executed as a result of the usr pressing the 
            // "compile" button between the two text areas, above.  
            // Note the <input> element's event handler: onclick="btnCompile_click();
            this.init();
            document.getElementById("taOutput").innerHTML = "";
            //Separate the user generated source code into programs
            var programs = Compiler.Utils.getPrograms();
            //Add more spacing to each program so indexing reveals correct numbers to the user
            programs = Compiler.Utils.addSpacing(programs);
            //Run process one by one
            for (var i = 0; i < programs.length; i++) {
                //Reset program variables
                errorCount = 0;
                warningCount = 0;
                tokenCount = 0;
                var isLexSuccessful = false;
                var isParseSuccessful = false;
                var isSemanticSuccessful = false;
                var isCodeGenSuccessful = false;
                code = "";
                //Display program start
                this.putHeader1("PROGRAM #" + (i + 1));
                this.putImportantLine();
                //Lex
                this.putMessage("Begin LEX");
                Compiler.Lexer.lex(programs[i]);
                //Print result
                if (errorCount == 0) {
                    this.putImportantMessage("<mark class='label'>LEX</mark> complete with " + warningCount + " warning(s) and 0 errors");
                    isLexSuccessful = true;
                }
                else {
                    this.putImportantMessage("<mark class='label'>LEX</mark> exited with " + warningCount + " warning(s) and " + errorCount + " error(s)");
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
                    Compiler.Parser.parse();
                    //Print result
                    if (errorCount == 0) {
                        this.putImportantMessage("<mark class='label'>PARSE</mark> complete with " + warningCount + " warning(s) and 0 errors");
                        isParseSuccessful = true;
                    }
                    else {
                        this.putImportantMessage("<mark class='label'>PARSE</mark> exited with " + warningCount + " warning(s) and " + errorCount + " error(s)");
                    }
                    //CST
                    if (isParseSuccessful) {
                        this.putImportantLine();
                        this.putImportantMessage("Concrete Syntax Tree");
                        _CST.printTree();
                    }
                }
                // else {
                //     this.putMessage("PARSE Skipped");
                // }
                //Reset warnings
                warningCount = 0;
                //Was Parse completed?
                if (isParseSuccessful) {
                    //Create AST
                    this.putLine();
                    this.putMessage("Begin SEMANTIC ANALYSIS");
                    Compiler.Semantic.createAST();
                    //Print AST
                    this.putImportantLine();
                    this.putImportantMessage("Abstract Syntax Tree");
                    _AST.printTree();
                    //Check type and scope
                    this.putImportantLine();
                    Compiler.Semantic.checkTypeScope();
                    //Check scope tree warnings
                    _SymbolTableTree.checkWarnings(_SymbolTableTree.root);
                    //Print result
                    if (errorCount == 0) {
                        this.putImportantMessage("<mark class='label'>SEMANTIC</mark> complete with " + warningCount + " warning(s) and 0 errors");
                        isSemanticSuccessful = true;
                    }
                    else {
                        this.putImportantMessage("<mark class='label'>SEMANTIC</mark> exited with " + warningCount + " warning(s) and " + errorCount + " error(s)");
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
                    this.putMessage("Begin CODE GENERATION");
                    Compiler.CodeGen.generate();
                    //Print result (only errors should be code is too big?)
                    if (errorCount == 0) {
                        this.putImportantMessage("<mark class='label'>CODE GEN</mark> complete with" + /*+ warningCount +" warning(s) and"*/ " 0 errors");
                        isCodeGenSuccessful = true;
                    }
                    else {
                        this.putImportantMessage("<mark class='label'>CODE GEN</mark> exited with " /*+ warningCount +" warning(s) and "*/ + errorCount + " error(s)");
                    }
                }
                //Was Code Gen Completed?
                if (isCodeGenSuccessful) {
                    //Print code
                    this.putImportantLine();
                    this.putImportantMessage("6502 Code");
                    //this.putImportantMessage(Utils.separateHex(code));
                    this.putImportantMessage(printingCode);
                }
                //Next Program
                this.putImportantLine(2);
            }
            //All programs are done
            this.putHeader1("END");
            //Scroll down to bottom for code gen
            if (autoScroll) {
                var elem = document.getElementById('taOutput');
                elem.scrollTop = elem.scrollHeight;
            }
        }
        static btnVerbose_click() {
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if (document.getElementById("btnVerbose").value === "OFF") {
                document.getElementById("btnVerbose").value = "ON";
                verbose = true;
            }
            else {
                document.getElementById("btnVerbose").value = "OFF";
                verbose = false;
            }
        }
        static btnDebug_click() {
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if (document.getElementById("btnDebug").value === "OFF") {
                document.getElementById("btnDebug").value = "ON";
                debug = true;
            }
            else {
                document.getElementById("btnDebug").value = "OFF";
                debug = false;
            }
        }
        static btnAutoScroll_click() {
            // Toggleable button: Verbose mode on or off
            // On, turns on debug features, printing a more in-depth compiler output
            if (document.getElementById("btnAutoScroll").value === "OFF") {
                document.getElementById("btnAutoScroll").value = "ON";
                autoScroll = true;
            }
            else {
                document.getElementById("btnAutoScroll").value = "OFF";
                autoScroll = false;
            }
        }
        static putMessage(msg) {
            if (verbose || debug) {
                document.getElementById("taOutput").innerHTML
                    += "<p>" + msg + "</p>";
            }
        }
        static putImportantMessage(msg) {
            document.getElementById("taOutput").innerHTML
                += "<p>" + msg + "</p>";
        }
        static putDebug(msg) {
            if (debug) {
                this.putMessage("<mark class='debug'>>> " + msg + "</mark>");
            }
        }
        static putHeader1(msg) {
            document.getElementById("taOutput").innerHTML
                += "<h1>" + msg + "</h1>";
        }
        static putHeader2(msg) {
            document.getElementById("taOutput").innerHTML
                += "<h2>" + msg + "</h2>";
        }
        static putLine(numOfLines) {
            if (verbose || debug) {
                if (!numOfLines) {
                    numOfLines = 1;
                }
                document.getElementById("taOutput").innerHTML
                    += "<br>".repeat(numOfLines);
            }
        }
        static putImportantLine(numOfLines) {
            if (!numOfLines) {
                numOfLines = 1;
            }
            document.getElementById("taOutput").innerHTML
                += "<br>".repeat(numOfLines);
        }
        static putParseMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    document.getElementById("taOutput").innerHTML
                        += "<p><mark class='label'>PARSE</mark> <mark class='info'>" + msg + "</mark></p>";
                }
            }
        }
        static putASTMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    document.getElementById("taOutput").innerHTML
                        += "<p><mark class='label'>SEMANTIC AST</mark> <mark class='info'>" + msg + "</mark></p>";
                }
            }
        }
        static putSemanticMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    document.getElementById("taOutput").innerHTML
                        += "<p><mark class='label'>SEMANTIC</mark> <mark class='info'>" + msg + "</mark></p>";
                }
            }
        }
        static putCodeGenMessage(msg) {
            if (verbose || debug) {
                if (errorCount <= 0) {
                    document.getElementById("taOutput").innerHTML
                        += "<p><mark class='label'>CODE GEN</mark> <mark class='info'>" + msg + "</mark></p>";
                }
            }
        }
        static btnCopy_click() {
            //Thanks https://www.w3schools.com/howto/howto_js_copy_clipboard.asp 
            //and https://stackoverflow.com/questions/16791851/a-flash-of-color-using-pure-css-transitions
            //If there is actually code...
            if (code.length > 0) {
                //Copy code to clipboard
                navigator.clipboard.writeText(clipboardCode);
                //alert("Copied: ["+clipboardCode+"]");
                //Flash the copied text
                var element = document.getElementById("copied");
                element.classList.add("flash");
                setTimeout(function () {
                    element.classList.remove("flash");
                }, 2);
            }
        }
    }
    Compiler.Control = Control;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=control.js.map