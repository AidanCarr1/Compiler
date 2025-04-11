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

            //convert letter to number a-z = 0-25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);

            //if ID has NEVER been declared
            if (this.table[idCode] == null) {
                this.table[idCode] = type;
            }
            //ID already declared
            else {
                var newError = new ErrorCompiler("VARIABLE REDELCARATION", type+" "+id, currentNode.tokenPointer.startIndex);
            }
        }
    }
}
