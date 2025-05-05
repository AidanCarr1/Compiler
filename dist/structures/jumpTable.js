/*  Jump Table
    for keeping track of jump distances and scope in code gen
*/
var Compiler;
(function (Compiler) {
    class JumpTable {
        //New Static Table
        constructor(entries, entryCount) {
            this.entries = entries;
            this.entryCount = entryCount;
            this.entries = []; //entries in the static table
            this.entryCount = 0;
        }
        //New entry
        newJump() {
            //know the start position of the jump
            var currentAddress = code.length / 2;
        }
        //New entry for const numbers 0-9
        constEntry(id) {
            //Check if entry already exists
            //ex: "0" "1" "2"...
            for (var i = 0; i < this.entryCount; i++) {
                if (this.entries[i].id === id) {
                    return this.entries[i];
                }
            }
            //Create Entry object
            var newEntry = new Compiler.Entry(id, this.entryCount);
            //Increment count
            this.entryCount++;
            //Add to list of Entries
            this.entries.push(newEntry);
            return this.entries[this.entryCount - 1];
        }
        //reset
        reset() {
            this.entries = [];
            this.entryCount = 0;
        }
    }
    Compiler.JumpTable = JumpTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=jumpTable.js.map