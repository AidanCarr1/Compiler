/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class Node {

        //New Node
        constructor(public name: String, 
            //public isSymbolTableNode?: boolean,
            public parent?: Node, 
            public children?,
            public isLeaf?,
            public tokenPointer?: Token,
            public symbolTable?: SymbolTable 
            ) { 

            //Node knows itself, parent, children
            this.name = name;
            this.parent;       //Attributes are updated later
            this.children = [];

            //Node for Symbol Table (one of those)
            // if (isSymbolTableNode) {
            //     this.symbolTable = new SymbolTable();
            // }
        }

        //Add node to end of the array of children
        public addChild(childNode: Node) {
            this.children.push(childNode);
        }
    }
}
