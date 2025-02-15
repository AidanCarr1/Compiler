/* warning class */

    
class Warning {

    constructor(str, description, startIndex, endIndex) { 
                    
        //set variables
        this.str = str;
        this.description = description;
        this.startIndex = startIndex.slice();
        this.endIndex = endIndex.slice();


        //new WARNING constructed!
        this.wid = warningIndex; //warning ID
        warningIndex ++;

        //print WARNING Message
        var message = "WARNING [ '" + str + "' ] " + description + " at " + address(startIndex);
        if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
            message += "-" + address(endIndex);
        }
        putMessage(message);
    }
}
    