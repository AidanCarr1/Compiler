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
            Control.putDebug("NEW JUMP: "+newJump.name+", "+ newJump.scopeName+", start:"+ Utils.toHex(newJump.startLocation));
            this.jumps.push(newJump);

            jumpCounter ++;
        }

        public landJump() {
            //leave if theres no jumps
            if (this.jumps.length == 0) { 
                return;
            }
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;

            for (var i=this.jumps.length-1; i >= 0; i --) {
                //check top of stack for a jump
                if(this.jumps[i].scopeName === scopeName) {

                    //know the land position of the jump
                    var currentAddress = code.length/2;
                    Control.putDebug("landed at:"+Utils.toHex(currentAddress));

                    this.jumps[i].endLocation = currentAddress;
                }
            }           
        }

        //New jump (for while loops)
        public newLoop() {
            //get name of next scope
            var scopeName = "SCOPE " + (scopeCounter);
            loopCounter ++;

            //know the start position of the jump
            var currentAddress = code.length/2;

            var newLoop = new JumpEntry("L"+loopCounter, scopeName, "loop", currentAddress);
            Control.putDebug("NEW LOOP: "+newLoop.name+", "+ newLoop.scopeName+", start:"+ Utils.toHex(newLoop.startLocation));

            this.loops.push(newLoop);

        }


        public loopBack(): String {
            //leave if theres no loops
            if (this.loops.length == 0) { 
                Control.putDebug("~~~~no loops left");
                return "";
            }
            //get name of current scope before leaving
            var scopeName = _SymbolTableTree.current.name;

            //check if any loops belong to the scope
            var loop = null;
            for (var i=this.loops.length-1; i >= 0; i --) {
                //check top of stack for a jump
                if(this.loops[i].scopeName === scopeName) {
                    loop = this.loops[i];
                    break;
                }
            }   

            //no match found
            if (loop == null) {
                return "";
            }

            Control.putDebug("~~~~last loop: "+loop.name+", "+loop.scopeName);

            if(loop.scopeName === scopeName) {

                //know the land position of the jump
                var currentAddress = code.length/2;
                Control.putDebug(loop.name+": landed at:"+Utils.toHex(currentAddress));

                loop.endLocation = currentAddress;
                Control.putDebug(loop.name+": go from "+Utils.toHex(loop.endLocation)+" to "+ Utils.toHex(loop.startLocation))

                //remove that loop?
                //this.loops.pop(); 

                return loop.name;
            }
            return "";
        }


        //reset
        public reset() {
            this.jumps = [];
            this.loops = [];
        }
    }
}
