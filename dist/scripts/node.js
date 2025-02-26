/*  Node class
    With the tree class for CST
*/
var Compiler;
(function (Compiler) {
    class Node {
        constructor(name, parent, children) {
            this.name = name;
            this.parent = parent;
            this.children = children;
            //Node knows itself, parent, children
            this.name = name;
            this.parent = parent; //maybe make these null
            this.children = [];
        }
        //Add another to the list of children
        addChild(childNode) {
            this.children.push(childNode);
        }
    }
    Compiler.Node = Node;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=node.js.map