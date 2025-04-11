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
            this.table[idCode] = type;
            
        }
    }
}
