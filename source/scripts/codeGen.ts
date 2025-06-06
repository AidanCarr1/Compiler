/*  Code Generation
    Project 4

    Using the Abstract Syntax Tree,
    Create 6502 code
*/

namespace Compiler {
    export class CodeGen {

        public static generate() {
            
            //code
            code = "";
            heapCode = "";
            clipboardCode = "";

            //tables
            _StaticTable;
            _StaticTable.reset();

            //Redo the scope table
            _SymbolTableTree.reset();
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;

            //Track jumps
            jumpCounter = 0;
            loopCounter = 0;
            _JumpTable.reset();

            
            //Go through the AST until we reach the end
            while (currentNode != null) {

                switch (currentNode.name) {


                    case "Block":
                        Control.putCodeGenMessage("Block");

                        //New scope, grow up the tree
                        _SymbolTableTree.addScope();
                        //Go to first statement inside the block
                        this.nextNode();
                        break;


                    case "Var Decl":
                        Control.putCodeGenMessage("Var Decl");

                        //Get type
                        this.nextNode();
                        var type:String = currentNode.tokenPointer.str; //"int" "boolean" "string"
                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        //Put it in the symbol table
                        _SymbolTableTree.newVariable(type, id);
                        var symbolNode:SymbolNode = _SymbolTableTree.getSymbolAnyScope(id);

                        //Put in static table
                        var entry = _StaticTable.newEntry(id);
                        //Symbol node points to static table entry
                        symbolNode.entryPointer = entry;

                        //Initialize int/boolean as 00
                        if (type === "int" || type === "boolean") {
                            code += "A9"+"00"+"8D";
                            //Add temporary variable location
                            code += ""+entry.tempAddress;
                        }
                        //Initialize string pointer to 0xFF which will be string termination or 00s
                        else if (type === "string") {
                            code += "A9"+"FF"+"8D";
                            //Add temporary variable location
                            code += ""+entry.tempAddress;
                        }

                        //Next statement
                        this.nextNode();
                        break;
                    

                    case "Print":
                        Control.putCodeGenMessage("Print");

                        //What we are printing:
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        //If printing an addition
                        if (currentNode.name === "Addition") {
                            //load acc with addition
                            this.doAddition();

                            //create entry for this
                            var constantEntry = _StaticTable.newEntry("PRINT"+currentNode.name);
                            //store in an address
                            code += "8D" + constantEntry.tempAddress;
                            //put it in xreg, print that address
                            code += "AC" + constantEntry.tempAddress + "A201FF";

                        }
                        //printing equality/inequality
                        else if (currentNode.name === "Inequality") {
                            this.doEquality();
                            this.accOppositeZFlag();

                            //make a variable entry for the constant digit
                            var inequalityEntry = _StaticTable.newEntry("INEQUALITY");
                            //store acc
                            code += "8D" + inequalityEntry.tempAddress;
                            //put it in xreg, print that address
                            code += "AC" + inequalityEntry.tempAddress + "A201FF";
                        } 
                        else if (currentNode.name === "Equality") {
                            this.doEquality();
                            this.accZFlag();
                            //make a variable entry for the constant digit
                            var equalityEntry = _StaticTable.newEntry("EQUALITY");
                            //store acc
                            code += "8D" + equalityEntry.tempAddress;
                            //put it in xreg, print that address
                            code += "AC" + equalityEntry.tempAddress + "A201FF";
                        }

                        //If printing a variable...
                        else if (currentNode.tokenPointer.description === "ID") {
                            
                            //Get address
                            var addressStr = _SymbolTableTree.getAddressById(id);
                            var type = _SymbolTableTree.getTypeAnyScope(id);

                            //int
                            if (type==="int") {
                                code += "AC" + addressStr + "A201FF";
                            }

                            //string
                            else if (type==="string") {
                                code += "AC" + addressStr + "A202FF";
                            }

                            //boolean
                            else if (type==="boolean") {
                                //print 1 or 0 (MAY change to true/false)
                                code += "AC" + addressStr + "A201FF";
                            }
                        } 

                        //Digit
                        else if (currentNode.tokenPointer.description === "DIGIT") {
                            //load xreg with constant, print
                            code += "A0"+ "0"+currentNode.name +"A201FF";
                        }

                        else if (currentNode.name === "true") {
                            //load xreg with 1, print
                            code += "A0"+ "01" +"A201FF";
                        }

                        else if (currentNode.name === "false") {
                            //load xreg with 1, print
                            code += "A0"+ "00" +"A201FF";
                        }

                        //Printing string
                        else if (currentNode.name.charAt(0) === "\"") {
                            //store in the heap
                            var strAddress = this.storeStringInHeapAndReturnAddress(currentNode.name);
                            Control.putDebug("Address: "+strAddress);
                            Control.putDebug("New heap = "+heapCode);

                            //load yreg with string from heap
                            code += "A0"+ strAddress; 
                            //print string
                            code += "A202FF";
                        }
                        

                        //Next statement
                        this.nextNode();
                        break;


                    case "Assignment":
                        Control.putCodeGenMessage("Assignment");

                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...
                        var addressStr = _SymbolTableTree.getAddressById(id);

                        //Get value
                        this.nextNode();

                        //If it's a string constant...
                        if (currentNode.name.charAt(0) === "\"") {
                            //store in the heap
                            var strAddress = this.storeStringInHeapAndReturnAddress(currentNode.name);
                            Control.putDebug("Address: "+strAddress);
                            Control.putDebug("New heap = "+heapCode);

                            //load acc with strAddress from heap
                            code += "A9" + strAddress;
                            //store in id address
                            code += "8D" + addressStr;
                        }

                        //Equality
                        else if (currentNode.name === "Equality" ) {
                            this.doEquality();
                            this.storeZFlag(addressStr);
                        }
                        //Inequality
                        else if (currentNode.name === "Inequality"){
                            this.doEquality();
                            this.storeOppositeZFlag(addressStr);
                        }

                        //If it's addition...
                        else if (currentNode.name == "Addition") {
                            //Do addition, store it in the acc
                            this.doAddition();
                            code += "8D" + addressStr;
                        }

                        //If it's a digit...
                        else if (currentNode.tokenPointer.description === "DIGIT") {

                            //load acc with constant digit
                            code += "A9" + "0"+currentNode.name;
                            //store in id address
                            code += "8D" + addressStr;
                        }

                        //If it's a boolean...
                        else if (currentNode.tokenPointer.description === "BOOLEAN VALUE") {
                            if (currentNode.name === "true") {
                                //load acc TRUE
                                code += "A9" + "01";
                            }
                            else {
                                //load acc TRUE
                                code += "A9" + "00";
                            }
                            //store number in address
                            code += "8D" + addressStr;
                        }

                        //If it's an id...
                        else if (currentNode.tokenPointer.description === "ID") {

                            //get secondary id
                            var secondaryId:String = currentNode.tokenPointer.str;
                            var secondaryAddress = _SymbolTableTree.getAddressById(secondaryId);

                            //store secondary id value in acc
                            code += "AD" + secondaryAddress;
                            //put value in id
                            code += "8D" + addressStr;
                        }
            
                        //Next statement
                        this.nextNode();
                        break;


                    case "If":
                        Control.putCodeGenMessage("If");

                        //get conditional
                        this.nextNode();

                        //Inequality/Equality
                        if (currentNode.name === "Inequality") {
                            this.doEquality();
                            this.flipZFlag();
                            //zflag is set
                            code += "D0" + "J"+jumpCounter; //jump distance 
                        } 
                        else if (currentNode.name === "Equality") {
                            this.doEquality();
                            //zflag is set
                            //branch
                            code += "D0" + "J"+jumpCounter; //jump distance
                        }

                        //If it's a boolean...
                        else if (currentNode.tokenPointer.description === "BOOLEAN VALUE") {
                            if (currentNode.name === "true") {
                                //get address of 01
                                var addressStr = ""+this.storeAConstant("1");
                            }
                            else {
                                //get address of 00
                                var addressStr = ""+this.storeAConstant("0");
                            }
                            //load xreg with 01 true
                            code += "A2" + "01";
                            //compare address to 01 true
                            code += "EC" + addressStr;
                            //branch on not equal
                            code += "D0" + "J"+jumpCounter; //jump distance 
                        }
                        
                        //Begin jump
                        _JumpTable.newJump(); 

                        //Next statement
                        this.nextNode();
                        break;


                    case "While":
                        Control.putCodeGenMessage("While");

                        //Begin loop jump
                        _JumpTable.newLoop(); 

                        //get conditional
                        this.nextNode();

                        //Inequality/Equality
                        if (currentNode.name === "Inequality") {
                            this.doEquality();
                            this.flipZFlag();
                            //zflag is set
                            code += "D0" + "J"+jumpCounter; //jump distance 
                        } 
                        else if (currentNode.name === "Equality") {
                            this.doEquality();
                            //zflag is set
                            //branch
                            code += "D0" + "J"+jumpCounter; //jump distance 
                        }

                        //If it's a boolean...
                        else if (currentNode.tokenPointer.description === "BOOLEAN VALUE") {
                            if (currentNode.name === "true") {
                                //get address of 01
                                var addressStr = ""+this.storeAConstant("1");
                            }
                            else {
                                //get address of 00
                                var addressStr = ""+this.storeAConstant("0");
                            }
                            //load xreg with 01 true
                            code += "A2" + "01";
                            //compare address to 01 true
                            code += "EC" + addressStr;
                            //branch on not equal
                            code += "D0" + "J"+jumpCounter; //jump distance 
                        }
                        
                        //Begin jump
                        _JumpTable.newJump(); 

                        //Next statement
                        this.nextNode();
                        break;
                    

                    //End of block, scope up
                    case "SCOPE UP":
                        Control.putCodeGenMessage("Scope Up");

                        //Are we ending a while loop?
                        //var loopDistance = _JumpTable.loopBack();
                        if (_JumpTable.loopBack() !== "") {
                            Control.putDebug("~~~~END LOOP!");
                            //unconditional loop back up to top of while statement
                            //compare 01 to 00
                            code += "A2" + "01";
                            code += "EC" + "FF" + "00";
                            code += "D0" + _JumpTable.loopBack(); //loop distance
                            //loop distance is set on this line
                        }
                        //track end of jump/length of scope
                        _JumpTable.landJump();
                        

                        Control.putDebug(_SymbolTableTree.current.name);
                        _SymbolTableTree.moveUp();
                        Control.putDebug(_SymbolTableTree.current.name);

                        

                        //Next statement
                        this.nextNode();
                        break; 


                    case "SKIP":
                        this.nextNode();
                        break;

                    default:
                        Control.putCodeGenMessage("ERROR, unknown Node name: " + currentNode.name);
                        this.nextNode();
                }
            }

            //add HALT
            code += "00";

            //whats the code look like so far?
            Control.putDebug("CODE with temp addresses:");
            Control.putDebug(Utils.separateHex(code));

            //Convert temporary STATIC addresses to actual adresses

            //get code length
            var codeLength = code.length / 2;
            if (codeLength / 2 > 256) {
                var newError = new ErrorCompiler("CODE EXCEEDS 256 BYTES","Too large before variables are even assigned");
                return;
            }

            //for every entry
            for (var i=0; i<_StaticTable.entries.length; i++) {

                //calculate address code length and offset...
                var entry = _StaticTable.entries[i];
                var address = codeLength + entry.offset;
                Control.putDebug("new address: 0x"+Utils.toHex(address));

                //find temp values and replace with real value
                this.findAndReplace(entry, address);

                //add 00s for variable location
                code += "00";

                //check we havent gone too far
                Control.putDebug("code len check: "+(code.length/2));
                if (code.length / 2 > 256) {
                    var newError = new ErrorCompiler("CODE EXCEEDS 256 BYTES","Static variables too large");
                    return;
                }
            }

            //for every jump entry
            for (var j=0; j<_JumpTable.jumps.length; j++) {

                //calculate address code length and offset...
                var jump:JumpEntry = _JumpTable.jumps[j];
                var distance = jump.endLocation - jump.startLocation;
                Control.putDebug("jump distance for "+jump.name+": "+Utils.toHex(distance));

                //find temp values and replace with real value
                var replaceTemporary = code.replaceAll(""+jump.name, ""+Utils.toHex(distance));
                code = replaceTemporary;
            }

            //for every LOOP entry
            for (var l=0; l<_JumpTable.loops.length; l++) {

                //calculate address code length and offset...
                var loop:JumpEntry = _JumpTable.loops[l];
                var distance = loop.startLocation - loop.endLocation + 254;
                Control.putDebug("loop distance "+Utils.toHex(distance));

                //find temp values and replace with real value
                var replaceTemporary = code.replaceAll(""+loop.name, ""+Utils.toHex(distance));
                code = replaceTemporary;
            }

            //Check the lengths before printing
            var amountOfCode = (code.length + heapCode.length)/2;

            if (amountOfCode > 256) {
                var newError = new ErrorCompiler("CODE EXCEEDS 256 BYTES","Heap too large");
                return;
            }

            //put it all together (HTML)
            else {
                printingCode = "" + Utils.separateHex(code);
                if (heapCode.length > 0) {
                    printingCode += "<mark class='heap'>" + "00 ".repeat(0x100 - amountOfCode) +"</mark>";
                    printingCode += Utils.separateHex(heapCode);

                    //put it together again (clipboard)
                    clipboardCode = "" + Utils.separateHex(code) + "00 ".repeat(0x100 - amountOfCode) + Utils.separateHex(heapCode);
                }
                else {
                    clipboardCode = "" + Utils.separateHex(code);
                }
            }
        } 


