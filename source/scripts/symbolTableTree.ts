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
        public addScope(): SymbolTable {
            
            var scopeName = "SCOPE " + scopeCounter;
            scopeCounter ++;
            var newSymbolTable = new SymbolTable(scopeName);
            Control.putDebug("New Symbol Table: " + newSymbolTable.name);

            //Control.putDebug("1");
            //First scope, root symbol table "node"
            if (this.root == null) {
                this.root = newSymbolTable;
                //this.nodeList = [];
            }
            
            //newNode is current's child
            else {
                newSymbolTable.parent = this.current;
                newSymbolTable.parent.addChild(newSymbolTable);
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

            //make it the new current
            this.current = newSymbolTable;
            //Control.putDebug("returning");
            return newSymbolTable;
        }

        //Up the tree, also forgetting that scope in the process
        public moveUp() {
            
            if (this.current.parent != null) {
                this.current = this.current.parent;
                Control.putDebug("Move up to Symbol Table: "+this.current.name);
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


        //Declare a new variable at the current scope
        //Don't need to check all scopes
        public newVariable(type:String, id:String) {
            Control.putDebug("STT: new var");
            this.current.newVariable(type, id);
        }

        public isDeclared(id:String) {
            return this.current.isDeclared(id);
        }

        //is this declared ANY (related) SCOPE up the tree
        public isDeclaredAnyScope(id:String): boolean {
            return this.getTypeAnyScope(id) != null;
        }

        //Return type with closest found scope or null if not found
        public getTypeAnyScope(id:String): String {

            Control.putDebug("in get type any scope STT");
            //var isFound = false;
            //var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            //try the first scope
            var foundType = this.current.getType(id);
            //var scopesMoved = 0;
            var checking:SymbolTable = this.current;

            //check up the scopes
            while (foundType == null && checking.parent != null) {
                //scopesMoved++;
                checking = checking.parent;
                Control.putDebug("Lets check " +checking.name);
                foundType = checking.getType(id);
            }
            Control.putDebug("FOUND TYPE: "+foundType);
            return foundType;

        }

        
        //set a variable as used
        //can only come here if id exists
        public setUsed(id:String) {
            var foundType = false;
            //var scopesMoved = 0;
            var checking:SymbolTable = this.current;

            //check up the scopes
            while (foundID == null && checking.parent != null) {
                //scopesMoved++;
                checking = checking.parent;
                Control.putDebug("Lets check " +checking.name);
                foundType = checking.getType(id);
            }

            return foundType;
        }


        public getSymbolNodeById(id: String) {
            var foundSymbolNode = this.current;
            //var scopesMoved = 0;
            var checking:SymbolTable = this.current;

            //check up the scopes
            while (foundType == null || checking.parent != null) {
                //scopesMoved++;
                checking = checking.parent;
                Control.putDebug("Lets check " +checking.name);
                foundType = checking.getType(id);
            }

            return foundType;
        }
    }
}
