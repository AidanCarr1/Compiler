/*  Control class
    To modify and interact with HTML and I/O
*/
var Compiler;
(function (Compiler) {
    class Control {
        static init() {
            // Clear the message box.
            document.getElementById("taOutput").value = `\n\n\n\n\n\n\n
                                )  
                               (  \`  
                              )   ) ( 
                           __..---..__
                       ,-='  /  |  \\  \`=-.
                      :--..___________..--;
                       \\.,_____________,./`;
            //Pie credit: https://ascii.co.uk/art/pie
            // Set the initial values for our globals.
            tokens = "";
            tokenCount = 0;
            currentToken = ' ';
            errorCount = 0;
        }
        static btnCompile_click() {
            // This is executed as a result of the usr pressing the 
            // "compile" button between the two text areas, above.  
            // Note the <input> element's event handler: onclick="btnCompile_click();
            this.init();
            document.getElementById("taOutput").value = "";
            this.putMessage("Compilation Started!");
            this.putMessage("");
            //Separate the user generated source code into programs
            var programs = Compiler.Utils.getPrograms();
            //Add more spacing to each program so indexing reveals correct numbers to the user
            programs = Compiler.Utils.addSpacing(programs);
            //Run process one by one
            for (var i = 0; i < programs.length; i++) {
                this.putMessage("~~~~~ Program #" + (i + 1) + " ~~~~~");
                //Lex
                this.putMessage("~~~~~ LEX ~~~~~");
                var isLexSuccessful = Compiler.Lexer.lex(programs[i]);
                this.putMessage("Lex complete with " + warningCount + " warning(s) and " + errorCount + " error(s)");
                this.putMessage("");
                //Reset errors
                warningCount = 0;
                errorCount = 0;
                tokenCount = 0;
                //Parse
                if (isLexSuccessful) {
                    this.putMessage("~~~~~ PARSE ~~~~~");
                    //var isParseSuccessful = Parser.parse()
                }
            }
        }
        static btnVerbose_click() {
            // Toggleable button: Verbose mode on or off
            // On, turns on debug feautres, printing a more in-depth compiler output
            if (document.getElementById("btnVerbose").value === "OFF") {
                document.getElementById("btnVerbose").value = "ON";
                debug = true;
            }
            else {
                document.getElementById("btnVerbose").value = "OFF";
                debug = false;
            }
        }
        static putMessage(msg) {
            document.getElementById("taOutput").value += msg + "\n";
        }
        static putDebug(msg) {
            if (debug) {
                this.putMessage("    " + msg);
            }
        }
    }
    Compiler.Control = Control;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=control.js.map