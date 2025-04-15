/*  Semantic Analysis
    Project 3

    Build an Abstract Syntax Tree (using similar methods to CST)
    Check scope and type
    Create and display symbol table with s&t info
    Report errors and warnings
*/

namespace Compiler {
    export class Semantic {


        public static createAST(){
            astToken = tokenStream[0];
            astTokenIndex = 0;

            this.astProgram();
        }

        public static astProgram() {
            Control.putASTMessage("astProgram()");

            this.astBlock();
            this.skip("EOP");
        }

        public static astBlock() {
            Control.putASTMessage("astBlock()");
            _AST.addNode("Block", false);

            this.skip("OPEN BRACE");
            this.astStatementList();
            
            //If the block has no children, add a fake child for tree printing purposes
            if (_AST.current.children.length == 0) {
                _AST.addNode("SKIP", false);
                _AST.moveUp();
            }
            
            this.skip("CLOSE BRACE");

            _AST.moveUp();
            //Let SEMANTIC know we are moving up the scope as well
            _AST.nodeList.push(new Node("SCOPE UP"));
        }

        public static astStatementList() {
            Control.putASTMessage("astStatementList()");

            //Acceptable tokens
            switch (astToken.description) {
                
                case "PRINT":
                case "ID":
                case "VARIABLE TYPE":
                case "WHILE":
                case "IF":
                case "OPEN BRACE":

                    this.astStatement();
                    this.astStatementList();
                    break;

                case "CLOSE BRACE":
                    //Do nothing
                    //Final statement
                    break;    
            }
        }

        public static astStatement() {
            Control.putASTMessage("astStatement()");

            //Acceptable tokens
            switch (astToken.description) {
                
                case "PRINT":
                    this.astPrintStatement();
                    break;
                
                case "ID":
                    this.astAssignmentStatement();
                    break;
                
                case "VARIABLE TYPE":
                    this.astVarDecl();
                    break;
                
                case "WHILE":
                    this.astWhileStatement();
                    break;
                
                case "IF":
                    this.astIfStatement();
                    break;
                
                case "OPEN BRACE":
                    this.astBlock();
                    break;
                
            }  
        }

        public static astPrintStatement() {
            Control.putASTMessage("astPrintStatement()");
            _AST.addNode("Print", false);

            this.skip("PRINT");
            this.skip("OPEN PARENTHESIS");
            this.astExpr();
            this.skip("CLOSE PARENTHESIS");
            
            _AST.moveUp();
        }

        public static astAssignmentStatement() {
            Control.putASTMessage("astAssignmentStatement()");
            _AST.addNode("Assignment", false);

            this.match("ID");
            this.skip("ASSIGNMENT");
            this.astExpr();
            
            _AST.moveUp();
        }
        
        public static astVarDecl() {
            Control.putASTMessage("astVarDecl()");
            _AST.addNode("Var Decl", false);

            this.match("VARIABLE TYPE");
            this.match("ID");
            
            _AST.moveUp();
        }

