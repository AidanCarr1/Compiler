/* warning class */

    
class Warning {

    constructor(str, index) { 
                    
        //set variables
        this.str = str;
        //this.step = step;
        this.index = index.slice();
        //this.endIndex = endIndex.slice();


        //new WARNING constructed!
        this.wid = warningIndex; //warning ID
        warningIndex ++;

        //print WARNING Message
        var message = "WARNING [ '" + str + "' ] " + step + " at " + address(startIndex);
        if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
            message += "-" + address(endIndex);
        }
        putMessage(message);
    }
}
    