/*  Jump Table
    for keeping track of jump distances and scope in code gen
*/

namespace Compiler {
    export class JumpTable {

        //New Static Table
        constructor(public entries?: Entry[],
            public entryCount?: number
            ) { 

            this.entries = []; //entries in the static table
            this.entryCount = 0;
        }

        //New entry
        public newJump() {
            //know the start position of the jump
            var currentAddress = code.length/2;

        }

        //New entry for const numbers 0-9
        public constEntry(id:String): Entry {

            //Check if entry already exists
            //ex: "0" "1" "2"...
            for (var i=0; i<this.entryCount; i++) {
                if (this.entries[i].id === id) {
                    return this.entries[i];
                }
            }
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
