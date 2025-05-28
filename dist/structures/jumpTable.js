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
            Compiler.Control.putDebug("NEW JUMP: " + newJump.name + ", " + newJump.scopeName + ", start:" + Compiler.Utils.toHex(newJump.startLocation));
            this.jumps.push(newJump);
            jumpCounter++;
        }
        landJump() {
            //leave if theres no jumps
            if (this.jumps.length == 0) {
                return;
            }
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            for (var i = this.jumps.length - 1; i >= 0; i--) {
                //check top of stack for a jump
                if (this.jumps[i].scopeName === scopeName) {
                    //know the land position of the jump
                    var currentAddress = code.length / 2;
                    Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                    this.jumps[i].endLocation = currentAddress;
                }
            }
        }
        //New jump (for while loops)
        newLoop() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);
            loopCounter++;
            //know the start position of the jump
            var currentAddress = code.length / 2;
            var newLoop = new Compiler.JumpEntry("L" + loopCounter, scopeName, "loop", currentAddress);
            Compiler.Control.putDebug("NEW LOOP: " + newLoop.name + ", " + newLoop.scopeName + ", start:" + Compiler.Utils.toHex(newLoop.startLocation));
            this.loops.push(newLoop);
        }
        loopBack() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            //check if any loops belong to the scope
            var loop = null;
            for (var i = this.loops.length - 1; i >= 0; i--) {
                //check top of stack for a jump
                if (this.loops[i].scopeName === scopeName) {
                    loop = this.loops[i];
                    break;
                }
            }
            //no match found
            if (loop == null) {
                return "";
            }
            Compiler.Control.putDebug("~~~~last loop: " + loop.name + ", " + loop.scopeName);
            if (loop.scopeName === scopeName) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug(loop.name + ": landed at:" + Compiler.Utils.toHex(currentAddress));
                loop.endLocation = currentAddress;
                Compiler.Control.putDebug(loop.name + ": go from " + Compiler.Utils.toHex(loop.endLocation) + " to " + Compiler.Utils.toHex(loop.startLocation));
                //remove that loop?
                //this.loops.pop(); 
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