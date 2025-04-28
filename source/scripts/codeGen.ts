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

        //Scope 0
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

                    //int/boolean = put in static table
                    var entry = _StaticTable.newEntry(id);


                    //Initialize int/boolean as 00
                    code += ""+Utils.toHex(0xA9)+Utils.toHex(6)+Utils.toHex(0x8D);
                    //code += "A9 00 8D ";
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
                        Control.putDebug("Lets check '+'");
                        this.checkAddition();
                    }
                    //printing equality/inequality
                    else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
                        Control.putDebug("Lets check '!=' or '=='");
                        this.checkEquality(currentNode.tokenPointer.startIndex);
                    }

                    //If printing a variable...
                    else if (currentNode.tokenPointer.description === "ID") {
                        
                        //Check that it's not undeclared!
                        if (!_SymbolTableTree.isDeclaredAnyScope(currentNode.tokenPointer.str)) {
                            var newError = new ErrorCompiler("PRINT REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
                        }
                        else {
                            _SymbolTableTree.setUsed(id);
                            Control.putDebug("Print id "+id+" exists");
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

                    Control.putDebug("GET NODE ANY SCOPE "+id+": "+_SymbolTableTree.getSymbolAnyScope(id).type+
                        " used:"+ _SymbolTableTree.getSymbolAnyScope(id).IsUsed);
                    
                    //Check if id has been declared
                    if (!_SymbolTableTree.isDeclaredAnyScope(currentNode.tokenPointer.str)) {
                        var newError = new ErrorCompiler("UNDECLARED VARIABLE", "Cannot assign a value to "+id, 
                            currentNode.tokenPointer.startIndex);
                    }
                    else {
                        //We'll just assume it will be initialized. If theres an error, we will never see this anyway
                        _SymbolTableTree.setInitialized(id);
                    }

                    //Get value
                    this.nextNode();

                    //If it's a string constant...
                    if (currentNode.name.charAt(0) === "\"") {
                        //But the id isnt a string
                        if (_SymbolTableTree.getTypeAnyScope(id) !== "string") {
                            var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign string value to "+
                                _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                        }
                        Control.putDebug("String "+id+" = " +currentNode.name);
                    }

                    //Equality/inequality
                    else if (currentNode.name === "Inequality" || currentNode.name === "Equality"){
                        if (_SymbolTableTree.getTypeAnyScope(id) === "boolean") {
                            Control.putDebug("Lets check '!=' or '=='");
                            this.checkEquality(currentNode.tokenPointer.startIndex);
                        }
                        else {
                            var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign boolean value to "+
                                _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                        }
                    }

                    //If it's addition...
                    else if (currentNode.name == "Addition") {
                        this.checkAddition();
                    }

                    //If it's a digit...
                    else if (currentNode.tokenPointer.description === "DIGIT") {
                        //But the id isnt an int
                        if (_SymbolTableTree.getTypeAnyScope(id) !== "int") {
                            var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign int value to "+
                                _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                        }
                        Control.putDebug("Int "+id+" = " +currentNode.name);
                    }

                    //If it's a boolean...
                    else if (currentNode.tokenPointer.description === "BOOLEAN VALUE") {
                        //But the id isnt a boolean
                        if (_SymbolTableTree.getTypeAnyScope(id) !== "boolean") {
                            var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign boolean value to "+
                                _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                        }
                        Control.putDebug("Int "+id+" = " +currentNode.name);
                    }

                    //If it's an id...
                    else if (currentNode.tokenPointer.description === "ID") {
                        //But the id is undeclared
                        if (!_SymbolTableTree.getTypeAnyScope(currentNode.tokenPointer.str)) {
                            var newError = new ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
                        }
                        //But the id types dont match
                        else if (_SymbolTableTree.getTypeAnyScope(id) !== _SymbolTableTree.getTypeAnyScope(currentNode.name)) {
                            var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign "+ 
                                _SymbolTableTree.getTypeAnyScope(currentNode.name)+" variable "+currentNode.name+" to "+
                                _SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                        }
                        else {
                            _SymbolTableTree.setUsed(currentNode.name);
                        }
                        Control.putDebug("Int "+id+" = " +currentNode.name);
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

        //AST has been traversed, most of code done
        
        //add HALT
        code += "00";
        Control.putDebug("With temp addresses:");
        Control.putDebug(Utils.separateHex(code));

        //Convert temporary address to actual adresses

        //get code length
        var codeLength = code.length / 2;

        //for every entry
        for (var i=0; i<_StaticTable.entries.length; i++) {

            //calculate address code length and offset...
            var entry = _StaticTable.entries[i];
            var address = codeLength + entry.offset;
            Control.putDebug("0x"+Utils.toHex(address));

            //find temp values and replace with real value
            this.findAndReplace(entry, address);

            //add 00s for variable location
            code += "00";
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

    //precondition:   current= Addition
    //post condition: current= after the whole addition block?
    public static checkAddition() {
        
        Control.putCodeGenMessage("Check Addition");

        //Get left (left wont be id, impossible by parse)
        this.nextNode();
        Control.putDebug("left"+currentNode.name);
        if (currentNode.tokenPointer.description === "DIGIT") {
            //left is good
            Control.putDebug("left is good ("+currentNode.name+")");
        }
        else if (currentNode.name === "Addition"){
            this.checkAddition();
        }
        else {
            //return error
            Control.putCodeGenMessage("HOW are we here left");
        }

        //Get right
        this.nextNode();
        Control.putDebug("right"+currentNode.name);
        if (currentNode.name === "Addition"){
            Control.putDebug("right addition lets do it again ");
            this.checkAddition();
        }
        else if (currentNode.tokenPointer.description === "DIGIT") {
            //right is good
            Control.putDebug("right digit");
        }
        else if (currentNode.tokenPointer.description === "ID") {
            Control.putDebug("right id");
            //make sure it's an int id
            var id:String = currentNode.tokenPointer.str;

            //but first, does it even exist?
            if (_SymbolTableTree.getTypeAnyScope(id) === null) {
                var newError = new ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
            }
            else if (_SymbolTableTree.getTypeAnyScope(id) !== "int") {
                var newError = new ErrorCompiler("INCOMPATABLE TYPES", "Cannot add an int with a "+ _SymbolTableTree.getTypeAnyScope(id) +" variable "+id, currentNode.tokenPointer.startIndex);
            }
            else {
                _SymbolTableTree.setUsed(id);
            }
        }
        
        else {
            //return error, not an int!!
            var newError = new ErrorCompiler("INCOMPATABLE TYPES", "Cannot add an int with "+ currentNode.name, currentNode.tokenPointer.startIndex);

        }
    }


    public static checkEquality(equalityIndex):String {

        Control.putCodeGenMessage("Check Type Equality");
        var leftType = null;
        var rightType = null;

        //Get left
        this.nextNode();
        leftType = this.getLeftRightType();            

        //Get right
        this.nextNode();
        rightType = this.getLeftRightType(); 
       
        //Compare 'em
        if (leftType != rightType){
            //return error 
            var newError = new ErrorCompiler("INCOMPATABLE TYPES", "Cannot compare "+leftType+" with "+ rightType, equalityIndex);
        }
        else {
            return leftType;
        }
    }


    public static getLeftRightType() {
        Control.putDebug("One side: "+currentNode.name);
        var thisType = null;
        //INT
        if (currentNode.name === "Addition"){
            thisType = "int";
            //Control.putDebug("start eq add");
            this.checkAddition();
            //Control.putDebug("done with eq addition");
        }            
        //BOOLEAN
        else if (currentNode.name === "Inequality" || currentNode.name === "Equality") {
            thisType = this.checkEquality(currentNode.tokenPointer.startIndex);
            thisType = "boolean";
        }
        else if (currentNode.tokenPointer.description === "ID") {
            var id:String = currentNode.tokenPointer.str;
            thisType = _SymbolTableTree.getTypeAnyScope(id); 
            if (thisType == null) {
                var newError = new ErrorCompiler("REFERENCE TO UNDECLARED VARIABLE", id, currentNode.tokenPointer.startIndex);
            }               
            else {
                _SymbolTableTree.setUsed(id);
            }
        }
        //INT
        else if (currentNode.tokenPointer.description === "DIGIT") {
            thisType = "int";
        }
        //STRING
        else if (currentNode.name.charAt(0) === "\"") {
            thisType = "string";
        }
        //BOOLEAN
        else if (currentNode.name === "true" || currentNode.name === "false") {
            thisType = "boolean";
        }
        else {
            //return error
            Control.putDebug("Nothing found, left/right");
        }

        return thisType;
    }

    public static findAndReplace(entry:Entry, addressNum:number) {

        var addressStr = Utils.toHex(addressNum) + "00";
    }

    }
}
