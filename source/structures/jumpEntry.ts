/*  Jump Entry
    An Entry in Jump Table for code gen
*/

namespace Compiler {
    export class JumpEntry {

        //New Jump
        constructor(
            public name: String,
            public scopeName: String,
            public type: String,
            public startLocation: number,
            public endLocation?: number
            ) { 

            //set as given!
            this.name = name; //"J4", "L3"
            this.scopeName = scopeName; //"SCOPE2"
            this.type = type; //"jump", "loop"
            this.startLocation = startLocation; //10
            this.endLocation = startLocation; //15
        }
    }
}
