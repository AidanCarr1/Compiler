/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class Node {

        //New Node
        constructor(public name?, 
            public parent?, 
            public children?) { 

            //Node knows itself, parent, children
            this.name;
            this.parent;       //Attributes are updated later
            this.children = [];
        }

        //Add node to end of the array of children
        public addChild(childNode) {
            this.children.push(childNode);
        }
    }
}
