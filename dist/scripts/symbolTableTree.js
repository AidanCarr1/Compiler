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
            Compiler.Control.putDebug("returning");
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
        newVariable(type, id) {
            Compiler.Control.putDebug("STT: new var");
            this.current.newVariable(type, id);
        }
        isDeclared(id) {
            return this.current.isDeclared(id);
        }
        getType(id) {
            //onyl works for current scope rn
            return this.current.getType(id);
        }
    }
    Compiler.SymbolTableTree = SymbolTableTree;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTableTree.js.map