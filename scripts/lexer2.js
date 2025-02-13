/* lexer2.js  

Globals:
    tokens = "";
    tokenIndex = 0;
    currentToken = ' ';
    errorCount = 0;  

Language Order:
    keywords:   int string boolean while if false true print
    id:         a b c d e f g h i j k l m n o p q r s t u v w x y z
    symbol:     == != " " ( ) { } /*
    digit:      0 1 2 3 4 5 6 7 8 9 
    char:       a b c d e f g h i j k l m n o p q r s t u v w x y z [space]

Keywords:
    { } print ( ) 
    =
    while if
    " " ( ) 
    int string boolean
    char:   a b c d e f ... z [space]
    == !=
    false true
    +
    /* 
*/



//Acceptable Lex arrays
mainDictionary =  ["int",           "string",        "boolean",       "while", "if", "false", "true", "print", "a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z", "+",        "=",          "==",       "!=",         "\"",    "(",                ")",                 "{",            "}",             "/*",           "*/",            "$",    "0",     "1",     "2",      "3",    "4",     "5",     "6",     "7",     "8",     "9"];
definitions = ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "FALSE", "TRUE", "PRINT", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ADDITION", "ASSIGNMENT", "EQUALITY", "INEQUALITY", "QUOTE", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACKET", "CLOSE BRACKET", "OPEN COMMENT", "CLOSE COMMENT", "EOP", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT"];

chars = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "\""];
charsDefinition = Array(27).fill("CHAR");
charsDefinition.push("QUOTATION");

currentDictionary = mainDictionary;

function lex() {
    // show/hide my comments
    debug = true;
    loops = 0; //for debugging purposes

    // Grab the "raw" source code. (force a separator to the end)
    var sourceString = document.getElementById("taSourceCode").value + " ";

    //where in source code are we
    sourceStringIndex = 0;
    sourceIndex = [1,1];  //start at 1:1

    bestTokenStartIndex = [1,1];
    bestTokenEndIndex = [1,1];

    //token strings
    checkingToken = "";
    bestTokenString = "";
    bestTokenDescription = "";

    //token switches open/close
    quoteIsOpen = false;
    commentIsOpen = false;
    matchFound = false;

    //loop through source text to find all tokens
    while (sourceStringIndex < sourceString.length && loops < 5000) {

        //look at the next character
        currentChar = sourceString[sourceStringIndex];
        checkingToken += currentChar;

        putDebug("----"+address(sourceIndex)+"----");
        //putDebug("    cT:"+checkingToken+" bT:"+bestTokenString);
        
        //change dictionary based on quote/comment state
        if (quoteIsOpen) {

            //we are only looking for characters! (and final quote)
            currentDictionary = chars;
            currentDefinitions = charsDefinition;
        }
        else if (commentIsOpen) {
            if (checkingToken === "*" || checkingToken === "*/") {
                putDebug("--almost closed--");
            }
            else if (checkingToken === "**") {
                checkingToken = "*";
            }
            else {
                checkingToken = "";
            }
        }
        else {
            currentDictionary = mainDictionary;
            currentDefinitions = definitions;
        }

        //check every possible lex in our (current) dictionary
        for (i = 0; i < currentDictionary.length; i ++) {

            tokenStr = currentDictionary[i];
            description = currentDefinitions[i];

            //does the highlighed token match?
            if (checkingToken === tokenStr) {
                
                //match found
                putDebug("    Match: "+tokenStr+", "+description);
                bestTokenString = tokenStr;
                bestTokenDescription = description;

                //keep track of best token index
                if (bestTokenString.length == 1) {
                    //COPY current index to start index 
                    bestTokenStartIndex = sourceIndex.slice(); 
                }
                //COPY current index to end index 
                bestTokenEndIndex = sourceIndex.slice();


                //Special Cases
                //Open or close the quote
                if (tokenStr === "\"") {
                    quoteIsOpen = !quoteIsOpen;
                }
                //Open comment
                else if (tokenStr === "/*") {
                    commentIsOpen = true;
                    checkingToken = "";
                }
                //Close comment
                else if (tokenStr === "*/") {
                    commentIsOpen = false;
                    checkingToken = "";
                    bestTokenString = "";
                }


                //done with search for now
                matchFound = true;
                break;
            }
        }

        if (!matchFound) {
            putDebug("    unknown...");
        }



        //If a separator has been found
        if ((currentChar === " " && !quoteIsOpen) || 
            currentChar === "\n" /*|| 
            currentChar === "$" */) {
            putDebug("    separator found"      +"("+address(sourceIndex)+")");
            
            //create Token object
            if (!matchFound) {
                //separator with no match means unknown CharacterData
                putMessage("ERROR, unknown character");
                return sourceString;
            }
            else if (!commentIsOpen && bestTokenString !== "") {
                newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);
            }

            //reset token strings
            checkingToken = "";
            bestTokenString = "";
            bestTokenDescription = "";

            //Go backwards (sourceIndex) to where we ended off
            if (commentIsOpen) {
                //No need to go backwards
            }
            //Start at end of last token
            else if (sourceIndex[CHAR] > bestTokenEndIndex[CHAR]+1) {
                numberOfStepsBack = sourceIndex[CHAR] - bestTokenEndIndex[CHAR];
                
                sourceIndex[CHAR] = bestTokenEndIndex[CHAR];
                sourceStringIndex -= numberOfStepsBack;
                currentChar = sourceString[sourceStringIndex];
            }
            //Start at end of separtor
            else if (sourceIndex[CHAR] == bestTokenEndIndex[CHAR]+1) {
                bestTokenEndIndex[CHAR] = sourceIndex[CHAR];
            }

            //Restart for next token
            bestTokenStartIndex = bestTokenEndIndex;
            matchFound = false;
        }



        //Move index
        //new source line
        if (currentChar === "\n") {
            sourceIndex[LINE] = sourceIndex[LINE] + 1;
            sourceIndex[CHAR] = 1; //start at :1
        }
        //same source line
        else {
            sourceIndex[CHAR] = sourceIndex[CHAR] + 1;
        }
        //next source char
        sourceStringIndex ++;

        loops ++;
        //putDebug("                                "+loops);

    }

    
    //return a list of tokens
    return sourceString;
}
