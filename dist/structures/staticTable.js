/*  Static Table
    for keeping track of static variables in code gen
*/
var Compiler;
(function (Compiler) {
    class StaticTable {
        //New Static Table
        constructor(entries, entryCount) {
            this.entries = entries;
            this.entryCount = entryCount;
            this.entries = []; //entries in the static table
            this.entryCount = 0;
        }
        //New entry
        newEntry(id) {
            //Create Entry object
            var newEntry = new Compiler.Entry(id, this.entryCount);
            //Increment count
            this.entryCount++;
            //Add to list of Entries
            this.entries.push(newEntry);
            //Add pointer to symbolNode
            // entryPointer
            return this.entries[this.entryCount - 1];
        }
        //reset
        reset() {
            this.entries = [];
            this.entryCount = 0;
        }
    }
    Compiler.StaticTable = StaticTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=staticTable.js.map