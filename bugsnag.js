(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bugsnag = f()}})(function(){var define,module,exports;
// minimal implementations of useful ES functionality
// all we really need for arrays is reduce – everything else is just sugar!
// Array#reduce
var reduce = function (arr, fn, accum) {
  var val = accum;

  for (var i = 0, len = arr.length; i < len; i++) {
    val = fn(val, arr[i], i, arr);
  }

  return val;
}; // Array#filter


var filter = function (arr, fn) {
  return reduce(arr, function (accum, item, i, arr) {
    return !fn(item, i, arr) ? accum : accum.concat(item);
  }, []);
}; // Array#map


var map = function (arr, fn) {
  return reduce(arr, function (accum, item, i, arr) {
    return accum.concat(fn(item, i, arr));
  }, []);
}; // Array#includes


var includes = function (arr, x) {
  return reduce(arr, function (accum, item, i, arr) {
    return accum === true || item === x;
  }, false);
};

var _hasDontEnumBug = !{
  toString: null
}.propertyIsEnumerable('toString');

var _dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor']; // Object#keys

var keys = function (obj) {
  // stripped down version of
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/Keys
  var result = [];
  var prop;

  for (prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) result.push(prop);
  }

  if (!_hasDontEnumBug) return result;

  for (var i = 0, len = _dontEnums.length; i < len; i++) {
    if (Object.prototype.hasOwnProperty.call(obj, _dontEnums[i])) result.push(_dontEnums[i]);
  }

  return result;
}; // Array#isArray


var isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

var _pad = function (n) {
  return n < 10 ? "0" + n : n;
}; // Date#toISOString


var isoDate = function () {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  var d = new Date();
  return d.getUTCFullYear() + '-' + _pad(d.getUTCMonth() + 1) + '-' + _pad(d.getUTCDate()) + 'T' + _pad(d.getUTCHours()) + ':' + _pad(d.getUTCMinutes()) + ':' + _pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};

var _$esUtils_8 = {
  map: map,
  reduce: reduce,
  filter: filter,
  includes: includes,
  keys: keys,
  isArray: isArray,
  isoDate: isoDate
};

var _$validators_14 = {};
_$validators_14.intRange = function (min, max) {
  if (min === void 0) {
    min = 1;
  }

  if (max === void 0) {
    max = Infinity;
  }

  return function (value) {
    return typeof value === 'number' && parseInt('' + value, 10) === value && value >= min && value <= max;
  };
};

_$validators_14.stringWithLength = function (value) {
  return typeof value === 'string' && !!value.length;
};

var _$config_5 = {};
var __filter_5 = _$esUtils_8.filter,
    __reduce_5 = _$esUtils_8.reduce,
    __keys_5 = _$esUtils_8.keys,
    __isArray_5 = _$esUtils_8.isArray,
    __includes_5 = _$esUtils_8.includes;

var intRange = _$validators_14.intRange,
    stringWithLength = _$validators_14.stringWithLength;

_$config_5.schema = {
  apiKey: {
    defaultValue: function () {
      return null;
    },
    message: 'is required',
    validate: stringWithLength
  },
  appVersion: {
    defaultValue: function () {
      return null;
    },
    message: 'should be a string',
    validate: function (value) {
      return value === null || stringWithLength(value);
    }
  },
  appType: {
    defaultValue: function () {
      return null;
    },
    message: 'should be a string',
    validate: function (value) {
      return value === null || stringWithLength(value);
    }
  },
  autoNotify: {
    defaultValue: function () {
      return true;
    },
    message: 'should be true|false',
    validate: function (value) {
      return value === true || value === false;
    }
  },
  beforeSend: {
    defaultValue: function () {
      return [];
    },
    message: 'should be a function or array of functions',
    validate: function (value) {
      return typeof value === 'function' || __isArray_5(value) && __filter_5(value, function (f) {
        return typeof f === 'function';
      }).length === value.length;
    }
  },
  endpoints: {
    defaultValue: function () {
      return {
        notify: 'https://notify.bugsnag.com',
        sessions: 'https://sessions.bugsnag.com'
      };
    },
    message: 'should be an object containing endpoint URLs { notify, sessions }. sessions is optional if autoCaptureSessions=false',
    validate: function (val, obj) {
      return (// first, ensure it's an object
        val && typeof val === 'object' && // endpoints.notify must always be set
        stringWithLength(val.notify) && ( // endpoints.sessions must be set unless session tracking is explicitly off
        obj.autoCaptureSessions === false || stringWithLength(val.sessions)) && // ensure no keys other than notify/session are set on endpoints object
        __filter_5(__keys_5(val), function (k) {
          return !__includes_5(['notify', 'sessions'], k);
        }).length === 0
      );
    }
  },
  autoCaptureSessions: {
    defaultValue: function (val, opts) {
      return opts.endpoints === undefined || !!opts.endpoints && !!opts.endpoints.sessions;
    },
    message: 'should be true|false',
    validate: function (val) {
      return val === true || val === false;
    }
  },
  notifyReleaseStages: {
    defaultValue: function () {
      return null;
    },
    message: 'should be an array of strings',
    validate: function (value) {
      return value === null || __isArray_5(value) && __filter_5(value, function (f) {
        return typeof f === 'string';
      }).length === value.length;
    }
  },
  releaseStage: {
    defaultValue: function () {
      return 'production';
    },
    message: 'should be a string',
    validate: function (value) {
      return typeof value === 'string' && value.length;
    }
  },
  maxBreadcrumbs: {
    defaultValue: function () {
      return 20;
    },
    message: 'should be a number ≤40',
    validate: function (value) {
      return intRange(0, 40)(value);
    }
  },
  autoBreadcrumbs: {
    defaultValue: function () {
      return true;
    },
    message: 'should be true|false',
    validate: function (value) {
      return typeof value === 'boolean';
    }
  },
  user: {
    defaultValue: function () {
      return null;
    },
    message: '(object) user should be an object',
    validate: function (value) {
      return typeof value === 'object';
    }
  },
  metaData: {
    defaultValue: function () {
      return null;
    },
    message: 'should be an object',
    validate: function (value) {
      return typeof value === 'object';
    }
  },
  logger: {
    defaultValue: function () {
      return undefined;
    },
    message: 'should be null or an object with methods { debug, info, warn, error }',
    validate: function (value) {
      return !value || value && __reduce_5(['debug', 'info', 'warn', 'error'], function (accum, method) {
        return accum && typeof value[method] === 'function';
      }, true);
    }
  },
  filters: {
    defaultValue: function () {
      return ['password'];
    },
    message: 'should be an array of strings|regexes',
    validate: function (value) {
      return __isArray_5(value) && value.length === __filter_5(value, function (s) {
        return typeof s === 'string' || s && typeof s.test === 'function';
      }).length;
    }
  }
};

_$config_5.mergeDefaults = function (opts, schema) {
  if (!opts || !schema) throw new Error('opts and schema objects are required');
  return __reduce_5(__keys_5(schema), function (accum, key) {
    accum[key] = opts[key] !== undefined ? opts[key] : schema[key].defaultValue(opts[key], opts);
    return accum;
  }, {});
};

_$config_5.validate = function (opts, schema) {
  if (!opts || !schema) throw new Error('opts and schema objects are required');
  var errors = __reduce_5(__keys_5(schema), function (accum, key) {
    if (schema[key].validate(opts[key], opts)) return accum;
    return accum.concat({
      key: key,
      message: schema[key].message,
      value: opts[key]
    });
  }, []);
  return {
    valid: !errors.length,
    errors: errors
  };
};

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var schema = _$config_5.schema;

var __map_1 = _$esUtils_8.map;

var __stringWithLength_1 = _$validators_14.stringWithLength;

var _$config_1 = {
  releaseStage: {
    defaultValue: function () {
      if (/^localhost(:\d+)?$/.test(window.location.host)) return 'development';
      return 'production';
    },
    message: 'should be set',
    validate: __stringWithLength_1
  },
  logger: _extends({}, schema.logger, {
    defaultValue: function () {
      return (// set logger based on browser capability
        typeof console !== 'undefined' && typeof console.debug === 'function' ? getPrefixedConsole() : undefined
      );
    }
  })
};

var getPrefixedConsole = function () {
  var logger = {};
  var consoleLog = console['log'];
  __map_1(['debug', 'info', 'warn', 'error'], function (method) {
    var consoleMethod = console[method];
    logger[method] = typeof consoleMethod === 'function' ? consoleMethod.bind(console, '[bugsnag]') : consoleLog.bind(console, '[bugsnag]');
  });
  return logger;
};

var __isoDate_3 = _$esUtils_8.isoDate;

var BugsnagBreadcrumb =
/*#__PURE__*/
function () {
  function BugsnagBreadcrumb(name, metaData, type, timestamp) {
    if (name === void 0) {
      name = '[anonymous]';
    }

    if (metaData === void 0) {
      metaData = {};
    }

    if (type === void 0) {
      type = 'manual';
    }

    if (timestamp === void 0) {
      timestamp = __isoDate_3();
    }

    this.type = type;
    this.name = name;
    this.metaData = metaData;
    this.timestamp = timestamp;
  }

  var _proto = BugsnagBreadcrumb.prototype;

  _proto.toJSON = function toJSON() {
    return {
      type: this.type,
      name: this.name,
      timestamp: this.timestamp,
      metaData: this.metaData
    };
  };

  return BugsnagBreadcrumb;
}();

var _$BugsnagBreadcrumb_3 = BugsnagBreadcrumb;

// This is a heavily modified/simplified version of
//   https://github.com/othiym23/async-some
//
// We can't use that because:
//   a) it inflates the bundle size to over 10kB
//   b) it depends on a module that uses Object.keys()
//      (which we can't use due to ie8 support)
// run the asynchronous test function (fn) over each item in the array (arr)
// in series until:
//   - fn(item, cb) => calls cb(null, true)
//   - or the end of the array is reached
// the callback (cb) will be passed true if any of the items resulted in a true
// callback, otherwise false
var _$asyncSome_6 = function (arr, fn, cb) {
  var length = arr.length;
  var index = 0;

  var next = function () {
    if (index >= length) return cb(null, false);
    fn(arr[index], function (err, result) {
      if (err) return cb(err, false);
      if (result === true) return cb(null, true);
      index++;
      next();
    });
  };

  next();
};

var _$inferReleaseStage_10 = function (client) {
  return client.app && typeof client.app.releaseStage === 'string' ? client.app.releaseStage : client.config.releaseStage;
};

/**
 * Expose `isError`.
 */
var _$isError_20 = isError;
/**
 * Test whether `value` is error object.
 *
 * @param {*} value
 * @returns {boolean}
 */

function isError(value) {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
      return true;

    case '[object Exception]':
      return true;

    case '[object DOMException]':
      return true;

    default:
      return value instanceof Error;
  }
}