        public static nextNode() {
            nodeCounter++;
            if (nodeCounter >= (_AST.nodeList).length) {
                currentNode = null;
            }
            else {
                currentNode = _AST.nodeList[nodeCounter];
            }
        }

        //replace all instances of TEMP address with REAL address
        public static findAndReplace(entry:Entry, addressNum:number) {
            var realAddress = Utils.toHex(addressNum) + "00"; //lil endian shit
            var replaceTemporary = code.replaceAll(entry.tempAddress, realAddress);
            code = replaceTemporary;
        }

        //precondition:   current= Addition
        //post condition: added material is in the acc
        public static doAddition() {
            
            Control.putCodeGenMessage("Do Addition");

            //Get left (left wont be id, impossible by parse)
            this.nextNode();
            if (currentNode.tokenPointer.description === "DIGIT") {
                //make a variable entry for the constant digit
                var addressStr = this.storeAConstant(currentNode.name);
            }

            //Get right
            this.nextNode();
            if (currentNode.name === "Addition"){
                Control.putDebug("right addition, do it again");
                this.doAddition();
            }
            else if (currentNode.tokenPointer.description === "DIGIT") {
                //Reached the end of ADDING
                //load acc with constant digit
                code += "A9" + "0"+currentNode.name;
            }
            else if (currentNode.tokenPointer.description === "ID") {
                //Reached the end of ADDING
                Control.putDebug("right is id");
                Control.putDebug("BEGIN ADDING");

                //store id value in acc
                var id:String = currentNode.tokenPointer.str;
                var address = _SymbolTableTree.getAddressById(id);
                code += "AD" + address;
            }

            //ADD, THEN MAKE OUR WAY OUT OF STACK
            code += "6D" +addressStr;
        }


