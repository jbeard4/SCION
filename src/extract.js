"use strict"

const sax = require("@jbeard/sax")
const TransformableString = require("./TransformableString")
const _ = require('underscore');

const EXPRESSION_ATTRS = [ 
  'cond',
  'array'
//  'location',
//  'namelist',
//  'idlocation'
];

function iterateScripts(code, options, onChunk, onDatamodelDeclaration) {
  if (!code) return


  const xmlMode = options.xmlMode
  const isJavaScriptMIMEType = options.isJavaScriptMIMEType || (() => true)
  let index = 0
  let inScript = false
  let cdata = []
  const tagStack = []
  const attributeValuePositionCache = {};
  const attributeValueEndPositionCache = {};
  let cachedBeginCloseTagPosition;

  const chunks = []
  function pushChunk(type, end, isRootScript) {
    chunks.push({ type, start: index, end, cdata, isRootScript })
    cdata = []
    index = end
  }

  const parser = _.extend(sax.parser(true,{trim : false, xmlns : true}),
    {
      onopentag(node) {
        //console.log('onopentag',code.slice(0,parser.position));
        tagStack.push(node.name); 
        if ( node.name === "data" ) onDatamodelDeclaration(node.attributes.id.value);

        // Test if current tag is a valid <script> tag.
        if (node.name === "script"){
          inScript = true
          pushChunk("html", parser.position)
        }
      },

      onopencdata() {
        //console.log('oncdatastart',code.slice(0,parser.position));
        cdata.push(
          {
            start: parser.position-9,
            end: parser.position
          }
        )
      },

      onclosecdata(){
        //console.log('oncdataend',code.slice(0,parser.position));
        cdata.push(
          {
            start: parser.position-3,
            end: parser.position
          }
        )
      },
      

      onclosetag(name) {
        //console.log('onclosetag',code.slice(0,parser.position));
        tagStack.pop();
        if (name !== "script" || !inScript) {
          return
        }

        inScript = false

        //if (parser.position < chunks[chunks.length - 1].end) {
          // The parser didn't move its index after the previous chunk emited. It occurs on
          // self-closing tags (xml mode). Just ignore this script.
        //  return
        //}

        //console.log('tagStack[tagStack.length - 1]', tagStack[tagStack.length - 1]);
        const isRootScript = tagStack[tagStack.length - 1] === 'scxml';
        pushChunk("script", cachedBeginCloseTagPosition-2, isRootScript)
      },

      onbeginclosetag(){
       cachedBeginCloseTagPosition = parser.position;
      },

      //onopentagslash (){
      // cachedBeginCloseTagPosition = parser.position;
      //},

      ontext(t) {
        //console.log('ontext',code.slice(0,parser.position));
        if (!inScript) {
          return
        }

        //console.log('tagStack[tagStack.length - 2]', tagStack[tagStack.length - 2]);
        const isRootScript = tagStack[tagStack.length - 2] === 'scxml';
        pushChunk("script", cachedBeginCloseTagPosition-2, isRootScript)
      },

      onattributevaluestart() {
        const name = parser.attribName;
        //console.log('onattributevaluestart', name, code.slice(0,parser.position));
        if(!(name.match(/^.*expr$/) || EXPRESSION_ATTRS.indexOf(name) > -1)) return;

        inScript = true
        pushChunk("html", parser.position)
      },

      onattributevalueend(){
        //console.log('onattributevalueend', parser.attribName, parser.attribValue, code.slice(0,parser.position));

        if (!inScript) {
          return
        }

        inScript = false
        pushChunk("script", parser.position-1, false)
      },

      /*
      onattribute(attr) {
        console.log('onattribute',code.slice(0,parser.position));
        if( attr.name.match(/^.*expr$/) || EXPRESSION_ATTRS.indexOf(attr.name) > -1){
            pushChunk("script", parser.position + 1, false) //TODO: verify that this will work
        }
      }
      */
    }
  )

  parser.write(code).close();

  pushChunk("html", parser.position)

  {

    /*
    for (let i = 0; i < chunks.length; i += 1) {
      let chunk = chunks[i];
      console.log(`[${chunk.type}](${code.slice(chunk.start,chunk.end)})`);
      console.log('cdata', chunk.cdata.map(data => code.slice(data.start, data.end)));
      
    }
    */

    const emitChunk = () => {
      const cdata = []
      for (let i = startChunkIndex; i < index; i += 1) {
        cdata.push.apply(cdata, chunks[i].cdata)
      }
      //console.log('chunks[startChunkIndex]',chunks[startChunkIndex])
      onChunk({
        type: chunks[startChunkIndex].type,
        start: chunks[startChunkIndex].start,
        end: chunks[index - 1].end,
        cdata,
        isRootScript : chunks[startChunkIndex].isRootScript 
      })
    }
    let startChunkIndex = 0
    let index
    for (index = 1; index < chunks.length; index += 1) {
      if (chunks[startChunkIndex].type === chunks[index].type) continue
      emitChunk()
      startChunkIndex = index
    }

    emitChunk()
  }
}

