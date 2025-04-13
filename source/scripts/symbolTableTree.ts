/*  Tree class
    For the CST
*/

namespace Compiler {
    export class SymbolTableTree {

        //New Tree (for symbol tables)
        constructor(public root?,
                    public current?,
                    ) { 

            //Simple tree structure
            this.root = null;
            this.current = null;
        }

        //Add new Symbol Table into the tree
        public addScope(scopeName: String): SymbolTable {
            Control.putDebug("adding a new scope");

            var newSymbolTable = new SymbolTable(scopeName);
            //Control.putDebug("1");
            //First scope, root symbol table "node"
            if (this.root == null) {
                this.root = newSymbolTable;
                //this.nodeList = [];
            }
            
            //newNode is current's child
            else {
                newSymbolTable.parent = this.current;
                //newSymbolTable.parent.addChild(newSymbolTable);
                //Control.putDebug(" ["+newSymbolTable.name+", parent: "+newNode.parent.name+", children: "+newNode.children + "]");
            }
            //Control.putDebug("2");
            //Move current pointer down the tree (unless its a leaf node)
            
            //newSymbolTable.tokenPointer = token;
            //Control.putDebug("&gt;&gt; TOKEN ["+newNode.tokenPointer.str +"] at "+Utils.address(newNode.tokenPointer.startIndex));
            
            //newNode.isLeaf = isLeaf;
            //Control.putDebug("3");
            //add it to the in order node list
            //this.nodeList.push(newNode);
            //Control.putDebug("done adding node");
            return newSymbolTable;
        }

        //Up the tree, also forgetting that scope in the process
        public moveUp() {
            
            if (this.current.parent != null) {
                this.current = this.current.parent;
                //Control.putDebug("new current: "+this.current.name);
            }
            else {
                //Cannot go past the root,
                //do not move current pointer
            } 
        }

        //New tree
        public reset() {
            this.root = null;
            this.current = null;
        }

    }
}
