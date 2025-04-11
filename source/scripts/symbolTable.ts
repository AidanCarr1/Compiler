/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class SymbolTable {

        //New Node
        constructor(public table?: Array<String>) { 

            //Table of 26 positions (one for each letter id)
            this.table = String[26];
        }

        //Add node to end of the array of children
        public newVariable(type:String, id:String) {
            Control.putDebug("ST: new var called");

            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);
            Control.putDebug(id+"="+idCode);

            //if ID is NOT declared, declare it
            if (!this.isDeclared(id)) {
                this.table[idCode] = type;
                Control.putDebug("declared it");
            }
            //ID already declared, give error
            else {
                var newError = new ErrorCompiler("VARIABLE REDELCARATION", type+" "+id, currentNode.tokenPointer.startIndex);
            }
        }

        //Return true/false if a given id has been declared in this scope
        public isDeclared(id:String): boolean {
            Control.putDebug("ST: isDecl called with "+id);
            Control.putDebug("ascii "+id.charCodeAt(0));
            Control.putDebug(id.charCodeAt(0) - "a".charCodeAt(0));


            var newIdCode = id.charCodeAt(0) - "a".charCodeAt(0);
            Control.putDebug("Whats in "+id+": "+this.table[newIdCode]);
            //return this.table[newIdCode] != null;
            //null -> not declared -> false
            //full -> declared -> true
            return false;
        }
    }
}
