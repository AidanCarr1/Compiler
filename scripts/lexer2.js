/* lexer2.js  

Language Order:
    keywords:   int string boolean while if false true print
    id:         a b c d e f g h i j k l m n o p q r s t u v w x y z
    symbol:     == != = " ( ) { } + */ /*
    digit:      0 1 2 3 4 5 6 7 8 9 
    char:       a b c d e f g h i j k l m n o p q r s t u v w x y z [space]

*/


//Acceptable Lex arrays
mainDictionary = ["int",           "string",        "boolean",       "while", "if", "false", "true", "print", "a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z", "+",        "=",          "==",       "!=",         "\"",        "(",                ")",                 "{",            "}",             "/*",           "*/",            "$",    "0",     "1",     "2",      "3",    "4",     "5",     "6",     "7",     "8",     "9"];
definitions =    ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "FALSE", "TRUE", "PRINT", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ADDITION", "ASSIGNMENT", "EQUALITY", "INEQUALITY", "QUOTATION", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACE", "CLOSE BRACE", "OPEN COMMENT", "CLOSE COMMENT", "EOP", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT"];

chars = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "\"", "\n"];
charsDefinition = Array(27).fill("CHAR");
charsDefinition.push("QUOTATION");
charsDefinition.push("NEW LINE BAD");

currentDictionary = mainDictionary;
currentDictionaryName = "MAIN";
previousDictionaryName = "MAIN";


function lex(programString) {
    //Show/hide my comments
    loops = 0; //for debugging purposes

    //Grab the "raw" source code. (force a separator to the end)
    var sourceString = programString + "\n";
    sourceString = sourceString.replaceAll("\t", " "); //treat tabs like spaces

    //Where in source code are we
    sourceStringIndex = 0;
    sourceIndex = [1,1];  //start at 1:1
    bestTokenStartIndex = [1,1];
    bestTokenEndIndex = [1,1];

    //Token strings
    checkingToken = "";
    bestTokenString = "";
    bestTokenDescription = "";

    //Token switches open/close
    quoteIsOpen = false;
    commentIsOpen = false;
    matchFound = false;

    //Loop through source text to find all tokens
    while (sourceStringIndex < sourceString.length && loops < 5000) {

        //Look at the next character
        currentChar = sourceString[sourceStringIndex];
        checkingToken += currentChar;

        putDebug("-"+address(sourceIndex)+"-");
        //putDebug("    cT:"+checkingToken+" bT:"+bestTokenString);
        
        //Change dictionary based on quote/comment state
        if (quoteIsOpen) {
            //we are only looking for characters! (and final quote)
            currentDictionary = chars;
            currentDefinitions = charsDefinition;

            //Did the dictionary change?
            currentDictionaryName = "CHARS";
            if (currentDictionaryName != previousDictionaryName) {
                putDebug("Dictionary switched to CHARS");
            }
            previousDictionaryName = "CHARS";  
        }

        //Ignore all characters, but look for a close comment
        else if (commentIsOpen) {
            if (checkingToken === "*" || checkingToken === "*/") {
                putDebug("Comment almost closed");
            }
            else if (checkingToken === "**") {
                //allow /***/
                checkingToken = "*";
            }
            else {
                checkingToken = "";
            }
        }

        //Normal old dictionary
        else {
            currentDictionary = mainDictionary;
            currentDefinitions = definitions;

            //Did the dictionary change?
            currentDictionaryName = "MAIN";
            if (currentDictionaryName != previousDictionaryName) {
                putDebug("Dictionary switched to MAIN");
            }
            previousDictionaryName = "MAIN";            
        }

        //Check every possible lex in our (current) dictionary
        for (i = 0; i < currentDictionary.length; i ++) {

            tokenStr = currentDictionary[i];
            description = currentDefinitions[i];

            //Does the highlighed token match?
            if (checkingToken === tokenStr) {
                
                //Match found
                putDebug("Match [ '"+tokenStr+"' ] "+description);
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

                //Done with search for now
                matchFound = true;
                break;
            }
        }


        //If a separator has been found
        if ((currentChar === " " && !quoteIsOpen) || 
            currentChar === "\n") {
            putDebug("Separator found"); // + "("+address(sourceIndex)+")");
            
            //Create Token object, check for errors
            
            //Separator
            if ((checkingToken === " " && !quoteIsOpen) || 
                checkingToken === "\n") {
                //Just a separator, do nothing
                putDebug("Skip token, separator");
            }
            
            //Comment or blank space
            else if (commentIsOpen) {
                //What happens in a comment, stays in a comment
                putDebug("Skip token, comment is open");
            }
            
            //No match found, unknown char/token
            else if (!matchFound) {
                bestTokenStartIndex[CHAR] ++;

                //Display error based on the dictionary
                if (quoteIsOpen) {
                    newError = new ErrorCompiler("UNKNOWN CHARACTER", bestTokenStartIndex);
                }
                else {
                    newError = new ErrorCompiler("UNRECOGNIZED TOKEN", bestTokenStartIndex);
                }
                return sourceString;
            }

            //All good!
            else {
                newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);
            }

            //reset token strings
            checkingToken = "";
            bestTokenString = "";
            bestTokenDescription = "";

            //Go backwards (sourceIndex) to where we ended off
            //Keep going forward if inside a comment
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
        //New source line
        if (currentChar === "\n") {
            sourceIndex[LINE] = sourceIndex[LINE] + 1;
            sourceIndex[CHAR] = 1; //start at :1
            //No new lines when inside a quote!
            if (quoteIsOpen) {
                newError = new ErrorCompiler("NEW LINE BEFORE STRING TERMINATION", bestTokenStartIndex);
                quoteIsOpen = false;
                
                return sourceString;
                    //Let the lexer go on as if there was and added quote?
                    //Still an error, so parse will not activate
                    //But one error is good enough
            }
        }
        //Same source line
        else {
            sourceIndex[CHAR] = sourceIndex[CHAR] + 1;
        }
        //Next source string char
        sourceStringIndex ++;

        //for debugging
        loops ++;
        //putDebug("                                "+loops);
    }
    

    //Mutually Exclusive EOP Errors
    finalToken = tokenStream[tokenCount-1];

    //Comment open
    if (commentIsOpen) {
        newError = new ErrorCompiler("REACHED EOP WITH UNCLOSED COMMENT", bestTokenEndIndex);
                
        //putMessage("ERROR [ Unclosed Comment ]  "+address(bestTokenEndIndex));
    }

    //Quote open
    else if (quoteIsOpen) {
        newError = new ErrorCompiler("REACHED EOP WITH UNCLOSED QUOTE", bestTokenEndIndex);
                
        //putMessage("ERROR [ Unclosed Quote ]  "+address(bestTokenEndIndex));
    }

    //No EOP
    else if (finalToken.str !== "$") {
        newWarning = new Warning("MISSING EOP SYMBOL $", bestTokenEndIndex);
                
        //putMessage("ERROR [ Missing EOP ]  "+address(bestTokenEndIndex));
    }

    //return a list of tokens
    return sourceString;
}