function computeIndent(descriptor, previousHTML, slice) {
  if (!descriptor) {
    const indentMatch = /[\n\r]+([ \t]*)/.exec(slice)
    return indentMatch ? indentMatch[1] : ""
  }

  if (descriptor.relative) {
    return previousHTML.match(/([^\n\r]*)<[^<]*$/)[1] + descriptor.spaces
  }

  return descriptor.spaces
}

function* dedent(indent, slice) {
  let hadNonEmptyLine = false
  const re = /(\r\n|\n|\r)([ \t]*)(.*)/g
  let lastIndex = 0

  while (true) {
    const match = re.exec(slice)
    if (!match) break

    const newLine = match[1]
    const lineIndent = match[2]
    const lineText = match[3]

    const isEmptyLine = !lineText
    const isFirstNonEmptyLine = !isEmptyLine && !hadNonEmptyLine

    const badIndentation =
      // Be stricter on the first line
      isFirstNonEmptyLine
        ? indent !== lineIndent
        : lineIndent.indexOf(indent) !== 0

    if (!badIndentation) {
      lastIndex = match.index + newLine.length + indent.length
      // Remove the first line if it is empty
      const fromIndex = match.index === 0 ? 0 : match.index + newLine.length
      yield {
        type: "dedent",
        from: fromIndex,
        to: lastIndex,
      }
    } else if (isEmptyLine) {
      yield {
        type: "empty",
      }
    } else {
      yield {
        type: "bad-indent",
      }
    }

    if (!isEmptyLine) {
      hadNonEmptyLine = true
    }
  }

  const endSpaces = slice.slice(lastIndex).match(/[ \t]*$/)[0].length
  if (endSpaces) {
    yield {
      type: "dedent",
      from: slice.length - endSpaces,
      to: slice.length,
    }
  }
}

function extract(code, indentDescriptor, xmlMode, isJavaScriptMIMEType) {
  const badIndentationLines = []
  const codeParts = []
  let lineNumber = 1
  let previousHTML = ""
  let datamodelDeclarations = [];

  iterateScripts(code, { xmlMode, isJavaScriptMIMEType }, chunk => {
    const slice = code.slice(chunk.start, chunk.end)
    if (chunk.type === "html") {
      const match = slice.match(/\r\n|\n|\r/g)
      if (match) lineNumber += match.length
      previousHTML = slice
    } else if (chunk.type === "script") {
      const transformedCode = new TransformableString(code, chunk.isRootScript)
      let indentSlice = slice
      for (const cdata of chunk.cdata) {
        transformedCode.replace(cdata.start, cdata.end, "")
        if (cdata.end === chunk.end) {
          indentSlice = code.slice(chunk.start, cdata.start)
        }
      }
      transformedCode.replace(0, chunk.start, "")
      transformedCode.replace(chunk.end, code.length, "")
      for (const action of dedent(
        computeIndent(indentDescriptor, previousHTML, indentSlice),
        indentSlice
      )) {
        lineNumber += 1
        if (action.type === "dedent") {
          transformedCode.replace(
            chunk.start + action.from,
            chunk.start + action.to,
            ""
          )
        } else if (action.type === "bad-indent") {
          badIndentationLines.push(lineNumber)
        }
      }
      codeParts.push(transformedCode)
    }
  }, id => datamodelDeclarations.push(id) )

  return {
    code: codeParts,
    badIndentationLines,
    datamodelDeclarations
  }
}

module.exports = extract
