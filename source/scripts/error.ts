/* error class */

namespace Compiler {
    //because Error is a keyword    
    export class ErrorCompiler {

        constructor(public str, 
                    public index, 
                    public eid?) { 
                        
            //set variables
            this.str = str;
            this.index = index.slice();


            //new ERROR constructed!
            this.eid = errorCount; //error ID
            errorCount ++;

            //print ERROR Message
            var message = "<mark class='error'>ERROR";
            message += " [ " + str + " ]</mark> ";
            message += "<mark class='address'> at " + Utils.address(index) + "</mark>";

            Control.putMessage(message);
        }
    }
}
