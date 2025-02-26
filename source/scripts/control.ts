namespace Compiler {
    export class Control {


        public static init() {
            // Clear the message box.
            (<HTMLInputElement> document.getElementById("taOutput")).value = `\n\n\n\n\n\n\n
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
    
        
        public static btnCompile_click() {        
            // This is executed as a result of the usr pressing the 
            // "compile" button between the two text areas, above.  
            // Note the <input> element's event handler: onclick="btnCompile_click();
            
            this.init();
            (<HTMLInputElement> document.getElementById("taOutput")).value = "";
            this.putMessage("Compilation Started!");
            this.putMessage("");
            
            //Separate the user generated source code into programs
            var programs = Utils.getPrograms();
            //Add more spacing to each program so indexing reveals correct numbers to the user
            programs = Utils.addSpacing(programs);
    
            //Run process one by one
            for (var i = 0; i < programs.length; i++) {
                this.putMessage("~~~~~ Program #"+ (i+1) +" ~~~~~");
    
                //Lex
                var isLexSuccessful = Lexer.lex(programs[i]);
                this.putMessage("Lex complete with " + warningCount +" warning(s) and "+ errorCount+" error(s)");
                this.putMessage("");
    
                //Reset errors
                warningCount = 0;
                errorCount = 0;
                tokenCount = 0;
    
                //Parse... later
            }
        }
    
    
        public static btnVerbose_click() {        
            // Toggleable button: Verbose mode on or off
            // On, turns on debug feautres, printing a more in-depth compiler output
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
            (<HTMLInputElement> document.getElementById("taOutput")).value += msg + "\n";
        }
        public static putDebug(msg) {
            if (debug) {
                this.putMessage("    "+msg);
            }
        }
    }
}
