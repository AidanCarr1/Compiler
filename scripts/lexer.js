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

const LINE = 0;
const CHAR = 1;


//Category arrays
keywords = ["keywords",
            ["int",           "string",        "boolean",       "while", "if", "false", "true", "print"],
            ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "FALSE", "TRUE", "PRINT"]];

ids =      ["ids",
            ["a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z"],
            ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"]];

symbols =  ["symbols",
            ["=",          "==",       "!=",         "\"",    "(",                ")",                 "{",            "}",             "/*",           "*/",            "$"],
            ["ASSIGNMENT", "EQAULITY", "INEQUALITY", "QUOTE", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACKET", "CLOSE BRACKET", "OPEN COMMENT", "CLOSE COMMENT", "EOP"]];

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

    //loop through source text to find tokens
    while (sourceCodeIndex < sourceCode.length){

        //putMessage("----"+sourceIndex+"----");

        //look at the next character
        currentChar = sourceCode[sourceCodeIndex];
        checkingToken += currentChar;

        
        // Labeled break: solution from ChatGPT: 
        // "How can I exit to the outer loop of a nested for loop without 'return'?" 

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
                        //putMessage("start"+bestTokenStartIndex);
                    }
                    //COPY current index to end index 
                    bestTokenEndIndex = sourceIndex.slice();

                    //done with search for now
                    break dictionarySearch;
                }
            }
        }


        if (currentChar === " " || currentChar === "\n" || currentChar === "$") {
            putMessage("    separator found ("+bestTokenStartIndex+")");
            
            //create Token object
            newToken = new Token(bestTokenString, bestTokenDescription, bestTokenStartIndex, bestTokenEndIndex);

            //reset token strings
            checkingToken = "";
            bestTokenString = "";
            bestTokenDescription = "";

            //start again at end of best token
            sourceIndex = bestTokenEndIndex;
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

