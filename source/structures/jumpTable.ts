/*  Jump Table
    for keeping track of jump distances and scope in code gen
*/

namespace Compiler {
    export class JumpTable {

        //New Jump Table
        constructor(public jumps?: JumpEntry[],
            public loops?: JumpEntry[]
         ) { 

            this.jumps = []; //entries in the jump table
            this.loops = []; //entries in the jump table
        }

        //New jump
        public newJump() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);

            //know the start position of the jump
            var currentAddress = code.length/2;
            Control.putDebug("jump add:"+Utils.toHex(currentAddress));

            var newJump = new JumpEntry("J"+jumpCounter, scopeName, "jump", currentAddress);
            this.jumps.push(newJump);

            jumpCounter ++;
        }

        public landJump() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Control.putDebug("compare: "+this.jumps[jumpCounter-1].scopeName+" - "+ scopeName);

            if(this.jumps[jumpCounter-1].scopeName === scopeName/* && this.jumps[jumpCounter-1].type === "jump"*/) {

                //know the land position of the jump
                var currentAddress = code.length/2;
                Control.putDebug("landed at:"+Utils.toHex(currentAddress));

                this.jumps[jumpCounter-1].endLocation = currentAddress;
            }
        }

        //New jump (for while loops)
        public newLoop() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);

            //know the start position of the jump
            var currentAddress = code.length/2;
            Control.putDebug("loop add:"+Utils.toHex(currentAddress));

            var newLoop = new JumpEntry("L"+loopCounter, scopeName, "loop", currentAddress);
            this.loops.push(newLoop);

            loopCounter ++;
        }


        public landLoop() {
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;
            Control.putDebug("compare: "+this.loops[jumpCounter-1].scopeName+" - "+ scopeName);

            if(this.loops[loopCounter-1].scopeName === scopeName) {

                //know the land position of the jump
                var currentAddress = code.length/2;
                Control.putDebug("landed at:"+Utils.toHex(currentAddress));

                this.loops[loopCounter-1].endLocation = currentAddress;
            }
        }


        //reset
        public reset() {
            this.jumps = [];
            this.loops = [];
        }
    }
}
