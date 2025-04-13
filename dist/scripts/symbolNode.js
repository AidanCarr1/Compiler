/*  Symbol Node class
    An entry in the symbol table
*/
var Compiler;
(function (Compiler) {
    class SymbolNode {
        //New Node
        constructor(type, isInherited, isInitialized, IsUsed) {
            this.type = type;
            this.isInherited = isInherited;
            this.isInitialized = isInitialized;
            this.IsUsed = IsUsed;
            //Know the data type
            this.type = null;
            //For scope reasons
            this.isInherited = false;
            //For error/warning reasons
            this.isInitialized = false;
            this.IsUsed = false;
        }
    }
    Compiler.SymbolNode = SymbolNode;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolNode.js.map