var _$iserror_11 = _$isError_20;

var _$runBeforeSend_13 = function (report, onError) {
  return function (fn, cb) {
    if (typeof fn !== 'function') return cb(null, false);

    try {
      // if function appears sync…
      if (fn.length !== 2) {
        var ret = fn(report); // check if it returned a "thenable" (promise)

        if (ret && typeof ret.then === 'function') {
          return ret.then( // resolve
          function (val) {
            return setTimeout(function () {
              return cb(null, shouldPreventSend(report, val));
            }, 0);
          }, // reject
          function (err) {
            setTimeout(function () {
              onError(err);
              return cb(null, false);
            });
          });
        }

        return cb(null, shouldPreventSend(report, ret));
      } // if function is async…


      fn(report, function (err, result) {
        if (err) {
          onError(err);
          return cb(null, false);
        }

        cb(null, shouldPreventSend(report, result));
      });
    } catch (e) {
      onError(e);
      cb(null, false);
    }
  };
};

var shouldPreventSend = function (report, value) {
  return report.isIgnored() || value === false;
};

var _$stackframe_22 = {};
(function (root, factory) {
  'use strict'; // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

  /* istanbul ignore next */

  if (typeof define === 'function' && define.amd) {
    define('stackframe', [], factory);
  } else if (typeof _$stackframe_22 === 'object') {
    _$stackframe_22 = factory();
  } else {
    root.StackFrame = factory();
  }
})(this, function () {
  'use strict';

  function _isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  function _getter(p) {
    return function () {
      return this[p];
    };
  }

  var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
  var numericProps = ['columnNumber', 'lineNumber'];
  var stringProps = ['fileName', 'functionName', 'source'];
  var arrayProps = ['args'];
  var props = booleanProps.concat(numericProps, stringProps, arrayProps);

  function StackFrame(obj) {
    if (obj instanceof Object) {
      for (var i = 0; i < props.length; i++) {
        if (obj.hasOwnProperty(props[i]) && obj[props[i]] !== undefined) {
          this['set' + _capitalize(props[i])](obj[props[i]]);
        }
      }
    }
  }

  StackFrame.prototype = {
    getArgs: function () {
      return this.args;
    },
    setArgs: function (v) {
      if (Object.prototype.toString.call(v) !== '[object Array]') {
        throw new TypeError('Args must be an Array');
      }

      this.args = v;
    },
    getEvalOrigin: function () {
      return this.evalOrigin;
    },
    setEvalOrigin: function (v) {
      if (v instanceof StackFrame) {
        this.evalOrigin = v;
      } else if (v instanceof Object) {
        this.evalOrigin = new StackFrame(v);
      } else {
        throw new TypeError('Eval Origin must be an Object or StackFrame');
      }
    },
    toString: function () {
      var functionName = this.getFunctionName() || '{anonymous}';
      var args = '(' + (this.getArgs() || []).join(',') + ')';
      var fileName = this.getFileName() ? '@' + this.getFileName() : '';
      var lineNumber = _isNumber(this.getLineNumber()) ? ':' + this.getLineNumber() : '';
      var columnNumber = _isNumber(this.getColumnNumber()) ? ':' + this.getColumnNumber() : '';
      return functionName + args + fileName + lineNumber + columnNumber;
    }
  };

  for (var i = 0; i < booleanProps.length; i++) {
    StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);

    StackFrame.prototype['set' + _capitalize(booleanProps[i])] = function (p) {
      return function (v) {
        this[p] = Boolean(v);
      };
    }(booleanProps[i]);
  }

  for (var j = 0; j < numericProps.length; j++) {
    StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);

    StackFrame.prototype['set' + _capitalize(numericProps[j])] = function (p) {
      return function (v) {
        if (!_isNumber(v)) {
          throw new TypeError(p + ' must be a Number');
        }

        this[p] = Number(v);
      };
    }(numericProps[j]);
  }

  for (var k = 0; k < stringProps.length; k++) {
    StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);

    StackFrame.prototype['set' + _capitalize(stringProps[k])] = function (p) {
      return function (v) {
        this[p] = String(v);
      };
    }(stringProps[k]);
  }

  return StackFrame;
});

var _$errorStackParser_19 = {};
(function (root, factory) {
  'use strict'; // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

  /* istanbul ignore next */

  if (typeof define === 'function' && define.amd) {
    define('error-stack-parser', ['stackframe'], factory);
  } else if (typeof _$errorStackParser_19 === 'object') {
    _$errorStackParser_19 = factory(_$stackframe_22);
  } else {
    root.ErrorStackParser = factory(root.StackFrame);
  }
})(this, function ErrorStackParser(StackFrame) {
  'use strict';

  var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
  var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
  var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
  return {
    /**
     * Given an Error object, extract the most information from it.
     *
     * @param {Error} error object
     * @return {Array} of StackFrames
     */
    parse: function ErrorStackParser$$parse(error) {
      if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
        return this.parseOpera(error);
      } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
        return this.parseV8OrIE(error);
      } else if (error.stack) {
        return this.parseFFOrSafari(error);
      } else {
        throw new Error('Cannot parse given Error object');
      }
    },
    // Separate line and column numbers from a string of the form: (URI:Line:Column)
    extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
      // Fail-fast but return locations like "(native)"
      if (urlLike.indexOf(':') === -1) {
        return [urlLike];
      }

      var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
      var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
      return [parts[1], parts[2] || undefined, parts[3] || undefined];
    },
    parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
      var filtered = error.stack.split('\n').filter(function (line) {
        return !!line.match(CHROME_IE_STACK_REGEXP);
      }, this);
      return filtered.map(function (line) {
        if (line.indexOf('(eval ') > -1) {
          // Throw away eval information until we implement stacktrace.js/stackframe#8
          line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
        }

        var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
        var locationParts = this.extractLocation(tokens.pop());
        var functionName = tokens.join(' ') || undefined;
        var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];
        return new StackFrame({
          functionName: functionName,
          fileName: fileName,
          lineNumber: locationParts[1],
          columnNumber: locationParts[2],
          source: line
        });
      }, this);
    },
    parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
      var filtered = error.stack.split('\n').filter(function (line) {
        return !line.match(SAFARI_NATIVE_CODE_REGEXP);
      }, this);
      return filtered.map(function (line) {
        // Throw away eval information until we implement stacktrace.js/stackframe#8
        if (line.indexOf(' > eval') > -1) {
          line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
        }

        if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
          // Safari eval frames only have function names and nothing else
          return new StackFrame({
            functionName: line
          });
        } else {
          var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
          var matches = line.match(functionNameRegex);
          var functionName = matches && matches[1] ? matches[1] : undefined;
          var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));
          return new StackFrame({
            functionName: functionName,
            fileName: locationParts[0],
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
          });
        }
      }, this);
    },
    parseOpera: function ErrorStackParser$$parseOpera(e) {
      if (!e.stacktrace || e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
        return this.parseOpera9(e);
      } else if (!e.stack) {
        return this.parseOpera10(e);
      } else {
        return this.parseOpera11(e);
      }
    },
    parseOpera9: function ErrorStackParser$$parseOpera9(e) {
      var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
      var lines = e.message.split('\n');
      var result = [];

      for (var i = 2, len = lines.length; i < len; i += 2) {
        var match = lineRE.exec(lines[i]);

        if (match) {
          result.push(new StackFrame({
            fileName: match[2],
            lineNumber: match[1],
            source: lines[i]
          }));
        }
      }

      return result;
    },
    parseOpera10: function ErrorStackParser$$parseOpera10(e) {
      var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
      var lines = e.stacktrace.split('\n');
      var result = [];

      for (var i = 0, len = lines.length; i < len; i += 2) {
        var match = lineRE.exec(lines[i]);

        if (match) {
          result.push(new StackFrame({
            functionName: match[3] || undefined,
            fileName: match[2],
            lineNumber: match[1],
            source: lines[i]
          }));
        }
      }

      return result;
    },
    // Opera 10.65+ Error.stack very similar to FF/Safari
    parseOpera11: function ErrorStackParser$$parseOpera11(error) {
      var filtered = error.stack.split('\n').filter(function (line) {
        return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
      }, this);
      return filtered.map(function (line) {
        var tokens = line.split('@');
        var locationParts = this.extractLocation(tokens.pop());
        var functionCall = tokens.shift() || '';
        var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^\)]*\)/g, '') || undefined;
        var argsRaw;

        if (functionCall.match(/\(([^\)]*)\)/)) {
          argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
        }

        var args = argsRaw === undefined || argsRaw === '[arguments not available]' ? undefined : argsRaw.split(',');
        return new StackFrame({
          functionName: functionName,
          args: args,
          fileName: locationParts[0],
          lineNumber: locationParts[1],
          columnNumber: locationParts[2],
          source: line
        });
      }, this);
    }
  };
});

var _$errorStackParser_7 = _$errorStackParser_19;

// Given `err` which may be an error, does it have a stack property which is a string?
var _$hasStack_9 = function (err) {
  return !!err && (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) && typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' && err.stack !== err.name + ": " + err.message;
};

var _$stackGenerator_21 = {};
(function (root, factory) {
  'use strict'; // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

  /* istanbul ignore next */

  if (typeof define === 'function' && define.amd) {
    define('stack-generator', ['stackframe'], factory);
  } else if (typeof _$stackGenerator_21 === 'object') {
    _$stackGenerator_21 = factory(_$stackframe_22);
  } else {
    root.StackGenerator = factory(root.StackFrame);
  }
})(this, function (StackFrame) {
  return {
    backtrace: function StackGenerator$$backtrace(opts) {
      var stack = [];
      var maxStackSize = 10;

      if (typeof opts === 'object' && typeof opts.maxStackSize === 'number') {
        maxStackSize = opts.maxStackSize;
      }

      var curr = arguments.callee;

      while (curr && stack.length < maxStackSize && curr['arguments']) {
        // Allow V8 optimizations
        var args = new Array(curr['arguments'].length);

        for (var i = 0; i < args.length; ++i) {
          args[i] = curr['arguments'][i];
        }

        if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
          stack.push(new StackFrame({
            functionName: RegExp.$1 || undefined,
            args: args
          }));
        } else {
          stack.push(new StackFrame({
            args: args
          }));
        }

        try {
          curr = curr.caller;
        } catch (e) {
          break;
        }
      }

      return stack;
    }
  };
});

function ___extends_23() { ___extends_23 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_23.apply(this, arguments); }

/* removed: var _$errorStackParser_7 = require('./lib/error-stack-parser'); */;

