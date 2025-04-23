/*  Entry
    An Entry in Static Table for code gen
*/

namespace Compiler {
    export class Entry {

        //New Entry
        constructor(
            public id?: String,
            public temp?: String,
            public scope?: number,
            public address?: number
            ) { 

            this.id = "T"+variableCounter+"XX";
            this.temp = "";
            this.scope = scopeCounter;
            this.address = variableCounter;

        }
    }
}
