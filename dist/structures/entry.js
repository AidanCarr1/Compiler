/*  Entry
    An Entry in Static Table for code gen
*/
var Compiler;
(function (Compiler) {
    class Entry {
        //New Entry
        constructor(id, temp, scope, address) {
            this.id = id;
            this.temp = temp;
            this.scope = scope;
            this.address = address;
            this.id = "T" + variableCounter + "XX";
            this.temp = "";
            this.scope = scopeCounter;
            this.address = variableCounter;
        }
    }
    Compiler.Entry = Entry;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=entry.js.map