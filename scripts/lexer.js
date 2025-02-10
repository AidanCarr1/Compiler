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
            ["==",       "!=",         "\"",    "(",                ")",                 "{",            "}",             "/*",           "*/"],
            ["EQAULITY", "INEQUALITY", "QUOTE", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACKET", "CLOSE BRACKET", "OPEN COMMENT", "CLOSE COMMENT"]];

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
    sourceLineIndex = 1;  //start at 1
    sourceCharIndex = 1;  //start at 1

    bestTokenStartIndex = [0,0];
    bestTokenEndIndex = [0,0];

    //token strings
    checkingToken = "";
    bestToken = "";

    //loop through source text to find tokens
    while (sourceCodeIndex < sourceCode.length){

        //look at the next character
        currentChar = sourceCode[sourceCodeIndex];
        checkingToken += currentChar;

        
        // Labeled break: solution from ChatGPT: 
        // "How can I exit to the outer loop of a nested for loop without 'return'?" 

        dictionarySearch: for (categoryNum = 0; categoryNum < dictionary.length; categoryNum ++) {
            category = dictionary[categoryNum]; // [symbols]
            categoryName = category[0];         // "symbols"
            tokenStrings = category[1];      // [==, !=]
            tokenDescriptions = category[2]; // ["EQUALITY", "INEQUALITY"]

            for (i = 0; i < tokenStrings.length; i ++) {

                str = tokenStrings[i];
                description = tokenDescriptions[i];

                if (checkingToken === str) {
                    //match found
                    putMessage("Match: "+str+", "+description);
                    bestTokenString = str;
                    bestTokenDescription = description;

                    //remember best token index
                    if (bestToken.length == 1) {
                        bestTokenStartIndex = [sourceLineIndex, sourceCharIndex];
                    }
                    bestTokenEndIndex = [sourceLineIndex, sourceCharIndex];
                    break dictionarySearch;
    
                }
            }
        }


        //Move index
        //new source line
        if (currentChar === "\n") {
            sourceCharIndex = 1;  //start at 1
            sourceLineIndex ++;
        }
        //same source line
        else {
            sourceCharIndex ++;
        }
        //next source char
        sourceCodeIndex ++;

        //create Token object
        newToken = new Token(currentChar, sourceLineIndex, sourceCharIndex);
        //putMessage("TOKEN [" + newToken.name + "]");
    }

    //return a list of tokens
    return sourceCode;
}

