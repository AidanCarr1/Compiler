/* error class */
var Compiler;
(function (Compiler) {
    //because Error is a keyword    
    class ErrorCompiler {
        constructor(str, index, eid) {
            this.str = str;
            this.index = index;
            this.eid = eid;
            //set variables
            this.str = str;
            this.index = index.slice();
            //new ERROR constructed!
            this.eid = errorCount; //error ID
            errorCount++;
            //print FIRST ERROR Message
            if (errorCount <= 1) {
                var message = "<mark class='error'>ERROR";
                message += " [ " + str + " ]</mark> ";
                message += "<mark class='address'> at " + Compiler.Utils.address(index) + "</mark>";
                Compiler.Control.putMessage(message);
            }
        }
    }
    Compiler.ErrorCompiler = ErrorCompiler;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=error.js.map