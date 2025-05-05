/*  Jump Entry
    An Entry in Jump Table for code gen
*/
var Compiler;
(function (Compiler) {
    class JumpEntry {
        //New Jump
        constructor(name, scopeName, type, startLocation, endLocation) {
            this.name = name;
            this.scopeName = scopeName;
            this.type = type;
            this.startLocation = startLocation;
            this.endLocation = endLocation;
            //String
            this.name = name; //"J4", "L3"
            this.scopeName = scopeName; //"SCOPE2"
            this.type = type; //"jump", "loop"
            this.startLocation = startLocation; //10
            this.endLocation = startLocation; //15
            //string address and placement
            // this.tempAddress = "T"+entryNumber+"XX"; //lil endian shit
            // if (entryNumber >= 10) {
            //     this.tempAddress = ""+entryNumber+"XX";
            // }
            // this.offset = entryNumber;
        }
    }
    Compiler.JumpEntry = JumpEntry;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=jumpEntry.js.map