/* removed: var _$stackGenerator_21 = require('stack-generator'); */;

/* removed: var _$hasStack_9 = require('./lib/has-stack'); */;

var __reduce_23 = _$esUtils_8.reduce,
    __filter_23 = _$esUtils_8.filter;

var BugsnagReport =
/*#__PURE__*/
function () {
  function BugsnagReport(errorClass, errorMessage, stacktrace, handledState, originalError) {
    if (stacktrace === void 0) {
      stacktrace = [];
    }

    if (handledState === void 0) {
      handledState = defaultHandledState();
    }

    // duck-typing ftw >_<
    this.__isBugsnagReport = true;
    this._ignored = false; // private (un)handled state

    this._handledState = handledState; // setable props

    this.app = undefined;
    this.apiKey = undefined;
    this.breadcrumbs = [];
    this.context = undefined;
    this.device = undefined;
    this.errorClass = stringOrFallback(errorClass, '[no error class]');
    this.errorMessage = stringOrFallback(errorMessage, '[no error message]');
    this.groupingHash = undefined;
    this.metaData = {};
    this.request = undefined;
    this.severity = this._handledState.severity;
    this.stacktrace = __reduce_23(stacktrace, function (accum, frame) {
      var f = formatStackframe(frame); // don't include a stackframe if none of its properties are defined

      try {
        if (JSON.stringify(f) === '{}') return accum;
        return accum.concat(f);
      } catch (e) {
        return accum;
      }
    }, []);
    this.user = undefined;
    this.session = undefined;
    this.originalError = originalError;
  }

  var _proto = BugsnagReport.prototype;

  _proto.ignore = function ignore() {
    this._ignored = true;
  };

  _proto.isIgnored = function isIgnored() {
    return this._ignored;
  };

  _proto.updateMetaData = function updateMetaData(section) {
    var _updates;

    if (!section) return this;
    var updates; // updateMetaData("section", null) -> removes section

    if ((arguments.length <= 1 ? undefined : arguments[1]) === null) return this.removeMetaData(section); // updateMetaData("section", "property", null) -> removes property from section

    if ((arguments.length <= 2 ? undefined : arguments[2]) === null) return this.removeMetaData(section, arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]); // normalise the two supported input types into object form

    if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'object') updates = arguments.length <= 1 ? undefined : arguments[1];
    if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string') updates = (_updates = {}, _updates[arguments.length <= 1 ? undefined : arguments[1]] = arguments.length <= 2 ? undefined : arguments[2], _updates); // exit if we don't have an updates object at this point

    if (!updates) return this; // ensure a section with this name exists

    if (!this.metaData[section]) this.metaData[section] = {}; // merge the updates with the existing section

    this.metaData[section] = ___extends_23({}, this.metaData[section], updates);
    return this;
  };

  _proto.removeMetaData = function removeMetaData(section, property) {
    if (typeof section !== 'string') return this; // remove an entire section

    if (!property) {
      delete this.metaData[section];
      return this;
    } // remove a single property from a section


    if (this.metaData[section]) {
      delete this.metaData[section][property];
      return this;
    }

    return this;
  };

  _proto.toJSON = function toJSON() {
    return {
      payloadVersion: '4',
      exceptions: [{
        errorClass: this.errorClass,
        message: this.errorMessage,
        stacktrace: this.stacktrace,
        type: "yes" ? 'browserjs' : 'nodejs'
      }],
      severity: this.severity,
      unhandled: this._handledState.unhandled,
      severityReason: this._handledState.severityReason,
      app: this.app,
      device: this.device,
      breadcrumbs: this.breadcrumbs,
      context: this.context,
      user: this.user,
      metaData: this.metaData,
      groupingHash: this.groupingHash,
      request: this.request,
      session: this.session
    };
  };

  return BugsnagReport;
}(); // takes a stacktrace.js style stackframe (https://github.com/stacktracejs/stackframe)
// and returns a Bugsnag compatible stackframe (https://docs.bugsnag.com/api/error-reporting/#json-payload)


var formatStackframe = function (frame) {
  var f = {
    file: frame.fileName,
    method: normaliseFunctionName(frame.functionName),
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber,
    code: undefined,
    inProject: undefined // Some instances result in no file:
    // - calling notify() from chrome's terminal results in no file/method.
    // - non-error exception thrown from global code in FF
    // This adds one.

  };

  if (f.lineNumber > -1 && !f.file && !f.method) {
    f.file = 'global code';
  }

  return f;
};

var normaliseFunctionName = function (name) {
  return /^global code$/i.test(name) ? 'global code' : name;
};

var defaultHandledState = function () {
  return {
    unhandled: false,
    severity: 'warning',
    severityReason: {
      type: 'handledException'
    }
  };
};

var stringOrFallback = function (str, fallback) {
  return typeof str === 'string' && str ? str : fallback;
}; // Helpers


BugsnagReport.getStacktrace = function (error, errorFramesToSkip, generatedFramesToSkip) {
  if (errorFramesToSkip === void 0) {
    errorFramesToSkip = 0;
  }

  if (generatedFramesToSkip === void 0) {
    generatedFramesToSkip = 0;
  }

  if (_$hasStack_9(error)) return _$errorStackParser_7.parse(error).slice(errorFramesToSkip); // error wasn't provided or didn't have a stacktrace so try to walk the callstack

  return __filter_23(_$stackGenerator_21.backtrace(), function (frame) {
    return (frame.functionName || '').indexOf('StackGenerator$$') === -1;
  }).slice(1 + generatedFramesToSkip);
};

BugsnagReport.ensureReport = function (reportOrError, errorFramesToSkip, generatedFramesToSkip) {
  if (errorFramesToSkip === void 0) {
    errorFramesToSkip = 0;
  }

  if (generatedFramesToSkip === void 0) {
    generatedFramesToSkip = 0;
  }

  // notify() can be called with a Report object. In this case no action is required
  if (reportOrError.__isBugsnagReport) return reportOrError;

  try {
    var stacktrace = BugsnagReport.getStacktrace(reportOrError, errorFramesToSkip, 1 + generatedFramesToSkip);
    return new BugsnagReport(reportOrError.name, reportOrError.message, stacktrace, undefined, reportOrError);
  } catch (e) {
    return new BugsnagReport(reportOrError.name, reportOrError.message, [], undefined, reportOrError);
  }
};

var _$BugsnagReport_23 = BugsnagReport;

