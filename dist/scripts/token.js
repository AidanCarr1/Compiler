/* token class */
var Compiler;
(function (Compiler) {
    class Token {
        constructor(str, description, startIndex, endIndex, tid) {
            this.str = str;
            this.description = description;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.tid = tid;
            //set variables
            this.str = str;
            this.description = description;
            this.startIndex = startIndex.slice();
            this.endIndex = endIndex.slice();
            //new TOKEN constructed!
            this.tid = tokenCount; //token ID
            tokenStream[tokenCount] = this;
            tokenCount++;
            //print TOKEN Message
            var message = "<mark class='label'>TOKEN </mark>";
            message += "<mark class='bracket'>[ '" + str + "' ]</mark> ";
            message += "<mark class='info'>" + description + " </mark>";
            message += "<mark class='address'> at " + Compiler.Utils.address(startIndex);
            //Multi-character TOKEN
            if (startIndex[LINE] < endIndex[LINE] || startIndex[CHAR] < endIndex[CHAR]) {
                message += "-" + Compiler.Utils.address(endIndex);
            }
            message += "</mark>";
            Compiler.Control.putMessage(message);
        }
    }
    Compiler.Token = Token;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=token.js.map