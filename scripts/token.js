/* token class */

    
class Token {

    constructor(str, description, startIndex, endIndex) { 
                    
        //set variables
        this.str = str;
        this.description = description;
        this.startIndex = startIndex;
        this.endIndex = endIndex;


        //new token constructed!
        this.tid = tokenIndex; //token ID
        tokenIndex ++;

        //debug
        putMessage("Token [ '" + str + "' ] " + description + "  " +
            address(startIndex) + "-" +
            address(endIndex));
    }

    //setters
    /*
    setName(inputName) {
        this.name = inputName;
    }
    */
}
    