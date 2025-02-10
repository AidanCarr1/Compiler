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
        putMessage("Token "+description+" [ '"+str+"' ] "+startIndex[0]+":"+startIndex[1]+"-"+endIndex[0]+":"+endIndex[1]);
    }

    //setters
    /*
    setName(inputName) {
        this.name = inputName;
    }
    */
}
    