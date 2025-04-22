/*  Node class
    With the tree class for CST
*/
var Compiler;
(function (Compiler) {
    class SymbolTable {
        //New Node
        constructor(name, //ex: "SCOPE 1"
        table, parent, children) {
            this.name = name;
            this.table = table;
            this.parent = parent;
            this.children = children;
            //Table of 26 positions (one SymbolNode for each letter id)
            this.table = Array.from({ length: 26 }, () => new Compiler.SymbolNode());
            //Some ChatGPT Help ^^
            this.children = [];
        }
        addChild(childSymbolTable) {
            this.children.push(childSymbolTable);
        }
        //Edit the symbol node for given id inside the table array
        newVariable(type, id) {
            Compiler.Control.putDebug("ST: new var");
            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);
            //if ID is NOT declared on the current scope, declare it
            if (this.table[idCode].type == null) {
                this.table[idCode].type = type;
            }
            else {
                var newError = new Compiler.ErrorCompiler("VARIABLE REDECLARATION", id + " has already been declared in the same scope", currentNode.tokenPointer.startIndex);
            }
        }
        //Return true/false if a given id has been declared in this scope
        isDeclared(id) {
            //var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.getType(id) != null;
            //null -> not declared -> false
            //full -> declared -> true
        }
        //Return type string given id string
        getType(id) {
            var idCode = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode].type;
        }
        getSymbol(id) {
            var idCode = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode];
        }
    }
    Compiler.SymbolTable = SymbolTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTable.js.map