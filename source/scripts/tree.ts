/*  Tree class
    For the CST
*/

namespace Compiler {
    export class Tree {

        //New Tree
        constructor(public root?,
                    public current? ) { 

            //Simple tree structure, remember first and recent
            this.root = null;
            this.current = null;    //Attributes are updated later

            Control.putDebug("CST Created");
        }

        //Add new Node into the tree somewhere
        public addNode(label, isLeaf?) {

            var newNode = new Node();
            newNode.name = label;
            Control.putDebug("name: "+newNode.name);

            //First node, root node
            if (this.root == null) {
                this.root = newNode;
            }

            //newNode is current's child
            else {
                newNode.parent = this.current;
                newNode.parent.addChild(newNode);
            }
            //Control.putDebug("child and parents...");

            //Move current pointer down the tree (unless its a leaf node)
            if (! isLeaf) {
                this.current = newNode;
            }
            //Control.putDebug("after leaf");
            Control.putDebug("NODE ["+newNode.name+", parent: "+newNode.parent+", children: "+newNode.children + "]");
        }

        //Up the tree
        public moveUp() {
            
            if (this.current.parent != null) {
                this.current = this.current.parent;
            }
            else {
                //Cannot go past the root,
                //do not move current pointer
            } 
        }

    }
}
