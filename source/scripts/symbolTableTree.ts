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

            //First scope, root symbol table "node"
            if (this.root == null) {
                this.root = newSymbolTable;
                //this.nodeList = [];
            }
            
            //newNode is current's child
            else {
                newSymbolTable.parent = this.current;
                newSymbolTable.parent.addChild(newSymbolTable);
            }

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

            var symbol = this.getSymbolAnyScope(id);
            if (symbol == null) {
                return null;
            }
            else {
                return this.getSymbolAnyScope(id).type;
            }
        }

        
        //set a variable as used
        //can only come here if id exists
        public setUsed(id:String) {
            this.getSymbolAnyScope(id).IsUsed = true;
        }


        public getSymbolAnyScope(id: String) {
            
            var checking:SymbolTable = this.current;
            var foundSymbolNode:SymbolNode = checking.getSymbol(id);

            //check up the scopes
            //Control.putDebug("hello?");
            //Control.putDebug("1, "+(foundSymbolNode.type == null) +" 2,"+(checking.parent != null));
            while (foundSymbolNode.type == null && checking.parent != null) {
                checking = checking.parent;
                //Control.putDebug("Lets DAMNNNN check " +checking.name);
                foundSymbolNode = checking.getSymbol(id);
            }


            return foundSymbolNode;
        }
    }
}