var _$pad_17 = function pad(num, size) {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

/* removed: var _$pad_17 = require('./pad.js'); */;

var env = typeof window === 'object' ? window : self;
var globalCount = 0;

for (var prop in env) {
  if (Object.hasOwnProperty.call(env, prop)) globalCount++;
}

var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
var clientId = _$pad_17((mimeTypesLength + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);

var _$fingerprint_16 = function fingerprint() {
  return clientId;
};

/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */
/* removed: var _$fingerprint_16 = require('./lib/fingerprint.js'); */;

/* removed: var _$pad_17 = require('./lib/pad.js'); */;

var c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize);

function randomBlock() {
  return _$pad_17((Math.random() * discreteValues << 0).toString(base), blockSize);
}

function safeCounter() {
  c = c < discreteValues ? c : 0;
  c++; // this is not subliminal

  return c - 1;
}

function cuid() {
  // Starting with a lowercase letter makes
  // it HTML element ID friendly.
  var letter = 'c',
      // hard-coded allows for sequential access
  // timestamp
  // warning: this exposes the exact date and time
  // that the uid was created.
  timestamp = new Date().getTime().toString(base),
      // Prevent same-machine collisions.
  counter = _$pad_17(safeCounter().toString(base), blockSize),
      // A few chars to generate distinct ids for different
  // clients (so different computers are far less
  // likely to generate the same id)
  print = _$fingerprint_16(),
      // Grab some more chars from Math.random()
  random = randomBlock() + randomBlock();
  return letter + timestamp + counter + print + random;
}

cuid.fingerprint = _$fingerprint_16;
var _$cuid_15 = cuid;

var __isoDate_24 = _$esUtils_8.isoDate;

/* removed: var _$cuid_15 = require('@bugsnag/cuid'); */;

var Session =
/*#__PURE__*/
function () {
  function Session() {
    this.id = _$cuid_15();
    this.startedAt = __isoDate_24();
    this._handled = 0;
    this._unhandled = 0;
  }

  var _proto = Session.prototype;

  _proto.toJSON = function toJSON() {
    return {
      id: this.id,
      startedAt: this.startedAt,
      events: {
        handled: this._handled,
        unhandled: this._unhandled
      }
    };
  };

  _proto.trackError = function trackError(report) {
    this[report._handledState.unhandled ? '_unhandled' : '_handled'] += 1;
  };

  return Session;
}();

var _$Session_24 = Session;

function ___extends_4() { ___extends_4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_4.apply(this, arguments); }

/* removed: var _$config_5 = require('./config'); */;

/* removed: var _$BugsnagReport_23 = require('./report'); */;

/* removed: var _$BugsnagBreadcrumb_3 = require('./breadcrumb'); */;

/* removed: var _$Session_24 = require('./session'); */;

var __map_4 = _$esUtils_8.map,
    __includes_4 = _$esUtils_8.includes,
    __isArray_4 = _$esUtils_8.isArray;

/* removed: var _$inferReleaseStage_10 = require('./lib/infer-release-stage'); */;

/* removed: var _$iserror_11 = require('./lib/iserror'); */;

/* removed: var _$asyncSome_6 = require('./lib/async-some'); */;

/* removed: var _$runBeforeSend_13 = require('./lib/run-before-send'); */;

var LOG_USAGE_ERR_PREFIX = "Usage error.";
var REPORT_USAGE_ERR_PREFIX = "Bugsnag usage error.";

var BugsnagClient =
/*#__PURE__*/
function () {
  function BugsnagClient(notifier) {
    if (!notifier || !notifier.name || !notifier.version || !notifier.url) {
      throw new Error('`notifier` argument is required');
    } // notifier id


    this.notifier = notifier; // configure() should be called before notify()

    this._configured = false; // intialise opts and config

    this._opts = {};
    this.config = {}; // // i/o

    this._delivery = {
      sendSession: function () {},
      sendReport: function () {}
    };
    this._logger = {
      debug: function () {},
      info: function () {},
      warn: function () {},
      error: function () {} // plugins

    };
    this._plugins = {};
    this._session = null;
    this.breadcrumbs = []; // setable props

    this.app = {};
    this.context = undefined;
    this.device = undefined;
    this.metaData = undefined;
    this.request = undefined;
    this.user = {}; // expose internal constructors

    this.BugsnagClient = BugsnagClient;
    this.BugsnagReport = _$BugsnagReport_23;
    this.BugsnagBreadcrumb = _$BugsnagBreadcrumb_3;
    this.BugsnagSession = _$Session_24;
    var self = this;
    var notify = this.notify;

    this.notify = function () {
      return notify.apply(self, arguments);
    };
  }

  var _proto = BugsnagClient.prototype;

  _proto.setOptions = function setOptions(opts) {
    this._opts = ___extends_4({}, this._opts, opts);
  };

  _proto.configure = function configure(partialSchema) {
    if (partialSchema === void 0) {
      partialSchema = _$config_5.schema;
    }

    var conf = _$config_5.mergeDefaults(this._opts, partialSchema);
    var validity = _$config_5.validate(conf, partialSchema);
    if (!validity.valid === true) throw new Error(generateConfigErrorMessage(validity.errors)); // update and elevate some special options if they were passed in at this point

    if (typeof conf.beforeSend === 'function') conf.beforeSend = [conf.beforeSend];
    if (conf.appVersion) this.app.version = conf.appVersion;
    if (conf.appType) this.app.type = conf.appType;
    if (conf.metaData) this.metaData = conf.metaData;
    if (conf.user) this.user = conf.user;
    if (conf.logger) this.logger(conf.logger); // merge with existing config

    this.config = ___extends_4({}, this.config, conf);
    this._configured = true;
    return this;
  };

  _proto.use = function use(plugin) {
    if (!this._configured) throw new Error('client not configured');
    if (plugin.configSchema) this.configure(plugin.configSchema);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var result = plugin.init.apply(plugin, [this].concat(args)); // JS objects are not the safest way to store arbitrarily keyed values,
    // so bookend the key with some characters that prevent tampering with
    // stuff like __proto__ etc. (only store the result if the plugin had a
    // name)

    if (plugin.name) this._plugins["~" + plugin.name + "~"] = result;
    return this;
  };

  _proto.getPlugin = function getPlugin(name) {
    return this._plugins["~" + name + "~"];
  };

  _proto.delivery = function delivery(d) {
    this._delivery = d;
    return this;
  };

  _proto.logger = function logger(l, sid) {
    this._logger = l;
    return this;
  };

  _proto.sessionDelegate = function sessionDelegate(s) {
    this._sessionDelegate = s;
    return this;
  };

  _proto.startSession = function startSession() {
    if (!this._sessionDelegate) {
      this._logger.warn('No session implementation is installed');

      return this;
    }

    return this._sessionDelegate.startSession(this);
  };

  _proto.leaveBreadcrumb = function leaveBreadcrumb(name, metaData, type, timestamp) {
    if (!this._configured) throw new Error('client not configured'); // coerce bad values so that the defaults get set

    name = name || undefined;
    type = typeof type === 'string' ? type : undefined;
    timestamp = typeof timestamp === 'string' ? timestamp : undefined;
    metaData = typeof metaData === 'object' && metaData !== null ? metaData : undefined; // if no name and no metaData, usefulness of this crumb is questionable at best so discard

    if (typeof name !== 'string' && !metaData) return;
    var crumb = new _$BugsnagBreadcrumb_3(name, metaData, type, timestamp); // push the valid crumb onto the queue and maintain the length

    this.breadcrumbs.push(crumb);

    if (this.breadcrumbs.length > this.config.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(this.breadcrumbs.length - this.config.maxBreadcrumbs);
    }

    return this;
  };

  _proto.notify = function notify(error, opts, cb) {
    var _this = this;

    if (opts === void 0) {
      opts = {};
    }

    if (cb === void 0) {
      cb = function () {};
    }

    if (!this._configured) throw new Error('client not configured'); // releaseStage can be set via config.releaseStage or client.app.releaseStage

    var releaseStage = _$inferReleaseStage_10(this); // ensure we have an error (or a reasonable object representation of an error)

    var _normaliseError = normaliseError(error, opts, this._logger),
        err = _normaliseError.err,
        errorFramesToSkip = _normaliseError.errorFramesToSkip,
        _opts = _normaliseError._opts;

    if (_opts) opts = _opts; // ensure opts is an object

    if (typeof opts !== 'object' || opts === null) opts = {}; // create a report from the error, if it isn't one already

    var report = _$BugsnagReport_23.ensureReport(err, errorFramesToSkip, 2);
    report.app = ___extends_4({}, {
      releaseStage: releaseStage
    }, report.app, this.app);
    report.context = report.context || opts.context || this.context || undefined;
    report.device = ___extends_4({}, report.device, this.device, opts.device);
    report.request = ___extends_4({}, report.request, this.request, opts.request);
    report.user = ___extends_4({}, report.user, this.user, opts.user);
    report.metaData = ___extends_4({}, report.metaData, this.metaData, opts.metaData);
    report.breadcrumbs = this.breadcrumbs.slice(0);

    if (this._session) {
      this._session.trackError(report);

      report.session = this._session;
    } // set severity if supplied


    if (opts.severity !== undefined) {
      report.severity = opts.severity;
      report._handledState.severityReason = {
        type: 'userSpecifiedSeverity'
      };
    } // exit early if the reports should not be sent on the current releaseStage


    if (__isArray_4(this.config.notifyReleaseStages) && !__includes_4(this.config.notifyReleaseStages, releaseStage)) {
      this._logger.warn("Report not sent due to releaseStage/notifyReleaseStages configuration");

      return cb(null, report);
    }

    var originalSeverity = report.severity;
    var beforeSend = [].concat(opts.beforeSend).concat(this.config.beforeSend);

    var onBeforeSendErr = function (err) {
      _this._logger.error("Error occurred in beforeSend callback, continuing anyway\u2026");

      _this._logger.error(err);
    };

    _$asyncSome_6(beforeSend, _$runBeforeSend_13(report, onBeforeSendErr), function (err, preventSend) {
      if (err) onBeforeSendErr(err);

      if (preventSend) {
        _this._logger.debug("Report not sent due to beforeSend callback");

        return cb(null, report);
      } // only leave a crumb for the error if actually got sent


      if (_this.config.autoBreadcrumbs) {
        _this.leaveBreadcrumb(report.errorClass, {
          errorClass: report.errorClass,
          errorMessage: report.errorMessage,
          severity: report.severity
        }, 'error');
      }

      if (originalSeverity !== report.severity) {
        report._handledState.severityReason = {
          type: 'userCallbackSetSeverity'
        };
      }

      _this._delivery.sendReport(_this._logger, _this.config, {
        apiKey: report.apiKey || _this.config.apiKey,
        notifier: _this.notifier,
        events: [report]
      }, function (err) {
        return cb(err, report);
      });
    });
  };

  return BugsnagClient;
}();

var normaliseError = function (error, opts, logger) {
  var synthesizedErrorFramesToSkip = 3;

  var createAndLogUsageError = function (reason) {
    var msg = generateNotifyUsageMessage(reason);
    logger.warn(LOG_USAGE_ERR_PREFIX + " " + msg);
    return new Error(REPORT_USAGE_ERR_PREFIX + " " + msg);
  };

  var err;
  var errorFramesToSkip = 0;

  var _opts;

  switch (typeof error) {
    case 'string':
      if (typeof opts === 'string') {
        // ≤v3 used to have a notify('ErrorName', 'Error message') interface
        // report usage/deprecation errors if this function is called like that
        err = createAndLogUsageError('string/string');
        _opts = {
          metaData: {
            notifier: {
              notifyArgs: [error, opts]
            }
          }
        };
      } else {
        err = new Error(String(error));
        errorFramesToSkip = synthesizedErrorFramesToSkip;
      }

      break;

    case 'number':
    case 'boolean':
      err = new Error(String(error));
      break;

    case 'function':
      err = createAndLogUsageError('function');
      break;

    case 'object':
      if (error !== null && (_$iserror_11(error) || error.__isBugsnagReport)) {
        err = error;
      } else if (error !== null && hasNecessaryFields(error)) {
        err = new Error(error.message || error.errorMessage);
        err.name = error.name || error.errorClass;
        errorFramesToSkip = synthesizedErrorFramesToSkip;
      } else {
        err = createAndLogUsageError(error === null ? 'null' : 'unsupported object');
      }

      break;

    default:
      err = createAndLogUsageError('nothing');
  }

  return {
    err: err,
    errorFramesToSkip: errorFramesToSkip,
    _opts: _opts
  };
};

var hasNecessaryFields = function (error) {
  return (typeof error.name === 'string' || typeof error.errorClass === 'string') && (typeof error.message === 'string' || typeof error.errorMessage === 'string');
};

var generateConfigErrorMessage = function (errors) {
  return "Bugsnag configuration error\n" + __map_4(errors, function (err) {
    return "\"" + err.key + "\" " + err.message + " \n    got " + stringify(err.value);
  }).join('\n\n');
};

var generateNotifyUsageMessage = function (actual) {
  return "notify() expected error/opts parameters, got " + actual;
};

var stringify = function (val) {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};

var _$BugsnagClient_4 = BugsnagClient;

var _$safeJsonStringify_18 = function (data, replacer, space, opts) {
  var filterKeys = opts && opts.filterKeys ? opts.filterKeys : [];
  var filterPaths = opts && opts.filterPaths ? opts.filterPaths : [];
  return JSON.stringify(prepareObjForSerialization(data, filterKeys, filterPaths), replacer, space);
};

var MAX_DEPTH = 20;
var MAX_EDGES = 25000;
var MIN_PRESERVED_DEPTH = 8;
var REPLACEMENT_NODE = '...';

function __isError_18(o) {
  return o instanceof Error || /^\[object (Error|(Dom)?Exception)\]$/.test(Object.prototype.toString.call(o));
}

function throwsMessage(err) {
  return '[Throws: ' + (err ? err.message : '?') + ']';
}

function find(haystack, needle) {
  for (var i = 0, len = haystack.length; i < len; i++) {
    if (haystack[i] === needle) return true;
  }

  return false;
} // returns true if the string `path` starts with any of the provided `paths`


function isDescendent(paths, path) {
  for (var i = 0, len = paths.length; i < len; i++) {
    if (path.indexOf(paths[i]) === 0) return true;
  }

  return false;
}

function shouldFilter(patterns, key) {
  for (var i = 0, len = patterns.length; i < len; i++) {
    if (typeof patterns[i] === 'string' && patterns[i] === key) return true;
    if (patterns[i] && typeof patterns[i].test === 'function' && patterns[i].test(key)) return true;
  }

  return false;
}

function __isArray_18(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function safelyGetProp(obj, prop) {
  try {
    return obj[prop];
  } catch (err) {
    return throwsMessage(err);
  }
}

function prepareObjForSerialization(obj, filterKeys, filterPaths) {
  var seen = []; // store references to objects we have seen before

  var edges = 0;

  function visit(obj, path) {
    function edgesExceeded() {
      return path.length > MIN_PRESERVED_DEPTH && edges > MAX_EDGES;
    }

    edges++;
    if (path.length > MAX_DEPTH) return REPLACEMENT_NODE;
    if (edgesExceeded()) return REPLACEMENT_NODE;
    if (obj === null || typeof obj !== 'object') return obj;
    if (find(seen, obj)) return '[Circular]';
    seen.push(obj);

    if (typeof obj.toJSON === 'function') {
      try {
        // we're not going to count this as an edge because it
        // replaces the value of the currently visited object
        edges--;
        var fResult = visit(obj.toJSON(), path);
        seen.pop();
        return fResult;
      } catch (err) {
        return throwsMessage(err);
      }
    }

    var er = __isError_18(obj);

    if (er) {
      edges--;
      var eResult = visit({
        name: obj.name,
        message: obj.message
      }, path);
      seen.pop();
      return eResult;
    }

    if (__isArray_18(obj)) {
      var aResult = [];

      for (var i = 0, len = obj.length; i < len; i++) {
        if (edgesExceeded()) {
          aResult.push(REPLACEMENT_NODE);
          break;
        }

        aResult.push(visit(obj[i], path.concat('[]')));
      }

      seen.pop();
      return aResult;
    }

    var result = {};

    try {
      for (var prop in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) continue;

        if (isDescendent(filterPaths, path.join('.')) && shouldFilter(filterKeys, prop)) {
          result[prop] = '[Filtered]';
          continue;
        }

        if (edgesExceeded()) {
          result[prop] = REPLACEMENT_NODE;
          break;
        }

        result[prop] = visit(safelyGetProp(obj, prop), path.concat(prop));
      }
    } catch (e) {}

    seen.pop();
    return result;
  }

  return visit(obj, []);
}

var _$jsonPayload_12 = {};
/* removed: var _$safeJsonStringify_18 = require('@bugsnag/safe-json-stringify'); */;

var REPORT_FILTER_PATHS = ['events.[].app', 'events.[].metaData', 'events.[].user', 'events.[].breadcrumbs', 'events.[].request', 'events.[].device'];
var SESSION_FILTER_PATHS = ['device', 'app', 'user'];

_$jsonPayload_12.report = function (report, filterKeys) {
  var payload = _$safeJsonStringify_18(report, null, null, {
    filterPaths: REPORT_FILTER_PATHS,
    filterKeys: filterKeys
  });

  if (payload.length > 10e5) {
    delete report.events[0].metaData;
    report.events[0].metaData = {
      notifier: "WARNING!\nSerialized payload was " + payload.length / 10e5 + "MB (limit = 1MB)\nmetaData was removed"
    };
    payload = _$safeJsonStringify_18(report, null, null, {
      filterPaths: REPORT_FILTER_PATHS,
      filterKeys: filterKeys
    });
    if (payload.length > 10e5) throw new Error('payload exceeded 1MB limit');
  }

  return payload;
};

_$jsonPayload_12.session = function (report, filterKeys) {
  var payload = _$safeJsonStringify_18(report, null, null, {
    filterPaths: SESSION_FILTER_PATHS,
    filterKeys: filterKeys
  });
  if (payload.length > 10e5) throw new Error('payload exceeded 1MB limit');
  return payload;
};

var _$delivery_25 = {};
/* removed: var _$jsonPayload_12 = require('@bugsnag/core/lib/json-payload'); */;

var __isoDate_25 = _$esUtils_8.isoDate;

_$delivery_25 = function (win) {
  if (win === void 0) {
    win = window;
  }

  return {
    sendReport: function (logger, config, report, cb) {
      if (cb === void 0) {
        cb = function () {};
      }

      var url = getApiUrl(config, 'notify', '4', win);
      var req = new win.XDomainRequest();

      req.onload = function () {
        cb(null);
      };

      req.open('POST', url);
      setTimeout(function () {
        try {
          req.send(_$jsonPayload_12.report(report, config.filters));
        } catch (e) {
          logger.error(e);
          cb(e);
        }
      }, 0);
    },
    sendSession: function (logger, config, session, cb) {
      if (cb === void 0) {
        cb = function () {};
      }

      var url = getApiUrl(config, 'sessions', '1', win);
      var req = new win.XDomainRequest();

      req.onload = function () {
        cb(null);
      };

      req.open('POST', url);
      setTimeout(function () {
        try {
          req.send(_$jsonPayload_12.session(session, config.filters));
        } catch (e) {
          logger.error(e);
          cb(e);
        }
      }, 0);
    }
  };
};

var getApiUrl = function (config, endpoint, version, win) {
  return matchPageProtocol(config.endpoints[endpoint], win.location.protocol) + "?apiKey=" + encodeURIComponent(config.apiKey) + "&payloadVersion=" + version + "&sentAt=" + encodeURIComponent(__isoDate_25());
};

var matchPageProtocol = _$delivery_25._matchPageProtocol = function (endpoint, pageProtocol) {
  return pageProtocol === 'http:' ? endpoint.replace(/^https:/, 'http:') : endpoint;
};

/* removed: var _$jsonPayload_12 = require('@bugsnag/core/lib/json-payload'); */;

var __isoDate_26 = _$esUtils_8.isoDate;

var _$delivery_26 = function (win) {
  if (win === void 0) {
    win = window;
  }

  return {
    sendReport: function (logger, config, report, cb) {
      if (cb === void 0) {
        cb = function () {};
      }

      try {
        var url = config.endpoints.notify;
        var req = new win.XMLHttpRequest();

        req.onreadystatechange = function () {
          if (req.readyState === win.XMLHttpRequest.DONE) cb(null);
        };

        req.open('POST', url);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Bugsnag-Api-Key', report.apiKey || config.apiKey);
        req.setRequestHeader('Bugsnag-Payload-Version', '4');
        req.setRequestHeader('Bugsnag-Sent-At', __isoDate_26());
        req.send(_$jsonPayload_12.report(report, config.filters));
      } catch (e) {
        logger.error(e);
      }
    },
    sendSession: function (logger, config, session, cb) {
      if (cb === void 0) {
        cb = function () {};
      }

      try {
        var url = config.endpoints.sessions;
        var req = new win.XMLHttpRequest();

        req.onreadystatechange = function () {
          if (req.readyState === win.XMLHttpRequest.DONE) cb(null);
        };

        req.open('POST', url);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Bugsnag-Api-Key', config.apiKey);
        req.setRequestHeader('Bugsnag-Payload-Version', '1');
        req.setRequestHeader('Bugsnag-Sent-At', __isoDate_26());
        req.send(_$jsonPayload_12.session(session, config.filters));
      } catch (e) {
        logger.error(e);
      }
    }
  };
};

/*
 * Sets the default context to be the current URL
 */
var _$context_27 = {
  init: function (client, win) {
    if (win === void 0) {
      win = window;
    }

    client.config.beforeSend.unshift(function (report) {
      if (report.context) return;
      report.context = win.location.pathname;
    });
  }
};

function ___extends_28() { ___extends_28 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_28.apply(this, arguments); }

var __isoDate_28 = _$esUtils_8.isoDate;
/*
 * Automatically detects browser device details
 */


var _$device_28 = {
  init: function (client, nav) {
    if (nav === void 0) {
      nav = navigator;
    }

    var device = {
      locale: nav.browserLanguage || nav.systemLanguage || nav.userLanguage || nav.language,
      userAgent: nav.userAgent // merge with anything already set on the client

    };
    client.device = ___extends_28({}, device, client.device); // add time just as the report is sent

    client.config.beforeSend.unshift(function (report) {
      report.device = ___extends_28({}, report.device, {
        time: __isoDate_28()
      });
    });
  }
};

function ___extends_29() { ___extends_29 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_29.apply(this, arguments); }

/*
 * Sets the report request: { url } to be the current href
 */
var _$request_29 = {
  init: function (client, win) {
    if (win === void 0) {
      win = window;
    }

    client.config.beforeSend.unshift(function (report) {
      if (report.request && report.request.url) return;
      report.request = ___extends_29({}, report.request, {
        url: win.location.href
      });
    });
  }
};

function ___extends_30() { ___extends_30 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_30.apply(this, arguments); }

var __isArray_30 = _$esUtils_8.isArray,
    __includes_30 = _$esUtils_8.includes;

/* removed: var _$inferReleaseStage_10 = require('@bugsnag/core/lib/infer-release-stage'); */;

var _$session_30 = {
  init: function (client) {
    return client.sessionDelegate(sessionDelegate);
  }
};
var sessionDelegate = {
  startSession: function (client) {
    var sessionClient = client;
    sessionClient._session = new client.BugsnagSession();
    var releaseStage = _$inferReleaseStage_10(sessionClient); // exit early if the reports should not be sent on the current releaseStage

    if (__isArray_30(sessionClient.config.notifyReleaseStages) && !__includes_30(sessionClient.config.notifyReleaseStages, releaseStage)) {
      sessionClient._logger.warn("Session not sent due to releaseStage/notifyReleaseStages configuration");

      return sessionClient;
    }

    if (!sessionClient.config.endpoints.sessions) {
      sessionClient._logger.warn("Session not sent due to missing endpoints.sessions configuration");

      return sessionClient;
    }

    sessionClient._delivery.sendSession(sessionClient._logger, sessionClient.config, {
      notifier: sessionClient.notifier,
      device: sessionClient.device,
      app: ___extends_30({}, {
        releaseStage: releaseStage
      }, sessionClient.app),
      sessions: [{
        id: sessionClient._session.id,
        startedAt: sessionClient._session.startedAt,
        user: sessionClient.user
      }]
    });

    return sessionClient;
  }
};

function ___extends_31() { ___extends_31 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_31.apply(this, arguments); }

/*
 * Prevent collection of user IPs
 */
var _$clientIp_31 = {
  init: function (client) {
    if (client.config.collectUserIp) return;
    client.config.beforeSend.push(function (report) {
      // If user.id is explicitly undefined, it will be missing from the payload. It needs
      // removing so that the following line replaces it
      if (report.user && typeof report.user.id === 'undefined') delete report.user.id;
      report.user = ___extends_31({
        id: '[NOT COLLECTED]'
      }, report.user);
      report.request = ___extends_31({
        clientIp: '[NOT COLLECTED]'
      }, report.request);
    });
  },
  configSchema: {
    collectUserIp: {
      defaultValue: function () {
        return true;
      },
      message: 'should be true|false',
      validate: function (value) {
        return value === true || value === false;
      }
    }
  }
};

var _$consoleBreadcrumbs_32 = {};
var __map_32 = _$esUtils_8.map,
    __reduce_32 = _$esUtils_8.reduce,
    __filter_32 = _$esUtils_8.filter;
/*
 * Leaves breadcrumbs when console log methods are called
 */


_$consoleBreadcrumbs_32.init = function (client) {
  var isDev = /^dev(elopment)?$/.test(client.config.releaseStage);
  var explicitlyDisabled = client.config.consoleBreadcrumbsEnabled === false;
  var implicitlyDisabled = (client.config.autoBreadcrumbs === false || isDev) && client.config.consoleBreadcrumbsEnabled !== true;
  if (explicitlyDisabled || implicitlyDisabled) return;
  __map_32(CONSOLE_LOG_METHODS, function (method) {
    var original = console[method];

    console[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      client.leaveBreadcrumb('Console output', __reduce_32(args, function (accum, arg, i) {
        // do the best/simplest stringification of each argument
        var stringified = '[Unknown value]'; // this may fail if the input is:
        // - an object whose [[Prototype]] is null (no toString)
        // - an object with a broken toString or @@toPrimitive implementation

        try {
          stringified = String(arg);
        } catch (e) {} // if it stringifies to [object Object] attempt to JSON stringify


        if (stringified === '[object Object]') {
          // catch stringify errors and fallback to [object Object]
          try {
            stringified = JSON.stringify(arg);
          } catch (e) {}
        }

        accum["[" + i + "]"] = stringified;
        return accum;
      }, {
        severity: method.indexOf('group') === 0 ? 'log' : method
      }), 'log');
      original.apply(console, args);
    };

    console[method]._restore = function () {
      console[method] = original;
    };
  });
};

_$consoleBreadcrumbs_32.configSchema = {
  consoleBreadcrumbsEnabled: {
    defaultValue: function () {
      return undefined;
    },
    validate: function (value) {
      return value === true || value === false || value === undefined;
    },
    message: 'should be true|false'
  }
};

if ("production" !== 'production') {
  _$consoleBreadcrumbs_32.destroy = function () {
    return CONSOLE_LOG_METHODS.forEach(function (method) {
      if (typeof console[method]._restore === 'function') console[method]._restore();
    });
  };
}

var CONSOLE_LOG_METHODS = __filter_32(['log', 'debug', 'info', 'warn', 'error'], function (method) {
  return typeof console !== 'undefined' && typeof console[method] === 'function';
});

var _$inlineScriptContent_33 = {};
var __reduce_33 = _$esUtils_8.reduce;

_$inlineScriptContent_33 = {
  init: function (client, doc, win) {
    if (doc === void 0) {
      doc = document;
    }

    if (win === void 0) {
      win = window;
    }

    var html = '';
    var DOMContentLoaded = false;

    var getHtml = function () {
      return doc.documentElement.outerHTML;
    };

    var originalLocation = win.location.href;

    var addInlineContent = function (report) {
      var frame = report.stacktrace[0];
      if (!frame || !frame.file || !frame.lineNumber) return frame;
      if (frame.file.replace(/#.*$/, '') !== originalLocation.replace(/#.*$/, '')) return frame;
      if (!DOMContentLoaded || !html) html = getHtml();
      var htmlLines = ['<!-- DOC START -->'].concat(html.split('\n'));

      var _extractScriptContent = extractScriptContent(htmlLines, frame.lineNumber - 1),
          script = _extractScriptContent.script,
          start = _extractScriptContent.start;

      var code = __reduce_33(script, function (accum, line, i) {
        if (Math.abs(start + i + 1 - frame.lineNumber) > 10) return accum;
        accum["" + (start + i + 1)] = line;
        return accum;
      }, {});
      frame.code = code;
      report.updateMetaData('script', {
        content: script.join('\n')
      });
    }; // get whatever HTML exists at this point in time


    html = getHtml();
    var prev = doc.onreadystatechange; // then update it when the DOM content has loaded

    doc.onreadystatechange = function () {
      // IE8 compatible alternative to document#DOMContentLoaded
      if (doc.readyState === 'interactive') {
        html = getHtml();
        DOMContentLoaded = true;
      }

      if (typeof prev === 'function') prev.apply(this, arguments);
    };

    client.config.beforeSend.unshift(addInlineContent);
  }
};
var scriptStartRe = /^.*<script.*?>/;
var scriptEndRe = /<\/script>.*$/;

var extractScriptContent = _$inlineScriptContent_33.extractScriptContent = function (lines, startLine) {
  // search down for </script>
  var line = startLine;

  while (line < lines.length && !scriptEndRe.test(lines[line])) {
    line++;
  } // search up for <script>


  var end = line;

  while (line > 0 && !scriptStartRe.test(lines[line])) {
    line--;
  }

  var start = line; // strip <script> tags so that lines just contain js content

  var script = lines.slice(start, end + 1);
  script[0] = script[0].replace(scriptStartRe, '');
  script[script.length - 1] = script[script.length - 1].replace(scriptEndRe, ''); // return the array of lines, and the line number the script started at

  return {
    script: script,
    start: start
  };
};

/*
 * Leaves breadcrumbs when the user interacts with the DOM
 */
var _$interactionBreadcrumbs_34 = {
  init: function (client, win) {
    if (win === void 0) {
      win = window;
    }

    if (!('addEventListener' in win)) return;
    var explicitlyDisabled = client.config.interactionBreadcrumbsEnabled === false;
    var implicitlyDisabled = client.config.autoBreadcrumbs === false && client.config.interactionBreadcrumbsEnabled !== true;
    if (explicitlyDisabled || implicitlyDisabled) return;
    win.addEventListener('click', function (event) {
      var targetText, targetSelector;

      try {
        targetText = getNodeText(event.target);
        targetSelector = getNodeSelector(event.target, win);
      } catch (e) {
        targetText = '[hidden]';
        targetSelector = '[hidden]';

        client._logger.error('Cross domain error when tracking click event. See docs: https://tinyurl.com/y94fq5zm');
      }

      client.leaveBreadcrumb('UI click', {
        targetText: targetText,
        targetSelector: targetSelector
      }, 'user');
    }, true);
  },
  configSchema: {
    interactionBreadcrumbsEnabled: {
      defaultValue: function () {
        return undefined;
      },
      validate: function (value) {
        return value === true || value === false || value === undefined;
      },
      message: 'should be true|false'
    }
  } // extract text content from a element

};

var getNodeText = function (el) {
  var text = el.textContent || el.innerText || '';
  if (!text && (el.type === 'submit' || el.type === 'button')) text = el.value;
  text = text.replace(/^\s+|\s+$/g, ''); // trim whitespace

  return truncate(text, 140);
}; // Create a label from tagname, id and css class of the element


function getNodeSelector(el, win) {
  var parts = [el.tagName];
  if (el.id) parts.push('#' + el.id);
  if (el.className && el.className.length) parts.push("." + el.className.split(' ').join('.')); // Can't get much more advanced with the current browser

  if (!win.document.querySelectorAll || !Array.prototype.indexOf) return parts.join('');

  try {
    if (win.document.querySelectorAll(parts.join('')).length === 1) return parts.join('');
  } catch (e) {
    // Sometimes the query selector can be invalid just return it as-is
    return parts.join('');
  } // try to get a more specific selector if this one matches more than one element


  if (el.parentNode.childNodes.length > 1) {
    var index = Array.prototype.indexOf.call(el.parentNode.childNodes, el) + 1;
    parts.push(":nth-child(" + index + ")");
  }

  if (win.document.querySelectorAll(parts.join('')).length === 1) return parts.join(''); // try prepending the parent node selector

  if (el.parentNode) return getNodeSelector(el.parentNode, win) + " > " + parts.join('');
  return parts.join('');
}

function truncate(value, length) {
  var ommision = '(...)';
  if (value && value.length <= length) return value;
  return value.slice(0, length - ommision.length) + ommision;
}

var _$navigationBreadcrumbs_35 = {};
/*
 * Leaves breadcrumbs when navigation methods are called or events are emitted
 */
_$navigationBreadcrumbs_35.init = function (client, win) {
  if (win === void 0) {
    win = window;
  }

  if (!('addEventListener' in win)) return;
  var explicitlyDisabled = client.config.navigationBreadcrumbsEnabled === false;
  var implicitlyDisabled = client.config.autoBreadcrumbs === false && client.config.navigationBreadcrumbsEnabled !== true;
  if (explicitlyDisabled || implicitlyDisabled) return; // returns a function that will drop a breadcrumb with a given name

  var drop = function (name) {
    return function () {
      return client.leaveBreadcrumb(name, {}, 'navigation');
    };
  }; // simple drops – just names, no meta


  win.addEventListener('pagehide', drop('Page hidden'), true);
  win.addEventListener('pageshow', drop('Page shown'), true);
  win.addEventListener('load', drop('Page loaded'), true);
  win.document.addEventListener('DOMContentLoaded', drop('DOMContentLoaded'), true); // some browsers like to emit popstate when the page loads, so only add the popstate listener after that

  win.addEventListener('load', function () {
    return win.addEventListener('popstate', drop('Navigated back'), true);
  }); // hashchange has some metaData that we care about

  win.addEventListener('hashchange', function (event) {
    var metaData = event.oldURL ? {
      from: relativeLocation(event.oldURL, win),
      to: relativeLocation(event.newURL, win),
      state: getCurrentState(win)
    } : {
      to: relativeLocation(win.location.href, win)
    };
    client.leaveBreadcrumb('Hash changed', metaData, 'navigation');
  }, true); // the only way to know about replaceState/pushState is to wrap them… >_<

  if (win.history.replaceState) wrapHistoryFn(client, win.history, 'replaceState', win);
  if (win.history.pushState) wrapHistoryFn(client, win.history, 'pushState', win);
  client.leaveBreadcrumb('Bugsnag loaded', {}, 'navigation');
};

_$navigationBreadcrumbs_35.configSchema = {
  navigationBreadcrumbsEnabled: {
    defaultValue: function () {
      return undefined;
    },
    validate: function (value) {
      return value === true || value === false || value === undefined;
    },
    message: 'should be true|false'
  }
};

if ("production" !== 'production') {
  _$navigationBreadcrumbs_35.destroy = function (win) {
    if (win === void 0) {
      win = window;
    }

    win.history.replaceState._restore();

    win.history.pushState._restore();
  };
} // takes a full url like http://foo.com:1234/pages/01.html?yes=no#section-2 and returns
// just the path and hash parts, e.g. /pages/01.html?yes=no#section-2


var relativeLocation = function (url, win) {
  var a = win.document.createElement('A');
  a.href = url;
  return "" + a.pathname + a.search + a.hash;
};

var stateChangeToMetaData = function (win, state, title, url) {
  var currentPath = relativeLocation(win.location.href, win);
  return {
    title: title,
    state: state,
    prevState: getCurrentState(win),
    to: url || currentPath,
    from: currentPath
  };
};

var wrapHistoryFn = function (client, target, fn, win) {
  var orig = target[fn];

  target[fn] = function (state, title, url) {
    client.leaveBreadcrumb("History " + fn, stateChangeToMetaData(win, state, title, url), 'navigation'); // if throttle plugin is in use, refresh the event sent count

    if (typeof client.refresh === 'function') client.refresh(); // if the client is operating in auto session-mode, a new route should trigger a new session

    if (client.config.autoCaptureSessions) client.startSession(); // Internet Explorer will convert `undefined` to a string when passed, causing an unintended redirect
    // to '/undefined'. therefore we only pass the url if it's not undefined.

    orig.apply(target, [state, title].concat(url !== undefined ? url : []));
  };

  target[fn]._restore = function () {
    target[fn] = orig;
  };
};

var getCurrentState = function (win) {
  try {
    return win.history.state;
  } catch (e) {}
};

var _$networkBreadcrumbs_36 = {};
var BREADCRUMB_TYPE = 'request'; // keys to safely store metadata on the request object

var REQUEST_SETUP_KEY = 'BS~~S';
var REQUEST_URL_KEY = 'BS~~U';
var REQUEST_METHOD_KEY = 'BS~~M';

var __includes_36 = _$esUtils_8.includes;

var restoreFunctions = [];
var client;
var win;

var getEndpoints = function () {
  return [client.config.endpoints.notify, client.config.endpoints.sessions];
};
/*
 * Leaves breadcrumbs when network requests occur
 */


_$networkBreadcrumbs_36.init = function (_client, _win) {
  if (_win === void 0) {
    _win = window;
  }

  var explicitlyDisabled = _client.config.networkBreadcrumbsEnabled === false;
  var implicitlyDisabled = _client.config.autoBreadcrumbs === false && _client.config.networkBreadcrumbsEnabled !== true;
  if (explicitlyDisabled || implicitlyDisabled) return;
  client = _client;
  win = _win;
  monkeyPatchXMLHttpRequest();
  monkeyPatchFetch();
};

_$networkBreadcrumbs_36.configSchema = {
  networkBreadcrumbsEnabled: {
    defaultValue: function () {
      return undefined;
    },
    validate: function (value) {
      return value === true || value === false || value === undefined;
    },
    message: 'should be true|false'
  }
};

if ("production" !== 'production') {
  _$networkBreadcrumbs_36.destroy = function () {
    restoreFunctions.forEach(function (fn) {
      return fn();
    });
    restoreFunctions = [];
  };
} // XMLHttpRequest monkey patch


var monkeyPatchXMLHttpRequest = function () {
  if (!('addEventListener' in win.XMLHttpRequest.prototype)) return;
  var nativeOpen = win.XMLHttpRequest.prototype.open; // override native open()

  win.XMLHttpRequest.prototype.open = function open(method, url) {
    // store url and HTTP method for later
    this[REQUEST_URL_KEY] = url;
    this[REQUEST_METHOD_KEY] = method; // if we have already setup listeners, it means open() was called twice, we need to remove
    // the listeners and recreate them

    if (this[REQUEST_SETUP_KEY]) {
      this.removeEventListener('load', handleXHRLoad);
      this.removeEventListener('error', handleXHRError);
    } // attach load event listener


    this.addEventListener('load', handleXHRLoad); // attach error event listener

    this.addEventListener('error', handleXHRError);
    this[REQUEST_SETUP_KEY] = true;
    nativeOpen.apply(this, arguments);
  };

  if ("production" !== 'production') {
    restoreFunctions.push(function () {
      win.XMLHttpRequest.prototype.open = nativeOpen;
    });
  }
};

function handleXHRLoad() {
  if (__includes_36(getEndpoints(), this[REQUEST_URL_KEY])) {
    // don't leave a network breadcrumb from bugsnag notify calls
    return;
  }

  var metaData = {
    status: this.status,
    request: this[REQUEST_METHOD_KEY] + " " + this[REQUEST_URL_KEY]
  };

  if (this.status >= 400) {
    // contacted server but got an error response
    client.leaveBreadcrumb('XMLHttpRequest failed', metaData, BREADCRUMB_TYPE);
  } else {
    client.leaveBreadcrumb('XMLHttpRequest succeeded', metaData, BREADCRUMB_TYPE);
  }
}

function handleXHRError() {
  if (__includes_36(getEndpoints(), this[REQUEST_URL_KEY])) {
    // don't leave a network breadcrumb from bugsnag notify calls
    return;
  } // failed to contact server


  client.leaveBreadcrumb('XMLHttpRequest error', {
    request: this[REQUEST_METHOD_KEY] + " " + this[REQUEST_URL_KEY]
  }, BREADCRUMB_TYPE);
} // window.fetch monkey patch


var monkeyPatchFetch = function () {
  if (!('fetch' in win)) return;
  var oldFetch = win.fetch;

  win.fetch = function fetch() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var url = args[0],
        options = args[1];
    var method = 'GET';

    if (options && options.method) {
      method = options.method;
    }

    return new Promise(function (resolve, reject) {
      // pass through to native fetch
      oldFetch.apply(void 0, args).then(function (response) {
        handleFetchSuccess(response, method, url);
        resolve(response);
      })["catch"](function (error) {
        handleFetchError(method, url);
        reject(error);
      });
    });
  };

  if ("production" !== 'production') {
    restoreFunctions.push(function () {
      win.fetch = oldFetch;
    });
  }
};

var handleFetchSuccess = function (response, method, url) {
  var metaData = {
    status: response.status,
    request: method + " " + url
  };

  if (response.status >= 400) {
    // when the request comes back with a 4xx or 5xx status it does not reject the fetch promise,
    client.leaveBreadcrumb('fetch() failed', metaData, BREADCRUMB_TYPE);
  } else {
    client.leaveBreadcrumb('fetch() succeeded', metaData, BREADCRUMB_TYPE);
  }
};

var handleFetchError = function (method, url) {
  client.leaveBreadcrumb('fetch() error', {
    request: method + " " + url
  }, BREADCRUMB_TYPE);
};

var __intRange_37 = _$validators_14.intRange;
/*
 * Throttles and dedupes error reports
 */


var _$throttle_37 = {
  init: function (client) {
    // track sent events for each init of the plugin
    var n = 0; // add beforeSend hook

    client.config.beforeSend.push(function (report) {
      // have max events been sent already?
      if (n >= client.config.maxEvents) return report.ignore();
      n++;
    });

    client.refresh = function () {
      n = 0;
    };
  },
  configSchema: {
    maxEvents: {
      defaultValue: function () {
        return 10;
      },
      message: 'should be a positive integer ≤100',
      validate: function (val) {
        return __intRange_37(1, 100)(val);
      }
    }
  }
};

var _$stripQueryString_38 = {};
function ___extends_38() { ___extends_38 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_38.apply(this, arguments); }

/*
 * Remove query strings (and fragments) from stacktraces
 */
var __map_38 = _$esUtils_8.map;

_$stripQueryString_38 = {
  init: function (client) {
    client.config.beforeSend.push(function (report) {
      report.stacktrace = __map_38(report.stacktrace, function (frame) {
        return ___extends_38({}, frame, {
          file: strip(frame.file)
        });
      });
    });
  }
};

var strip = _$stripQueryString_38._strip = function (str) {
  return typeof str === 'string' ? str.replace(/\?.*$/, '').replace(/#.*$/, '') : str;
};

/*
 * Automatically notifies Bugsnag when window.onerror is called
 */
var _$onerror_39 = {
  init: function (client, win) {
    if (win === void 0) {
      win = window;
    }

    function onerror(messageOrEvent, url, lineNo, charNo, error) {
      // Ignore errors with no info due to CORS settings
      if (lineNo === 0 && /Script error\.?/.test(messageOrEvent)) {
        client._logger.warn('Ignoring cross-domain or eval script error. See docs: https://tinyurl.com/y94fq5zm');
      } else {
        // any error sent to window.onerror is unhandled and has severity=error
        var handledState = {
          severity: 'error',
          unhandled: true,
          severityReason: {
            type: 'unhandledException'
          }
        };
        var report; // window.onerror can be called in a number of ways. This big if-else is how we
        // figure out which arguments were supplied, and what kind of values it received.

        if (error) {
          // if the last parameter (error) was supplied, this is a modern browser's
          // way of saying "this value was thrown and not caught"
          if (error.name && error.message) {
            // if it looks like an error, construct a report object using its stack
            report = new client.BugsnagReport(error.name, error.message, decorateStack(client.BugsnagReport.getStacktrace(error), url, lineNo, charNo), handledState, error);
          } else {
            // otherwise, for non error values that were thrown, stringify it for
            // use as the error message and get/generate a stacktrace
            report = new client.BugsnagReport('window.onerror', String(error), decorateStack(client.BugsnagReport.getStacktrace(error, 1), url, lineNo, charNo), handledState, error); // include the raw input as metadata

            report.updateMetaData('window onerror', {
              error: error
            });
          }
        } else if ( // This complex case detects "error" events that are typically synthesised
        // by jquery's trigger method (although can be created in other ways). In
        // order to detect this:
        // - the first argument (message) must exist and be an object (most likely it's a jQuery event)
        // - the second argument (url) must either not exist or be something other than a string (if it
        //    exists and is not a string, it'll be the extraParameters argument from jQuery's trigger()
        //    function)
        // - the third, fourth and fifth arguments must not exist (lineNo, charNo and error)
        typeof messageOrEvent === 'object' && messageOrEvent !== null && (!url || typeof url !== 'string') && !lineNo && !charNo && !error) {
          // The jQuery event may have a "type" property, if so use it as part of the error message
          var name = messageOrEvent.type ? "Event: " + messageOrEvent.type : 'window.onerror'; // attempt to find a message from one of the conventional properties, but
          // default to empty string (the report will fill it with a placeholder)

          var message = messageOrEvent.message || messageOrEvent.detail || '';
          report = new client.BugsnagReport(name, message, client.BugsnagReport.getStacktrace(new Error(), 1).slice(1), handledState, messageOrEvent); // include the raw input as metadata – it might contain more info than we extracted

          report.updateMetaData('window onerror', {
            event: messageOrEvent,
            extraParameters: url
          });
        } else {
          // Lastly, if there was no "error" parameter this event was probably from an old
          // browser that doesn't support that. Instead we need to generate a stacktrace.
          report = new client.BugsnagReport('window.onerror', String(messageOrEvent), decorateStack(client.BugsnagReport.getStacktrace(error, 1), url, lineNo, charNo), handledState, messageOrEvent); // include the raw input as metadata – it might contain more info than we extracted

          report.updateMetaData('window onerror', {
            event: messageOrEvent
          });
        }

        client.notify(report);
      }

      if (typeof prevOnError === 'function') prevOnError.apply(this, arguments);
    }

    var prevOnError = win.onerror;
    win.onerror = onerror;
  } // Sometimes the stacktrace has less information than was passed to window.onerror.
  // This function will augment the first stackframe with any useful info that was
  // received as arguments to the onerror callback.

};

var decorateStack = function (stack, url, lineNo, charNo) {
  var culprit = stack[0];
  if (!culprit) return stack;
  if (!culprit.fileName && typeof url === 'string') culprit.setFileName(url);
  if (!culprit.lineNumber && isActualNumber(lineNo)) culprit.setLineNumber(lineNo);

  if (!culprit.columnNumber) {
    if (isActualNumber(charNo)) {
      culprit.setColumnNumber(charNo);
    } else if (window.event && isActualNumber(window.event.errorCharacter)) {
      culprit.setColumnNumber(window.event.errorCharacter);
    }
  }

  return stack;
};

var isActualNumber = function (n) {
  return typeof n === 'number' && String.call(n) !== 'NaN';
};

var _$unhandledRejection_40 = {};
/* removed: var _$hasStack_9 = require('@bugsnag/core/lib/has-stack'); */;

var __reduce_40 = _$esUtils_8.reduce;

/* removed: var _$errorStackParser_7 = require('@bugsnag/core/lib/error-stack-parser'); */;

/* removed: var _$iserror_11 = require('@bugsnag/core/lib/iserror'); */;
/*
 * Automatically notifies Bugsnag when window.onunhandledrejection is called
 */


var _listener;

_$unhandledRejection_40.init = function (client, win) {
  if (win === void 0) {
    win = window;
  }

  var listener = function (event) {
    var error = event.reason;
    var isBluebird = false; // accessing properties on event.detail can throw errors (see #394)

    try {
      if (event.detail && event.detail.reason) {
        error = event.detail.reason;
        isBluebird = true;
      }
    } catch (e) {}

    var handledState = {
      severity: 'error',
      unhandled: true,
      severityReason: {
        type: 'unhandledPromiseRejection'
      }
    };
    var report;

    if (error && _$hasStack_9(error)) {
      // if it quacks like an Error…
      report = new client.BugsnagReport(error.name, error.message, _$errorStackParser_7.parse(error), handledState, error);

      if (isBluebird) {
        report.stacktrace = __reduce_40(report.stacktrace, fixBluebirdStacktrace(error), []);
      }
    } else {
      // if it doesn't…
      var msg = 'Rejection reason was not an Error. See "Promise" tab for more detail.';
      report = new client.BugsnagReport(error && error.name ? error.name : 'UnhandledRejection', error && error.message ? error.message : msg, [], handledState, error); // stuff the rejection reason into metaData, it could be useful

      report.updateMetaData('promise', 'rejection reason', serializableReason(error));
    }

    client.notify(report);
  };

  if ('addEventListener' in win) {
    win.addEventListener('unhandledrejection', listener);
  } else {
    win.onunhandledrejection = function (reason, promise) {
      listener({
        detail: {
          reason: reason,
          promise: promise
        }
      });
    };
  }

  _listener = listener;
};

if ("production" !== 'production') {
  _$unhandledRejection_40.destroy = function (win) {
    if (win === void 0) {
      win = window;
    }

    if (_listener) {
      if ('addEventListener' in win) {
        win.removeEventListener('unhandledrejection', _listener);
      } else {
        win.onunhandledrejection = null;
      }
    }

    _listener = null;
  };
}

var serializableReason = function (err) {
  if (err === null || err === undefined) {
    return 'undefined (or null)';
  } else if (_$iserror_11(err)) {
    var _ref;

    return _ref = {}, _ref[Object.prototype.toString.call(err)] = {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    }, _ref;
  } else {
    return err;
  }
}; // The stack parser on bluebird stacks in FF get a suprious first frame:
//
// Error: derp
//   b@http://localhost:5000/bluebird.html:22:24
//   a@http://localhost:5000/bluebird.html:18:9
//   @http://localhost:5000/bluebird.html:14:9
//
// results in
//   […]
//     0: Object { file: "Error: derp", method: undefined, lineNumber: undefined, … }
//     1: Object { file: "http://localhost:5000/bluebird.html", method: "b", lineNumber: 22, … }
//     2: Object { file: "http://localhost:5000/bluebird.html", method: "a", lineNumber: 18, … }
//     3: Object { file: "http://localhost:5000/bluebird.html", lineNumber: 14, columnNumber: 9, … }
//
// so the following reduce/accumulator function removes such frames
//
// Bluebird pads method names with spaces so trim that too…
// https://github.com/petkaantonov/bluebird/blob/b7f21399816d02f979fe434585334ce901dcaf44/src/debuggability.js#L568-L571


var fixBluebirdStacktrace = function (error) {
  return function (accum, frame) {
    if (frame.file === error.toString()) return accum;

    if (frame.method) {
      frame.method = frame.method.replace(/^\s+/, '');
    }

    return accum.concat(frame);
  };
};

var _$notifier_2 = {};
function ___extends_2() { ___extends_2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ___extends_2.apply(this, arguments); }

var name = 'Bugsnag JavaScript';
var version = '6.1.0';
var url = 'https://github.com/bugsnag/bugsnag-js';

/* removed: var _$BugsnagClient_4 = require('@bugsnag/core/client'); */;

/* removed: var _$BugsnagReport_23 = require('@bugsnag/core/report'); */;

/* removed: var _$Session_24 = require('@bugsnag/core/session'); */;

/* removed: var _$BugsnagBreadcrumb_3 = require('@bugsnag/core/breadcrumb'); */;

var __map_2 = _$esUtils_8.map; // extend the base config schema with some browser-specific options


var __schema_2 = ___extends_2({}, _$config_5.schema, _$config_1);

/* removed: var _$onerror_39 = require('@bugsnag/plugin-window-onerror'); */;

/* removed: var _$unhandledRejection_40 = require('@bugsnag/plugin-window-unhandled-rejection'); */;

/* removed: var _$device_28 = require('@bugsnag/plugin-browser-device'); */;

/* removed: var _$context_27 = require('@bugsnag/plugin-browser-context'); */;

/* removed: var _$request_29 = require('@bugsnag/plugin-browser-request'); */;

/* removed: var _$throttle_37 = require('@bugsnag/plugin-simple-throttle'); */;

/* removed: var _$consoleBreadcrumbs_32 = require('@bugsnag/plugin-console-breadcrumbs'); */;

/* removed: var _$networkBreadcrumbs_36 = require('@bugsnag/plugin-network-breadcrumbs'); */;

/* removed: var _$navigationBreadcrumbs_35 = require('@bugsnag/plugin-navigation-breadcrumbs'); */;

/* removed: var _$interactionBreadcrumbs_34 = require('@bugsnag/plugin-interaction-breadcrumbs'); */;

/* removed: var _$inlineScriptContent_33 = require('@bugsnag/plugin-inline-script-content'); */;

/* removed: var _$session_30 = require('@bugsnag/plugin-browser-session'); */;

/* removed: var _$clientIp_31 = require('@bugsnag/plugin-client-ip'); */;

/* removed: var _$stripQueryString_38 = require('@bugsnag/plugin-strip-query-string'); */; // delivery mechanisms


/* removed: var _$delivery_25 = require('@bugsnag/delivery-x-domain-request'); */;

/* removed: var _$delivery_26 = require('@bugsnag/delivery-xml-http-request'); */;

_$notifier_2 = function (opts) {
  // handle very simple use case where user supplies just the api key as a string
  if (typeof opts === 'string') opts = {
    apiKey: opts // support renamed/deprecated options

  };
  var warnings = [];

  if (opts.sessionTrackingEnabled) {
    warnings.push('deprecated option sessionTrackingEnabled is now called autoCaptureSessions');
    opts.autoCaptureSessions = opts.sessionTrackingEnabled;
  }

  if ((opts.endpoint || opts.sessionEndpoint) && !opts.endpoints) {
    warnings.push('deprecated options endpoint/sessionEndpoint are now configured in the endpoints object');
    opts.endpoints = {
      notify: opts.endpoint,
      sessions: opts.sessionEndpoint
    };
  }

  if (opts.endpoints && opts.endpoints.notify && !opts.endpoints.sessions) {
    warnings.push('notify endpoint is set but sessions endpoint is not. No sessions will be sent.');
  }

  var bugsnag = new _$BugsnagClient_4({
    name: name,
    version: version,
    url: url
  });
  bugsnag.setOptions(opts); // set delivery based on browser capability (IE 8+9 have an XDomainRequest object)

  bugsnag.delivery(window.XDomainRequest ? _$delivery_25() : _$delivery_26()); // configure with user supplied options
  // errors can be thrown here that prevent the lib from being in a useable state

  bugsnag.configure(__schema_2);
  __map_2(warnings, function (w) {
    return bugsnag._logger.warn(w);
  }); // always-on browser-specific plugins

  bugsnag.use(_$device_28);
  bugsnag.use(_$context_27);
  bugsnag.use(_$request_29);
  bugsnag.use(_$inlineScriptContent_33);
  bugsnag.use(_$throttle_37);
  bugsnag.use(_$session_30);
  bugsnag.use(_$clientIp_31);
  bugsnag.use(_$stripQueryString_38); // optional browser-specific plugins

  if (bugsnag.config.autoNotify !== false) {
    bugsnag.use(_$onerror_39);
    bugsnag.use(_$unhandledRejection_40);
  }

  bugsnag.use(_$navigationBreadcrumbs_35);
  bugsnag.use(_$interactionBreadcrumbs_34);
  bugsnag.use(_$networkBreadcrumbs_36);
  bugsnag.use(_$consoleBreadcrumbs_32);

  bugsnag._logger.debug("Loaded!");

  return bugsnag.config.autoCaptureSessions ? bugsnag.startSession() : bugsnag;
}; // Stub this value because this is what the type interface looks like
// (types/bugsnag.d.ts). This is only an issue in Angular's development
// mode as its TS/DI thingy attempts to use this value at runtime.
// In most other situations, TS only uses the types at compile time.


_$notifier_2.Bugsnag = {
  Client: _$BugsnagClient_4,
  Report: _$BugsnagReport_23,
  Session: _$Session_24,
  Breadcrumb: _$BugsnagBreadcrumb_3 // Export a "default" property for compatibility with ESM imports

};
_$notifier_2['default'] = _$notifier_2;

return _$notifier_2;

});
//# sourceMappingURL=bugsnag.js.map
