/* error class */

namespace Compiler {
    //because Error is a keyword    
    export class ErrorCompiler {

        constructor(public str, 
                    public description,
                    public index?, 
                    public eid?) { 
                        
            //set variables
            this.str = str;
            if (index != null) {
                this.index = index.slice();
            }
            else {
                this.index = null;
            }


            //new ERROR constructed!
            this.eid = errorCount; //error ID
            errorCount ++;

            //print FIRST ERROR Message
            if (errorCount <= 1) {
                var message = "<mark class='error'>ERROR";
                message += " [ " + str + " ] ";
                message += description;
                message += " </mark>";
                //print the index, if there is one
                if (index != null) {
                    message += "<mark class='address'> at " + Utils.address(index) + "</mark>";
                }
                Control.putImportantMessage(message);
            }
        }
    }
}
