/* lexer2.js  

Language Order:
    keywords:   int string boolean while if false true print
    id:         a b c d e f g h i j k l m n o p q r s t u v w x y z
    symbol:     == != = " ( ) { } + */ /*
    digit:      0 1 2 3 4 5 6 7 8 9 
    char:       a b c d e f g h i j k l m n o p q r s t u v w x y z [space]

*/

namespace Compiler {
    export class Lexer {


        public static lex(programString) {
            //Show/hide my comments
            var loops = 0; //for debugging purposes

            //Grab the "raw" source code. (force a separator to the end)
            var sourceString = programString + "\n";
            sourceString = sourceString.replaceAll("\t", " "); //treat tabs like spaces

            //Where in source code are we
            var sourceStringIndex = 0;
            var sourceIndex = [1,1];  //start at 1:1
            var bestTokenStartIndex = [1,1];
            var bestTokenEndIndex = [1,1];

            //Token strings
            var checkingToken = "";
            var bestTokenString = "";
            var bestTokenDescription = "";

            //Token switches open/close
            var quoteIsOpen = false;
            var commentIsOpen = false;
            var matchFound = false;

            //Loop through source text to find all tokens
            while (sourceStringIndex < sourceString.length && loops < 5000) {

                //Look at the next character
                var currentChar = sourceString[sourceStringIndex];
                checkingToken += currentChar;

                Control.putDebug("-"+Utils.address(sourceIndex)+"-");
                //putDebug("    cT:"+checkingToken+" bT:"+bestTokenString);
                
                //Change dictionary based on quote/comment state
                if (quoteIsOpen) {
                    //we are only looking for characters! (and final quote)
                    currentDictionary = chars;
                    currentDefinitions = charsDefinition;

                    //Did the dictionary change?
                    currentDictionaryName = "CHARS";
                    if (currentDictionaryName != previousDictionaryName) {
                        Control.putDebug("Dictionary switched to CHARS");
                    }
                    previousDictionaryName = "CHARS";  
                }

                //Ignore all characters, but look for a close comment
                else if (commentIsOpen) {
                    if (checkingToken === "*" || checkingToken === "*/") {
                        Control.putDebug("Comment almost closed");
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
                        Control.putDebug("Dictionary switched to MAIN");
                    }
                    previousDictionaryName = "MAIN";            
                }

                //Check every possible lex in our (current) dictionary
                for (var i = 0; i < currentDictionary.length; i ++) {

                    var tokenStr = currentDictionary[i];
                    var description = currentDefinitions[i];

                    //Does the highlighed token match?
                    if (checkingToken === tokenStr) {
                        
                        //Match found
                        Control.putDebug("Match [ '"+tokenStr+"' ] "+description);
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
                        Control.putDebug("Separator found"); // + "("+address(sourceIndex)+")");
                    
                    //Create Token object, check for errors
                    
                    //Separator
                    if ((checkingToken === " " && !quoteIsOpen) || 
                        checkingToken === "\n") {
                        //Just a separator, do nothing
                        Control.putDebug("Skip token, separator");
                    }
                    
                    //Comment or blank space
                    else if (commentIsOpen) {
                        //What happens in a comment, stays in a comment
                        Control.putDebug("Skip token, comment is open");
                    }
                    
                    //No match found, unknown char/token
                    else if (!matchFound) {
                        bestTokenStartIndex[CHAR] ++;

                        //Display error based on the dictionary
                        if (quoteIsOpen) {
                            var newError = new ErrorCompiler("UNKNOWN CHARACTER '"+checkingToken[0]+"'", bestTokenStartIndex);
                            return false;
                        }
                        else {
                            var newError = new ErrorCompiler("UNRECOGNIZED TOKEN '"+checkingToken[0]+"'", bestTokenStartIndex);
                            return false;
                        }
                        return sourceString;
                    }

                    //All good!
                    else {
                        var newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);
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
                        var numberOfStepsBack = sourceIndex[CHAR] - bestTokenEndIndex[CHAR];
                        
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
                        
                        return false;
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
            var finalToken = tokenStream[tokenCount-1];

            //Comment open
            if (commentIsOpen) {
                var newError = new ErrorCompiler("REACHED EOP WITH UNCLOSED COMMENT", bestTokenEndIndex);
                return false;
                //putMessage("ERROR [ Unclosed Comment ]  "+address(bestTokenEndIndex));
            }

            //Quote open
            else if (quoteIsOpen) {
                var newError = new ErrorCompiler("REACHED EOP WITH UNCLOSED QUOTE", bestTokenEndIndex);
                return false;        
                //putMessage("ERROR [ Unclosed Quote ]  "+address(bestTokenEndIndex));
            }

            //No EOP
            else if (finalToken.str !== "$") {
                var newWarning = new Warning("MISSING EOP SYMBOL $", bestTokenEndIndex);
                return false;        
                //putMessage("ERROR [ Missing EOP ]  "+address(bestTokenEndIndex));
            }

            //return a list of tokens
            return sourceString;
        }

        
    }
}