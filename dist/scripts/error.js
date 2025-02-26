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
            //print ERROR Message
            var message = "! ERROR [ " + str + " ]" + " at " + Compiler.Utils.address(index);
            Compiler.Utils.putMessage(message);
        }
    }
    Compiler.ErrorCompiler = ErrorCompiler;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=error.js.map