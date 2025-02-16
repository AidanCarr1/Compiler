/* error class */

//because Error is a keyword    
class ErrorCompiler {

    constructor(str, startIndex, endIndex) { 
                    
        //set variables
        this.str = str;
        //this.step = step;
        this.startIndex = startIndex.slice();
        this.endIndex = endIndex.slice();


        //new ERROR constructed!
        this.eid = errorIndex; //error ID
        errorIndex ++;

        //print ERROR Message
        var message = "ERROR [ '" + str + "' ] " + step + " at " + address(startIndex);
        if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
            message += "-" + address(endIndex);
        }
        putMessage(message);
    }
}
    