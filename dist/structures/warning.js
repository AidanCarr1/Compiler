/* warning class */
var Compiler;
(function (Compiler) {
    class Warning {
        constructor(str, index, wid) {
            this.str = str;
            this.index = index;
            this.wid = wid;
            //set variables
            this.str = str;
            if (index != null) {
                this.index = index.slice();
            }
            else {
                this.index = null;
            }
            //new WARNING constructed!
            this.wid = warningCount; //warning ID
            warningCount++;
            //print WARNING Message
            var message = "<mark class='warning'>WARNING";
            message += " [ " + str + " ]</mark> ";
            message += "<mark class='address'> ";
            //print the index, if there is one
            if (index != null) {
                "at " + Compiler.Utils.address(index) + "</mark>";
            }
            Compiler.Control.putImportantMessage(message);
        }
    }
    Compiler.Warning = Warning;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=warning.js.map