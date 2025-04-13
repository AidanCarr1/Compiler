/*  Node class
    With the tree class for CST
*/
var Compiler;
(function (Compiler) {
    class SymbolTable {
        //New Node
        constructor(table) {
            this.table = table;
            //Table of 26 positions (one SymbolNode for each letter id)
            this.table = Array.from({ length: 26 }, () => new Compiler.SymbolNode());
            //ChatGPT Help ^^
        }
        //Add node to end of the array of children
        newVariable(type, id) {
            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);
            //if ID is NOT declared, declare it
            if (!this.isDeclared(id)) {
                this.table[idCode].type = type;
            }
            //ID already declared, give error
            else {
                var newError = new Compiler.ErrorCompiler("VARIABLE REDECLARATION", type + " " + id, currentNode.tokenPointer.startIndex);
            }
        }
        //Return true/false if a given id has been declared in this scope
        isDeclared(id) {
            var idCode = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode] != null;
            //null -> not declared -> false
            //full -> declared -> true
        }
        //Return type string given id string
        getType(id) {
            var idCode = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode].type;
        }
    }
    Compiler.SymbolTable = SymbolTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTable.js.map