        //post condition: z flag has been set 
        public static doEquality() {
            Control.putCodeGenMessage("Do Equality");
            var addressStr;

            //Get left
            this.nextNode();
            var thisType = null;

            //INT
            if (currentNode.name === "Addition"){
                Control.putDebug("left eq add");
                this.doAddition();

                //load x reg with acc
                var addEntry = _StaticTable.newEntry("ADDITION");
                code += "8D" + addEntry.tempAddress;
                code += "AE" + addEntry.tempAddress;
            }            
            //BOOLEAN
            else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
                var newError = new ErrorCompiler("CANNOT GENERATE", "Nested equality/inequality is not supported");
            }
            //ID
            else if (currentNode.tokenPointer.description === "ID") {
                var id:String = currentNode.tokenPointer.str;
                var address = _SymbolTableTree.getAddressById(id); 
                
                //load x register from memory
                code += "AE" + address;
            }
            //INT
            else if (currentNode.tokenPointer.description === "DIGIT") {
                //load x register with constant
                code += "A2" + "0"+currentNode.name;
            }
            //STRING
            else if (currentNode.name.charAt(0) === "\"") {
                //store in the heap
                var strAddress = this.storeStringInHeapAndReturnAddress(currentNode.name);

                //load x reg from memory
                code += "A2" + strAddress;
            }
            //BOOLEAN
            else if (currentNode.name === "true") {
                //load x register with TRUE
                code += "A2" + "01";
            }
            else if (currentNode.name === "false") {
                //load x register with FALSE
                code += "A2" + "00";
            }


