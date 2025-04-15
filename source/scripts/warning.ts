/* warning class */

namespace Compiler {
    export class Warning {

        constructor(public str,
                    public index,
                    public wid?) { 
                        
            //set variables
            this.str = str;
            if (index != null) {
                this.index = index.slice();
            }
            else {
                this.index = null;
            }


            //new WARNING constructed!
            this.wid = warningCount; //warning ID
            warningCount ++;

            //print WARNING Message
            var message = "<mark class='warning'>WARNING";
            message += " [ " + str + " ]</mark> ";
            message += "<mark class='address'> "
            //print the index, if there is one
            if (index != null) { 
                "at " + Utils.address(index) + "</mark>";
            }

            Control.putMessage(message);
        }
    }
}
