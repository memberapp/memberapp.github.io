(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window["buffer"] = require("buffer");
},{"buffer":3}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],3:[function(require,module,exports){
(function (global,Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"base64-js":2,"buffer":3,"ieee754":4,"isarray":5}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}]},{},[1]);
!function(e,a){"object"==typeof exports&&"undefined"!=typeof module?module.exports=a():"function"==typeof define&&define.amd?define(a):e.anchorme=a()}(this,function(){"use strict";function e(e,a){return a={exports:{}},e(a,a.exports),a.exports}var a=e(function(e,a){function n(e){return e||(e={attributes:[],ips:!0,emails:!0,urls:!0,files:!0,truncate:1/0,defaultProtocol:"http://",list:!1}),"object"!=typeof e.attributes&&(e.attributes=[]),"boolean"!=typeof e.ips&&(e.ips=!0),"boolean"!=typeof e.emails&&(e.emails=!0),"boolean"!=typeof e.urls&&(e.urls=!0),"boolean"!=typeof e.files&&(e.files=!0),"boolean"!=typeof e.list&&(e.list=!1),"string"!=typeof e.defaultProtocol&&"function"!=typeof e.defaultProtocol&&(e.defaultProtocol="http://"),"number"==typeof e.truncate||"object"==typeof e.truncate&&null!==e.truncate||(e.truncate=1/0),e}function t(e){return!isNaN(Number(e))&&!(Number(e)>65535)}Object.defineProperty(a,"__esModule",{value:!0}),a.defaultOptions=n,a.isPort=t}),n=e(function(e,a){Object.defineProperty(a,"__esModule",{value:!0}),a.tlds=["com","org","net","uk","gov","edu","io","cc","co","aaa","aarp","abarth","abb","abbott","abbvie","abc","able","abogado","abudhabi","ac","academy","accenture","accountant","accountants","aco","active","actor","ad","adac","ads","adult","ae","aeg","aero","aetna","af","afamilycompany","afl","africa","ag","agakhan","agency","ai","aig","aigo","airbus","airforce","airtel","akdn","al","alfaromeo","alibaba","alipay","allfinanz","allstate","ally","alsace","alstom","am","americanexpress","americanfamily","amex","amfam","amica","amsterdam","analytics","android","anquan","anz","ao","aol","apartments","app","apple","aq","aquarelle","ar","aramco","archi","army","arpa","art","arte","as","asda","asia","associates","at","athleta","attorney","au","auction","audi","audible","audio","auspost","author","auto","autos","avianca","aw","aws","ax","axa","az","azure","ba","baby","baidu","banamex","bananarepublic","band","bank","bar","barcelona","barclaycard","barclays","barefoot","bargains","baseball","basketball","bauhaus","bayern","bb","bbc","bbt","bbva","bcg","bcn","bd","be","beats","beauty","beer","bentley","berlin","best","bestbuy","bet","bf","bg","bh","bharti","bi","bible","bid","bike","bing","bingo","bio","biz","bj","black","blackfriday","blanco","blockbuster","blog","bloomberg","blue","bm","bms","bmw","bn","bnl","bnpparibas","bo","boats","boehringer","bofa","bom","bond","boo","book","booking","boots","bosch","bostik","boston","bot","boutique","box","br","bradesco","bridgestone","broadway","broker","brother","brussels","bs","bt","budapest","bugatti","build","builders","business","buy","buzz","bv","bw","by","bz","bzh","ca","cab","cafe","cal","call","calvinklein","cam","camera","camp","cancerresearch","canon","capetown","capital","capitalone","car","caravan","cards","care","career","careers","cars","cartier","casa","case","caseih","cash","casino","cat","catering","catholic","cba","cbn","cbre","cbs","cd","ceb","center","ceo","cern","cf","cfa","cfd","cg","ch","chanel","channel","chase","chat","cheap","chintai","chloe","christmas","chrome","chrysler","church","ci","cipriani","circle","cisco","citadel","citi","citic","city","cityeats","ck","cl","claims","cleaning","click","clinic","clinique","clothing","cloud","club","clubmed","cm","cn","coach","codes","coffee","college","cologne","comcast","commbank","community","company","compare","computer","comsec","condos","construction","consulting","contact","contractors","cooking","cookingchannel","cool","coop","corsica","country","coupon","coupons","courses","cr","credit","creditcard","creditunion","cricket","crown","crs","cruise","cruises","csc","cu","cuisinella","cv","cw","cx","cy","cymru","cyou","cz","dabur","dad","dance","data","date","dating","datsun","day","dclk","dds","de","deal","dealer","deals","degree","delivery","dell","deloitte","delta","democrat","dental","dentist","desi","design","dev","dhl","diamonds","diet","digital","direct","directory","discount","discover","dish","diy","dj","dk","dm","dnp","do","docs","doctor","dodge","dog","doha","domains","dot","download","drive","dtv","dubai","duck","dunlop","duns","dupont","durban","dvag","dvr","dz","earth","eat","ec","eco","edeka","education","ee","eg","email","emerck","energy","engineer","engineering","enterprises","epost","epson","equipment","er","ericsson","erni","es","esq","estate","esurance","et","eu","eurovision","eus","events","everbank","exchange","expert","exposed","express","extraspace","fage","fail","fairwinds","faith","family","fan","fans","farm","farmers","fashion","fast","fedex","feedback","ferrari","ferrero","fi","fiat","fidelity","fido","film","final","finance","financial","fire","firestone","firmdale","fish","fishing","fit","fitness","fj","fk","flickr","flights","flir","florist","flowers","fly","fm","fo","foo","food","foodnetwork","football","ford","forex","forsale","forum","foundation","fox","fr","free","fresenius","frl","frogans","frontdoor","frontier","ftr","fujitsu","fujixerox","fun","fund","furniture","futbol","fyi","ga","gal","gallery","gallo","gallup","game","games","gap","garden","gb","gbiz","gd","gdn","ge","gea","gent","genting","george","gf","gg","ggee","gh","gi","gift","gifts","gives","giving","gl","glade","glass","gle","global","globo","gm","gmail","gmbh","gmo","gmx","gn","godaddy","gold","goldpoint","golf","goo","goodhands","goodyear","goog","google","gop","got","gp","gq","gr","grainger","graphics","gratis","green","gripe","group","gs","gt","gu","guardian","gucci","guge","guide","guitars","guru","gw","gy","hair","hamburg","hangout","haus","hbo","hdfc","hdfcbank","health","healthcare","help","helsinki","here","hermes","hgtv","hiphop","hisamitsu","hitachi","hiv","hk","hkt","hm","hn","hockey","holdings","holiday","homedepot","homegoods","homes","homesense","honda","honeywell","horse","hospital","host","hosting","hot","hoteles","hotmail","house","how","hr","hsbc","ht","htc","hu","hughes","hyatt","hyundai","ibm","icbc","ice","icu","id","ie","ieee","ifm","ikano","il","im","imamat","imdb","immo","immobilien","in","industries","infiniti","info","ing","ink","institute","insurance","insure","int","intel","international","intuit","investments","ipiranga","iq","ir","irish","is","iselect","ismaili","ist","istanbul","it","itau","itv","iveco","iwc","jaguar","java","jcb","jcp","je","jeep","jetzt","jewelry","jio","jlc","jll","jm","jmp","jnj","jo","jobs","joburg","jot","joy","jp","jpmorgan","jprs","juegos","juniper","kaufen","kddi","ke","kerryhotels","kerrylogistics","kerryproperties","kfh","kg","kh","ki","kia","kim","kinder","kindle","kitchen","kiwi","km","kn","koeln","komatsu","kosher","kp","kpmg","kpn","kr","krd","kred","kuokgroup","kw","ky","kyoto","kz","la","lacaixa","ladbrokes","lamborghini","lamer","lancaster","lancia","lancome","land","landrover","lanxess","lasalle","lat","latino","latrobe","law","lawyer","lb","lc","lds","lease","leclerc","lefrak","legal","lego","lexus","lgbt","li","liaison","lidl","life","lifeinsurance","lifestyle","lighting","like","lilly","limited","limo","lincoln","linde","link","lipsy","live","living","lixil","lk","loan","loans","locker","locus","loft","lol","london","lotte","lotto","love","lpl","lplfinancial","lr","ls","lt","ltd","ltda","lu","lundbeck","lupin","luxe","luxury","lv","ly","ma","macys","madrid","maif","maison","makeup","man","management","mango","market","marketing","markets","marriott","marshalls","maserati","mattel","mba","mc","mcd","mcdonalds","mckinsey","md","me","med","media","meet","melbourne","meme","memorial","men","menu","meo","metlife","mg","mh","miami","microsoft","mil","mini","mint","mit","mitsubishi","mk","ml","mlb","mls","mm","mma","mn","mo","mobi","mobile","mobily","moda","moe","moi","mom","monash","money","monster","montblanc","mopar","mormon","mortgage","moscow","moto","motorcycles","mov","movie","movistar","mp","mq","mr","ms","msd","mt","mtn","mtpc","mtr","mu","museum","mutual","mv","mw","mx","my","mz","na","nab","nadex","nagoya","name","nationwide","natura","navy","nba","nc","ne","nec","netbank","netflix","network","neustar","new","newholland","news","next","nextdirect","nexus","nf","nfl","ng","ngo","nhk","ni","nico","nike","nikon","ninja","nissan","nissay","nl","no","nokia","northwesternmutual","norton","now","nowruz","nowtv","np","nr","nra","nrw","ntt","nu","nyc","nz","obi","observer","off","office","okinawa","olayan","olayangroup","oldnavy","ollo","om","omega","one","ong","onl","online","onyourside","ooo","open","oracle","orange","organic","orientexpress","origins","osaka","otsuka","ott","ovh","pa","page","pamperedchef","panasonic","panerai","paris","pars","partners","parts","party","passagens","pay","pccw","pe","pet","pf","pfizer","pg","ph","pharmacy","philips","phone","photo","photography","photos","physio","piaget","pics","pictet","pictures","pid","pin","ping","pink","pioneer","pizza","pk","pl","place","play","playstation","plumbing","plus","pm","pn","pnc","pohl","poker","politie","porn","post","pr","pramerica","praxi","press","prime","pro","prod","productions","prof","progressive","promo","properties","property","protection","pru","prudential","ps","pt","pub","pw","pwc","py","qa","qpon","quebec","quest","qvc","racing","radio","raid","re","read","realestate","realtor","realty","recipes","red","redstone","redumbrella","rehab","reise","reisen","reit","reliance","ren","rent","rentals","repair","report","republican","rest","restaurant","review","reviews","rexroth","rich","richardli","ricoh","rightathome","ril","rio","rip","rmit","ro","rocher","rocks","rodeo","rogers","room","rs","rsvp","ru","ruhr","run","rw","rwe","ryukyu","sa","saarland","safe","safety","sakura","sale","salon","samsclub","samsung","sandvik","sandvikcoromant","sanofi","sap","sapo","sarl","sas","save","saxo","sb","sbi","sbs","sc","sca","scb","schaeffler","schmidt","scholarships","school","schule","schwarz","science","scjohnson","scor","scot","sd","se","seat","secure","security","seek","select","sener","services","ses","seven","sew","sex","sexy","sfr","sg","sh","shangrila","sharp","shaw","shell","shia","shiksha","shoes","shop","shopping","shouji","show","showtime","shriram","si","silk","sina","singles","site","sj","sk","ski","skin","sky","skype","sl","sling","sm","smart","smile","sn","sncf","so","soccer","social","softbank","software","sohu","solar","solutions","song","sony","soy","space","spiegel","spot","spreadbetting","sr","srl","srt","st","stada","staples","star","starhub","statebank","statefarm","statoil","stc","stcgroup","stockholm","storage","store","stream","studio","study","style","su","sucks","supplies","supply","support","surf","surgery","suzuki","sv","swatch","swiftcover","swiss","sx","sy","sydney","symantec","systems","sz","tab","taipei","talk","taobao","target","tatamotors","tatar","tattoo","tax","taxi","tc","tci","td","tdk","team","tech","technology","tel","telecity","telefonica","temasek","tennis","teva","tf","tg","th","thd","theater","theatre","tiaa","tickets","tienda","tiffany","tips","tires","tirol","tj","tjmaxx","tjx","tk","tkmaxx","tl","tm","tmall","tn","to","today","tokyo","tools","top","toray","toshiba","total","tours","town","toyota","toys","tr","trade","trading","training","travel","travelchannel","travelers","travelersinsurance","trust","trv","tt","tube","tui","tunes","tushu","tv","tvs","tw","tz","ua","ubank","ubs","uconnect","ug","unicom","university","uno","uol","ups","us","uy","uz","va","vacations","vana","vanguard","vc","ve","vegas","ventures","verisign","versicherung","vet","vg","vi","viajes","video","vig","viking","villas","vin","vip","virgin","visa","vision","vista","vistaprint","viva","vivo","vlaanderen","vn","vodka","volkswagen","volvo","vote","voting","voto","voyage","vu","vuelos","wales","walmart","walter","wang","wanggou","warman","watch","watches","weather","weatherchannel","webcam","weber","website","wed","wedding","weibo","weir","wf","whoswho","wien","wiki","williamhill","win","windows","wine","winners","wme","wolterskluwer","woodside","work","works","world","wow","ws","wtc","wtf","xbox","xerox","xfinity","xihuan","xin","xn--11b4c3d","xn--1ck2e1b","xn--1qqw23a","xn--30rr7y","xn--3bst00m","xn--3ds443g","xn--3e0b707e","xn--3oq18vl8pn36a","xn--3pxu8k","xn--42c2d9a","xn--45brj9c","xn--45q11c","xn--4gbrim","xn--54b7fta0cc","xn--55qw42g","xn--55qx5d","xn--5su34j936bgsg","xn--5tzm5g","xn--6frz82g","xn--6qq986b3xl","xn--80adxhks","xn--80ao21a","xn--80aqecdr1a","xn--80asehdb","xn--80aswg","xn--8y0a063a","xn--90a3ac","xn--90ae","xn--90ais","xn--9dbq2a","xn--9et52u","xn--9krt00a","xn--b4w605ferd","xn--bck1b9a5dre4c","xn--c1avg","xn--c2br7g","xn--cck2b3b","xn--cg4bki","xn--clchc0ea0b2g2a9gcd","xn--czr694b","xn--czrs0t","xn--czru2d","xn--d1acj3b","xn--d1alf","xn--e1a4c","xn--eckvdtc9d","xn--efvy88h","xn--estv75g","xn--fct429k","xn--fhbei","xn--fiq228c5hs","xn--fiq64b","xn--fiqs8s","xn--fiqz9s","xn--fjq720a","xn--flw351e","xn--fpcrj9c3d","xn--fzc2c9e2c","xn--fzys8d69uvgm","xn--g2xx48c","xn--gckr3f0f","xn--gecrj9c","xn--gk3at1e","xn--h2brj9c","xn--hxt814e","xn--i1b6b1a6a2e","xn--imr513n","xn--io0a7i","xn--j1aef","xn--j1amh","xn--j6w193g","xn--jlq61u9w7b","xn--jvr189m","xn--kcrx77d1x4a","xn--kprw13d","xn--kpry57d","xn--kpu716f","xn--kput3i","xn--l1acc","xn--lgbbat1ad8j","xn--mgb9awbf","xn--mgba3a3ejt","xn--mgba3a4f16a","xn--mgba7c0bbn0a","xn--mgbaam7a8h","xn--mgbab2bd","xn--mgbai9azgqp6j","xn--mgbayh7gpa","xn--mgbb9fbpob","xn--mgbbh1a71e","xn--mgbc0a9azcg","xn--mgbca7dzdo","xn--mgberp4a5d4ar","xn--mgbi4ecexp","xn--mgbpl2fh","xn--mgbt3dhd","xn--mgbtx2b","xn--mgbx4cd0ab","xn--mix891f","xn--mk1bu44c","xn--mxtq1m","xn--ngbc5azd","xn--ngbe9e0a","xn--node","xn--nqv7f","xn--nqv7fs00ema","xn--nyqy26a","xn--o3cw4h","xn--ogbpf8fl","xn--p1acf","xn--p1ai","xn--pbt977c","xn--pgbs0dh","xn--pssy2u","xn--q9jyb4c","xn--qcka1pmc","xn--qxam","xn--rhqv96g","xn--rovu88b","xn--s9brj9c","xn--ses554g","xn--t60b56a","xn--tckwe","xn--tiq49xqyj","xn--unup4y","xn--vermgensberater-ctb","xn--vermgensberatung-pwb","xn--vhquv","xn--vuq861b","xn--w4r85el8fhu5dnra","xn--w4rs40l","xn--wgbh1c","xn--wgbl6a","xn--xhq521b","xn--xkc2al3hye2a","xn--xkc2dl3a5ee0h","xn--y9a3aq","xn--yfro4i67o","xn--ygbi2ammx","xn--zfr164b","xperia","xxx","xyz","yachts","yahoo","yamaxun","yandex","ye","yodobashi","yoga","yokohama","you","youtube","yt","yun","za","zappos","zara","zero","zip","zippo","zm","zone","zuerich","zw"],a.htmlAttrs=["src=","data=","href=","cite=","formaction=","icon=","manifest=","poster=","codebase=","background=","profile=","usemap="]}),t=e(function(e,a){function t(e){var a=e.match(o);if(null===a)return!1;for(var t=r.length-1;t>=0;t--)if(r[t].test(e))return!1;var i=a[2];return!!i&&-1!==n.tlds.indexOf(i)}Object.defineProperty(a,"__esModule",{value:!0});var o=/^[a-z0-9!#$%&'*+\-\/=?^_`{|}~.]+@([a-z0-9%\-]+\.){1,}([a-z0-9\-]+)?$/i,r=[/^[!#$%&'*+\-\/=?^_`{|}~.]/,/[.]{2,}[a-z0-9!#$%&'*+\-\/=?^_`{|}~.]+@/i,/\.@/];a.default=t}),o=e(function(e,n){function t(e){if(!o.test(e))return!1;var n=e.split("."),t=Number(n[0]);if(isNaN(t)||t>255||t<0)return!1;var r=Number(n[1]);if(isNaN(r)||r>255||r<0)return!1;var i=Number(n[2]);if(isNaN(i)||i>255||i<0)return!1;var s=Number((n[3].match(/^\d+/)||[])[0]);if(isNaN(s)||s>255||s<0)return!1;var c=(n[3].match(/(^\d+)(:)(\d+)/)||[])[3];return!(c&&!a.isPort(c))}Object.defineProperty(n,"__esModule",{value:!0});var o=/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(\/([a-z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+)?)?$/i;n.default=t}),r=e(function(e,t){function o(e){var t=e.match(r);return null!==t&&("string"==typeof t[3]&&(-1!==n.tlds.indexOf(t[3].toLowerCase())&&!(t[5]&&!a.isPort(t[5]))))}Object.defineProperty(t,"__esModule",{value:!0});var r=/^(https?:\/\/|ftps?:\/\/)?([a-z0-9%\-]+\.){1,}([a-z0-9\-]+)?(:(\d{1,5}))?(\/([a-z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+)?)?$/i;t.default=o}),i=e(function(e,a){function n(e,a,t){return e.forEach(function(o,r){!(o.indexOf(".")>-1)||e[r-1]===a&&e[r+1]===t||e[r+1]!==a&&e[r+1]!==t||(e[r]=e[r]+e[r+1],"string"==typeof e[r+2]&&(e[r]=e[r]+e[r+2]),"string"==typeof e[r+3]&&(e[r]=e[r]+e[r+3]),"string"==typeof e[r+4]&&(e[r]=e[r]+e[r+4]),e.splice(r+1,4),n(e,a,t))}),e}function t(e){return e=n(e,"(",")"),e=n(e,"[","]"),e=n(e,'"','"'),e=n(e,"'","'")}Object.defineProperty(a,"__esModule",{value:!0}),a.fixSeparators=n,a.default=t}),s=e(function(e,a){function n(e){var a=e.replace(/([\s\(\)\[\]<>"'])/g,"\0$1\0").replace(/([?;:,.!]+)(?=(\0|$|\s))/g,"\0$1\0").split("\0");return i.default(a)}function t(e){return e.join("")}Object.defineProperty(a,"__esModule",{value:!0}),a.separate=n,a.deSeparate=t}),c=e(function(e,a){function n(e){return e=e.toLowerCase(),0===e.indexOf("http://")?"http://":0===e.indexOf("https://")?"https://":0===e.indexOf("ftp://")?"ftp://":0===e.indexOf("ftps://")?"ftps://":0===e.indexOf("file:///")?"file:///":0===e.indexOf("mailto:")&&"mailto:"}Object.defineProperty(a,"__esModule",{value:!0}),a.default=n}),l=e(function(e,a){function i(e,a){return e.map(function(i,s){var l=encodeURI(i);if(l.indexOf(".")<1&&!c.default(l))return i;var u=null,d=c.default(l)||"";return d&&(l=l.substr(d.length)),a.files&&"file:///"===d&&l.split(/\/|\\/).length-1&&(u={reason:"file",protocol:d,raw:i,encoded:l}),!u&&a.urls&&r.default(l)&&(u={reason:"url",protocol:d||("function"==typeof a.defaultProtocol?a.defaultProtocol(i):a.defaultProtocol),raw:i,encoded:l}),!u&&a.emails&&t.default(l)&&(u={reason:"email",protocol:"mailto:",raw:i,encoded:l}),!u&&a.ips&&o.default(l)&&(u={reason:"ip",protocol:d||("function"==typeof a.defaultProtocol?a.defaultProtocol(i):a.defaultProtocol),raw:i,encoded:l}),u&&("'"!==e[s-1]&&'"'!==e[s-1]||!~n.htmlAttrs.indexOf(e[s-2]))?u:i})}Object.defineProperty(a,"__esModule",{value:!0}),a.default=i}),u=e(function(e,a){function n(e,a){var n=o.separate(e),r=l.default(n,a);if(a.exclude)for(var i=0;i<r.length;i++){var c=r[i];"object"==typeof c&&a.exclude(c)&&(r[i]=c.raw)}if(a.list){for(var u=[],d=0;d<r.length;d++){var b=r[d];"string"!=typeof b&&u.push(b)}return u}return r=r.map(function(e){return"string"==typeof e?e:t(e,a)}),s.deSeparate(r)}function t(e,a){var n=e.protocol+e.encoded,t=e.raw;return"number"==typeof a.truncate&&t.length>a.truncate&&(t=t.substring(0,a.truncate)+"..."),"object"==typeof a.truncate&&t.length>a.truncate[0]+a.truncate[1]&&(t=t.substr(0,a.truncate[0])+"..."+t.substr(t.length-a.truncate[1])),void 0===a.attributes&&(a.attributes=[]),'<a href="'+n+'" '+a.attributes.map(function(a){if("function"!=typeof a)return" "+a.name+'="'+a.value+'" ';var n=(a(e)||{}).name,t=(a(e)||{}).value;return n&&!t?" name ":n&&t?" "+n+'="'+t+'" ':void 0}).join("")+">"+t+"</a>"}Object.defineProperty(a,"__esModule",{value:!0});var o=s;a.default=n}),d=e(function(e,n){Object.defineProperty(n,"__esModule",{value:!0});var i=function(e,n){return n=a.defaultOptions(n),u.default(e,n)};i.validate={ip:o.default,url:function(e){var a=c.default(e)||"";return e=e.substr(a.length),e=encodeURI(e),r.default(e)},email:t.default},n.default=i});return function(e){return e&&e.__esModule?e.default:e}(d)});// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License

BITS = [16, 8, 4, 2, 1];

BASE32 = 											   "0123456789bcdefghjkmnpqrstuvwxyz";
NEIGHBORS = { right  : { even :  "bc01fg45238967deuvhjyznpkmstqrwx" },
							left   : { even :  "238967debc01fg45kmstqrwxuvhjyznp" },
							top    : { even :  "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
							bottom : { even :  "14365h7k9dcfesgujnmqp0r2twvyx8zb" } };
BORDERS   = { right  : { even : "bcfguvyz" },
							left   : { even : "0145hjnp" },
							top    : { even : "prxz" },
							bottom : { even : "028b" } };

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function refine_interval(interval, cd, mask) {
	if (cd&mask)
		interval[0] = (interval[0] + interval[1])/2;
  else
		interval[1] = (interval[0] + interval[1])/2;
}

function calculateAdjacent(srcHash, dir) {
	srcHash = srcHash.toLowerCase();
	var lastChr = srcHash.charAt(srcHash.length-1);
	var type = (srcHash.length % 2) ? 'odd' : 'even';
	var base = srcHash.substring(0,srcHash.length-1);
	if (BORDERS[dir][type].indexOf(lastChr)!=-1)
		base = calculateAdjacent(base, dir);
	return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
}

function decodeGeoHash(geohash) {
	var is_even = 1;
	var lat = []; var lon = [];
	lat[0] = -90.0;  lat[1] = 90.0;
	lon[0] = -180.0; lon[1] = 180.0;
	lat_err = 90.0;  lon_err = 180.0;
	
	for (i=0; i<geohash.length; i++) {
		c = geohash[i];
		cd = BASE32.indexOf(c);
		for (j=0; j<5; j++) {
			mask = BITS[j];
			if (is_even) {
				lon_err /= 2;
				refine_interval(lon, cd, mask);
			} else {
				lat_err /= 2;
				refine_interval(lat, cd, mask);
			}
			is_even = !is_even;
		}
	}
	lat[2] = (lat[0] + lat[1])/2;
	lon[2] = (lon[0] + lon[1])/2;

	return { latitude: lat, longitude: lon};
}

function encodeGeoHash(latitude, longitude) {
	var is_even=1;
	var i=0;
	var lat = []; var lon = [];
	var bit=0;
	var ch=0;
	var precision = 12;
	geohash = "";

	lat[0] = -90.0;  lat[1] = 90.0;
	lon[0] = -180.0; lon[1] = 180.0;
	
	while (geohash.length < precision) {
	  if (is_even) {
			mid = (lon[0] + lon[1]) / 2;
	    if (longitude > mid) {
				ch |= BITS[bit];
				lon[0] = mid;
	    } else
				lon[1] = mid;
	  } else {
			mid = (lat[0] + lat[1]) / 2;
	    if (latitude > mid) {
				ch |= BITS[bit];
				lat[0] = mid;
	    } else
				lat[1] = mid;
	  }

		is_even = !is_even;
	  if (bit < 4)
			bit++;
	  else {
			geohash += BASE32[ch];
			bit = 0;
			ch = 0;
	  }
	}
	return geohash;
}var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();/*! showdown v 1.9.1 - 02-11-2019 - This is patched 24-09-2020 so that gh handle links won't be opened in a new window*/
/*! This is patched 1-07-2021 so that gh handles may include underscores */

(function(){function e(e){"use strict";var r={omitExtraWLInCodeBlocks:{defaultValue:!1,describe:"Omit the default extra whiteline added to code blocks",type:"boolean"},noHeaderId:{defaultValue:!1,describe:"Turn on/off generated header id",type:"boolean"},prefixHeaderId:{defaultValue:!1,describe:"Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic 'section-' prefix",type:"string"},rawPrefixHeaderId:{defaultValue:!1,describe:'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',type:"boolean"},ghCompatibleHeaderId:{defaultValue:!1,describe:"Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)",type:"boolean"},rawHeaderId:{defaultValue:!1,describe:"Remove only spaces, ' and \" from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids",type:"boolean"},headerLevelStart:{defaultValue:!1,describe:"The header blocks level start",type:"integer"},parseImgDimensions:{defaultValue:!1,describe:"Turn on/off image dimension parsing",type:"boolean"},simplifiedAutoLink:{defaultValue:!1,describe:"Turn on/off GFM autolink style",type:"boolean"},excludeTrailingPunctuationFromURLs:{defaultValue:!1,describe:"Excludes trailing punctuation from links generated with autoLinking",type:"boolean"},literalMidWordUnderscores:{defaultValue:!1,describe:"Parse midword underscores as literal underscores",type:"boolean"},literalMidWordAsterisks:{defaultValue:!1,describe:"Parse midword asterisks as literal asterisks",type:"boolean"},strikethrough:{defaultValue:!1,describe:"Turn on/off strikethrough support",type:"boolean"},tables:{defaultValue:!1,describe:"Turn on/off tables support",type:"boolean"},tablesHeaderId:{defaultValue:!1,describe:"Add an id to table headers",type:"boolean"},ghCodeBlocks:{defaultValue:!0,describe:"Turn on/off GFM fenced code blocks support",type:"boolean"},tasklists:{defaultValue:!1,describe:"Turn on/off GFM tasklist support",type:"boolean"},smoothLivePreview:{defaultValue:!1,describe:"Prevents weird effects in live previews due to incomplete input",type:"boolean"},smartIndentationFix:{defaultValue:!1,description:"Tries to smartly fix indentation in es6 strings",type:"boolean"},disableForced4SpacesIndentedSublists:{defaultValue:!1,description:"Disables the requirement of indenting nested sublists by 4 spaces",type:"boolean"},simpleLineBreaks:{defaultValue:!1,description:"Parses simple line breaks as <br> (GFM Style)",type:"boolean"},requireSpaceBeforeHeadingText:{defaultValue:!1,description:"Makes adding a space between `#` and the header text mandatory (GFM Style)",type:"boolean"},ghMentions:{defaultValue:!1,description:"Enables github @mentions",type:"boolean"},ghMentionsLink:{defaultValue:"https://github.com/{u}",description:"Changes the link generated by @mentions. Only applies if ghMentions option is enabled.",type:"string"},encodeEmails:{defaultValue:!0,description:"Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities",type:"boolean"},openLinksInNewWindow:{defaultValue:!1,description:"Open all links in new windows",type:"boolean"},backslashEscapesHTMLTags:{defaultValue:!1,description:"Support for HTML Tag escaping. ex: <div>foo</div>",type:"boolean"},emoji:{defaultValue:!1,description:"Enable emoji support. Ex: `this is a :smile: emoji`",type:"boolean"},underline:{defaultValue:!1,description:"Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`",type:"boolean"},completeHTMLDocument:{defaultValue:!1,description:"Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags",type:"boolean"},metadata:{defaultValue:!1,description:"Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).",type:"boolean"},splitAdjacentBlockquotes:{defaultValue:!1,description:"Split adjacent blockquote blocks",type:"boolean"}};if(!1===e)return JSON.parse(JSON.stringify(r));var t={};for(var a in r)r.hasOwnProperty(a)&&(t[a]=r[a].defaultValue);return t}function r(e,r){"use strict";var t=r?"Error in "+r+" extension->":"Error in unnamed extension",n={valid:!0,error:""};a.helper.isArray(e)||(e=[e]);for(var s=0;s<e.length;++s){var o=t+" sub-extension "+s+": ",i=e[s];if("object"!=typeof i)return n.valid=!1,n.error=o+"must be an object, but "+typeof i+" given",n;if(!a.helper.isString(i.type))return n.valid=!1,n.error=o+'property "type" must be a string, but '+typeof i.type+" given",n;var l=i.type=i.type.toLowerCase();if("language"===l&&(l=i.type="lang"),"html"===l&&(l=i.type="output"),"lang"!==l&&"output"!==l&&"listener"!==l)return n.valid=!1,n.error=o+"type "+l+' is not recognized. Valid values: "lang/language", "output/html" or "listener"',n;if("listener"===l){if(a.helper.isUndefined(i.listeners))return n.valid=!1,n.error=o+'. Extensions of type "listener" must have a property called "listeners"',n}else if(a.helper.isUndefined(i.filter)&&a.helper.isUndefined(i.regex))return n.valid=!1,n.error=o+l+' extensions must define either a "regex" property or a "filter" method',n;if(i.listeners){if("object"!=typeof i.listeners)return n.valid=!1,n.error=o+'"listeners" property must be an object but '+typeof i.listeners+" given",n;for(var c in i.listeners)if(i.listeners.hasOwnProperty(c)&&"function"!=typeof i.listeners[c])return n.valid=!1,n.error=o+'"listeners" property must be an hash of [event name]: [callback]. listeners.'+c+" must be a function but "+typeof i.listeners[c]+" given",n}if(i.filter){if("function"!=typeof i.filter)return n.valid=!1,n.error=o+'"filter" must be a function, but '+typeof i.filter+" given",n}else if(i.regex){if(a.helper.isString(i.regex)&&(i.regex=new RegExp(i.regex,"g")),!(i.regex instanceof RegExp))return n.valid=!1,n.error=o+'"regex" property must either be a string or a RegExp object, but '+typeof i.regex+" given",n;if(a.helper.isUndefined(i.replace))return n.valid=!1,n.error=o+'"regex" extensions must implement a replace string or function',n}}return n}function t(e,r){"use strict";return"¨E"+r.charCodeAt(0)+"E"}var a={},n={},s={},o=e(!0),i="vanilla",l={github:{omitExtraWLInCodeBlocks:!0,simplifiedAutoLink:!0,excludeTrailingPunctuationFromURLs:!0,literalMidWordUnderscores:!0,strikethrough:!0,tables:!0,tablesHeaderId:!0,ghCodeBlocks:!0,tasklists:!0,disableForced4SpacesIndentedSublists:!0,simpleLineBreaks:!0,requireSpaceBeforeHeadingText:!0,ghCompatibleHeaderId:!0,ghMentions:!0,backslashEscapesHTMLTags:!0,emoji:!0,splitAdjacentBlockquotes:!0},original:{noHeaderId:!0,ghCodeBlocks:!1},ghost:{omitExtraWLInCodeBlocks:!0,parseImgDimensions:!0,simplifiedAutoLink:!0,excludeTrailingPunctuationFromURLs:!0,literalMidWordUnderscores:!0,strikethrough:!0,tables:!0,tablesHeaderId:!0,ghCodeBlocks:!0,tasklists:!0,smoothLivePreview:!0,simpleLineBreaks:!0,requireSpaceBeforeHeadingText:!0,ghMentions:!1,encodeEmails:!0},vanilla:e(!0),allOn:function(){"use strict";var r=e(!0),t={};for(var a in r)r.hasOwnProperty(a)&&(t[a]=!0);return t}()};a.helper={},a.extensions={},a.setOption=function(e,r){"use strict";return o[e]=r,this},a.getOption=function(e){"use strict";return o[e]},a.getOptions=function(){"use strict";return o},a.resetOptions=function(){"use strict";o=e(!0)},a.setFlavor=function(e){"use strict";if(!l.hasOwnProperty(e))throw Error(e+" flavor was not found");a.resetOptions();var r=l[e];i=e;for(var t in r)r.hasOwnProperty(t)&&(o[t]=r[t])},a.getFlavor=function(){"use strict";return i},a.getFlavorOptions=function(e){"use strict";if(l.hasOwnProperty(e))return l[e]},a.getDefaultOptions=function(r){"use strict";return e(r)},a.subParser=function(e,r){"use strict";if(a.helper.isString(e)){if(void 0===r){if(n.hasOwnProperty(e))return n[e];throw Error("SubParser named "+e+" not registered!")}n[e]=r}},a.extension=function(e,t){"use strict";if(!a.helper.isString(e))throw Error("Extension 'name' must be a string");if(e=a.helper.stdExtName(e),a.helper.isUndefined(t)){if(!s.hasOwnProperty(e))throw Error("Extension named "+e+" is not registered!");return s[e]}"function"==typeof t&&(t=t()),a.helper.isArray(t)||(t=[t]);var n=r(t,e);if(!n.valid)throw Error(n.error);s[e]=t},a.getAllExtensions=function(){"use strict";return s},a.removeExtension=function(e){"use strict";delete s[e]},a.resetExtensions=function(){"use strict";s={}},a.validateExtension=function(e){"use strict";var t=r(e,null);return!!t.valid||(console.warn(t.error),!1)},a.hasOwnProperty("helper")||(a.helper={}),a.helper.isString=function(e){"use strict";return"string"==typeof e||e instanceof String},a.helper.isFunction=function(e){"use strict";return e&&"[object Function]"==={}.toString.call(e)},a.helper.isArray=function(e){"use strict";return Array.isArray(e)},a.helper.isUndefined=function(e){"use strict";return void 0===e},a.helper.forEach=function(e,r){"use strict";if(a.helper.isUndefined(e))throw new Error("obj param is required");if(a.helper.isUndefined(r))throw new Error("callback param is required");if(!a.helper.isFunction(r))throw new Error("callback param must be a function/closure");if("function"==typeof e.forEach)e.forEach(r);else if(a.helper.isArray(e))for(var t=0;t<e.length;t++)r(e[t],t,e);else{if("object"!=typeof e)throw new Error("obj does not seem to be an array or an iterable object");for(var n in e)e.hasOwnProperty(n)&&r(e[n],n,e)}},a.helper.stdExtName=function(e){"use strict";return e.replace(/[_?*+\/\\.^-]/g,"").replace(/\s/g,"").toLowerCase()},a.helper.escapeCharactersCallback=t,a.helper.escapeCharacters=function(e,r,a){"use strict";var n="(["+r.replace(/([\[\]\\])/g,"\\$1")+"])";a&&(n="\\\\"+n);var s=new RegExp(n,"g");return e=e.replace(s,t)},a.helper.unescapeHTMLEntities=function(e){"use strict";return e.replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")};var c=function(e,r,t,a){"use strict";var n,s,o,i,l,c=a||"",u=c.indexOf("g")>-1,d=new RegExp(r+"|"+t,"g"+c.replace(/g/g,"")),p=new RegExp(r,c.replace(/g/g,"")),h=[];do{for(n=0;o=d.exec(e);)if(p.test(o[0]))n++||(i=(s=d.lastIndex)-o[0].length);else if(n&&!--n){l=o.index+o[0].length;var _={left:{start:i,end:s},match:{start:s,end:o.index},right:{start:o.index,end:l},wholeMatch:{start:i,end:l}};if(h.push(_),!u)return h}}while(n&&(d.lastIndex=s));return h};a.helper.matchRecursiveRegExp=function(e,r,t,a){"use strict";for(var n=c(e,r,t,a),s=[],o=0;o<n.length;++o)s.push([e.slice(n[o].wholeMatch.start,n[o].wholeMatch.end),e.slice(n[o].match.start,n[o].match.end),e.slice(n[o].left.start,n[o].left.end),e.slice(n[o].right.start,n[o].right.end)]);return s},a.helper.replaceRecursiveRegExp=function(e,r,t,n,s){"use strict";if(!a.helper.isFunction(r)){var o=r;r=function(){return o}}var i=c(e,t,n,s),l=e,u=i.length;if(u>0){var d=[];0!==i[0].wholeMatch.start&&d.push(e.slice(0,i[0].wholeMatch.start));for(var p=0;p<u;++p)d.push(r(e.slice(i[p].wholeMatch.start,i[p].wholeMatch.end),e.slice(i[p].match.start,i[p].match.end),e.slice(i[p].left.start,i[p].left.end),e.slice(i[p].right.start,i[p].right.end))),p<u-1&&d.push(e.slice(i[p].wholeMatch.end,i[p+1].wholeMatch.start));i[u-1].wholeMatch.end<e.length&&d.push(e.slice(i[u-1].wholeMatch.end)),l=d.join("")}return l},a.helper.regexIndexOf=function(e,r,t){"use strict";if(!a.helper.isString(e))throw"InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";if(r instanceof RegExp==!1)throw"InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";var n=e.substring(t||0).search(r);return n>=0?n+(t||0):n},a.helper.splitAtIndex=function(e,r){"use strict";if(!a.helper.isString(e))throw"InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";return[e.substring(0,r),e.substring(r)]},a.helper.encodeEmailAddress=function(e){"use strict";var r=[function(e){return"&#"+e.charCodeAt(0)+";"},function(e){return"&#x"+e.charCodeAt(0).toString(16)+";"},function(e){return e}];return e=e.replace(/./g,function(e){if("@"===e)e=r[Math.floor(2*Math.random())](e);else{var t=Math.random();e=t>.9?r[2](e):t>.45?r[1](e):r[0](e)}return e})},a.helper.padEnd=function(e,r,t){"use strict";return r>>=0,t=String(t||" "),e.length>r?String(e):((r-=e.length)>t.length&&(t+=t.repeat(r/t.length)),String(e)+t.slice(0,r))},"undefined"==typeof console&&(console={warn:function(e){"use strict";alert(e)},log:function(e){"use strict";alert(e)},error:function(e){"use strict";throw e}}),a.helper.regexes={asteriskDashAndColon:/([*_:~])/g},a.helper.emojis={"+1":"👍","-1":"👎",100:"💯",1234:"🔢","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉","8ball":"🎱",a:"🅰️",ab:"🆎",abc:"🔤",abcd:"🔡",accept:"🉑",aerial_tramway:"🚡",airplane:"✈️",alarm_clock:"⏰",alembic:"⚗️",alien:"👽",ambulance:"🚑",amphora:"🏺",anchor:"⚓️",angel:"👼",anger:"💢",angry:"😠",anguished:"😧",ant:"🐜",apple:"🍎",aquarius:"♒️",aries:"♈️",arrow_backward:"◀️",arrow_double_down:"⏬",arrow_double_up:"⏫",arrow_down:"⬇️",arrow_down_small:"🔽",arrow_forward:"▶️",arrow_heading_down:"⤵️",arrow_heading_up:"⤴️",arrow_left:"⬅️",arrow_lower_left:"↙️",arrow_lower_right:"↘️",arrow_right:"➡️",arrow_right_hook:"↪️",arrow_up:"⬆️",arrow_up_down:"↕️",arrow_up_small:"🔼",arrow_upper_left:"↖️",arrow_upper_right:"↗️",arrows_clockwise:"🔃",arrows_counterclockwise:"🔄",art:"🎨",articulated_lorry:"🚛",artificial_satellite:"🛰",astonished:"😲",athletic_shoe:"👟",atm:"🏧",atom_symbol:"⚛️",avocado:"🥑",b:"🅱️",baby:"👶",baby_bottle:"🍼",baby_chick:"🐤",baby_symbol:"🚼",back:"🔙",bacon:"🥓",badminton:"🏸",baggage_claim:"🛄",baguette_bread:"🥖",balance_scale:"⚖️",balloon:"🎈",ballot_box:"🗳",ballot_box_with_check:"☑️",bamboo:"🎍",banana:"🍌",bangbang:"‼️",bank:"🏦",bar_chart:"📊",barber:"💈",baseball:"⚾️",basketball:"🏀",basketball_man:"⛹️",basketball_woman:"⛹️&zwj;♀️",bat:"🦇",bath:"🛀",bathtub:"🛁",battery:"🔋",beach_umbrella:"🏖",bear:"🐻",bed:"🛏",bee:"🐝",beer:"🍺",beers:"🍻",beetle:"🐞",beginner:"🔰",bell:"🔔",bellhop_bell:"🛎",bento:"🍱",biking_man:"🚴",bike:"🚲",biking_woman:"🚴&zwj;♀️",bikini:"👙",biohazard:"☣️",bird:"🐦",birthday:"🎂",black_circle:"⚫️",black_flag:"🏴",black_heart:"🖤",black_joker:"🃏",black_large_square:"⬛️",black_medium_small_square:"◾️",black_medium_square:"◼️",black_nib:"✒️",black_small_square:"▪️",black_square_button:"🔲",blonde_man:"👱",blonde_woman:"👱&zwj;♀️",blossom:"🌼",blowfish:"🐡",blue_book:"📘",blue_car:"🚙",blue_heart:"💙",blush:"😊",boar:"🐗",boat:"⛵️",bomb:"💣",book:"📖",bookmark:"🔖",bookmark_tabs:"📑",books:"📚",boom:"💥",boot:"👢",bouquet:"💐",bowing_man:"🙇",bow_and_arrow:"🏹",bowing_woman:"🙇&zwj;♀️",bowling:"🎳",boxing_glove:"🥊",boy:"👦",bread:"🍞",bride_with_veil:"👰",bridge_at_night:"🌉",briefcase:"💼",broken_heart:"💔",bug:"🐛",building_construction:"🏗",bulb:"💡",bullettrain_front:"🚅",bullettrain_side:"🚄",burrito:"🌯",bus:"🚌",business_suit_levitating:"🕴",busstop:"🚏",bust_in_silhouette:"👤",busts_in_silhouette:"👥",butterfly:"🦋",cactus:"🌵",cake:"🍰",calendar:"📆",call_me_hand:"🤙",calling:"📲",camel:"🐫",camera:"📷",camera_flash:"📸",camping:"🏕",cancer:"♋️",candle:"🕯",candy:"🍬",canoe:"🛶",capital_abcd:"🔠",capricorn:"♑️",car:"🚗",card_file_box:"🗃",card_index:"📇",card_index_dividers:"🗂",carousel_horse:"🎠",carrot:"🥕",cat:"🐱",cat2:"🐈",cd:"💿",chains:"⛓",champagne:"🍾",chart:"💹",chart_with_downwards_trend:"📉",chart_with_upwards_trend:"📈",checkered_flag:"🏁",cheese:"🧀",cherries:"🍒",cherry_blossom:"🌸",chestnut:"🌰",chicken:"🐔",children_crossing:"🚸",chipmunk:"🐿",chocolate_bar:"🍫",christmas_tree:"🎄",church:"⛪️",cinema:"🎦",circus_tent:"🎪",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",cl:"🆑",clamp:"🗜",clap:"👏",clapper:"🎬",classical_building:"🏛",clinking_glasses:"🥂",clipboard:"📋",clock1:"🕐",clock10:"🕙",clock1030:"🕥",clock11:"🕚",clock1130:"🕦",clock12:"🕛",clock1230:"🕧",clock130:"🕜",clock2:"🕑",clock230:"🕝",clock3:"🕒",clock330:"🕞",clock4:"🕓",clock430:"🕟",clock5:"🕔",clock530:"🕠",clock6:"🕕",clock630:"🕡",clock7:"🕖",clock730:"🕢",clock8:"🕗",clock830:"🕣",clock9:"🕘",clock930:"🕤",closed_book:"📕",closed_lock_with_key:"🔐",closed_umbrella:"🌂",cloud:"☁️",cloud_with_lightning:"🌩",cloud_with_lightning_and_rain:"⛈",cloud_with_rain:"🌧",cloud_with_snow:"🌨",clown_face:"🤡",clubs:"♣️",cocktail:"🍸",coffee:"☕️",coffin:"⚰️",cold_sweat:"😰",comet:"☄️",computer:"💻",computer_mouse:"🖱",confetti_ball:"🎊",confounded:"😖",confused:"😕",congratulations:"㊗️",construction:"🚧",construction_worker_man:"👷",construction_worker_woman:"👷&zwj;♀️",control_knobs:"🎛",convenience_store:"🏪",cookie:"🍪",cool:"🆒",policeman:"👮",copyright:"©️",corn:"🌽",couch_and_lamp:"🛋",couple:"👫",couple_with_heart_woman_man:"💑",couple_with_heart_man_man:"👨&zwj;❤️&zwj;👨",couple_with_heart_woman_woman:"👩&zwj;❤️&zwj;👩",couplekiss_man_man:"👨&zwj;❤️&zwj;💋&zwj;👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩&zwj;❤️&zwj;💋&zwj;👩",cow:"🐮",cow2:"🐄",cowboy_hat_face:"🤠",crab:"🦀",crayon:"🖍",credit_card:"💳",crescent_moon:"🌙",cricket:"🏏",crocodile:"🐊",croissant:"🥐",crossed_fingers:"🤞",crossed_flags:"🎌",crossed_swords:"⚔️",crown:"👑",cry:"😢",crying_cat_face:"😿",crystal_ball:"🔮",cucumber:"🥒",cupid:"💘",curly_loop:"➰",currency_exchange:"💱",curry:"🍛",custard:"🍮",customs:"🛃",cyclone:"🌀",dagger:"🗡",dancer:"💃",dancing_women:"👯",dancing_men:"👯&zwj;♂️",dango:"🍡",dark_sunglasses:"🕶",dart:"🎯",dash:"💨",date:"📅",deciduous_tree:"🌳",deer:"🦌",department_store:"🏬",derelict_house:"🏚",desert:"🏜",desert_island:"🏝",desktop_computer:"🖥",male_detective:"🕵️",diamond_shape_with_a_dot_inside:"💠",diamonds:"♦️",disappointed:"😞",disappointed_relieved:"😥",dizzy:"💫",dizzy_face:"😵",do_not_litter:"🚯",dog:"🐶",dog2:"🐕",dollar:"💵",dolls:"🎎",dolphin:"🐬",door:"🚪",doughnut:"🍩",dove:"🕊",dragon:"🐉",dragon_face:"🐲",dress:"👗",dromedary_camel:"🐪",drooling_face:"🤤",droplet:"💧",drum:"🥁",duck:"🦆",dvd:"📀","e-mail":"📧",eagle:"🦅",ear:"👂",ear_of_rice:"🌾",earth_africa:"🌍",earth_americas:"🌎",earth_asia:"🌏",egg:"🥚",eggplant:"🍆",eight_pointed_black_star:"✴️",eight_spoked_asterisk:"✳️",electric_plug:"🔌",elephant:"🐘",email:"✉️",end:"🔚",envelope_with_arrow:"📩",euro:"💶",european_castle:"🏰",european_post_office:"🏤",evergreen_tree:"🌲",exclamation:"❗️",expressionless:"😑",eye:"👁",eye_speech_bubble:"👁&zwj;🗨",eyeglasses:"👓",eyes:"👀",face_with_head_bandage:"🤕",face_with_thermometer:"🤒",fist_oncoming:"👊",factory:"🏭",fallen_leaf:"🍂",family_man_woman_boy:"👪",family_man_boy:"👨&zwj;👦",family_man_boy_boy:"👨&zwj;👦&zwj;👦",family_man_girl:"👨&zwj;👧",family_man_girl_boy:"👨&zwj;👧&zwj;👦",family_man_girl_girl:"👨&zwj;👧&zwj;👧",family_man_man_boy:"👨&zwj;👨&zwj;👦",family_man_man_boy_boy:"👨&zwj;👨&zwj;👦&zwj;👦",family_man_man_girl:"👨&zwj;👨&zwj;👧",family_man_man_girl_boy:"👨&zwj;👨&zwj;👧&zwj;👦",family_man_man_girl_girl:"👨&zwj;👨&zwj;👧&zwj;👧",family_man_woman_boy_boy:"👨&zwj;👩&zwj;👦&zwj;👦",family_man_woman_girl:"👨&zwj;👩&zwj;👧",family_man_woman_girl_boy:"👨&zwj;👩&zwj;👧&zwj;👦",family_man_woman_girl_girl:"👨&zwj;👩&zwj;👧&zwj;👧",family_woman_boy:"👩&zwj;👦",family_woman_boy_boy:"👩&zwj;👦&zwj;👦",family_woman_girl:"👩&zwj;👧",family_woman_girl_boy:"👩&zwj;👧&zwj;👦",family_woman_girl_girl:"👩&zwj;👧&zwj;👧",family_woman_woman_boy:"👩&zwj;👩&zwj;👦",family_woman_woman_boy_boy:"👩&zwj;👩&zwj;👦&zwj;👦",family_woman_woman_girl:"👩&zwj;👩&zwj;👧",family_woman_woman_girl_boy:"👩&zwj;👩&zwj;👧&zwj;👦",family_woman_woman_girl_girl:"👩&zwj;👩&zwj;👧&zwj;👧",fast_forward:"⏩",fax:"📠",fearful:"😨",feet:"🐾",female_detective:"🕵️&zwj;♀️",ferris_wheel:"🎡",ferry:"⛴",field_hockey:"🏑",file_cabinet:"🗄",file_folder:"📁",film_projector:"📽",film_strip:"🎞",fire:"🔥",fire_engine:"🚒",fireworks:"🎆",first_quarter_moon:"🌓",first_quarter_moon_with_face:"🌛",fish:"🐟",fish_cake:"🍥",fishing_pole_and_fish:"🎣",fist_raised:"✊",fist_left:"🤛",fist_right:"🤜",flags:"🎏",flashlight:"🔦",fleur_de_lis:"⚜️",flight_arrival:"🛬",flight_departure:"🛫",floppy_disk:"💾",flower_playing_cards:"🎴",flushed:"😳",fog:"🌫",foggy:"🌁",football:"🏈",footprints:"👣",fork_and_knife:"🍴",fountain:"⛲️",fountain_pen:"🖋",four_leaf_clover:"🍀",fox_face:"🦊",framed_picture:"🖼",free:"🆓",fried_egg:"🍳",fried_shrimp:"🍤",fries:"🍟",frog:"🐸",frowning:"😦",frowning_face:"☹️",frowning_man:"🙍&zwj;♂️",frowning_woman:"🙍",middle_finger:"🖕",fuelpump:"⛽️",full_moon:"🌕",full_moon_with_face:"🌝",funeral_urn:"⚱️",game_die:"🎲",gear:"⚙️",gem:"💎",gemini:"♊️",ghost:"👻",gift:"🎁",gift_heart:"💝",girl:"👧",globe_with_meridians:"🌐",goal_net:"🥅",goat:"🐐",golf:"⛳️",golfing_man:"🏌️",golfing_woman:"🏌️&zwj;♀️",gorilla:"🦍",grapes:"🍇",green_apple:"🍏",green_book:"📗",green_heart:"💚",green_salad:"🥗",grey_exclamation:"❕",grey_question:"❔",grimacing:"😬",grin:"😁",grinning:"😀",guardsman:"💂",guardswoman:"💂&zwj;♀️",guitar:"🎸",gun:"🔫",haircut_woman:"💇",haircut_man:"💇&zwj;♂️",hamburger:"🍔",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",hamster:"🐹",hand:"✋",handbag:"👜",handshake:"🤝",hankey:"💩",hatched_chick:"🐥",hatching_chick:"🐣",headphones:"🎧",hear_no_evil:"🙉",heart:"❤️",heart_decoration:"💟",heart_eyes:"😍",heart_eyes_cat:"😻",heartbeat:"💓",heartpulse:"💗",hearts:"♥️",heavy_check_mark:"✔️",heavy_division_sign:"➗",heavy_dollar_sign:"💲",heavy_heart_exclamation:"❣️",heavy_minus_sign:"➖",heavy_multiplication_x:"✖️",heavy_plus_sign:"➕",helicopter:"🚁",herb:"🌿",hibiscus:"🌺",high_brightness:"🔆",high_heel:"👠",hocho:"🔪",hole:"🕳",honey_pot:"🍯",horse:"🐴",horse_racing:"🏇",hospital:"🏥",hot_pepper:"🌶",hotdog:"🌭",hotel:"🏨",hotsprings:"♨️",hourglass:"⌛️",hourglass_flowing_sand:"⏳",house:"🏠",house_with_garden:"🏡",houses:"🏘",hugs:"🤗",hushed:"😯",ice_cream:"🍨",ice_hockey:"🏒",ice_skate:"⛸",icecream:"🍦",id:"🆔",ideograph_advantage:"🉐",imp:"👿",inbox_tray:"📥",incoming_envelope:"📨",tipping_hand_woman:"💁",information_source:"ℹ️",innocent:"😇",interrobang:"⁉️",iphone:"📱",izakaya_lantern:"🏮",jack_o_lantern:"🎃",japan:"🗾",japanese_castle:"🏯",japanese_goblin:"👺",japanese_ogre:"👹",jeans:"👖",joy:"😂",joy_cat:"😹",joystick:"🕹",kaaba:"🕋",key:"🔑",keyboard:"⌨️",keycap_ten:"🔟",kick_scooter:"🛴",kimono:"👘",kiss:"💋",kissing:"😗",kissing_cat:"😽",kissing_closed_eyes:"😚",kissing_heart:"😘",kissing_smiling_eyes:"😙",kiwi_fruit:"🥝",koala:"🐨",koko:"🈁",label:"🏷",large_blue_circle:"🔵",large_blue_diamond:"🔷",large_orange_diamond:"🔶",last_quarter_moon:"🌗",last_quarter_moon_with_face:"🌜",latin_cross:"✝️",laughing:"😆",leaves:"🍃",ledger:"📒",left_luggage:"🛅",left_right_arrow:"↔️",leftwards_arrow_with_hook:"↩️",lemon:"🍋",leo:"♌️",leopard:"🐆",level_slider:"🎚",libra:"♎️",light_rail:"🚈",link:"🔗",lion:"🦁",lips:"👄",lipstick:"💄",lizard:"🦎",lock:"🔒",lock_with_ink_pen:"🔏",lollipop:"🍭",loop:"➿",loud_sound:"🔊",loudspeaker:"📢",love_hotel:"🏩",love_letter:"💌",low_brightness:"🔅",lying_face:"🤥",m:"Ⓜ️",mag:"🔍",mag_right:"🔎",mahjong:"🀄️",mailbox:"📫",mailbox_closed:"📪",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",man:"👨",man_artist:"👨&zwj;🎨",man_astronaut:"👨&zwj;🚀",man_cartwheeling:"🤸&zwj;♂️",man_cook:"👨&zwj;🍳",man_dancing:"🕺",man_facepalming:"🤦&zwj;♂️",man_factory_worker:"👨&zwj;🏭",man_farmer:"👨&zwj;🌾",man_firefighter:"👨&zwj;🚒",man_health_worker:"👨&zwj;⚕️",man_in_tuxedo:"🤵",man_judge:"👨&zwj;⚖️",man_juggling:"🤹&zwj;♂️",man_mechanic:"👨&zwj;🔧",man_office_worker:"👨&zwj;💼",man_pilot:"👨&zwj;✈️",man_playing_handball:"🤾&zwj;♂️",man_playing_water_polo:"🤽&zwj;♂️",man_scientist:"👨&zwj;🔬",man_shrugging:"🤷&zwj;♂️",man_singer:"👨&zwj;🎤",man_student:"👨&zwj;🎓",man_teacher:"👨&zwj;🏫",man_technologist:"👨&zwj;💻",man_with_gua_pi_mao:"👲",man_with_turban:"👳",tangerine:"🍊",mans_shoe:"👞",mantelpiece_clock:"🕰",maple_leaf:"🍁",martial_arts_uniform:"🥋",mask:"😷",massage_woman:"💆",massage_man:"💆&zwj;♂️",meat_on_bone:"🍖",medal_military:"🎖",medal_sports:"🏅",mega:"📣",melon:"🍈",memo:"📝",men_wrestling:"🤼&zwj;♂️",menorah:"🕎",mens:"🚹",metal:"🤘",metro:"🚇",microphone:"🎤",microscope:"🔬",milk_glass:"🥛",milky_way:"🌌",minibus:"🚐",minidisc:"💽",mobile_phone_off:"📴",money_mouth_face:"🤑",money_with_wings:"💸",moneybag:"💰",monkey:"🐒",monkey_face:"🐵",monorail:"🚝",moon:"🌔",mortar_board:"🎓",mosque:"🕌",motor_boat:"🛥",motor_scooter:"🛵",motorcycle:"🏍",motorway:"🛣",mount_fuji:"🗻",mountain:"⛰",mountain_biking_man:"🚵",mountain_biking_woman:"🚵&zwj;♀️",mountain_cableway:"🚠",mountain_railway:"🚞",mountain_snow:"🏔",mouse:"🐭",mouse2:"🐁",movie_camera:"🎥",moyai:"🗿",mrs_claus:"🤶",muscle:"💪",mushroom:"🍄",musical_keyboard:"🎹",musical_note:"🎵",musical_score:"🎼",mute:"🔇",nail_care:"💅",name_badge:"📛",national_park:"🏞",nauseated_face:"🤢",necktie:"👔",negative_squared_cross_mark:"❎",nerd_face:"🤓",neutral_face:"😐",new:"🆕",new_moon:"🌑",new_moon_with_face:"🌚",newspaper:"📰",newspaper_roll:"🗞",next_track_button:"⏭",ng:"🆖",no_good_man:"🙅&zwj;♂️",no_good_woman:"🙅",night_with_stars:"🌃",no_bell:"🔕",no_bicycles:"🚳",no_entry:"⛔️",no_entry_sign:"🚫",no_mobile_phones:"📵",no_mouth:"😶",no_pedestrians:"🚷",no_smoking:"🚭","non-potable_water":"🚱",nose:"👃",notebook:"📓",notebook_with_decorative_cover:"📔",notes:"🎶",nut_and_bolt:"🔩",o:"⭕️",o2:"🅾️",ocean:"🌊",octopus:"🐙",oden:"🍢",office:"🏢",oil_drum:"🛢",ok:"🆗",ok_hand:"👌",ok_man:"🙆&zwj;♂️",ok_woman:"🙆",old_key:"🗝",older_man:"👴",older_woman:"👵",om:"🕉",on:"🔛",oncoming_automobile:"🚘",oncoming_bus:"🚍",oncoming_police_car:"🚔",oncoming_taxi:"🚖",open_file_folder:"📂",open_hands:"👐",open_mouth:"😮",open_umbrella:"☂️",ophiuchus:"⛎",orange_book:"📙",orthodox_cross:"☦️",outbox_tray:"📤",owl:"🦉",ox:"🐂",package:"📦",page_facing_up:"📄",page_with_curl:"📃",pager:"📟",paintbrush:"🖌",palm_tree:"🌴",pancakes:"🥞",panda_face:"🐼",paperclip:"📎",paperclips:"🖇",parasol_on_ground:"⛱",parking:"🅿️",part_alternation_mark:"〽️",partly_sunny:"⛅️",passenger_ship:"🛳",passport_control:"🛂",pause_button:"⏸",peace_symbol:"☮️",peach:"🍑",peanuts:"🥜",pear:"🍐",pen:"🖊",pencil2:"✏️",penguin:"🐧",pensive:"😔",performing_arts:"🎭",persevere:"😣",person_fencing:"🤺",pouting_woman:"🙎",phone:"☎️",pick:"⛏",pig:"🐷",pig2:"🐖",pig_nose:"🐽",pill:"💊",pineapple:"🍍",ping_pong:"🏓",pisces:"♓️",pizza:"🍕",place_of_worship:"🛐",plate_with_cutlery:"🍽",play_or_pause_button:"⏯",point_down:"👇",point_left:"👈",point_right:"👉",point_up:"☝️",point_up_2:"👆",police_car:"🚓",policewoman:"👮&zwj;♀️",poodle:"🐩",popcorn:"🍿",post_office:"🏣",postal_horn:"📯",postbox:"📮",potable_water:"🚰",potato:"🥔",pouch:"👝",poultry_leg:"🍗",pound:"💷",rage:"😡",pouting_cat:"😾",pouting_man:"🙎&zwj;♂️",pray:"🙏",prayer_beads:"📿",pregnant_woman:"🤰",previous_track_button:"⏮",prince:"🤴",princess:"👸",printer:"🖨",purple_heart:"💜",purse:"👛",pushpin:"📌",put_litter_in_its_place:"🚮",question:"❓",rabbit:"🐰",rabbit2:"🐇",racehorse:"🐎",racing_car:"🏎",radio:"📻",radio_button:"🔘",radioactive:"☢️",railway_car:"🚃",railway_track:"🛤",rainbow:"🌈",rainbow_flag:"🏳️&zwj;🌈",raised_back_of_hand:"🤚",raised_hand_with_fingers_splayed:"🖐",raised_hands:"🙌",raising_hand_woman:"🙋",raising_hand_man:"🙋&zwj;♂️",ram:"🐏",ramen:"🍜",rat:"🐀",record_button:"⏺",recycle:"♻️",red_circle:"🔴",registered:"®️",relaxed:"☺️",relieved:"😌",reminder_ribbon:"🎗",repeat:"🔁",repeat_one:"🔂",rescue_worker_helmet:"⛑",restroom:"🚻",revolving_hearts:"💞",rewind:"⏪",rhinoceros:"🦏",ribbon:"🎀",rice:"🍚",rice_ball:"🍙",rice_cracker:"🍘",rice_scene:"🎑",right_anger_bubble:"🗯",ring:"💍",robot:"🤖",rocket:"🚀",rofl:"🤣",roll_eyes:"🙄",roller_coaster:"🎢",rooster:"🐓",rose:"🌹",rosette:"🏵",rotating_light:"🚨",round_pushpin:"📍",rowing_man:"🚣",rowing_woman:"🚣&zwj;♀️",rugby_football:"🏉",running_man:"🏃",running_shirt_with_sash:"🎽",running_woman:"🏃&zwj;♀️",sa:"🈂️",sagittarius:"♐️",sake:"🍶",sandal:"👡",santa:"🎅",satellite:"📡",saxophone:"🎷",school:"🏫",school_satchel:"🎒",scissors:"✂️",scorpion:"🦂",scorpius:"♏️",scream:"😱",scream_cat:"🙀",scroll:"📜",seat:"💺",secret:"㊙️",see_no_evil:"🙈",seedling:"🌱",selfie:"🤳",shallow_pan_of_food:"🥘",shamrock:"☘️",shark:"🦈",shaved_ice:"🍧",sheep:"🐑",shell:"🐚",shield:"🛡",shinto_shrine:"⛩",ship:"🚢",shirt:"👕",shopping:"🛍",shopping_cart:"🛒",shower:"🚿",shrimp:"🦐",signal_strength:"📶",six_pointed_star:"🔯",ski:"🎿",skier:"⛷",skull:"💀",skull_and_crossbones:"☠️",sleeping:"😴",sleeping_bed:"🛌",sleepy:"😪",slightly_frowning_face:"🙁",slightly_smiling_face:"🙂",slot_machine:"🎰",small_airplane:"🛩",small_blue_diamond:"🔹",small_orange_diamond:"🔸",small_red_triangle:"🔺",small_red_triangle_down:"🔻",smile:"😄",smile_cat:"😸",smiley:"😃",smiley_cat:"😺",smiling_imp:"😈",smirk:"😏",smirk_cat:"😼",smoking:"🚬",snail:"🐌",snake:"🐍",sneezing_face:"🤧",snowboarder:"🏂",snowflake:"❄️",snowman:"⛄️",snowman_with_snow:"☃️",sob:"😭",soccer:"⚽️",soon:"🔜",sos:"🆘",sound:"🔉",space_invader:"👾",spades:"♠️",spaghetti:"🍝",sparkle:"❇️",sparkler:"🎇",sparkles:"✨",sparkling_heart:"💖",speak_no_evil:"🙊",speaker:"🔈",speaking_head:"🗣",speech_balloon:"💬",speedboat:"🚤",spider:"🕷",spider_web:"🕸",spiral_calendar:"🗓",spiral_notepad:"🗒",spoon:"🥄",squid:"🦑",stadium:"🏟",star:"⭐️",star2:"🌟",star_and_crescent:"☪️",star_of_david:"✡️",stars:"🌠",station:"🚉",statue_of_liberty:"🗽",steam_locomotive:"🚂",stew:"🍲",stop_button:"⏹",stop_sign:"🛑",stopwatch:"⏱",straight_ruler:"📏",strawberry:"🍓",stuck_out_tongue:"😛",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue_winking_eye:"😜",studio_microphone:"🎙",stuffed_flatbread:"🥙",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",sun_behind_small_cloud:"🌤",sun_with_face:"🌞",sunflower:"🌻",sunglasses:"😎",sunny:"☀️",sunrise:"🌅",sunrise_over_mountains:"🌄",surfing_man:"🏄",surfing_woman:"🏄&zwj;♀️",sushi:"🍣",suspension_railway:"🚟",sweat:"😓",sweat_drops:"💦",sweat_smile:"😅",sweet_potato:"🍠",swimming_man:"🏊",swimming_woman:"🏊&zwj;♀️",symbols:"🔣",synagogue:"🕍",syringe:"💉",taco:"🌮",tada:"🎉",tanabata_tree:"🎋",taurus:"♉️",taxi:"🚕",tea:"🍵",telephone_receiver:"📞",telescope:"🔭",tennis:"🎾",tent:"⛺️",thermometer:"🌡",thinking:"🤔",thought_balloon:"💭",ticket:"🎫",tickets:"🎟",tiger:"🐯",tiger2:"🐅",timer_clock:"⏲",tipping_hand_man:"💁&zwj;♂️",tired_face:"😫",tm:"™️",toilet:"🚽",tokyo_tower:"🗼",tomato:"🍅",tongue:"👅",top:"🔝",tophat:"🎩",tornado:"🌪",trackball:"🖲",tractor:"🚜",traffic_light:"🚥",train:"🚋",train2:"🚆",tram:"🚊",triangular_flag_on_post:"🚩",triangular_ruler:"📐",trident:"🔱",triumph:"😤",trolleybus:"🚎",trophy:"🏆",tropical_drink:"🍹",tropical_fish:"🐠",truck:"🚚",trumpet:"🎺",tulip:"🌷",tumbler_glass:"🥃",turkey:"🦃",turtle:"🐢",tv:"📺",twisted_rightwards_arrows:"🔀",two_hearts:"💕",two_men_holding_hands:"👬",two_women_holding_hands:"👭",u5272:"🈹",u5408:"🈴",u55b6:"🈺",u6307:"🈯️",u6708:"🈷️",u6709:"🈶",u6e80:"🈵",u7121:"🈚️",u7533:"🈸",u7981:"🈲",u7a7a:"🈳",umbrella:"☔️",unamused:"😒",underage:"🔞",unicorn:"🦄",unlock:"🔓",up:"🆙",upside_down_face:"🙃",v:"✌️",vertical_traffic_light:"🚦",vhs:"📼",vibration_mode:"📳",video_camera:"📹",video_game:"🎮",violin:"🎻",virgo:"♍️",volcano:"🌋",volleyball:"🏐",vs:"🆚",vulcan_salute:"🖖",walking_man:"🚶",walking_woman:"🚶&zwj;♀️",waning_crescent_moon:"🌘",waning_gibbous_moon:"🌖",warning:"⚠️",wastebasket:"🗑",watch:"⌚️",water_buffalo:"🐃",watermelon:"🍉",wave:"👋",wavy_dash:"〰️",waxing_crescent_moon:"🌒",wc:"🚾",weary:"😩",wedding:"💒",weight_lifting_man:"🏋️",weight_lifting_woman:"🏋️&zwj;♀️",whale:"🐳",whale2:"🐋",wheel_of_dharma:"☸️",wheelchair:"♿️",white_check_mark:"✅",white_circle:"⚪️",white_flag:"🏳️",white_flower:"💮",white_large_square:"⬜️",white_medium_small_square:"◽️",white_medium_square:"◻️",white_small_square:"▫️",white_square_button:"🔳",wilted_flower:"🥀",wind_chime:"🎐",wind_face:"🌬",wine_glass:"🍷",wink:"😉",wolf:"🐺",woman:"👩",woman_artist:"👩&zwj;🎨",woman_astronaut:"👩&zwj;🚀",woman_cartwheeling:"🤸&zwj;♀️",woman_cook:"👩&zwj;🍳",woman_facepalming:"🤦&zwj;♀️",woman_factory_worker:"👩&zwj;🏭",woman_farmer:"👩&zwj;🌾",woman_firefighter:"👩&zwj;🚒",woman_health_worker:"👩&zwj;⚕️",woman_judge:"👩&zwj;⚖️",woman_juggling:"🤹&zwj;♀️",woman_mechanic:"👩&zwj;🔧",woman_office_worker:"👩&zwj;💼",woman_pilot:"👩&zwj;✈️",woman_playing_handball:"🤾&zwj;♀️",woman_playing_water_polo:"🤽&zwj;♀️",woman_scientist:"👩&zwj;🔬",woman_shrugging:"🤷&zwj;♀️",woman_singer:"👩&zwj;🎤",woman_student:"👩&zwj;🎓",woman_teacher:"👩&zwj;🏫",woman_technologist:"👩&zwj;💻",woman_with_turban:"👳&zwj;♀️",womans_clothes:"👚",womans_hat:"👒",women_wrestling:"🤼&zwj;♀️",womens:"🚺",world_map:"🗺",worried:"😟",wrench:"🔧",writing_hand:"✍️",x:"❌",yellow_heart:"💛",yen:"💴",yin_yang:"☯️",yum:"😋",zap:"⚡️",zipper_mouth_face:"🤐",zzz:"💤",octocat:'<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',showdown:"<span style=\"font-family: 'Anonymous Pro', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;\">S</span>"},a.Converter=function(e){"use strict";function t(e,t){if(t=t||null,a.helper.isString(e)){if(e=a.helper.stdExtName(e),t=e,a.extensions[e])return console.warn("DEPRECATION WARNING: "+e+" is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"),void function(e,t){"function"==typeof e&&(e=e(new a.Converter));a.helper.isArray(e)||(e=[e]);var n=r(e,t);if(!n.valid)throw Error(n.error);for(var s=0;s<e.length;++s)switch(e[s].type){case"lang":u.push(e[s]);break;case"output":d.push(e[s]);break;default:throw Error("Extension loader error: Type unrecognized!!!")}}(a.extensions[e],e);if(a.helper.isUndefined(s[e]))throw Error('Extension "'+e+'" could not be loaded. It was either not found or is not a valid extension.');e=s[e]}"function"==typeof e&&(e=e()),a.helper.isArray(e)||(e=[e]);var o=r(e,t);if(!o.valid)throw Error(o.error);for(var i=0;i<e.length;++i){switch(e[i].type){case"lang":u.push(e[i]);break;case"output":d.push(e[i])}if(e[i].hasOwnProperty("listeners"))for(var l in e[i].listeners)e[i].listeners.hasOwnProperty(l)&&n(l,e[i].listeners[l])}}function n(e,r){if(!a.helper.isString(e))throw Error("Invalid argument in converter.listen() method: name must be a string, but "+typeof e+" given");if("function"!=typeof r)throw Error("Invalid argument in converter.listen() method: callback must be a function, but "+typeof r+" given");p.hasOwnProperty(e)||(p[e]=[]),p[e].push(r)}var c={},u=[],d=[],p={},h=i,_={parsed:{},raw:"",format:""};!function(){e=e||{};for(var r in o)o.hasOwnProperty(r)&&(c[r]=o[r]);if("object"!=typeof e)throw Error("Converter expects the passed parameter to be an object, but "+typeof e+" was passed instead.");for(var n in e)e.hasOwnProperty(n)&&(c[n]=e[n]);c.extensions&&a.helper.forEach(c.extensions,t)}(),this._dispatch=function(e,r,t,a){if(p.hasOwnProperty(e))for(var n=0;n<p[e].length;++n){var s=p[e][n](e,r,this,t,a);s&&void 0!==s&&(r=s)}return r},this.listen=function(e,r){return n(e,r),this},this.makeHtml=function(e){if(!e)return e;var r={gHtmlBlocks:[],gHtmlMdBlocks:[],gHtmlSpans:[],gUrls:{},gTitles:{},gDimensions:{},gListLevel:0,hashLinkCounts:{},langExtensions:u,outputModifiers:d,converter:this,ghCodeBlocks:[],metadata:{parsed:{},raw:"",format:""}};return e=e.replace(/¨/g,"¨T"),e=e.replace(/\$/g,"¨D"),e=e.replace(/\r\n/g,"\n"),e=e.replace(/\r/g,"\n"),e=e.replace(/\u00A0/g,"&nbsp;"),c.smartIndentationFix&&(e=function(e){var r=e.match(/^\s*/)[0].length,t=new RegExp("^\\s{0,"+r+"}","gm");return e.replace(t,"")}(e)),e="\n\n"+e+"\n\n",e=a.subParser("detab")(e,c,r),e=e.replace(/^[ \t]+$/gm,""),a.helper.forEach(u,function(t){e=a.subParser("runExtension")(t,e,c,r)}),e=a.subParser("metadata")(e,c,r),e=a.subParser("hashPreCodeTags")(e,c,r),e=a.subParser("githubCodeBlocks")(e,c,r),e=a.subParser("hashHTMLBlocks")(e,c,r),e=a.subParser("hashCodeTags")(e,c,r),e=a.subParser("stripLinkDefinitions")(e,c,r),e=a.subParser("blockGamut")(e,c,r),e=a.subParser("unhashHTMLSpans")(e,c,r),e=a.subParser("unescapeSpecialChars")(e,c,r),e=e.replace(/¨D/g,"$$"),e=e.replace(/¨T/g,"¨"),e=a.subParser("completeHTMLDocument")(e,c,r),a.helper.forEach(d,function(t){e=a.subParser("runExtension")(t,e,c,r)}),_=r.metadata,e},this.makeMarkdown=this.makeMd=function(e,r){function t(e){for(var r=0;r<e.childNodes.length;++r){var a=e.childNodes[r];3===a.nodeType?/\S/.test(a.nodeValue)?(a.nodeValue=a.nodeValue.split("\n").join(" "),a.nodeValue=a.nodeValue.replace(/(\s)+/g,"$1")):(e.removeChild(a),--r):1===a.nodeType&&t(a)}}if(e=e.replace(/\r\n/g,"\n"),e=e.replace(/\r/g,"\n"),e=e.replace(/>[ \t]+</,">¨NBSP;<"),!r){if(!window||!window.document)throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");r=window.document}var n=r.createElement("div");n.innerHTML=e;var s={preList:function(e){for(var r=e.querySelectorAll("pre"),t=[],n=0;n<r.length;++n)if(1===r[n].childElementCount&&"code"===r[n].firstChild.tagName.toLowerCase()){var s=r[n].firstChild.innerHTML.trim(),o=r[n].firstChild.getAttribute("data-language")||"";if(""===o)for(var i=r[n].firstChild.className.split(" "),l=0;l<i.length;++l){var c=i[l].match(/^language-(.+)$/);if(null!==c){o=c[1];break}}s=a.helper.unescapeHTMLEntities(s),t.push(s),r[n].outerHTML='<precode language="'+o+'" precodenum="'+n.toString()+'"></precode>'}else t.push(r[n].innerHTML),r[n].innerHTML="",r[n].setAttribute("prenum",n.toString());return t}(n)};t(n);for(var o=n.childNodes,i="",l=0;l<o.length;l++)i+=a.subParser("makeMarkdown.node")(o[l],s);return i},this.setOption=function(e,r){c[e]=r},this.getOption=function(e){return c[e]},this.getOptions=function(){return c},this.addExtension=function(e,r){t(e,r=r||null)},this.useExtension=function(e){t(e)},this.setFlavor=function(e){if(!l.hasOwnProperty(e))throw Error(e+" flavor was not found");var r=l[e];h=e;for(var t in r)r.hasOwnProperty(t)&&(c[t]=r[t])},this.getFlavor=function(){return h},this.removeExtension=function(e){a.helper.isArray(e)||(e=[e]);for(var r=0;r<e.length;++r){for(var t=e[r],n=0;n<u.length;++n)u[n]===t&&u[n].splice(n,1);for(;0<d.length;++n)d[0]===t&&d[0].splice(n,1)}},this.getAllExtensions=function(){return{language:u,output:d}},this.getMetadata=function(e){return e?_.raw:_.parsed},this.getMetadataFormat=function(){return _.format},this._setMetadataPair=function(e,r){_.parsed[e]=r},this._setMetadataFormat=function(e){_.format=e},this._setMetadataRaw=function(e){_.raw=e}},a.subParser("anchors",function(e,r,t){"use strict";var n=function(e,n,s,o,i,l,c){if(a.helper.isUndefined(c)&&(c=""),s=s.toLowerCase(),e.search(/\(<?\s*>? ?(['"].*['"])?\)$/m)>-1)o="";else if(!o){if(s||(s=n.toLowerCase().replace(/ ?\n/g," ")),o="#"+s,a.helper.isUndefined(t.gUrls[s]))return e;o=t.gUrls[s],a.helper.isUndefined(t.gTitles[s])||(c=t.gTitles[s])}var u='<a href="'+(o=o.replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback))+'"';return""!==c&&null!==c&&(u+=' title="'+(c=(c=c.replace(/"/g,"&quot;")).replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback))+'"'),r.openLinksInNewWindow&&!/^#/.test(o)&&(u+=' rel="noopener noreferrer" target="¨E95Eblank"'),u+=">"+n+"</a>"};return e=(e=t.converter._dispatch("anchors.before",e,r,t)).replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g,n),e=e.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,n),e=e.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,n),e=e.replace(/\[([^\[\]]+)]()()()()()/g,n),r.ghMentions&&(e=e.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-_]+?[a-z\d]+)*))/gim,function(e,t,n,s,o){if("\\"===n)return t+s;if(!a.helper.isString(r.ghMentionsLink))throw new Error("ghMentionsLink option must be a string");var i=r.ghMentionsLink.replace(/\{u}/g,o),l="";return r.openLinksInNewWindow&&(l=''),t+'<a href="'+i+'"'+l+">"+s+"</a>"})),e=t.converter._dispatch("anchors.after",e,r,t)});var u=/([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi,d=/([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi,p=/()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi,h=/(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gim,_=/<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,g=function(e){"use strict";return function(r,t,n,s,o,i,l){var c=n=n.replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback),u="",d="",p=t||"",h=l||"";return/^www\./i.test(n)&&(n=n.replace(/^www\./i,"http://www.")),e.excludeTrailingPunctuationFromURLs&&i&&(u=i),e.openLinksInNewWindow&&(d=' rel="noopener noreferrer" target="¨E95Eblank"'),p+'<a href="'+n+'"'+d+">"+c+"</a>"+u+h}},m=function(e,r){"use strict";return function(t,n,s){var o="mailto:";return n=n||"",s=a.subParser("unescapeSpecialChars")(s,e,r),e.encodeEmails?(o=a.helper.encodeEmailAddress(o+s),s=a.helper.encodeEmailAddress(s)):o+=s,n+'<a href="'+o+'">'+s+"</a>"}};a.subParser("autoLinks",function(e,r,t){"use strict";return e=t.converter._dispatch("autoLinks.before",e,r,t),e=e.replace(p,g(r)),e=e.replace(_,m(r,t)),e=t.converter._dispatch("autoLinks.after",e,r,t)}),a.subParser("simplifiedAutoLinks",function(e,r,t){"use strict";return r.simplifiedAutoLink?(e=t.converter._dispatch("simplifiedAutoLinks.before",e,r,t),e=r.excludeTrailingPunctuationFromURLs?e.replace(d,g(r)):e.replace(u,g(r)),e=e.replace(h,m(r,t)),e=t.converter._dispatch("simplifiedAutoLinks.after",e,r,t)):e}),a.subParser("blockGamut",function(e,r,t){"use strict";return e=t.converter._dispatch("blockGamut.before",e,r,t),e=a.subParser("blockQuotes")(e,r,t),e=a.subParser("headers")(e,r,t),e=a.subParser("horizontalRule")(e,r,t),e=a.subParser("lists")(e,r,t),e=a.subParser("codeBlocks")(e,r,t),e=a.subParser("tables")(e,r,t),e=a.subParser("hashHTMLBlocks")(e,r,t),e=a.subParser("paragraphs")(e,r,t),e=t.converter._dispatch("blockGamut.after",e,r,t)}),a.subParser("blockQuotes",function(e,r,t){"use strict";e=t.converter._dispatch("blockQuotes.before",e,r,t),e+="\n\n";var n=/(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;return r.splitAdjacentBlockquotes&&(n=/^ {0,3}>[\s\S]*?(?:\n\n)/gm),e=e.replace(n,function(e){return e=e.replace(/^[ \t]*>[ \t]?/gm,""),e=e.replace(/¨0/g,""),e=e.replace(/^[ \t]+$/gm,""),e=a.subParser("githubCodeBlocks")(e,r,t),e=a.subParser("blockGamut")(e,r,t),e=e.replace(/(^|\n)/g,"$1  "),e=e.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(e,r){var t=r;return t=t.replace(/^  /gm,"¨0"),t=t.replace(/¨0/g,"")}),a.subParser("hashBlock")("<blockquote>\n"+e+"\n</blockquote>",r,t)}),e=t.converter._dispatch("blockQuotes.after",e,r,t)}),a.subParser("codeBlocks",function(e,r,t){"use strict";e=t.converter._dispatch("codeBlocks.before",e,r,t);return e=(e+="¨0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g,function(e,n,s){var o=n,i=s,l="\n";return o=a.subParser("outdent")(o,r,t),o=a.subParser("encodeCode")(o,r,t),o=a.subParser("detab")(o,r,t),o=o.replace(/^\n+/g,""),o=o.replace(/\n+$/g,""),r.omitExtraWLInCodeBlocks&&(l=""),o="<pre><code>"+o+l+"</code></pre>",a.subParser("hashBlock")(o,r,t)+i}),e=e.replace(/¨0/,""),e=t.converter._dispatch("codeBlocks.after",e,r,t)}),a.subParser("codeSpans",function(e,r,t){"use strict";return void 0===(e=t.converter._dispatch("codeSpans.before",e,r,t))&&(e=""),e=e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(e,n,s,o){var i=o;return i=i.replace(/^([ \t]*)/g,""),i=i.replace(/[ \t]*$/g,""),i=a.subParser("encodeCode")(i,r,t),i=n+"<code>"+i+"</code>",i=a.subParser("hashHTMLSpans")(i,r,t)}),e=t.converter._dispatch("codeSpans.after",e,r,t)}),a.subParser("completeHTMLDocument",function(e,r,t){"use strict";if(!r.completeHTMLDocument)return e;e=t.converter._dispatch("completeHTMLDocument.before",e,r,t);var a="html",n="<!DOCTYPE HTML>\n",s="",o='<meta charset="utf-8">\n',i="",l="";void 0!==t.metadata.parsed.doctype&&(n="<!DOCTYPE "+t.metadata.parsed.doctype+">\n","html"!==(a=t.metadata.parsed.doctype.toString().toLowerCase())&&"html5"!==a||(o='<meta charset="utf-8">'));for(var c in t.metadata.parsed)if(t.metadata.parsed.hasOwnProperty(c))switch(c.toLowerCase()){case"doctype":break;case"title":s="<title>"+t.metadata.parsed.title+"</title>\n";break;case"charset":o="html"===a||"html5"===a?'<meta charset="'+t.metadata.parsed.charset+'">\n':'<meta name="charset" content="'+t.metadata.parsed.charset+'">\n';break;case"language":case"lang":i=' lang="'+t.metadata.parsed[c]+'"',l+='<meta name="'+c+'" content="'+t.metadata.parsed[c]+'">\n';break;default:l+='<meta name="'+c+'" content="'+t.metadata.parsed[c]+'">\n'}return e=n+"<html"+i+">\n<head>\n"+s+o+l+"</head>\n<body>\n"+e.trim()+"\n</body>\n</html>",e=t.converter._dispatch("completeHTMLDocument.after",e,r,t)}),a.subParser("detab",function(e,r,t){"use strict";return e=t.converter._dispatch("detab.before",e,r,t),e=e.replace(/\t(?=\t)/g,"    "),e=e.replace(/\t/g,"¨A¨B"),e=e.replace(/¨B(.+?)¨A/g,function(e,r){for(var t=r,a=4-t.length%4,n=0;n<a;n++)t+=" ";return t}),e=e.replace(/¨A/g,"    "),e=e.replace(/¨B/g,""),e=t.converter._dispatch("detab.after",e,r,t)}),a.subParser("ellipsis",function(e,r,t){"use strict";return e=t.converter._dispatch("ellipsis.before",e,r,t),e=e.replace(/\.\.\./g,"…"),e=t.converter._dispatch("ellipsis.after",e,r,t)}),a.subParser("emoji",function(e,r,t){"use strict";if(!r.emoji)return e;return e=(e=t.converter._dispatch("emoji.before",e,r,t)).replace(/:([\S]+?):/g,function(e,r){return a.helper.emojis.hasOwnProperty(r)?a.helper.emojis[r]:e}),e=t.converter._dispatch("emoji.after",e,r,t)}),a.subParser("encodeAmpsAndAngles",function(e,r,t){"use strict";return e=t.converter._dispatch("encodeAmpsAndAngles.before",e,r,t),e=e.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),e=e.replace(/<(?![a-z\/?$!])/gi,"&lt;"),e=e.replace(/</g,"&lt;"),e=e.replace(/>/g,"&gt;"),e=t.converter._dispatch("encodeAmpsAndAngles.after",e,r,t)}),a.subParser("encodeBackslashEscapes",function(e,r,t){"use strict";return e=t.converter._dispatch("encodeBackslashEscapes.before",e,r,t),e=e.replace(/\\(\\)/g,a.helper.escapeCharactersCallback),e=e.replace(/\\([`*_{}\[\]()>#+.!~=|-])/g,a.helper.escapeCharactersCallback),e=t.converter._dispatch("encodeBackslashEscapes.after",e,r,t)}),a.subParser("encodeCode",function(e,r,t){"use strict";return e=t.converter._dispatch("encodeCode.before",e,r,t),e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/([*_{}\[\]\\=~-])/g,a.helper.escapeCharactersCallback),e=t.converter._dispatch("encodeCode.after",e,r,t)}),a.subParser("escapeSpecialCharsWithinTagAttributes",function(e,r,t){"use strict";return e=(e=t.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before",e,r,t)).replace(/<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi,function(e){return e.replace(/(.)<\/?code>(?=.)/g,"$1`").replace(/([\\`*_~=|])/g,a.helper.escapeCharactersCallback)}),e=e.replace(/<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi,function(e){return e.replace(/([\\`*_~=|])/g,a.helper.escapeCharactersCallback)}),e=t.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after",e,r,t)}),a.subParser("githubCodeBlocks",function(e,r,t){"use strict";return r.ghCodeBlocks?(e=t.converter._dispatch("githubCodeBlocks.before",e,r,t),e+="¨0",e=e.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g,function(e,n,s,o){var i=r.omitExtraWLInCodeBlocks?"":"\n";return o=a.subParser("encodeCode")(o,r,t),o=a.subParser("detab")(o,r,t),o=o.replace(/^\n+/g,""),o=o.replace(/\n+$/g,""),o="<pre><code"+(s?' class="'+s+" language-"+s+'"':"")+">"+o+i+"</code></pre>",o=a.subParser("hashBlock")(o,r,t),"\n\n¨G"+(t.ghCodeBlocks.push({text:e,codeblock:o})-1)+"G\n\n"}),e=e.replace(/¨0/,""),t.converter._dispatch("githubCodeBlocks.after",e,r,t)):e}),a.subParser("hashBlock",function(e,r,t){"use strict";return e=t.converter._dispatch("hashBlock.before",e,r,t),e=e.replace(/(^\n+|\n+$)/g,""),e="\n\n¨K"+(t.gHtmlBlocks.push(e)-1)+"K\n\n",e=t.converter._dispatch("hashBlock.after",e,r,t)}),a.subParser("hashCodeTags",function(e,r,t){"use strict";e=t.converter._dispatch("hashCodeTags.before",e,r,t);return e=a.helper.replaceRecursiveRegExp(e,function(e,n,s,o){var i=s+a.subParser("encodeCode")(n,r,t)+o;return"¨C"+(t.gHtmlSpans.push(i)-1)+"C"},"<code\\b[^>]*>","</code>","gim"),e=t.converter._dispatch("hashCodeTags.after",e,r,t)}),a.subParser("hashElement",function(e,r,t){"use strict";return function(e,r){var a=r;return a=a.replace(/\n\n/g,"\n"),a=a.replace(/^\n/,""),a=a.replace(/\n+$/g,""),a="\n\n¨K"+(t.gHtmlBlocks.push(a)-1)+"K\n\n"}}),a.subParser("hashHTMLBlocks",function(e,r,t){"use strict";e=t.converter._dispatch("hashHTMLBlocks.before",e,r,t);var n=["pre","div","h1","h2","h3","h4","h5","h6","blockquote","table","dl","ol","ul","script","noscript","form","fieldset","iframe","math","style","section","header","footer","nav","article","aside","address","audio","canvas","figure","hgroup","output","video","p"],s=function(e,r,a,n){var s=e;return-1!==a.search(/\bmarkdown\b/)&&(s=a+t.converter.makeHtml(r)+n),"\n\n¨K"+(t.gHtmlBlocks.push(s)-1)+"K\n\n"};r.backslashEscapesHTMLTags&&(e=e.replace(/\\<(\/?[^>]+?)>/g,function(e,r){return"&lt;"+r+"&gt;"}));for(var o=0;o<n.length;++o)for(var i,l=new RegExp("^ {0,3}(<"+n[o]+"\\b[^>]*>)","im"),c="<"+n[o]+"\\b[^>]*>",u="</"+n[o]+">";-1!==(i=a.helper.regexIndexOf(e,l));){var d=a.helper.splitAtIndex(e,i),p=a.helper.replaceRecursiveRegExp(d[1],s,c,u,"im");if(p===d[1])break;e=d[0].concat(p)}return e=e.replace(/(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,a.subParser("hashElement")(e,r,t)),e=a.helper.replaceRecursiveRegExp(e,function(e){return"\n\n¨K"+(t.gHtmlBlocks.push(e)-1)+"K\n\n"},"^ {0,3}\x3c!--","--\x3e","gm"),e=e.replace(/(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,a.subParser("hashElement")(e,r,t)),e=t.converter._dispatch("hashHTMLBlocks.after",e,r,t)}),a.subParser("hashHTMLSpans",function(e,r,t){"use strict";function a(e){return"¨C"+(t.gHtmlSpans.push(e)-1)+"C"}return e=t.converter._dispatch("hashHTMLSpans.before",e,r,t),e=e.replace(/<[^>]+?\/>/gi,function(e){return a(e)}),e=e.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g,function(e){return a(e)}),e=e.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g,function(e){return a(e)}),e=e.replace(/<[^>]+?>/gi,function(e){return a(e)}),e=t.converter._dispatch("hashHTMLSpans.after",e,r,t)}),a.subParser("unhashHTMLSpans",function(e,r,t){"use strict";e=t.converter._dispatch("unhashHTMLSpans.before",e,r,t);for(var a=0;a<t.gHtmlSpans.length;++a){for(var n=t.gHtmlSpans[a],s=0;/¨C(\d+)C/.test(n);){var o=RegExp.$1;if(n=n.replace("¨C"+o+"C",t.gHtmlSpans[o]),10===s){console.error("maximum nesting of 10 spans reached!!!");break}++s}e=e.replace("¨C"+a+"C",n)}return e=t.converter._dispatch("unhashHTMLSpans.after",e,r,t)}),a.subParser("hashPreCodeTags",function(e,r,t){"use strict";e=t.converter._dispatch("hashPreCodeTags.before",e,r,t);return e=a.helper.replaceRecursiveRegExp(e,function(e,n,s,o){var i=s+a.subParser("encodeCode")(n,r,t)+o;return"\n\n¨G"+(t.ghCodeBlocks.push({text:e,codeblock:i})-1)+"G\n\n"},"^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>","^ {0,3}</code>\\s*</pre>","gim"),e=t.converter._dispatch("hashPreCodeTags.after",e,r,t)}),a.subParser("headers",function(e,r,t){"use strict";function n(e){var n,s;if(r.customizedHeaderId){var o=e.match(/\{([^{]+?)}\s*$/);o&&o[1]&&(e=o[1])}return n=e,s=a.helper.isString(r.prefixHeaderId)?r.prefixHeaderId:!0===r.prefixHeaderId?"section-":"",r.rawPrefixHeaderId||(n=s+n),n=r.ghCompatibleHeaderId?n.replace(/ /g,"-").replace(/&amp;/g,"").replace(/¨T/g,"").replace(/¨D/g,"").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g,"").toLowerCase():r.rawHeaderId?n.replace(/ /g,"-").replace(/&amp;/g,"&").replace(/¨T/g,"¨").replace(/¨D/g,"$").replace(/["']/g,"-").toLowerCase():n.replace(/[^\w]/g,"").toLowerCase(),r.rawPrefixHeaderId&&(n=s+n),t.hashLinkCounts[n]?n=n+"-"+t.hashLinkCounts[n]++:t.hashLinkCounts[n]=1,n}e=t.converter._dispatch("headers.before",e,r,t);var s=isNaN(parseInt(r.headerLevelStart))?1:parseInt(r.headerLevelStart),o=r.smoothLivePreview?/^(.+)[ \t]*\n={2,}[ \t]*\n+/gm:/^(.+)[ \t]*\n=+[ \t]*\n+/gm,i=r.smoothLivePreview?/^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm:/^(.+)[ \t]*\n-+[ \t]*\n+/gm;e=(e=e.replace(o,function(e,o){var i=a.subParser("spanGamut")(o,r,t),l=r.noHeaderId?"":' id="'+n(o)+'"',c="<h"+s+l+">"+i+"</h"+s+">";return a.subParser("hashBlock")(c,r,t)})).replace(i,function(e,o){var i=a.subParser("spanGamut")(o,r,t),l=r.noHeaderId?"":' id="'+n(o)+'"',c=s+1,u="<h"+c+l+">"+i+"</h"+c+">";return a.subParser("hashBlock")(u,r,t)});var l=r.requireSpaceBeforeHeadingText?/^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm:/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;return e=e.replace(l,function(e,o,i){var l=i;r.customizedHeaderId&&(l=i.replace(/\s?\{([^{]+?)}\s*$/,""));var c=a.subParser("spanGamut")(l,r,t),u=r.noHeaderId?"":' id="'+n(i)+'"',d=s-1+o.length,p="<h"+d+u+">"+c+"</h"+d+">";return a.subParser("hashBlock")(p,r,t)}),e=t.converter._dispatch("headers.after",e,r,t)}),a.subParser("horizontalRule",function(e,r,t){"use strict";e=t.converter._dispatch("horizontalRule.before",e,r,t);var n=a.subParser("hashBlock")("<hr />",r,t);return e=e.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm,n),e=e.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm,n),e=e.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm,n),e=t.converter._dispatch("horizontalRule.after",e,r,t)}),a.subParser("images",function(e,r,t){"use strict";function n(e,r,n,s,o,i,l,c){var u=t.gUrls,d=t.gTitles,p=t.gDimensions;if(n=n.toLowerCase(),c||(c=""),e.search(/\(<?\s*>? ?(['"].*['"])?\)$/m)>-1)s="";else if(""===s||null===s){if(""!==n&&null!==n||(n=r.toLowerCase().replace(/ ?\n/g," ")),s="#"+n,a.helper.isUndefined(u[n]))return e;s=u[n],a.helper.isUndefined(d[n])||(c=d[n]),a.helper.isUndefined(p[n])||(o=p[n].width,i=p[n].height)}r=r.replace(/"/g,"&quot;").replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback);var h='<img src="'+(s=s.replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback))+'" alt="'+r+'"';return c&&a.helper.isString(c)&&(h+=' title="'+(c=c.replace(/"/g,"&quot;").replace(a.helper.regexes.asteriskDashAndColon,a.helper.escapeCharactersCallback))+'"'),o&&i&&(h+=' width="'+(o="*"===o?"auto":o)+'"',h+=' height="'+(i="*"===i?"auto":i)+'"'),h+=" />"}return e=(e=t.converter._dispatch("images.before",e,r,t)).replace(/!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g,n),e=e.replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,function(e,r,t,a,s,o,i,l){return a=a.replace(/\s/g,""),n(e,r,t,a,s,o,0,l)}),e=e.replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g,n),e=e.replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,n),e=e.replace(/!\[([^\[\]]+)]()()()()()/g,n),e=t.converter._dispatch("images.after",e,r,t)}),a.subParser("italicsAndBold",function(e,r,t){"use strict";function a(e,r,t){return r+e+t}return e=t.converter._dispatch("italicsAndBold.before",e,r,t),e=r.literalMidWordUnderscores?(e=(e=e.replace(/\b___(\S[\s\S]*?)___\b/g,function(e,r){return a(r,"<strong><em>","</em></strong>")})).replace(/\b__(\S[\s\S]*?)__\b/g,function(e,r){return a(r,"<strong>","</strong>")})).replace(/\b_(\S[\s\S]*?)_\b/g,function(e,r){return a(r,"<em>","</em>")}):(e=(e=e.replace(/___(\S[\s\S]*?)___/g,function(e,r){return/\S$/.test(r)?a(r,"<strong><em>","</em></strong>"):e})).replace(/__(\S[\s\S]*?)__/g,function(e,r){return/\S$/.test(r)?a(r,"<strong>","</strong>"):e})).replace(/_([^\s_][\s\S]*?)_/g,function(e,r){return/\S$/.test(r)?a(r,"<em>","</em>"):e}),e=r.literalMidWordAsterisks?(e=(e=e.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g,function(e,r,t){return a(t,r+"<strong><em>","</em></strong>")})).replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g,function(e,r,t){return a(t,r+"<strong>","</strong>")})).replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g,function(e,r,t){return a(t,r+"<em>","</em>")}):(e=(e=e.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g,function(e,r){return/\S$/.test(r)?a(r,"<strong><em>","</em></strong>"):e})).replace(/\*\*(\S[\s\S]*?)\*\*/g,function(e,r){return/\S$/.test(r)?a(r,"<strong>","</strong>"):e})).replace(/\*([^\s*][\s\S]*?)\*/g,function(e,r){return/\S$/.test(r)?a(r,"<em>","</em>"):e}),e=t.converter._dispatch("italicsAndBold.after",e,r,t)}),a.subParser("lists",function(e,r,t){"use strict";function n(e,n){t.gListLevel++,e=e.replace(/\n{2,}$/,"\n");var s=/(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm,o=/\n[ \t]*\n(?!¨0)/.test(e+="¨0");return r.disableForced4SpacesIndentedSublists&&(s=/(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm),e=e.replace(s,function(e,n,s,i,l,c,u){u=u&&""!==u.trim();var d=a.subParser("outdent")(l,r,t),p="";return c&&r.tasklists&&(p=' class="task-list-item" style="list-style-type: none;"',d=d.replace(/^[ \t]*\[(x|X| )?]/m,function(){var e='<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';return u&&(e+=" checked"),e+=">"})),d=d.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g,function(e){return"¨A"+e}),n||d.search(/\n{2,}/)>-1?(d=a.subParser("githubCodeBlocks")(d,r,t),d=a.subParser("blockGamut")(d,r,t)):(d=(d=a.subParser("lists")(d,r,t)).replace(/\n$/,""),d=(d=a.subParser("hashHTMLBlocks")(d,r,t)).replace(/\n\n+/g,"\n\n"),d=o?a.subParser("paragraphs")(d,r,t):a.subParser("spanGamut")(d,r,t)),d=d.replace("¨A",""),d="<li"+p+">"+d+"</li>\n"}),e=e.replace(/¨0/g,""),t.gListLevel--,n&&(e=e.replace(/\s+$/,"")),e}function s(e,r){if("ol"===r){var t=e.match(/^ *(\d+)\./);if(t&&"1"!==t[1])return' start="'+t[1]+'"'}return""}function o(e,t,a){var o=r.disableForced4SpacesIndentedSublists?/^ ?\d+\.[ \t]/gm:/^ {0,3}\d+\.[ \t]/gm,i=r.disableForced4SpacesIndentedSublists?/^ ?[*+-][ \t]/gm:/^ {0,3}[*+-][ \t]/gm,l="ul"===t?o:i,c="";if(-1!==e.search(l))!function r(u){var d=u.search(l),p=s(e,t);-1!==d?(c+="\n\n<"+t+p+">\n"+n(u.slice(0,d),!!a)+"</"+t+">\n",l="ul"===(t="ul"===t?"ol":"ul")?o:i,r(u.slice(d))):c+="\n\n<"+t+p+">\n"+n(u,!!a)+"</"+t+">\n"}(e);else{var u=s(e,t);c="\n\n<"+t+u+">\n"+n(e,!!a)+"</"+t+">\n"}return c}return e=t.converter._dispatch("lists.before",e,r,t),e+="¨0",e=t.gListLevel?e.replace(/^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,function(e,r,t){return o(r,t.search(/[*+-]/g)>-1?"ul":"ol",!0)}):e.replace(/(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,function(e,r,t,a){return o(t,a.search(/[*+-]/g)>-1?"ul":"ol",!1)}),e=e.replace(/¨0/,""),e=t.converter._dispatch("lists.after",e,r,t)}),a.subParser("metadata",function(e,r,t){"use strict";function a(e){t.metadata.raw=e,(e=(e=e.replace(/&/g,"&amp;").replace(/"/g,"&quot;")).replace(/\n {4}/g," ")).replace(/^([\S ]+): +([\s\S]+?)$/gm,function(e,r,a){return t.metadata.parsed[r]=a,""})}return r.metadata?(e=t.converter._dispatch("metadata.before",e,r,t),e=e.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/,function(e,r,t){return a(t),"¨M"}),e=e.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/,function(e,r,n){return r&&(t.metadata.format=r),a(n),"¨M"}),e=e.replace(/¨M/g,""),e=t.converter._dispatch("metadata.after",e,r,t)):e}),a.subParser("outdent",function(e,r,t){"use strict";return e=t.converter._dispatch("outdent.before",e,r,t),e=e.replace(/^(\t|[ ]{1,4})/gm,"¨0"),e=e.replace(/¨0/g,""),e=t.converter._dispatch("outdent.after",e,r,t)}),a.subParser("paragraphs",function(e,r,t){"use strict";for(var n=(e=(e=(e=t.converter._dispatch("paragraphs.before",e,r,t)).replace(/^\n+/g,"")).replace(/\n+$/g,"")).split(/\n{2,}/g),s=[],o=n.length,i=0;i<o;i++){var l=n[i];l.search(/¨(K|G)(\d+)\1/g)>=0?s.push(l):l.search(/\S/)>=0&&(l=(l=a.subParser("spanGamut")(l,r,t)).replace(/^([ \t]*)/g,"<p>"),l+="</p>",s.push(l))}for(o=s.length,i=0;i<o;i++){for(var c="",u=s[i],d=!1;/¨(K|G)(\d+)\1/.test(u);){var p=RegExp.$1,h=RegExp.$2;c=(c="K"===p?t.gHtmlBlocks[h]:d?a.subParser("encodeCode")(t.ghCodeBlocks[h].text,r,t):t.ghCodeBlocks[h].codeblock).replace(/\$/g,"$$$$"),u=u.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/,c),/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(u)&&(d=!0)}s[i]=u}return e=s.join("\n"),e=e.replace(/^\n+/g,""),e=e.replace(/\n+$/g,""),t.converter._dispatch("paragraphs.after",e,r,t)}),a.subParser("runExtension",function(e,r,t,a){"use strict";if(e.filter)r=e.filter(r,a.converter,t);else if(e.regex){var n=e.regex;n instanceof RegExp||(n=new RegExp(n,"g")),r=r.replace(n,e.replace)}return r}),a.subParser("spanGamut",function(e,r,t){"use strict";return e=t.converter._dispatch("spanGamut.before",e,r,t),e=a.subParser("codeSpans")(e,r,t),e=a.subParser("escapeSpecialCharsWithinTagAttributes")(e,r,t),e=a.subParser("encodeBackslashEscapes")(e,r,t),e=a.subParser("images")(e,r,t),e=a.subParser("anchors")(e,r,t),e=a.subParser("autoLinks")(e,r,t),e=a.subParser("simplifiedAutoLinks")(e,r,t),e=a.subParser("emoji")(e,r,t),e=a.subParser("underline")(e,r,t),e=a.subParser("italicsAndBold")(e,r,t),e=a.subParser("strikethrough")(e,r,t),e=a.subParser("ellipsis")(e,r,t),e=a.subParser("hashHTMLSpans")(e,r,t),e=a.subParser("encodeAmpsAndAngles")(e,r,t),r.simpleLineBreaks?/\n\n¨K/.test(e)||(e=e.replace(/\n+/g,"<br />\n")):e=e.replace(/  +\n/g,"<br />\n"),e=t.converter._dispatch("spanGamut.after",e,r,t)}),a.subParser("strikethrough",function(e,r,t){"use strict";return r.strikethrough&&(e=(e=t.converter._dispatch("strikethrough.before",e,r,t)).replace(/(?:~){2}([\s\S]+?)(?:~){2}/g,function(e,n){return function(e){return r.simplifiedAutoLink&&(e=a.subParser("simplifiedAutoLinks")(e,r,t)),"<del>"+e+"</del>"}(n)}),e=t.converter._dispatch("strikethrough.after",e,r,t)),e}),a.subParser("stripLinkDefinitions",function(e,r,t){"use strict";var n=function(e,n,s,o,i,l,c){return n=n.toLowerCase(),s.match(/^data:.+?\/.+?;base64,/)?t.gUrls[n]=s.replace(/\s/g,""):t.gUrls[n]=a.subParser("encodeAmpsAndAngles")(s,r,t),l?l+c:(c&&(t.gTitles[n]=c.replace(/"|'/g,"&quot;")),r.parseImgDimensions&&o&&i&&(t.gDimensions[n]={width:o,height:i}),"")};return e=(e+="¨0").replace(/^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm,n),e=e.replace(/^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm,n),e=e.replace(/¨0/,"")}),a.subParser("tables",function(e,r,t){"use strict";function n(e){return/^:[ \t]*--*$/.test(e)?' style="text-align:left;"':/^--*[ \t]*:[ \t]*$/.test(e)?' style="text-align:right;"':/^:[ \t]*--*[ \t]*:$/.test(e)?' style="text-align:center;"':""}function s(e,n){var s="";return e=e.trim(),(r.tablesHeaderId||r.tableHeaderId)&&(s=' id="'+e.replace(/ /g,"_").toLowerCase()+'"'),e=a.subParser("spanGamut")(e,r,t),"<th"+s+n+">"+e+"</th>\n"}function o(e,n){return"<td"+n+">"+a.subParser("spanGamut")(e,r,t)+"</td>\n"}function i(e){var i,l=e.split("\n");for(i=0;i<l.length;++i)/^ {0,3}\|/.test(l[i])&&(l[i]=l[i].replace(/^ {0,3}\|/,"")),/\|[ \t]*$/.test(l[i])&&(l[i]=l[i].replace(/\|[ \t]*$/,"")),l[i]=a.subParser("codeSpans")(l[i],r,t);var c=l[0].split("|").map(function(e){return e.trim()}),u=l[1].split("|").map(function(e){return e.trim()}),d=[],p=[],h=[],_=[];for(l.shift(),l.shift(),i=0;i<l.length;++i)""!==l[i].trim()&&d.push(l[i].split("|").map(function(e){return e.trim()}));if(c.length<u.length)return e;for(i=0;i<u.length;++i)h.push(n(u[i]));for(i=0;i<c.length;++i)a.helper.isUndefined(h[i])&&(h[i]=""),p.push(s(c[i],h[i]));for(i=0;i<d.length;++i){for(var g=[],m=0;m<p.length;++m)a.helper.isUndefined(d[i][m]),g.push(o(d[i][m],h[m]));_.push(g)}return function(e,r){for(var t="<table>\n<thead>\n<tr>\n",a=e.length,n=0;n<a;++n)t+=e[n];for(t+="</tr>\n</thead>\n<tbody>\n",n=0;n<r.length;++n){t+="<tr>\n";for(var s=0;s<a;++s)t+=r[n][s];t+="</tr>\n"}return t+="</tbody>\n</table>\n"}(p,_)}if(!r.tables)return e;return e=t.converter._dispatch("tables.before",e,r,t),e=e.replace(/\\(\|)/g,a.helper.escapeCharactersCallback),e=e.replace(/^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm,i),e=e.replace(/^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm,i),e=t.converter._dispatch("tables.after",e,r,t)}),a.subParser("underline",function(e,r,t){"use strict";return r.underline?(e=t.converter._dispatch("underline.before",e,r,t),e=r.literalMidWordUnderscores?(e=e.replace(/\b___(\S[\s\S]*?)___\b/g,function(e,r){return"<u>"+r+"</u>"})).replace(/\b__(\S[\s\S]*?)__\b/g,function(e,r){return"<u>"+r+"</u>"}):(e=e.replace(/___(\S[\s\S]*?)___/g,function(e,r){return/\S$/.test(r)?"<u>"+r+"</u>":e})).replace(/__(\S[\s\S]*?)__/g,function(e,r){return/\S$/.test(r)?"<u>"+r+"</u>":e}),e=e.replace(/(_)/g,a.helper.escapeCharactersCallback),e=t.converter._dispatch("underline.after",e,r,t)):e}),a.subParser("unescapeSpecialChars",function(e,r,t){"use strict";return e=t.converter._dispatch("unescapeSpecialChars.before",e,r,t),e=e.replace(/¨E(\d+)E/g,function(e,r){var t=parseInt(r);return String.fromCharCode(t)}),e=t.converter._dispatch("unescapeSpecialChars.after",e,r,t)}),a.subParser("makeMarkdown.blockquote",function(e,r){"use strict";var t="";if(e.hasChildNodes())for(var n=e.childNodes,s=n.length,o=0;o<s;++o){var i=a.subParser("makeMarkdown.node")(n[o],r);""!==i&&(t+=i)}return t=t.trim(),t="> "+t.split("\n").join("\n> ")}),a.subParser("makeMarkdown.codeBlock",function(e,r){"use strict";var t=e.getAttribute("language"),a=e.getAttribute("precodenum");return"```"+t+"\n"+r.preList[a]+"\n```"}),a.subParser("makeMarkdown.codeSpan",function(e){"use strict";return"`"+e.innerHTML+"`"}),a.subParser("makeMarkdown.emphasis",function(e,r){"use strict";var t="";if(e.hasChildNodes()){t+="*";for(var n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);t+="*"}return t}),a.subParser("makeMarkdown.header",function(e,r,t){"use strict";var n=new Array(t+1).join("#"),s="";if(e.hasChildNodes()){s=n+" ";for(var o=e.childNodes,i=o.length,l=0;l<i;++l)s+=a.subParser("makeMarkdown.node")(o[l],r)}return s}),a.subParser("makeMarkdown.hr",function(){"use strict";return"---"}),a.subParser("makeMarkdown.image",function(e){"use strict";var r="";return e.hasAttribute("src")&&(r+="!["+e.getAttribute("alt")+"](",r+="<"+e.getAttribute("src")+">",e.hasAttribute("width")&&e.hasAttribute("height")&&(r+=" ="+e.getAttribute("width")+"x"+e.getAttribute("height")),e.hasAttribute("title")&&(r+=' "'+e.getAttribute("title")+'"'),r+=")"),r}),a.subParser("makeMarkdown.links",function(e,r){"use strict";var t="";if(e.hasChildNodes()&&e.hasAttribute("href")){var n=e.childNodes,s=n.length;t="[";for(var o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);t+="](",t+="<"+e.getAttribute("href")+">",e.hasAttribute("title")&&(t+=' "'+e.getAttribute("title")+'"'),t+=")"}return t}),a.subParser("makeMarkdown.list",function(e,r,t){"use strict";var n="";if(!e.hasChildNodes())return"";for(var s=e.childNodes,o=s.length,i=e.getAttribute("start")||1,l=0;l<o;++l)if(void 0!==s[l].tagName&&"li"===s[l].tagName.toLowerCase()){n+=("ol"===t?i.toString()+". ":"- ")+a.subParser("makeMarkdown.listItem")(s[l],r),++i}return(n+="\n\x3c!-- --\x3e\n").trim()}),a.subParser("makeMarkdown.listItem",function(e,r){"use strict";for(var t="",n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);return/\n$/.test(t)?t=t.split("\n").join("\n    ").replace(/^ {4}$/gm,"").replace(/\n\n+/g,"\n\n"):t+="\n",t}),a.subParser("makeMarkdown.node",function(e,r,t){"use strict";t=t||!1;var n="";if(3===e.nodeType)return a.subParser("makeMarkdown.txt")(e,r);if(8===e.nodeType)return"\x3c!--"+e.data+"--\x3e\n\n";if(1!==e.nodeType)return"";switch(e.tagName.toLowerCase()){case"h1":t||(n=a.subParser("makeMarkdown.header")(e,r,1)+"\n\n");break;case"h2":t||(n=a.subParser("makeMarkdown.header")(e,r,2)+"\n\n");break;case"h3":t||(n=a.subParser("makeMarkdown.header")(e,r,3)+"\n\n");break;case"h4":t||(n=a.subParser("makeMarkdown.header")(e,r,4)+"\n\n");break;case"h5":t||(n=a.subParser("makeMarkdown.header")(e,r,5)+"\n\n");break;case"h6":t||(n=a.subParser("makeMarkdown.header")(e,r,6)+"\n\n");break;case"p":t||(n=a.subParser("makeMarkdown.paragraph")(e,r)+"\n\n");break;case"blockquote":t||(n=a.subParser("makeMarkdown.blockquote")(e,r)+"\n\n");break;case"hr":t||(n=a.subParser("makeMarkdown.hr")(e,r)+"\n\n");break;case"ol":t||(n=a.subParser("makeMarkdown.list")(e,r,"ol")+"\n\n");break;case"ul":t||(n=a.subParser("makeMarkdown.list")(e,r,"ul")+"\n\n");break;case"precode":t||(n=a.subParser("makeMarkdown.codeBlock")(e,r)+"\n\n");break;case"pre":t||(n=a.subParser("makeMarkdown.pre")(e,r)+"\n\n");break;case"table":t||(n=a.subParser("makeMarkdown.table")(e,r)+"\n\n");break;case"code":n=a.subParser("makeMarkdown.codeSpan")(e,r);break;case"em":case"i":n=a.subParser("makeMarkdown.emphasis")(e,r);break;case"strong":case"b":n=a.subParser("makeMarkdown.strong")(e,r);break;case"del":n=a.subParser("makeMarkdown.strikethrough")(e,r);break;case"a":n=a.subParser("makeMarkdown.links")(e,r);break;case"img":n=a.subParser("makeMarkdown.image")(e,r);break;default:n=e.outerHTML+"\n\n"}return n}),a.subParser("makeMarkdown.paragraph",function(e,r){"use strict";var t="";if(e.hasChildNodes())for(var n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);return t=t.trim()}),a.subParser("makeMarkdown.pre",function(e,r){"use strict";var t=e.getAttribute("prenum");return"<pre>"+r.preList[t]+"</pre>"}),a.subParser("makeMarkdown.strikethrough",function(e,r){"use strict";var t="";if(e.hasChildNodes()){t+="~~";for(var n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);t+="~~"}return t}),a.subParser("makeMarkdown.strong",function(e,r){"use strict";var t="";if(e.hasChildNodes()){t+="**";for(var n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r);t+="**"}return t}),a.subParser("makeMarkdown.table",function(e,r){"use strict";var t,n,s="",o=[[],[]],i=e.querySelectorAll("thead>tr>th"),l=e.querySelectorAll("tbody>tr");for(t=0;t<i.length;++t){var c=a.subParser("makeMarkdown.tableCell")(i[t],r),u="---";if(i[t].hasAttribute("style")){switch(i[t].getAttribute("style").toLowerCase().replace(/\s/g,"")){case"text-align:left;":u=":---";break;case"text-align:right;":u="---:";break;case"text-align:center;":u=":---:"}}o[0][t]=c.trim(),o[1][t]=u}for(t=0;t<l.length;++t){var d=o.push([])-1,p=l[t].getElementsByTagName("td");for(n=0;n<i.length;++n){var h=" ";void 0!==p[n]&&(h=a.subParser("makeMarkdown.tableCell")(p[n],r)),o[d].push(h)}}var _=3;for(t=0;t<o.length;++t)for(n=0;n<o[t].length;++n){var g=o[t][n].length;g>_&&(_=g)}for(t=0;t<o.length;++t){for(n=0;n<o[t].length;++n)1===t?":"===o[t][n].slice(-1)?o[t][n]=a.helper.padEnd(o[t][n].slice(-1),_-1,"-")+":":o[t][n]=a.helper.padEnd(o[t][n],_,"-"):o[t][n]=a.helper.padEnd(o[t][n],_);s+="| "+o[t].join(" | ")+" |\n"}return s.trim()}),a.subParser("makeMarkdown.tableCell",function(e,r){"use strict";var t="";if(!e.hasChildNodes())return"";for(var n=e.childNodes,s=n.length,o=0;o<s;++o)t+=a.subParser("makeMarkdown.node")(n[o],r,!0);return t.trim()}),a.subParser("makeMarkdown.txt",function(e){"use strict";var r=e.nodeValue;return r=r.replace(/ +/g," "),r=r.replace(/¨NBSP;/g," "),r=a.helper.unescapeHTMLEntities(r),r=r.replace(/([*_~|`])/g,"\\$1"),r=r.replace(/^(\s*)>/g,"\\$1>"),r=r.replace(/^#/gm,"\\#"),r=r.replace(/^(\s*)([-=]{3,})(\s*)$/,"$1\\$2$3"),r=r.replace(/^( {0,3}\d+)\./gm,"$1\\."),r=r.replace(/^( {0,3})([+-])/gm,"$1\\$2"),r=r.replace(/]([\s]*)\(/g,"\\]$1\\("),r=r.replace(/^ {0,3}\[([\S \t]*?)]:/gm,"\\[$1]:")});"function"==typeof define&&define.amd?define(function(){"use strict";return a}):"undefined"!=typeof module&&module.exports?module.exports=a:this.showdown=a}).call(this);

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.DOMPurify=t()}(this,function(){"use strict";function e(e,t){y&&y(e,null);for(var n=t.length;n--;){var r=t[n];if("string"==typeof r){var o=r.toLowerCase();o!==r&&(Object.isFrozen(t)||(t[n]=o),r=o)}e[r]=!0}return e}function t(e){var t={},n=void 0;for(n in e)g(h,e,[n])&&(t[n]=e[n]);return t}function n(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O(),u=function(e){return r(e)};if(u.version="2.0.7",u.removed=[],!o||!o.document||9!==o.document.nodeType)return u.isSupported=!1,u;var h=o.document,y=!1,g=!1,v=o.document,R=o.DocumentFragment,D=o.HTMLTemplateElement,C=o.Node,H=o.NodeFilter,F=o.NamedNodeMap,z=void 0===F?o.NamedNodeMap||o.MozNamedAttrMap:F,I=o.Text,j=o.Comment,U=o.DOMParser,P=o.TrustedTypes;if("function"==typeof D){var W=v.createElement("template");W.content&&W.content.ownerDocument&&(v=W.content.ownerDocument)}var B=N(P,h),q=B?B.createHTML(""):"",G=v,V=G.implementation,Y=G.createNodeIterator,K=G.getElementsByTagName,X=G.createDocumentFragment,$=h.importNode,J={};u.isSupported=V&&void 0!==V.createHTMLDocument&&9!==v.documentMode;var Q=b,Z=T,ee=A,te=x,ne=L,re=E,oe=S,ie=null,ae=e({},[].concat(n(i),n(a),n(l),n(s),n(c))),le=null,se=e({},[].concat(n(d),n(f),n(m),n(p))),ce=null,ue=null,de=!0,fe=!0,me=!1,pe=!1,he=!1,ye=!1,ge=!1,ve=!1,be=!1,Te=!1,Ae=!1,xe=!1,Se=!0,Le=!0,Ee=!1,Me={},ke=e({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","plaintext","script","style","svg","template","thead","title","video","xmp"]),we=e({},["audio","video","img","source","image"]),_e=null,Oe=e({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),Ne=null,Re=v.createElement("form"),De=function(r){Ne&&Ne===r||(r&&"object"===(void 0===r?"undefined":M(r))||(r={}),ie="ALLOWED_TAGS"in r?e({},r.ALLOWED_TAGS):ae,le="ALLOWED_ATTR"in r?e({},r.ALLOWED_ATTR):se,_e="ADD_URI_SAFE_ATTR"in r?e(t(Oe),r.ADD_URI_SAFE_ATTR):Oe,ce="FORBID_TAGS"in r?e({},r.FORBID_TAGS):{},ue="FORBID_ATTR"in r?e({},r.FORBID_ATTR):{},Me="USE_PROFILES"in r&&r.USE_PROFILES,de=!1!==r.ALLOW_ARIA_ATTR,fe=!1!==r.ALLOW_DATA_ATTR,me=r.ALLOW_UNKNOWN_PROTOCOLS||!1,pe=r.SAFE_FOR_JQUERY||!1,he=r.SAFE_FOR_TEMPLATES||!1,ye=r.WHOLE_DOCUMENT||!1,be=r.RETURN_DOM||!1,Te=r.RETURN_DOM_FRAGMENT||!1,Ae=r.RETURN_DOM_IMPORT||!1,xe=r.RETURN_TRUSTED_TYPE||!1,ve=r.FORCE_BODY||!1,Se=!1!==r.SANITIZE_DOM,Le=!1!==r.KEEP_CONTENT,Ee=r.IN_PLACE||!1,oe=r.ALLOWED_URI_REGEXP||oe,he&&(fe=!1),Te&&(be=!0),Me&&(ie=e({},[].concat(n(c))),le=[],!0===Me.html&&(e(ie,i),e(le,d)),!0===Me.svg&&(e(ie,a),e(le,f),e(le,p)),!0===Me.svgFilters&&(e(ie,l),e(le,f),e(le,p)),!0===Me.mathMl&&(e(ie,s),e(le,m),e(le,p))),r.ADD_TAGS&&(ie===ae&&(ie=t(ie)),e(ie,r.ADD_TAGS)),r.ADD_ATTR&&(le===se&&(le=t(le)),e(le,r.ADD_ATTR)),r.ADD_URI_SAFE_ATTR&&e(_e,r.ADD_URI_SAFE_ATTR),Le&&(ie["#text"]=!0),ye&&e(ie,["html","head","body"]),ie.table&&(e(ie,["tbody"]),delete ce.tbody),_&&_(r),Ne=r)},Ce=function(e){u.removed.push({element:e});try{e.parentNode.removeChild(e)}catch(t){e.outerHTML=q}},He=function(e,t){try{u.removed.push({attribute:t.getAttributeNode(e),from:t})}catch(e){u.removed.push({attribute:null,from:t})}t.removeAttribute(e)},Fe=function(t){var n=void 0,r=void 0;if(ve)t="<remove></remove>"+t;else{var o=t.match(/^[\s]+/);r=o&&o[0]}if(y)try{n=(new U).parseFromString(t,"text/html")}catch(e){}if(g&&e(ce,["title"]),!n||!n.documentElement){var i=(n=V.createHTMLDocument("")).body;i.parentNode.removeChild(i.parentNode.firstElementChild),i.outerHTML=B?B.createHTML(t):t}return t&&r&&n.body.insertBefore(v.createTextNode(r),n.body.childNodes[0]||null),K.call(n,ye?"html":"body")[0]};u.isSupported&&(function(){try{Fe('<svg><p><textarea><img src="</textarea><img src=x abc=1//">').querySelector("svg img")&&(y=!0)}catch(e){}}(),function(){try{var e=Fe("<x/><title>&lt;/title&gt;&lt;img&gt;");/<\/title/.test(e.querySelector("title").innerHTML)&&(g=!0)}catch(e){}}());var ze=function(e){return Y.call(e.ownerDocument||e,e,H.SHOW_ELEMENT|H.SHOW_COMMENT|H.SHOW_TEXT,function(){return H.FILTER_ACCEPT},!1)},Ie=function(e){return!(e instanceof I||e instanceof j)&&!("string"==typeof e.nodeName&&"string"==typeof e.textContent&&"function"==typeof e.removeChild&&e.attributes instanceof z&&"function"==typeof e.removeAttribute&&"function"==typeof e.setAttribute&&"string"==typeof e.namespaceURI)},je=function(e){return"object"===(void 0===C?"undefined":M(C))?e instanceof C:e&&"object"===(void 0===e?"undefined":M(e))&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},Ue=function(e,t,n){J[e]&&J[e].forEach(function(e){e.call(u,t,n,Ne)})},Pe=function(e){var t=void 0;if(Ue("beforeSanitizeElements",e,null),Ie(e))return Ce(e),!0;var n=e.nodeName.toLowerCase();if(Ue("uponSanitizeElement",e,{tagName:n,allowedTags:ie}),("svg"===n||"math"===n)&&0!==e.querySelectorAll("p, br").length)return Ce(e),!0;if(!ie[n]||ce[n]){if(Le&&!ke[n]&&"function"==typeof e.insertAdjacentHTML)try{var r=e.innerHTML;e.insertAdjacentHTML("AfterEnd",B?B.createHTML(r):r)}catch(e){}return Ce(e),!0}return"noscript"===n&&/<\/noscript/i.test(e.innerHTML)?(Ce(e),!0):"noembed"===n&&/<\/noembed/i.test(e.innerHTML)?(Ce(e),!0):(!pe||e.firstElementChild||e.content&&e.content.firstElementChild||!/</g.test(e.textContent)||(u.removed.push({element:e.cloneNode()}),e.innerHTML?e.innerHTML=e.innerHTML.replace(/</g,"&lt;"):e.innerHTML=e.textContent.replace(/</g,"&lt;")),he&&3===e.nodeType&&(t=(t=(t=e.textContent).replace(Q," ")).replace(Z," "),e.textContent!==t&&(u.removed.push({element:e.cloneNode()}),e.textContent=t)),Ue("afterSanitizeElements",e,null),!1)},We=function(e,t,n){if(Se&&("id"===t||"name"===t)&&(n in v||n in Re))return!1;if(fe&&ee.test(t));else if(de&&te.test(t));else{if(!le[t]||ue[t])return!1;if(_e[t]);else if(oe.test(n.replace(re,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==n.indexOf("data:")||!we[e]){if(me&&!ne.test(n.replace(re,"")));else if(n)return!1}else;}return!0},Be=function(e){var t=void 0,n=void 0,r=void 0,o=void 0,i=void 0;Ue("beforeSanitizeAttributes",e,null);var a=e.attributes;if(a){var l={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:le};for(i=a.length;i--;){var s=t=a[i],c=s.name,d=s.namespaceURI;if(n=t.value.trim(),r=c.toLowerCase(),l.attrName=r,l.attrValue=n,l.keepAttr=!0,Ue("uponSanitizeAttribute",e,l),n=l.attrValue,"name"===r&&"IMG"===e.nodeName&&a.id)o=a.id,a=k(w,a,[]),He("id",e),He(c,e),a.indexOf(o)>i&&e.setAttribute("id",o.value);else{if("INPUT"===e.nodeName&&"type"===r&&"file"===n&&l.keepAttr&&(le[r]||!ue[r]))continue;"id"===c&&e.setAttribute(c,""),He(c,e)}if(l.keepAttr)if(/svg|math/i.test(e.namespaceURI)&&new RegExp("</("+Object.keys(ke).join("|")+")","i").test(n))He(c,e);else{he&&(n=(n=n.replace(Q," ")).replace(Z," "));var f=e.nodeName.toLowerCase();if(We(f,r,n))try{d?e.setAttributeNS(d,c,n):e.setAttribute(c,n),u.removed.pop()}catch(e){}}}Ue("afterSanitizeAttributes",e,null)}},qe=function e(t){var n=void 0,r=ze(t);for(Ue("beforeSanitizeShadowDOM",t,null);n=r.nextNode();)Ue("uponSanitizeShadowNode",n,null),Pe(n)||(n.content instanceof R&&e(n.content),Be(n));Ue("afterSanitizeShadowDOM",t,null)};return u.sanitize=function(e,t){var n=void 0,r=void 0,i=void 0,a=void 0,l=void 0;if(e||(e="\x3c!--\x3e"),"string"!=typeof e&&!je(e)){if("function"!=typeof e.toString)throw new TypeError("toString is not a function");if("string"!=typeof(e=e.toString()))throw new TypeError("dirty is not a string, aborting")}if(!u.isSupported){if("object"===M(o.toStaticHTML)||"function"==typeof o.toStaticHTML){if("string"==typeof e)return o.toStaticHTML(e);if(je(e))return o.toStaticHTML(e.outerHTML)}return e}if(ge||De(t),u.removed=[],Ee);else if(e instanceof C)1===(r=(n=Fe("\x3c!--\x3e")).ownerDocument.importNode(e,!0)).nodeType&&"BODY"===r.nodeName?n=r:"HTML"===r.nodeName?n=r:n.appendChild(r);else{if(!be&&!he&&!ye&&xe&&-1===e.indexOf("<"))return B?B.createHTML(e):e;if(!(n=Fe(e)))return be?null:q}n&&ve&&Ce(n.firstChild);for(var s=ze(Ee?e:n);i=s.nextNode();)3===i.nodeType&&i===a||Pe(i)||(i.content instanceof R&&qe(i.content),Be(i),a=i);if(a=null,Ee)return e;if(be){if(Te)for(l=X.call(n.ownerDocument);n.firstChild;)l.appendChild(n.firstChild);else l=n;return Ae&&(l=$.call(h,l,!0)),l}var c=ye?n.outerHTML:n.innerHTML;return he&&(c=(c=c.replace(Q," ")).replace(Z," ")),B&&xe?B.createHTML(c):c},u.setConfig=function(e){De(e),ge=!0},u.clearConfig=function(){Ne=null,ge=!1},u.isValidAttribute=function(e,t,n){Ne||De({});var r=e.toLowerCase(),o=t.toLowerCase();return We(r,o,n)},u.addHook=function(e,t){"function"==typeof t&&(J[e]=J[e]||[],J[e].push(t))},u.removeHook=function(e){J[e]&&J[e].pop()},u.removeHooks=function(e){J[e]&&(J[e]=[])},u.removeAllHooks=function(){J={}},u}var o=Object.freeze||function(e){return e},i=o(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),a=o(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","audio","canvas","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","video","view","vkern"]),l=o(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),s=o(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),c=o(["#text"]),u=Object.freeze||function(e){return e},d=u(["accept","action","align","alt","autocomplete","background","bgcolor","border","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","coords","crossorigin","datetime","default","dir","disabled","download","enctype","face","for","headers","height","hidden","high","href","hreflang","id","integrity","ismap","label","lang","list","loop","low","max","maxlength","media","method","min","minlength","multiple","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","type","usemap","valign","value","width","xmlns"]),f=u(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","tabindex","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),m=u(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),p=u(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),h=Object.hasOwnProperty,y=Object.setPrototypeOf,g=("undefined"!=typeof Reflect&&Reflect).apply;g||(g=function(e,t,n){return e.apply(t,n)});var v=Object.seal||function(e){return e},b=v(/\{\{[\s\S]*|[\s\S]*\}\}/gm),T=v(/<%[\s\S]*|[\s\S]*%>/gm),A=v(/^data-[\-\w.\u00B7-\uFFFF]/),x=v(/^aria-[\-\w]+$/),S=v(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),L=v(/^(?:\w+script|data):/i),E=v(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g),M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},k=("undefined"!=typeof Reflect&&Reflect).apply,w=Array.prototype.slice,_=Object.freeze,O=function(){return"undefined"==typeof window?null:window};k||(k=function(e,t,n){return e.apply(t,n)});var N=function(e,t){if("object"!==(void 0===e?"undefined":M(e))||"function"!=typeof e.createPolicy)return null;var n=null;t.currentScript&&t.currentScript.hasAttribute("data-tt-policy-suffix")&&(n=t.currentScript.getAttribute("data-tt-policy-suffix"));var r="dompurify"+(n?"#"+n:"");try{return e.createPolicy(r,{createHTML:function(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+r+" could not be created."),null}};return r()});
// Jdenticon 3.0.1 | jdenticon.com | MIT licensed | (c) 2014-2020 Daniel Mester Pirttijärvi
(function(y,B){var v=B(y);"undefined"!==typeof module&&"exports"in module?module.exports=v:"function"===typeof define&&define.amd?define([],function(){return v}):y.jdenticon=v})("undefined"!==typeof self?self:this,function(y){function B(a){var b=this.h=Math.min(Number(a.getAttribute("width"))||100,Number(a.getAttribute("height"))||100);for(this.a=a;a.firstChild;)a.removeChild(a.firstChild);a.setAttribute("viewBox","0 0 "+b+" "+b);a.setAttribute("preserveAspectRatio","xMidYMid meet")}function v(a){this.h=
a;this.a='<svg xmlns="http://www.w3.org/2000/svg" width="'+a+'" height="'+a+'" viewBox="0 0 '+a+" "+a+'">'}function w(a){this.a={};this.g=a;this.h=a.h}function K(){this.i=""}function x(a,b){var c=a.canvas.width,d=a.canvas.height;a.save();b||(b=Math.min(c,d),a.translate((c-b)/2|0,(d-b)/2|0));this.a=a;this.h=b;a.clearRect(0,0,b,b)}function z(a){this.j=a;this.g=ca}function L(a,b,c,d){this.a=a;this.b=b;this.g=c;this.m=d}function E(a,b){this.x=a;this.y=b}function t(a,b,c){return parseInt(a.substr(b,c),
16)}function V(a){a|=0;return 0>a?"00":16>a?"0"+a.toString(16):256>a?a.toString(16):"ff"}function M(a,b,c){c=0>c?c+6:6<c?c-6:c;return V(255*(1>c?a+(b-a)*c:3>c?b:4>c?a+(b-a)*(4-c):a))}function da(a){if(/^#[0-9a-f]{3,8}$/i.test(a)){if(6>a.length){var b=a[1];var c=a[2],d=a[3],e=a[4]||"";b="#"+b+b+c+c+d+d+e+e}if(7==a.length||8<a.length)b=a;return b}}function W(a){var b=t(a,7,2);if(isNaN(b))b=a;else{var c=t(a,1,2),d=t(a,3,2);a=t(a,5,2);b="rgba("+c+","+d+","+a+","+(b/255).toFixed(2)+")"}return b}function C(a,
b,c){var d=[.55,.5,.5,.46,.6,.55,.55][6*a+.5|0];c=.5>c?c*d*2:d+(c-.5)*(1-d)*2;0==b?(a=V(255*c),a=a+a+a):(b=.5>=c?c*(b+1):c+b-c*b,c=2*c-b,a=M(c,b,6*a+2)+M(c,b,6*a)+M(c,b,6*a-2));return"#"+a}function ea(a,b){function c(k,m){var n=e[k];n&&1<n.length||(n=m);return function(p){p=n[0]+p*(n[1]-n[0]);return 0>p?0:1<p?1:p}}var d="object"==typeof a&&a||F[N]||O.jdenticon_config||{},e=d.lightness||{},f=d.saturation||{},g="color"in f?f.color:f;f=f.grayscale;var l=d.backColor,h=d.padding;return{C:function(k){var m=
d.hues,n;m&&0<m.length&&(n=m[0|.999*k*m.length]);return"number"==typeof n?(n/360%1+1)%1:k},s:"number"==typeof g?g:.5,B:"number"==typeof f?f:0,o:c("color",[.4,.8]),A:c("grayscale",[.3,.9]),u:da(l),D:"number"==typeof a?a:"number"==typeof h?h:b}}function P(a){if(a){var b=a.tagName;if(/^svg$/i.test(b))return 1;if(/^canvas$/i.test(b)&&"getContext"in a)return 2}}function fa(a){"undefined"!=typeof MutationObserver&&(new MutationObserver(function(b){for(var c=0;c<b.length;c++){for(var d=b[c],e=d.addedNodes,
f=0;e&&f<e.length;f++){var g=e[f];if(1==g.nodeType)if(P(g))a(g);else{g=g.querySelectorAll(X);for(var l=0;l<g.length;l++)a(g[l])}}"attributes"==d.type&&P(d.target)&&a(d.target)}})).observe(document.body,{childList:!0,attributes:!0,attributeFilter:[G,Q,"width","height"],subtree:!0})}function ha(a,b,c,d){a%=14;var e,f,g,l,h,k;a?1==a?(g=0|.5*c,l=0|.8*c,b.b(c-g,0,g,l,2)):2==a?(g=0|c/3,b.a(g,g,c-g,c-g)):3==a?(h=.1*c,k=6>c?1:8>c?2:0|.25*c,h=1<h?0|h:.5<h?1:h,b.a(k,k,c-h-k,c-h-k)):4==a?(f=0|.15*c,g=0|.5*c,
b.f(c-g-f,c-g-f,g)):5==a?(h=.1*c,k=4*h,3<k&&(k|=0),b.a(0,0,c,c),b.c([k,k,c-h,k,k+(c-k-h)/2,c-h],!0)):6==a?b.c([0,0,c,0,c,.7*c,.4*c,.4*c,.7*c,c,0,c]):7==a?b.b(c/2,c/2,c/2,c/2,3):8==a?(b.a(0,0,c,c/2),b.a(0,c/2,c/2,c/2),b.b(c/2,c/2,c/2,c/2,1)):9==a?(h=.14*c,k=4>c?1:6>c?2:0|.35*c,h=8>c?h:0|h,b.a(0,0,c,c),b.a(k,k,c-k-h,c-k-h,!0)):10==a?(h=.12*c,k=3*h,b.a(0,0,c,c),b.f(k,k,c-h-k,!0)):11==a?b.b(c/2,c/2,c/2,c/2,3):12==a?(f=.25*c,b.a(0,0,c,c),b.m(f,f,c-f,c-f,!0)):!d&&(f=.4*c,g=1.2*c,b.f(f,f,g)):(e=.42*c,b.c([0,
0,c,0,c,c-2*e,c-e,c,0,c]))}function Y(a,b,c){a%=4;var d;a?1==a?b.b(0,c/2,c,c/2,0):2==a?b.m(0,0,c,c):(d=c/6,b.f(d,d,c-2*d)):b.b(0,0,c,c,0)}function ia(a,b){a=b.C(a);return[C(a,b.B,b.A(0)),C(a,b.s,b.o(.5)),C(a,b.B,b.A(1)),C(a,b.s,b.o(1)),C(a,b.s,b.o(0))]}function R(a,b,c){function d(q,D,S,H,T){S=t(b,S,1);H=H?t(b,H,1):0;a.v(n[p[q]]);for(q=0;q<T.length;q++)l.g=new L(k+T[q][0]*h,m+T[q][1]*h,h,H++%4),D(S,l,h,q);a.w()}function e(q){if(0<=q.indexOf(u))for(var D=0;D<q.length;D++)if(0<=p.indexOf(q[D]))return!0}
c=ea(c,.08);c.u&&a.l(c.u);var f=a.h,g=.5+f*c.D|0;f-=2*g;var l=new z(a),h=0|f/4,k=0|g+f/2-2*h,m=0|g+f/2-2*h;f=t(b,-7)/268435455;var n=ia(f,c),p=[];for(c=0;3>c;c++){var u=t(b,8+c,1)%n.length;if(e([0,4])||e([2,3]))u=1;p.push(u)}d(0,Y,2,3,[[1,0],[2,0],[2,3],[1,3],[0,1],[3,1],[3,2],[0,2]]);d(1,Y,4,5,[[0,0],[3,0],[3,3],[0,3]]);d(2,ha,1,null,[[1,1],[2,1],[2,2],[1,2]]);a.finish()}function I(a){return/^[0-9a-f]{11,}$/i.test(a)&&a}function J(a){var b=0,c=0,d=encodeURI(null==a?"":""+a)+"%80";a=[];for(var e=
[],f=1732584193,g=4023233417,l=~f,h=~g,k=3285377520,m=[f,g,l,h,k],n=0,p="";b<d.length;c++)a[c>>2]|=("%"==d[b]?parseInt(d.substring(b+1,b+=3),16):d.charCodeAt(b++))<<8*(3-(c&3));d=16*((c+7>>6)+1);for(a[d-1]=8*c-8;n<d;n+=16){for(b=0;80>b;b++){c=(f<<5|f>>>27)+k+(20>b?(g&l^~g&h)+1518500249:40>b?(g^l^h)+1859775393:60>b?(g&l^g&h^l&h)+2400959708:(g^l^h)+3395469782);k=b;if(16>b)var u=a[n+b]|0;else u=e[b-3]^e[b-8]^e[b-14]^e[b-16],u=u<<1|u>>>31;c+=e[k]=u;k=h;h=l;l=g<<30|g>>>2;g=f;f=c}m[0]=f=m[0]+f|0;m[1]=g=
m[1]+g|0;m[2]=l=m[2]+l|0;m[3]=h=m[3]+h|0;m[4]=k=m[4]+k|0}for(b=0;40>b;b++)p+=(m[b>>3]>>>4*(7-(b&7))&15).toString(16);return p}function Z(a,b,c){for(var d=[],e=2;e<arguments.length;++e)d[e-2]=arguments[e];e=document.createElementNS("http://www.w3.org/2000/svg",b);for(var f=0;f+1<d.length;f+=2)e.setAttribute(d[f],d[f+1]);a.appendChild(e)}function aa(){U&&A(X)}function A(a,b,c){ba(a,b,c,function(d,e){if(e)return 1==e?new w(new B(d)):new x(d.getContext("2d"))})}function ba(a,b,c,d){if("string"===typeof a){if(U){a=
U(a);for(var e=0;e<a.length;e++)ba(a[e],b,c,d)}}else(b=I(b)||null!=b&&J(b)||I(a.getAttribute(Q))||a.hasAttribute(G)&&J(a.getAttribute(G)))&&(d=d(a,P(a)))&&R(d,b,c)}function ja(a,b){this.each(function(c,d){A(d,a,b)});return this}function ka(){var a=(r.config||O.jdenticon_config||{}).replaceMode;"never"!=a&&(aa(),"observe"==a&&fa(A))}var O=y,N="config",F={},Q="data-jdenticon-hash",G="data-jdenticon-value",X="["+Q+"],["+G+"]",U="undefined"!==typeof document&&document.querySelectorAll.bind(document);
L.prototype.j=function(a,b,c,d){var e=this.a+this.g,f=this.b+this.g,g=this.m;return 1===g?new E(e-b-(d||0),this.b+a):2===g?new E(e-a-(c||0),f-b-(d||0)):3===g?new E(this.a+b,f-a-(c||0)):new E(this.a+a,this.b+b)};var ca=new L(0,0,0,0);z.prototype.c=function(a,b){var c=b?-2:2,d=this.g,e=[];for(b=b?a.length-2:0;b<a.length&&0<=b;b+=c)e.push(d.j(a[b],a[b+1]));this.j.c(e)};z.prototype.f=function(a,b,c,d){a=this.g.j(a,b,c,c);this.j.f(a,c,d)};z.prototype.a=function(a,b,c,d,e){this.c([a,b,a+c,b,a+c,b+d,a,b+
d],e)};z.prototype.b=function(a,b,c,d,e){a=[a+c,b,a+c,b+d,a,b+d,a,b];a.splice((e||0)%4*2,2);this.c(a,void 0)};z.prototype.m=function(a,b,c,d,e){this.c([a+c/2,b,a+c,b+d/2,a+c/2,b+d,a,b+d/2],e)};x.prototype.l=function(a){var b=this.a,c=this.h;b.fillStyle=W(a);b.fillRect(0,0,c,c)};x.prototype.v=function(a){var b=this.a;b.fillStyle=W(a);b.beginPath()};x.prototype.w=function(){this.a.fill()};x.prototype.c=function(a){var b=this.a;b.moveTo(a[0].x,a[0].y);for(var c=1;c<a.length;c++)b.lineTo(a[c].x,a[c].y);
b.closePath()};x.prototype.f=function(a,b,c){var d=this.a;b/=2;d.moveTo(a.x+b,a.y+b);d.arc(a.x+b,a.y+b,b,0,2*Math.PI,c);d.closePath()};x.prototype.finish=function(){this.a.restore()};K.prototype.c=function(a){for(var b="",c=0;c<a.length;c++)b+=(c?"L":"M")+(10*a[c].x+.5|0)/10+" "+(10*a[c].y+.5|0)/10;this.i+=b+"Z"};K.prototype.f=function(a,b,c){var d=(b/2*10+.5|0)/10,e=(10*b+.5|0)/10;c="a"+d+","+d+" 0 1,"+(c?0:1)+" ";this.i+="M"+(10*a.x+.5|0)/10+" "+(10*(a.y+b/2)+.5|0)/10+c+e+",0"+c+-e+",0"};w.prototype.l=
function(a){a=/^(#......)(..)?/.exec(a);var b=a[2]?t(a[2],0)/255:1;this.g.l(a[1],b)};w.prototype.v=function(a){this.b=this.a[a]||(this.a[a]=new K)};w.prototype.w=function(){};w.prototype.c=function(a){this.b.c(a)};w.prototype.f=function(a,b,c){this.b.f(a,b,c)};w.prototype.finish=function(){var a=this.a,b;for(b in a)a.hasOwnProperty(b)&&this.g.b(b,a[b].i)};v.prototype.l=function(a,b){b&&(this.a+='<rect width="100%" height="100%" fill="'+a+'" opacity="'+b.toFixed(2)+'"/>')};v.prototype.b=function(a,
b){this.a+='<path fill="'+a+'" d="'+b+'"/>'};v.prototype.toString=function(){return this.a+"</svg>"};B.prototype.l=function(a,b){b&&Z(this.a,"rect","width","100%","height","100%","fill",a,"opacity",b)};B.prototype.b=function(a,b){Z(this.a,"path","fill",a,"d",b)};var r=aa;F=r;r.configure=function(a){arguments.length&&(F[N]=a);return F[N]};r.drawIcon=function(a,b,c,d){if(!a)throw Error("No canvas specified.");R(new x(a,c),I(b)||J(b),d)};r.toSvg=function(a,b,c){b=new v(b);R(new w(b),I(a)||J(a),c);return b.toString()};
r.update=A;r.updateCanvas=A;r.updateSvg=A;r.version="3.0.1";r.bundle="browser-umd";(y=O.jQuery)&&(y.fn.jdenticon=ja);"function"===typeof setTimeout&&setTimeout(ka,0);return r});

/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";function t(t,i){i?(d[0]=d[16]=d[1]=d[2]=d[3]=d[4]=d[5]=d[6]=d[7]=d[8]=d[9]=d[10]=d[11]=d[12]=d[13]=d[14]=d[15]=0,this.blocks=d):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=t}function i(i,r,s){var e,n=typeof i;if("string"===n){var o,a=[],u=i.length,c=0;for(e=0;e<u;++e)(o=i.charCodeAt(e))<128?a[c++]=o:o<2048?(a[c++]=192|o>>6,a[c++]=128|63&o):o<55296||o>=57344?(a[c++]=224|o>>12,a[c++]=128|o>>6&63,a[c++]=128|63&o):(o=65536+((1023&o)<<10|1023&i.charCodeAt(++e)),a[c++]=240|o>>18,a[c++]=128|o>>12&63,a[c++]=128|o>>6&63,a[c++]=128|63&o);i=a}else{if("object"!==n)throw new Error(h);if(null===i)throw new Error(h);if(f&&i.constructor===ArrayBuffer)i=new Uint8Array(i);else if(!(Array.isArray(i)||f&&ArrayBuffer.isView(i)))throw new Error(h)}i.length>64&&(i=new t(r,!0).update(i).array());var y=[],p=[];for(e=0;e<64;++e){var l=i[e]||0;y[e]=92^l,p[e]=54^l}t.call(this,r,s),this.update(p),this.oKeyPad=y,this.inner=!0,this.sharedMemory=s}var h="input is invalid type",r="object"==typeof window,s=r?window:{};s.JS_SHA256_NO_WINDOW&&(r=!1);var e=!r&&"object"==typeof self,n=!s.JS_SHA256_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;n?s=global:e&&(s=self);var o=!s.JS_SHA256_NO_COMMON_JS&&"object"==typeof module&&module.exports,a="function"==typeof define&&define.amd,f=!s.JS_SHA256_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,u="0123456789abcdef".split(""),c=[-2147483648,8388608,32768,128],y=[24,16,8,0],p=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],l=["hex","array","digest","arrayBuffer"],d=[];!s.JS_SHA256_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),!f||!s.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return"object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var A=function(i,h){return function(r){return new t(h,!0).update(r)[i]()}},w=function(i){var h=A("hex",i);n&&(h=b(h,i)),h.create=function(){return new t(i)},h.update=function(t){return h.create().update(t)};for(var r=0;r<l.length;++r){var s=l[r];h[s]=A(s,i)}return h},b=function(t,i){var r=eval("require('crypto')"),s=eval("require('buffer').Buffer"),e=i?"sha224":"sha256",n=function(i){if("string"==typeof i)return r.createHash(e).update(i,"utf8").digest("hex");if(null===i||void 0===i)throw new Error(h);return i.constructor===ArrayBuffer&&(i=new Uint8Array(i)),Array.isArray(i)||ArrayBuffer.isView(i)||i.constructor===s?r.createHash(e).update(new s(i)).digest("hex"):t(i)};return n},v=function(t,h){return function(r,s){return new i(r,h,!0).update(s)[t]()}},_=function(t){var h=v("hex",t);h.create=function(h){return new i(h,t)},h.update=function(t,i){return h.create(t).update(i)};for(var r=0;r<l.length;++r){var s=l[r];h[s]=v(s,t)}return h};t.prototype.update=function(t){if(!this.finalized){var i,r=typeof t;if("string"!==r){if("object"!==r)throw new Error(h);if(null===t)throw new Error(h);if(f&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||f&&ArrayBuffer.isView(t)))throw new Error(h);i=!0}for(var s,e,n=0,o=t.length,a=this.blocks;n<o;){if(this.hashed&&(this.hashed=!1,a[0]=this.block,a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),i)for(e=this.start;n<o&&e<64;++n)a[e>>2]|=t[n]<<y[3&e++];else for(e=this.start;n<o&&e<64;++n)(s=t.charCodeAt(n))<128?a[e>>2]|=s<<y[3&e++]:s<2048?(a[e>>2]|=(192|s>>6)<<y[3&e++],a[e>>2]|=(128|63&s)<<y[3&e++]):s<55296||s>=57344?(a[e>>2]|=(224|s>>12)<<y[3&e++],a[e>>2]|=(128|s>>6&63)<<y[3&e++],a[e>>2]|=(128|63&s)<<y[3&e++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++n)),a[e>>2]|=(240|s>>18)<<y[3&e++],a[e>>2]|=(128|s>>12&63)<<y[3&e++],a[e>>2]|=(128|s>>6&63)<<y[3&e++],a[e>>2]|=(128|63&s)<<y[3&e++]);this.lastByteIndex=e,this.bytes+=e-this.start,e>=64?(this.block=a[16],this.start=e-64,this.hash(),this.hashed=!0):this.start=e}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,i=this.lastByteIndex;t[16]=this.block,t[i>>2]|=c[3&i],this.block=t[16],i>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,i,h,r,s,e,n,o,a,f=this.h0,u=this.h1,c=this.h2,y=this.h3,l=this.h4,d=this.h5,A=this.h6,w=this.h7,b=this.blocks;for(t=16;t<64;++t)i=((s=b[t-15])>>>7|s<<25)^(s>>>18|s<<14)^s>>>3,h=((s=b[t-2])>>>17|s<<15)^(s>>>19|s<<13)^s>>>10,b[t]=b[t-16]+i+b[t-7]+h<<0;for(a=u&c,t=0;t<64;t+=4)this.first?(this.is224?(e=300032,w=(s=b[0]-1413257819)-150054599<<0,y=s+24177077<<0):(e=704751109,w=(s=b[0]-210244248)-1521486534<<0,y=s+143694565<<0),this.first=!1):(i=(f>>>2|f<<30)^(f>>>13|f<<19)^(f>>>22|f<<10),r=(e=f&u)^f&c^a,w=y+(s=w+(h=(l>>>6|l<<26)^(l>>>11|l<<21)^(l>>>25|l<<7))+(l&d^~l&A)+p[t]+b[t])<<0,y=s+(i+r)<<0),i=(y>>>2|y<<30)^(y>>>13|y<<19)^(y>>>22|y<<10),r=(n=y&f)^y&u^e,A=c+(s=A+(h=(w>>>6|w<<26)^(w>>>11|w<<21)^(w>>>25|w<<7))+(w&l^~w&d)+p[t+1]+b[t+1])<<0,i=((c=s+(i+r)<<0)>>>2|c<<30)^(c>>>13|c<<19)^(c>>>22|c<<10),r=(o=c&y)^c&f^n,d=u+(s=d+(h=(A>>>6|A<<26)^(A>>>11|A<<21)^(A>>>25|A<<7))+(A&w^~A&l)+p[t+2]+b[t+2])<<0,i=((u=s+(i+r)<<0)>>>2|u<<30)^(u>>>13|u<<19)^(u>>>22|u<<10),r=(a=u&c)^u&y^o,l=f+(s=l+(h=(d>>>6|d<<26)^(d>>>11|d<<21)^(d>>>25|d<<7))+(d&A^~d&w)+p[t+3]+b[t+3])<<0,f=s+(i+r)<<0;this.h0=this.h0+f<<0,this.h1=this.h1+u<<0,this.h2=this.h2+c<<0,this.h3=this.h3+y<<0,this.h4=this.h4+l<<0,this.h5=this.h5+d<<0,this.h6=this.h6+A<<0,this.h7=this.h7+w<<0},t.prototype.hex=function(){this.finalize();var t=this.h0,i=this.h1,h=this.h2,r=this.h3,s=this.h4,e=this.h5,n=this.h6,o=this.h7,a=u[t>>28&15]+u[t>>24&15]+u[t>>20&15]+u[t>>16&15]+u[t>>12&15]+u[t>>8&15]+u[t>>4&15]+u[15&t]+u[i>>28&15]+u[i>>24&15]+u[i>>20&15]+u[i>>16&15]+u[i>>12&15]+u[i>>8&15]+u[i>>4&15]+u[15&i]+u[h>>28&15]+u[h>>24&15]+u[h>>20&15]+u[h>>16&15]+u[h>>12&15]+u[h>>8&15]+u[h>>4&15]+u[15&h]+u[r>>28&15]+u[r>>24&15]+u[r>>20&15]+u[r>>16&15]+u[r>>12&15]+u[r>>8&15]+u[r>>4&15]+u[15&r]+u[s>>28&15]+u[s>>24&15]+u[s>>20&15]+u[s>>16&15]+u[s>>12&15]+u[s>>8&15]+u[s>>4&15]+u[15&s]+u[e>>28&15]+u[e>>24&15]+u[e>>20&15]+u[e>>16&15]+u[e>>12&15]+u[e>>8&15]+u[e>>4&15]+u[15&e]+u[n>>28&15]+u[n>>24&15]+u[n>>20&15]+u[n>>16&15]+u[n>>12&15]+u[n>>8&15]+u[n>>4&15]+u[15&n];return this.is224||(a+=u[o>>28&15]+u[o>>24&15]+u[o>>20&15]+u[o>>16&15]+u[o>>12&15]+u[o>>8&15]+u[o>>4&15]+u[15&o]),a},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,i=this.h1,h=this.h2,r=this.h3,s=this.h4,e=this.h5,n=this.h6,o=this.h7,a=[t>>24&255,t>>16&255,t>>8&255,255&t,i>>24&255,i>>16&255,i>>8&255,255&i,h>>24&255,h>>16&255,h>>8&255,255&h,r>>24&255,r>>16&255,r>>8&255,255&r,s>>24&255,s>>16&255,s>>8&255,255&s,e>>24&255,e>>16&255,e>>8&255,255&e,n>>24&255,n>>16&255,n>>8&255,255&n];return this.is224||a.push(o>>24&255,o>>16&255,o>>8&255,255&o),a},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(this.is224?28:32),i=new DataView(t);return i.setUint32(0,this.h0),i.setUint32(4,this.h1),i.setUint32(8,this.h2),i.setUint32(12,this.h3),i.setUint32(16,this.h4),i.setUint32(20,this.h5),i.setUint32(24,this.h6),this.is224||i.setUint32(28,this.h7),t},i.prototype=new t,i.prototype.finalize=function(){if(t.prototype.finalize.call(this),this.inner){this.inner=!1;var i=this.array();t.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(i),t.prototype.finalize.call(this)}};var B=w();B.sha256=B,B.sha224=w(!0),B.sha256.hmac=_(),B.sha224.hmac=_(!0),o?module.exports=B:(s.sha256=B.sha256,s.sha224=B.sha224,a&&define(function(){return B}))}();var TurndownService = (function () {
  'use strict';

  function extend (destination) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) destination[key] = source[key];
      }
    }
    return destination
  }

  function repeat (character, count) {
    return Array(count + 1).join(character)
  }

  function trimLeadingNewlines (string) {
    return string.replace(/^\n*/, '')
  }

  function trimTrailingNewlines (string) {
    // avoid match-at-end regexp bottleneck, see #370
    var indexEnd = string.length;
    while (indexEnd > 0 && string[indexEnd - 1] === '\n') indexEnd--;
    return string.substring(0, indexEnd)
  }

  var blockElements = [
    'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
    'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
    'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
    'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
    'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
    'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
  ];

  function isBlock (node) {
    return is(node, blockElements)
  }

  var voidElements = [
    'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
    'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
  ];

  function isVoid (node) {
    return is(node, voidElements)
  }

  function hasVoid (node) {
    return has(node, voidElements)
  }

  var meaningfulWhenBlankElements = [
    'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
    'AUDIO', 'VIDEO'
  ];

  function isMeaningfulWhenBlank (node) {
    return is(node, meaningfulWhenBlankElements)
  }

  function hasMeaningfulWhenBlank (node) {
    return has(node, meaningfulWhenBlankElements)
  }

  function is (node, tagNames) {
    return tagNames.indexOf(node.nodeName) >= 0
  }

  function has (node, tagNames) {
    return (
      node.getElementsByTagName &&
      tagNames.some(function (tagName) {
        return node.getElementsByTagName(tagName).length
      })
    )
  }

  var rules = {};

  rules.paragraph = {
    filter: 'p',

    replacement: function (content) {
      return '\n\n' + content + '\n\n'
    }
  };

  rules.lineBreak = {
    filter: 'br',

    replacement: function (content, node, options) {
      return options.br + '\n'
    }
  };

  rules.heading = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    replacement: function (content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));

      if (options.headingStyle === 'setext' && hLevel < 3) {
        var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
        return (
          '\n\n' + content + '\n' + underline + '\n\n'
        )
      } else {
        return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
      }
    }
  };

  rules.blockquote = {
    filter: 'blockquote',

    replacement: function (content) {
      content = content.replace(/^\n+|\n+$/g, '');
      content = content.replace(/^/gm, '> ');
      return '\n\n' + content + '\n\n'
    }
  };

  rules.list = {
    filter: ['ul', 'ol'],

    replacement: function (content, node) {
      var parent = node.parentNode;
      if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
        return '\n' + content
      } else {
        return '\n\n' + content + '\n\n'
      }
    }
  };

  rules.listItem = {
    filter: 'li',

    replacement: function (content, node, options) {
      content = content
        .replace(/^\n+/, '') // remove leading newlines
        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
        .replace(/\n/gm, '\n    '); // indent
      var prefix = options.bulletListMarker + '   ';
      var parent = node.parentNode;
      if (parent.nodeName === 'OL') {
        var start = parent.getAttribute('start');
        var index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + '.  ';
      }
      return (
        prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  };

  rules.indentedCodeBlock = {
    filter: function (node, options) {
      return (
        options.codeBlockStyle === 'indented' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      )
    },

    replacement: function (content, node, options) {
      return (
        '\n\n    ' +
        node.firstChild.textContent.replace(/\n/g, '\n    ') +
        '\n\n'
      )
    }
  };

  rules.fencedCodeBlock = {
    filter: function (node, options) {
      return (
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      )
    },

    replacement: function (content, node, options) {
      var className = node.firstChild.getAttribute('class') || '';
      var language = (className.match(/language-(\S+)/) || [null, ''])[1];
      var code = node.firstChild.textContent;

      var fenceChar = options.fence.charAt(0);
      var fenceSize = 3;
      var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');

      var match;
      while ((match = fenceInCodeRegex.exec(code))) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }

      var fence = repeat(fenceChar, fenceSize);

      return (
        '\n\n' + fence + language + '\n' +
        code.replace(/\n$/, '') +
        '\n' + fence + '\n\n'
      )
    }
  };

  rules.horizontalRule = {
    filter: 'hr',

    replacement: function (content, node, options) {
      return '\n\n' + options.hr + '\n\n'
    }
  };

  rules.inlineLink = {
    filter: function (node, options) {
      return (
        options.linkStyle === 'inlined' &&
        node.nodeName === 'A' &&
        node.getAttribute('href')
      )
    },

    replacement: function (content, node) {
      var href = node.getAttribute('href');
      var title = cleanAttribute(node.getAttribute('title'));
      if (title) title = ' "' + title + '"';
      return '[' + content + '](' + href + title + ')'
    }
  };

  rules.referenceLink = {
    filter: function (node, options) {
      return (
        options.linkStyle === 'referenced' &&
        node.nodeName === 'A' &&
        node.getAttribute('href')
      )
    },

    replacement: function (content, node, options) {
      var href = node.getAttribute('href');
      var title = cleanAttribute(node.getAttribute('title'));
      if (title) title = ' "' + title + '"';
      var replacement;
      var reference;

      switch (options.linkReferenceStyle) {
        case 'collapsed':
          replacement = '[' + content + '][]';
          reference = '[' + content + ']: ' + href + title;
          break
        case 'shortcut':
          replacement = '[' + content + ']';
          reference = '[' + content + ']: ' + href + title;
          break
        default:
          var id = this.references.length + 1;
          replacement = '[' + content + '][' + id + ']';
          reference = '[' + id + ']: ' + href + title;
      }

      this.references.push(reference);
      return replacement
    },

    references: [],

    append: function (options) {
      var references = '';
      if (this.references.length) {
        references = '\n\n' + this.references.join('\n') + '\n\n';
        this.references = []; // Reset references
      }
      return references
    }
  };

  rules.emphasis = {
    filter: ['em', 'i'],

    replacement: function (content, node, options) {
      if (!content.trim()) return ''
      return options.emDelimiter + content + options.emDelimiter
    }
  };

  rules.strong = {
    filter: ['strong', 'b'],

    replacement: function (content, node, options) {
      if (!content.trim()) return ''
      return options.strongDelimiter + content + options.strongDelimiter
    }
  };

  rules.code = {
    filter: function (node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

      return node.nodeName === 'CODE' && !isCodeBlock
    },

    replacement: function (content) {
      if (!content) return ''
      content = content.replace(/\r?\n|\r/g, ' ');

      var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? ' ' : '';
      var delimiter = '`';
      var matches = content.match(/`+/gm) || [];
      while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';

      return delimiter + extraSpace + content + extraSpace + delimiter
    }
  };

  rules.image = {
    filter: 'img',

    replacement: function (content, node) {
      var alt = cleanAttribute(node.getAttribute('alt'));
      var src = node.getAttribute('src') || '';
      var title = cleanAttribute(node.getAttribute('title'));
      var titlePart = title ? ' "' + title + '"' : '';
      return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
    }
  };

  function cleanAttribute (attribute) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
  }

  /**
   * Manages a collection of rules used to convert HTML to Markdown
   */

  function Rules (options) {
    this.options = options;
    this._keep = [];
    this._remove = [];

    this.blankRule = {
      replacement: options.blankReplacement
    };

    this.keepReplacement = options.keepReplacement;

    this.defaultRule = {
      replacement: options.defaultReplacement
    };

    this.array = [];
    for (var key in options.rules) this.array.push(options.rules[key]);
  }

  Rules.prototype = {
    add: function (key, rule) {
      this.array.unshift(rule);
    },

    keep: function (filter) {
      this._keep.unshift({
        filter: filter,
        replacement: this.keepReplacement
      });
    },

    remove: function (filter) {
      this._remove.unshift({
        filter: filter,
        replacement: function () {
          return ''
        }
      });
    },

    forNode: function (node) {
      if (node.isBlank) return this.blankRule
      var rule;

      if ((rule = findRule(this.array, node, this.options))) return rule
      if ((rule = findRule(this._keep, node, this.options))) return rule
      if ((rule = findRule(this._remove, node, this.options))) return rule

      return this.defaultRule
    },

    forEach: function (fn) {
      for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
    }
  };

  function findRule (rules, node, options) {
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (filterValue(rule, node, options)) return rule
    }
    return void 0
  }

  function filterValue (rule, node, options) {
    var filter = rule.filter;
    if (typeof filter === 'string') {
      if (filter === node.nodeName.toLowerCase()) return true
    } else if (Array.isArray(filter)) {
      if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
    } else if (typeof filter === 'function') {
      if (filter.call(rule, node, options)) return true
    } else {
      throw new TypeError('`filter` needs to be a string, array, or function')
    }
  }

  /**
   * The collapseWhitespace function is adapted from collapse-whitespace
   * by Luc Thevenard.
   *
   * The MIT License (MIT)
   *
   * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   */

  /**
   * collapseWhitespace(options) removes extraneous whitespace from an the given element.
   *
   * @param {Object} options
   */
  function collapseWhitespace (options) {
    var element = options.element;
    var isBlock = options.isBlock;
    var isVoid = options.isVoid;
    var isPre = options.isPre || function (node) {
      return node.nodeName === 'PRE'
    };

    if (!element.firstChild || isPre(element)) return

    var prevText = null;
    var keepLeadingWs = false;

    var prev = null;
    var node = next(prev, element, isPre);

    while (node !== element) {
      if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
        var text = node.data.replace(/[ \r\n\t]+/g, ' ');

        if ((!prevText || / $/.test(prevText.data)) &&
            !keepLeadingWs && text[0] === ' ') {
          text = text.substr(1);
        }

        // `text` might be empty at this point.
        if (!text) {
          node = remove(node);
          continue
        }

        node.data = text;

        prevText = node;
      } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
        if (isBlock(node) || node.nodeName === 'BR') {
          if (prevText) {
            prevText.data = prevText.data.replace(/ $/, '');
          }

          prevText = null;
          keepLeadingWs = false;
        } else if (isVoid(node) || isPre(node)) {
          // Avoid trimming space around non-block, non-BR void elements and inline PRE.
          prevText = null;
          keepLeadingWs = true;
        } else if (prevText) {
          // Drop protection if set previously.
          keepLeadingWs = false;
        }
      } else {
        node = remove(node);
        continue
      }

      var nextNode = next(prev, node, isPre);
      prev = node;
      node = nextNode;
    }

    if (prevText) {
      prevText.data = prevText.data.replace(/ $/, '');
      if (!prevText.data) {
        remove(prevText);
      }
    }
  }

  /**
   * remove(node) removes the given node from the DOM and returns the
   * next node in the sequence.
   *
   * @param {Node} node
   * @return {Node} node
   */
  function remove (node) {
    var next = node.nextSibling || node.parentNode;

    node.parentNode.removeChild(node);

    return next
  }

  /**
   * next(prev, current, isPre) returns the next node in the sequence, given the
   * current and previous nodes.
   *
   * @param {Node} prev
   * @param {Node} current
   * @param {Function} isPre
   * @return {Node}
   */
  function next (prev, current, isPre) {
    if ((prev && prev.parentNode === current) || isPre(current)) {
      return current.nextSibling || current.parentNode
    }

    return current.firstChild || current.nextSibling || current.parentNode
  }

  /*
   * Set up window for Node.js
   */

  var root = (typeof window !== 'undefined' ? window : {});

  /*
   * Parsing HTML strings
   */

  function canParseHTMLNatively () {
    var Parser = root.DOMParser;
    var canParse = false;

    // Adapted from https://gist.github.com/1129031
    // Firefox/Opera/IE throw errors on unsupported types
    try {
      // WebKit returns null on unsupported types
      if (new Parser().parseFromString('', 'text/html')) {
        canParse = true;
      }
    } catch (e) {}

    return canParse
  }

  function createHTMLParser () {
    var Parser = function () {};

    {
      if (shouldUseActiveX()) {
        Parser.prototype.parseFromString = function (string) {
          var doc = new window.ActiveXObject('htmlfile');
          doc.designMode = 'on'; // disable on-page scripts
          doc.open();
          doc.write(string);
          doc.close();
          return doc
        };
      } else {
        Parser.prototype.parseFromString = function (string) {
          var doc = document.implementation.createHTMLDocument('');
          doc.open();
          doc.write(string);
          doc.close();
          return doc
        };
      }
    }
    return Parser
  }

  function shouldUseActiveX () {
    var useActiveX = false;
    try {
      document.implementation.createHTMLDocument('').open();
    } catch (e) {
      if (window.ActiveXObject) useActiveX = true;
    }
    return useActiveX
  }

  var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

  function RootNode (input, options) {
    var root;
    if (typeof input === 'string') {
      var doc = htmlParser().parseFromString(
        // DOM parsers arrange elements in the <head> and <body>.
        // Wrapping in a custom element ensures elements are reliably arranged in
        // a single element.
        '<x-turndown id="turndown-root">' + input + '</x-turndown>',
        'text/html'
      );
      root = doc.getElementById('turndown-root');
    } else {
      root = input.cloneNode(true);
    }
    collapseWhitespace({
      element: root,
      isBlock: isBlock,
      isVoid: isVoid,
      isPre: options.preformattedCode ? isPreOrCode : null
    });

    return root
  }

  var _htmlParser;
  function htmlParser () {
    _htmlParser = _htmlParser || new HTMLParser();
    return _htmlParser
  }

  function isPreOrCode (node) {
    return node.nodeName === 'PRE' || node.nodeName === 'CODE'
  }

  function Node (node, options) {
    node.isBlock = isBlock(node);
    node.isCode = node.nodeName === 'CODE' || node.parentNode.isCode;
    node.isBlank = isBlank(node);
    node.flankingWhitespace = flankingWhitespace(node, options);
    return node
  }

  function isBlank (node) {
    return (
      !isVoid(node) &&
      !isMeaningfulWhenBlank(node) &&
      /^\s*$/i.test(node.textContent) &&
      !hasVoid(node) &&
      !hasMeaningfulWhenBlank(node)
    )
  }

  function flankingWhitespace (node, options) {
    if (node.isBlock || (options.preformattedCode && node.isCode)) {
      return { leading: '', trailing: '' }
    }

    var edges = edgeWhitespace(node.textContent);

    // abandon leading ASCII WS if left-flanked by ASCII WS
    if (edges.leadingAscii && isFlankedByWhitespace('left', node, options)) {
      edges.leading = edges.leadingNonAscii;
    }

    // abandon trailing ASCII WS if right-flanked by ASCII WS
    if (edges.trailingAscii && isFlankedByWhitespace('right', node, options)) {
      edges.trailing = edges.trailingNonAscii;
    }

    return { leading: edges.leading, trailing: edges.trailing }
  }

  function edgeWhitespace (string) {
    var m = string.match(/^(([ \t\r\n]*)(\s*))[\s\S]*?((\s*?)([ \t\r\n]*))$/);
    return {
      leading: m[1], // whole string for whitespace-only strings
      leadingAscii: m[2],
      leadingNonAscii: m[3],
      trailing: m[4], // empty for whitespace-only strings
      trailingNonAscii: m[5],
      trailingAscii: m[6]
    }
  }

  function isFlankedByWhitespace (side, node, options) {
    var sibling;
    var regExp;
    var isFlanked;

    if (side === 'left') {
      sibling = node.previousSibling;
      regExp = / $/;
    } else {
      sibling = node.nextSibling;
      regExp = /^ /;
    }

    if (sibling) {
      if (sibling.nodeType === 3) {
        isFlanked = regExp.test(sibling.nodeValue);
      } else if (options.preformattedCode && sibling.nodeName === 'CODE') {
        isFlanked = false;
      } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
        isFlanked = regExp.test(sibling.textContent);
      }
    }
    return isFlanked
  }

  var reduce = Array.prototype.reduce;
  var escapes = [
    [/\\/g, '\\\\'],
    [/\*/g, '\\*'],
    [/^-/g, '\\-'],
    [/^\+ /g, '\\+ '],
    [/^(=+)/g, '\\$1'],
    [/^(#{1,6}) /g, '\\$1 '],
    [/`/g, '\\`'],
    [/^~~~/g, '\\~~~'],
    [/\[/g, '\\['],
    [/\]/g, '\\]'],
    [/^>/g, '\\>'],
    [/_/g, '\\_'],
    [/^(\d+)\. /g, '$1\\. ']
  ];

  function TurndownService (options) {
    if (!(this instanceof TurndownService)) return new TurndownService(options)

    var defaults = {
      rules: rules,
      headingStyle: 'setext',
      hr: '* * *',
      bulletListMarker: '*',
      codeBlockStyle: 'indented',
      fence: '```',
      emDelimiter: '_',
      strongDelimiter: '**',
      linkStyle: 'inlined',
      linkReferenceStyle: 'full',
      br: '  ',
      preformattedCode: false,
      blankReplacement: function (content, node) {
        return node.isBlock ? '\n\n' : ''
      },
      keepReplacement: function (content, node) {
        return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
      },
      defaultReplacement: function (content, node) {
        return node.isBlock ? '\n\n' + content + '\n\n' : content
      }
    };
    this.options = extend({}, defaults, options);
    this.rules = new Rules(this.options);
  }

  TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */

    turndown: function (input) {
      if (!canConvert(input)) {
        throw new TypeError(
          input + ' is not a string, or an element/document/fragment node.'
        )
      }

      if (input === '') return ''

      var output = process.call(this, new RootNode(input, this.options));
      return postProcess.call(this, output)
    },

    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The Turndown instance for chaining
     * @type Object
     */

    use: function (plugin) {
      if (Array.isArray(plugin)) {
        for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
      } else if (typeof plugin === 'function') {
        plugin(this);
      } else {
        throw new TypeError('plugin must be a Function or an Array of Functions')
      }
      return this
    },

    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    addRule: function (key, rule) {
      this.rules.add(key, rule);
      return this
    },

    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    keep: function (filter) {
      this.rules.keep(filter);
      return this
    },

    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    remove: function (filter) {
      this.rules.remove(filter);
      return this
    },

    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */

    escape: function (string) {
      return escapes.reduce(function (accumulator, escape) {
        return accumulator.replace(escape[0], escape[1])
      }, string)
    }
  };

  /**
   * Reduces a DOM node down to its Markdown string equivalent
   * @private
   * @param {HTMLElement} parentNode The node to convert
   * @returns A Markdown representation of the node
   * @type String
   */

  function process (parentNode) {
    var self = this;
    return reduce.call(parentNode.childNodes, function (output, node) {
      node = new Node(node, self.options);

      var replacement = '';
      if (node.nodeType === 3) {
        replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
      } else if (node.nodeType === 1) {
        replacement = replacementForNode.call(self, node);
      }

      return join(output, replacement)
    }, '')
  }

  /**
   * Appends strings as each rule requires and trims the output
   * @private
   * @param {String} output The conversion output
   * @returns A trimmed version of the ouput
   * @type String
   */

  function postProcess (output) {
    var self = this;
    this.rules.forEach(function (rule) {
      if (typeof rule.append === 'function') {
        output = join(output, rule.append(self.options));
      }
    });

    return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
  }

  /**
   * Converts an element node to its Markdown equivalent
   * @private
   * @param {HTMLElement} node The node to convert
   * @returns A Markdown representation of the node
   * @type String
   */

  function replacementForNode (node) {
    var rule = this.rules.forNode(node);
    var content = process.call(this, node);
    var whitespace = node.flankingWhitespace;
    if (whitespace.leading || whitespace.trailing) content = content.trim();
    return (
      whitespace.leading +
      rule.replacement(content, node, this.options) +
      whitespace.trailing
    )
  }

  /**
   * Joins replacement to the current output with appropriate number of new lines
   * @private
   * @param {String} output The current conversion output
   * @param {String} replacement The string to append to the output
   * @returns Joined output
   * @type String
   */

  function join (output, replacement) {
    var s1 = trimTrailingNewlines(output);
    var s2 = trimLeadingNewlines(replacement);
    var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
    var separator = '\n\n'.substring(0, nls);

    return s1 + separator + s2
  }

  /**
   * Determines whether an input can be converted
   * @private
   * @param {String|HTMLElement} input Describe this parameter
   * @returns Describe what it returns
   * @type String|Object|Array|Boolean|Number
   */

  function canConvert (input) {
    return (
      input != null && (
        typeof input === 'string' ||
        (input.nodeType && (
          input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
        ))
      )
    )
  }

  return TurndownService;

}());
/*! For license information please see cashaddrjs-0.4.4.min.js.LICENSE.txt */
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.cashaddr=r():t.cashaddr=r()}(this,(function(){return(()=>{var t={60:(t,r,e)=>{"use strict";var n=e(744).validate,o={q:0,p:1,z:2,r:3,y:4,9:5,x:6,8:7,g:8,f:9,2:10,t:11,v:12,d:13,w:14,0:15,s:16,3:17,j:18,n:19,5:20,4:21,k:22,h:23,c:24,e:25,6:26,m:27,u:28,a:29,7:30,l:31};t.exports={encode:function(t){n(t instanceof Uint8Array,"Invalid data: "+t+".");for(var r="",e=0;e<t.length;++e){var o=t[e];n(0<=o&&o<32,"Invalid value: "+o+"."),r+="qpzry9x8gf2tvdw0s3jn54khce6mua7l"[o]}return r},decode:function(t){n("string"==typeof t,"Invalid base32-encoded string: "+t+".");for(var r=new Uint8Array(t.length),e=0;e<t.length;++e){var i=t[e];n(i in o,"Invalid value: "+i+"."),r[e]=o[i]}return r}}},146:(t,r,e)=>{"use strict";var n=e(60),o=e(736),i=e(574),a=e(744),u=a.validate,s=a.ValidationError,p=["bitcoincash","bchtest","bchreg","member","nostracoin","repnet"];function l(t){for(var r=new Uint8Array(t.length),e=0;e<t.length;++e)r[e]=31&t[e].charCodeAt(0);return r}function f(t,r){var e=new Uint8Array(t.length+r.length);return e.set(t),e.set(r,t.length),e}function h(t){for(var r=[656907472481,522768456162,0xf33e5fb3c4,748107326120,130178868336],e=o(1),n=0;n<t.length;++n){var i=t[n],a=e.shiftRight(35);e=e.and(34359738367).shiftLeft(5).xor(i);for(var u=0;u<r.length;++u)a.shiftRight(u).and(1).equals(1)&&(e=e.xor(r[u]))}return e.xor(1)}function v(t){return t===t.toLowerCase()||t===t.toUpperCase()}t.exports={encode:function(t,r,e){u("string"==typeof t&&function(t){return v(t)&&-1!==p.indexOf(t.toLowerCase())}(t),"Invalid prefix: "+t+"."),u("string"==typeof r,"Invalid type: "+r+"."),u(e instanceof Uint8Array,"Invalid hash: "+e+".");var o,a=f(l(t),new Uint8Array(1)),c=function(t){switch(t){case"P2PKH":return 0;case"P2SH":return 8;default:throw new s("Invalid type: "+t+".")}}(r)+function(t){switch(8*t.length){case 160:return 0;case 192:return 1;case 224:return 2;case 256:return 3;case 320:return 4;case 384:return 5;case 448:return 6;case 512:return 7;default:throw new s("Invalid hash size: "+t.length+".")}}(e),y=(o=f(new Uint8Array([c]),e),i(o,8,5)),g=f(f(a,y),new Uint8Array(8)),d=f(y,function(t){for(var r=new Uint8Array(8),e=0;e<8;++e)r[7-e]=t.and(31).toJSNumber(),t=t.shiftRight(5);return r}(h(g)));return t+":"+n.encode(d)},decode:function(t){u("string"==typeof t&&v(t),"Invalid address: "+t+".");var r=t.toLowerCase().split(":");u(2===r.length,"Missing prefix: "+t+".");var e=r[0],o=n.decode(r[1]);u(function(t,r){var e=f(l(t),new Uint8Array(1));return h(f(e,r)).equals(0)}(e,o),"Invalid checksum: "+t+".");var a,p=(a=o.subarray(0,-8),i(a,5,8,!0)),c=p[0],y=p.subarray(1);return u(function(t){switch(7&t){case 0:return 160;case 1:return 192;case 2:return 224;case 3:return 256;case 4:return 320;case 5:return 384;case 6:return 448;case 7:return 512}}(c)===8*y.length,"Invalid hash size: "+t+"."),{prefix:e,type:function(t){switch(120&t){case 0:return"P2PKH";case 8:return"P2SH";default:throw new s("Invalid address type in version byte: "+t+".")}}(c),hash:y}},ValidationError:s}},574:(t,r,e)=>{"use strict";var n=e(744).validate;t.exports=function(t,r,e,o){for(var i=o?Math.floor(t.length*r/e):Math.ceil(t.length*r/e),a=(1<<e)-1,u=new Uint8Array(i),s=0,p=0,l=0,f=0;f<t.length;++f){var h=t[f];for(n(0<=h&&h>>r==0,"Invalid value: "+h+"."),p=p<<r|h,l+=r;l>=e;)l-=e,u[s]=p>>l&a,++s}return o?n(l<r&&0==(p<<e-l&a),"Input cannot be converted to "+e+" bits without padding, but strict mode was used."):l>0&&(u[s]=p<<e-l&a,++s),u}},744:t=>{"use strict";function r(t){var r=new Error;this.name=r.name="ValidationError",this.message=r.message=t,this.stack=r.stack}r.prototype=Object.create(Error.prototype),t.exports={ValidationError:r,validate:function(t,e){if(!t)throw new r(e)}}},736:(t,r,e)=>{var n;t=e.nmd(t);var o=function(t){"use strict";var r=1e7,e=9007199254740992,n=l(e),i=Math.log(e);function a(t,r){return void 0===t?a[0]:void 0!==r?10==+r?$(t):T(t,r):$(t)}function u(t,r){this.value=t,this.sign=r,this.isSmall=!1}function s(t){this.value=t,this.sign=t<0,this.isSmall=!0}function p(t){return-e<t&&t<e}function l(t){return t<1e7?[t]:t<1e14?[t%1e7,Math.floor(t/1e7)]:[t%1e7,Math.floor(t/1e7)%1e7,Math.floor(t/1e14)]}function f(t){h(t);var e=t.length;if(e<4&&I(t,n)<0)switch(e){case 0:return 0;case 1:return t[0];case 2:return t[0]+t[1]*r;default:return t[0]+(t[1]+t[2]*r)*r}return t}function h(t){for(var r=t.length;0===t[--r];);t.length=r+1}function v(t){for(var r=new Array(t),e=-1;++e<t;)r[e]=0;return r}function c(t){return t>0?Math.floor(t):Math.ceil(t)}function y(t,e){var n,o,i=t.length,a=e.length,u=new Array(i),s=0,p=r;for(o=0;o<a;o++)s=(n=t[o]+e[o]+s)>=p?1:0,u[o]=n-s*p;for(;o<i;)s=(n=t[o]+s)===p?1:0,u[o++]=n-s*p;return s>0&&u.push(s),u}function g(t,r){return t.length>=r.length?y(t,r):y(r,t)}function d(t,e){var n,o,i=t.length,a=new Array(i),u=r;for(o=0;o<i;o++)n=t[o]-u+e,e=Math.floor(n/u),a[o]=n-e*u,e+=1;for(;e>0;)a[o++]=e%u,e=Math.floor(e/u);return a}function m(t,e){var n,o,i=t.length,a=e.length,u=new Array(i),s=0,p=r;for(n=0;n<a;n++)(o=t[n]-s-e[n])<0?(o+=p,s=1):s=0,u[n]=o;for(n=a;n<i;n++){if(!((o=t[n]-s)<0)){u[n++]=o;break}o+=p,u[n]=o}for(;n<i;n++)u[n]=t[n];return h(u),u}function w(t,e,n){var o,i,a=t.length,p=new Array(a),l=-e,h=r;for(o=0;o<a;o++)i=t[o]+l,l=Math.floor(i/h),i%=h,p[o]=i<0?i+h:i;return"number"==typeof(p=f(p))?(n&&(p=-p),new s(p)):new u(p,n)}function b(t,e){var n,o,i,a,u=t.length,s=e.length,p=v(u+s),l=r;for(i=0;i<u;++i){a=t[i];for(var f=0;f<s;++f)n=a*e[f]+p[i+f],o=Math.floor(n/l),p[i+f]=n-o*l,p[i+f+1]+=o}return h(p),p}function M(t,e){var n,o,i=t.length,a=new Array(i),u=r,s=0;for(o=0;o<i;o++)n=t[o]*e+s,s=Math.floor(n/u),a[o]=n-s*u;for(;s>0;)a[o++]=s%u,s=Math.floor(s/u);return a}function q(t,r){for(var e=[];r-- >0;)e.push(0);return e.concat(t)}function S(t,r){var e=Math.max(t.length,r.length);if(e<=30)return b(t,r);e=Math.ceil(e/2);var n=t.slice(e),o=t.slice(0,e),i=r.slice(e),a=r.slice(0,e),u=S(o,a),s=S(n,i),p=S(g(o,n),g(a,i)),l=g(g(u,q(m(m(p,u),s),e)),q(s,2*e));return h(l),l}function E(t,e,n){return new u(t<r?M(e,t):b(e,l(t)),n)}function x(t){var e,n,o,i,a=t.length,u=v(a+a),s=r;for(o=0;o<a;o++){n=0-(i=t[o])*i;for(var p=o;p<a;p++)e=i*t[p]*2+u[o+p]+n,n=Math.floor(e/s),u[o+p]=e-n*s;u[o+a]=n}return h(u),u}function A(t,r){var e,n,o,i,a=t.length,u=v(a);for(o=0,e=a-1;e>=0;--e)o=(i=1e7*o+t[e])-(n=c(i/r))*r,u[e]=0|n;return[u,0|o]}function N(t,e){var n,o,i=$(e),p=t.value,y=i.value;if(0===y)throw new Error("Cannot divide by zero");if(t.isSmall)return i.isSmall?[new s(c(p/y)),new s(p%y)]:[a[0],t];if(i.isSmall){if(1===y)return[t,a[0]];if(-1==y)return[t.negate(),a[0]];var g=Math.abs(y);if(g<r){o=f((n=A(p,g))[0]);var d=n[1];return t.sign&&(d=-d),"number"==typeof o?(t.sign!==i.sign&&(o=-o),[new s(o),new s(d)]):[new u(o,t.sign!==i.sign),new s(d)]}y=l(g)}var w=I(p,y);if(-1===w)return[a[0],t];if(0===w)return[a[t.sign===i.sign?1:-1],a[0]];o=(n=p.length+y.length<=200?function(t,e){var n,o,i,a,u,s,p,l=t.length,h=e.length,c=r,y=v(e.length),g=e[h-1],d=Math.ceil(c/(2*g)),m=M(t,d),w=M(e,d);for(m.length<=l&&m.push(0),w.push(0),g=w[h-1],o=l-h;o>=0;o--){for(n=c-1,m[o+h]!==g&&(n=Math.floor((m[o+h]*c+m[o+h-1])/g)),i=0,a=0,s=w.length,u=0;u<s;u++)i+=n*w[u],p=Math.floor(i/c),a+=m[o+u]-(i-p*c),i=p,a<0?(m[o+u]=a+c,a=-1):(m[o+u]=a,a=0);for(;0!==a;){for(n-=1,i=0,u=0;u<s;u++)(i+=m[o+u]-c+w[u])<0?(m[o+u]=i+c,i=0):(m[o+u]=i,i=1);a+=i}y[o]=n}return m=A(m,d)[0],[f(y),f(m)]}(p,y):function(t,e){for(var n,o,i,a,u,s=t.length,p=e.length,l=[],v=[],c=r;s;)if(v.unshift(t[--s]),h(v),I(v,e)<0)l.push(0);else{i=v[(o=v.length)-1]*c+v[o-2],a=e[p-1]*c+e[p-2],o>p&&(i=(i+1)*c),n=Math.ceil(i/a);do{if(I(u=M(e,n),v)<=0)break;n--}while(n);l.push(n),v=m(v,u)}return l.reverse(),[f(l),f(v)]}(p,y))[0];var b=t.sign!==i.sign,q=n[1],S=t.sign;return"number"==typeof o?(b&&(o=-o),o=new s(o)):o=new u(o,b),"number"==typeof q?(S&&(q=-q),q=new s(q)):q=new u(q,S),[o,q]}function I(t,r){if(t.length!==r.length)return t.length>r.length?1:-1;for(var e=t.length-1;e>=0;e--)if(t[e]!==r[e])return t[e]>r[e]?1:-1;return 0}function O(t){var r=t.abs();return!r.isUnit()&&(!!(r.equals(2)||r.equals(3)||r.equals(5))||!(r.isEven()||r.isDivisibleBy(3)||r.isDivisibleBy(5))&&(!!r.lesser(49)||void 0))}function P(t,r){for(var e,n,i,u=t.prev(),s=u,p=0;s.isEven();)s=s.divide(2),p++;t:for(n=0;n<r.length;n++)if(!t.lesser(r[n])&&!(i=o(r[n]).modPow(s,t)).equals(a[1])&&!i.equals(u)){for(e=p-1;0!=e;e--){if((i=i.square().mod(t)).isUnit())return!1;if(i.equals(u))continue t}return!1}return!0}u.prototype=Object.create(a.prototype),s.prototype=Object.create(a.prototype),u.prototype.add=function(t){var r=$(t);if(this.sign!==r.sign)return this.subtract(r.negate());var e=this.value,n=r.value;return r.isSmall?new u(d(e,Math.abs(n)),this.sign):new u(g(e,n),this.sign)},u.prototype.plus=u.prototype.add,s.prototype.add=function(t){var r=$(t),e=this.value;if(e<0!==r.sign)return this.subtract(r.negate());var n=r.value;if(r.isSmall){if(p(e+n))return new s(e+n);n=l(Math.abs(n))}return new u(d(n,Math.abs(e)),e<0)},s.prototype.plus=s.prototype.add,u.prototype.subtract=function(t){var r=$(t);if(this.sign!==r.sign)return this.add(r.negate());var e=this.value,n=r.value;return r.isSmall?w(e,Math.abs(n),this.sign):function(t,r,e){var n;return I(t,r)>=0?n=m(t,r):(n=m(r,t),e=!e),"number"==typeof(n=f(n))?(e&&(n=-n),new s(n)):new u(n,e)}(e,n,this.sign)},u.prototype.minus=u.prototype.subtract,s.prototype.subtract=function(t){var r=$(t),e=this.value;if(e<0!==r.sign)return this.add(r.negate());var n=r.value;return r.isSmall?new s(e-n):w(n,Math.abs(e),e>=0)},s.prototype.minus=s.prototype.subtract,u.prototype.negate=function(){return new u(this.value,!this.sign)},s.prototype.negate=function(){var t=this.sign,r=new s(-this.value);return r.sign=!t,r},u.prototype.abs=function(){return new u(this.value,!1)},s.prototype.abs=function(){return new s(Math.abs(this.value))},u.prototype.multiply=function(t){var e,n,o,i=$(t),s=this.value,p=i.value,f=this.sign!==i.sign;if(i.isSmall){if(0===p)return a[0];if(1===p)return this;if(-1===p)return this.negate();if((e=Math.abs(p))<r)return new u(M(s,e),f);p=l(e)}return new u(-.012*(n=s.length)-.012*(o=p.length)+15e-6*n*o>0?S(s,p):b(s,p),f)},u.prototype.times=u.prototype.multiply,s.prototype._multiplyBySmall=function(t){return p(t.value*this.value)?new s(t.value*this.value):E(Math.abs(t.value),l(Math.abs(this.value)),this.sign!==t.sign)},u.prototype._multiplyBySmall=function(t){return 0===t.value?a[0]:1===t.value?this:-1===t.value?this.negate():E(Math.abs(t.value),this.value,this.sign!==t.sign)},s.prototype.multiply=function(t){return $(t)._multiplyBySmall(this)},s.prototype.times=s.prototype.multiply,u.prototype.square=function(){return new u(x(this.value),!1)},s.prototype.square=function(){var t=this.value*this.value;return p(t)?new s(t):new u(x(l(Math.abs(this.value))),!1)},u.prototype.divmod=function(t){var r=N(this,t);return{quotient:r[0],remainder:r[1]}},s.prototype.divmod=u.prototype.divmod,u.prototype.divide=function(t){return N(this,t)[0]},s.prototype.over=s.prototype.divide=u.prototype.over=u.prototype.divide,u.prototype.mod=function(t){return N(this,t)[1]},s.prototype.remainder=s.prototype.mod=u.prototype.remainder=u.prototype.mod,u.prototype.pow=function(t){var r,e,n,o=$(t),i=this.value,u=o.value;if(0===u)return a[1];if(0===i)return a[0];if(1===i)return a[1];if(-1===i)return o.isEven()?a[1]:a[-1];if(o.sign)return a[0];if(!o.isSmall)throw new Error("The exponent "+o.toString()+" is too large.");if(this.isSmall&&p(r=Math.pow(i,u)))return new s(c(r));for(e=this,n=a[1];!0&u&&(n=n.times(e),--u),0!==u;)u/=2,e=e.square();return n},s.prototype.pow=u.prototype.pow,u.prototype.modPow=function(t,r){if(t=$(t),(r=$(r)).isZero())throw new Error("Cannot take modPow with modulus 0");for(var e=a[1],n=this.mod(r);t.isPositive();){if(n.isZero())return a[0];t.isOdd()&&(e=e.multiply(n).mod(r)),t=t.divide(2),n=n.square().mod(r)}return e},s.prototype.modPow=u.prototype.modPow,u.prototype.compareAbs=function(t){var r=$(t),e=this.value,n=r.value;return r.isSmall?1:I(e,n)},s.prototype.compareAbs=function(t){var r=$(t),e=Math.abs(this.value),n=r.value;return r.isSmall?e===(n=Math.abs(n))?0:e>n?1:-1:-1},u.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var r=$(t),e=this.value,n=r.value;return this.sign!==r.sign?r.sign?1:-1:r.isSmall?this.sign?-1:1:I(e,n)*(this.sign?-1:1)},u.prototype.compareTo=u.prototype.compare,s.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var r=$(t),e=this.value,n=r.value;return r.isSmall?e==n?0:e>n?1:-1:e<0!==r.sign?e<0?-1:1:e<0?1:-1},s.prototype.compareTo=s.prototype.compare,u.prototype.equals=function(t){return 0===this.compare(t)},s.prototype.eq=s.prototype.equals=u.prototype.eq=u.prototype.equals,u.prototype.notEquals=function(t){return 0!==this.compare(t)},s.prototype.neq=s.prototype.notEquals=u.prototype.neq=u.prototype.notEquals,u.prototype.greater=function(t){return this.compare(t)>0},s.prototype.gt=s.prototype.greater=u.prototype.gt=u.prototype.greater,u.prototype.lesser=function(t){return this.compare(t)<0},s.prototype.lt=s.prototype.lesser=u.prototype.lt=u.prototype.lesser,u.prototype.greaterOrEquals=function(t){return this.compare(t)>=0},s.prototype.geq=s.prototype.greaterOrEquals=u.prototype.geq=u.prototype.greaterOrEquals,u.prototype.lesserOrEquals=function(t){return this.compare(t)<=0},s.prototype.leq=s.prototype.lesserOrEquals=u.prototype.leq=u.prototype.lesserOrEquals,u.prototype.isEven=function(){return 0==(1&this.value[0])},s.prototype.isEven=function(){return 0==(1&this.value)},u.prototype.isOdd=function(){return 1==(1&this.value[0])},s.prototype.isOdd=function(){return 1==(1&this.value)},u.prototype.isPositive=function(){return!this.sign},s.prototype.isPositive=function(){return this.value>0},u.prototype.isNegative=function(){return this.sign},s.prototype.isNegative=function(){return this.value<0},u.prototype.isUnit=function(){return!1},s.prototype.isUnit=function(){return 1===Math.abs(this.value)},u.prototype.isZero=function(){return!1},s.prototype.isZero=function(){return 0===this.value},u.prototype.isDivisibleBy=function(t){var r=$(t),e=r.value;return 0!==e&&(1===e||(2===e?this.isEven():this.mod(r).equals(a[0])))},s.prototype.isDivisibleBy=u.prototype.isDivisibleBy,u.prototype.isPrime=function(r){var e=O(this);if(e!==t)return e;var n=this.abs(),i=n.bitLength();if(i<=64)return P(n,[2,325,9375,28178,450775,9780504,1795265022]);for(var a=Math.log(2)*i,u=Math.ceil(!0===r?2*Math.pow(a,2):a),s=[],p=0;p<u;p++)s.push(o(p+2));return P(n,s)},s.prototype.isPrime=u.prototype.isPrime,u.prototype.isProbablePrime=function(r){var e=O(this);if(e!==t)return e;for(var n=this.abs(),i=r===t?5:r,a=[],u=0;u<i;u++)a.push(o.randBetween(2,n.minus(2)));return P(n,a)},s.prototype.isProbablePrime=u.prototype.isProbablePrime,u.prototype.modInv=function(t){for(var r,e,n,i=o.zero,a=o.one,u=$(t),s=this.abs();!s.equals(o.zero);)r=u.divide(s),e=i,n=u,i=a,u=s,a=e.subtract(r.multiply(a)),s=n.subtract(r.multiply(s));if(!u.equals(1))throw new Error(this.toString()+" and "+t.toString()+" are not co-prime");return-1===i.compare(0)&&(i=i.add(t)),this.isNegative()?i.negate():i},s.prototype.modInv=u.prototype.modInv,u.prototype.next=function(){var t=this.value;return this.sign?w(t,1,this.sign):new u(d(t,1),this.sign)},s.prototype.next=function(){var t=this.value;return t+1<e?new s(t+1):new u(n,!1)},u.prototype.prev=function(){var t=this.value;return this.sign?new u(d(t,1),!0):w(t,1,this.sign)},s.prototype.prev=function(){var t=this.value;return t-1>-e?new s(t-1):new u(n,!0)};for(var U=[1];2*U[U.length-1]<=r;)U.push(2*U[U.length-1]);var Z=U.length,C=U[Z-1];function L(t){return("number"==typeof t||"string"==typeof t)&&+Math.abs(t)<=r||t instanceof u&&t.value.length<=1}function j(t,r,e){r=$(r);for(var n=t.isNegative(),i=r.isNegative(),a=n?t.not():t,u=i?r.not():r,s=0,p=0,l=null,f=null,h=[];!a.isZero()||!u.isZero();)s=(l=N(a,C))[1].toJSNumber(),n&&(s=C-1-s),p=(f=N(u,C))[1].toJSNumber(),i&&(p=C-1-p),a=l[0],u=f[0],h.push(e(s,p));for(var v=0!==e(n?1:0,i?1:0)?o(-1):o(0),c=h.length-1;c>=0;c-=1)v=v.multiply(C).add(o(h[c]));return v}u.prototype.shiftLeft=function(t){if(!L(t))throw new Error(String(t)+" is too large for shifting.");if((t=+t)<0)return this.shiftRight(-t);var r=this;if(r.isZero())return r;for(;t>=Z;)r=r.multiply(C),t-=Z-1;return r.multiply(U[t])},s.prototype.shiftLeft=u.prototype.shiftLeft,u.prototype.shiftRight=function(t){var r;if(!L(t))throw new Error(String(t)+" is too large for shifting.");if((t=+t)<0)return this.shiftLeft(-t);for(var e=this;t>=Z;){if(e.isZero()||e.isNegative()&&e.isUnit())return e;e=(r=N(e,C))[1].isNegative()?r[0].prev():r[0],t-=Z-1}return(r=N(e,U[t]))[1].isNegative()?r[0].prev():r[0]},s.prototype.shiftRight=u.prototype.shiftRight,u.prototype.not=function(){return this.negate().prev()},s.prototype.not=u.prototype.not,u.prototype.and=function(t){return j(this,t,(function(t,r){return t&r}))},s.prototype.and=u.prototype.and,u.prototype.or=function(t){return j(this,t,(function(t,r){return t|r}))},s.prototype.or=u.prototype.or,u.prototype.xor=function(t){return j(this,t,(function(t,r){return t^r}))},s.prototype.xor=u.prototype.xor;function z(t){var e=t.value,n="number"==typeof e?1073741824|e:e[0]+e[1]*r|1073758208;return n&-n}function B(t,r){if(r.compareTo(t)<=0){var e=B(t,r.square(r)),n=e.p,i=e.e,a=n.multiply(r);return a.compareTo(t)<=0?{p:a,e:2*i+1}:{p:n,e:2*i}}return{p:o(1),e:0}}function k(t,r){return t=$(t),r=$(r),t.greater(r)?t:r}function J(t,r){return t=$(t),r=$(r),t.lesser(r)?t:r}function R(t,r){if(t=$(t).abs(),r=$(r).abs(),t.equals(r))return t;if(t.isZero())return r;if(r.isZero())return t;for(var e,n,o=a[1];t.isEven()&&r.isEven();)e=Math.min(z(t),z(r)),t=t.divide(e),r=r.divide(e),o=o.multiply(e);for(;t.isEven();)t=t.divide(z(t));do{for(;r.isEven();)r=r.divide(z(r));t.greater(r)&&(n=r,r=t,t=n),r=r.subtract(t)}while(!r.isZero());return o.isUnit()?t:t.multiply(o)}u.prototype.bitLength=function(){var t=this;return t.compareTo(o(0))<0&&(t=t.negate().subtract(o(1))),0===t.compareTo(o(0))?o(0):o(B(t,o(2)).e).add(o(1))},s.prototype.bitLength=u.prototype.bitLength;var T=function(t,r){for(var e=t.length,n=Math.abs(r),o=0;o<e;o++)if("-"!==(l=t[o].toLowerCase())&&/[a-z0-9]/.test(l)){if(/[0-9]/.test(l)&&+l>=n){if("1"===l&&1===n)continue;throw new Error(l+" is not a valid digit in base "+r+".")}if(l.charCodeAt(0)-87>=n)throw new Error(l+" is not a valid digit in base "+r+".")}if(2<=r&&r<=36&&e<=i/Math.log(r)){var a=parseInt(t,r);if(isNaN(a))throw new Error(l+" is not a valid digit in base "+r+".");return new s(parseInt(t,r))}r=$(r);var u=[],p="-"===t[0];for(o=p?1:0;o<t.length;o++){var l,f=(l=t[o].toLowerCase()).charCodeAt(0);if(48<=f&&f<=57)u.push($(l));else if(97<=f&&f<=122)u.push($(l.charCodeAt(0)-87));else{if("<"!==l)throw new Error(l+" is not a valid character");var h=o;do{o++}while(">"!==t[o]);u.push($(t.slice(h+1,o)))}}return D(u,r,p)};function D(t,r,e){var n,o=a[0],i=a[1];for(n=t.length-1;n>=0;n--)o=o.add(t[n].times(i)),i=i.times(r);return e?o.negate():o}function H(t){return t<=35?"0123456789abcdefghijklmnopqrstuvwxyz".charAt(t):"<"+t+">"}function V(t,r){if((r=o(r)).isZero()){if(t.isZero())return{value:[0],isNegative:!1};throw new Error("Cannot convert nonzero numbers to base 0.")}if(r.equals(-1)){if(t.isZero())return{value:[0],isNegative:!1};if(t.isNegative())return{value:[].concat.apply([],Array.apply(null,Array(-t)).map(Array.prototype.valueOf,[1,0])),isNegative:!1};var e=Array.apply(null,Array(+t-1)).map(Array.prototype.valueOf,[0,1]);return e.unshift([1]),{value:[].concat.apply([],e),isNegative:!1}}var n=!1;if(t.isNegative()&&r.isPositive()&&(n=!0,t=t.abs()),r.equals(1))return t.isZero()?{value:[0],isNegative:!1}:{value:Array.apply(null,Array(+t)).map(Number.prototype.valueOf,1),isNegative:n};for(var i,a=[],u=t;u.isNegative()||u.compareAbs(r)>=0;){i=u.divmod(r),u=i.quotient;var s=i.remainder;s.isNegative()&&(s=r.minus(s).abs(),u=u.next()),a.push(s.toJSNumber())}return a.push(u.toJSNumber()),{value:a.reverse(),isNegative:n}}function _(t,r){var e=V(t,r);return(e.isNegative?"-":"")+e.value.map(H).join("")}function K(t){if(p(+t)){var r=+t;if(r===c(r))return new s(r);throw new Error("Invalid integer: "+t)}var e="-"===t[0];e&&(t=t.slice(1));var n=t.split(/e/i);if(n.length>2)throw new Error("Invalid integer: "+n.join("e"));if(2===n.length){var o=n[1];if("+"===o[0]&&(o=o.slice(1)),(o=+o)!==c(o)||!p(o))throw new Error("Invalid integer: "+o+" is not a valid exponent.");var i=n[0],a=i.indexOf(".");if(a>=0&&(o-=i.length-a-1,i=i.slice(0,a)+i.slice(a+1)),o<0)throw new Error("Cannot include negative exponent part for integers");t=i+=new Array(o+1).join("0")}if(!/^([0-9][0-9]*)$/.test(t))throw new Error("Invalid integer: "+t);for(var l=[],f=t.length,v=f-7;f>0;)l.push(+t.slice(v,f)),(v-=7)<0&&(v=0),f-=7;return h(l),new u(l,e)}function $(t){return"number"==typeof t?function(t){if(p(t)){if(t!==c(t))throw new Error(t+" is not an integer.");return new s(t)}return K(t.toString())}(t):"string"==typeof t?K(t):t}u.prototype.toArray=function(t){return V(this,t)},s.prototype.toArray=function(t){return V(this,t)},u.prototype.toString=function(r){if(r===t&&(r=10),10!==r)return _(this,r);for(var e,n=this.value,o=n.length,i=String(n[--o]);--o>=0;)e=String(n[o]),i+="0000000".slice(e.length)+e;return(this.sign?"-":"")+i},s.prototype.toString=function(r){return r===t&&(r=10),10!=r?_(this,r):String(this.value)},u.prototype.toJSON=s.prototype.toJSON=function(){return this.toString()},u.prototype.valueOf=function(){return parseInt(this.toString(),10)},u.prototype.toJSNumber=u.prototype.valueOf,s.prototype.valueOf=function(){return this.value},s.prototype.toJSNumber=s.prototype.valueOf;for(var F=0;F<1e3;F++)a[F]=new s(F),F>0&&(a[-F]=new s(-F));return a.one=a[1],a.zero=a[0],a.minusOne=a[-1],a.max=k,a.min=J,a.gcd=R,a.lcm=function(t,r){return t=$(t).abs(),r=$(r).abs(),t.divide(R(t,r)).multiply(r)},a.isInstance=function(t){return t instanceof u||t instanceof s},a.randBetween=function(t,e){var n=J(t=$(t),e=$(e)),o=k(t,e).subtract(n).add(1);if(o.isSmall)return n.add(Math.floor(Math.random()*o));for(var i=[],a=!0,p=o.value.length-1;p>=0;p--){var l=a?o.value[p]:r,h=c(Math.random()*l);i.unshift(h),h<l&&(a=!1)}return i=f(i),n.add("number"==typeof i?new s(i):new u(i,!1))},a.fromArray=function(t,r,e){return D(t.map($),$(r||10),e)},a}();t.hasOwnProperty("exports")&&(t.exports=o),void 0===(n=function(){return o}.apply(r,[]))||(t.exports=n)}},r={};function e(n){if(r[n])return r[n].exports;var o=r[n]={id:n,loaded:!1,exports:{}};return t[n](o,o.exports,e),o.loaded=!0,o.exports}return e.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),e(146)})()}));(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){"use strict";exports.byteLength=byteLength;exports.toByteArray=toByteArray;exports.fromByteArray=fromByteArray;var lookup=[];var revLookup=[];var Arr=typeof Uint8Array!=="undefined"?Uint8Array:Array;var code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var i=0,len=code.length;i<len;++i){lookup[i]=code[i];revLookup[code.charCodeAt(i)]=i}revLookup["-".charCodeAt(0)]=62;revLookup["_".charCodeAt(0)]=63;function getLens(b64){var len=b64.length;if(len%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var validLen=b64.indexOf("=");if(validLen===-1)validLen=len;var placeHoldersLen=validLen===len?0:4-validLen%4;return[validLen,placeHoldersLen]}function byteLength(b64){var lens=getLens(b64);var validLen=lens[0];var placeHoldersLen=lens[1];return(validLen+placeHoldersLen)*3/4-placeHoldersLen}function _byteLength(b64,validLen,placeHoldersLen){return(validLen+placeHoldersLen)*3/4-placeHoldersLen}function toByteArray(b64){var tmp;var lens=getLens(b64);var validLen=lens[0];var placeHoldersLen=lens[1];var arr=new Arr(_byteLength(b64,validLen,placeHoldersLen));var curByte=0;var len=placeHoldersLen>0?validLen-4:validLen;var i;for(i=0;i<len;i+=4){tmp=revLookup[b64.charCodeAt(i)]<<18|revLookup[b64.charCodeAt(i+1)]<<12|revLookup[b64.charCodeAt(i+2)]<<6|revLookup[b64.charCodeAt(i+3)];arr[curByte++]=tmp>>16&255;arr[curByte++]=tmp>>8&255;arr[curByte++]=tmp&255}if(placeHoldersLen===2){tmp=revLookup[b64.charCodeAt(i)]<<2|revLookup[b64.charCodeAt(i+1)]>>4;arr[curByte++]=tmp&255}if(placeHoldersLen===1){tmp=revLookup[b64.charCodeAt(i)]<<10|revLookup[b64.charCodeAt(i+1)]<<4|revLookup[b64.charCodeAt(i+2)]>>2;arr[curByte++]=tmp>>8&255;arr[curByte++]=tmp&255}return arr}function tripletToBase64(num){return lookup[num>>18&63]+lookup[num>>12&63]+lookup[num>>6&63]+lookup[num&63]}function encodeChunk(uint8,start,end){var tmp;var output=[];for(var i=start;i<end;i+=3){tmp=(uint8[i]<<16&16711680)+(uint8[i+1]<<8&65280)+(uint8[i+2]&255);output.push(tripletToBase64(tmp))}return output.join("")}function fromByteArray(uint8){var tmp;var len=uint8.length;var extraBytes=len%3;var parts=[];var maxChunkLength=16383;for(var i=0,len2=len-extraBytes;i<len2;i+=maxChunkLength){parts.push(encodeChunk(uint8,i,i+maxChunkLength>len2?len2:i+maxChunkLength))}if(extraBytes===1){tmp=uint8[len-1];parts.push(lookup[tmp>>2]+lookup[tmp<<4&63]+"==")}else if(extraBytes===2){tmp=(uint8[len-2]<<8)+uint8[len-1];parts.push(lookup[tmp>>10]+lookup[tmp>>4&63]+lookup[tmp<<2&63]+"=")}return parts.join("")}},{}],2:[function(require,module,exports){},{}],3:[function(require,module,exports){(function(Buffer){(function(){"use strict";var base64=require("base64-js");var ieee754=require("ieee754");exports.Buffer=Buffer;exports.SlowBuffer=SlowBuffer;exports.INSPECT_MAX_BYTES=50;var K_MAX_LENGTH=2147483647;exports.kMaxLength=K_MAX_LENGTH;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var arr=new Uint8Array(1);arr.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}};return arr.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(length){if(length>K_MAX_LENGTH){throw new RangeError('The value "'+length+'" is invalid for option "size"')}var buf=new Uint8Array(length);buf.__proto__=Buffer.prototype;return buf}function Buffer(arg,encodingOrOffset,length){if(typeof arg==="number"){if(typeof encodingOrOffset==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(arg)}return from(arg,encodingOrOffset,length)}if(typeof Symbol!=="undefined"&&Symbol.species!=null&&Buffer[Symbol.species]===Buffer){Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:true,enumerable:false,writable:false})}Buffer.poolSize=8192;function from(value,encodingOrOffset,length){if(typeof value==="string"){return fromString(value,encodingOrOffset)}if(ArrayBuffer.isView(value)){return fromArrayLike(value)}if(value==null){throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof value)}if(isInstance(value,ArrayBuffer)||value&&isInstance(value.buffer,ArrayBuffer)){return fromArrayBuffer(value,encodingOrOffset,length)}if(typeof value==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var valueOf=value.valueOf&&value.valueOf();if(valueOf!=null&&valueOf!==value){return Buffer.from(valueOf,encodingOrOffset,length)}var b=fromObject(value);if(b)return b;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof value[Symbol.toPrimitive]==="function"){return Buffer.from(value[Symbol.toPrimitive]("string"),encodingOrOffset,length)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof value)}Buffer.from=function(value,encodingOrOffset,length){return from(value,encodingOrOffset,length)};Buffer.prototype.__proto__=Uint8Array.prototype;Buffer.__proto__=Uint8Array;function assertSize(size){if(typeof size!=="number"){throw new TypeError('"size" argument must be of type number')}else if(size<0){throw new RangeError('The value "'+size+'" is invalid for option "size"')}}function alloc(size,fill,encoding){assertSize(size);if(size<=0){return createBuffer(size)}if(fill!==undefined){return typeof encoding==="string"?createBuffer(size).fill(fill,encoding):createBuffer(size).fill(fill)}return createBuffer(size)}Buffer.alloc=function(size,fill,encoding){return alloc(size,fill,encoding)};function allocUnsafe(size){assertSize(size);return createBuffer(size<0?0:checked(size)|0)}Buffer.allocUnsafe=function(size){return allocUnsafe(size)};Buffer.allocUnsafeSlow=function(size){return allocUnsafe(size)};function fromString(string,encoding){if(typeof encoding!=="string"||encoding===""){encoding="utf8"}if(!Buffer.isEncoding(encoding)){throw new TypeError("Unknown encoding: "+encoding)}var length=byteLength(string,encoding)|0;var buf=createBuffer(length);var actual=buf.write(string,encoding);if(actual!==length){buf=buf.slice(0,actual)}return buf}function fromArrayLike(array){var length=array.length<0?0:checked(array.length)|0;var buf=createBuffer(length);for(var i=0;i<length;i+=1){buf[i]=array[i]&255}return buf}function fromArrayBuffer(array,byteOffset,length){if(byteOffset<0||array.byteLength<byteOffset){throw new RangeError('"offset" is outside of buffer bounds')}if(array.byteLength<byteOffset+(length||0)){throw new RangeError('"length" is outside of buffer bounds')}var buf;if(byteOffset===undefined&&length===undefined){buf=new Uint8Array(array)}else if(length===undefined){buf=new Uint8Array(array,byteOffset)}else{buf=new Uint8Array(array,byteOffset,length)}buf.__proto__=Buffer.prototype;return buf}function fromObject(obj){if(Buffer.isBuffer(obj)){var len=checked(obj.length)|0;var buf=createBuffer(len);if(buf.length===0){return buf}obj.copy(buf,0,0,len);return buf}if(obj.length!==undefined){if(typeof obj.length!=="number"||numberIsNaN(obj.length)){return createBuffer(0)}return fromArrayLike(obj)}if(obj.type==="Buffer"&&Array.isArray(obj.data)){return fromArrayLike(obj.data)}}function checked(length){if(length>=K_MAX_LENGTH){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+K_MAX_LENGTH.toString(16)+" bytes")}return length|0}function SlowBuffer(length){if(+length!=length){length=0}return Buffer.alloc(+length)}Buffer.isBuffer=function isBuffer(b){return b!=null&&b._isBuffer===true&&b!==Buffer.prototype};Buffer.compare=function compare(a,b){if(isInstance(a,Uint8Array))a=Buffer.from(a,a.offset,a.byteLength);if(isInstance(b,Uint8Array))b=Buffer.from(b,b.offset,b.byteLength);if(!Buffer.isBuffer(a)||!Buffer.isBuffer(b)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(a===b)return 0;var x=a.length;var y=b.length;for(var i=0,len=Math.min(x,y);i<len;++i){if(a[i]!==b[i]){x=a[i];y=b[i];break}}if(x<y)return-1;if(y<x)return 1;return 0};Buffer.isEncoding=function isEncoding(encoding){switch(String(encoding).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(list,length){if(!Array.isArray(list)){throw new TypeError('"list" argument must be an Array of Buffers')}if(list.length===0){return Buffer.alloc(0)}var i;if(length===undefined){length=0;for(i=0;i<list.length;++i){length+=list[i].length}}var buffer=Buffer.allocUnsafe(length);var pos=0;for(i=0;i<list.length;++i){var buf=list[i];if(isInstance(buf,Uint8Array)){buf=Buffer.from(buf)}if(!Buffer.isBuffer(buf)){throw new TypeError('"list" argument must be an Array of Buffers')}buf.copy(buffer,pos);pos+=buf.length}return buffer};function byteLength(string,encoding){if(Buffer.isBuffer(string)){return string.length}if(ArrayBuffer.isView(string)||isInstance(string,ArrayBuffer)){return string.byteLength}if(typeof string!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof string)}var len=string.length;var mustMatch=arguments.length>2&&arguments[2]===true;if(!mustMatch&&len===0)return 0;var loweredCase=false;for(;;){switch(encoding){case"ascii":case"latin1":case"binary":return len;case"utf8":case"utf-8":return utf8ToBytes(string).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return len*2;case"hex":return len>>>1;case"base64":return base64ToBytes(string).length;default:if(loweredCase){return mustMatch?-1:utf8ToBytes(string).length}encoding=(""+encoding).toLowerCase();loweredCase=true}}}Buffer.byteLength=byteLength;function slowToString(encoding,start,end){var loweredCase=false;if(start===undefined||start<0){start=0}if(start>this.length){return""}if(end===undefined||end>this.length){end=this.length}if(end<=0){return""}end>>>=0;start>>>=0;if(end<=start){return""}if(!encoding)encoding="utf8";while(true){switch(encoding){case"hex":return hexSlice(this,start,end);case"utf8":case"utf-8":return utf8Slice(this,start,end);case"ascii":return asciiSlice(this,start,end);case"latin1":case"binary":return latin1Slice(this,start,end);case"base64":return base64Slice(this,start,end);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,start,end);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(encoding+"").toLowerCase();loweredCase=true}}}Buffer.prototype._isBuffer=true;function swap(b,n,m){var i=b[n];b[n]=b[m];b[m]=i}Buffer.prototype.swap16=function swap16(){var len=this.length;if(len%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var i=0;i<len;i+=2){swap(this,i,i+1)}return this};Buffer.prototype.swap32=function swap32(){var len=this.length;if(len%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var i=0;i<len;i+=4){swap(this,i,i+3);swap(this,i+1,i+2)}return this};Buffer.prototype.swap64=function swap64(){var len=this.length;if(len%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var i=0;i<len;i+=8){swap(this,i,i+7);swap(this,i+1,i+6);swap(this,i+2,i+5);swap(this,i+3,i+4)}return this};Buffer.prototype.toString=function toString(){var length=this.length;if(length===0)return"";if(arguments.length===0)return utf8Slice(this,0,length);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(b){if(!Buffer.isBuffer(b))throw new TypeError("Argument must be a Buffer");if(this===b)return true;return Buffer.compare(this,b)===0};Buffer.prototype.inspect=function inspect(){var str="";var max=exports.INSPECT_MAX_BYTES;str=this.toString("hex",0,max).replace(/(.{2})/g,"$1 ").trim();if(this.length>max)str+=" ... ";return"<Buffer "+str+">"};Buffer.prototype.compare=function compare(target,start,end,thisStart,thisEnd){if(isInstance(target,Uint8Array)){target=Buffer.from(target,target.offset,target.byteLength)}if(!Buffer.isBuffer(target)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof target)}if(start===undefined){start=0}if(end===undefined){end=target?target.length:0}if(thisStart===undefined){thisStart=0}if(thisEnd===undefined){thisEnd=this.length}if(start<0||end>target.length||thisStart<0||thisEnd>this.length){throw new RangeError("out of range index")}if(thisStart>=thisEnd&&start>=end){return 0}if(thisStart>=thisEnd){return-1}if(start>=end){return 1}start>>>=0;end>>>=0;thisStart>>>=0;thisEnd>>>=0;if(this===target)return 0;var x=thisEnd-thisStart;var y=end-start;var len=Math.min(x,y);var thisCopy=this.slice(thisStart,thisEnd);var targetCopy=target.slice(start,end);for(var i=0;i<len;++i){if(thisCopy[i]!==targetCopy[i]){x=thisCopy[i];y=targetCopy[i];break}}if(x<y)return-1;if(y<x)return 1;return 0};function bidirectionalIndexOf(buffer,val,byteOffset,encoding,dir){if(buffer.length===0)return-1;if(typeof byteOffset==="string"){encoding=byteOffset;byteOffset=0}else if(byteOffset>2147483647){byteOffset=2147483647}else if(byteOffset<-2147483648){byteOffset=-2147483648}byteOffset=+byteOffset;if(numberIsNaN(byteOffset)){byteOffset=dir?0:buffer.length-1}if(byteOffset<0)byteOffset=buffer.length+byteOffset;if(byteOffset>=buffer.length){if(dir)return-1;else byteOffset=buffer.length-1}else if(byteOffset<0){if(dir)byteOffset=0;else return-1}if(typeof val==="string"){val=Buffer.from(val,encoding)}if(Buffer.isBuffer(val)){if(val.length===0){return-1}return arrayIndexOf(buffer,val,byteOffset,encoding,dir)}else if(typeof val==="number"){val=val&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(dir){return Uint8Array.prototype.indexOf.call(buffer,val,byteOffset)}else{return Uint8Array.prototype.lastIndexOf.call(buffer,val,byteOffset)}}return arrayIndexOf(buffer,[val],byteOffset,encoding,dir)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(arr,val,byteOffset,encoding,dir){var indexSize=1;var arrLength=arr.length;var valLength=val.length;if(encoding!==undefined){encoding=String(encoding).toLowerCase();if(encoding==="ucs2"||encoding==="ucs-2"||encoding==="utf16le"||encoding==="utf-16le"){if(arr.length<2||val.length<2){return-1}indexSize=2;arrLength/=2;valLength/=2;byteOffset/=2}}function read(buf,i){if(indexSize===1){return buf[i]}else{return buf.readUInt16BE(i*indexSize)}}var i;if(dir){var foundIndex=-1;for(i=byteOffset;i<arrLength;i++){if(read(arr,i)===read(val,foundIndex===-1?0:i-foundIndex)){if(foundIndex===-1)foundIndex=i;if(i-foundIndex+1===valLength)return foundIndex*indexSize}else{if(foundIndex!==-1)i-=i-foundIndex;foundIndex=-1}}}else{if(byteOffset+valLength>arrLength)byteOffset=arrLength-valLength;for(i=byteOffset;i>=0;i--){var found=true;for(var j=0;j<valLength;j++){if(read(arr,i+j)!==read(val,j)){found=false;break}}if(found)return i}}return-1}Buffer.prototype.includes=function includes(val,byteOffset,encoding){return this.indexOf(val,byteOffset,encoding)!==-1};Buffer.prototype.indexOf=function indexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,false)};function hexWrite(buf,string,offset,length){offset=Number(offset)||0;var remaining=buf.length-offset;if(!length){length=remaining}else{length=Number(length);if(length>remaining){length=remaining}}var strLen=string.length;if(length>strLen/2){length=strLen/2}for(var i=0;i<length;++i){var parsed=parseInt(string.substr(i*2,2),16);if(numberIsNaN(parsed))return i;buf[offset+i]=parsed}return i}function utf8Write(buf,string,offset,length){return blitBuffer(utf8ToBytes(string,buf.length-offset),buf,offset,length)}function asciiWrite(buf,string,offset,length){return blitBuffer(asciiToBytes(string),buf,offset,length)}function latin1Write(buf,string,offset,length){return asciiWrite(buf,string,offset,length)}function base64Write(buf,string,offset,length){return blitBuffer(base64ToBytes(string),buf,offset,length)}function ucs2Write(buf,string,offset,length){return blitBuffer(utf16leToBytes(string,buf.length-offset),buf,offset,length)}Buffer.prototype.write=function write(string,offset,length,encoding){if(offset===undefined){encoding="utf8";length=this.length;offset=0}else if(length===undefined&&typeof offset==="string"){encoding=offset;length=this.length;offset=0}else if(isFinite(offset)){offset=offset>>>0;if(isFinite(length)){length=length>>>0;if(encoding===undefined)encoding="utf8"}else{encoding=length;length=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var remaining=this.length-offset;if(length===undefined||length>remaining)length=remaining;if(string.length>0&&(length<0||offset<0)||offset>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!encoding)encoding="utf8";var loweredCase=false;for(;;){switch(encoding){case"hex":return hexWrite(this,string,offset,length);case"utf8":case"utf-8":return utf8Write(this,string,offset,length);case"ascii":return asciiWrite(this,string,offset,length);case"latin1":case"binary":return latin1Write(this,string,offset,length);case"base64":return base64Write(this,string,offset,length);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,string,offset,length);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(""+encoding).toLowerCase();loweredCase=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(buf,start,end){if(start===0&&end===buf.length){return base64.fromByteArray(buf)}else{return base64.fromByteArray(buf.slice(start,end))}}function utf8Slice(buf,start,end){end=Math.min(buf.length,end);var res=[];var i=start;while(i<end){var firstByte=buf[i];var codePoint=null;var bytesPerSequence=firstByte>239?4:firstByte>223?3:firstByte>191?2:1;if(i+bytesPerSequence<=end){var secondByte,thirdByte,fourthByte,tempCodePoint;switch(bytesPerSequence){case 1:if(firstByte<128){codePoint=firstByte}break;case 2:secondByte=buf[i+1];if((secondByte&192)===128){tempCodePoint=(firstByte&31)<<6|secondByte&63;if(tempCodePoint>127){codePoint=tempCodePoint}}break;case 3:secondByte=buf[i+1];thirdByte=buf[i+2];if((secondByte&192)===128&&(thirdByte&192)===128){tempCodePoint=(firstByte&15)<<12|(secondByte&63)<<6|thirdByte&63;if(tempCodePoint>2047&&(tempCodePoint<55296||tempCodePoint>57343)){codePoint=tempCodePoint}}break;case 4:secondByte=buf[i+1];thirdByte=buf[i+2];fourthByte=buf[i+3];if((secondByte&192)===128&&(thirdByte&192)===128&&(fourthByte&192)===128){tempCodePoint=(firstByte&15)<<18|(secondByte&63)<<12|(thirdByte&63)<<6|fourthByte&63;if(tempCodePoint>65535&&tempCodePoint<1114112){codePoint=tempCodePoint}}}}if(codePoint===null){codePoint=65533;bytesPerSequence=1}else if(codePoint>65535){codePoint-=65536;res.push(codePoint>>>10&1023|55296);codePoint=56320|codePoint&1023}res.push(codePoint);i+=bytesPerSequence}return decodeCodePointsArray(res)}var MAX_ARGUMENTS_LENGTH=4096;function decodeCodePointsArray(codePoints){var len=codePoints.length;if(len<=MAX_ARGUMENTS_LENGTH){return String.fromCharCode.apply(String,codePoints)}var res="";var i=0;while(i<len){res+=String.fromCharCode.apply(String,codePoints.slice(i,i+=MAX_ARGUMENTS_LENGTH))}return res}function asciiSlice(buf,start,end){var ret="";end=Math.min(buf.length,end);for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i]&127)}return ret}function latin1Slice(buf,start,end){var ret="";end=Math.min(buf.length,end);for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i])}return ret}function hexSlice(buf,start,end){var len=buf.length;if(!start||start<0)start=0;if(!end||end<0||end>len)end=len;var out="";for(var i=start;i<end;++i){out+=toHex(buf[i])}return out}function utf16leSlice(buf,start,end){var bytes=buf.slice(start,end);var res="";for(var i=0;i<bytes.length;i+=2){res+=String.fromCharCode(bytes[i]+bytes[i+1]*256)}return res}Buffer.prototype.slice=function slice(start,end){var len=this.length;start=~~start;end=end===undefined?len:~~end;if(start<0){start+=len;if(start<0)start=0}else if(start>len){start=len}if(end<0){end+=len;if(end<0)end=0}else if(end>len){end=len}if(end<start)end=start;var newBuf=this.subarray(start,end);newBuf.__proto__=Buffer.prototype;return newBuf};function checkOffset(offset,ext,length){if(offset%1!==0||offset<0)throw new RangeError("offset is not uint");if(offset+ext>length)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(offset,byteLength,noAssert){offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset];var mul=1;var i=0;while(++i<byteLength&&(mul*=256)){val+=this[offset+i]*mul}return val};Buffer.prototype.readUIntBE=function readUIntBE(offset,byteLength,noAssert){offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert){checkOffset(offset,byteLength,this.length)}var val=this[offset+--byteLength];var mul=1;while(byteLength>0&&(mul*=256)){val+=this[offset+--byteLength]*mul}return val};Buffer.prototype.readUInt8=function readUInt8(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,1,this.length);return this[offset]};Buffer.prototype.readUInt16LE=function readUInt16LE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,2,this.length);return this[offset]|this[offset+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,2,this.length);return this[offset]<<8|this[offset+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return(this[offset]|this[offset+1]<<8|this[offset+2]<<16)+this[offset+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return this[offset]*16777216+(this[offset+1]<<16|this[offset+2]<<8|this[offset+3])};Buffer.prototype.readIntLE=function readIntLE(offset,byteLength,noAssert){offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset];var mul=1;var i=0;while(++i<byteLength&&(mul*=256)){val+=this[offset+i]*mul}mul*=128;if(val>=mul)val-=Math.pow(2,8*byteLength);return val};Buffer.prototype.readIntBE=function readIntBE(offset,byteLength,noAssert){offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert)checkOffset(offset,byteLength,this.length);var i=byteLength;var mul=1;var val=this[offset+--i];while(i>0&&(mul*=256)){val+=this[offset+--i]*mul}mul*=128;if(val>=mul)val-=Math.pow(2,8*byteLength);return val};Buffer.prototype.readInt8=function readInt8(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,1,this.length);if(!(this[offset]&128))return this[offset];return(255-this[offset]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset]|this[offset+1]<<8;return val&32768?val|4294901760:val};Buffer.prototype.readInt16BE=function readInt16BE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset+1]|this[offset]<<8;return val&32768?val|4294901760:val};Buffer.prototype.readInt32LE=function readInt32LE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return this[offset]|this[offset+1]<<8|this[offset+2]<<16|this[offset+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return this[offset]<<24|this[offset+1]<<16|this[offset+2]<<8|this[offset+3]};Buffer.prototype.readFloatLE=function readFloatLE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(offset,noAssert){offset=offset>>>0;if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,false,52,8)};function checkInt(buf,value,offset,ext,max,min){if(!Buffer.isBuffer(buf))throw new TypeError('"buffer" argument must be a Buffer instance');if(value>max||value<min)throw new RangeError('"value" argument is out of bounds');if(offset+ext>buf.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(value,offset,byteLength,noAssert){value=+value;offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var mul=1;var i=0;this[offset]=value&255;while(++i<byteLength&&(mul*=256)){this[offset+i]=value/mul&255}return offset+byteLength};Buffer.prototype.writeUIntBE=function writeUIntBE(value,offset,byteLength,noAssert){value=+value;offset=offset>>>0;byteLength=byteLength>>>0;if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var i=byteLength-1;var mul=1;this[offset+i]=value&255;while(--i>=0&&(mul*=256)){this[offset+i]=value/mul&255}return offset+byteLength};Buffer.prototype.writeUInt8=function writeUInt8(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,1,255,0);this[offset]=value&255;return offset+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,2,65535,0);this[offset]=value&255;this[offset+1]=value>>>8;return offset+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,2,65535,0);this[offset]=value>>>8;this[offset+1]=value&255;return offset+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,4,4294967295,0);this[offset+3]=value>>>24;this[offset+2]=value>>>16;this[offset+1]=value>>>8;this[offset]=value&255;return offset+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,4,4294967295,0);this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=value&255;return offset+4};Buffer.prototype.writeIntLE=function writeIntLE(value,offset,byteLength,noAssert){value=+value;offset=offset>>>0;if(!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=0;var mul=1;var sub=0;this[offset]=value&255;while(++i<byteLength&&(mul*=256)){if(value<0&&sub===0&&this[offset+i-1]!==0){sub=1}this[offset+i]=(value/mul>>0)-sub&255}return offset+byteLength};Buffer.prototype.writeIntBE=function writeIntBE(value,offset,byteLength,noAssert){value=+value;offset=offset>>>0;if(!noAssert){var limit=Math.pow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=byteLength-1;var mul=1;var sub=0;this[offset+i]=value&255;while(--i>=0&&(mul*=256)){if(value<0&&sub===0&&this[offset+i+1]!==0){sub=1}this[offset+i]=(value/mul>>0)-sub&255}return offset+byteLength};Buffer.prototype.writeInt8=function writeInt8(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,1,127,-128);if(value<0)value=255+value+1;this[offset]=value&255;return offset+1};Buffer.prototype.writeInt16LE=function writeInt16LE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,2,32767,-32768);this[offset]=value&255;this[offset+1]=value>>>8;return offset+2};Buffer.prototype.writeInt16BE=function writeInt16BE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,2,32767,-32768);this[offset]=value>>>8;this[offset+1]=value&255;return offset+2};Buffer.prototype.writeInt32LE=function writeInt32LE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,4,2147483647,-2147483648);this[offset]=value&255;this[offset+1]=value>>>8;this[offset+2]=value>>>16;this[offset+3]=value>>>24;return offset+4};Buffer.prototype.writeInt32BE=function writeInt32BE(value,offset,noAssert){value=+value;offset=offset>>>0;if(!noAssert)checkInt(this,value,offset,4,2147483647,-2147483648);if(value<0)value=4294967295+value+1;this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=value&255;return offset+4};function checkIEEE754(buf,value,offset,ext,max,min){if(offset+ext>buf.length)throw new RangeError("Index out of range");if(offset<0)throw new RangeError("Index out of range")}function writeFloat(buf,value,offset,littleEndian,noAssert){value=+value;offset=offset>>>0;if(!noAssert){checkIEEE754(buf,value,offset,4,34028234663852886e22,-34028234663852886e22)}ieee754.write(buf,value,offset,littleEndian,23,4);return offset+4}Buffer.prototype.writeFloatLE=function writeFloatLE(value,offset,noAssert){return writeFloat(this,value,offset,true,noAssert)};Buffer.prototype.writeFloatBE=function writeFloatBE(value,offset,noAssert){return writeFloat(this,value,offset,false,noAssert)};function writeDouble(buf,value,offset,littleEndian,noAssert){value=+value;offset=offset>>>0;if(!noAssert){checkIEEE754(buf,value,offset,8,17976931348623157e292,-17976931348623157e292)}ieee754.write(buf,value,offset,littleEndian,52,8);return offset+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(value,offset,noAssert){return writeDouble(this,value,offset,true,noAssert)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(value,offset,noAssert){return writeDouble(this,value,offset,false,noAssert)};Buffer.prototype.copy=function copy(target,targetStart,start,end){if(!Buffer.isBuffer(target))throw new TypeError("argument should be a Buffer");if(!start)start=0;if(!end&&end!==0)end=this.length;if(targetStart>=target.length)targetStart=target.length;if(!targetStart)targetStart=0;if(end>0&&end<start)end=start;if(end===start)return 0;if(target.length===0||this.length===0)return 0;if(targetStart<0){throw new RangeError("targetStart out of bounds")}if(start<0||start>=this.length)throw new RangeError("Index out of range");if(end<0)throw new RangeError("sourceEnd out of bounds");if(end>this.length)end=this.length;if(target.length-targetStart<end-start){end=target.length-targetStart+start}var len=end-start;if(this===target&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(targetStart,start,end)}else if(this===target&&start<targetStart&&targetStart<end){for(var i=len-1;i>=0;--i){target[i+targetStart]=this[i+start]}}else{Uint8Array.prototype.set.call(target,this.subarray(start,end),targetStart)}return len};Buffer.prototype.fill=function fill(val,start,end,encoding){if(typeof val==="string"){if(typeof start==="string"){encoding=start;start=0;end=this.length}else if(typeof end==="string"){encoding=end;end=this.length}if(encoding!==undefined&&typeof encoding!=="string"){throw new TypeError("encoding must be a string")}if(typeof encoding==="string"&&!Buffer.isEncoding(encoding)){throw new TypeError("Unknown encoding: "+encoding)}if(val.length===1){var code=val.charCodeAt(0);if(encoding==="utf8"&&code<128||encoding==="latin1"){val=code}}}else if(typeof val==="number"){val=val&255}if(start<0||this.length<start||this.length<end){throw new RangeError("Out of range index")}if(end<=start){return this}start=start>>>0;end=end===undefined?this.length:end>>>0;if(!val)val=0;var i;if(typeof val==="number"){for(i=start;i<end;++i){this[i]=val}}else{var bytes=Buffer.isBuffer(val)?val:Buffer.from(val,encoding);var len=bytes.length;if(len===0){throw new TypeError('The value "'+val+'" is invalid for argument "value"')}for(i=0;i<end-start;++i){this[i+start]=bytes[i%len]}}return this};var INVALID_BASE64_RE=/[^+/0-9A-Za-z-_]/g;function base64clean(str){str=str.split("=")[0];str=str.trim().replace(INVALID_BASE64_RE,"");if(str.length<2)return"";while(str.length%4!==0){str=str+"="}return str}function toHex(n){if(n<16)return"0"+n.toString(16);return n.toString(16)}function utf8ToBytes(string,units){units=units||Infinity;var codePoint;var length=string.length;var leadSurrogate=null;var bytes=[];for(var i=0;i<length;++i){codePoint=string.charCodeAt(i);if(codePoint>55295&&codePoint<57344){if(!leadSurrogate){if(codePoint>56319){if((units-=3)>-1)bytes.push(239,191,189);continue}else if(i+1===length){if((units-=3)>-1)bytes.push(239,191,189);continue}leadSurrogate=codePoint;continue}if(codePoint<56320){if((units-=3)>-1)bytes.push(239,191,189);leadSurrogate=codePoint;continue}codePoint=(leadSurrogate-55296<<10|codePoint-56320)+65536}else if(leadSurrogate){if((units-=3)>-1)bytes.push(239,191,189)}leadSurrogate=null;if(codePoint<128){if((units-=1)<0)break;bytes.push(codePoint)}else if(codePoint<2048){if((units-=2)<0)break;bytes.push(codePoint>>6|192,codePoint&63|128)}else if(codePoint<65536){if((units-=3)<0)break;bytes.push(codePoint>>12|224,codePoint>>6&63|128,codePoint&63|128)}else if(codePoint<1114112){if((units-=4)<0)break;bytes.push(codePoint>>18|240,codePoint>>12&63|128,codePoint>>6&63|128,codePoint&63|128)}else{throw new Error("Invalid code point")}}return bytes}function asciiToBytes(str){var byteArray=[];for(var i=0;i<str.length;++i){byteArray.push(str.charCodeAt(i)&255)}return byteArray}function utf16leToBytes(str,units){var c,hi,lo;var byteArray=[];for(var i=0;i<str.length;++i){if((units-=2)<0)break;c=str.charCodeAt(i);hi=c>>8;lo=c%256;byteArray.push(lo);byteArray.push(hi)}return byteArray}function base64ToBytes(str){return base64.toByteArray(base64clean(str))}function blitBuffer(src,dst,offset,length){for(var i=0;i<length;++i){if(i+offset>=dst.length||i>=src.length)break;dst[i+offset]=src[i]}return i}function isInstance(obj,type){return obj instanceof type||obj!=null&&obj.constructor!=null&&obj.constructor.name!=null&&obj.constructor.name===type.name}function numberIsNaN(obj){return obj!==obj}}).call(this)}).call(this,require("buffer").Buffer)},{"base64-js":1,buffer:3,ieee754:5}],4:[function(require,module,exports){"use strict";var R=typeof Reflect==="object"?Reflect:null;var ReflectApply=R&&typeof R.apply==="function"?R.apply:function ReflectApply(target,receiver,args){return Function.prototype.apply.call(target,receiver,args)};var ReflectOwnKeys;if(R&&typeof R.ownKeys==="function"){ReflectOwnKeys=R.ownKeys}else if(Object.getOwnPropertySymbols){ReflectOwnKeys=function ReflectOwnKeys(target){return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))}}else{ReflectOwnKeys=function ReflectOwnKeys(target){return Object.getOwnPropertyNames(target)}}function ProcessEmitWarning(warning){if(console&&console.warn)console.warn(warning)}var NumberIsNaN=Number.isNaN||function NumberIsNaN(value){return value!==value};function EventEmitter(){EventEmitter.init.call(this)}module.exports=EventEmitter;module.exports.once=once;EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._eventsCount=0;EventEmitter.prototype._maxListeners=undefined;var defaultMaxListeners=10;function checkListener(listener){if(typeof listener!=="function"){throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof listener)}}Object.defineProperty(EventEmitter,"defaultMaxListeners",{enumerable:true,get:function(){return defaultMaxListeners},set:function(arg){if(typeof arg!=="number"||arg<0||NumberIsNaN(arg)){throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+arg+".")}defaultMaxListeners=arg}});EventEmitter.init=function(){if(this._events===undefined||this._events===Object.getPrototypeOf(this)._events){this._events=Object.create(null);this._eventsCount=0}this._maxListeners=this._maxListeners||undefined};EventEmitter.prototype.setMaxListeners=function setMaxListeners(n){if(typeof n!=="number"||n<0||NumberIsNaN(n)){throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+n+".")}this._maxListeners=n;return this};function _getMaxListeners(that){if(that._maxListeners===undefined)return EventEmitter.defaultMaxListeners;return that._maxListeners}EventEmitter.prototype.getMaxListeners=function getMaxListeners(){return _getMaxListeners(this)};EventEmitter.prototype.emit=function emit(type){var args=[];for(var i=1;i<arguments.length;i++)args.push(arguments[i]);var doError=type==="error";var events=this._events;if(events!==undefined)doError=doError&&events.error===undefined;else if(!doError)return false;if(doError){var er;if(args.length>0)er=args[0];if(er instanceof Error){throw er}var err=new Error("Unhandled error."+(er?" ("+er.message+")":""));err.context=er;throw err}var handler=events[type];if(handler===undefined)return false;if(typeof handler==="function"){ReflectApply(handler,this,args)}else{var len=handler.length;var listeners=arrayClone(handler,len);for(var i=0;i<len;++i)ReflectApply(listeners[i],this,args)}return true};function _addListener(target,type,listener,prepend){var m;var events;var existing;checkListener(listener);events=target._events;if(events===undefined){events=target._events=Object.create(null);target._eventsCount=0}else{if(events.newListener!==undefined){target.emit("newListener",type,listener.listener?listener.listener:listener);events=target._events}existing=events[type]}if(existing===undefined){existing=events[type]=listener;++target._eventsCount}else{if(typeof existing==="function"){existing=events[type]=prepend?[listener,existing]:[existing,listener]}else if(prepend){existing.unshift(listener)}else{existing.push(listener)}m=_getMaxListeners(target);if(m>0&&existing.length>m&&!existing.warned){existing.warned=true;var w=new Error("Possible EventEmitter memory leak detected. "+existing.length+" "+String(type)+" listeners "+"added. Use emitter.setMaxListeners() to "+"increase limit");w.name="MaxListenersExceededWarning";w.emitter=target;w.type=type;w.count=existing.length;ProcessEmitWarning(w)}}return target}EventEmitter.prototype.addListener=function addListener(type,listener){return _addListener(this,type,listener,false)};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.prependListener=function prependListener(type,listener){return _addListener(this,type,listener,true)};function onceWrapper(){if(!this.fired){this.target.removeListener(this.type,this.wrapFn);this.fired=true;if(arguments.length===0)return this.listener.call(this.target);return this.listener.apply(this.target,arguments)}}function _onceWrap(target,type,listener){var state={fired:false,wrapFn:undefined,target:target,type:type,listener:listener};var wrapped=onceWrapper.bind(state);wrapped.listener=listener;state.wrapFn=wrapped;return wrapped}EventEmitter.prototype.once=function once(type,listener){checkListener(listener);this.on(type,_onceWrap(this,type,listener));return this};EventEmitter.prototype.prependOnceListener=function prependOnceListener(type,listener){checkListener(listener);this.prependListener(type,_onceWrap(this,type,listener));return this};EventEmitter.prototype.removeListener=function removeListener(type,listener){var list,events,position,i,originalListener;checkListener(listener);events=this._events;if(events===undefined)return this;list=events[type];if(list===undefined)return this;if(list===listener||list.listener===listener){if(--this._eventsCount===0)this._events=Object.create(null);else{delete events[type];if(events.removeListener)this.emit("removeListener",type,list.listener||listener)}}else if(typeof list!=="function"){position=-1;for(i=list.length-1;i>=0;i--){if(list[i]===listener||list[i].listener===listener){originalListener=list[i].listener;position=i;break}}if(position<0)return this;if(position===0)list.shift();else{spliceOne(list,position)}if(list.length===1)events[type]=list[0];if(events.removeListener!==undefined)this.emit("removeListener",type,originalListener||listener)}return this};EventEmitter.prototype.off=EventEmitter.prototype.removeListener;EventEmitter.prototype.removeAllListeners=function removeAllListeners(type){var listeners,events,i;events=this._events;if(events===undefined)return this;if(events.removeListener===undefined){if(arguments.length===0){this._events=Object.create(null);this._eventsCount=0}else if(events[type]!==undefined){if(--this._eventsCount===0)this._events=Object.create(null);else delete events[type]}return this}if(arguments.length===0){var keys=Object.keys(events);var key;for(i=0;i<keys.length;++i){key=keys[i];if(key==="removeListener")continue;this.removeAllListeners(key)}this.removeAllListeners("removeListener");this._events=Object.create(null);this._eventsCount=0;return this}listeners=events[type];if(typeof listeners==="function"){this.removeListener(type,listeners)}else if(listeners!==undefined){for(i=listeners.length-1;i>=0;i--){this.removeListener(type,listeners[i])}}return this};function _listeners(target,type,unwrap){var events=target._events;if(events===undefined)return[];var evlistener=events[type];if(evlistener===undefined)return[];if(typeof evlistener==="function")return unwrap?[evlistener.listener||evlistener]:[evlistener];return unwrap?unwrapListeners(evlistener):arrayClone(evlistener,evlistener.length)}EventEmitter.prototype.listeners=function listeners(type){return _listeners(this,type,true)};EventEmitter.prototype.rawListeners=function rawListeners(type){return _listeners(this,type,false)};EventEmitter.listenerCount=function(emitter,type){if(typeof emitter.listenerCount==="function"){return emitter.listenerCount(type)}else{return listenerCount.call(emitter,type)}};EventEmitter.prototype.listenerCount=listenerCount;function listenerCount(type){var events=this._events;if(events!==undefined){var evlistener=events[type];if(typeof evlistener==="function"){return 1}else if(evlistener!==undefined){return evlistener.length}}return 0}EventEmitter.prototype.eventNames=function eventNames(){return this._eventsCount>0?ReflectOwnKeys(this._events):[]};function arrayClone(arr,n){var copy=new Array(n);for(var i=0;i<n;++i)copy[i]=arr[i];return copy}function spliceOne(list,index){for(;index+1<list.length;index++)list[index]=list[index+1];list.pop()}function unwrapListeners(arr){var ret=new Array(arr.length);for(var i=0;i<ret.length;++i){ret[i]=arr[i].listener||arr[i]}return ret}function once(emitter,name){return new Promise(function(resolve,reject){function errorListener(err){emitter.removeListener(name,resolver);reject(err)}function resolver(){if(typeof emitter.removeListener==="function"){emitter.removeListener("error",errorListener)}resolve([].slice.call(arguments))}eventTargetAgnosticAddListener(emitter,name,resolver,{once:true});if(name!=="error"){addErrorHandlerIfEventEmitter(emitter,errorListener,{once:true})}})}function addErrorHandlerIfEventEmitter(emitter,handler,flags){if(typeof emitter.on==="function"){eventTargetAgnosticAddListener(emitter,"error",handler,flags)}}function eventTargetAgnosticAddListener(emitter,name,listener,flags){if(typeof emitter.on==="function"){if(flags.once){emitter.once(name,listener)}else{emitter.on(name,listener)}}else if(typeof emitter.addEventListener==="function"){emitter.addEventListener(name,function wrapListener(arg){if(flags.once){emitter.removeEventListener(name,wrapListener)}listener(arg)})}else{throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof emitter)}}},{}],5:[function(require,module,exports){exports.read=function(buffer,offset,isLE,mLen,nBytes){var e,m;var eLen=nBytes*8-mLen-1;var eMax=(1<<eLen)-1;var eBias=eMax>>1;var nBits=-7;var i=isLE?nBytes-1:0;var d=isLE?-1:1;var s=buffer[offset+i];i+=d;e=s&(1<<-nBits)-1;s>>=-nBits;nBits+=eLen;for(;nBits>0;e=e*256+buffer[offset+i],i+=d,nBits-=8){}m=e&(1<<-nBits)-1;e>>=-nBits;nBits+=mLen;for(;nBits>0;m=m*256+buffer[offset+i],i+=d,nBits-=8){}if(e===0){e=1-eBias}else if(e===eMax){return m?NaN:(s?-1:1)*Infinity}else{m=m+Math.pow(2,mLen);e=e-eBias}return(s?-1:1)*m*Math.pow(2,e-mLen)};exports.write=function(buffer,value,offset,isLE,mLen,nBytes){var e,m,c;var eLen=nBytes*8-mLen-1;var eMax=(1<<eLen)-1;var eBias=eMax>>1;var rt=mLen===23?Math.pow(2,-24)-Math.pow(2,-77):0;var i=isLE?0:nBytes-1;var d=isLE?1:-1;var s=value<0||value===0&&1/value<0?1:0;value=Math.abs(value);if(isNaN(value)||value===Infinity){m=isNaN(value)?1:0;e=eMax}else{e=Math.floor(Math.log(value)/Math.LN2);if(value*(c=Math.pow(2,-e))<1){e--;c*=2}if(e+eBias>=1){value+=rt/c}else{value+=rt*Math.pow(2,1-eBias)}if(value*c>=2){e++;c/=2}if(e+eBias>=eMax){m=0;e=eMax}else if(e+eBias>=1){m=(value*c-1)*Math.pow(2,mLen);e=e+eBias}else{m=value*Math.pow(2,eBias-1)*Math.pow(2,mLen);e=0}}for(;mLen>=8;buffer[offset+i]=m&255,i+=d,m/=256,mLen-=8){}e=e<<mLen|m;eLen+=mLen;for(;eLen>0;buffer[offset+i]=e&255,i+=d,e/=256,eLen-=8){}buffer[offset+i-d]|=s*128}},{}],6:[function(require,module,exports){if(typeof Object.create==="function"){module.exports=function inherits(ctor,superCtor){if(superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}})}}}else{module.exports=function inherits(ctor,superCtor){if(superCtor){ctor.super_=superCtor;var TempCtor=function(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor;ctor.prototype.constructor=ctor}}}},{}],7:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout}else{cachedSetTimeout=defaultSetTimout}}catch(e){cachedSetTimeout=defaultSetTimout}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout}else{cachedClearTimeout=defaultClearTimeout}}catch(e){cachedClearTimeout=defaultClearTimeout}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue)}else{queueIndex=-1}if(queue.length){drainQueue()}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run()}}queueIndex=-1;len=queue.length}currentQueue=null;draining=false;runClearTimeout(timeout)}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i]}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue)}};function Item(fun,array){this.fun=fun;this.array=array}Item.prototype.run=function(){this.fun.apply(null,this.array)};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[]};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0}},{}],8:[function(require,module,exports){var buffer=require("buffer");var Buffer=buffer.Buffer;function copyProps(src,dst){for(var key in src){dst[key]=src[key]}}if(Buffer.from&&Buffer.alloc&&Buffer.allocUnsafe&&Buffer.allocUnsafeSlow){module.exports=buffer}else{copyProps(buffer,exports);exports.Buffer=SafeBuffer}function SafeBuffer(arg,encodingOrOffset,length){return Buffer(arg,encodingOrOffset,length)}SafeBuffer.prototype=Object.create(Buffer.prototype);copyProps(Buffer,SafeBuffer);SafeBuffer.from=function(arg,encodingOrOffset,length){if(typeof arg==="number"){throw new TypeError("Argument must not be a number")}return Buffer(arg,encodingOrOffset,length)};SafeBuffer.alloc=function(size,fill,encoding){if(typeof size!=="number"){throw new TypeError("Argument must be a number")}var buf=Buffer(size);if(fill!==undefined){if(typeof encoding==="string"){buf.fill(fill,encoding)}else{buf.fill(fill)}}else{buf.fill(0)}return buf};SafeBuffer.allocUnsafe=function(size){if(typeof size!=="number"){throw new TypeError("Argument must be a number")}return Buffer(size)};SafeBuffer.allocUnsafeSlow=function(size){if(typeof size!=="number"){throw new TypeError("Argument must be a number")}return buffer.SlowBuffer(size)}},{buffer:3}],9:[function(require,module,exports){module.exports=Stream;var EE=require("events").EventEmitter;var inherits=require("inherits");inherits(Stream,EE);Stream.Readable=require("readable-stream/lib/_stream_readable.js");Stream.Writable=require("readable-stream/lib/_stream_writable.js");Stream.Duplex=require("readable-stream/lib/_stream_duplex.js");Stream.Transform=require("readable-stream/lib/_stream_transform.js");Stream.PassThrough=require("readable-stream/lib/_stream_passthrough.js");Stream.finished=require("readable-stream/lib/internal/streams/end-of-stream.js");Stream.pipeline=require("readable-stream/lib/internal/streams/pipeline.js");Stream.Stream=Stream;function Stream(){EE.call(this)}Stream.prototype.pipe=function(dest,options){var source=this;function ondata(chunk){if(dest.writable){if(false===dest.write(chunk)&&source.pause){source.pause()}}}source.on("data",ondata);function ondrain(){if(source.readable&&source.resume){source.resume()}}dest.on("drain",ondrain);if(!dest._isStdio&&(!options||options.end!==false)){source.on("end",onend);source.on("close",onclose)}var didOnEnd=false;function onend(){if(didOnEnd)return;didOnEnd=true;dest.end()}function onclose(){if(didOnEnd)return;didOnEnd=true;if(typeof dest.destroy==="function")dest.destroy()}function onerror(er){cleanup();if(EE.listenerCount(this,"error")===0){throw er}}source.on("error",onerror);dest.on("error",onerror);function cleanup(){source.removeListener("data",ondata);dest.removeListener("drain",ondrain);source.removeListener("end",onend);source.removeListener("close",onclose);source.removeListener("error",onerror);dest.removeListener("error",onerror);source.removeListener("end",cleanup);source.removeListener("close",cleanup);dest.removeListener("close",cleanup)}source.on("end",cleanup);source.on("close",cleanup);dest.on("close",cleanup);dest.emit("pipe",source);return dest}},{events:4,inherits:6,"readable-stream/lib/_stream_duplex.js":11,"readable-stream/lib/_stream_passthrough.js":12,"readable-stream/lib/_stream_readable.js":13,"readable-stream/lib/_stream_transform.js":14,"readable-stream/lib/_stream_writable.js":15,"readable-stream/lib/internal/streams/end-of-stream.js":19,"readable-stream/lib/internal/streams/pipeline.js":21}],10:[function(require,module,exports){"use strict";function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass}var codes={};function createErrorType(code,message,Base){if(!Base){Base=Error}function getMessage(arg1,arg2,arg3){if(typeof message==="string"){return message}else{return message(arg1,arg2,arg3)}}var NodeError=function(_Base){_inheritsLoose(NodeError,_Base);function NodeError(arg1,arg2,arg3){return _Base.call(this,getMessage(arg1,arg2,arg3))||this}return NodeError}(Base);NodeError.prototype.name=Base.name;NodeError.prototype.code=code;codes[code]=NodeError}function oneOf(expected,thing){if(Array.isArray(expected)){var len=expected.length;expected=expected.map(function(i){return String(i)});if(len>2){return"one of ".concat(thing," ").concat(expected.slice(0,len-1).join(", "),", or ")+expected[len-1]}else if(len===2){return"one of ".concat(thing," ").concat(expected[0]," or ").concat(expected[1])}else{return"of ".concat(thing," ").concat(expected[0])}}else{return"of ".concat(thing," ").concat(String(expected))}}function startsWith(str,search,pos){return str.substr(!pos||pos<0?0:+pos,search.length)===search}function endsWith(str,search,this_len){if(this_len===undefined||this_len>str.length){this_len=str.length}return str.substring(this_len-search.length,this_len)===search}function includes(str,search,start){if(typeof start!=="number"){start=0}if(start+search.length>str.length){return false}else{return str.indexOf(search,start)!==-1}}createErrorType("ERR_INVALID_OPT_VALUE",function(name,value){return'The value "'+value+'" is invalid for option "'+name+'"'},TypeError);createErrorType("ERR_INVALID_ARG_TYPE",function(name,expected,actual){var determiner;if(typeof expected==="string"&&startsWith(expected,"not ")){determiner="must not be";expected=expected.replace(/^not /,"")}else{determiner="must be"}var msg;if(endsWith(name," argument")){msg="The ".concat(name," ").concat(determiner," ").concat(oneOf(expected,"type"))}else{var type=includes(name,".")?"property":"argument";msg='The "'.concat(name,'" ').concat(type," ").concat(determiner," ").concat(oneOf(expected,"type"))}msg+=". Received type ".concat(typeof actual);return msg},TypeError);createErrorType("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");createErrorType("ERR_METHOD_NOT_IMPLEMENTED",function(name){return"The "+name+" method is not implemented"});createErrorType("ERR_STREAM_PREMATURE_CLOSE","Premature close");createErrorType("ERR_STREAM_DESTROYED",function(name){return"Cannot call "+name+" after a stream was destroyed"});createErrorType("ERR_MULTIPLE_CALLBACK","Callback called multiple times");createErrorType("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");createErrorType("ERR_STREAM_WRITE_AFTER_END","write after end");createErrorType("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);createErrorType("ERR_UNKNOWN_ENCODING",function(arg){return"Unknown encoding: "+arg},TypeError);createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");module.exports.codes=codes},{}],11:[function(require,module,exports){(function(process){(function(){"use strict";var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj){keys.push(key)}return keys};module.exports=Duplex;var Readable=require("./_stream_readable");var Writable=require("./_stream_writable");require("inherits")(Duplex,Readable);{var keys=objectKeys(Writable.prototype);for(var v=0;v<keys.length;v++){var method=keys[v];if(!Duplex.prototype[method])Duplex.prototype[method]=Writable.prototype[method]}}function Duplex(options){if(!(this instanceof Duplex))return new Duplex(options);Readable.call(this,options);Writable.call(this,options);this.allowHalfOpen=true;if(options){if(options.readable===false)this.readable=false;if(options.writable===false)this.writable=false;if(options.allowHalfOpen===false){this.allowHalfOpen=false;this.once("end",onend)}}}Object.defineProperty(Duplex.prototype,"writableHighWaterMark",{enumerable:false,get:function get(){return this._writableState.highWaterMark}});Object.defineProperty(Duplex.prototype,"writableBuffer",{enumerable:false,get:function get(){return this._writableState&&this._writableState.getBuffer()}});Object.defineProperty(Duplex.prototype,"writableLength",{enumerable:false,get:function get(){return this._writableState.length}});function onend(){if(this._writableState.ended)return;process.nextTick(onEndNT,this)}function onEndNT(self){self.end()}Object.defineProperty(Duplex.prototype,"destroyed",{enumerable:false,get:function get(){if(this._readableState===undefined||this._writableState===undefined){return false}return this._readableState.destroyed&&this._writableState.destroyed},set:function set(value){if(this._readableState===undefined||this._writableState===undefined){return}this._readableState.destroyed=value;this._writableState.destroyed=value}})}).call(this)}).call(this,require("_process"))},{"./_stream_readable":13,"./_stream_writable":15,_process:7,inherits:6}],12:[function(require,module,exports){"use strict";module.exports=PassThrough;var Transform=require("./_stream_transform");require("inherits")(PassThrough,Transform);function PassThrough(options){if(!(this instanceof PassThrough))return new PassThrough(options);Transform.call(this,options)}PassThrough.prototype._transform=function(chunk,encoding,cb){cb(null,chunk)}},{"./_stream_transform":14,inherits:6}],13:[function(require,module,exports){(function(process,global){(function(){"use strict";module.exports=Readable;var Duplex;Readable.ReadableState=ReadableState;var EE=require("events").EventEmitter;var EElistenerCount=function EElistenerCount(emitter,type){return emitter.listeners(type).length};var Stream=require("./internal/streams/stream");var Buffer=require("buffer").Buffer;var OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(chunk){return Buffer.from(chunk)}function _isUint8Array(obj){return Buffer.isBuffer(obj)||obj instanceof OurUint8Array}var debugUtil=require("util");var debug;if(debugUtil&&debugUtil.debuglog){debug=debugUtil.debuglog("stream")}else{debug=function debug(){}}var BufferList=require("./internal/streams/buffer_list");var destroyImpl=require("./internal/streams/destroy");var _require=require("./internal/streams/state"),getHighWaterMark=_require.getHighWaterMark;var _require$codes=require("../errors").codes,ERR_INVALID_ARG_TYPE=_require$codes.ERR_INVALID_ARG_TYPE,ERR_STREAM_PUSH_AFTER_EOF=_require$codes.ERR_STREAM_PUSH_AFTER_EOF,ERR_METHOD_NOT_IMPLEMENTED=_require$codes.ERR_METHOD_NOT_IMPLEMENTED,ERR_STREAM_UNSHIFT_AFTER_END_EVENT=_require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;var StringDecoder;var createReadableStreamAsyncIterator;var from;require("inherits")(Readable,Stream);var errorOrDestroy=destroyImpl.errorOrDestroy;var kProxyEvents=["error","close","destroy","pause","resume"];function prependListener(emitter,event,fn){if(typeof emitter.prependListener==="function")return emitter.prependListener(event,fn);if(!emitter._events||!emitter._events[event])emitter.on(event,fn);else if(Array.isArray(emitter._events[event]))emitter._events[event].unshift(fn);else emitter._events[event]=[fn,emitter._events[event]]}function ReadableState(options,stream,isDuplex){Duplex=Duplex||require("./_stream_duplex");options=options||{};if(typeof isDuplex!=="boolean")isDuplex=stream instanceof Duplex;this.objectMode=!!options.objectMode;if(isDuplex)this.objectMode=this.objectMode||!!options.readableObjectMode;this.highWaterMark=getHighWaterMark(this,options,"readableHighWaterMark",isDuplex);this.buffer=new BufferList;this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.ended=false;this.endEmitted=false;this.reading=false;this.sync=true;this.needReadable=false;this.emittedReadable=false;this.readableListening=false;this.resumeScheduled=false;this.paused=true;this.emitClose=options.emitClose!==false;this.autoDestroy=!!options.autoDestroy;this.destroyed=false;this.defaultEncoding=options.defaultEncoding||"utf8";this.awaitDrain=0;this.readingMore=false;this.decoder=null;this.encoding=null;if(options.encoding){if(!StringDecoder)StringDecoder=require("string_decoder/").StringDecoder;this.decoder=new StringDecoder(options.encoding);this.encoding=options.encoding}}function Readable(options){Duplex=Duplex||require("./_stream_duplex");if(!(this instanceof Readable))return new Readable(options);var isDuplex=this instanceof Duplex;this._readableState=new ReadableState(options,this,isDuplex);this.readable=true;if(options){if(typeof options.read==="function")this._read=options.read;if(typeof options.destroy==="function")this._destroy=options.destroy}Stream.call(this)}Object.defineProperty(Readable.prototype,"destroyed",{enumerable:false,get:function get(){if(this._readableState===undefined){return false}return this._readableState.destroyed},set:function set(value){if(!this._readableState){return}this._readableState.destroyed=value}});Readable.prototype.destroy=destroyImpl.destroy;Readable.prototype._undestroy=destroyImpl.undestroy;Readable.prototype._destroy=function(err,cb){cb(err)};Readable.prototype.push=function(chunk,encoding){var state=this._readableState;var skipChunkCheck;if(!state.objectMode){if(typeof chunk==="string"){encoding=encoding||state.defaultEncoding;if(encoding!==state.encoding){chunk=Buffer.from(chunk,encoding);encoding=""}skipChunkCheck=true}}else{skipChunkCheck=true}return readableAddChunk(this,chunk,encoding,false,skipChunkCheck)};Readable.prototype.unshift=function(chunk){return readableAddChunk(this,chunk,null,true,false)};function readableAddChunk(stream,chunk,encoding,addToFront,skipChunkCheck){debug("readableAddChunk",chunk);var state=stream._readableState;if(chunk===null){state.reading=false;onEofChunk(stream,state)}else{var er;if(!skipChunkCheck)er=chunkInvalid(state,chunk);if(er){errorOrDestroy(stream,er)}else if(state.objectMode||chunk&&chunk.length>0){if(typeof chunk!=="string"&&!state.objectMode&&Object.getPrototypeOf(chunk)!==Buffer.prototype){chunk=_uint8ArrayToBuffer(chunk)}if(addToFront){if(state.endEmitted)errorOrDestroy(stream,new ERR_STREAM_UNSHIFT_AFTER_END_EVENT);else addChunk(stream,state,chunk,true)}else if(state.ended){errorOrDestroy(stream,new ERR_STREAM_PUSH_AFTER_EOF)}else if(state.destroyed){return false}else{state.reading=false;if(state.decoder&&!encoding){chunk=state.decoder.write(chunk);if(state.objectMode||chunk.length!==0)addChunk(stream,state,chunk,false);else maybeReadMore(stream,state)}else{addChunk(stream,state,chunk,false)}}}else if(!addToFront){state.reading=false;maybeReadMore(stream,state)}}return!state.ended&&(state.length<state.highWaterMark||state.length===0)}function addChunk(stream,state,chunk,addToFront){if(state.flowing&&state.length===0&&!state.sync){state.awaitDrain=0;stream.emit("data",chunk)}else{state.length+=state.objectMode?1:chunk.length;if(addToFront)state.buffer.unshift(chunk);else state.buffer.push(chunk);if(state.needReadable)emitReadable(stream)}maybeReadMore(stream,state)}function chunkInvalid(state,chunk){var er;if(!_isUint8Array(chunk)&&typeof chunk!=="string"&&chunk!==undefined&&!state.objectMode){er=new ERR_INVALID_ARG_TYPE("chunk",["string","Buffer","Uint8Array"],chunk)}return er}Readable.prototype.isPaused=function(){return this._readableState.flowing===false};Readable.prototype.setEncoding=function(enc){if(!StringDecoder)StringDecoder=require("string_decoder/").StringDecoder;var decoder=new StringDecoder(enc);this._readableState.decoder=decoder;this._readableState.encoding=this._readableState.decoder.encoding;var p=this._readableState.buffer.head;var content="";while(p!==null){content+=decoder.write(p.data);p=p.next}this._readableState.buffer.clear();if(content!=="")this._readableState.buffer.push(content);this._readableState.length=content.length;return this};var MAX_HWM=1073741824;function computeNewHighWaterMark(n){if(n>=MAX_HWM){n=MAX_HWM}else{n--;n|=n>>>1;n|=n>>>2;n|=n>>>4;n|=n>>>8;n|=n>>>16;n++}return n}function howMuchToRead(n,state){if(n<=0||state.length===0&&state.ended)return 0;if(state.objectMode)return 1;if(n!==n){if(state.flowing&&state.length)return state.buffer.head.data.length;else return state.length}if(n>state.highWaterMark)state.highWaterMark=computeNewHighWaterMark(n);if(n<=state.length)return n;if(!state.ended){state.needReadable=true;return 0}return state.length}Readable.prototype.read=function(n){debug("read",n);n=parseInt(n,10);var state=this._readableState;var nOrig=n;if(n!==0)state.emittedReadable=false;if(n===0&&state.needReadable&&((state.highWaterMark!==0?state.length>=state.highWaterMark:state.length>0)||state.ended)){debug("read: emitReadable",state.length,state.ended);if(state.length===0&&state.ended)endReadable(this);else emitReadable(this);return null}n=howMuchToRead(n,state);if(n===0&&state.ended){if(state.length===0)endReadable(this);return null}var doRead=state.needReadable;debug("need readable",doRead);if(state.length===0||state.length-n<state.highWaterMark){doRead=true;debug("length less than watermark",doRead)}if(state.ended||state.reading){doRead=false;debug("reading or ended",doRead)}else if(doRead){debug("do read");state.reading=true;state.sync=true;if(state.length===0)state.needReadable=true;this._read(state.highWaterMark);state.sync=false;if(!state.reading)n=howMuchToRead(nOrig,state)}var ret;if(n>0)ret=fromList(n,state);else ret=null;if(ret===null){state.needReadable=state.length<=state.highWaterMark;n=0}else{state.length-=n;state.awaitDrain=0}if(state.length===0){if(!state.ended)state.needReadable=true;if(nOrig!==n&&state.ended)endReadable(this)}if(ret!==null)this.emit("data",ret);return ret};function onEofChunk(stream,state){debug("onEofChunk");if(state.ended)return;if(state.decoder){var chunk=state.decoder.end();if(chunk&&chunk.length){state.buffer.push(chunk);state.length+=state.objectMode?1:chunk.length}}state.ended=true;if(state.sync){emitReadable(stream)}else{state.needReadable=false;if(!state.emittedReadable){state.emittedReadable=true;emitReadable_(stream)}}}function emitReadable(stream){var state=stream._readableState;debug("emitReadable",state.needReadable,state.emittedReadable);state.needReadable=false;if(!state.emittedReadable){debug("emitReadable",state.flowing);state.emittedReadable=true;process.nextTick(emitReadable_,stream)}}function emitReadable_(stream){var state=stream._readableState;debug("emitReadable_",state.destroyed,state.length,state.ended);if(!state.destroyed&&(state.length||state.ended)){stream.emit("readable");state.emittedReadable=false}state.needReadable=!state.flowing&&!state.ended&&state.length<=state.highWaterMark;flow(stream)}function maybeReadMore(stream,state){if(!state.readingMore){state.readingMore=true;process.nextTick(maybeReadMore_,stream,state)}}function maybeReadMore_(stream,state){while(!state.reading&&!state.ended&&(state.length<state.highWaterMark||state.flowing&&state.length===0)){var len=state.length;debug("maybeReadMore read 0");stream.read(0);if(len===state.length)break}state.readingMore=false}Readable.prototype._read=function(n){errorOrDestroy(this,new ERR_METHOD_NOT_IMPLEMENTED("_read()"))};Readable.prototype.pipe=function(dest,pipeOpts){var src=this;var state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest);break}state.pipesCount+=1;debug("pipe count=%d opts=%j",state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==false)&&dest!==process.stdout&&dest!==process.stderr;var endFn=doEnd?onend:unpipe;if(state.endEmitted)process.nextTick(endFn);else src.once("end",endFn);dest.on("unpipe",onunpipe);function onunpipe(readable,unpipeInfo){debug("onunpipe");if(readable===src){if(unpipeInfo&&unpipeInfo.hasUnpiped===false){unpipeInfo.hasUnpiped=true;cleanup()}}}function onend(){debug("onend");dest.end()}var ondrain=pipeOnDrain(src);dest.on("drain",ondrain);var cleanedUp=false;function cleanup(){debug("cleanup");dest.removeListener("close",onclose);dest.removeListener("finish",onfinish);dest.removeListener("drain",ondrain);dest.removeListener("error",onerror);dest.removeListener("unpipe",onunpipe);src.removeListener("end",onend);src.removeListener("end",unpipe);src.removeListener("data",ondata);cleanedUp=true;if(state.awaitDrain&&(!dest._writableState||dest._writableState.needDrain))ondrain()}src.on("data",ondata);function ondata(chunk){debug("ondata");var ret=dest.write(chunk);debug("dest.write",ret);if(ret===false){if((state.pipesCount===1&&state.pipes===dest||state.pipesCount>1&&indexOf(state.pipes,dest)!==-1)&&!cleanedUp){debug("false write response, pause",state.awaitDrain);state.awaitDrain++}src.pause()}}function onerror(er){debug("onerror",er);unpipe();dest.removeListener("error",onerror);if(EElistenerCount(dest,"error")===0)errorOrDestroy(dest,er)}prependListener(dest,"error",onerror);function onclose(){dest.removeListener("finish",onfinish);unpipe()}dest.once("close",onclose);function onfinish(){debug("onfinish");dest.removeListener("close",onclose);unpipe()}dest.once("finish",onfinish);function unpipe(){debug("unpipe");src.unpipe(dest)}dest.emit("pipe",src);if(!state.flowing){debug("pipe resume");src.resume()}return dest};function pipeOnDrain(src){return function pipeOnDrainFunctionResult(){var state=src._readableState;debug("pipeOnDrain",state.awaitDrain);if(state.awaitDrain)state.awaitDrain--;if(state.awaitDrain===0&&EElistenerCount(src,"data")){state.flowing=true;flow(src)}}}Readable.prototype.unpipe=function(dest){var state=this._readableState;var unpipeInfo={hasUnpiped:false};if(state.pipesCount===0)return this;if(state.pipesCount===1){if(dest&&dest!==state.pipes)return this;if(!dest)dest=state.pipes;state.pipes=null;state.pipesCount=0;state.flowing=false;if(dest)dest.emit("unpipe",this,unpipeInfo);return this}if(!dest){var dests=state.pipes;var len=state.pipesCount;state.pipes=null;state.pipesCount=0;state.flowing=false;for(var i=0;i<len;i++){dests[i].emit("unpipe",this,{hasUnpiped:false})}return this}var index=indexOf(state.pipes,dest);if(index===-1)return this;state.pipes.splice(index,1);state.pipesCount-=1;if(state.pipesCount===1)state.pipes=state.pipes[0];dest.emit("unpipe",this,unpipeInfo);return this};Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);var state=this._readableState;if(ev==="data"){state.readableListening=this.listenerCount("readable")>0;if(state.flowing!==false)this.resume()}else if(ev==="readable"){if(!state.endEmitted&&!state.readableListening){state.readableListening=state.needReadable=true;state.flowing=false;state.emittedReadable=false;debug("on readable",state.length,state.reading);if(state.length){emitReadable(this)}else if(!state.reading){process.nextTick(nReadingNextTick,this)}}}return res};Readable.prototype.addListener=Readable.prototype.on;Readable.prototype.removeListener=function(ev,fn){var res=Stream.prototype.removeListener.call(this,ev,fn);if(ev==="readable"){process.nextTick(updateReadableListening,this)}return res};Readable.prototype.removeAllListeners=function(ev){var res=Stream.prototype.removeAllListeners.apply(this,arguments);if(ev==="readable"||ev===undefined){process.nextTick(updateReadableListening,this)}return res};function updateReadableListening(self){var state=self._readableState;state.readableListening=self.listenerCount("readable")>0;if(state.resumeScheduled&&!state.paused){state.flowing=true}else if(self.listenerCount("data")>0){self.resume()}}function nReadingNextTick(self){debug("readable nexttick read 0");self.read(0)}Readable.prototype.resume=function(){var state=this._readableState;if(!state.flowing){debug("resume");state.flowing=!state.readableListening;resume(this,state)}state.paused=false;return this};function resume(stream,state){if(!state.resumeScheduled){state.resumeScheduled=true;process.nextTick(resume_,stream,state)}}function resume_(stream,state){debug("resume",state.reading);if(!state.reading){stream.read(0)}state.resumeScheduled=false;stream.emit("resume");flow(stream);if(state.flowing&&!state.reading)stream.read(0)}Readable.prototype.pause=function(){debug("call pause flowing=%j",this._readableState.flowing);if(this._readableState.flowing!==false){debug("pause");this._readableState.flowing=false;this.emit("pause")}this._readableState.paused=true;return this};function flow(stream){var state=stream._readableState;debug("flow",state.flowing);while(state.flowing&&stream.read()!==null){}}Readable.prototype.wrap=function(stream){var _this=this;var state=this._readableState;var paused=false;stream.on("end",function(){debug("wrapped end");if(state.decoder&&!state.ended){var chunk=state.decoder.end();if(chunk&&chunk.length)_this.push(chunk)}_this.push(null)});stream.on("data",function(chunk){debug("wrapped data");if(state.decoder)chunk=state.decoder.write(chunk);if(state.objectMode&&(chunk===null||chunk===undefined))return;else if(!state.objectMode&&(!chunk||!chunk.length))return;var ret=_this.push(chunk);if(!ret){paused=true;stream.pause()}});for(var i in stream){if(this[i]===undefined&&typeof stream[i]==="function"){this[i]=function methodWrap(method){return function methodWrapReturnFunction(){return stream[method].apply(stream,arguments)}}(i)}}for(var n=0;n<kProxyEvents.length;n++){stream.on(kProxyEvents[n],this.emit.bind(this,kProxyEvents[n]))}this._read=function(n){debug("wrapped _read",n);if(paused){paused=false;stream.resume()}};return this};if(typeof Symbol==="function"){Readable.prototype[Symbol.asyncIterator]=function(){if(createReadableStreamAsyncIterator===undefined){createReadableStreamAsyncIterator=require("./internal/streams/async_iterator")}return createReadableStreamAsyncIterator(this)}}Object.defineProperty(Readable.prototype,"readableHighWaterMark",{enumerable:false,get:function get(){return this._readableState.highWaterMark}});Object.defineProperty(Readable.prototype,"readableBuffer",{enumerable:false,get:function get(){return this._readableState&&this._readableState.buffer}});Object.defineProperty(Readable.prototype,"readableFlowing",{enumerable:false,get:function get(){return this._readableState.flowing},set:function set(state){if(this._readableState){this._readableState.flowing=state}}});Readable._fromList=fromList;Object.defineProperty(Readable.prototype,"readableLength",{enumerable:false,get:function get(){return this._readableState.length}});function fromList(n,state){if(state.length===0)return null;var ret;if(state.objectMode)ret=state.buffer.shift();else if(!n||n>=state.length){if(state.decoder)ret=state.buffer.join("");else if(state.buffer.length===1)ret=state.buffer.first();else ret=state.buffer.concat(state.length);state.buffer.clear()}else{ret=state.buffer.consume(n,state.decoder)}return ret}function endReadable(stream){var state=stream._readableState;debug("endReadable",state.endEmitted);if(!state.endEmitted){state.ended=true;process.nextTick(endReadableNT,state,stream)}}function endReadableNT(state,stream){debug("endReadableNT",state.endEmitted,state.length);if(!state.endEmitted&&state.length===0){state.endEmitted=true;stream.readable=false;stream.emit("end");if(state.autoDestroy){var wState=stream._writableState;if(!wState||wState.autoDestroy&&wState.finished){stream.destroy()}}}}if(typeof Symbol==="function"){Readable.from=function(iterable,opts){if(from===undefined){from=require("./internal/streams/from")}return from(Readable,iterable,opts)}}function indexOf(xs,x){for(var i=0,l=xs.length;i<l;i++){if(xs[i]===x)return i}return-1}}).call(this)}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"../errors":10,"./_stream_duplex":11,"./internal/streams/async_iterator":16,"./internal/streams/buffer_list":17,"./internal/streams/destroy":18,"./internal/streams/from":20,"./internal/streams/state":22,"./internal/streams/stream":23,_process:7,buffer:3,events:4,inherits:6,"string_decoder/":24,util:2}],14:[function(require,module,exports){"use strict";module.exports=Transform;var _require$codes=require("../errors").codes,ERR_METHOD_NOT_IMPLEMENTED=_require$codes.ERR_METHOD_NOT_IMPLEMENTED,ERR_MULTIPLE_CALLBACK=_require$codes.ERR_MULTIPLE_CALLBACK,ERR_TRANSFORM_ALREADY_TRANSFORMING=_require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,ERR_TRANSFORM_WITH_LENGTH_0=_require$codes.ERR_TRANSFORM_WITH_LENGTH_0;var Duplex=require("./_stream_duplex");require("inherits")(Transform,Duplex);function afterTransform(er,data){var ts=this._transformState;ts.transforming=false;var cb=ts.writecb;if(cb===null){return this.emit("error",new ERR_MULTIPLE_CALLBACK)}ts.writechunk=null;ts.writecb=null;if(data!=null)this.push(data);cb(er);var rs=this._readableState;rs.reading=false;if(rs.needReadable||rs.length<rs.highWaterMark){this._read(rs.highWaterMark)}}function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options);this._transformState={afterTransform:afterTransform.bind(this),needTransform:false,transforming:false,writecb:null,writechunk:null,writeencoding:null};this._readableState.needReadable=true;this._readableState.sync=false;if(options){if(typeof options.transform==="function")this._transform=options.transform;if(typeof options.flush==="function")this._flush=options.flush}this.on("prefinish",prefinish)}function prefinish(){var _this=this;if(typeof this._flush==="function"&&!this._readableState.destroyed){this._flush(function(er,data){done(_this,er,data)})}else{done(this,null,null)}}Transform.prototype.push=function(chunk,encoding){this._transformState.needTransform=false;return Duplex.prototype.push.call(this,chunk,encoding)};Transform.prototype._transform=function(chunk,encoding,cb){cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"))};Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;ts.writecb=cb;ts.writechunk=chunk;ts.writeencoding=encoding;if(!ts.transforming){var rs=this._readableState;if(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)this._read(rs.highWaterMark)}};Transform.prototype._read=function(n){var ts=this._transformState;if(ts.writechunk!==null&&!ts.transforming){ts.transforming=true;this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform)}else{ts.needTransform=true}};Transform.prototype._destroy=function(err,cb){Duplex.prototype._destroy.call(this,err,function(err2){cb(err2)})};function done(stream,er,data){if(er)return stream.emit("error",er);if(data!=null)stream.push(data);if(stream._writableState.length)throw new ERR_TRANSFORM_WITH_LENGTH_0;if(stream._transformState.transforming)throw new ERR_TRANSFORM_ALREADY_TRANSFORMING;return stream.push(null)}},{"../errors":10,"./_stream_duplex":11,inherits:6}],15:[function(require,module,exports){(function(process,global){(function(){"use strict";module.exports=Writable;function WriteReq(chunk,encoding,cb){this.chunk=chunk;this.encoding=encoding;this.callback=cb;this.next=null}function CorkedRequest(state){var _this=this;this.next=null;this.entry=null;this.finish=function(){onCorkedFinish(_this,state)}}var Duplex;Writable.WritableState=WritableState;var internalUtil={deprecate:require("util-deprecate")};var Stream=require("./internal/streams/stream");var Buffer=require("buffer").Buffer;var OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(chunk){return Buffer.from(chunk)}function _isUint8Array(obj){return Buffer.isBuffer(obj)||obj instanceof OurUint8Array}var destroyImpl=require("./internal/streams/destroy");var _require=require("./internal/streams/state"),getHighWaterMark=_require.getHighWaterMark;var _require$codes=require("../errors").codes,ERR_INVALID_ARG_TYPE=_require$codes.ERR_INVALID_ARG_TYPE,ERR_METHOD_NOT_IMPLEMENTED=_require$codes.ERR_METHOD_NOT_IMPLEMENTED,ERR_MULTIPLE_CALLBACK=_require$codes.ERR_MULTIPLE_CALLBACK,ERR_STREAM_CANNOT_PIPE=_require$codes.ERR_STREAM_CANNOT_PIPE,ERR_STREAM_DESTROYED=_require$codes.ERR_STREAM_DESTROYED,ERR_STREAM_NULL_VALUES=_require$codes.ERR_STREAM_NULL_VALUES,ERR_STREAM_WRITE_AFTER_END=_require$codes.ERR_STREAM_WRITE_AFTER_END,ERR_UNKNOWN_ENCODING=_require$codes.ERR_UNKNOWN_ENCODING;var errorOrDestroy=destroyImpl.errorOrDestroy;require("inherits")(Writable,Stream);function nop(){}function WritableState(options,stream,isDuplex){Duplex=Duplex||require("./_stream_duplex");options=options||{};if(typeof isDuplex!=="boolean")isDuplex=stream instanceof Duplex;this.objectMode=!!options.objectMode;if(isDuplex)this.objectMode=this.objectMode||!!options.writableObjectMode;this.highWaterMark=getHighWaterMark(this,options,"writableHighWaterMark",isDuplex);this.finalCalled=false;this.needDrain=false;this.ending=false;this.ended=false;this.finished=false;this.destroyed=false;var noDecode=options.decodeStrings===false;this.decodeStrings=!noDecode;this.defaultEncoding=options.defaultEncoding||"utf8";this.length=0;this.writing=false;this.corked=0;this.sync=true;this.bufferProcessing=false;this.onwrite=function(er){onwrite(stream,er)};this.writecb=null;this.writelen=0;this.bufferedRequest=null;this.lastBufferedRequest=null;this.pendingcb=0;this.prefinished=false;this.errorEmitted=false;this.emitClose=options.emitClose!==false;this.autoDestroy=!!options.autoDestroy;this.bufferedRequestCount=0;this.corkedRequestsFree=new CorkedRequest(this)}WritableState.prototype.getBuffer=function getBuffer(){var current=this.bufferedRequest;var out=[];while(current){out.push(current);current=current.next}return out};(function(){try{Object.defineProperty(WritableState.prototype,"buffer",{get:internalUtil.deprecate(function writableStateBufferGetter(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer "+"instead.","DEP0003")})}catch(_){}})();var realHasInstance;if(typeof Symbol==="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]==="function"){realHasInstance=Function.prototype[Symbol.hasInstance];Object.defineProperty(Writable,Symbol.hasInstance,{value:function value(object){if(realHasInstance.call(this,object))return true;if(this!==Writable)return false;return object&&object._writableState instanceof WritableState}})}else{realHasInstance=function realHasInstance(object){return object instanceof this}}function Writable(options){Duplex=Duplex||require("./_stream_duplex");var isDuplex=this instanceof Duplex;if(!isDuplex&&!realHasInstance.call(Writable,this))return new Writable(options);this._writableState=new WritableState(options,this,isDuplex);this.writable=true;if(options){if(typeof options.write==="function")this._write=options.write;if(typeof options.writev==="function")this._writev=options.writev;if(typeof options.destroy==="function")this._destroy=options.destroy;if(typeof options.final==="function")this._final=options.final}Stream.call(this)}Writable.prototype.pipe=function(){errorOrDestroy(this,new ERR_STREAM_CANNOT_PIPE)};function writeAfterEnd(stream,cb){var er=new ERR_STREAM_WRITE_AFTER_END;errorOrDestroy(stream,er);process.nextTick(cb,er)}function validChunk(stream,state,chunk,cb){var er;if(chunk===null){er=new ERR_STREAM_NULL_VALUES}else if(typeof chunk!=="string"&&!state.objectMode){er=new ERR_INVALID_ARG_TYPE("chunk",["string","Buffer"],chunk)}if(er){errorOrDestroy(stream,er);process.nextTick(cb,er);return false}return true}Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState;var ret=false;var isBuf=!state.objectMode&&_isUint8Array(chunk);if(isBuf&&!Buffer.isBuffer(chunk)){chunk=_uint8ArrayToBuffer(chunk)}if(typeof encoding==="function"){cb=encoding;encoding=null}if(isBuf)encoding="buffer";else if(!encoding)encoding=state.defaultEncoding;if(typeof cb!=="function")cb=nop;if(state.ending)writeAfterEnd(this,cb);else if(isBuf||validChunk(this,state,chunk,cb)){state.pendingcb++;ret=writeOrBuffer(this,state,isBuf,chunk,encoding,cb)}return ret};Writable.prototype.cork=function(){this._writableState.corked++};Writable.prototype.uncork=function(){var state=this._writableState;if(state.corked){state.corked--;if(!state.writing&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest)clearBuffer(this,state)}};Writable.prototype.setDefaultEncoding=function setDefaultEncoding(encoding){if(typeof encoding==="string")encoding=encoding.toLowerCase();if(!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((encoding+"").toLowerCase())>-1))throw new ERR_UNKNOWN_ENCODING(encoding);this._writableState.defaultEncoding=encoding;return this};Object.defineProperty(Writable.prototype,"writableBuffer",{enumerable:false,get:function get(){return this._writableState&&this._writableState.getBuffer()}});function decodeChunk(state,chunk,encoding){if(!state.objectMode&&state.decodeStrings!==false&&typeof chunk==="string"){chunk=Buffer.from(chunk,encoding)}return chunk}Object.defineProperty(Writable.prototype,"writableHighWaterMark",{enumerable:false,get:function get(){return this._writableState.highWaterMark}});function writeOrBuffer(stream,state,isBuf,chunk,encoding,cb){if(!isBuf){var newChunk=decodeChunk(state,chunk,encoding);if(chunk!==newChunk){isBuf=true;encoding="buffer";chunk=newChunk}}var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;if(!ret)state.needDrain=true;if(state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest={chunk:chunk,encoding:encoding,isBuf:isBuf,callback:cb,next:null};if(last){last.next=state.lastBufferedRequest}else{state.bufferedRequest=state.lastBufferedRequest}state.bufferedRequestCount+=1}else{doWrite(stream,state,false,len,chunk,encoding,cb)}return ret}function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len;state.writecb=cb;state.writing=true;state.sync=true;if(state.destroyed)state.onwrite(new ERR_STREAM_DESTROYED("write"));else if(writev)stream._writev(chunk,state.onwrite);else stream._write(chunk,encoding,state.onwrite);state.sync=false}function onwriteError(stream,state,sync,er,cb){--state.pendingcb;if(sync){process.nextTick(cb,er);process.nextTick(finishMaybe,stream,state);stream._writableState.errorEmitted=true;errorOrDestroy(stream,er)}else{cb(er);stream._writableState.errorEmitted=true;errorOrDestroy(stream,er);finishMaybe(stream,state)}}function onwriteStateUpdate(state){state.writing=false;state.writecb=null;state.length-=state.writelen;state.writelen=0}function onwrite(stream,er){var state=stream._writableState;var sync=state.sync;var cb=state.writecb;if(typeof cb!=="function")throw new ERR_MULTIPLE_CALLBACK;onwriteStateUpdate(state);if(er)onwriteError(stream,state,sync,er,cb);else{var finished=needFinish(state)||stream.destroyed;if(!finished&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest){clearBuffer(stream,state)}if(sync){process.nextTick(afterWrite,stream,state,finished,cb)}else{afterWrite(stream,state,finished,cb)}}}function afterWrite(stream,state,finished,cb){if(!finished)onwriteDrain(stream,state);state.pendingcb--;cb();finishMaybe(stream,state)}function onwriteDrain(stream,state){if(state.length===0&&state.needDrain){state.needDrain=false;stream.emit("drain")}}function clearBuffer(stream,state){state.bufferProcessing=true;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){var l=state.bufferedRequestCount;var buffer=new Array(l);var holder=state.corkedRequestsFree;holder.entry=entry;var count=0;var allBuffers=true;while(entry){buffer[count]=entry;if(!entry.isBuf)allBuffers=false;entry=entry.next;count+=1}buffer.allBuffers=allBuffers;doWrite(stream,state,true,state.length,buffer,"",holder.finish);state.pendingcb++;state.lastBufferedRequest=null;if(holder.next){state.corkedRequestsFree=holder.next;holder.next=null}else{state.corkedRequestsFree=new CorkedRequest(state)}state.bufferedRequestCount=0}else{while(entry){var chunk=entry.chunk;var encoding=entry.encoding;var cb=entry.callback;var len=state.objectMode?1:chunk.length;doWrite(stream,state,false,len,chunk,encoding,cb);entry=entry.next;state.bufferedRequestCount--;if(state.writing){break}}if(entry===null)state.lastBufferedRequest=null}state.bufferedRequest=entry;state.bufferProcessing=false}Writable.prototype._write=function(chunk,encoding,cb){cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"))};Writable.prototype._writev=null;Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;if(typeof chunk==="function"){cb=chunk;chunk=null;encoding=null}else if(typeof encoding==="function"){cb=encoding;encoding=null}if(chunk!==null&&chunk!==undefined)this.write(chunk,encoding);if(state.corked){state.corked=1;this.uncork()}if(!state.ending)endWritable(this,state,cb);return this};Object.defineProperty(Writable.prototype,"writableLength",{enumerable:false,get:function get(){return this._writableState.length}});function needFinish(state){return state.ending&&state.length===0&&state.bufferedRequest===null&&!state.finished&&!state.writing}function callFinal(stream,state){stream._final(function(err){state.pendingcb--;if(err){errorOrDestroy(stream,err)}state.prefinished=true;stream.emit("prefinish");finishMaybe(stream,state)})}function prefinish(stream,state){if(!state.prefinished&&!state.finalCalled){if(typeof stream._final==="function"&&!state.destroyed){state.pendingcb++;state.finalCalled=true;process.nextTick(callFinal,stream,state)}else{state.prefinished=true;stream.emit("prefinish")}}}function finishMaybe(stream,state){var need=needFinish(state);if(need){prefinish(stream,state);if(state.pendingcb===0){state.finished=true;stream.emit("finish");if(state.autoDestroy){var rState=stream._readableState;if(!rState||rState.autoDestroy&&rState.endEmitted){stream.destroy()}}}}return need}function endWritable(stream,state,cb){state.ending=true;finishMaybe(stream,state);if(cb){if(state.finished)process.nextTick(cb);else stream.once("finish",cb)}state.ended=true;stream.writable=false}function onCorkedFinish(corkReq,state,err){var entry=corkReq.entry;corkReq.entry=null;while(entry){var cb=entry.callback;state.pendingcb--;cb(err);entry=entry.next}state.corkedRequestsFree.next=corkReq}Object.defineProperty(Writable.prototype,"destroyed",{enumerable:false,get:function get(){if(this._writableState===undefined){return false}return this._writableState.destroyed},set:function set(value){if(!this._writableState){return}this._writableState.destroyed=value}});Writable.prototype.destroy=destroyImpl.destroy;Writable.prototype._undestroy=destroyImpl.undestroy;Writable.prototype._destroy=function(err,cb){cb(err)}}).call(this)}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"../errors":10,"./_stream_duplex":11,"./internal/streams/destroy":18,"./internal/streams/state":22,"./internal/streams/stream":23,_process:7,buffer:3,inherits:6,"util-deprecate":25}],16:[function(require,module,exports){(function(process){(function(){"use strict";var _Object$setPrototypeO;function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}var finished=require("./end-of-stream");var kLastResolve=Symbol("lastResolve");var kLastReject=Symbol("lastReject");var kError=Symbol("error");var kEnded=Symbol("ended");var kLastPromise=Symbol("lastPromise");var kHandlePromise=Symbol("handlePromise");var kStream=Symbol("stream");function createIterResult(value,done){return{value:value,done:done}}function readAndResolve(iter){var resolve=iter[kLastResolve];if(resolve!==null){var data=iter[kStream].read();if(data!==null){iter[kLastPromise]=null;iter[kLastResolve]=null;iter[kLastReject]=null;resolve(createIterResult(data,false))}}}function onReadable(iter){process.nextTick(readAndResolve,iter)}function wrapForNext(lastPromise,iter){return function(resolve,reject){lastPromise.then(function(){if(iter[kEnded]){resolve(createIterResult(undefined,true));return}iter[kHandlePromise](resolve,reject)},reject)}}var AsyncIteratorPrototype=Object.getPrototypeOf(function(){});var ReadableStreamAsyncIteratorPrototype=Object.setPrototypeOf((_Object$setPrototypeO={get stream(){return this[kStream]},next:function next(){var _this=this;var error=this[kError];if(error!==null){return Promise.reject(error)}if(this[kEnded]){return Promise.resolve(createIterResult(undefined,true))}if(this[kStream].destroyed){return new Promise(function(resolve,reject){process.nextTick(function(){if(_this[kError]){reject(_this[kError])}else{resolve(createIterResult(undefined,true))}})})}var lastPromise=this[kLastPromise];var promise;if(lastPromise){promise=new Promise(wrapForNext(lastPromise,this))}else{var data=this[kStream].read();if(data!==null){return Promise.resolve(createIterResult(data,false))}promise=new Promise(this[kHandlePromise])}this[kLastPromise]=promise;return promise}},_defineProperty(_Object$setPrototypeO,Symbol.asyncIterator,function(){return this}),_defineProperty(_Object$setPrototypeO,"return",function _return(){var _this2=this;return new Promise(function(resolve,reject){_this2[kStream].destroy(null,function(err){if(err){reject(err);return}resolve(createIterResult(undefined,true))})})}),_Object$setPrototypeO),AsyncIteratorPrototype);var createReadableStreamAsyncIterator=function createReadableStreamAsyncIterator(stream){var _Object$create;var iterator=Object.create(ReadableStreamAsyncIteratorPrototype,(_Object$create={},_defineProperty(_Object$create,kStream,{value:stream,writable:true}),_defineProperty(_Object$create,kLastResolve,{value:null,writable:true}),_defineProperty(_Object$create,kLastReject,{value:null,writable:true}),_defineProperty(_Object$create,kError,{value:null,writable:true}),_defineProperty(_Object$create,kEnded,{value:stream._readableState.endEmitted,writable:true}),_defineProperty(_Object$create,kHandlePromise,{value:function value(resolve,reject){var data=iterator[kStream].read();if(data){iterator[kLastPromise]=null;iterator[kLastResolve]=null;iterator[kLastReject]=null;resolve(createIterResult(data,false))}else{iterator[kLastResolve]=resolve;iterator[kLastReject]=reject}},writable:true}),_Object$create));iterator[kLastPromise]=null;finished(stream,function(err){if(err&&err.code!=="ERR_STREAM_PREMATURE_CLOSE"){var reject=iterator[kLastReject];if(reject!==null){iterator[kLastPromise]=null;iterator[kLastResolve]=null;iterator[kLastReject]=null;reject(err)}iterator[kError]=err;return}var resolve=iterator[kLastResolve];if(resolve!==null){iterator[kLastPromise]=null;iterator[kLastResolve]=null;iterator[kLastReject]=null;resolve(createIterResult(undefined,true))}iterator[kEnded]=true});stream.on("readable",onReadable.bind(null,iterator));return iterator};module.exports=createReadableStreamAsyncIterator}).call(this)}).call(this,require("_process"))},{"./end-of-stream":19,_process:7}],17:[function(require,module,exports){"use strict";function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable});keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source))}else{ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}}return target}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor}var _require=require("buffer"),Buffer=_require.Buffer;var _require2=require("util"),inspect=_require2.inspect;var custom=inspect&&inspect.custom||"inspect";function copyBuffer(src,target,offset){Buffer.prototype.copy.call(src,target,offset)}module.exports=function(){function BufferList(){_classCallCheck(this,BufferList);this.head=null;this.tail=null;this.length=0}_createClass(BufferList,[{key:"push",value:function push(v){var entry={data:v,next:null};if(this.length>0)this.tail.next=entry;else this.head=entry;this.tail=entry;++this.length}},{key:"unshift",value:function unshift(v){var entry={data:v,next:this.head};if(this.length===0)this.tail=entry;this.head=entry;++this.length}},{key:"shift",value:function shift(){if(this.length===0)return;var ret=this.head.data;if(this.length===1)this.head=this.tail=null;else this.head=this.head.next;--this.length;return ret}},{key:"clear",value:function clear(){this.head=this.tail=null;this.length=0}},{key:"join",value:function join(s){if(this.length===0)return"";var p=this.head;var ret=""+p.data;while(p=p.next){ret+=s+p.data}return ret}},{key:"concat",value:function concat(n){if(this.length===0)return Buffer.alloc(0);var ret=Buffer.allocUnsafe(n>>>0);var p=this.head;var i=0;while(p){copyBuffer(p.data,ret,i);i+=p.data.length;p=p.next}return ret}},{key:"consume",value:function consume(n,hasStrings){var ret;if(n<this.head.data.length){ret=this.head.data.slice(0,n);this.head.data=this.head.data.slice(n)}else if(n===this.head.data.length){ret=this.shift()}else{ret=hasStrings?this._getString(n):this._getBuffer(n)}return ret}},{key:"first",value:function first(){return this.head.data}},{key:"_getString",value:function _getString(n){var p=this.head;var c=1;var ret=p.data;n-=ret.length;while(p=p.next){var str=p.data;var nb=n>str.length?str.length:n;if(nb===str.length)ret+=str;else ret+=str.slice(0,n);n-=nb;if(n===0){if(nb===str.length){++c;if(p.next)this.head=p.next;else this.head=this.tail=null}else{this.head=p;p.data=str.slice(nb)}break}++c}this.length-=c;return ret}},{key:"_getBuffer",value:function _getBuffer(n){var ret=Buffer.allocUnsafe(n);var p=this.head;var c=1;p.data.copy(ret);n-=p.data.length;while(p=p.next){var buf=p.data;var nb=n>buf.length?buf.length:n;buf.copy(ret,ret.length-n,0,nb);n-=nb;if(n===0){if(nb===buf.length){++c;if(p.next)this.head=p.next;else this.head=this.tail=null}else{this.head=p;p.data=buf.slice(nb)}break}++c}this.length-=c;return ret}},{key:custom,value:function value(_,options){return inspect(this,_objectSpread({},options,{depth:0,customInspect:false}))}}]);return BufferList}()},{buffer:3,util:2}],18:[function(require,module,exports){(function(process){(function(){"use strict";function destroy(err,cb){var _this=this;var readableDestroyed=this._readableState&&this._readableState.destroyed;var writableDestroyed=this._writableState&&this._writableState.destroyed;if(readableDestroyed||writableDestroyed){if(cb){cb(err)}else if(err){if(!this._writableState){process.nextTick(emitErrorNT,this,err)}else if(!this._writableState.errorEmitted){this._writableState.errorEmitted=true;process.nextTick(emitErrorNT,this,err)}}return this}if(this._readableState){this._readableState.destroyed=true}if(this._writableState){this._writableState.destroyed=true}this._destroy(err||null,function(err){if(!cb&&err){if(!_this._writableState){process.nextTick(emitErrorAndCloseNT,_this,err)}else if(!_this._writableState.errorEmitted){_this._writableState.errorEmitted=true;process.nextTick(emitErrorAndCloseNT,_this,err)}else{process.nextTick(emitCloseNT,_this)}}else if(cb){process.nextTick(emitCloseNT,_this);cb(err)}else{process.nextTick(emitCloseNT,_this)}});return this}function emitErrorAndCloseNT(self,err){emitErrorNT(self,err);emitCloseNT(self)}function emitCloseNT(self){if(self._writableState&&!self._writableState.emitClose)return;if(self._readableState&&!self._readableState.emitClose)return;self.emit("close")}function undestroy(){if(this._readableState){this._readableState.destroyed=false;this._readableState.reading=false;this._readableState.ended=false;this._readableState.endEmitted=false}if(this._writableState){this._writableState.destroyed=false;this._writableState.ended=false;this._writableState.ending=false;this._writableState.finalCalled=false;this._writableState.prefinished=false;this._writableState.finished=false;this._writableState.errorEmitted=false}}function emitErrorNT(self,err){self.emit("error",err)}function errorOrDestroy(stream,err){var rState=stream._readableState;var wState=stream._writableState;if(rState&&rState.autoDestroy||wState&&wState.autoDestroy)stream.destroy(err);else stream.emit("error",err)}module.exports={destroy:destroy,undestroy:undestroy,errorOrDestroy:errorOrDestroy}}).call(this)}).call(this,require("_process"))},{_process:7}],19:[function(require,module,exports){"use strict";var ERR_STREAM_PREMATURE_CLOSE=require("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;function once(callback){var called=false;return function(){if(called)return;called=true;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}callback.apply(this,args)}}function noop(){}function isRequest(stream){return stream.setHeader&&typeof stream.abort==="function"}function eos(stream,opts,callback){if(typeof opts==="function")return eos(stream,null,opts);if(!opts)opts={};callback=once(callback||noop);var readable=opts.readable||opts.readable!==false&&stream.readable;var writable=opts.writable||opts.writable!==false&&stream.writable;var onlegacyfinish=function onlegacyfinish(){if(!stream.writable)onfinish()};var writableEnded=stream._writableState&&stream._writableState.finished;var onfinish=function onfinish(){writable=false;writableEnded=true;if(!readable)callback.call(stream)};var readableEnded=stream._readableState&&stream._readableState.endEmitted;var onend=function onend(){readable=false;readableEnded=true;if(!writable)callback.call(stream)};var onerror=function onerror(err){callback.call(stream,err)};var onclose=function onclose(){var err;if(readable&&!readableEnded){if(!stream._readableState||!stream._readableState.ended)err=new ERR_STREAM_PREMATURE_CLOSE;return callback.call(stream,err)}if(writable&&!writableEnded){if(!stream._writableState||!stream._writableState.ended)err=new ERR_STREAM_PREMATURE_CLOSE;return callback.call(stream,err)}};var onrequest=function onrequest(){stream.req.on("finish",onfinish)};if(isRequest(stream)){stream.on("complete",onfinish);stream.on("abort",onclose);if(stream.req)onrequest();else stream.on("request",onrequest)}else if(writable&&!stream._writableState){stream.on("end",onlegacyfinish);stream.on("close",onlegacyfinish)}stream.on("end",onend);stream.on("finish",onfinish);if(opts.error!==false)stream.on("error",onerror);stream.on("close",onclose);return function(){stream.removeListener("complete",onfinish);stream.removeListener("abort",onclose);stream.removeListener("request",onrequest);if(stream.req)stream.req.removeListener("finish",onfinish);stream.removeListener("end",onlegacyfinish);stream.removeListener("close",onlegacyfinish);stream.removeListener("finish",onfinish);stream.removeListener("end",onend);stream.removeListener("error",onerror);stream.removeListener("close",onclose)}}module.exports=eos},{"../../../errors":10}],20:[function(require,module,exports){module.exports=function(){throw new Error("Readable.from is not available in the browser")}},{}],21:[function(require,module,exports){"use strict";var eos;function once(callback){var called=false;return function(){if(called)return;called=true;callback.apply(void 0,arguments)}}var _require$codes=require("../../../errors").codes,ERR_MISSING_ARGS=_require$codes.ERR_MISSING_ARGS,ERR_STREAM_DESTROYED=_require$codes.ERR_STREAM_DESTROYED;function noop(err){if(err)throw err}function isRequest(stream){return stream.setHeader&&typeof stream.abort==="function"}function destroyer(stream,reading,writing,callback){callback=once(callback);var closed=false;stream.on("close",function(){closed=true});if(eos===undefined)eos=require("./end-of-stream");eos(stream,{readable:reading,writable:writing},function(err){if(err)return callback(err);closed=true;callback()});var destroyed=false;return function(err){if(closed)return;if(destroyed)return;destroyed=true;if(isRequest(stream))return stream.abort();if(typeof stream.destroy==="function")return stream.destroy();callback(err||new ERR_STREAM_DESTROYED("pipe"))}}function call(fn){fn()}function pipe(from,to){return from.pipe(to)}function popCallback(streams){if(!streams.length)return noop;if(typeof streams[streams.length-1]!=="function")return noop;return streams.pop()}function pipeline(){for(var _len=arguments.length,streams=new Array(_len),_key=0;_key<_len;_key++){streams[_key]=arguments[_key]}var callback=popCallback(streams);if(Array.isArray(streams[0]))streams=streams[0];if(streams.length<2){throw new ERR_MISSING_ARGS("streams")}var error;var destroys=streams.map(function(stream,i){var reading=i<streams.length-1;var writing=i>0;return destroyer(stream,reading,writing,function(err){if(!error)error=err;if(err)destroys.forEach(call);if(reading)return;destroys.forEach(call);callback(error)})});return streams.reduce(pipe)}module.exports=pipeline},{"../../../errors":10,"./end-of-stream":19}],22:[function(require,module,exports){"use strict";var ERR_INVALID_OPT_VALUE=require("../../../errors").codes.ERR_INVALID_OPT_VALUE;function highWaterMarkFrom(options,isDuplex,duplexKey){return options.highWaterMark!=null?options.highWaterMark:isDuplex?options[duplexKey]:null}function getHighWaterMark(state,options,duplexKey,isDuplex){var hwm=highWaterMarkFrom(options,isDuplex,duplexKey);if(hwm!=null){if(!(isFinite(hwm)&&Math.floor(hwm)===hwm)||hwm<0){var name=isDuplex?duplexKey:"highWaterMark";throw new ERR_INVALID_OPT_VALUE(name,hwm)}return Math.floor(hwm)}return state.objectMode?16:16*1024}module.exports={getHighWaterMark:getHighWaterMark}},{"../../../errors":10}],23:[function(require,module,exports){module.exports=require("events").EventEmitter},{events:4}],24:[function(require,module,exports){"use strict";var Buffer=require("safe-buffer").Buffer;var isEncoding=Buffer.isEncoding||function(encoding){encoding=""+encoding;switch(encoding&&encoding.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return true;default:return false}};function _normalizeEncoding(enc){if(!enc)return"utf8";var retried;while(true){switch(enc){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return enc;default:if(retried)return;enc=(""+enc).toLowerCase();retried=true}}}function normalizeEncoding(enc){var nenc=_normalizeEncoding(enc);if(typeof nenc!=="string"&&(Buffer.isEncoding===isEncoding||!isEncoding(enc)))throw new Error("Unknown encoding: "+enc);return nenc||enc}exports.StringDecoder=StringDecoder;function StringDecoder(encoding){this.encoding=normalizeEncoding(encoding);var nb;switch(this.encoding){case"utf16le":this.text=utf16Text;this.end=utf16End;nb=4;break;case"utf8":this.fillLast=utf8FillLast;nb=4;break;case"base64":this.text=base64Text;this.end=base64End;nb=3;break;default:this.write=simpleWrite;this.end=simpleEnd;return}this.lastNeed=0;this.lastTotal=0;this.lastChar=Buffer.allocUnsafe(nb)}StringDecoder.prototype.write=function(buf){if(buf.length===0)return"";var r;var i;if(this.lastNeed){r=this.fillLast(buf);if(r===undefined)return"";i=this.lastNeed;this.lastNeed=0}else{i=0}if(i<buf.length)return r?r+this.text(buf,i):this.text(buf,i);return r||""};StringDecoder.prototype.end=utf8End;StringDecoder.prototype.text=utf8Text;StringDecoder.prototype.fillLast=function(buf){if(this.lastNeed<=buf.length){buf.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed);return this.lastChar.toString(this.encoding,0,this.lastTotal)}buf.copy(this.lastChar,this.lastTotal-this.lastNeed,0,buf.length);this.lastNeed-=buf.length};function utf8CheckByte(byte){if(byte<=127)return 0;else if(byte>>5===6)return 2;else if(byte>>4===14)return 3;else if(byte>>3===30)return 4;return byte>>6===2?-1:-2}function utf8CheckIncomplete(self,buf,i){var j=buf.length-1;if(j<i)return 0;var nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0)self.lastNeed=nb-1;return nb}if(--j<i||nb===-2)return 0;nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0)self.lastNeed=nb-2;return nb}if(--j<i||nb===-2)return 0;nb=utf8CheckByte(buf[j]);if(nb>=0){if(nb>0){if(nb===2)nb=0;else self.lastNeed=nb-3}return nb}return 0}function utf8CheckExtraBytes(self,buf,p){if((buf[0]&192)!==128){self.lastNeed=0;return"�"}if(self.lastNeed>1&&buf.length>1){if((buf[1]&192)!==128){self.lastNeed=1;return"�"}if(self.lastNeed>2&&buf.length>2){if((buf[2]&192)!==128){self.lastNeed=2;return"�"}}}}function utf8FillLast(buf){var p=this.lastTotal-this.lastNeed;var r=utf8CheckExtraBytes(this,buf,p);if(r!==undefined)return r;if(this.lastNeed<=buf.length){buf.copy(this.lastChar,p,0,this.lastNeed);return this.lastChar.toString(this.encoding,0,this.lastTotal)}buf.copy(this.lastChar,p,0,buf.length);this.lastNeed-=buf.length}function utf8Text(buf,i){var total=utf8CheckIncomplete(this,buf,i);if(!this.lastNeed)return buf.toString("utf8",i);this.lastTotal=total;var end=buf.length-(total-this.lastNeed);buf.copy(this.lastChar,0,end);return buf.toString("utf8",i,end)}function utf8End(buf){var r=buf&&buf.length?this.write(buf):"";if(this.lastNeed)return r+"�";return r}function utf16Text(buf,i){if((buf.length-i)%2===0){var r=buf.toString("utf16le",i);if(r){var c=r.charCodeAt(r.length-1);if(c>=55296&&c<=56319){this.lastNeed=2;this.lastTotal=4;this.lastChar[0]=buf[buf.length-2];this.lastChar[1]=buf[buf.length-1];return r.slice(0,-1)}}return r}this.lastNeed=1;this.lastTotal=2;this.lastChar[0]=buf[buf.length-1];return buf.toString("utf16le",i,buf.length-1)}function utf16End(buf){var r=buf&&buf.length?this.write(buf):"";if(this.lastNeed){var end=this.lastTotal-this.lastNeed;return r+this.lastChar.toString("utf16le",0,end)}return r}function base64Text(buf,i){var n=(buf.length-i)%3;if(n===0)return buf.toString("base64",i);this.lastNeed=3-n;this.lastTotal=3;if(n===1){this.lastChar[0]=buf[buf.length-1]}else{this.lastChar[0]=buf[buf.length-2];this.lastChar[1]=buf[buf.length-1]}return buf.toString("base64",i,buf.length-n)}function base64End(buf){var r=buf&&buf.length?this.write(buf):"";if(this.lastNeed)return r+this.lastChar.toString("base64",0,3-this.lastNeed);return r}function simpleWrite(buf){return buf.toString(this.encoding)}function simpleEnd(buf){return buf&&buf.length?this.write(buf):""}},{"safe-buffer":8}],25:[function(require,module,exports){(function(global){(function(){module.exports=deprecate;function deprecate(fn,msg){if(config("noDeprecation")){return fn}var warned=false;function deprecated(){if(!warned){if(config("throwDeprecation")){throw new Error(msg)}else if(config("traceDeprecation")){console.trace(msg)}else{console.warn(msg)}warned=true}return fn.apply(this,arguments)}return deprecated}function config(name){try{if(!global.localStorage)return false}catch(_){return false}var val=global.localStorage[name];if(null==val)return false;return String(val).toLowerCase()==="true"}}).call(this)}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],26:[function(require,module,exports){var run=async function(){var bs58check=require("bs58check");window.bs58check=bs58check};run()},{bs58check:30}],27:[function(require,module,exports){"use strict";var _Buffer=require("safe-buffer").Buffer;function base(ALPHABET){if(ALPHABET.length>=255){throw new TypeError("Alphabet too long")}var BASE_MAP=new Uint8Array(256);for(var j=0;j<BASE_MAP.length;j++){BASE_MAP[j]=255}for(var i=0;i<ALPHABET.length;i++){var x=ALPHABET.charAt(i);var xc=x.charCodeAt(0);if(BASE_MAP[xc]!==255){throw new TypeError(x+" is ambiguous")}BASE_MAP[xc]=i}var BASE=ALPHABET.length;var LEADER=ALPHABET.charAt(0);var FACTOR=Math.log(BASE)/Math.log(256);var iFACTOR=Math.log(256)/Math.log(BASE);function encode(source){if(Array.isArray(source)||source instanceof Uint8Array){source=_Buffer.from(source)}if(!_Buffer.isBuffer(source)){throw new TypeError("Expected Buffer")}if(source.length===0){return""}var zeroes=0;var length=0;var pbegin=0;var pend=source.length;while(pbegin!==pend&&source[pbegin]===0){pbegin++;zeroes++}var size=(pend-pbegin)*iFACTOR+1>>>0;var b58=new Uint8Array(size);while(pbegin!==pend){var carry=source[pbegin];var i=0;for(var it1=size-1;(carry!==0||i<length)&&it1!==-1;it1--,i++){carry+=256*b58[it1]>>>0;b58[it1]=carry%BASE>>>0;carry=carry/BASE>>>0}if(carry!==0){throw new Error("Non-zero carry")}length=i;pbegin++}var it2=size-length;while(it2!==size&&b58[it2]===0){it2++}var str=LEADER.repeat(zeroes);for(;it2<size;++it2){str+=ALPHABET.charAt(b58[it2])}return str}function decodeUnsafe(source){if(typeof source!=="string"){throw new TypeError("Expected String")}if(source.length===0){return _Buffer.alloc(0)}var psz=0;if(source[psz]===" "){return}var zeroes=0;var length=0;while(source[psz]===LEADER){zeroes++;psz++}var size=(source.length-psz)*FACTOR+1>>>0;var b256=new Uint8Array(size);while(source[psz]){var carry=BASE_MAP[source.charCodeAt(psz)];if(carry===255){return}var i=0;for(var it3=size-1;(carry!==0||i<length)&&it3!==-1;it3--,i++){carry+=BASE*b256[it3]>>>0;b256[it3]=carry%256>>>0;carry=carry/256>>>0}if(carry!==0){throw new Error("Non-zero carry")}length=i;psz++}if(source[psz]===" "){return}var it4=size-length;while(it4!==size&&b256[it4]===0){it4++}var vch=_Buffer.allocUnsafe(zeroes+(size-it4));vch.fill(0,0,zeroes);var j=zeroes;while(it4!==size){vch[j++]=b256[it4++]}return vch}function decode(string){var buffer=decodeUnsafe(string);if(buffer){return buffer}throw new Error("Non-base"+BASE+" character")}return{encode:encode,decodeUnsafe:decodeUnsafe,decode:decode}}module.exports=base},{"safe-buffer":52}],28:[function(require,module,exports){var basex=require("base-x");var ALPHABET="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";module.exports=basex(ALPHABET)},{"base-x":27}],29:[function(require,module,exports){"use strict";var base58=require("bs58");var Buffer=require("safe-buffer").Buffer;module.exports=function(checksumFn){function encode(payload){var checksum=checksumFn(payload);return base58.encode(Buffer.concat([payload,checksum],payload.length+4))}function decodeRaw(buffer){var payload=buffer.slice(0,-4);var checksum=buffer.slice(-4);var newChecksum=checksumFn(payload);if(checksum[0]^newChecksum[0]|checksum[1]^newChecksum[1]|checksum[2]^newChecksum[2]|checksum[3]^newChecksum[3])return;return payload}function decodeUnsafe(string){var buffer=base58.decodeUnsafe(string);if(!buffer)return;return decodeRaw(buffer)}function decode(string){var buffer=base58.decode(string);var payload=decodeRaw(buffer,checksumFn);if(!payload)throw new Error("Invalid checksum");return payload}return{encode:encode,decode:decode,decodeUnsafe:decodeUnsafe}}},{bs58:28,"safe-buffer":52}],30:[function(require,module,exports){"use strict";var createHash=require("create-hash");var bs58checkBase=require("./base");function sha256x2(buffer){var tmp=createHash("sha256").update(buffer).digest();return createHash("sha256").update(tmp).digest()}module.exports=bs58checkBase(sha256x2)},{"./base":29,"create-hash":32}],31:[function(require,module,exports){var Buffer=require("safe-buffer").Buffer;var Transform=require("stream").Transform;var StringDecoder=require("string_decoder").StringDecoder;var inherits=require("inherits");function CipherBase(hashMode){Transform.call(this);this.hashMode=typeof hashMode==="string";if(this.hashMode){this[hashMode]=this._finalOrDigest}else{this.final=this._finalOrDigest}if(this._final){this.__final=this._final;this._final=null}this._decoder=null;this._encoding=null}inherits(CipherBase,Transform);CipherBase.prototype.update=function(data,inputEnc,outputEnc){if(typeof data==="string"){data=Buffer.from(data,inputEnc)}var outData=this._update(data);if(this.hashMode)return this;if(outputEnc){outData=this._toString(outData,outputEnc)}return outData};CipherBase.prototype.setAutoPadding=function(){};CipherBase.prototype.getAuthTag=function(){throw new Error("trying to get auth tag in unsupported state")};CipherBase.prototype.setAuthTag=function(){throw new Error("trying to set auth tag in unsupported state")};CipherBase.prototype.setAAD=function(){throw new Error("trying to set aad in unsupported state")};CipherBase.prototype._transform=function(data,_,next){var err;try{if(this.hashMode){this._update(data)}else{this.push(this._update(data))}}catch(e){err=e}finally{next(err)}};CipherBase.prototype._flush=function(done){var err;try{this.push(this.__final())}catch(e){err=e}done(err)};CipherBase.prototype._finalOrDigest=function(outputEnc){var outData=this.__final()||Buffer.alloc(0);if(outputEnc){outData=this._toString(outData,outputEnc,true)}return outData};CipherBase.prototype._toString=function(value,enc,fin){if(!this._decoder){this._decoder=new StringDecoder(enc);this._encoding=enc}if(this._encoding!==enc)throw new Error("can't switch encodings");var out=this._decoder.write(value);if(fin){out+=this._decoder.end()}return out};module.exports=CipherBase},{inherits:34,"safe-buffer":52,stream:9,string_decoder:24}],32:[function(require,module,exports){"use strict";var inherits=require("inherits");var MD5=require("md5.js");var RIPEMD160=require("ripemd160");var sha=require("sha.js");var Base=require("cipher-base");function Hash(hash){Base.call(this,"digest");this._hash=hash}inherits(Hash,Base);Hash.prototype._update=function(data){this._hash.update(data)};Hash.prototype._final=function(){return this._hash.digest()};module.exports=function createHash(alg){alg=alg.toLowerCase();if(alg==="md5")return new MD5;if(alg==="rmd160"||alg==="ripemd160")return new RIPEMD160;return new Hash(sha(alg))}},{"cipher-base":31,inherits:34,"md5.js":35,ripemd160:51,"sha.js":54}],33:[function(require,module,exports){"use strict";var Buffer=require("safe-buffer").Buffer;var Transform=require("readable-stream").Transform;var inherits=require("inherits");function throwIfNotStringOrBuffer(val,prefix){if(!Buffer.isBuffer(val)&&typeof val!=="string"){throw new TypeError(prefix+" must be a string or a buffer")}}function HashBase(blockSize){Transform.call(this);this._block=Buffer.allocUnsafe(blockSize);this._blockSize=blockSize;this._blockOffset=0;this._length=[0,0,0,0];this._finalized=false}inherits(HashBase,Transform);HashBase.prototype._transform=function(chunk,encoding,callback){var error=null;try{this.update(chunk,encoding)}catch(err){error=err}callback(error)};HashBase.prototype._flush=function(callback){var error=null;try{this.push(this.digest())}catch(err){error=err}callback(error)};HashBase.prototype.update=function(data,encoding){throwIfNotStringOrBuffer(data,"Data");if(this._finalized)throw new Error("Digest already called");if(!Buffer.isBuffer(data))data=Buffer.from(data,encoding);var block=this._block;var offset=0;while(this._blockOffset+data.length-offset>=this._blockSize){for(var i=this._blockOffset;i<this._blockSize;)block[i++]=data[offset++];this._update();this._blockOffset=0}while(offset<data.length)block[this._blockOffset++]=data[offset++];for(var j=0,carry=data.length*8;carry>0;++j){this._length[j]+=carry;carry=this._length[j]/4294967296|0;if(carry>0)this._length[j]-=4294967296*carry}return this};HashBase.prototype._update=function(){throw new Error("_update is not implemented")};HashBase.prototype.digest=function(encoding){if(this._finalized)throw new Error("Digest already called");this._finalized=true;var digest=this._digest();if(encoding!==undefined)digest=digest.toString(encoding);this._block.fill(0);this._blockOffset=0;for(var i=0;i<4;++i)this._length[i]=0;return digest};HashBase.prototype._digest=function(){throw new Error("_digest is not implemented")};module.exports=HashBase},{inherits:34,"readable-stream":50,"safe-buffer":52}],34:[function(require,module,exports){arguments[4][6][0].apply(exports,arguments)},{dup:6}],35:[function(require,module,exports){"use strict";var inherits=require("inherits");var HashBase=require("hash-base");var Buffer=require("safe-buffer").Buffer;var ARRAY16=new Array(16);function MD5(){HashBase.call(this,64);this._a=1732584193;this._b=4023233417;this._c=2562383102;this._d=271733878}inherits(MD5,HashBase);MD5.prototype._update=function(){var M=ARRAY16;for(var i=0;i<16;++i)M[i]=this._block.readInt32LE(i*4);var a=this._a;var b=this._b;var c=this._c;var d=this._d;a=fnF(a,b,c,d,M[0],3614090360,7);d=fnF(d,a,b,c,M[1],3905402710,12);c=fnF(c,d,a,b,M[2],606105819,17);b=fnF(b,c,d,a,M[3],3250441966,22);a=fnF(a,b,c,d,M[4],4118548399,7);d=fnF(d,a,b,c,M[5],1200080426,12);c=fnF(c,d,a,b,M[6],2821735955,17);b=fnF(b,c,d,a,M[7],4249261313,22);a=fnF(a,b,c,d,M[8],1770035416,7);d=fnF(d,a,b,c,M[9],2336552879,12);c=fnF(c,d,a,b,M[10],4294925233,17);b=fnF(b,c,d,a,M[11],2304563134,22);a=fnF(a,b,c,d,M[12],1804603682,7);d=fnF(d,a,b,c,M[13],4254626195,12);c=fnF(c,d,a,b,M[14],2792965006,17);b=fnF(b,c,d,a,M[15],1236535329,22);a=fnG(a,b,c,d,M[1],4129170786,5);d=fnG(d,a,b,c,M[6],3225465664,9);c=fnG(c,d,a,b,M[11],643717713,14);b=fnG(b,c,d,a,M[0],3921069994,20);a=fnG(a,b,c,d,M[5],3593408605,5);d=fnG(d,a,b,c,M[10],38016083,9);c=fnG(c,d,a,b,M[15],3634488961,14);b=fnG(b,c,d,a,M[4],3889429448,20);a=fnG(a,b,c,d,M[9],568446438,5);d=fnG(d,a,b,c,M[14],3275163606,9);c=fnG(c,d,a,b,M[3],4107603335,14);b=fnG(b,c,d,a,M[8],1163531501,20);a=fnG(a,b,c,d,M[13],2850285829,5);d=fnG(d,a,b,c,M[2],4243563512,9);c=fnG(c,d,a,b,M[7],1735328473,14);b=fnG(b,c,d,a,M[12],2368359562,20);a=fnH(a,b,c,d,M[5],4294588738,4);d=fnH(d,a,b,c,M[8],2272392833,11);c=fnH(c,d,a,b,M[11],1839030562,16);b=fnH(b,c,d,a,M[14],4259657740,23);a=fnH(a,b,c,d,M[1],2763975236,4);d=fnH(d,a,b,c,M[4],1272893353,11);c=fnH(c,d,a,b,M[7],4139469664,16);b=fnH(b,c,d,a,M[10],3200236656,23);a=fnH(a,b,c,d,M[13],681279174,4);d=fnH(d,a,b,c,M[0],3936430074,11);c=fnH(c,d,a,b,M[3],3572445317,16);b=fnH(b,c,d,a,M[6],76029189,23);a=fnH(a,b,c,d,M[9],3654602809,4);d=fnH(d,a,b,c,M[12],3873151461,11);c=fnH(c,d,a,b,M[15],530742520,16);b=fnH(b,c,d,a,M[2],3299628645,23);a=fnI(a,b,c,d,M[0],4096336452,6);d=fnI(d,a,b,c,M[7],1126891415,10);c=fnI(c,d,a,b,M[14],2878612391,15);b=fnI(b,c,d,a,M[5],4237533241,21);a=fnI(a,b,c,d,M[12],1700485571,6);d=fnI(d,a,b,c,M[3],2399980690,10);c=fnI(c,d,a,b,M[10],4293915773,15);b=fnI(b,c,d,a,M[1],2240044497,21);a=fnI(a,b,c,d,M[8],1873313359,6);d=fnI(d,a,b,c,M[15],4264355552,10);c=fnI(c,d,a,b,M[6],2734768916,15);b=fnI(b,c,d,a,M[13],1309151649,21);a=fnI(a,b,c,d,M[4],4149444226,6);d=fnI(d,a,b,c,M[11],3174756917,10);c=fnI(c,d,a,b,M[2],718787259,15);b=fnI(b,c,d,a,M[9],3951481745,21);this._a=this._a+a|0;this._b=this._b+b|0;this._c=this._c+c|0;this._d=this._d+d|0};MD5.prototype._digest=function(){this._block[this._blockOffset++]=128;if(this._blockOffset>56){this._block.fill(0,this._blockOffset,64);this._update();this._blockOffset=0}this._block.fill(0,this._blockOffset,56);this._block.writeUInt32LE(this._length[0],56);this._block.writeUInt32LE(this._length[1],60);this._update();var buffer=Buffer.allocUnsafe(16);buffer.writeInt32LE(this._a,0);buffer.writeInt32LE(this._b,4);buffer.writeInt32LE(this._c,8);buffer.writeInt32LE(this._d,12);return buffer};function rotl(x,n){return x<<n|x>>>32-n}function fnF(a,b,c,d,m,k,s){return rotl(a+(b&c|~b&d)+m+k|0,s)+b|0}function fnG(a,b,c,d,m,k,s){return rotl(a+(b&d|c&~d)+m+k|0,s)+b|0}function fnH(a,b,c,d,m,k,s){return rotl(a+(b^c^d)+m+k|0,s)+b|0}function fnI(a,b,c,d,m,k,s){return rotl(a+(c^(b|~d))+m+k|0,s)+b|0}module.exports=MD5},{"hash-base":33,inherits:34,"safe-buffer":52}],36:[function(require,module,exports){arguments[4][10][0].apply(exports,arguments)},{dup:10}],37:[function(require,module,exports){arguments[4][11][0].apply(exports,arguments)},{"./_stream_readable":39,"./_stream_writable":41,_process:7,dup:11,inherits:34}],38:[function(require,module,exports){arguments[4][12][0].apply(exports,arguments)},{"./_stream_transform":40,dup:12,inherits:34}],39:[function(require,module,exports){arguments[4][13][0].apply(exports,arguments)},{"../errors":36,"./_stream_duplex":37,"./internal/streams/async_iterator":42,"./internal/streams/buffer_list":43,"./internal/streams/destroy":44,"./internal/streams/from":46,"./internal/streams/state":48,"./internal/streams/stream":49,_process:7,buffer:3,dup:13,events:4,inherits:34,"string_decoder/":61,util:2}],40:[function(require,module,exports){arguments[4][14][0].apply(exports,arguments)},{"../errors":36,"./_stream_duplex":37,dup:14,inherits:34}],41:[function(require,module,exports){arguments[4][15][0].apply(exports,arguments)},{"../errors":36,"./_stream_duplex":37,"./internal/streams/destroy":44,"./internal/streams/state":48,"./internal/streams/stream":49,_process:7,buffer:3,dup:15,inherits:34,"util-deprecate":62}],42:[function(require,module,exports){arguments[4][16][0].apply(exports,arguments)},{"./end-of-stream":45,_process:7,dup:16}],43:[function(require,module,exports){arguments[4][17][0].apply(exports,arguments)},{buffer:3,dup:17,util:2}],44:[function(require,module,exports){arguments[4][18][0].apply(exports,arguments)},{_process:7,dup:18}],45:[function(require,module,exports){arguments[4][19][0].apply(exports,arguments)},{"../../../errors":36,dup:19}],46:[function(require,module,exports){arguments[4][20][0].apply(exports,arguments)},{dup:20}],47:[function(require,module,exports){arguments[4][21][0].apply(exports,arguments)},{"../../../errors":36,"./end-of-stream":45,dup:21}],48:[function(require,module,exports){arguments[4][22][0].apply(exports,arguments)},{"../../../errors":36,dup:22}],49:[function(require,module,exports){arguments[4][23][0].apply(exports,arguments)},{dup:23,events:4}],50:[function(require,module,exports){exports=module.exports=require("./lib/_stream_readable.js");exports.Stream=exports;exports.Readable=exports;exports.Writable=require("./lib/_stream_writable.js");exports.Duplex=require("./lib/_stream_duplex.js");exports.Transform=require("./lib/_stream_transform.js");exports.PassThrough=require("./lib/_stream_passthrough.js");exports.finished=require("./lib/internal/streams/end-of-stream.js");exports.pipeline=require("./lib/internal/streams/pipeline.js")},{"./lib/_stream_duplex.js":37,"./lib/_stream_passthrough.js":38,"./lib/_stream_readable.js":39,"./lib/_stream_transform.js":40,"./lib/_stream_writable.js":41,"./lib/internal/streams/end-of-stream.js":45,"./lib/internal/streams/pipeline.js":47}],51:[function(require,module,exports){"use strict";var Buffer=require("buffer").Buffer;var inherits=require("inherits");var HashBase=require("hash-base");var ARRAY16=new Array(16);var zl=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];var zr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];var sl=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];var sr=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];var hl=[0,1518500249,1859775393,2400959708,2840853838];var hr=[1352829926,1548603684,1836072691,2053994217,0];function RIPEMD160(){HashBase.call(this,64);this._a=1732584193;this._b=4023233417;this._c=2562383102;this._d=271733878;this._e=3285377520}inherits(RIPEMD160,HashBase);RIPEMD160.prototype._update=function(){var words=ARRAY16;for(var j=0;j<16;++j)words[j]=this._block.readInt32LE(j*4);var al=this._a|0;var bl=this._b|0;var cl=this._c|0;var dl=this._d|0;var el=this._e|0;var ar=this._a|0;var br=this._b|0;var cr=this._c|0;var dr=this._d|0;var er=this._e|0;for(var i=0;i<80;i+=1){var tl;var tr;if(i<16){tl=fn1(al,bl,cl,dl,el,words[zl[i]],hl[0],sl[i]);tr=fn5(ar,br,cr,dr,er,words[zr[i]],hr[0],sr[i])}else if(i<32){tl=fn2(al,bl,cl,dl,el,words[zl[i]],hl[1],sl[i]);tr=fn4(ar,br,cr,dr,er,words[zr[i]],hr[1],sr[i])}else if(i<48){tl=fn3(al,bl,cl,dl,el,words[zl[i]],hl[2],sl[i]);tr=fn3(ar,br,cr,dr,er,words[zr[i]],hr[2],sr[i])}else if(i<64){tl=fn4(al,bl,cl,dl,el,words[zl[i]],hl[3],sl[i]);tr=fn2(ar,br,cr,dr,er,words[zr[i]],hr[3],sr[i])}else{tl=fn5(al,bl,cl,dl,el,words[zl[i]],hl[4],sl[i]);tr=fn1(ar,br,cr,dr,er,words[zr[i]],hr[4],sr[i])}al=el;el=dl;dl=rotl(cl,10);cl=bl;bl=tl;ar=er;er=dr;dr=rotl(cr,10);cr=br;br=tr}var t=this._b+cl+dr|0;this._b=this._c+dl+er|0;this._c=this._d+el+ar|0;this._d=this._e+al+br|0;this._e=this._a+bl+cr|0;this._a=t};RIPEMD160.prototype._digest=function(){this._block[this._blockOffset++]=128;if(this._blockOffset>56){this._block.fill(0,this._blockOffset,64);this._update();this._blockOffset=0}this._block.fill(0,this._blockOffset,56);this._block.writeUInt32LE(this._length[0],56);this._block.writeUInt32LE(this._length[1],60);this._update();var buffer=Buffer.alloc?Buffer.alloc(20):new Buffer(20);buffer.writeInt32LE(this._a,0);buffer.writeInt32LE(this._b,4);buffer.writeInt32LE(this._c,8);buffer.writeInt32LE(this._d,12);buffer.writeInt32LE(this._e,16);return buffer};function rotl(x,n){return x<<n|x>>>32-n}function fn1(a,b,c,d,e,m,k,s){return rotl(a+(b^c^d)+m+k|0,s)+e|0}function fn2(a,b,c,d,e,m,k,s){return rotl(a+(b&c|~b&d)+m+k|0,s)+e|0}function fn3(a,b,c,d,e,m,k,s){return rotl(a+((b|~c)^d)+m+k|0,s)+e|0}function fn4(a,b,c,d,e,m,k,s){return rotl(a+(b&d|c&~d)+m+k|0,s)+e|0}function fn5(a,b,c,d,e,m,k,s){return rotl(a+(b^(c|~d))+m+k|0,s)+e|0}module.exports=RIPEMD160},{buffer:3,"hash-base":33,inherits:34}],52:[function(require,module,exports){arguments[4][8][0].apply(exports,arguments)},{buffer:3,dup:8}],53:[function(require,module,exports){var Buffer=require("safe-buffer").Buffer;function Hash(blockSize,finalSize){this._block=Buffer.alloc(blockSize);this._finalSize=finalSize;this._blockSize=blockSize;this._len=0}Hash.prototype.update=function(data,enc){if(typeof data==="string"){enc=enc||"utf8";data=Buffer.from(data,enc)}var block=this._block;var blockSize=this._blockSize;var length=data.length;var accum=this._len;for(var offset=0;offset<length;){var assigned=accum%blockSize;var remainder=Math.min(length-offset,blockSize-assigned);for(var i=0;i<remainder;i++){block[assigned+i]=data[offset+i]}accum+=remainder;offset+=remainder;if(accum%blockSize===0){this._update(block)}}this._len+=length;return this};Hash.prototype.digest=function(enc){var rem=this._len%this._blockSize;this._block[rem]=128;this._block.fill(0,rem+1);if(rem>=this._finalSize){this._update(this._block);this._block.fill(0)}var bits=this._len*8;if(bits<=4294967295){this._block.writeUInt32BE(bits,this._blockSize-4)}else{var lowBits=(bits&4294967295)>>>0;var highBits=(bits-lowBits)/4294967296;this._block.writeUInt32BE(highBits,this._blockSize-8);this._block.writeUInt32BE(lowBits,this._blockSize-4)}this._update(this._block);var hash=this._hash();return enc?hash.toString(enc):hash};Hash.prototype._update=function(){throw new Error("_update must be implemented by subclass")};module.exports=Hash},{"safe-buffer":52}],54:[function(require,module,exports){var exports=module.exports=function SHA(algorithm){algorithm=algorithm.toLowerCase();var Algorithm=exports[algorithm];if(!Algorithm)throw new Error(algorithm+" is not supported (we accept pull requests)");return new Algorithm};exports.sha=require("./sha");exports.sha1=require("./sha1");exports.sha224=require("./sha224");exports.sha256=require("./sha256");exports.sha384=require("./sha384");exports.sha512=require("./sha512")},{"./sha":55,"./sha1":56,"./sha224":57,"./sha256":58,"./sha384":59,"./sha512":60}],55:[function(require,module,exports){var inherits=require("inherits");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var K=[1518500249,1859775393,2400959708|0,3395469782|0];var W=new Array(80);function Sha(){this.init();this._w=W;Hash.call(this,64,56)}inherits(Sha,Hash);Sha.prototype.init=function(){this._a=1732584193;this._b=4023233417;this._c=2562383102;this._d=271733878;this._e=3285377520;return this};function rotl5(num){return num<<5|num>>>27}function rotl30(num){return num<<30|num>>>2}function ft(s,b,c,d){if(s===0)return b&c|~b&d;if(s===2)return b&c|b&d|c&d;return b^c^d}Sha.prototype._update=function(M){var W=this._w;var a=this._a|0;var b=this._b|0;var c=this._c|0;var d=this._d|0;var e=this._e|0;for(var i=0;i<16;++i)W[i]=M.readInt32BE(i*4);for(;i<80;++i)W[i]=W[i-3]^W[i-8]^W[i-14]^W[i-16];for(var j=0;j<80;++j){var s=~~(j/20);var t=rotl5(a)+ft(s,b,c,d)+e+W[j]+K[s]|0;e=d;d=c;c=rotl30(b);b=a;a=t}this._a=a+this._a|0;this._b=b+this._b|0;this._c=c+this._c|0;this._d=d+this._d|0;this._e=e+this._e|0};Sha.prototype._hash=function(){var H=Buffer.allocUnsafe(20);H.writeInt32BE(this._a|0,0);H.writeInt32BE(this._b|0,4);H.writeInt32BE(this._c|0,8);H.writeInt32BE(this._d|0,12);H.writeInt32BE(this._e|0,16);return H};module.exports=Sha},{"./hash":53,inherits:34,"safe-buffer":52}],56:[function(require,module,exports){var inherits=require("inherits");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var K=[1518500249,1859775393,2400959708|0,3395469782|0];var W=new Array(80);function Sha1(){this.init();this._w=W;Hash.call(this,64,56)}inherits(Sha1,Hash);Sha1.prototype.init=function(){this._a=1732584193;this._b=4023233417;this._c=2562383102;this._d=271733878;this._e=3285377520;return this};function rotl1(num){return num<<1|num>>>31}function rotl5(num){return num<<5|num>>>27}function rotl30(num){return num<<30|num>>>2}function ft(s,b,c,d){if(s===0)return b&c|~b&d;if(s===2)return b&c|b&d|c&d;return b^c^d}Sha1.prototype._update=function(M){var W=this._w;var a=this._a|0;var b=this._b|0;var c=this._c|0;var d=this._d|0;var e=this._e|0;for(var i=0;i<16;++i)W[i]=M.readInt32BE(i*4);for(;i<80;++i)W[i]=rotl1(W[i-3]^W[i-8]^W[i-14]^W[i-16]);for(var j=0;j<80;++j){var s=~~(j/20);var t=rotl5(a)+ft(s,b,c,d)+e+W[j]+K[s]|0;e=d;d=c;c=rotl30(b);b=a;a=t}this._a=a+this._a|0;this._b=b+this._b|0;this._c=c+this._c|0;this._d=d+this._d|0;this._e=e+this._e|0};Sha1.prototype._hash=function(){var H=Buffer.allocUnsafe(20);H.writeInt32BE(this._a|0,0);H.writeInt32BE(this._b|0,4);H.writeInt32BE(this._c|0,8);H.writeInt32BE(this._d|0,12);H.writeInt32BE(this._e|0,16);return H};module.exports=Sha1},{"./hash":53,inherits:34,"safe-buffer":52}],57:[function(require,module,exports){var inherits=require("inherits");var Sha256=require("./sha256");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var W=new Array(64);function Sha224(){this.init();this._w=W;Hash.call(this,64,56)}inherits(Sha224,Sha256);Sha224.prototype.init=function(){this._a=3238371032;this._b=914150663;this._c=812702999;this._d=4144912697;this._e=4290775857;this._f=1750603025;this._g=1694076839;this._h=3204075428;return this};Sha224.prototype._hash=function(){var H=Buffer.allocUnsafe(28);H.writeInt32BE(this._a,0);H.writeInt32BE(this._b,4);H.writeInt32BE(this._c,8);H.writeInt32BE(this._d,12);H.writeInt32BE(this._e,16);H.writeInt32BE(this._f,20);H.writeInt32BE(this._g,24);return H};module.exports=Sha224},{"./hash":53,"./sha256":58,inherits:34,"safe-buffer":52}],58:[function(require,module,exports){var inherits=require("inherits");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];var W=new Array(64);function Sha256(){this.init();this._w=W;Hash.call(this,64,56)}inherits(Sha256,Hash);Sha256.prototype.init=function(){this._a=1779033703;this._b=3144134277;this._c=1013904242;this._d=2773480762;this._e=1359893119;this._f=2600822924;this._g=528734635;this._h=1541459225;return this};function ch(x,y,z){return z^x&(y^z)}function maj(x,y,z){return x&y|z&(x|y)}function sigma0(x){return(x>>>2|x<<30)^(x>>>13|x<<19)^(x>>>22|x<<10)}function sigma1(x){return(x>>>6|x<<26)^(x>>>11|x<<21)^(x>>>25|x<<7)}function gamma0(x){return(x>>>7|x<<25)^(x>>>18|x<<14)^x>>>3}function gamma1(x){return(x>>>17|x<<15)^(x>>>19|x<<13)^x>>>10}Sha256.prototype._update=function(M){var W=this._w;var a=this._a|0;var b=this._b|0;var c=this._c|0;var d=this._d|0;var e=this._e|0;var f=this._f|0;var g=this._g|0;var h=this._h|0;for(var i=0;i<16;++i)W[i]=M.readInt32BE(i*4);for(;i<64;++i)W[i]=gamma1(W[i-2])+W[i-7]+gamma0(W[i-15])+W[i-16]|0;for(var j=0;j<64;++j){var T1=h+sigma1(e)+ch(e,f,g)+K[j]+W[j]|0;var T2=sigma0(a)+maj(a,b,c)|0;h=g;g=f;f=e;e=d+T1|0;d=c;c=b;b=a;a=T1+T2|0}this._a=a+this._a|0;this._b=b+this._b|0;this._c=c+this._c|0;this._d=d+this._d|0;this._e=e+this._e|0;this._f=f+this._f|0;this._g=g+this._g|0;this._h=h+this._h|0};Sha256.prototype._hash=function(){var H=Buffer.allocUnsafe(32);H.writeInt32BE(this._a,0);H.writeInt32BE(this._b,4);H.writeInt32BE(this._c,8);H.writeInt32BE(this._d,12);H.writeInt32BE(this._e,16);H.writeInt32BE(this._f,20);H.writeInt32BE(this._g,24);H.writeInt32BE(this._h,28);return H};module.exports=Sha256},{"./hash":53,inherits:34,"safe-buffer":52}],59:[function(require,module,exports){var inherits=require("inherits");var SHA512=require("./sha512");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var W=new Array(160);function Sha384(){this.init();this._w=W;Hash.call(this,128,112)}inherits(Sha384,SHA512);Sha384.prototype.init=function(){this._ah=3418070365;this._bh=1654270250;this._ch=2438529370;this._dh=355462360;this._eh=1731405415;this._fh=2394180231;this._gh=3675008525;this._hh=1203062813;this._al=3238371032;this._bl=914150663;this._cl=812702999;this._dl=4144912697;this._el=4290775857;this._fl=1750603025;this._gl=1694076839;this._hl=3204075428;return this};Sha384.prototype._hash=function(){var H=Buffer.allocUnsafe(48);function writeInt64BE(h,l,offset){H.writeInt32BE(h,offset);H.writeInt32BE(l,offset+4)}writeInt64BE(this._ah,this._al,0);writeInt64BE(this._bh,this._bl,8);writeInt64BE(this._ch,this._cl,16);writeInt64BE(this._dh,this._dl,24);writeInt64BE(this._eh,this._el,32);writeInt64BE(this._fh,this._fl,40);return H};module.exports=Sha384},{"./hash":53,"./sha512":60,inherits:34,"safe-buffer":52}],60:[function(require,module,exports){var inherits=require("inherits");var Hash=require("./hash");var Buffer=require("safe-buffer").Buffer;var K=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];var W=new Array(160);function Sha512(){this.init();this._w=W;Hash.call(this,128,112)}inherits(Sha512,Hash);Sha512.prototype.init=function(){this._ah=1779033703;this._bh=3144134277;this._ch=1013904242;this._dh=2773480762;this._eh=1359893119;this._fh=2600822924;this._gh=528734635;this._hh=1541459225;this._al=4089235720;this._bl=2227873595;this._cl=4271175723;this._dl=1595750129;this._el=2917565137;this._fl=725511199;this._gl=4215389547;this._hl=327033209;return this};function Ch(x,y,z){return z^x&(y^z)}function maj(x,y,z){return x&y|z&(x|y)}function sigma0(x,xl){return(x>>>28|xl<<4)^(xl>>>2|x<<30)^(xl>>>7|x<<25)}function sigma1(x,xl){return(x>>>14|xl<<18)^(x>>>18|xl<<14)^(xl>>>9|x<<23)}function Gamma0(x,xl){return(x>>>1|xl<<31)^(x>>>8|xl<<24)^x>>>7}function Gamma0l(x,xl){return(x>>>1|xl<<31)^(x>>>8|xl<<24)^(x>>>7|xl<<25)}function Gamma1(x,xl){return(x>>>19|xl<<13)^(xl>>>29|x<<3)^x>>>6}function Gamma1l(x,xl){return(x>>>19|xl<<13)^(xl>>>29|x<<3)^(x>>>6|xl<<26)}function getCarry(a,b){return a>>>0<b>>>0?1:0}Sha512.prototype._update=function(M){var W=this._w;var ah=this._ah|0;var bh=this._bh|0;var ch=this._ch|0;var dh=this._dh|0;var eh=this._eh|0;var fh=this._fh|0;var gh=this._gh|0;var hh=this._hh|0;var al=this._al|0;var bl=this._bl|0;var cl=this._cl|0;var dl=this._dl|0;var el=this._el|0;var fl=this._fl|0;var gl=this._gl|0;var hl=this._hl|0;for(var i=0;i<32;i+=2){W[i]=M.readInt32BE(i*4);W[i+1]=M.readInt32BE(i*4+4)}for(;i<160;i+=2){var xh=W[i-15*2];var xl=W[i-15*2+1];var gamma0=Gamma0(xh,xl);var gamma0l=Gamma0l(xl,xh);xh=W[i-2*2];xl=W[i-2*2+1];var gamma1=Gamma1(xh,xl);var gamma1l=Gamma1l(xl,xh);var Wi7h=W[i-7*2];var Wi7l=W[i-7*2+1];var Wi16h=W[i-16*2];var Wi16l=W[i-16*2+1];var Wil=gamma0l+Wi7l|0;var Wih=gamma0+Wi7h+getCarry(Wil,gamma0l)|0;Wil=Wil+gamma1l|0;Wih=Wih+gamma1+getCarry(Wil,gamma1l)|0;Wil=Wil+Wi16l|0;Wih=Wih+Wi16h+getCarry(Wil,Wi16l)|0;W[i]=Wih;W[i+1]=Wil}for(var j=0;j<160;j+=2){Wih=W[j];Wil=W[j+1];var majh=maj(ah,bh,ch);var majl=maj(al,bl,cl);var sigma0h=sigma0(ah,al);var sigma0l=sigma0(al,ah);var sigma1h=sigma1(eh,el);var sigma1l=sigma1(el,eh);var Kih=K[j];var Kil=K[j+1];var chh=Ch(eh,fh,gh);var chl=Ch(el,fl,gl);var t1l=hl+sigma1l|0;var t1h=hh+sigma1h+getCarry(t1l,hl)|0;t1l=t1l+chl|0;t1h=t1h+chh+getCarry(t1l,chl)|0;t1l=t1l+Kil|0;t1h=t1h+Kih+getCarry(t1l,Kil)|0;t1l=t1l+Wil|0;t1h=t1h+Wih+getCarry(t1l,Wil)|0;var t2l=sigma0l+majl|0;var t2h=sigma0h+majh+getCarry(t2l,sigma0l)|0;hh=gh;hl=gl;gh=fh;gl=fl;fh=eh;fl=el;el=dl+t1l|0;eh=dh+t1h+getCarry(el,dl)|0;dh=ch;dl=cl;ch=bh;cl=bl;bh=ah;bl=al;al=t1l+t2l|0;ah=t1h+t2h+getCarry(al,t1l)|0}this._al=this._al+al|0;this._bl=this._bl+bl|0;this._cl=this._cl+cl|0;this._dl=this._dl+dl|0;this._el=this._el+el|0;this._fl=this._fl+fl|0;this._gl=this._gl+gl|0;this._hl=this._hl+hl|0;this._ah=this._ah+ah+getCarry(this._al,al)|0;this._bh=this._bh+bh+getCarry(this._bl,bl)|0;this._ch=this._ch+ch+getCarry(this._cl,cl)|0;this._dh=this._dh+dh+getCarry(this._dl,dl)|0;this._eh=this._eh+eh+getCarry(this._el,el)|0;this._fh=this._fh+fh+getCarry(this._fl,fl)|0;this._gh=this._gh+gh+getCarry(this._gl,gl)|0;this._hh=this._hh+hh+getCarry(this._hl,hl)|0};Sha512.prototype._hash=function(){var H=Buffer.allocUnsafe(64);function writeInt64BE(h,l,offset){H.writeInt32BE(h,offset);H.writeInt32BE(l,offset+4)}writeInt64BE(this._ah,this._al,0);writeInt64BE(this._bh,this._bl,8);writeInt64BE(this._ch,this._cl,16);writeInt64BE(this._dh,this._dl,24);writeInt64BE(this._eh,this._el,32);writeInt64BE(this._fh,this._fl,40);writeInt64BE(this._gh,this._gl,48);writeInt64BE(this._hh,this._hl,56);return H};module.exports=Sha512},{"./hash":53,inherits:34,"safe-buffer":52}],61:[function(require,module,exports){arguments[4][24][0].apply(exports,arguments)},{dup:24,"safe-buffer":52}],62:[function(require,module,exports){arguments[4][25][0].apply(exports,arguments)},{dup:25}]},{},[26]);
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.raterJs = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

/*! rater-js. [c] 2018 Fredrik Olsson. MIT License */
var css = require('./style.css');

module.exports = function rater(options) {
  //private fields
  var showToolTip = true;

  if (typeof options.element === "undefined" || options.element === null) {
    throw new Error("element required");
  }

  if (typeof options.showToolTip !== "undefined") {
    showToolTip = !!options.showToolTip;
  }

  if (typeof options.step !== "undefined") {
    if (options.step <= 0 || options.step > 1) {
      throw new Error("step must be a number between 0 and 1");
    }
  }

  var stars = options.max || 5;
  var starSize = options.starSize || 16;
  var step = options.step || 1;
  var onHover = options.onHover;
  var onLeave = options.onLeave;
  var rating;
  var myRating;
  var elem = options.element;
  elem.classList.add("star-rating");
  var div = document.createElement("div");
  div.classList.add("star-value");

  if(options.extraClass){
    div.classList.add(options.extraClass);
  }

  div.style.backgroundSize = starSize + "px";
  elem.appendChild(div);
  elem.style.width = starSize * stars + "px";
  elem.style.height = starSize + "px";
  elem.style.backgroundSize = starSize + "px";
  var callback = options.rateCallback;
  var disabled = !!options.readOnly;
  var disableText;
  var isRating = false;
  var isBusyText = options.isBusyText;
  var currentRating;
  var ratingText;

  if (typeof options.disableText !== "undefined") {
    disableText = options.disableText;
  } else {
    disableText = "{rating}/{maxRating}";
  }

  if (typeof options.ratingText !== "undefined") {
    ratingText = options.ratingText;
  } else {
    ratingText = "{rating}/{maxRating}";
  }

  if (options.rating) {
    setRating(options.rating);
  } else {
    var dataRating = elem.dataset.rating;

    if (dataRating) {
      setRating(+dataRating);
    }
  }

  if (typeof rating === "undefined") {
    elem.querySelector(".star-value").style.width = "0px";
  }

  if (disabled) {
    disable();
  } //private methods


  function onMouseMove(e) {
    if (disabled === true || isRating === true) {
      return;
    }

    var xCoor = e.offsetX;
    var width = elem.offsetWidth;
    var percent = xCoor / width * 100;

    if (percent < 101) {
      if (step === 1) {
        currentRating = Math.ceil(percent / 100 * stars);
      } else {
        var rat = percent / 100 * stars;

        for (var i = 0;; i += step) {
          if (i >= rat) {
            currentRating = i;
            break;
          }
        }
      }

      //RepNet
			currentRating=currentRating.toFixed(1); 
			if(currentRating<1){
				currentRating=1;
			}
      if(currentRating>stars){
				currentRating=stars;
			}

      elem.querySelector(".star-value").style.width = currentRating / stars * 100 + "%";

      if (showToolTip) {
        var toolTip = ratingText.replace("{rating}", currentRating);
        toolTip = toolTip.replace("{maxRating}", stars);
        elem.setAttribute("data-title", toolTip);
      }

      if (typeof onHover === "function") {
        onHover(currentRating, rating);
      }
    }
  }

  function onStarOut(e) {
    if (typeof rating !== "undefined") {
      elem.querySelector(".star-value").style.width = rating / stars * 100 + "%";
      elem.setAttribute("data-rating", rating);
    } else {
      elem.querySelector(".star-value").style.width = "0%";
      elem.removeAttribute("data-rating");
    }

    if (typeof onLeave === "function") {
      onLeave(currentRating, rating);
    }
  }

  function onStarClick(e) {
    if (disabled === true) {
      return;
    }

    if (isRating === true) {
      return;
    }

    if (typeof callback !== "undefined") {
      isRating = true;
      myRating = currentRating;

      if (typeof isBusyText === "undefined") {
        elem.removeAttribute("data-title");
      } else {
        elem.setAttribute("data-title", isBusyText);
      }

      callback.call(this, myRating, function () {
        if (disabled === false) {
          elem.removeAttribute("data-title");
        }

        isRating = false;
      });
    }
  } //public methods


  function disable() {
    disabled = true;

    if (showToolTip && !!disableText) {
      var toolTip = disableText.replace("{rating}", rating);
      toolTip = toolTip.replace("{maxRating}", stars);
      elem.setAttribute("data-title", toolTip);
    } else {
      elem.removeAttribute("data-title");
    }
  }

  function enable() {
    disabled = false;
    elem.removeAttribute("data-title");
  }

  function setRating(value) {
    if (typeof value === "undefined") {
      throw new Error("Value not set.");
    }

    if (typeof value !== "number") {
      throw new Error("Value must be a number.");
    }

    if (value < 0 || value > stars) {
      var ratingError = new Error("Value too high. Please set a rating of " + stars + " or below.");
      ratingError.name = "ratingError";
      throw ratingError;
    }

    rating = value;
    elem.querySelector(".star-value").style.width = value / stars * 100 + "%";
    elem.setAttribute("data-rating", value);
  }

  function getRating() {
    return rating;
  }

  function dispose() {
    elem.removeEventListener("mousemove", onMouseMove);
    elem.removeEventListener("mouseleave", onStarOut);
    elem.removeEventListener("click", onStarClick);
  }

  elem.addEventListener("mousemove", onMouseMove);
  elem.addEventListener("mouseleave", onStarOut);
  var module = {
    setRating: setRating,
    getRating: getRating,
    disable: disable,
    enable: enable,
    dispose: dispose
  };
  elem.addEventListener("click", onStarClick.bind(module));
  return module;
};

},{"./style.css":2}],2:[function(require,module,exports){
var css = ".star-rating {\n  width: 0;\n  position: relative;\n  display: inline-block;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDguOSIgaGVpZ2h0PSIxMDMuNiIgdmlld0JveD0iMCAwIDEwOC45IDEwMy42Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2UzZTZlNjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnN0YXJfMDwvdGl0bGU+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMTA4LjkgMzkuNiA3MS4zIDM0LjEgNTQuNCAwIDM3LjYgMzQuMSAwIDM5LjYgMjcuMiA2Ni4xIDIwLjggMTAzLjYgNTQuNCA4NS45IDg4LjEgMTAzLjYgODEuNyA2Ni4xIDEwOC45IDM5LjYiLz48L2c+PC9nPjwvc3ZnPgo=);\n  background-position: 0 0;\n  background-repeat: repeat-x;\n  cursor: pointer;\n}\n.star-rating[data-title]:hover:after {\n  content: attr(data-title);\n  padding: 4px 8px;\n  color: #333;\n  position: absolute;\n  left: 0;\n  top: 100%;\n  z-index: 20;\n  white-space: nowrap;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  -moz-box-shadow: 0px 0px 4px #222;\n  -webkit-box-shadow: 0px 0px 4px #222;\n  box-shadow: 0px 0px 4px #222;\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n}\n.star-rating .star-value {\n  height: 100%;\n  position: absolute;\n}\n.star-rating .star-value {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  background: url('data:image/svg+xml;base64,PHN2ZwoJeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTA4LjkiIGhlaWdodD0iMTAzLjYiIHZpZXdCb3g9IjAgMCAxMDguOSAxMDMuNiI+Cgk8ZGVmcz4KCQk8c3R5bGU+LmNscy0xe2ZpbGw6I2YxYzk0Nzt9PC9zdHlsZT4KCTwvZGVmcz4KCTx0aXRsZT5zdGFyMTwvdGl0bGU+Cgk8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj4KCQk8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgoJCQk8cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iNTQuNCAwIDcxLjMgMzQuMSAxMDguOSAzOS42IDgxLjcgNjYuMSA4OC4xIDEwMy42IDU0LjQgODUuOSAyMC44IDEwMy42IDI3LjIgNjYuMSAwIDM5LjYgMzcuNiAzNC4xIDU0LjQgMCIvPgoJCTwvZz4KCTwvZz4KPC9zdmc+Cg==');\n  background-repeat: repeat-x;\n}\n"; (require("browserify-css").createStyle(css, { "href": "lib\\style.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":3}],3:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}]},{},[1])(1)
});
var bigInt=function(t){"use strict";var e=1e7,r=9007199254740992,o=f(r),n="0123456789abcdefghijklmnopqrstuvwxyz",i="function"==typeof BigInt;function u(t,e,r,o){return void 0===t?u[0]:void 0!==e&&(10!=+e||r)?_(t,e,r,o):K(t)}function p(t,e){this.value=t,this.sign=e,this.isSmall=!1}function a(t){this.value=t,this.sign=t<0,this.isSmall=!0}function s(t){this.value=t}function l(t){return-r<t&&t<r}function f(t){return t<1e7?[t]:t<1e14?[t%1e7,Math.floor(t/1e7)]:[t%1e7,Math.floor(t/1e7)%1e7,Math.floor(t/1e14)]}function v(t){h(t);var r=t.length;if(r<4&&A(t,o)<0)switch(r){case 0:return 0;case 1:return t[0];case 2:return t[0]+t[1]*e;default:return t[0]+(t[1]+t[2]*e)*e}return t}function h(t){for(var e=t.length;0===t[--e];);t.length=e+1}function y(t){for(var e=new Array(t),r=-1;++r<t;)e[r]=0;return e}function g(t){return t>0?Math.floor(t):Math.ceil(t)}function c(t,r){var o,n,i=t.length,u=r.length,p=new Array(i),a=0,s=e;for(n=0;n<u;n++)a=(o=t[n]+r[n]+a)>=s?1:0,p[n]=o-a*s;for(;n<i;)a=(o=t[n]+a)===s?1:0,p[n++]=o-a*s;return a>0&&p.push(a),p}function m(t,e){return t.length>=e.length?c(t,e):c(e,t)}function d(t,r){var o,n,i=t.length,u=new Array(i),p=e;for(n=0;n<i;n++)o=t[n]-p+r,r=Math.floor(o/p),u[n]=o-r*p,r+=1;for(;r>0;)u[n++]=r%p,r=Math.floor(r/p);return u}function b(t,r){var o,n,i=t.length,u=r.length,p=new Array(i),a=0,s=e;for(o=0;o<u;o++)(n=t[o]-a-r[o])<0?(n+=s,a=1):a=0,p[o]=n;for(o=u;o<i;o++){if(!((n=t[o]-a)<0)){p[o++]=n;break}n+=s,p[o]=n}for(;o<i;o++)p[o]=t[o];return h(p),p}function w(t,r,o){var n,i,u=t.length,s=new Array(u),l=-r,f=e;for(n=0;n<u;n++)i=t[n]+l,l=Math.floor(i/f),i%=f,s[n]=i<0?i+f:i;return"number"==typeof(s=v(s))?(o&&(s=-s),new a(s)):new p(s,o)}function S(t,r){var o,n,i,u,p=t.length,a=r.length,s=y(p+a),l=e;for(i=0;i<p;++i){u=t[i];for(var f=0;f<a;++f)o=u*r[f]+s[i+f],n=Math.floor(o/l),s[i+f]=o-n*l,s[i+f+1]+=n}return h(s),s}function I(t,r){var o,n,i=t.length,u=new Array(i),p=e,a=0;for(n=0;n<i;n++)o=t[n]*r+a,a=Math.floor(o/p),u[n]=o-a*p;for(;a>0;)u[n++]=a%p,a=Math.floor(a/p);return u}function q(t,e){for(var r=[];e-- >0;)r.push(0);return r.concat(t)}function M(t,e){var r=Math.max(t.length,e.length);if(r<=30)return S(t,e);r=Math.ceil(r/2);var o=t.slice(r),n=t.slice(0,r),i=e.slice(r),u=e.slice(0,r),p=M(n,u),a=M(o,i),s=M(m(n,o),m(u,i)),l=m(m(p,q(b(b(s,p),a),r)),q(a,2*r));return h(l),l}function N(t,r,o){return new p(t<e?I(r,t):S(r,f(t)),o)}function E(t){var r,o,n,i,u=t.length,p=y(u+u),a=e;for(n=0;n<u;n++){o=0-(i=t[n])*i;for(var s=n;s<u;s++)r=i*t[s]*2+p[n+s]+o,o=Math.floor(r/a),p[n+s]=r-o*a;p[n+u]=o}return h(p),p}function O(t,e){var r,o,n,i,u=t.length,p=y(u);for(n=0,r=u-1;r>=0;--r)n=(i=1e7*n+t[r])-(o=g(i/e))*e,p[r]=0|o;return[p,0|n]}function B(t,r){var o,n=K(r);if(i)return[new s(t.value/n.value),new s(t.value%n.value)];var l,c=t.value,m=n.value;if(0===m)throw new Error("Cannot divide by zero");if(t.isSmall)return n.isSmall?[new a(g(c/m)),new a(c%m)]:[u[0],t];if(n.isSmall){if(1===m)return[t,u[0]];if(-1==m)return[t.negate(),u[0]];var d=Math.abs(m);if(d<e){l=v((o=O(c,d))[0]);var w=o[1];return t.sign&&(w=-w),"number"==typeof l?(t.sign!==n.sign&&(l=-l),[new a(l),new a(w)]):[new p(l,t.sign!==n.sign),new a(w)]}m=f(d)}var S=A(c,m);if(-1===S)return[u[0],t];if(0===S)return[u[t.sign===n.sign?1:-1],u[0]];o=c.length+m.length<=200?function(t,r){var o,n,i,u,p,a,s,l=t.length,f=r.length,h=e,g=y(r.length),c=r[f-1],m=Math.ceil(h/(2*c)),d=I(t,m),b=I(r,m);for(d.length<=l&&d.push(0),b.push(0),c=b[f-1],n=l-f;n>=0;n--){for(o=h-1,d[n+f]!==c&&(o=Math.floor((d[n+f]*h+d[n+f-1])/c)),i=0,u=0,a=b.length,p=0;p<a;p++)i+=o*b[p],s=Math.floor(i/h),u+=d[n+p]-(i-s*h),i=s,u<0?(d[n+p]=u+h,u=-1):(d[n+p]=u,u=0);for(;0!==u;){for(o-=1,i=0,p=0;p<a;p++)(i+=d[n+p]-h+b[p])<0?(d[n+p]=i+h,i=0):(d[n+p]=i,i=1);u+=i}g[n]=o}return d=O(d,m)[0],[v(g),v(d)]}(c,m):function(t,r){for(var o,n,i,u,p,a=t.length,s=r.length,l=[],f=[],y=e;a;)if(f.unshift(t[--a]),h(f),A(f,r)<0)l.push(0);else{i=f[(n=f.length)-1]*y+f[n-2],u=r[s-1]*y+r[s-2],n>s&&(i=(i+1)*y),o=Math.ceil(i/u);do{if(A(p=I(r,o),f)<=0)break;o--}while(o);l.push(o),f=b(f,p)}return l.reverse(),[v(l),v(f)]}(c,m),l=o[0];var q=t.sign!==n.sign,M=o[1],N=t.sign;return"number"==typeof l?(q&&(l=-l),l=new a(l)):l=new p(l,q),"number"==typeof M?(N&&(M=-M),M=new a(M)):M=new p(M,N),[l,M]}function A(t,e){if(t.length!==e.length)return t.length>e.length?1:-1;for(var r=t.length-1;r>=0;r--)if(t[r]!==e[r])return t[r]>e[r]?1:-1;return 0}function P(t){var e=t.abs();return!e.isUnit()&&(!!(e.equals(2)||e.equals(3)||e.equals(5))||!(e.isEven()||e.isDivisibleBy(3)||e.isDivisibleBy(5))&&(!!e.lesser(49)||void 0))}function Z(t,e){for(var r,o,n,i=t.prev(),u=i,p=0;u.isEven();)u=u.divide(2),p++;t:for(o=0;o<e.length;o++)if(!t.lesser(e[o])&&!(n=bigInt(e[o]).modPow(u,t)).isUnit()&&!n.equals(i)){for(r=p-1;0!=r;r--){if((n=n.square().mod(t)).isUnit())return!1;if(n.equals(i))continue t}return!1}return!0}p.prototype=Object.create(u.prototype),a.prototype=Object.create(u.prototype),s.prototype=Object.create(u.prototype),p.prototype.add=function(t){var e=K(t);if(this.sign!==e.sign)return this.subtract(e.negate());var r=this.value,o=e.value;return e.isSmall?new p(d(r,Math.abs(o)),this.sign):new p(m(r,o),this.sign)},p.prototype.plus=p.prototype.add,a.prototype.add=function(t){var e=K(t),r=this.value;if(r<0!==e.sign)return this.subtract(e.negate());var o=e.value;if(e.isSmall){if(l(r+o))return new a(r+o);o=f(Math.abs(o))}return new p(d(o,Math.abs(r)),r<0)},a.prototype.plus=a.prototype.add,s.prototype.add=function(t){return new s(this.value+K(t).value)},s.prototype.plus=s.prototype.add,p.prototype.subtract=function(t){var e=K(t);if(this.sign!==e.sign)return this.add(e.negate());var r=this.value,o=e.value;return e.isSmall?w(r,Math.abs(o),this.sign):function(t,e,r){var o;return A(t,e)>=0?o=b(t,e):(o=b(e,t),r=!r),"number"==typeof(o=v(o))?(r&&(o=-o),new a(o)):new p(o,r)}(r,o,this.sign)},p.prototype.minus=p.prototype.subtract,a.prototype.subtract=function(t){var e=K(t),r=this.value;if(r<0!==e.sign)return this.add(e.negate());var o=e.value;return e.isSmall?new a(r-o):w(o,Math.abs(r),r>=0)},a.prototype.minus=a.prototype.subtract,s.prototype.subtract=function(t){return new s(this.value-K(t).value)},s.prototype.minus=s.prototype.subtract,p.prototype.negate=function(){return new p(this.value,!this.sign)},a.prototype.negate=function(){var t=this.sign,e=new a(-this.value);return e.sign=!t,e},s.prototype.negate=function(){return new s(-this.value)},p.prototype.abs=function(){return new p(this.value,!1)},a.prototype.abs=function(){return new a(Math.abs(this.value))},s.prototype.abs=function(){return new s(this.value>=0?this.value:-this.value)},p.prototype.multiply=function(t){var r,o,n,i=K(t),a=this.value,s=i.value,l=this.sign!==i.sign;if(i.isSmall){if(0===s)return u[0];if(1===s)return this;if(-1===s)return this.negate();if((r=Math.abs(s))<e)return new p(I(a,r),l);s=f(r)}return o=a.length,n=s.length,new p(-.012*o-.012*n+15e-6*o*n>0?M(a,s):S(a,s),l)},p.prototype.times=p.prototype.multiply,a.prototype._multiplyBySmall=function(t){return l(t.value*this.value)?new a(t.value*this.value):N(Math.abs(t.value),f(Math.abs(this.value)),this.sign!==t.sign)},p.prototype._multiplyBySmall=function(t){return 0===t.value?u[0]:1===t.value?this:-1===t.value?this.negate():N(Math.abs(t.value),this.value,this.sign!==t.sign)},a.prototype.multiply=function(t){return K(t)._multiplyBySmall(this)},a.prototype.times=a.prototype.multiply,s.prototype.multiply=function(t){return new s(this.value*K(t).value)},s.prototype.times=s.prototype.multiply,p.prototype.square=function(){return new p(E(this.value),!1)},a.prototype.square=function(){var t=this.value*this.value;return l(t)?new a(t):new p(E(f(Math.abs(this.value))),!1)},s.prototype.square=function(t){return new s(this.value*this.value)},p.prototype.divmod=function(t){var e=B(this,t);return{quotient:e[0],remainder:e[1]}},s.prototype.divmod=a.prototype.divmod=p.prototype.divmod,p.prototype.divide=function(t){return B(this,t)[0]},s.prototype.over=s.prototype.divide=function(t){return new s(this.value/K(t).value)},a.prototype.over=a.prototype.divide=p.prototype.over=p.prototype.divide,p.prototype.mod=function(t){return B(this,t)[1]},s.prototype.mod=s.prototype.remainder=function(t){return new s(this.value%K(t).value)},a.prototype.remainder=a.prototype.mod=p.prototype.remainder=p.prototype.mod,p.prototype.pow=function(t){var e,r,o,n=K(t),i=this.value,p=n.value;if(0===p)return u[1];if(0===i)return u[0];if(1===i)return u[1];if(-1===i)return n.isEven()?u[1]:u[-1];if(n.sign)return u[0];if(!n.isSmall)throw new Error("The exponent "+n.toString()+" is too large.");if(this.isSmall&&l(e=Math.pow(i,p)))return new a(g(e));for(r=this,o=u[1];!0&p&&(o=o.times(r),--p),0!==p;)p/=2,r=r.square();return o},a.prototype.pow=p.prototype.pow,s.prototype.pow=function(t){var e=K(t),r=this.value,o=e.value,n=BigInt(0),i=BigInt(1),p=BigInt(2);if(o===n)return u[1];if(r===n)return u[0];if(r===i)return u[1];if(r===BigInt(-1))return e.isEven()?u[1]:u[-1];if(e.isNegative())return new s(n);for(var a=this,l=u[1];(o&i)===i&&(l=l.times(a),--o),o!==n;)o/=p,a=a.square();return l},p.prototype.modPow=function(t,e){if(t=K(t),(e=K(e)).isZero())throw new Error("Cannot take modPow with modulus 0");var r=u[1],o=this.mod(e);for(t.isNegative()&&(t=t.multiply(u[-1]),o=o.modInv(e));t.isPositive();){if(o.isZero())return u[0];t.isOdd()&&(r=r.multiply(o).mod(e)),t=t.divide(2),o=o.square().mod(e)}return r},s.prototype.modPow=a.prototype.modPow=p.prototype.modPow,p.prototype.compareAbs=function(t){var e=K(t),r=this.value,o=e.value;return e.isSmall?1:A(r,o)},a.prototype.compareAbs=function(t){var e=K(t),r=Math.abs(this.value),o=e.value;return e.isSmall?r===(o=Math.abs(o))?0:r>o?1:-1:-1},s.prototype.compareAbs=function(t){var e=this.value,r=K(t).value;return(e=e>=0?e:-e)===(r=r>=0?r:-r)?0:e>r?1:-1},p.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=K(t),r=this.value,o=e.value;return this.sign!==e.sign?e.sign?1:-1:e.isSmall?this.sign?-1:1:A(r,o)*(this.sign?-1:1)},p.prototype.compareTo=p.prototype.compare,a.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=K(t),r=this.value,o=e.value;return e.isSmall?r==o?0:r>o?1:-1:r<0!==e.sign?r<0?-1:1:r<0?1:-1},a.prototype.compareTo=a.prototype.compare,s.prototype.compare=function(t){if(t===1/0)return-1;if(t===-1/0)return 1;var e=this.value,r=K(t).value;return e===r?0:e>r?1:-1},s.prototype.compareTo=s.prototype.compare,p.prototype.equals=function(t){return 0===this.compare(t)},s.prototype.eq=s.prototype.equals=a.prototype.eq=a.prototype.equals=p.prototype.eq=p.prototype.equals,p.prototype.notEquals=function(t){return 0!==this.compare(t)},s.prototype.neq=s.prototype.notEquals=a.prototype.neq=a.prototype.notEquals=p.prototype.neq=p.prototype.notEquals,p.prototype.greater=function(t){return this.compare(t)>0},s.prototype.gt=s.prototype.greater=a.prototype.gt=a.prototype.greater=p.prototype.gt=p.prototype.greater,p.prototype.lesser=function(t){return this.compare(t)<0},s.prototype.lt=s.prototype.lesser=a.prototype.lt=a.prototype.lesser=p.prototype.lt=p.prototype.lesser,p.prototype.greaterOrEquals=function(t){return this.compare(t)>=0},s.prototype.geq=s.prototype.greaterOrEquals=a.prototype.geq=a.prototype.greaterOrEquals=p.prototype.geq=p.prototype.greaterOrEquals,p.prototype.lesserOrEquals=function(t){return this.compare(t)<=0},s.prototype.leq=s.prototype.lesserOrEquals=a.prototype.leq=a.prototype.lesserOrEquals=p.prototype.leq=p.prototype.lesserOrEquals,p.prototype.isEven=function(){return 0==(1&this.value[0])},a.prototype.isEven=function(){return 0==(1&this.value)},s.prototype.isEven=function(){return(this.value&BigInt(1))===BigInt(0)},p.prototype.isOdd=function(){return 1==(1&this.value[0])},a.prototype.isOdd=function(){return 1==(1&this.value)},s.prototype.isOdd=function(){return(this.value&BigInt(1))===BigInt(1)},p.prototype.isPositive=function(){return!this.sign},a.prototype.isPositive=function(){return this.value>0},s.prototype.isPositive=a.prototype.isPositive,p.prototype.isNegative=function(){return this.sign},a.prototype.isNegative=function(){return this.value<0},s.prototype.isNegative=a.prototype.isNegative,p.prototype.isUnit=function(){return!1},a.prototype.isUnit=function(){return 1===Math.abs(this.value)},s.prototype.isUnit=function(){return this.abs().value===BigInt(1)},p.prototype.isZero=function(){return!1},a.prototype.isZero=function(){return 0===this.value},s.prototype.isZero=function(){return this.value===BigInt(0)},p.prototype.isDivisibleBy=function(t){var e=K(t);return!e.isZero()&&(!!e.isUnit()||(0===e.compareAbs(2)?this.isEven():this.mod(e).isZero()))},s.prototype.isDivisibleBy=a.prototype.isDivisibleBy=p.prototype.isDivisibleBy,p.prototype.isPrime=function(e){var r=P(this);if(r!==t)return r;var o=this.abs(),n=o.bitLength();if(n<=64)return Z(o,[2,3,5,7,11,13,17,19,23,29,31,37]);for(var i=Math.log(2)*n.toJSNumber(),u=Math.ceil(!0===e?2*Math.pow(i,2):i),p=[],a=0;a<u;a++)p.push(bigInt(a+2));return Z(o,p)},s.prototype.isPrime=a.prototype.isPrime=p.prototype.isPrime,p.prototype.isProbablePrime=function(e,r){var o=P(this);if(o!==t)return o;for(var n=this.abs(),i=e===t?5:e,u=[],p=0;p<i;p++)u.push(bigInt.randBetween(2,n.minus(2),r));return Z(n,u)},s.prototype.isProbablePrime=a.prototype.isProbablePrime=p.prototype.isProbablePrime,p.prototype.modInv=function(t){for(var e,r,o,n=bigInt.zero,i=bigInt.one,u=K(t),p=this.abs();!p.isZero();)e=u.divide(p),r=n,o=u,n=i,u=p,i=r.subtract(e.multiply(i)),p=o.subtract(e.multiply(p));if(!u.isUnit())throw new Error(this.toString()+" and "+t.toString()+" are not co-prime");return-1===n.compare(0)&&(n=n.add(t)),this.isNegative()?n.negate():n},s.prototype.modInv=a.prototype.modInv=p.prototype.modInv,p.prototype.next=function(){var t=this.value;return this.sign?w(t,1,this.sign):new p(d(t,1),this.sign)},a.prototype.next=function(){var t=this.value;return t+1<r?new a(t+1):new p(o,!1)},s.prototype.next=function(){return new s(this.value+BigInt(1))},p.prototype.prev=function(){var t=this.value;return this.sign?new p(d(t,1),!0):w(t,1,this.sign)},a.prototype.prev=function(){var t=this.value;return t-1>-r?new a(t-1):new p(o,!0)},s.prototype.prev=function(){return new s(this.value-BigInt(1))};for(var x=[1];2*x[x.length-1]<=e;)x.push(2*x[x.length-1]);var J=x.length,L=x[J-1];function U(t){return Math.abs(t)<=e}function T(t,e,r){e=K(e);for(var o=t.isNegative(),n=e.isNegative(),i=o?t.not():t,u=n?e.not():e,p=0,a=0,s=null,l=null,f=[];!i.isZero()||!u.isZero();)p=(s=B(i,L))[1].toJSNumber(),o&&(p=L-1-p),a=(l=B(u,L))[1].toJSNumber(),n&&(a=L-1-a),i=s[0],u=l[0],f.push(r(p,a));for(var v=0!==r(o?1:0,n?1:0)?bigInt(-1):bigInt(0),h=f.length-1;h>=0;h-=1)v=v.multiply(L).add(bigInt(f[h]));return v}p.prototype.shiftLeft=function(t){var e=K(t).toJSNumber();if(!U(e))throw new Error(String(e)+" is too large for shifting.");if(e<0)return this.shiftRight(-e);var r=this;if(r.isZero())return r;for(;e>=J;)r=r.multiply(L),e-=J-1;return r.multiply(x[e])},s.prototype.shiftLeft=a.prototype.shiftLeft=p.prototype.shiftLeft,p.prototype.shiftRight=function(t){var e,r=K(t).toJSNumber();if(!U(r))throw new Error(String(r)+" is too large for shifting.");if(r<0)return this.shiftLeft(-r);for(var o=this;r>=J;){if(o.isZero()||o.isNegative()&&o.isUnit())return o;o=(e=B(o,L))[1].isNegative()?e[0].prev():e[0],r-=J-1}return(e=B(o,x[r]))[1].isNegative()?e[0].prev():e[0]},s.prototype.shiftRight=a.prototype.shiftRight=p.prototype.shiftRight,p.prototype.not=function(){return this.negate().prev()},s.prototype.not=a.prototype.not=p.prototype.not,p.prototype.and=function(t){return T(this,t,(function(t,e){return t&e}))},s.prototype.and=a.prototype.and=p.prototype.and,p.prototype.or=function(t){return T(this,t,(function(t,e){return t|e}))},s.prototype.or=a.prototype.or=p.prototype.or,p.prototype.xor=function(t){return T(this,t,(function(t,e){return t^e}))},s.prototype.xor=a.prototype.xor=p.prototype.xor;var j=1<<30;function C(t){var r=t.value,o="number"==typeof r?r|j:"bigint"==typeof r?r|BigInt(j):r[0]+r[1]*e|1073758208;return o&-o}function D(t,e){if(e.compareTo(t)<=0){var r=D(t,e.square(e)),o=r.p,n=r.e,i=o.multiply(e);return i.compareTo(t)<=0?{p:i,e:2*n+1}:{p:o,e:2*n}}return{p:bigInt(1),e:0}}function z(t,e){return t=K(t),e=K(e),t.greater(e)?t:e}function R(t,e){return t=K(t),e=K(e),t.lesser(e)?t:e}function k(t,e){if(t=K(t).abs(),e=K(e).abs(),t.equals(e))return t;if(t.isZero())return e;if(e.isZero())return t;for(var r,o,n=u[1];t.isEven()&&e.isEven();)r=R(C(t),C(e)),t=t.divide(r),e=e.divide(r),n=n.multiply(r);for(;t.isEven();)t=t.divide(C(t));do{for(;e.isEven();)e=e.divide(C(e));t.greater(e)&&(o=e,e=t,t=o),e=e.subtract(t)}while(!e.isZero());return n.isUnit()?t:t.multiply(n)}p.prototype.bitLength=function(){var t=this;return t.compareTo(bigInt(0))<0&&(t=t.negate().subtract(bigInt(1))),0===t.compareTo(bigInt(0))?bigInt(0):bigInt(D(t,bigInt(2)).e).add(bigInt(1))},s.prototype.bitLength=a.prototype.bitLength=p.prototype.bitLength;var _=function(t,e,r,o){r=r||n,t=String(t),o||(t=t.toLowerCase(),r=r.toLowerCase());var i,u=t.length,p=Math.abs(e),a={};for(i=0;i<r.length;i++)a[r[i]]=i;for(i=0;i<u;i++){if("-"!==(f=t[i])&&(f in a&&a[f]>=p)){if("1"===f&&1===p)continue;throw new Error(f+" is not a valid digit in base "+e+".")}}e=K(e);var s=[],l="-"===t[0];for(i=l?1:0;i<t.length;i++){var f;if((f=t[i])in a)s.push(K(a[f]));else{if("<"!==f)throw new Error(f+" is not a valid character");var v=i;do{i++}while(">"!==t[i]&&i<t.length);s.push(K(t.slice(v+1,i)))}}return $(s,e,l)};function $(t,e,r){var o,n=u[0],i=u[1];for(o=t.length-1;o>=0;o--)n=n.add(t[o].times(i)),i=i.times(e);return r?n.negate():n}function F(t,e){if((e=bigInt(e)).isZero()){if(t.isZero())return{value:[0],isNegative:!1};throw new Error("Cannot convert nonzero numbers to base 0.")}if(e.equals(-1)){if(t.isZero())return{value:[0],isNegative:!1};if(t.isNegative())return{value:[].concat.apply([],Array.apply(null,Array(-t.toJSNumber())).map(Array.prototype.valueOf,[1,0])),isNegative:!1};var r=Array.apply(null,Array(t.toJSNumber()-1)).map(Array.prototype.valueOf,[0,1]);return r.unshift([1]),{value:[].concat.apply([],r),isNegative:!1}}var o=!1;if(t.isNegative()&&e.isPositive()&&(o=!0,t=t.abs()),e.isUnit())return t.isZero()?{value:[0],isNegative:!1}:{value:Array.apply(null,Array(t.toJSNumber())).map(Number.prototype.valueOf,1),isNegative:o};for(var n,i=[],u=t;u.isNegative()||u.compareAbs(e)>=0;){n=u.divmod(e),u=n.quotient;var p=n.remainder;p.isNegative()&&(p=e.minus(p).abs(),u=u.next()),i.push(p.toJSNumber())}return i.push(u.toJSNumber()),{value:i.reverse(),isNegative:o}}function G(t,e,r){var o=F(t,e);return(o.isNegative?"-":"")+o.value.map((function(t){return function(t,e){return t<(e=e||n).length?e[t]:"<"+t+">"}(t,r)})).join("")}function H(t){if(l(+t)){var e=+t;if(e===g(e))return i?new s(BigInt(e)):new a(e);throw new Error("Invalid integer: "+t)}var r="-"===t[0];r&&(t=t.slice(1));var o=t.split(/e/i);if(o.length>2)throw new Error("Invalid integer: "+o.join("e"));if(2===o.length){var n=o[1];if("+"===n[0]&&(n=n.slice(1)),(n=+n)!==g(n)||!l(n))throw new Error("Invalid integer: "+n+" is not a valid exponent.");var u=o[0],f=u.indexOf(".");if(f>=0&&(n-=u.length-f-1,u=u.slice(0,f)+u.slice(f+1)),n<0)throw new Error("Cannot include negative exponent part for integers");t=u+=new Array(n+1).join("0")}if(!/^([0-9][0-9]*)$/.test(t))throw new Error("Invalid integer: "+t);if(i)return new s(BigInt(r?"-"+t:t));for(var v=[],y=t.length,c=y-7;y>0;)v.push(+t.slice(c,y)),(c-=7)<0&&(c=0),y-=7;return h(v),new p(v,r)}function K(t){return"number"==typeof t?function(t){if(i)return new s(BigInt(t));if(l(t)){if(t!==g(t))throw new Error(t+" is not an integer.");return new a(t)}return H(t.toString())}(t):"string"==typeof t?H(t):"bigint"==typeof t?new s(t):t}p.prototype.toArray=function(t){return F(this,t)},a.prototype.toArray=function(t){return F(this,t)},s.prototype.toArray=function(t){return F(this,t)},p.prototype.toString=function(e,r){if(e===t&&(e=10),10!==e)return G(this,e,r);for(var o,n=this.value,i=n.length,u=String(n[--i]);--i>=0;)o=String(n[i]),u+="0000000".slice(o.length)+o;return(this.sign?"-":"")+u},a.prototype.toString=function(e,r){return e===t&&(e=10),10!=e?G(this,e,r):String(this.value)},s.prototype.toString=a.prototype.toString,s.prototype.toJSON=p.prototype.toJSON=a.prototype.toJSON=function(){return this.toString()},p.prototype.valueOf=function(){return parseInt(this.toString(),10)},p.prototype.toJSNumber=p.prototype.valueOf,a.prototype.valueOf=function(){return this.value},a.prototype.toJSNumber=a.prototype.valueOf,s.prototype.valueOf=s.prototype.toJSNumber=function(){return parseInt(this.toString(),10)};for(var Q=0;Q<1e3;Q++)u[Q]=K(Q),Q>0&&(u[-Q]=K(-Q));return u.one=u[1],u.zero=u[0],u.minusOne=u[-1],u.max=z,u.min=R,u.gcd=k,u.lcm=function(t,e){return t=K(t).abs(),e=K(e).abs(),t.divide(k(t,e)).multiply(e)},u.isInstance=function(t){return t instanceof p||t instanceof a||t instanceof s},u.randBetween=function(t,r,o){t=K(t),r=K(r);var n=o||Math.random,i=R(t,r),p=z(t,r).subtract(i).add(1);if(p.isSmall)return i.add(Math.floor(n()*p));for(var a=F(p,e).value,s=[],l=!0,f=0;f<a.length;f++){var v=l?a[f]+(f+1<a.length?a[f+1]/e:0):e,h=g(n()*v);s.push(h),h<a[f]&&(l=!1)}return i.add(u.fromArray(s,e,!1))},u.fromArray=function(t,e,r){return $(t.map(K),K(e||10),r)},u}();"undefined"!=typeof module&&module.hasOwnProperty("exports")&&(module.exports=bigInt),"function"==typeof define&&define.amd&&define((function(){return bigInt}));
!function(){for(var e={defaultSettings:{url:"https://imgbb.com/upload",vendor:"auto",mode:"auto",lang:"auto",autoInsert:"bbcode-embed-thumbnail",palette:"default",init:"onload",containerClass:1,buttonClass:1,sibling:0,siblingPos:"after",fitEditor:0,observe:0,observeCache:1,html:'<div class="%cClass"><button %x class="%bClass"><span class="%iClass">%iconSvg</span><span class="%tClass">%text</span></button></div>',css:".%cClass{display:inline-block;margin-top:5px;margin-bottom:5px}.%bClass{line-height:normal;-webkit-transition:all .2s;-o-transition:all .2s;transition:all .2s;outline:0;color:%2;border:none;cursor:pointer;border:1px solid rgba(0,0,0,.15);background:%1;border-radius:.2em;padding:.5em 1em;font-size:12px;font-weight:700;text-shadow:none}.%bClass:hover{background:%3;color:%4;border-color:rgba(0,0,0,.1)}.%iClass,.%tClass{display:inline-block;vertical-align:middle}.%iClass svg{display:block;width:1em;height:1em;fill:currentColor}.%tClass{margin-left:.25em}"},ns:{plugin:"imgbb"},palettes:{default:["#ececec","#333","#2980b9","#fff"],clear:["inherit","inherit","inherit","#2980b9"],turquoise:["#16a085","#fff","#1abc9c","#fff"],green:["#27ae60","#fff","#2ecc71","#fff"],blue:["#2980b9","#fff","#3498db","#fff"],purple:["#8e44ad","#fff","#9b59b6","#fff"],darkblue:["#2c3e50","#fff","#34495e","#fff"],yellow:["#f39c12","#fff","#f1c40f","#fff"],orange:["#d35400","#fff","#e67e22","#fff"],red:["#c0392b","#fff","#e74c3c","#fff"],grey:["#ececec","#000","#e0e0e0","#000"],black:["#333","#fff","#666","#fff"]},classProps:["button","container"],iconSvg:'<svg class="%iClass" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M76.7 87.5c12.8 0 23.3-13.3 23.3-29.4 0-13.6-5.2-25.7-15.4-27.5 0 0-3.5-0.7-5.6 1.7 0 0 0.6 9.4-2.9 12.6 0 0 8.7-32.4-23.7-32.4 -29.3 0-22.5 34.5-22.5 34.5 -5-6.4-0.6-19.6-0.6-19.6 -2.5-2.6-6.1-2.5-6.1-2.5C10.9 25 0 39.1 0 54.6c0 15.5 9.3 32.7 29.3 32.7 2 0 6.4 0 11.7 0V68.5h-13l22-22 22 22H59v18.8C68.6 87.4 76.7 87.5 76.7 87.5z" style="fill: currentcolor;"/></svg>',l10n:{ar:"تحميل الصور",cs:"Nahrát obrázky",da:"Upload billeder",de:"Bilder hochladen",es:"Subir imágenes",fi:"Lataa kuvia",fr:"Importer des images",id:"Unggah gambar",it:"Carica immagini",ja:"画像をアップロード",nb:"Last opp bilder",nl:"Upload afbeeldingen",pl:"Wyślij obrazy",pt_BR:"Enviar imagens",ru:"Загрузить изображения",tr:"Resim Yukle",uk:"Завантажити зображення",zh_CN:"上传图片",zh_TW:"上傳圖片"},vendors:{default:{check:function(){return 1},getEditor:function(){var t,e={textarea:{name:["recaptcha","search","recipients","coppa","^comment_list","username_list","add","filecomment","poll_option_text"]},ce:{dataset:["gramm"]}},i=["~","|","^","$","*"],s={};for(t in e){s[t]="";var n,r=e[t];for(n in r)for(var o=0;o<r[n].length;o++){var a="",l=r[n][o],u=l.charAt(0);-1<i.indexOf(u)&&(a=u,l=l.substring(1)),s[t]+=":not(["+("dataset"==n?"data-"+l:n+a+'="'+l+'"')+"])"}}return document.querySelectorAll('[contenteditable=""]'+s.ce+',[contenteditable="true"]'+s.ce+",textarea:not([readonly])"+s.textarea)}},bbpress:{settings:{autoInsert:"html-embed-medium",html:'<input %x type="button" class="ed_button button button-small" aria-label="%text" value="%text">',sibling:"#qt_bbp_reply_content_img",siblingPos:"before"},check:"bbpEngagementJS"},discourse:{settings:{autoInsert:"markdown-embed-medium",html:'<button %x title="%text" class="upload btn no-text btn-icon ember-view"><i class="fa fa-cloud-upload d-icon d-icon-upload"></i></button>',sibling:".upload.btn",siblingPos:"before",observe:".create,#create-topic,.usercard-controls button",observeCache:0,onDemand:1},check:"Discourse"},discuz:{settings:{buttonClass:1,html:'<a %x title="%text" class="%bClass">%iconSvg</a>',sibling:".fclr,#e_attach",css:"a.%bClass,.bar a.%bClass{box-sizing:border-box;cursor:pointer;background:%1;color:%2;text-indent:unset;position:relative}.b1r a.%bClass:hover,a.%bClass:hover{background:%3;color:%4}a.%bClass{font-size:14px}.b1r a.%bClass{border:1px solid rgba(0,0,0,.15)!important;font-size:20px;padding:0;height:44px}.%bClass svg{font-size:1em;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}",palette:"purple"},palettes:{default:["transparent","#333","#2980b9","#fff"]},check:"DISCUZCODE",getEditor:function(){return document.querySelector('.area textarea[name="message"]')}},ipb:{settings:{autoInsert:"html-embed-medium",html:'<a %x class="cke_button cke_button_off %bClass" title="%text" tabindex="-1" hidefocus="true" role="button"><span class="cke_button_icon">%iconSvg</span><span class="cke_button_label" aria-hidden="false">%text</span><span class="cke_button_label" aria-hidden="false"></span></a>',sibling:".cke_button__ipslink",siblingPos:"before",css:".cke_button.%bClass{background:%1;position:relative}.cke_button.%bClass:hover{background:%3;border-color:%5}.cke_button.%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:%2}.cke_button.%bClass:hover svg{fill:%4}"},palettes:{default:["inherit","#444","","inherit"]},check:"ips",getEditorFn:function(){var t=this.getEditor().dataset.ipseditorName;return CKEDITOR.instances[t]},getEditor:function(){return document.querySelector("[data-ipseditor-name]")},editorValue:function(t){t=CKEDITOR.dom.element.createFromHtml("<p>"+t+"</p>");this.getEditorFn().insertElement(t)},useCustomEditor:function(){return 1}},mybb:{settings:{sibling:"#quickreply_e > tr > td > *:last-child, .sceditor-container",fitEditor:0,extracss:".trow2 .%cClass{margin-bottom:0}"},check:"MyBB",getEditor:function(){return MyBBEditor?MyBBEditor.getContentAreaContainer().parentElement:document.querySelector("#quickreply_e textarea")},editorValue:function(t){var e;MyBBEditor?(e=MyBBEditor.inSourceMode()?"insert":"wysiwygEditorInsertHtml",MyBBEditor[e]("insert"==e?t:MyBBEditor.fromBBCode(t))):this.getEditor().value+=t},useCustomEditor:function(){return!!MyBBEditor}},nodebb:{settings:{autoInsert:"markdown-embed-medium",html:'<li %x tabindex="-1" title="%text"><i class="fa fa-cloud-upload"></i></li>',sibling:'[data-format="picture-o"]',siblingPos:"before",observe:'[component="category/post"],[component="topic/reply"],[component="topic/reply-as-topic"],[component="post/reply"],[component="post/quote"]',observeCache:0,onDemand:1},check:"__nodebbSpamBeGoneCreateCaptcha__",callback:function(){for(var t=document.querySelectorAll(".btn-toolbar .img-upload-btn"),e=0;e<t.length;e++)t[e].parentNode.removeChild(t[e])}},phpbb:{settings:{html:document.querySelector("#format-buttons *:first-child")&&"BUTTON"==document.querySelector("#format-buttons *:first-child").tagName?' <button %x type="button" class="button button-icon-only" title="%text"><i class="icon fa-cloud-upload fa-fw" aria-hidden="true"></i></button> ':' <input %x type="button" class="button2" value="%text"> ',sibling:document.querySelector("#format-buttons *:first-child")&&"BUTTON"==document.querySelector("#format-buttons *:first-child").tagName?".bbcode-img":"#message-box textarea.inputbox",siblingPos:"after"},check:"phpbb",getEditor:function(){if("undefined"!=typeof form_name&&"undefined"!=typeof text_name)return document.forms[form_name].elements[text_name]}},proboards:{settings:{html:' <input %x type="submit" value="%text"> ',css:"",sibling:"input[type=submit]",siblingPos:"before"},check:"proboards",editorValue:function(t){var e=$(".wysiwyg-textarea").data("wysiwyg"),e=e.editors[e.currentEditorName];e.setContent(e.getContent()+t)},useCustomEditor:function(){return 1!==$(".container.quick-reply").size()},getEditor:function(){return document.querySelector("textarea[name=message]")}},redactor2:{getEditor:function(){var t=this.getEditorFn();return t?(this.useCustomEditor()?t.$box:t)[0]:null},getEditorEl:function(){return(this.useCustomEditor()?this.getEditorFn().$editor:this.getEditorFn())[0]},editorValue:function(t){var e,i=this.useCustomEditor()?"innerHTML":"value";{if("string"!=typeof t)return e=this.getEditorEl()[i],this.useCustomEditor()&&"<p><br></p>"==e?"":this.getEditorEl()[i];this.useCustomEditor()?(e="<p>"+t+"</p>",this.getEditorFn().insert.html(""!==this.editorValue()?"<p><br></p>"+e:e)):this.getEditorEl()[i]=t}},useCustomEditor:function(){return!(this.getEditorFn()instanceof jQuery)}},smf:{settings:{html:' <button %x title="%text" class="%bClass"><span class="%iClass">%iconSvg</span><span class="%tClass">%text</span></button> ',css:"%defaultCSS #bbcBox_message .%bClass{margin-right:1px;transition:none;color:%2;padding:0;width:23px;height:21px;border-radius:5px;background-color:%1}#bbcBox_message .%bClass:hover{background-color:%3}#bbcBox_message .%tClass{display:none}",sibling:"#BBCBox_message_button_1_1,.quickReplyContent + div",siblingPos:"before",fitEditor:1},palettes:{default:["#E7E7E7","#333","#B0C4D6","#333"]},check:"smf_scripturl",getEditor:function(){return 0<smf_editorArray.length?smf_editorArray[0].oTextHandle:document.querySelector(".quickReplyContent textarea")}},quill:{settings:{autoInsert:"html-embed-medium",html:'<li class="richEditor-menuItem richEditor-menuItem_f1af88yq" role="menuitem"><button %x class="richEditor-button richEditor-embedButton richEditor-button_f1fodmu3" type="button" aria-pressed="false"><span class="richEditor-iconWrap_f13bdese"></span>%iconSvg</button></li>',sibling:"ul.richEditor-menuItems li.richEditor-menuItem:last-child",css:".%iClass {display: block; height: 24px; margin: auto; width: 24px;}"},check:"quill",editorValue:function(t){quill.clipboard.dangerouslyPasteHTML("\n"==quill.getText()?0:quill.getLength(),t)},useCustomEditor:function(){return 1},getEditor:function(){return quill.container}},vanilla:{settings:{autoInsert:"markdown-embed-medium",html:'<span %x class="icon fas fa-cloud-upload-alt" title="%text"></span>',sibling:".editor-dropdown-upload"},check:"Vanilla",getEditor:function(){return document.getElementById("Form_Body")}},vbulletin:{settings:{autoInsert:"html-embed-medium",html:'<li %x class="%bClass b-toolbar__item b-toolbar__item--secondary" title="%text" tabindex="0">%iconSvg</li>',sibling:".b-toolbar__item--secondary:first-child",siblingPos:"before",css:".%bClass{background:%1;color:%2;position:relative}.%bClass:hover{background:%3;color:%4;border-color:%5}.%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}"},palettes:{default:["","#4B6977","","#007EB8"]},check:"vBulletin",getEditorFn:function(){var t=this.getEditor().getAttribute("ck-editorid");return CKEDITOR.instances[t]},getEditor:function(){return document.querySelector("[data-message-type]")},editorValue:function(t){t=CKEDITOR.dom.element.createFromHtml("<p>"+t+"</p>");this.getEditorFn().insertElement(t)},useCustomEditor:function(){return 1}},WoltLab:{settings:{autoInsert:"html-embed-medium",sibling:'li[data-name="settings"]',html:'<li %x><a><span class="icon icon16 fa-cloud-upload"></span> <span>%text</span></a></li>'},check:"WBB",getEditorFn:function(){var t=$("#text").data("redactor");return t||null}},XF1:{settings:{autoInsert:"html-embed-medium",containerClass:1,buttonClass:1,html:'<li class="%cClass"><a %x class="%bClass" unselectable="on" title="%text">%iconSvg</a></li>',sibling:".redactor_btn_container_image",siblingPos:"before",css:"li.%cClass .%bClass{background:%1;color:%2;text-indent:unset;border-radius:3px;position:relative}li.%cClass a.%bClass:hover{background:%3;color:%4;border-color:%5}.%cClass .%bClass svg{font-size:15px;width:1em;height:1em;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%;fill:currentColor}",observe:".edit.OverlayTrigger",observeCache:1},palettes:{default:["none","inherit","none","inherit",""]},check:"XenForo",getEditorFn:function(){var t=document.querySelector("#exposeMask")&&document.querySelector("#exposeMask").offsetParent?".xenOverlay form":"form";if("form"!==t)for(var e=document.querySelectorAll(t),i=0;i<e.length;i++)if(e[i].offsetParent){t+='[action="'+e[i].getAttribute("action")+'"]';break}return XenForo.getEditorInForm(t)},getEditor:function(){var t=this.getEditorFn();return t?(this.useCustomEditor()?t.$box:t)[0]:null},getEditorEl:function(){return(this.useCustomEditor()?this.getEditorFn().$editor:this.getEditorFn())[0]},editorValue:function(t){var e,i=this.useCustomEditor()?"innerHTML":"value";{if("string"!=typeof t)return e=this.getEditorEl()[i],this.useCustomEditor()&&"<p><br></p>"==e?"":this.getEditorEl()[i];this.useCustomEditor()?(e="<p>"+t+"</p>",this.getEditorFn().insertHtml(""!==this.editorValue()?"<p><br></p>"+e:e)):this.getEditorEl()[i]=t}},useCustomEditor:function(){return!(this.getEditorFn()instanceof jQuery)}},XF2:{settings:{autoInsert:"html-embed-medium",containerClass:1,buttonClass:"button--link js-attachmentUpload button button--icon button--icon--upload fa--xf",html:'<div class="formButtonGroup"><div class="formButtonGroup-extra"><button type="button" tabindex="-1" role="button" title="%text" class="%bClass" %x><span class="button-text">%text</span></button></div></div>',sibling:"",siblingPos:"after",observe:'[data-xf-click="quick-edit"]',observeCache:1},palettes:{default:["transparent","#505050","rgba(20,20,20,0.06)","#141414"]},check:"XF",getEditorFn:function(t){var e=".js-editor";return"string"==typeof t&&(e=this.getEditorSel(t)),XF.getEditorInContainer($(e))},getEditorSel:function(t){return"["+e.ns.dataPluginTarget+'="'+t+'"]'},getEditor:function(t){return"string"==typeof t?document.querySelector(this.getEditorSel(t)):document.querySelectorAll(".js-editor")},getBbCode:function(t){return t.getTextArea()[0].value},editorValue:function(t,e){var i,s="<p><br></p>",n=this.getEditorFn(e),r=n.ed.bbCode.isBbCodeView()?["bbCode","getBbCode","insertBbCode"]:["html","get","insert"],o=n.ed[r[0]];return"string"==typeof t?(i=""!==this.editorValue(!1,e),void("html"==r[0]?(n="<p>"+t+"</p>",o[r[2]](i?s+n:n)):XF.ajax("POST",XF.canonicalizeUrl("index.php?editor/to-bb-code"),{html:t}).done(function(t){o[r[2]](i?"\n"+t.bbCode:t.bbCode)}))):(e=void 0===o[r[1]]?this.getBbCode(o):o[r[1]](),this.useCustomEditor()&&e==s?"":e)},useCustomEditor:function(){return void 0!==XF.getEditorInContainer($(".js-editor"))}}},generateGuid:function(){var i=(new Date).getTime();return"undefined"!=typeof performance&&"function"==typeof performance.now&&(i+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=(i+16*Math.random())%16|0;return i=Math.floor(i/16),("x"===t?e:3&e|8).toString(16)})},getNewValue:function(t,e){var i="string"!=typeof t.getAttribute("contenteditable")?"value":"innerHTML",s="value"==i?"\n":"<br>",t=t[i],i=e;if(!1,0==t.length)return i;e="",t=t.match(/\n+$/g),t=t?t[0].split("\n").length:0;return t<=2&&(e+=s.repeat(0==t?2:1)),e+i},insertTrigger:function(){var t,e=this.vendors[this.settings.vendor],i=this.settings.sibling?document.querySelectorAll(this.settings.sibling+":not(["+this.ns.dataPlugin+"])")[0]:0;if("auto"==this.settings.mode)t=this.vendors[e.hasOwnProperty("getEditor")?this.settings.vendor:"default"].getEditor();else{for(var s=document.querySelectorAll("["+this.ns.dataPluginTrigger+"][data-target]:not(["+this.ns.dataPluginId+"])"),n=[],r=0;r<s.length;r++)n.push(s[r].dataset.target);0<n.length&&(t=document.querySelectorAll(n.join(",")))}if(t){!document.getElementById(this.ns.pluginStyle)&&this.settings.css&&(o=document.createElement("style"),a=this.settings.css,a=this.appyTemplate(a),o.type="text/css",o.innerHTML=a.replace(/%p/g,"."+this.ns.plugin),o.setAttribute("id",this.ns.pluginStyle),document.body.appendChild(o)),t instanceof NodeList||(t=[t]);for(var o,a,l,u=0,r=0;r<t.length;r++)t[r].getAttribute(this.ns.dataPluginTarget)||((l=i||t[r]).setAttribute(this.ns.dataPlugin,"sibling"),l.insertAdjacentHTML({before:"beforebegin",after:"afterend"}[this.settings.siblingPos],this.appyTemplate(this.settings.html)),l=l.parentElement.querySelector("["+this.ns.dataPluginTrigger+"]"),this.setBoundId(l,t[r]),u++);this.triggerCounter=u,"function"==typeof e.callback&&e.callback.call()}},appyTemplate:function(t){if(!this.cacheTable){var e=[{"%iconSvg":this.iconSvg},{"%text":this.settings.langString}];if(this.palette){for(var i=/%(\d+)/g,s=i.exec(t),n=[];null!==s;)-1==n.indexOf(s[1])&&n.push(s[1]),s=i.exec(t);if(n){n.sort(function(t,e){return e-t});this.vendors[this.settings.vendor];for(var r=0;r<n.length;r++){var o=n[r]-1,a=this.palette[o]||"",o=(a||"default"===this.settings.vendor||"default"===this.settings.palette||(a=this.palette[o-2]),{});o["%"+n[r]]=a,e.push(o)}}}for(var l=this.settings.buttonClass||this.ns.plugin+"-button",u=[{"%cClass":this.settings.containerClass||this.ns.plugin+"-container"},{"%bClass":l},{"%iClass":l+"-icon"},{"%tClass":l+"-text"},{"%x":this.ns.dataPluginTrigger},{"%p":this.ns.plugin}],r=0;r<u.length;r++)e.push(u[r]);this.cacheTable=e}return this.strtr(t,this.cacheTable)},strtr:function(t,e){if(!(t=t.toString())||void 0===e)return t;for(var i=0;i<e.length;i++){var s,n=e[i];for(s in n)void 0!==n[s]&&(re=new RegExp(s,"g"),t=t.replace(re,n[s]))}return t},setBoundId:function(t,e){var i=this.generateGuid();t.setAttribute(this.ns.dataPluginId,i),e.setAttribute(this.ns.dataPluginTarget,i)},openPopup:function(t){if("string"==typeof t){var e=this;if(void 0===this.popups&&(this.popups={}),void 0===this.popups[t]){this.popups[t]={};var i,s={l:null!=window.screenLeft?window.screenLeft:screen.left,t:null!=window.screenTop?window.screenTop:screen.top,w:window.innerWidth||document.documentElement.clientWidth||screen.width,h:window.innerHeight||document.documentElement.clientHeight||screen.height},n={w:720,h:690},r={w:.5,h:.85};for(i in n)n[i]/s[i]>r[i]&&(n[i]=s[i]*r[i]);var o=Math.trunc(s.w/2-n.w/2+s.l),a=Math.trunc(s.h/2-n.h/2+s.t);this.popups[t].window=window.open(this.settings.url,t,"width="+n.w+",height="+n.h+",top="+a+",left="+o),this.popups[t].timer=window.setInterval(function(){e.popups[t].window&&!1===e.popups[t].window.closed||(window.clearInterval(e.popups[t].timer),e.popups[t]=void 0)},200)}else this.popups[t].window.focus()}},postSettings:function(t){this.popups[t].window.postMessage({id:t,settings:this.settings},this.settings.url)},liveBind:function(n,t,r){document.addEventListener(t,function(t){var e=document.querySelectorAll(n);if(e){for(var i=t.target,s=-1;i&&-1===(s=Array.prototype.indexOf.call(e,i));)i=i.parentElement;-1<s&&(t.preventDefault(),r.call(t,i))}},!0)},prepare:function(){var e=this,t=(this.ns.dataPlugin="data-"+this.ns.plugin,this.ns.dataPluginId=this.ns.dataPlugin+"-id",this.ns.dataPluginTrigger=this.ns.dataPlugin+"-trigger",this.ns.dataPluginTarget=this.ns.dataPlugin+"-target",this.ns.pluginStyle=this.ns.plugin+"-style",this.ns.selDataPluginTrigger="["+this.ns.dataPluginTrigger+"]",document.currentScript||document.getElementById(this.ns.plugin+"-src")),i=(t?t.dataset.buttonTemplate&&(t.dataset.html=t.dataset.buttonTemplate):t={dataset:{}},0);for(n in this.settings={},this.defaultSettings){var s=(t&&t.dataset[n]?t.dataset:this.defaultSettings)[n];"string"==typeof(s="1"===s||"0"===s?"true"==s:s)&&-1<this.classProps.indexOf(n.replace(/Class$/,""))&&(i=1),this.settings[n]=s}if("auto"==this.settings.vendor)for(var n in this.settings.vendor="default",this.settings.fitEditor=0,this.vendors)if("default"!=n&&void 0!==window[this.vendors[n].check]){this.settings.vendor=n;break}var r=["lang","url","vendor","target"],o=("default"==this.settings.vendor&&(this.vendors.default.settings={}),this.vendors[this.settings.vendor]);if(o.settings)for(var n in o.settings)t&&t.dataset.hasOwnProperty(n)||(this.settings[n]=o.settings[n]);else for(var n in o.settings={},this.defaultSettings)-1==r.indexOf(n)&&(o.settings[n]=this.defaultSettings[n]);if("default"!==this.settings.vendor)if(o.settings.hasOwnProperty("fitEditor")||t.dataset.hasOwnProperty("fitEditor")||(this.settings.fitEditor=1),this.settings.fitEditor)i=!o.settings.css;else{r=["autoInsert","observe","observeCache"];for(n in o.settings)-1!=r.indexOf(n)||t.dataset.hasOwnProperty(n)||(this.settings[n]=this.defaultSettings[n])}i?this.settings.css="":(this.settings.css=this.settings.css.replace("%defaultCSS",this.defaultSettings.css),o.settings.extracss&&this.settings.css&&(this.settings.css+=o.settings.extracss),1<(l=this.settings.palette.split(",")).length?this.palette=l:this.palettes.hasOwnProperty(l)||(this.settings.palette="default"),this.palette||(this.palette=(this.settings.fitEditor&&o.palettes&&o.palettes[this.settings.palette]?o:this).palettes[this.settings.palette]));for(var d=this.classProps,a=0;a<d.length;a++){var c=d[a]+"Class";"string"!=typeof this.settings[c]&&(this.settings[c]=this.ns.plugin+"-"+d[a],this.settings.fitEditor&&(this.settings[c]+="--"+this.settings.vendor))}var l=("auto"==this.settings.lang?navigator.language||navigator.userLanguage:this.settings.lang).replace("-","_"),l=(this.settings.langString="Upload images",l in this.l10n?l:l.substring(0,2)in this.l10n?l.substring(0,2):null),l=(l&&(this.settings.langString=this.l10n[l]),document.createElement("a")),u=(l.href=this.settings.url,this.originUrlPattern="^"+(l.protocol+"//"+l.hostname).replace(/\./g,"\\.").replace(/\//g,"\\/")+"$",document.querySelectorAll(this.ns.selDataPluginTrigger+"[data-target]"));if(0<u.length)for(a=0;a<u.length;a++){var g=document.querySelector(u[a].dataset.target);this.setBoundId(u[a],g)}this.settings.observe&&(l=this.settings.observe,this.settings.observeCache&&(l+=":not(["+this.ns.dataPlugin+"])"),this.liveBind(l,"click",function(t){t.setAttribute(e.ns.dataPlugin,1),e.observe()}.bind(this))),this.settings.sibling&&!this.settings.onDemand?this.waitForSibling():"onload"==this.settings.init?"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(t){e.init()},!1):this.init():this.observe()},observe:function(){this.waitForSibling("observe")},waitForSibling:function(t){var e=this.initialized?"insertTrigger":"init";if(this.settings.sibling)var i=document.querySelector(this.settings.sibling+":not(["+this.ns.dataPlugin+"])");else if("observe"==t&&(this[e](),this.triggerCounter))return;i?this[e]():"complete"===document.readyState&&"observe"!==t||setTimeout(("observe"==t?this.observe:this.waitForSibling).bind(this),250)},init:function(){this.insertTrigger();var o=this,a=this.vendors[this.settings.vendor];this.liveBind(this.ns.selDataPluginTrigger,"click",function(t){t=t.getAttribute(o.ns.dataPluginId);o.openPopup(t)}),window.addEventListener("message",function(t){if(new RegExp(o.originUrlPattern,"i").test(t.origin)||void 0!==t.data.id&&void 0!==t.data.message){
    if(t.data.message){t.data.message=t.data.message.replace(/\[[^\]]*\]/g, '');}   
var e,i=t.data.id;if(i&&t.source===o.popups[i].window)if(t.data.requestAction&&o.hasOwnProperty(t.data.requestAction))o[t.data.requestAction](i);else{if("default"!==o.settings.vendor){if(a.hasOwnProperty("useCustomEditor")&&a.useCustomEditor())return void a.editorValue(t.data.message,i);a.hasOwnProperty("getEditor")&&(e=a.getEditor())}if(e=e||document.querySelector("["+o.ns.dataPluginTarget+'="'+i+'"]'))for(var i=null===e.getAttribute("contenteditable")?"value":"innerHTML",s=(e[i]+=o.getNewValue(e,t.data.message),["blur","focus","input","change","paste"]),n=0;n<s.length;n++){var r=new Event(s[n]);e.dispatchEvent(r)}
else if(i=='208909ee-fe1f-4f6f-9491-8c639baed6eb'){setPicExternal(t.data.message);}
else if(i=='208909ee-fe1f-4f6f-9491-8c639baed6ec'){addFilesToMemorandum(t.data.message);}
else alert("Target not found")}}},!1),this.initialized=1}},t=["WoltLab","XF1"],i=0;i<t.length;i++)e.vendors[t[i]]=Object.assign(Object.assign({},e.vendors.redactor2),e.vendors[t[i]]);e.prepare()}();