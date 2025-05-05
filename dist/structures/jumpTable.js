/*  Jump Table
    for keeping track of jump distances and scope in code gen
*/
var Compiler;
(function (Compiler) {
    class JumpTable {
        //New Jump Table
        constructor(jumps) {
            this.jumps = jumps;
            this.jumps = []; //entries in the jump table
        }
        //New jump
        newJump() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);
            //know the start position of the jump
            var currentAddress = code.length / 2;
            Compiler.Control.putDebug("jump add:" + Compiler.Utils.toHex(currentAddress));
            var newJump = new Compiler.JumpEntry("J" + jumpCounter, scopeName, currentAddress);
            this.jumps.push(newJump);
            jumpCounter++;
        }
        landJump() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Compiler.Control.putDebug("compare: " + this.jumps[jumpCounter - 1].scopeName + " - " + scopeName);
            if (this.jumps[jumpCounter - 1].scopeName === scopeName) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                this.jumps[jumpCounter - 1].endLocation = currentAddress;
            }
        }
        //reset
        reset() {
            this.jumps = [];
        }
    }
    Compiler.JumpTable = JumpTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=jumpTable.js.map