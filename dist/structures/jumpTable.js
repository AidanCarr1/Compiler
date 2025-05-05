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
            //leave if theres no jumps
            if (jumpCounter == 0) {
                return;
            }
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
            loopCounter++;
            //know the start position of the jump
            var currentAddress = code.length / 2;
            Compiler.Control.putDebug("loop add:" + Compiler.Utils.toHex(currentAddress));
            var newLoop = new Compiler.JumpEntry("L" + loopCounter, scopeName, "loop", currentAddress);
            this.loops.push(newLoop);
        }
        loopBack() {
            //leave if theres no loops
            if (loopCounter == 0) {
                return "";
            }
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Compiler.Control.putDebug("compare: " + this.loops[jumpCounter - 1].scopeName + " - " + scopeName);
            var loop = this.loops[loopCounter - 1];
            if (loop.scopeName === scopeName) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                loop.endLocation = currentAddress;
                Compiler.Control.putDebug("go from " + Compiler.Utils.toHex(loop.endLocation) + " to " + Compiler.Utils.toHex(loop.startLocation));
                return loop.name;
            }
            return "";
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