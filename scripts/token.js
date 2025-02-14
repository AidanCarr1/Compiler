/* token class */

    
class Token {

    constructor(str, description, startIndex, endIndex) { 
                    
        //set variables
        this.str = str;
        this.description = description;
        this.startIndex = startIndex.slice();
        this.endIndex = endIndex.slice();


        //new token constructed!
        this.tid = tokenIndex; //token ID
        tokenIndex ++;

        //print Token Message
        var message = "TOKEN [ '" + str + "' ] " + description + " at " + address(startIndex);
        if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
            message += "-" + address(endIndex);
        }
        putMessage(message);
    }
}
    