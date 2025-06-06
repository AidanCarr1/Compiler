/*  Tree class
    For the CST
*/

namespace Compiler {
    export class Tree {

        //New Tree
        constructor(public root?,
                    public current?,
                    public nodeList?: Node[]
                    ) { 

            //Simple tree structure, remember first and recent
            this.root = null;
            this.current = null;    //Attributes are updated later
            this.nodeList = [];

            Control.putDebug("Tree Created");
        }

        //Add new Node into the tree somewhere
        public addNode(nodeName: String, isLeaf?: boolean, token?: Token): Node {
            //Control.putDebug("in add node");
            var newNode = new Node(nodeName);
            //First node, root node
            if (this.root == null) {
                this.root = newNode;
                this.nodeList = [];
            }
            
            //newNode is current's child
            else {
                newNode.parent = this.current;
                newNode.parent.addChild(newNode);
                Control.putDebug("NODE ["+newNode.name+", parent: "+newNode.parent.name+", children: "+newNode.children + "]");
            }
            //Move current pointer down the tree (unless its a leaf node)
            if (! isLeaf) {
                this.current = newNode;
            }
            else {
                newNode.tokenPointer = token;
                Control.putDebug("&gt;&gt; TOKEN ["+newNode.tokenPointer.str +"] at "+Utils.address(newNode.tokenPointer.startIndex));
            }
            newNode.isLeaf = isLeaf;
            //add it to the in order node list
            this.nodeList.push(newNode);
            //Control.putDebug("done adding node");
            return newNode;
        }

        //Up the tree
        public moveUp() {
            
            if (this.current.parent != null) {
                this.current = this.current.parent;
                //Control.putDebug("new current: "+this.current.name);
            }
            else {
                //Cannot go past the root,
                //do not move current pointer
            } 

            //FIX IDEA
            //There exists empty Char lists and Statement lists
            //they are not declared as leaf nodes, but the final one ends up being a leaf node
            //maybe I delete these - Nodes declared as branch but turn out to be leaf
        }

        //New tree
        public reset() {
            this.root = null;
            this.current = null;
        }


        public printTree() {
            //Start with blank slate
            traversalResult = "";

            this.expand(this.root, 0);
            Control.putImportantMessage(traversalResult);
        }

        private expand(node: Node, depth) {
            
            //Skip the fake leaf! (empty List item)
            if (!node.isLeaf && (!node.children || node.children.length === 0)) {
                return;
            }

            for (var i = 0; i < depth; i++) {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "<br>";
            }
            else {
                // There are children, so note these interior/branch nodes and ...
                traversalResult += "&lt;" + node.name + "&gt; <br>";
                // .. recursively expand them.
                for (var i = 0; i < node.children.length; i++) {
                    this.expand(node.children[i], depth + 1);
                }
            }
        }

    }
}
