/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class SymbolTable {

        //New Node
        constructor(public name?: String, //ex: "SCOPE 1"
            public table?: SymbolNode[],
            public parent?: SymbolTable,
            public children?: SymbolTable[] 
            ) { 

            //Table of 26 positions (one SymbolNode for each letter id)
            this.table = Array.from({ length: 26 }, () => new SymbolNode());
            //Some ChatGPT Help ^^

            this.children = [];
        }


        public addChild(childSymbolTable:SymbolTable){
            this.children.push(childSymbolTable);
        }


        //Edit the symbol node for given id inside the table array
        public newVariable(type:String, id:String) {
            Control.putDebug("ST: new var");

            //convert letter to number a->z = 0->25
            var idCode = id.charCodeAt(0) - "a".charCodeAt(0);

            //if ID is NOT declared on the current scope, declare it
            if (this.table[idCode].type == null) {
                this.table[idCode].type = type;
            }
            else {
                var newError = new ErrorCompiler("VARIABLE REDECLARATION", id+" has already been declared in the same scope", currentNode.tokenPointer.startIndex);
            }
        }

        //Return true/false if a given id has been declared in this scope
        public isDeclared(id:String): boolean {

            //var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.getType(id) != null;
            //null -> not declared -> false
            //full -> declared -> true
        }


        //Return type string given id string
        public getType(id:String): String {
            
            var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode].type;
        }

        public getSymbol(id:String):SymbolNode {
            var idCode:number = (id.charCodeAt(0) - "a".charCodeAt(0));
            return this.table[idCode];
        }
    }
}
