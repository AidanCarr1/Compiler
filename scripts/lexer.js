/* lexer.js  

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



//Category arrays
keywords = ["keywords",
            ["int",           "string",        "boolean",       "while", "if", "false", "true", "print"],
            ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "FALSE", "TRUE", "PRINT"]];

ids =      ["ids",
            ["a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z"],
            ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"]];

symbols =  ["symbols",
            ["=",          "==",       "!=",         "\"",    "(",                ")",                 "{",            "}",             "/*",           "*/",            "$"],
            ["ASSIGNMENT", "EQUALITY", "INEQUALITY", "QUOTE", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACKET", "CLOSE BRACKET", "OPEN COMMENT", "CLOSE COMMENT", "EOP"]];

digits =   ["digits",
            ["0",     "1",     "2",      "3",    "4",     "5",     "6",     "7",     "8",     "9"],
            ["DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT"]];

chars =    ["chars",
            [" ",    "a",    "b",    "c",    "d",    "e",    "f",    "g",    "h",    "i",    "j",    "k",    "l",    "m",    "n",    "o",    "p",    "q",    "r",    "s",    "t",    "u",    "v",    "w",    "x",    "y",    "z"],
            ["CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR", "CHAR"]];

//Ordered array of categories
dictionary = [keywords, ids, symbols, digits, chars];



function lex() {
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value;
    

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
    while (sourceCodeIndex < sourceCode.length){

        //putMessage("----"+address(sourceIndex)+"----");

        //look at the next character
        currentChar = sourceCode[sourceCodeIndex];
        checkingToken += currentChar;

        
        //we are inside of a quote check for closing quote
        if (quoteIsOpen && checkingToken === "\"") {
            quoteIsOpen = false;

        }

        //we are inside of a quote, only accept chars
        else if (quoteIsOpen) {
            putMessage("                           quote is open");
            
            categoryName = chars[0];            // "chars"
            tokenStrings = category[1];         // [" ", "a", "b", "c"]
            //tokenDescriptions = category[2];    // ["CHAR", "CHAR", ...]

            //check the legal chars
            for (i = 0; i < chars.length; i ++) {

                str = tokenStrings[i];
                //description = tokenDescriptions[i];

                if (checkingToken === str) {
                    //match found
                    //putMessage("    Match: "+str+", "+description);
                    bestTokenString = str;
                    bestTokenDescription = "CHAR"; //description;

                    //keep track of best token index
                    if (bestTokenString.length == 1) {
                        //COPY current index to start index 
                        bestTokenStartIndex = sourceIndex.slice(); 
                    }
                    //COPY current index to end index 
                    bestTokenEndIndex = sourceIndex.slice();
     

                    //done with search for now
                    //break dictionarySearch;
                }
            }

        }

        else if (commentIsOpen) {
            
            
            if (commentIsOpen && str === "*/") {
                commentIsOpen = false;
            }
        }
        // Labeled break: solution from ChatGPT: 
        // "How can I exit to the outer loop of a nested for loop without 'return'?" 

        //else {
            dictionarySearch: for (categoryNum = 0; categoryNum < dictionary.length; categoryNum ++) {
                category = dictionary[categoryNum]; // [symbols]
                categoryName = category[0];         // "symbols"
                tokenStrings = category[1];         // [==, !=]
                tokenDescriptions = category[2];    // ["EQUALITY", "INEQUALITY"]

                for (i = 0; i < tokenStrings.length; i ++) {

                    str = tokenStrings[i];
                    description = tokenDescriptions[i];

                    if (checkingToken === str) {
                        //match found
                        putMessage("    Match: "+str+", "+description);
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
                            quoteIsOpen = true;
                        }
                        //Open comment
                        else if (str === "/*") {
                            commentIsOpen = true;
                        }
            

                        //done with search for now
                        break dictionarySearch;
                    }
                }
            }
        //}


        //If a separator has been found
        if (currentChar === " " || currentChar === "\n" || currentChar === "$") {
            //putMessage("    separator found"      +"("+address(sourceIndex)+")");
            
            //create Token object
            newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);

            //reset token strings
            checkingToken = "";
            bestTokenString = "";
            bestTokenDescription = "";

            //TO DO:
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

