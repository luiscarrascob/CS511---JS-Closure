function Term(label, children){
  this.label = label;
  this.children = children;
  this.toString = Term_toString;
  this.toStringIndent = Term_toStringIndent;
  this.eval = Term_eval;
}

// Print a term object in an XML format.
function Term_toString () {
  if (this.label == 'Digit')
    return '<d>'+this.children[0]+'</d>';
  else if (this.label == 'Plus')
    return '<plus>\n'+this.children[0].toString()+'\n'+this.children[1].toString()+'\n</plus>';
  else if (this.label == 'Parens')
    return '<parens>\n'+this.children[0].toString()+'\n</parens>';
}

// Print a term object in an XML format with indentation.
function Term_toStringIndent (indentStr) {
  if (this.label == 'Digit')
    return indentStr+'<d>'+this.children[0]+'</d>';
  else if (this.label == 'Plus')
    return indentStr+'<plus>\n'+this.children[0].toStringIndent(indentStr+'  ')+'\n'+this.children[1].toStringIndent(indentStr+'  ')+'\n'+indentStr+'</plus>';
  else if (this.label == 'Parens')
    return indentStr+'<parens>\n'+this.children[0].toStringIndent(indentStr+'  ')+'\n'+indentStr+'</parens>';
}

// Evaluate a term object.
function Term_eval () {
  if (this.label == 'Digit')
    return this.children[0];
  else if (this.label == 'Plus')
    return this.children[0].eval()+this.children[1].eval();
  else if (this.label == 'Parens')
    return this.children[0].eval();
}

///////////////////////////////////////////////////////////
// This is a small library of parsing combinators. These
// make it easier to convert BNF notation to a working
// JavaScript parser.

// Parser functions always take an array of tokens and
// return an abstract syntax data structure and the
// array of remaining tokens. These two objects are
// returned as a two-element array.

// Given an array of parsers, create a larger parser that
// tries each of the parsers in the array until one works.
// If none work, the value
//   p_err
// is returned.
function p_either(parsers) {
  return (function (tokens) {
    for (var i = 0; i < parsers.length; i++) {
      p = parsers[i];
      r = p(tokens);
      if (r != p_err) return r;
    }
    return p_err;  
  });
}

// Tries the parser and returns a null result if it
// does not succeed. Otherwise, returns its
// result. Useful for optional and/or ignored symbols.
function p_maybe(parser) {
  return (function (tokens) {
    r = parser(tokens);
    if (r == p_err) return [null, tokens];
    return r;
  });
}

// Given an array of parsers, create a larger parser that
// only works if each parser, applied in sequence,
// succeeds. The result is an array of results and
// the remaining token stream.
function p_sequence(parsers) {
  return (function (tokens) {
    var rs = [];
    var r = null;
    var p = null;
    for (var i = 0; i < parsers.length; i++) {
      p = parsers[i];
      r = p(tokens);
      if (r == p_err) return p_err;
      rs[rs.length] = r[0];
      tokens = r[1];
    }

    // Successful null results are discarded, making it
    // easier to sequence. (Disabled)
    var r_final = [];
    for (var j = 0; j < rs.length; j++)
      if (rs[j] != null)
        r_final[r_final.length] = rs[j];
    if (r_final.length == 1)
      r_final = r_final[0];
    if (r_final.length == 0)
      r_final = null;

    return [r_final,tokens];  
  });
}

// Given an array of parsers, create a larger parser that
// only works if each parser, applied in sequence,
// succeeds. The result is an array of results and
// the remaining token stream.
function p_seq_term(label, parsers) {
  return (function (tokens) {
    var rs = [];
    var r = null;
    var p = null;
    for (var i = 0; i < parsers.length; i++) {
      p = parsers[i];
      r = p(tokens);
      if (r == p_err) return p_err;
      rs[rs.length] = r[0];
      tokens = r[1];
    }

    // Successful null results are discarded, making it
    // easier to sequence.
    var r_final = [];
    for (var j = 0; j < rs.length; j++)
      if (rs[j] != null)
        r_final[r_final.length] = rs[j];

    return [new Term(label, r_final),tokens];  
  });
}

