/*  Jump Table
    for keeping track of jump distances and scope in code gen
*/
var Compiler;
(function (Compiler) {
    class JumpTable {
        //New Jump Table
        constructor(jumps, loops) {
            this.jumps = jumps;
            this.loops = loops;
            this.jumps = []; //entries in the jump table
            this.loops = []; //entries in the jump table
        }
        //New jump
        newJump() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);
            //know the start position of the jump
            var currentAddress = code.length / 2;
            Compiler.Control.putDebug("jump add:" + Compiler.Utils.toHex(currentAddress));
            var newJump = new Compiler.JumpEntry("J" + jumpCounter, scopeName, "jump", currentAddress);
            this.jumps.push(newJump);
            jumpCounter++;
        }
        landJump() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Compiler.Control.putDebug("compare: " + this.jumps[jumpCounter - 1].scopeName + " - " + scopeName);
            if (this.jumps[jumpCounter - 1].scopeName === scopeName /* && this.jumps[jumpCounter-1].type === "jump"*/) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                this.jumps[jumpCounter - 1].endLocation = currentAddress;
            }
        }
        //New jump (for while loops)
        newLoop() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);
            //know the start position of the jump
            var currentAddress = code.length / 2;
            Compiler.Control.putDebug("loop add:" + Compiler.Utils.toHex(currentAddress));
            var newLoop = new Compiler.JumpEntry("L" + loopCounter, scopeName, "loop", currentAddress);
            this.loops.push(newLoop);
            loopCounter++;
        }
        landLoop() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Compiler.Control.putDebug("compare: " + this.loops[jumpCounter - 1].scopeName + " - " + scopeName);
            if (this.loops[loopCounter - 1].scopeName === scopeName) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                this.loops[loopCounter - 1].endLocation = currentAddress;
            }
        }
        //reset
        reset() {
            this.jumps = [];
            this.loops = [];
        }
    }
    Compiler.JumpTable = JumpTable;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=jumpTable.js.map