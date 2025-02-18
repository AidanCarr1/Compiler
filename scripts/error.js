/* error class */

//because Error is a keyword    
class ErrorCompiler {

    constructor(str, index) { 
                    
        //set variables
        this.str = str;
        this.index = index.slice();


        //new ERROR constructed!
        this.eid = errorCount; //error ID
        errorCount ++;

        //print ERROR Message
        var message = "ERROR [ " + str + " ]" + " at " + address(index);
        putMessage(message);
    }
}
    