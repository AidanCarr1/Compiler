/*  Tree class
    For the CST
*/

namespace Compiler {
    export class SymbolTableTree {

        //New Tree (for symbol tables)
        constructor(public root?:SymbolTable,
                    public current?:SymbolTable,
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
        public setUsed(id:String) {
            this.getSymbolAnyScope(id).IsUsed = true;
        }
        //set a variable as initialized
        public setInitialized(id:String) {
            this.getSymbolAnyScope(id).isInitialized = true;
        }


        public getSymbolAnyScope(id: String) {
            
            var checking:SymbolTable = this.current;
            var foundSymbolNode:SymbolNode = checking.getSymbol(id);

            //check up the scopes
            while (foundSymbolNode.type == null && checking.parent != null) {
                checking = checking.parent;
                foundSymbolNode = checking.getSymbol(id);
            }


            return foundSymbolNode;
        }

        public getAddressById(id:String) {
            var symbolNode = _SymbolTableTree.getSymbolAnyScope(id);
            return symbolNode.entryPointer.tempAddress;
        }




        /* after everyhting is done, traverse the tree to print and find warnings*/
        public checkWarnings(thisScope:SymbolTable) {
        Control.putDebug("Checking warnings on a SCOPE "+thisScope.name);

            //first check ids on this scope
            for (var code = 0; code < 26; code++) {
                //convert number to letter
                var letter = String.fromCharCode("a".charCodeAt(0) + code);
                //Control.putDebug("check "+letter);

                //get the Symbol Node
                var thisSymbolNode:SymbolNode = thisScope.table[code];

                if (thisSymbolNode.type != null) {
                    if (!thisSymbolNode.isInitialized) {
                        Control.putDebug("init warn");
                        var initWarning = new Warning("Variable "+letter+" not initialized", null);
                    }
                    if (!thisSymbolNode.IsUsed) {
                        Control.putDebug("used warn");
                        var usedWarning = new Warning("Variable "+letter+" not used", null);
                    }
                }
            }

            //then check all the children scope's ids
            for (var i = 0; i < thisScope.children.length; i++) {
                this.checkWarnings(thisScope.children[i]);
            }
        }


        public printTree() {
            //Start with blank slate
            traversalResult = "";

            this.expand(this.root, 0);
            Control.putImportantMessage(traversalResult);
        }

        private expand(node: SymbolTable, depth) {
            
            //Skip the fake leaf! (empty List item)
            // if (!node.isLeaf && (!node.children || node.children.length === 0)) {
            //     return;
            // }

            for (var i = 0; i < depth; i++) {
                traversalResult += "-";
            }

            //Print scope name
            traversalResult += "[" + node.name + "] <br>";

            //Print the table for current scope
            //first check ids on this scope
            for (var code = 0; code < 26; code++) {
                //convert number to letter
                var letter = String.fromCharCode("a".charCodeAt(0) + code);
                //Control.putDebug("check "+letter);

                //get the Symbol Node
                var thisSymbolNode:SymbolNode = node.table[code];
                //Found an entry!
                if (thisSymbolNode.type != null) {

                    //Print the same indent again
                    for (var i = 0; i < depth; i++) {
                        traversalResult += "-";
                    }

                    //Print the info
                    traversalResult += letter +" : " +thisSymbolNode.type+", ";
                    if (thisSymbolNode.isInitialized) {
                        traversalResult += "initialized, ";
                    }
                    else {
                        traversalResult += "not initialized, ";
                    }
                    if (thisSymbolNode.IsUsed) {
                        traversalResult += "used <br>";
                    }
                    else {
                        traversalResult += "not used <br>";
                    }
                }
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                //return
            }
            else {
                // .. recursively expand the children.
                for (var i = 0; i < node.children.length; i++) {
                    this.expand(node.children[i], depth + 1);
                }
            }
        }

    }
}
