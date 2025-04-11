/*  Node class
    With the tree class for CST
*/
var Compiler;
(function (Compiler) {
    class Node {
        //New Node
        constructor(name, parent, children, isLeaf, tokenPointer, symbolTable) {
            this.name = name;
            this.parent = parent;
            this.children = children;
            this.isLeaf = isLeaf;
            this.tokenPointer = tokenPointer;
            this.symbolTable = symbolTable;
            //Node knows itself, parent, children
            this.name = name;
            this.parent; //Attributes are updated later
            this.children = [];
            this.symbolTable = new Compiler.SymbolTable();
        }
        //Add node to end of the array of children
        addChild(childNode) {
            this.children.push(childNode);
        }
    }
    Compiler.Node = Node;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=node.js.map