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
dictionary =  ["int",           "string",        "boolean",       "while", "if", "false", "true", "print", "a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z", "+",        "=",          "==",       "!=",         "\"",    "(",                ")",                 "{",            "}",             "/*",           "*/",            "$",    "0",     "1",     "2",      "3",    "4",     "5",     "6",     "7",     "8",     "9"];
definitions = ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "FALSE", "TRUE", "PRINT", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ADDITION", "ASSIGNMENT", "EQUALITY", "INEQUALITY", "QUOTE", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACKET", "CLOSE BRACKET", "OPEN COMMENT", "CLOSE COMMENT", "EOP", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT"];

chars = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],


function lex2() {
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value + "\n";
    debug = true;

    //where in source code are we
    sourceCodeIndex = 0;
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

    //loop through source text to find all tokens
    while (sourceCodeIndex < sourceCode.length) {

        putDebug("----"+address(sourceIndex)+"----");

        //look at the next character
        currentChar = sourceCode[sourceCodeIndex];
        checkingToken += currentChar;


        for (i = 0; i < dictionary.length; i ++) {
            //tokenStrings = category[1];         // [==, !=]
            //tokenDescriptions = category[2];    // ["EQUALITY", "INEQUALITY"]

            //for (i = 0; i < tokenStrings.length; i ++) {

            str = dictionary[i];
            description = definitions[i];

            if (checkingToken === str) {
                //match found
                putDebug("    Match: "+str+", "+description);
                bestTokenString = str;
                bestTokenDescription = description;

                //keep track of best token index
                if (bestTokenString.length == 1) {
                    //COPY current index to start index 
                    bestTokenStartIndex = sourceIndex.slice(); 
                }
                //COPY current index to end index 
                bestTokenEndIndex = sourceIndex.slice();

                
                //Open quote
                if (str === "\"") {
                    quoteIsOpen = !quoteIsOpen;
                    newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);
                    checkingToken = "";
                    bestTokenString = "";
                }
                //Open comment
                else if (str === "/*") {
                    commentIsOpen = true;
                    checkingToken = "";
                }


                //done with search for now
                break; //dictionarySearch;
                matchFound = true;
            }
            //}
        }



        //If a separator has been found
        if (currentChar === " " || 
            currentChar === "\n" || 
            currentChar === "$" /*||
            currentChar === "\""*/) {
            putDebug("    separator found"      +"("+address(sourceIndex)+")");
            
            //create Token object
            if (bestTokenString !== "" && 
                bestTokenString !== "\n" &&
                bestTokenString !== " " && //will only work as a token inside quote
                bestTokenString !== "*/" ) {
                newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);
            }

            //reset token strings
            checkingToken = "";
            bestTokenString = "";
            bestTokenDescription = "";

            //go fully backwards (sourceIndex) to where we ended off
            if (sourceIndex[CHAR] > bestTokenEndIndex[CHAR]+1) {
                numberOfStepsBack = sourceIndex[CHAR] - bestTokenEndIndex[CHAR];
                
                sourceIndex[CHAR] = bestTokenEndIndex[CHAR];
                sourceCodeIndex -= numberOfStepsBack;
                currentChar = sourceCode[sourceCodeIndex];
            }
            //test case: inta = 0
            //start again at end of best token
            //sourceIndex = bestTokenEndIndex;
            bestTokenStartIndex = bestTokenEndIndex;

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
        sourceCodeIndex ++;


    }

    //return a list of tokens
    return sourceCode;
}
