/*  Tree class
    For the CST
*/
var Compiler;
(function (Compiler) {
    class Tree {
        //New Tree
        constructor(root, current) {
            this.root = root;
            this.current = current;
            //Simple tree structure, remember first and recent
            this.root = null;
            this.current = null; //Attributes are updated later
        }
        //Add new Node into the tree somewhere
        addNode(label, isLeaf) {
            var newNode = new Compiler.Node();
            newNode.name = label;
            //First node, root node
            if (this.root == null) {
                this.root = newNode;
            }
            //newNode is current's child
            else {
                newNode.parent = this.current;
                newNode.parent.addChild(newNode);
            }
            //Move current pointer down the tree (unless its a leaf node)
            if (!isLeaf) {
                this.current = newNode;
            }
        }
        //Up the tree
        moveUp() {
            if (this.current.parent != null) {
                this.current = this.current.parent;
            }
            else {
                //Cannot go past the root,
                //do not move current pointer
            }
        }
    }
    Compiler.Tree = Tree;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=tree.js.map