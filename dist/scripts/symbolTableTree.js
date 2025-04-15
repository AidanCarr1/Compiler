/*  Tree class
    For the CST
*/
var Compiler;
(function (Compiler) {
    class SymbolTableTree {
        //New Tree (for symbol tables)
        constructor(root, current) {
            this.root = root;
            this.current = current;
            //Simple tree structure
            this.root = null;
            this.current = null;
        }
        //Add new Symbol Table into the tree
        addScope() {
            var scopeName = "SCOPE " + scopeCounter;
            scopeCounter++;
            var newSymbolTable = new Compiler.SymbolTable(scopeName);
            Compiler.Control.putDebug("New Symbol Table: " + newSymbolTable.name);
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
        moveUp() {
            if (this.current.parent != null) {
                this.current = this.current.parent;
                Compiler.Control.putDebug("Move up to Symbol Table: " + this.current.name);
            }
            else {
                //Cannot go past the root,
                //do not move current pointer
            }
        }
        //New tree
        reset() {
            this.root = null;
            this.current = null;
        }
        //Declare a new variable at the current scope
        //Don't need to check all scopes
        newVariable(type, id) {
            Compiler.Control.putDebug("STT: new var");
            this.current.newVariable(type, id);
        }
        isDeclared(id) {
            return this.current.isDeclared(id);
        }
        //is this declared ANY (related) SCOPE up the tree
        isDeclaredAnyScope(id) {
            return this.getTypeAnyScope(id) != null;
        }
        //Return type with closest found scope or null if not found
        getTypeAnyScope(id) {
            var symbol = this.getSymbolAnyScope(id);
            if (symbol == null) {
                return null;
            }
            else {
                return this.getSymbolAnyScope(id).type;
            }
        }
        //set a variable as used
        setUsed(id) {
            this.getSymbolAnyScope(id).IsUsed = true;
        }
        //set a variable as initialized
        setInitialized(id) {
            this.getSymbolAnyScope(id).isInitialized = true;
        }
        getSymbolAnyScope(id) {
            var checking = this.current;
            var foundSymbolNode = checking.getSymbol(id);
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
    Compiler.SymbolTableTree = SymbolTableTree;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTableTree.js.map