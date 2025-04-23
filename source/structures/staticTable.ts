/*  Static Table
    for keeping track of static variables in code gen
*/

namespace Compiler {
    export class StaticTable {

        //New Static Table
        constructor(public entries?: Entry[]
            ) { 

            this.entries = []; //entries in the static table
        }
    }
}
