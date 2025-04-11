/*  Node class
    With the tree class for CST
*/
var Compiler;
(function (Compiler) {
    class SymbolTable {
        //New Node
        constructor(table) {
            this.table = table;
            //Table of 26 positions (one for each letter id)
            this.table = String[26];
        }
        //Add node to end of the array of children
        newVariable(type, id) {
            Compiler.Control.putDebug("ST: new var called");
            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);
            Compiler.Control.putDebug(id + "=" + idCode);
            //if ID is NOT declared, declare it
            if (!this.isDeclared(id)) {
                this.table[idCode] = type;
                Compiler.Control.putDebug("declared it");
            }
            //ID already declared, give error
            else {
                var newError = new Compiler.ErrorCompiler("VARIABLE REDELCARATION", type + " " + id, currentNode.tokenPointer.startIndex);
            }
        }
        //Return true/false if a given id has been declared in this scope
        isDeclared(id) {
            Compiler.Control.putDebug("ST: isDecl called with " + id);
            Compiler.Control.putDebug("ascii " + id.charCodeAt(0));
            Compiler.Control.putDebug(id.charCodeAt(0) - "a".charCodeAt(0));
            var newIdCode = id.charCodeAt(0) - "a".charCodeAt(0);
            Compiler.Control.putDebug("Whats in " + id + ": " + this.table[newIdCode]);
            //return this.table[newIdCode] != null;
            //null -> not declared -> false
            //full -> declared -> true
            return false;
        }
    }
    Compiler.SymbolTable = SymbolTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTable.js.map