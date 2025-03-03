/* warning class */

namespace Compiler {
    export class Warning {

        constructor(public str,
                    public index,
                    public wid?) { 
                        
            //set variables
            this.str = str;
            this.index = index.slice();


            //new WARNING constructed!
            this.wid = warningCount; //warning ID
            warningCount ++;

            //print WARNING Message
            var message = "<mark class='warning'>WARNING";
            message += " [ " + str + " ]</mark> ";
            message += "<mark class='address'> at " + Utils.address(index) + "</mark>";

            Control.putMessage(message);
        }
    }
}
