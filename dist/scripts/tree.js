/*  Tree class
    For the CST
*/
var Compiler;
(function (Compiler) {
    class Tree {
        constructor(root, current) {
            this.root = root;
            this.current = current;
            //Simple tree structure, remember first and recent
            this.root = null;
            this.current = null;
        }
        //Add new Node into the tree somewhere
        addNode(kind, label) {
            var newNode = new Compiler.Node();
            newNode.name = label;
            //First node, root node
            if (this.root == null) {
                this.root = newNode;
            }
            //WORK IN PROGRESS, copied pseudocode
            else {
                newNode.parent = this.current;
                newNode.parent.addChild(newNode);
            }
            if (kind == "branch") {
                this.current = newNode;
            }
        }
    }
    Compiler.Tree = Tree;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=tree.js.map