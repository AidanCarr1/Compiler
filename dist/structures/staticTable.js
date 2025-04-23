/*  Static Table
    for keeping track of static variables in code gen
*/
var Compiler;
(function (Compiler) {
    class StaticTable {
        //New Static Table
        constructor(entries) {
            this.entries = entries;
            this.entries = []; //entries in the static table
        }
    }
    Compiler.StaticTable = StaticTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=staticTable.js.map