            //Get right
            this.nextNode();
            var thisType = null;

            //INT
            if (currentNode.name === "Addition"){
                Control.putDebug("left eq add");
                this.doAddition();

                //load x reg with acc
                var addEntry = _StaticTable.newEntry("ADDITION");
                code += "8D" + addEntry.tempAddress;
                code += "EC" + addEntry.tempAddress;
            }   
            //ID          
            else if (currentNode.tokenPointer.description === "ID") {
                var id:String = currentNode.tokenPointer.str;
                var address = _SymbolTableTree.getAddressById(id); 
                
                //compare byte in mem to x reg
                code += "EC" + address;
            }
            //INT
            else if (currentNode.tokenPointer.description === "DIGIT") {
                //make a variable entry for the constant digit
                addressStr = this.storeAConstant(currentNode.name);

                //compare byte in mem to x reg
                code += "EC" + addressStr;
            }
            //STRING
            else if (currentNode.name.charAt(0) === "\"") {
                //store in the heap
                var strAddress = this.storeStringInHeapAndReturnAddress(currentNode.name);
                var stringEntry = _StaticTable.newEntry("STRING");
                code += "A9" + strAddress + "8D" + stringEntry.tempAddress;

                //compare byte in mem to x reg
                code += "EC" + stringEntry.tempAddress;
            }
            //BOOLEAN
            else if (currentNode.name === "true") {
                addressStr = this.storeAConstant("1"); //TRUE

                //compare byte in mem to x reg
                code += "EC" + addressStr;
            }
            else if (currentNode.name === "false") {
                addressStr = this.storeAConstant("0"); //TRUE

                //compare byte in mem to x reg
                code += "EC" + addressStr;
            }
            else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
                var newError = new ErrorCompiler("CANNOT GENERATE", "Nested equality/inequality is not supported");
            }
        }


        public static storeZFlag(address) {
            //first set acc 0 false 
            code += "A9" + "00";
            //Branch n bytes if Z flag == 0
            code += "D0" + "02";
            //else, set acc 1 true
            code += "A9" + "01";

            //now store acc(zflag) in memory location
            code += "8D" + address
        }

        public static storeOppositeZFlag(address) {
            //first set acc 1 true 
            code += "A9" + "01";
            //Branch n bytes if Z flag == 0
            code += "D0" + "02";
            //else, set acc 0 false
            code += "A9" + "00";

            //now store acc(zflag) in memory location
            code += "8D" + address
        }

        public static accZFlag() {
            //first set acc 0 false 
            code += "A9" + "00";
            //Branch n bytes if Z flag == 0
            code += "D0" + "02";
            //else, set acc 1 true
            code += "A9" + "01";
        }

        public static accOppositeZFlag() { 
            //first set acc 1 true 
            code += "A9" + "01";
            //Branch n bytes if Z flag == 0
            code += "D0" + "02";
            //else, set acc 0 false
            code += "A9" + "00";
        }

        public static flipZFlag() {
            Control.putDebug("flip z flag");
            this.accOppositeZFlag();

            var inequalityEntry = _StaticTable.newEntry("OPPOSITE Z");
            //store this opposite value
            code += "8D" + inequalityEntry.tempAddress;

            //xreg=0
            code += "A2" + "01";
            //code += "8D" + inequalityEntry.tempAddress;
            //compare op to 0 for new zflag
            code += "EC" + inequalityEntry.tempAddress;

        }

        public static storeStringInHeapAndReturnAddress(str:String):String {
            //remove quotes, convert to hex
            var hexString = Utils.stringToHex(str);
            
            //is it already in heap?
            var index = heapCode.indexOf(""+hexString);
            //found it
            if (index !== -1) {
                //convert index to address
                return this.indexToAddress(index);
            }
            //no? add it in
            else {
                heapCode = ""+ hexString + heapCode;
                //calculate address
                return this.indexToAddress(0);
            }
        }

        public static indexToAddress(index:number):String {
            var numberBytesInHeap = heapCode.length / 2;
            var byteIndex = (index/2);
            var topOfHeap = 0x100 - numberBytesInHeap;
            return Utils.toHex(topOfHeap + byteIndex);
        }

        //get a number as a string, store a constant variable in memory
        //if one exists, dont do anything
        public static storeAConstant(numString:String):String {
            //make a variable entry for the constant digit

            //Check if entry already exists
            //ex: "0" "1" "2"...
            for (var i=0; i<_StaticTable.entryCount; i++) {
                if (_StaticTable.entries[i].id === numString) {
                    //Constant already exists, return address
                    return _StaticTable.entries[i].tempAddress;
                }
            }

            //Otherwise, create and store one
            //Create Entry object
            var constantEntry = _StaticTable.newEntry(numString);

            //load acc and store it
            code += "A9" + "0"+numString;
            code += "8D" + constantEntry.tempAddress;
            //retiurn address
            return _StaticTable.entries[i].tempAddress;
        }
    }
}
