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
dictionary = [keywords, ids, symbols, digits, chars];


function lex() {
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value;
    
    // Trim the leading and trailing spaces.
    //sourceCode = trim(sourceCode);

    //where in source code are we
    sourceCodeIndex = 0;
    sourceLineIndex = 1;  //start at 1
    sourceCharIndex = 1;  //start at 1

    //token strings
    checkingToken = "";
    candidateToken = "";

    //loop through text to find tokens
    while (sourceCodeIndex < sourceCode.length){

        //look at the next character
        currentChar = sourceCode[sourceCodeIndex];
        checkingToken += currentChar;

        
        // Labeled break: solution from ChatGPT: 
        // "How can I exit to the outer loop of a nested for loop without 'return'?" 

        dictionarySearch: for (ruleNum=0; i<dictionary.length; ruleNum++) {
            rule = dictionary[ruleNum];
            for (i=0; i<rule.length; i++) {

                if (checkingToken === rule[i]) {
                    //match found
                    candidateToken = checkingToken;
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

