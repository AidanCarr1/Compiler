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
        putMessage("TOKEN [ '" + str + "' ] " + description + "  " +
            address(startIndex) + "-" +
            address(endIndex));
    }
}
    