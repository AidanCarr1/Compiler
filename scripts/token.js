/* token class */

    
class Token {

    constructor(name, startLine, startIndex) { 
                    
        //set variables
        this.name = name;
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
    