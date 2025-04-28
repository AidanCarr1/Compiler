/* error class */
var Compiler;
(function (Compiler) {
    //because Error is a keyword    
    class ErrorCompiler {
        constructor(str, description, index, eid) {
            this.str = str;
            this.description = description;
            this.index = index;
            this.eid = eid;
            //set variables
            this.str = str;
            if (index != null) {
                this.index = index.slice();
            }
            else {
                this.index = null;
            }
            //new ERROR constructed!
            this.eid = errorCount; //error ID
            errorCount++;
            //print FIRST ERROR Message
            if (errorCount <= 1) {
                var message = "<mark class='error'>ERROR";
                message += " [ " + str + " ] ";
                message += description;
                message += " </mark>";
                //print the index, if there is one
                if (index != null) {
                    message += "<mark class='address'> at " + Compiler.Utils.address(index) + "</mark>";
                }
                Compiler.Control.putImportantMessage(message);
            }
        }
    }
    Compiler.ErrorCompiler = ErrorCompiler;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=error.js.map