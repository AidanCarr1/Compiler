/* warning class */

    
class Warning {

    constructor(str, index) { 
                    
        //set variables
        this.str = str;
        this.index = index.slice();


        //new WARNING constructed!
        this.wid = warningCount; //warning ID
        warningCount ++;

        //print WARNING Message
        var message = "WARNING [ " + str + " ]" + " at " + address(index);
        putMessage(message);
    }
}
    