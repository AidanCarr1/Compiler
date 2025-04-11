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
            //convert letter to number a-z = 0-25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);
            this.table[idCode] = type;
        }
    }
    Compiler.SymbolTable = SymbolTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTable.js.map