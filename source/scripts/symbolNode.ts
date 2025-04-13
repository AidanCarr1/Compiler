/*  Symbol Node class
    An entry in the symbol table
*/

namespace Compiler {
    export class SymbolNode {

        //New Node
        constructor(public type?: String, 

            public isInherited?: boolean,
            public isInitialized?: boolean,
            public IsUsed?: boolean
            ) { 

            //Know the data type
            this.type = null;

            //For scope reasons
            this.isInherited = false;

            //For error/warning reasons
            this.isInitialized = false;
            this.IsUsed = false;
        }

    }
}
