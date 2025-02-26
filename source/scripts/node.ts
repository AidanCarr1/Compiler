/*  Node class
    With the tree class for CST
*/

namespace Compiler {
    export class Node {

        constructor(public name?, 
            public parent?, 
            public children?) { 

            //Node knows itself, parent, children
            this.name = name;
            this.parent = parent;       //maybe make these null
            this.children = [];
        }

        //Add another to the list of children
        public addChild(childNode) {
            this.children.push(childNode);
        }
    }
}
