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


//Arrays
keywords = ["int", "string", "boolean", "while", "if", "false", "true", "print"];
ids =      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
symbols =  ["==", "!=", "\"", "(", ")", "{", "}", "/*", "*/"];
digits =   ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; 
chars =    [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",  
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


function lex() {
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value;
    
    // Trim the leading and trailing spaces.
    //sourceCode = trim(sourceCode);

    //where in user code are we
    sourceIndex = 0;
    userLineIndex = 1;  //start at 1
    userCharIndex = 1;  //start at 1

    //token strings
    checkingToken = "";

    //loop through text to find tokens
    while (sourceIndex < sourceCode.length){

        //look at the next character for a new token
        currentChar = sourceCode[sourceIndex];
        checkingToken += currentChar;

        

        //Move index
        //new user line
        if (currentChar === "\n") {
            userCharIndex = 1;  //start at 1
            userLineIndex ++;
        }
        //same user line
        else {
            userCharIndex ++;
        }
        //next source char
        sourceIndex ++;

        //create Token object
        newToken = new Token(currentChar, userLineIndex, userCharIndex);
        //putMessage("TOKEN [" + newToken.name + "]");
    }

    //return a list of tokens
    return sourceCode;
}

