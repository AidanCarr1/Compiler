/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class SymbolTable {

        //New Node
        constructor(public table?: String[]) { 

            //Table of 26 positions (one for each letter id)
            this.table = new Array(26).fill(null);;
        }

        //Add node to end of the array of children
        public newVariable(type:String, id:String) {

            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);

            //if ID is NOT declared, declare it
            if (!this.isDeclared(id)) {
                this.table[idCode] = type;
            }
            //ID already declared, give error
            else {
                var newError = new ErrorCompiler("VARIABLE REDECLARATION", type+" "+id, currentNode.tokenPointer.startIndex);
            }
        }

        //Return true/false if a given id has been declared in this scope
        public isDeclared(id:String): boolean {

            var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode] != null;
            //null -> not declared -> false
            //full -> declared -> true
        }

        //Return type string given id string
        public getType(id:String): String {
            
            var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode];
        }
    }
}
