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
            while (foundSymbolNode.type == null && checking.parent != null) {
                checking = checking.parent;
                foundSymbolNode = checking.getSymbol(id);
            }
            return foundSymbolNode;
        }
        /* after everyhting is done, traverse the tree to print and find warnings*/
        checkWarnings(thisScope) {
            Compiler.Control.putDebug("Checking warnings on a SCOPE " + thisScope.name);
            //first check ids on this scope
            for (var code = 0; code < 26; code++) {
                //convert number to letter
                var letter = String.fromCharCode("a".charCodeAt(0) + code);
                //Control.putDebug("check "+letter);
                //get the Symbol Node
                var thisSymbolNode = thisScope.table[code];
                if (thisSymbolNode.type != null) {
                    if (!thisSymbolNode.isInitialized) {
                        Compiler.Control.putDebug("init warn");
                        var initWarning = new Compiler.Warning("Variable " + letter + " not initialized", null);
                    }
                    if (!thisSymbolNode.IsUsed) {
                        Compiler.Control.putDebug("used warn");
                        var usedWarning = new Compiler.Warning("Variable " + letter + " not used", null);
                    }
                }
            }
            //then check all the children scope's ids
            for (var i = 0; i < thisScope.children.length; i++) {
                this.checkWarnings(thisScope.children[i]);
            }
        }
        printTree() {
            //Start with blank slate
            traversalResult = "";
            this.expand(this.root, 0);
            Compiler.Control.putImportantMessage(traversalResult);
        }
        expand(node, depth) {
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
                var thisSymbolNode = node.table[code];
                //Found an entry!
                if (thisSymbolNode.type != null) {
                    //Print the same indent again
                    for (var i = 0; i < depth; i++) {
                        traversalResult += "-";
                    }
                    //Print the info
                    traversalResult += letter + " : " + thisSymbolNode.type + ", ";
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
    Compiler.SymbolTableTree = SymbolTableTree;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=symbolTableTree.js.map