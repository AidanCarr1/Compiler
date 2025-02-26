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
            this.index = index.slice();
            //new WARNING constructed!
            this.wid = warningCount; //warning ID
            warningCount++;
            //print WARNING Message
            var message = "! WARNING [ " + str + " ]" + " at " + Compiler.Utils.address(index);
            Compiler.Utils.putMessage(message);
        }
    }
    Compiler.Warning = Warning;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=warning.js.map