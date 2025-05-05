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
            //Control.putDebug("JUMP compare: "+this.jumps[this.jumps.length-1].scopeName+" - "+ scopeName);
            for (var i = this.jumps.length - 1; i >= 0; i--) {
                //check top of stack for a jump
                if (this.jumps[i].scopeName === scopeName) {
                    //know the land position of the jump
                    var currentAddress = code.length / 2;
                    Compiler.Control.putDebug("landed at:" + Compiler.Utils.toHex(currentAddress));
                    this.jumps[i].endLocation = currentAddress;
                    //var out = this.jumps.pop();
                    //jumpCounter--;
                }
            }
            // else if(this.jumps[this.jumps.length-2].scopeName === scopeName) {
            //     //know the land position of the jump
            //     var currentAddress = code.length/2;
            //     Control.putDebug("landed at:"+Utils.toHex(currentAddress));
            //     this.jumps[jumpCounter-2].endLocation = currentAddress;
            //     //var out = this.jumps.pop();
            //     //jumpCounter--;
            // }
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
            //leave if theres no loops
            if (loopCounter == 0) {
                return "";
            }
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            //Control.putDebug("LOOP compare: "+this.loops[loopCounter-1].scopeName+" - "+ scopeName);
            var loop = this.loops[loopCounter - 1];
            if (loop.scopeName === scopeName) {
                //know the land position of the jump
                var currentAddress = code.length / 2;
                Compiler.Control.putDebug(loop.name + ": landed at:" + Compiler.Utils.toHex(currentAddress));
                loop.endLocation = currentAddress;
                Compiler.Control.putDebug(loop.name + ": go from " + Compiler.Utils.toHex(loop.endLocation) + " to " + Compiler.Utils.toHex(loop.startLocation));
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