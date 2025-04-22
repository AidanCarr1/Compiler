/* token class */

namespace Compiler {
    export class Token {

        constructor(public str, 
                    public description, 
                    public startIndex, 
                    public endIndex,
                    public tid?) { 
                        
            //set variables
            this.str = str;
            this.description = description;
            this.startIndex = startIndex.slice();
            this.endIndex = endIndex.slice();


            //new TOKEN constructed!
            this.tid = tokenCount; //token ID
            tokenStream[tokenCount] = this;
            tokenCount ++;

            //print TOKEN Message
            var message = "<mark class='label'>TOKEN </mark>";
            message += "<mark class='bracket'>[ " + description + " ]</mark> ";
            message += "<mark class='info'>'" + str + "' </mark>";
            message += "<mark class='address'> at " + Utils.address(startIndex);

            //Multi-character TOKEN
            if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
                message += "-" + Utils.address(endIndex);
            }
            message += "</mark>";

            Control.putMessage(message);
        }
    }
}
