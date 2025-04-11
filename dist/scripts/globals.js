/* Global variables */
// Tokens
var tokens = "";
var tokenIndex = 0;
var tokenStream = [];
var tokenCount = 0;
var currentToken = "";
// Error and Warning
var warningCount = 0;
var errorCount = 0;
// UI Controls
var debug = false;
// User Program Index
const LINE = 0;
const CHAR = 1;
// LEX
// Lex Dictionary Arrays
var mainDictionary = ["int", "string", "boolean", "while", "if", "false", "true", "print", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "+", "=", "==", "!=", "\"", "(", ")", "{", "}", "/*", "*/", "$", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var definitions = ["VARIABLE TYPE", "VARIABLE TYPE", "VARIABLE TYPE", "WHILE", "IF", "BOOLEAN VALUE", "BOOLEAN VALUE", "PRINT", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ADDITION", "ASSIGNMENT", "EQUALITY", "INEQUALITY", "QUOTATION", "OPEN PARENTHESIS", "CLOSE PARENTHESIS", "OPEN BRACE", "CLOSE BRACE", "OPEN COMMENT", "CLOSE COMMENT", "EOP", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT", "DIGIT"];
var chars = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "\"", "\n"];
var charsDefinition = Array(27).fill("CHAR");
charsDefinition.push("QUOTATION");
charsDefinition.push("NEW LINE BAD");
var currentDictionary = mainDictionary;
var currentDefinitions = definitions;
var currentDictionaryName = "MAIN";
var previousDictionaryName = "MAIN";
// PARSE
var parseToken = null;
var parseTokenIndex = 0;
var _CST = new Compiler.Tree(null, null);
var traversalResult = ""; //used for printing trees
// SEMANTIC ANALYSIS
var astToken = null;
var astTokenIndex = 0;
var _AST = new Compiler.Tree(null, null);
var _ScopeTree = new Compiler.Tree(null, null);
var scopeCounter = 0;
var currentNode = null;
var nodeCounter = 0;
//# sourceMappingURL=globals.js.map