        public static astWhileStatement() {
            Control.putASTMessage("astWhileStatement()");
            _AST.addNode("While", false);

            this.skip("WHILE");
            this.astBooleanExpr();
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astIfStatement() {
            Control.putASTMessage("astIfStatement()");
            _AST.addNode("If", false);

            this.skip("IF");
            this.astBooleanExpr();
            this.astBlock();
            
            _AST.moveUp();
        }

        public static astExpr() {
            Control.putASTMessage("astExpr()");

            //Acceptable tokens
            switch (astToken.description) {
                
                case "DIGIT":
                    //digit + ______
                    if (tokenStream[astTokenIndex+1].description === "ADDITION") {
                        this.astIntExpr();
                    }
                    //digit
                    else {
                        this.match("DIGIT");
                    }
                    break;

                case "QUOTATION":
                    this.astStringExpr();
                    break;

                case "OPEN PARENTHESIS":
                case "BOOLEAN VALUE":
                    this.astBooleanExpr();
                    break;
        
                case "ID":
                    this.match("ID");
                    break;
            }    
        }

        public static astIntExpr() {
            Control.putASTMessage("astIntExpr()");
            _AST.addNode("Addition", false);

            this.match("DIGIT");
            //num + ...
            if (astToken.description === "ADDITION") {
                this.skip("ADDITION");
                this.astExpr();
            }
            
            _AST.moveUp();
        }

        public static astStringExpr() {
            Control.putASTMessage("astStringExpr()");

            //this.skip("QUOTATION");
            this.astCharList();
            this.skip("QUOTATION");
        }

        public static astBooleanExpr() {
            Control.putASTMessage("astBooleanExpr()");



            //Acceptable tokens
            switch (astToken.description) {
                
                case "OPEN PARENTHESIS":
                    var newNode = _AST.addNode("Boolean Expr TEMPORARY NAME", false);
                    this.skip("OPEN PARENTHESIS");
                    this.astExpr();
                    var boolOpName = this.astBoolOp(); //whatever the op is here, change the name to boolean expr
                    newNode.name = boolOpName;
                    newNode.tokenPointer = astToken; //for track equality/inequality location
                    this.skip("IN/EQUALITY");
                    this.astExpr();
                    this.skip("CLOSE PARENTHESIS");
                    _AST.moveUp();
                    break;
                
                case "BOOLEAN VALUE":
                    this.match("BOOLEAN VALUE");
                    break;

            }
            
            
        }

        public static astCharList() {
            Control.putASTMessage("astCharList()");

            var charList = "\""; //begin quote
            var firstCharToken = astToken; //point to first quote
            this.skip("QUOTATION");

            while (astToken.description === "CHAR") {
                charList += astToken.str;
                
                //Next token
                astTokenIndex ++;
                astToken = tokenStream[astTokenIndex];

            }
            charList += "\""; //end quote
            _AST.addNode(charList, true, firstCharToken);
            
        }
        
        public static astBoolOp(): String {
            Control.putASTMessage("astBoolOp()");

            //Acceptable tokens
            switch (astToken.description) {
                
                case "EQUALITY":
                    //this.skip("EQUALITY");
                    return "Equality";
                    //break;
                
                case "INEQUALITY":
                    //this.skip("INEQUALITY");
                    return "Inequality";
                    //break;

            }
        }


        public static match(goalDescription?, strList?) {
            
            //Match found
            if (astToken.description === goalDescription) {
                //Print success
                _AST.addNode(astToken.str, true, astToken); //true == Add leaf node
                //Node should point to corresponding Token object
                _AST.current.tokenPointer = astToken;

                //Next token
                astTokenIndex ++;
                astToken = tokenStream[astTokenIndex];
            }
        }

        public static skip(str?){
            //Next token
            astTokenIndex ++;
            astToken = tokenStream[astTokenIndex];
        }


        public static checkTypeScope(){

            //Traverse the AST

            /* 
            A note on the Symbol Table STRUCTURE:

            Symbol Table Tree: a tree of symbol tables
            Symbol Table: name of scope, parent pointer, table of ids and their symbol nodes
            Symbol Node: info about an id like type, isInherited, isInitialized, isUsed
            */

            //Scope 0
            scopeCounter = 0;
            currentNode = _AST.root;
            nodeCounter = 0;
            //currentSymbolTable = null;

            Control.putDebug("AST Node list: ");
            for (var i=0; i<_AST.nodeList.length; i++) {
                Control.putDebug(i+") " +_AST.nodeList[i].name);

            }
            
            //Go through the AST until we reach the end
            while (currentNode != null) {

                switch (currentNode.name) {

                    case "Block":
                        Control.putSemanticMessage("Block Type/Scope Check");

                        //New scope, grow up the tree
                        _SymbolTableTree.addScope();
                        //Go to first statement inside the block
                        this.nextNode();
                        break;

                    case "Var Decl":
                        Control.putSemanticMessage("Var Decl Type/Scope Check");

                        //Get type
                        this.nextNode();
                        var type:String = currentNode.tokenPointer.str; //"int" "boolean" "string"
                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        //Put it in the symbol table
                        _SymbolTableTree.newVariable(type, id);

                        //Next statement
                        this.nextNode();
                        break;
                    
                    case "Print":
                        Control.putSemanticMessage("Print Type/Scope Check");

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
                                //_SymbolTableTree.setUsed(id);
                                Control.putDebug("Print id "+id+" exists");
                            }
                            
                        } 

                        

                        //any other expr
                        else{}

                        //Next statement
                        this.nextNode();
                        break;

                    case "Assignment":
                        Control.putSemanticMessage("Assignment Type/Scope Check");

                        //Get id
                        this.nextNode();
                        var id:String = currentNode.tokenPointer.str; //"a" "b" "c"...

                        Control.putDebug("GET NODE ANY SCOPE "+id+": "+_SymbolTableTree.getSymbolAnyScope(id).type+" used:"+_SymbolTableTree.getSymbolAnyScope(id).IsUsed);
                        //Check if id has been declared
                        //if (!_SymbolTableTree.isDeclaredAnyScope(currentNode.tokenPointer.str)) {
                        if (_SymbolTableTree.getTypeAnyScope(currentNode.tokenPointer.str) == null) {
                            var newError = new ErrorCompiler("UNDECLARED VARIABLE", "Cannot assign a value to "+id, currentNode.tokenPointer.startIndex);
                        }

                        //Get value
                        this.nextNode();

                        //If it's a string constant...
                        if (currentNode.name.charAt(0) === "\"") {
                            //But the id isnt a string
                            if (_SymbolTableTree.getTypeAnyScope(id) !== "string") {
                                var newError = new ErrorCompiler("TYPE MISMATCH", "Cannot assign string value to "+_SymbolTableTree.getTypeAnyScope(id)+" variable "+id, currentNode.tokenPointer.startIndex);
                            }
                            Control.putDebug("String "+id+" = " +currentNode.name);
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
                            Control.putDebug("Int "+id+" = " +currentNode.name);
                        }

                        

                        //Next statement
                        this.nextNode();
                        break;




                    
                    //End of block, scope up
                    case "SCOPE UP":
                        Control.putSemanticMessage("Scope Up");
                        _SymbolTableTree.moveUp();

                        //Next statement
                        this.nextNode();
                        //this.nextNode();
                        break; 

                    default:
                        Control.putSemanticMessage("ERROR, unknown Node name: " + currentNode.name);
                        this.nextNode();
                }
            }

