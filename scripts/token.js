/* token class */

    
class Token {

    constructor(str, description, startLine, startIndex) { 
                    
        //set variables
        this.str = str;
        this.description = description;
        this.startLine = startLine;
        this.startIndex = startIndex;

        //new token constructed!
        this.tid = tokenIndex; //token ID
        tokenIndex ++;

        //debug
        putMessage("Token "+this.tid+" ["+name+", "+startLine+":"+startIndex+"]");
    }

    //setters
    /*
    setName(inputName) {
        this.name = inputName;
    }
    */
}
    