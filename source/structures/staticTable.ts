/*  Static Table
    for keeping track of static variables in code gen
*/

namespace Compiler {
    export class StaticTable {

        //New Static Table
        constructor(public entries?: Entry[],
            public entryCount?: number
            ) { 

            this.entries = []; //entries in the static table
            this.entryCount = 0;
        }

        //New entry
        public newEntry(id:String): Entry {
            //Create Entry object
            var newEntry = new Entry(id, this.entryCount);

            //Increment count
            this.entryCount ++;

            //Add to list of Entries
            this.entries.push(newEntry);

            return this.entries[this.entryCount-1];
        }

        //reset
        public reset() {
            this.entries = [];
            this.entryCount = 0;
        }
    }
}
