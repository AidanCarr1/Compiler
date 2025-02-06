/* lexer.js  

Globals:
    tokens = "";
    tokenIndex = 0;
    currentToken = ' ';
    errorCount = 0;  

Langauge Order:
    keywords
    id
    symbol
    digit
    char

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
    /* */


function lex()
{
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value;
    // Trim the leading and trailing spaces.
    //sourceCode = trim(sourceCode);

    //where in user code are we
    sourceIndex = 0;
    userLineIndex = 1;  //start at 1
    userCharIndex = 1;  //start at 1

    //loop through text to find tokens
    while (sourceIndex < sourceCode.length){
        currentChar = sourceCode[sourceIndex];
        

        //create Token object
        newToken = new Token(currentChar, userLineIndex, userCharIndex);
        //putMessage("TOKEN [" + newToken.name + "]");

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
    }

    //return a list of tokens
    return sourceCode;
}