            //Control.putASTMessage("DONE WITH TYPE SCOPE CHECK WHILE LOOP");


        } 


        public static nextNode() {
            nodeCounter++;
            //Control.putDebug("prev node: " +currentNode.name);
            if (nodeCounter >= (_AST.nodeList).length) {
                currentNode = null;
            }
            else {
                currentNode = _AST.nodeList[nodeCounter];
            }
            // if (currentNode != null) {
            //     Control.putDebug("next node " +nodeCounter+") "+currentNode.name);
            // }
        }

        //precondition: current=Addition
        //post condition: current= after the whole addition block?
        public static checkAddition() {
            
            Control.putSemanticMessage("Check Addition");

            //Get left (left id is impossible by parse)
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
                Control.putSemanticMessage("HOW are we here left");
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
            }
            
            else {
                //return error 
                //not an int!!
                var newError = new ErrorCompiler("INCOMPATABLE TYPES", "Cannot add an int with "+ currentNode.name, currentNode.tokenPointer.startIndex);

            }
        }

        public static checkEquality(equalityIndex):String {

            Control.putSemanticMessage("Check Type Equality");
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
                Control.putDebug("start eq add");
                this.checkAddition();
                Control.putDebug("done with eq addition");
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
                Control.putSemanticMessage("HOW are we here left");
            }

            return thisType;
        }
    }
}
