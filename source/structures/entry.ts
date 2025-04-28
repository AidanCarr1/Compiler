/*  Entry
    An Entry in Static Table for code gen
*/

namespace Compiler {
    export class Entry {

        //New Entry
        constructor(
            public id: String,
            public entryNumber: number,

            public scope?: number,
            public tempAddress?: string, //there's a difference between string and String??
                                         //needed for find and replace later
            public offset?: number
            ) { 

            //String id
            this.id = id;
            this.scope = scopeCounter;
            this.entryNumber = entryNumber;

            //string address and placement
            this.tempAddress = "T"+entryNumber+"XX"; //lil endian shit
            if (entryNumber >= 10) {
                this.tempAddress = ""+entryNumber+"XX";
            }
            this.offset = entryNumber;

        }
    }
}
