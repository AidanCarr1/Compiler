/*  Entry
    An Entry in Static Table for code gen
*/
var Compiler;
(function (Compiler) {
    class Entry {
        //New Entry
        constructor(id, entryNumber, scope, tempAddress, offset) {
            this.id = id;
            this.entryNumber = entryNumber;
            this.scope = scope;
            this.tempAddress = tempAddress;
            this.offset = offset;
            //String id
            this.id = id;
            this.scope = scopeCounter;
            this.entryNumber = entryNumber;
            //string address and placement
            this.tempAddress = "T" + entryNumber + "XX";
            this.offset = entryNumber;
        }
    }
    Compiler.Entry = Entry;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=entry.js.map