// A parser for a single, fixed string. Fails if
// it does not encounter the specified string
// when it looks at the next token. No result is
// returned on success, but the token is consumed.
function p_string(s) {
  return (function (tokens) {
    if (tokens.length == 0 || s != tokens[0])
      return p_err;
    else
      return [null, tokens.slice(1)];
  });
}


// A parser for a single integer. Fails
// if the next token is not a number. Returns
// the integer and token stream on success.
function p_int() {
  return (function (tokens) {
    if (tokens.length != 0 && !isNaN(tokens[0]))
      return [parseInt(tokens[0]), tokens.slice(1)];
    else {
      return p_err;
    }
  });
}

// Useful constant. Each parser returns an array
// of the following form. The first element is the
// result of parsing, and the second is the remaining
// array of tokens.
var p_err = ['<error step="parser"/>', null];

// Simple tokenizer.

function tokenize(tokenPatterns, str) {

  function token_prefix(str, cs) {
    var i = 0;
    while (i < str.length && cs.indexOf(str.charAt(i),0) != -1) i++;
    if (i == 0) return null;
    return [str.substr(0,i), str.substr(i)];
  }

  var tokens = [];
  str = new String(str);
  while (str.length > 0) {
    // Skip spaces.
    str = str.replace(/^\s+|\s+$/g, '');

    var matched = false;

    // Match patterns.
    for (var i = 0; i < tokenPatterns.length; i++) {
      var patternType = tokenPatterns[i][0];
      var pattern = tokenPatterns[i][1];

      if (patternType == 'sequence') {
        r = token_prefix(str,pattern);
        if (r != null)
          { tokens[tokens.length] = r[0]; str = r[1]; matched = true; break; }
      } else if (patternType == 'exact') {
        if (str.substr(0,pattern.length) == pattern)
          { tokens[tokens.length] = pattern; str = str.substr(pattern.length); matched = true; break; }
      }
    }
    if (!matched) return '<error step="tokenizer"/>';
  }
  return tokens;
}

///////////////////////////////////////////////////////////
// Simple examples of a tokenizer and parser.

// Tokenizing the input.
var tokenPatterns = [
  ['sequence', '0123456789'], //match any sequence with this character string
  ['exact', '('], //match this exact string
  ['exact', ')'],
  ['exact', '+']
];

/**********************************************************
  The following functions define a parser for the following
  syntax:
  
    <number> ::= 0-9
      <term> ::= <number>
               | <term> + <term>
               | ( <term> )

  However, a naive implementation of a parser for the above
  can result in infinite recursion. It's necessary to make
  an assumption that "+" will be right-associative in order
  to avoid this:

    <number> ::= 0-9

       <lhs> ::= <number>
               | ( <term> )

      <term> ::= <lhs>
               | <lhs> + <term>

  Notice that the second syntax is a subset of the first.

**********************************************************/

//Parsing terms.
parse = p_term;

// Special parsers for defined syntax.

function p_number(ts) { return p_seq_term('Digit', [p_int()])(ts); }
function p_parens(ts) { return p_seq_term('Parens', [p_string('('), p_term, p_string(')')])(ts); } // ( <term> )
function p_lhs(ts) { return p_either([p_number, p_parens])(ts); } // <lhs>::= <number> | ( <term> )
function p_term_plus(ts) { return p_seq_term('Plus', [p_lhs, p_string('+'), p_term])(ts); } // <lhs> + <term>

function p_term(ts) { return p_either([p_term_plus, p_lhs])(ts); } // <term>::= <lhs> | <lhs> + <term>

function update()
{
	input = $("#input").val();

	if (input == "" || input == " " || input == null) return;

	r = parse(tokenize(tokenPatterns, input));
	
	if (r[1] == null)
	{
		$("#output").html(r[0]);
	}
	else
	{
		term = r[0];

		$("#output").val(term.toStringIndent(' '));
		$("#result").val(term.eval());
	}
}

$(document).ready(function(){
	$("#input").focus();
	
	update();
	$("#input").keyup(function(){
		update();
	});
});

