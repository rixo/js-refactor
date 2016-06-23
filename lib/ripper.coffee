Context = require './Context'
{ parse } = require './parser'
{ Range } = require 'atom'
d = (require 'debug') 'ripper'

module.exports =
class Ripper

  @locToRange: ({ start, end }) ->
    new Range [ start.line - 1, start.column ], [ end.line - 1, end.column ]

  @scopeNames: [
    'source.js'
    'source.js.jsx'
    'source.babel'
  ]

  parseOptions:
    loc: true
    range: true
    tokens: true
    tolerant: true
    sourceType: 'module'
    allowReturnOutsideFunction: true
    plugins: [
      'asyncFunctions'
      'asyncGenerators'
      'classConstructorCall'
      'classProperties'
      'decorators'
      'doExpressions'
      'exponentiationOperator'
      'exportExtensions'
      'flow'
      'functionBind'
      'functionSent'
      'jsx'
      'objectRestSpread'
      'trailingFunctionCommas'
    ]
    # Other options which maybe useful
    # ecmaVersion: Infinity
    # allowHashBang: true

  constructor: ->
    @context = new Context

  destruct: ->
    delete @context

  parse: (code, callback) ->
    try
      # d 'parse', code
      rLine = /.*(?:\r?\n|\n?\r)/g
      @lines = (result[0].length while (result = rLine.exec code)?)
      @parseError = null
      @context.setCode code, @parseOptions
      callback() if callback
    catch err
      { loc, message } = @parseError = err
      if loc? and message?
        { line, column } = loc
        lineNumber = line - 1
        callback [
          range  : new Range [lineNumber, column], [lineNumber, column + 1]
          message: message
        ] if callback
      else
        d 'unknown error', err
        callback() if callback

  find: ({ row, column }) ->
    return if @parseError?
    d 'find', row, column
    pos = 0
    while --row >= 0
      pos += @lines[row]
    pos += column

    identification = @context.identify pos
    d 'identification at', pos, identification
    return [] unless identification

    ranges = identification.referencePaths.map (p) ->
      range = Ripper.locToRange p.node.loc
      if p.parentPath.isObjectProperty()
        { key, shorthand } = p.parentPath.node
        range.shorthand = shorthand
        range.key = Ripper.locToRange key.loc if not shorthand
        range.delimiter = ': '
      range

    p = identification.path
    if p.isImportSpecifier()
      { imported, local } = p.node
      range = Ripper.locToRange local.loc
      range.shorthand = local.start == imported.start
      d range.shorthand, local, imported
      range.key = Ripper.locToRange imported.loc if not range.shorthand
      range.delimiter = ' as '
      ranges.push range

    ranges
