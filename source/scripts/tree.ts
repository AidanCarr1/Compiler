/*  Tree class
    For the CST
*/

namespace Compiler {
    export class Tree {

        constructor(public root?,
                    public current? ) { 

            //Simple tree structure, remember first and recent
            this.root = null;
            this.current = null;
        }

        //Add new Node into the tree somewhere
        public addNode(kind, label) {
            var newNode = new Node();
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
}
