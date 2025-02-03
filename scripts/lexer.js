/* lexer.js  

Globals:
    tokens = "";
    tokenIndex = 0;
    currentToken = ' ';
    errorCount = 0;  
*/

    function lex()
    {
        // Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        
        //loop through text to find tokens
        while (tokenIndex < sourceCode.length){
            currentChar = sourceCode[tokenIndex];

            tokenLine = 1;
            //create token object
            putMessage("before - token");
            newToken = new Token(currentChar, tokenLine, tokenIndex);
            putMessage("made - token");
            putMessage("TOKEN [" + newToken.name + "]");
            tokenIndex++;
        }
        putMessage("EOP!");

        //return a list of tokens
        return sourceCode;
    }

