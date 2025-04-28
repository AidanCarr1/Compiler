/*  Symbol Node class
    An entry in the symbol table
*/
var Compiler;
(function (Compiler) {
    class SymbolNode {
        //New Node
        constructor(type, 
        //public isInherited?: boolean,
        isInitialized, IsUsed, entryPointer) {
            this.type = type;
            this.isInitialized = isInitialized;
            this.IsUsed = IsUsed;
            this.entryPointer = entryPointer;
            //Know the data type
            this.type = null;
            //For scope reasons
            //this.isInherited = false;
            //For error/warning reasons
            this.isInitialized = false;
            this.IsUsed = false;
            this.entryPointer = null;
        }
    }
    Compiler.SymbolNode = SymbolNode;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolNode.js.map