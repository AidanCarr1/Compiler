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
            var message = "TOKEN [ '" + str + "' ] " + description + " at " + Utils.address(startIndex);
            if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
                message += "-" + Utils.address(endIndex);
            }
            Utils.putMessage(message);
        }
    }
}
