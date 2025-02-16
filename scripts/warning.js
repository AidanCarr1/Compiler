/* warning class */

    
class Warning {

    constructor(str, index) { 
                    
        //set variables
        this.str = str;
        this.index = index.slice();


        //new WARNING constructed!
        this.wid = warningIndex; //warning ID
        warningIndex ++;

        //print WARNING Message
        var message = "WARNING [ " + str + " ]" + " at " + address(index);
        putMessage(message);
    }
}
    