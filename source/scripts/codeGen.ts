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
            //variableCounter = 0;

            //tables
            _StaticTable;
            _StaticTable.reset();

            //Redo the scope table
            _SymbolTableTree.reset();
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;

            Control.putDebug("AST Node list: ");
            for (var i=0; i<_AST.nodeList.length; i++) {
                Control.putDebug(i+") " +_AST.nodeList[i].name);

            }
            
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
                        code += "A9"+"00"+"8D";
                        //Add temporary variable location
                        code += ""+entry.tempAddress;

                        //Next statement
                        this.nextNode();
                        break;
                    

                    case "Print":
                        Control.putCodeGenMessage("Print Type/Scope Check");

                        //What we are printing:
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        //If printing an addition
                        if (currentNode.name === "Addition") {
                            // Control.putDebug("Lets check '+'");
                            // this.checkAddition();
                        }
                        //printing equality/inequality
                        else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
                            // Control.putDebug("Lets check '!=' or '=='");
                            // this.checkEquality(currentNode.tokenPointer.startIndex);
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
                                //PRINT BOOLEAN!!!
                                //Come back to this...
                                code += "AC" + addressStr + "A2BBFF";
                            }


                        } 

                        //any other expr
                        else{}

                        //Next statement
                        this.nextNode();
                        break;


                    case "Assignment":
                        Control.putCodeGenMessage("Assignment Type/Scope Check");

                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...
                        var addressStr = _SymbolTableTree.getAddressById(id);

                        //Get value
                        this.nextNode();

                        //If it's a string constant...
                        if (currentNode.name.charAt(0) === "\"") {
                            //MORE TO DO HERE
                            Control.putDebug("String "+id+" = " +currentNode.name);
                        }

                        //Equality/inequality
                        else if (currentNode.name === "Inequality" || currentNode.name === "Equality"){
                            // if (_SymbolTableTree.getTypeAnyScope(id) === "boolean") {
                            //     Control.putDebug("Lets check '!=' or '=='");
                            //     this.checkEquality(currentNode.tokenPointer.startIndex);
                            // }
                            // else {
                            //     var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign boolean value to "+
                            //         _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                            // }
                        }

                        //If it's addition...
                        else if (currentNode.name == "Addition") {
                            this.doAddition();
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
                            // //But the id isnt a boolean
                            // if (_SymbolTableTree.getTypeAnyScope(id) !== "boolean") {
                            //     var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign boolean value to "+
                            //         _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                            // }
                            // Control.putDebug("Int "+id+" = " +currentNode.name);
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
                    case "While":
                        Control.putCodeGenMessage("If-While Type/Scope Check");

                        //get conditional
                        this.nextNode();

                        //Inequality/Equality
                        if (currentNode.name === "Inequality" || currentNode.name === "Equality"){
                            this.checkEquality(currentNode.tokenPointer.startIndex);
                        }

                        //true or false
                        else if (currentNode.name === "true" || currentNode.name === "false") {
                            //we cool
                        }

                        else {
                            Control.putDebug("Impossible to get here. While/If");
                        }

                        //Next statement
                        this.nextNode();
                        break;
                    

                    //End of block, scope up
                    case "SCOPE UP":
                        Control.putCodeGenMessage("Scope Up");
                        _SymbolTableTree.moveUp();

                        //Next statement
                        this.nextNode();
                        //this.nextNode();
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
                    var newError = new ErrorCompiler("CODE EXCEEDS 256 BYTES","");
                    return;
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
        //post condition: current= after the whole addition block?
        public static doAddition() {
            
            Control.putCodeGenMessage("Do Addition");

            // GO DEEP FIRST

            //Get left (left wont be id, impossible by parse)
            this.nextNode();
            Control.putDebug("left"+currentNode.name);
            if (currentNode.tokenPointer.description === "DIGIT") {
                //left is good
                Control.putCodeGenMessage("LOAD ACC "+currentNode.name);
                Control.putCodeGenMessage("STOR ACC $00"+currentNode.name);
            }
            else if (currentNode.name === "Addition"){
                Control.putCodeGenMessage("left is addition");
                this.doAddition();
            }
            else {
                //return error
                Control.putCodeGenMessage("HOW are we here left");
            }

            //Get right
            this.nextNode();
            Control.putDebug("right"+currentNode.name);
            if (currentNode.name === "Addition"){
                Control.putDebug("right addition, do it again");
                this.doAddition();
            }
            else if (currentNode.tokenPointer.description === "DIGIT") {
                //Reached the end of ADDING
                Control.putDebug("right digit");
            }
            else if (currentNode.tokenPointer.description === "ID") {
                //Reached the end of ADDING
                Control.putDebug("right is id");
                Control.putCodeGenMessage("BEGIN ADDING");

                //store id value in acc
                var id:String = currentNode.tokenPointer.str;
                var address = _SymbolTableTree.getAddressById(id);
                code += "AD" + address;
            }
            
            else {
                //return error
                Control.putCodeGenMessage("HOW are we here right");
            }

            //THEN MAKE OUR WAY UP TO ADD
            code += "LEFT+RIGHT";
        }


        public static checkEquality(equalityIndex):String {

            // Control.putCodeGenMessage("Check Type Equality");
            // var leftType = null;
            // var rightType = null;

            // //Get left
            // this.nextNode();
            // leftType = this.getLeftRightType();            

            // //Get right
            // this.nextNode();
            // rightType = this.getLeftRightType(); 
        
            // //Compare 'em
            // if (leftType != rightType){
            //     //return error 
            //     var newError = new ErrorCompiler("INCOMPATABLE TYPES", "Cannot compare "+leftType+" with "+ rightType, equalityIndex);
            // }
            // else {
            //     return leftType;
            // }
            return "";
        }


        public static getLeftRightType() {
        //     Control.putDebug("One side: "+currentNode.name);
        //     var thisType = null;
        //     //INT
        //     if (currentNode.name === "Addition"){
        //         thisType = "int";
        //         //Control.putDebug("start eq add");
        //         this.checkAddition();
        //         //Control.putDebug("done with eq addition");
        //     }            
        //     //BOOLEAN
        //     else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
        //         thisType = this.checkEquality(currentNode.tokenPointer.startIndex);
        //         thisType = "boolean";
        //     }
        //     else if (currentNode.tokenPointer.description === "ID") {
        //         var id:String = currentNode.tokenPointer.str;
        //         thisType = _SymbolTableTree.getTypeAnyScope(id); 
        //         if (thisType == null) {
        //             var newError = new ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
        //         }               
        //         else {
        //             _SymbolTableTree.setUsed(id);
        //         }
        //     }
        //     //INT
        //     else if (currentNode.tokenPointer.description === "DIGIT") {
        //         thisType = "int";
        //     }
        //     //STRING
        //     else if (currentNode.name.charAt(0) === "\"") {
        //         thisType = "string";
        //     }
        //     //BOOLEAN
        //     else if (currentNode.name === "true" || currentNode.name === "false") {
        //         thisType = "boolean";
        //     }
        //     else {
        //         //return error
        //         Control.putDebug("Nothing found, left/right");
        //     }

        //     return thisType;
        }
    }
}
