/* --------
   Utils.ts

   Utility functions.
   -------- */
var Compiler;
(function (Compiler) {
    class Utils {
        static trim(str) {
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh?  Take a breath.  Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }
        static rot13(str) {
            var retVal = ""; // trouble explaining it in the future.  There's a lot to be said for obvious code.
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        static address(index) {
            return "" + index[LINE] + ":" + index[CHAR];
        }
        //FIX. splits by $ even if $ is inside a quote
        static getPrograms() {
            //Grab the "raw" source code. (force a separator to the end)
            var sourceString = document.getElementById("taSourceCode").value;
            //Split source string into separate programs
            var programs = sourceString.split("$");
            for (var i = 0; i < programs.length; i++) {
                //Add $ where they rightfully belong (all but the last "separated program")
                if (i != programs.length - 1) {
                    programs[i] = programs[i] + "$";
                }
                Compiler.Control.putDebug("<<" + programs[i] + ">>");
            }
            //Get rid of a possible empty final program
            var finalProgram = programs[programs.length - 1];
            if (finalProgram.replaceAll("\n", "").replaceAll(" ", "") === "") {
                var removeFinalProgram = programs.pop();
            }
            return programs;
        }
        //add space before code so index is correct
        static addSpacing(programs) {
            for (var i = 1; i < programs.length; i++) {
                //get previous program spacing
                var previousProgram = programs[i - 1];
                var spacingString = "";
                //count the length of previous program
                for (var char in previousProgram) {
                    if (previousProgram[char] === "\n") {
                        spacingString += "\n";
                    }
                    else {
                        spacingString += " ";
                    }
                }
                //add sapces to the beginning of current program
                programs[i] = spacingString + programs[i];
            }
            return programs;
        }
        //convert number to hex string
        static toHex(decimal) {
            //normal numbers:                      221   0   26     number
            var hexRaw = decimal.toString(16); // dd    0   1a     hex
            hexRaw = hexRaw.toUpperCase(); // DD    0   1A     upper
            //padding
            if (hexRaw.length <= 1) {
                hexRaw = "0" + hexRaw; // DD   00   1A     padding
            }
            //final hex
            return hexRaw;
        }
        //add spaces inbetween hex code
        static separateHex(hexString) {
            var newHexString = "";
            for (var i = 0; i < hexString.length; i += 2) {
                newHexString += hexString.substring(i, i + 2) + " ";
            }
            return newHexString;
        }
        static stringToHex(rawStr) {
            var fullHexString = "";
            //remove quotes (beginning and end)
            var str = rawStr.substring(1, rawStr.length - 1);
            for (var i = 0; i < str.length; i++) {
                //convert to ascii
                var ascii = str.charCodeAt(i);
                //convert number to hex
                var hex = this.toHex(ascii);
                fullHexString += hex;
            }
            //and add the string termination symbol
            return fullHexString + "00";
        }
    }
    Compiler.Utils = Utils;
})(Compiler || (Compiler = {}));
//# sourceMappingURL=utils.js.map