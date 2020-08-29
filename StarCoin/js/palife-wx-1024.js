(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PALifeWX"] = factory();
	else
		root["PALifeWX"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _assign = __webpack_require__(1);

	var _assign2 = _interopRequireDefault(_assign);

	var _toConsumableArray2 = __webpack_require__(39);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _stringify = __webpack_require__(61);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _keys = __webpack_require__(63);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var wx = __webpack_require__(67);
	var util = __webpack_require__(68);

	var appId = util.env() === 'prod' ? 'wx923df9a0236dd275' : 'wxef57fd51a6221f6d';

	var debug = false;
	var isWxReady = false;
	var isWxError = false;
	var JSAPI_LIST = ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'openLocation', 'getLocation', 'getLocalImgData', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView'];
	var ON_SHARE_JSAPI_LIST = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];

	var urlParams = util.getUrlParams();
	var isInWeiXin = util.isInWeiXin();
	var needWxUserInfoField = [];
	var mpAccount = 'jgj';
	var waitingQueue = [];
	var MAX_REDIRECT_RETRY_TIMES = 2;

	var wxAppId = null;
	var sendRecordsToPortalFirst = false;
	var scope = 'base';
	var bindingChannel = void 0;
	var portalApiPrefix = 'https://elis-smp-portal-stg4.pingan.com.cn:443/elis_smp_portal_dmz/do';

	var reformat = function reformat(extra) {
	    var res = '';
	    if (typeof extra !== 'undefined' && extra !== null) {
	        (0, _keys2.default)(extra).forEach(function (e) {
	            if (Object.prototype.hasOwnProperty.call(extra, e)) {
	                res += e + '=' + extra[e] + ',';
	            }
	        });
	    }
	    res = res.replace(/,$/, '');
	    res = '{' + res + '}';
	    return encodeURIComponent(res);
	};
	var redirectToWeixin = function redirectToWeixin() {
	    var redirectHost = util.env() === 'prod' ? 'https://ulink.lifeapp.pingan.com.cn/palifewx/auth-redirect.html' : 'https://stg2-lilith.cdn.lifeapp.pingan.com.cn/palifewx/auth-redirect.html';
	    var paBindUrl = util.env() === 'prod' ? 'https://als.cdn.lifeapp.pingan.com.cn/elis_smp_als_dmz/act-base/wx-bind/index.html' : 'https://stg1-als.cdn.lifeapp.pingan.com.cn/elis_smp_als_dmz/act-base/wx-bind/index.html';
	    var redirectUri = encodeURIComponent(redirectHost + '?pa_params=' + encodeURIComponent((0, _stringify2.default)({
	        pa_weixin_platform_account: mpAccount,
	        pa_biz_url: encodeURIComponent(window.location.href),
	        pa_need_unionid: needWxUserInfoField.indexOf('unionid') > -1 ? 1 : 0,
	        pa_bind_url: bindingChannel ? encodeURIComponent(paBindUrl) : undefined,
	        binding_channel: bindingChannel
	    })));

	    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wxAppId + '&redirect_uri=' + redirectUri + '&response_type=code&scope=snsapi_' + scope + '&state=0#wechat_redirect';
	};
	var maybeRedirect = function maybeRedirect() {
	    if (typeof needWxUserInfoField === 'undefined' || needWxUserInfoField.length < 1) {
	        return;
	    }
	    if (needWxUserInfoField.indexOf('openid') >= 0 || needWxUserInfoField.indexOf('unionid') >= 0) {
	        var redirectRetryTimes = localStorage.getItem('wx_redirect_retried') || 0;
	        if (parseInt(redirectRetryTimes, 10) <= MAX_REDIRECT_RETRY_TIMES) {
	            if (typeof urlParams.openid === 'undefined' || urlParams.openid === 'null') {
	                localStorage.setItem('wx_redirect_retried', parseInt(redirectRetryTimes, 10) + 1);
	                redirectToWeixin();
	            } else {
	                console.log('got openid: ' + urlParams.openid);
	                localStorage.removeItem('wx_redirect_retried');
	            }
	        } else {
	            localStorage.removeItem('wx_redirect_retried');
	        }
	    }
	};
	var PALifeWX = function PALifeWX(config) {
	    if (typeof config !== 'undefined' && typeof config.needUserInfo !== 'undefined') {
	        if (typeof config.needUserInfo === 'string') {
	            needWxUserInfoField.push(config.needUserInfo);
	        } else {
	            needWxUserInfoField = [].concat((0, _toConsumableArray3.default)(config.needUserInfo));
	        }
	    }
	    if (typeof config !== 'undefined' && typeof config.mpAccount !== 'undefined') {
	        if (['jgj', 'zeb'].indexOf(config.mpAccount) < 0) {
	            throw new Error('config.mpAccount must be one of "jgj"、"zeb"');
	        } else {
	            mpAccount = config.mpAccount;
	        }
	    }
	    if (typeof config !== 'undefined' && typeof config.scope !== 'undefined' && config.scope === 'userinfo') {
	        scope = 'userinfo';
	    }
	    if (typeof config !== 'undefined' && typeof config.bindingChannel !== 'undefined') {
	        bindingChannel = config.bindingChannel;
	    }

	    if (typeof config !== 'undefined' && typeof config.portalApiPrefix !== 'undefined') {
	        portalApiPrefix = config.portalApiPrefix;
	    }

	    var xhr = new XMLHttpRequest();
	    var url = util.env() === 'prod' ? 'https://platform.lifeapp.pingan.com.cn/user-auth/weixin/share/getSignature' : 'https://test3-platform.lifeapp.pingan.com.cn/user-auth/weixin/share/getSignature';
	    xhr.open('POST', url, true);
	    xhr.setRequestHeader('Content-Type', 'application/json');
	    xhr.onreadystatechange = function onreadystatechange() {
	        if (xhr.readyState === 4) {
	            console.log('debug signature: ' + xhr.responseText);
	            var response = JSON.parse(xhr.responseText);
	            if (xhr.status === 200 && response.CODE === '00') {
	                wxAppId = response.DATA.appId;
	                maybeRedirect(needWxUserInfoField);
	                wx.config((0, _assign2.default)({}, response.DATA, {
	                    debug: debug,
	                    jsApiList: [].concat(ON_SHARE_JSAPI_LIST, JSAPI_LIST)
	                }));
	            } else {
	                window.alert(xhr.status + ':sig\u63A5\u53E3\u7F51\u7EDC\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u5019\u518D\u8BD5');
	            }
	        }
	    };
	    xhr.send((0, _stringify2.default)({
	        url: encodeURIComponent(window.location.href.split('#')[0]),
	        weixinPlatformAccount: mpAccount
	    }));

	    return PALifeWX;
	};
	PALifeWX.init = PALifeWX;
	var _addRecord = function _addRecord(recordParam) {
	    var url = util.env() === 'prod' ? 'https://elis-smp-ubas-new.lifeapp.pingan.com.cn:443/smp-ubas-dmz/mobile/infoReport.do' : 'https://test-elis-smp-ubas-new.lifeapp.pingan.com.cn:11143/smp-ubas-dmz/mobile/infoReport.do';
	    var extra = null;
	    var data = null;
	    if (needWxUserInfoField.indexOf('openid') >= 0) {
	        extra = (0, _assign2.default)(recordParam.extra || {}, {
	            openID: urlParams.openid
	        });
	    }
	    if (needWxUserInfoField.indexOf('unionid') >= 0) {
	        if (urlParams.unionid === 'null' || typeof urlParams.unionid === 'undefined') {
	            url = util.env() === 'prod' ? 'https://elis-smp-portal.pingan.com.cn:40056/elis_smp_portal_dmz/do/weixin/share/reportShareInfo' : portalApiPrefix + '/weixin/share/reportShareInfo';
	            sendRecordsToPortalFirst = true;
	            data = [['1', '100', recordParam.phone || '12345678910', recordParam.eventId, recordParam.eventLabel, new Date().getTime()].join('|') + (extra ? '|' + reformat(extra) : '')];
	            delete extra.openID;
	        } else {
	            extra = (0, _assign2.default)(extra, {
	                unionID: urlParams.unionid
	            });
	            data = [['100', recordParam.phone || '12345678910', recordParam.eventId, recordParam.eventLabel, new Date().getTime()].join('|') + (extra ? '|' + reformat(extra) : '')];
	        }
	    }
	    var xhr = new XMLHttpRequest();
	    xhr.open('POST', url, true);
	    xhr.setRequestHeader('Content-Type', 'application/json');
	    if (sendRecordsToPortalFirst) {
	        xhr.send((0, _stringify2.default)({
	            appID: '10003',
	            devId: '12345678910111213',
	            data: data,
	            weixinPlatformAccount: mpAccount,
	            openID: urlParams.openid
	        }));
	    } else {
	        xhr.send((0, _stringify2.default)({
	            appID: '10003',
	            devId: '12345678910111213',
	            data: data
	        }));
	    }
	};
	var getShareLink = function getShareLink(link) {
	    var tempLink = link || window.location.href;
	    var query = tempLink.split('?')[1];
	    var tempQuery = '';
	    if (typeof query !== 'undefined') {
	        query.split('&').forEach(function (element) {
	            var kv = element.split('=');
	            if (kv[0] !== 'unionid' && kv[0] !== 'openid') {
	                tempQuery = '' + tempQuery + element + '&';
	            }
	        });
	        tempQuery = tempQuery.replace(/&$/, '');
	    }
	    if (tempQuery !== '') {
	        tempLink = tempLink.split('?')[0] + '?' + tempQuery;
	    }
	    return tempLink;
	};
	var _initWxShare = function _initWxShare(opt) {
	    console.log('init wx share');
	    if (typeof opt === 'undefined') {
	        throw new Error('opt must not be null');
	    }
	    ON_SHARE_JSAPI_LIST.forEach(function (api) {
	        wx[api]({
	            title: opt.title,
	            link: getShareLink(opt.link),
	            desc: opt.desc,
	            imgUrl: opt.imgUrl,
	            success: function success() {
	                if (opt.recordParam) {
	                    (0, _assign2.default)(opt.recordParam.extra, {
	                        shareInWx: 1
	                    });
	                    if (api === 'onMenuShareTimeline') {
	                        (0, _assign2.default)(opt.recordParam.extra, {
	                            wxShareCh: 1
	                        });
	                    } else if (api === 'onMenuShareAppMessage') {
	                        (0, _assign2.default)(opt.recordParam.extra, {
	                            wxShareCh: 2
	                        });
	                    }
	                    _addRecord(opt.recordParam);
	                }
	                if (opt.success && typeof opt.success === 'function') {
	                    opt.success();
	                }
	            },
	            cancel: function cancel() {
	                if (opt.cancel && typeof opt.cancel === 'function') {
	                    opt.cancel();
	                }
	            }
	        });
	    });
	};
	PALifeWX.setOnShare = function (opt) {
	    util.updateLinkQuery(opt);
	    if (isWxReady) {
	        _initWxShare(opt);
	    } else if (isInWeiXin) {
	        waitingQueue.push({
	            api: 'setOnShare',
	            data: opt
	        });
	    }
	};

	PALifeWX.scanQRCode = function (opt) {
	    if (isWxReady) {
	        wx.scanQRCode(opt);
	    } else if (isInWeiXin) {
	        waitingQueue.push({
	            api: 'scanQRCode',
	            data: opt
	        });
	    }
	};

	function wrapperDataAndNoticeToDownload(data) {
	    var wrapperData = (0, _assign2.default)({}, data);
	    var bizSuccess = data.success;
	    wrapperData.success = function (res) {
	        var url = util.env() === 'prod' ? 'https://elis-smp-portal.pingan.com.cn:40056/elis_smp_portal_dmz/do/weixin/share/downloadImage' : portalApiPrefix + '/weixin/share/downloadImage';
	        var xhr = new XMLHttpRequest();
	        xhr.open('POST', url, true);
	        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        xhr.onreadystatechange = function onreadystatechange() {
	            if (xhr.readyState === 4) {
	                if (xhr.status === 200) {
	                    var response = JSON.parse(xhr.responseText);
	                    if (response.CODE === '00') {
	                        if (bizSuccess) {
	                            bizSuccess(res);
	                        }
	                    } else {
	                        data.fail('图片上传失败');
	                    }
	                } else if (data.fail) {
	                    data.fail('图片上传失败');
	                }
	            }
	        };
	        xhr.send('serverId=' + res.serverId + '&weixinPlatformAccount=' + mpAccount);
	    };
	    return wrapperData;
	}
	JSAPI_LIST.forEach(function (element) {
	    PALifeWX[element] = function (data) {
	        if (isWxReady) {
	            var wrapperData = data;
	            if (element === 'uploadImage') {
	                wrapperData = wrapperDataAndNoticeToDownload(data);
	            }
	            wx[element](wrapperData);
	        } else if (isInWeiXin) {
	            waitingQueue.push({
	                api: element,
	                data: data
	            });
	        }
	    };
	});
	if (isInWeiXin) {
	    wx.ready(function () {
	        if (isWxError) {
	            return;
	        }
	        console.log('wx config ready');
	        isWxReady = true;
	        if (waitingQueue.length !== 0) {
	            var action = waitingQueue.shift();
	            while (typeof action !== 'undefined') {
	                if (action.api === 'setOnShare') {
	                    _initWxShare(action.data);
	                } else {
	                    if (action.api === 'uploadImage') {
	                        action.data = wrapperDataAndNoticeToDownload(action.data);
	                    }
	                    wx[action.api](action.data);
	                }
	                action = waitingQueue.shift();
	            }
	        }
	    });
	    wx.error(function (res) {
	        isWxError = true;
	        console.error('wx config err: ' + (0, _stringify2.default)(res));
	    });
	}
	PALifeWX.getOpenId = function () {
	    return urlParams.openid;
	};
	PALifeWX.appId = appId;

	module.exports = PALifeWX;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	module.exports = __webpack_require__(6).Object.assign;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(4);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(20) });


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(5);
	var core = __webpack_require__(6);
	var ctx = __webpack_require__(7);
	var hide = __webpack_require__(9);
	var has = __webpack_require__(19);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.7' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(8);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(10);
	var createDesc = __webpack_require__(18);
	module.exports = __webpack_require__(14) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(11);
	var IE8_DOM_DEFINE = __webpack_require__(13);
	var toPrimitive = __webpack_require__(17);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(14) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(14) && !__webpack_require__(15)(function () {
	  return Object.defineProperty(__webpack_require__(16)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(15)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12);
	var document = __webpack_require__(5).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(12);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(21);
	var gOPS = __webpack_require__(36);
	var pIE = __webpack_require__(37);
	var toObject = __webpack_require__(38);
	var IObject = __webpack_require__(24);
	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(15)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(22);
	var enumBugKeys = __webpack_require__(35);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(19);
	var toIObject = __webpack_require__(23);
	var arrayIndexOf = __webpack_require__(27)(false);
	var IE_PROTO = __webpack_require__(31)('IE_PROTO');

	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(24);
	var defined = __webpack_require__(26);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(25);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(23);
	var toLength = __webpack_require__(28);
	var toAbsoluteIndex = __webpack_require__(30);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(29);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(32)('keys');
	var uid = __webpack_require__(34);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(6);
	var global = __webpack_require__(5);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core.version,
	  mode: __webpack_require__(33) ? 'pure' : 'global',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(26);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(40);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(41), __esModule: true };

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(42);
	__webpack_require__(54);
	module.exports = __webpack_require__(6).Array.from;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(43)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(44)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29);
	var defined = __webpack_require__(26);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(33);
	var $export = __webpack_require__(4);
	var redefine = __webpack_require__(45);
	var hide = __webpack_require__(9);
	var Iterators = __webpack_require__(46);
	var $iterCreate = __webpack_require__(47);
	var setToStringTag = __webpack_require__(51);
	var getPrototypeOf = __webpack_require__(53);
	var ITERATOR = __webpack_require__(52)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(48);
	var descriptor = __webpack_require__(18);
	var setToStringTag = __webpack_require__(51);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(9)(IteratorPrototype, __webpack_require__(52)('iterator'), function () { return this; });

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(11);
	var dPs = __webpack_require__(49);
	var enumBugKeys = __webpack_require__(35);
	var IE_PROTO = __webpack_require__(31)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(16)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(50).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(10);
	var anObject = __webpack_require__(11);
	var getKeys = __webpack_require__(21);

	module.exports = __webpack_require__(14) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(5).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(10).f;
	var has = __webpack_require__(19);
	var TAG = __webpack_require__(52)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(32)('wks');
	var uid = __webpack_require__(34);
	var Symbol = __webpack_require__(5).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(19);
	var toObject = __webpack_require__(38);
	var IE_PROTO = __webpack_require__(31)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx = __webpack_require__(7);
	var $export = __webpack_require__(4);
	var toObject = __webpack_require__(38);
	var call = __webpack_require__(55);
	var isArrayIter = __webpack_require__(56);
	var toLength = __webpack_require__(28);
	var createProperty = __webpack_require__(57);
	var getIterFn = __webpack_require__(58);

	$export($export.S + $export.F * !__webpack_require__(60)(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(11);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(46);
	var ITERATOR = __webpack_require__(52)('iterator');
	var ArrayProto = Array.prototype;

	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(10);
	var createDesc = __webpack_require__(18);

	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(59);
	var ITERATOR = __webpack_require__(52)('iterator');
	var Iterators = __webpack_require__(46);
	module.exports = __webpack_require__(6).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(25);
	var TAG = __webpack_require__(52)('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__(52)('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }

	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(6);
	var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
	module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(64), __esModule: true };

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65);
	module.exports = __webpack_require__(6).Object.keys;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(38);
	var $keys = __webpack_require__(21);

	__webpack_require__(66)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(4);
	var core = __webpack_require__(6);
	var fails = __webpack_require__(15);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

	!function (a, b) {
	    module.exports = b(a)
	}(window, function (a, b) {
	    function c(b, c, d) {
	        a.WeixinJSBridge ? WeixinJSBridge.invoke(b, e(c), function (a) {
	            h(b, a, d)
	        }) : k(b, d)
	    }

	    function d(b, c, d) {
	        a.WeixinJSBridge ? WeixinJSBridge.on(b, function (a) {
	            d && d.trigger && d.trigger(a), h(b, a, c)
	        }) : d ? k(b, d) : k(b, c)
	    }

	    function e(a) {
	        return a = a || {}, a.appId = D.appId, a.verifyAppId = D.appId, a.verifySignType = "sha1", a.verifyTimestamp = D.timestamp + "", a.verifyNonceStr = D.nonceStr, a.verifySignature = D.signature, a
	    }

	    function f(a) {
	        return {
	            timeStamp: a.timestamp + "",
	            nonceStr: a.nonceStr,
	            "package": a["package"],
	            paySign: a.paySign,
	            signType: a.signType || "SHA1"
	        }
	    }

	    function g(a) {
	        return a.postalCode = a.addressPostalCode, delete a.addressPostalCode, a.provinceName = a.proviceFirstStageName, delete a.proviceFirstStageName, a.cityName = a.addressCitySecondStageName, delete a.addressCitySecondStageName, a.countryName = a.addressCountiesThirdStageName, delete a.addressCountiesThirdStageName, a.detailInfo = a.addressDetailInfo, delete a.addressDetailInfo, a
	    }

	    function h(a, b, c) {
	        "openEnterpriseChat" == a && (b.errCode = b.err_code), delete b.err_code, delete b.err_desc, delete b.err_detail;
	        var d = b.errMsg;
	        d || (d = b.err_msg, delete b.err_msg, d = i(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", D.debug && !c.isInnerInvoke && alert(JSON.stringify(b));
	        var e = d.indexOf(":"), f = d.substring(e + 1);
	        switch (f) {
	            case"ok":
	                c.success && c.success(b);
	                break;
	            case"cancel":
	                c.cancel && c.cancel(b);
	                break;
	            default:
	                c.fail && c.fail(b)
	        }
	        c.complete && c.complete(b)
	    }

	    function i(a, b) {
	        var c = a, d = q[c];
	        d && (c = d);
	        var e = "ok";
	        if (b) {
	            var f = b.indexOf(":");
	            e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail")
	        }
	        return b = c + ":" + e
	    }

	    function j(a) {
	        if (a) {
	            for (var b = 0, c = a.length; c > b; ++b) {
	                var d = a[b], e = p[d];
	                e && (a[b] = e)
	            }
	            return a
	        }
	    }

	    function k(a, b) {
	        if (!(!D.debug || b && b.isInnerInvoke)) {
	            var c = q[a];
	            c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "")
	        }
	    }

	    function l(a) {
	        if (!(v || w || D.debug || "6.0.2" > A || C.systemType < 0)) {
	            var b = new Image;
	            C.appId = D.appId, C.initTime = B.initEndTime - B.initStartTime, C.preVerifyTime = B.preVerifyEndTime - B.preVerifyStartTime, I.getNetworkType({
	                isInnerInvoke: !0,
	                success: function (a) {
	                    C.networkType = a.networkType;
	                    var c = "https://open.weixin.qq.com/sdk/report?v=" + C.version + "&o=" + C.isPreVerifyOk + "&s=" + C.systemType + "&c=" + C.clientVersion + "&a=" + C.appId + "&n=" + C.networkType + "&i=" + C.initTime + "&p=" + C.preVerifyTime + "&u=" + C.url;
	                    b.src = c
	                }
	            })
	        }
	    }

	    function m() {
	        return (new Date).getTime()
	    }

	    function n(b) {
	        x && (a.WeixinJSBridge ? b() : r.addEventListener && r.addEventListener("WeixinJSBridgeReady", b, !1))
	    }

	    function o() {
	        I.invoke || (I.invoke = function (b, c, d) {
	            a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d)
	        }, I.on = function (b, c) {
	            a.WeixinJSBridge && WeixinJSBridge.on(b, c)
	        })
	    }

	    if (!a.jWeixin) {
	        var p = {
	            config: "preVerifyJSAPI",
	            onMenuShareTimeline: "menu:share:timeline",
	            onMenuShareAppMessage: "menu:share:appmessage",
	            onMenuShareQQ: "menu:share:qq",
	            onMenuShareWeibo: "menu:share:weiboApp",
	            onMenuShareQZone: "menu:share:QZone",
	            previewImage: "imagePreview",
	            getLocation: "geoLocation",
	            openProductSpecificView: "openProductViewWithPid",
	            addCard: "batchAddCard",
	            openCard: "batchViewCard",
	            chooseWXPay: "getBrandWCPayRequest",
	            openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
	            startSearchBeacons: "startMonitoringBeacons",
	            stopSearchBeacons: "stopMonitoringBeacons",
	            onSearchBeacons: "onBeaconsInRange",
	            consumeAndShareCard: "consumedShareCard",
	            openAddress: "editAddress"
	        }, q = function () {
	            var a = {};
	            for (var b in p)a[p[b]] = b;
	            return a
	        }(), r = a.document, s = r.title, t = navigator.userAgent.toLowerCase(), u = navigator.platform.toLowerCase(), v = !(!u.match("mac") && !u.match("win")), w = -1 != t.indexOf("wxdebugger"), x = -1 != t.indexOf("micromessenger"), y = -1 != t.indexOf("android"), z = -1 != t.indexOf("iphone") || -1 != t.indexOf("ipad"), A = function () {
	            var a = t.match(/micromessenger\/(\d+\.\d+\.\d+)/) || t.match(/micromessenger\/(\d+\.\d+)/);
	            return a ? a[1] : ""
	        }(), B = {initStartTime: m(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0}, C = {
	            version: 1,
	            appId: "",
	            initTime: 0,
	            preVerifyTime: 0,
	            networkType: "",
	            isPreVerifyOk: 1,
	            systemType: z ? 1 : y ? 2 : -1,
	            clientVersion: A,
	            url: encodeURIComponent(location.href)
	        }, D = {}, E = {_completes: []}, F = {state: 0, data: {}};
	        n(function () {
	            B.initEndTime = m()
	        });
	        var G = !1, H = [], I = {
	            config: function (a) {
	                D = a, k("config", a);
	                var b = D.check === !1 ? !1 : !0;
	                n(function () {
	                    if (b)c(p.config, {verifyJsApiList: j(D.jsApiList)}, function () {
	                        E._complete = function (a) {
	                            B.preVerifyEndTime = m(), F.state = 1, F.data = a
	                        }, E.success = function (a) {
	                            C.isPreVerifyOk = 0
	                        }, E.fail = function (a) {
	                            E._fail ? E._fail(a) : F.state = -1
	                        };
	                        var a = E._completes;
	                        return a.push(function () {
	                            l()
	                        }), E.complete = function (b) {
	                            for (var c = 0, d = a.length; d > c; ++c)a[c]();
	                            E._completes = []
	                        }, E
	                    }()), B.preVerifyStartTime = m(); else {
	                        F.state = 1;
	                        for (var a = E._completes, d = 0, e = a.length; e > d; ++d)a[d]();
	                        E._completes = []
	                    }
	                }), D.beta && o()
	            }, ready: function (a) {
	                0 != F.state ? a() : (E._completes.push(a), !x && D.debug && a())
	            }, error: function (a) {
	                "6.0.2" > A || (-1 == F.state ? a(F.data) : E._fail = a)
	            }, checkJsApi: function (a) {
	                var b = function (a) {
	                    var b = a.checkResult;
	                    for (var c in b) {
	                        var d = q[c];
	                        d && (b[d] = b[c], delete b[c])
	                    }
	                    return a
	                };
	                c("checkJsApi", {jsApiList: j(a.jsApiList)}, function () {
	                    return a._complete = function (a) {
	                        if (y) {
	                            var c = a.checkResult;
	                            c && (a.checkResult = JSON.parse(c))
	                        }
	                        a = b(a)
	                    }, a
	                }())
	            }, onMenuShareTimeline: function (a) {
	                d(p.onMenuShareTimeline, {
	                    complete: function () {
	                        c("shareTimeline", {
	                            title: a.title || s,
	                            desc: a.title || s,
	                            img_url: a.imgUrl || "",
	                            link: a.link || location.href,
	                            type: a.type || "link",
	                            data_url: a.dataUrl || ""
	                        }, a)
	                    }
	                }, a)
	            }, onMenuShareAppMessage: function (a) {
	                d(p.onMenuShareAppMessage, {
	                    complete: function () {
	                        c("sendAppMessage", {
	                            title: a.title || s,
	                            desc: a.desc || "",
	                            link: a.link || location.href,
	                            img_url: a.imgUrl || "",
	                            type: a.type || "link",
	                            data_url: a.dataUrl || ""
	                        }, a)
	                    }
	                }, a)
	            }, onMenuShareQQ: function (a) {
	                d(p.onMenuShareQQ, {
	                    complete: function () {
	                        c("shareQQ", {
	                            title: a.title || s,
	                            desc: a.desc || "",
	                            img_url: a.imgUrl || "",
	                            link: a.link || location.href
	                        }, a)
	                    }
	                }, a)
	            }, onMenuShareWeibo: function (a) {
	                d(p.onMenuShareWeibo, {
	                    complete: function () {
	                        c("shareWeiboApp", {
	                            title: a.title || s,
	                            desc: a.desc || "",
	                            img_url: a.imgUrl || "",
	                            link: a.link || location.href
	                        }, a)
	                    }
	                }, a)
	            }, onMenuShareQZone: function (a) {
	                d(p.onMenuShareQZone, {
	                    complete: function () {
	                        c("shareQZone", {
	                            title: a.title || s,
	                            desc: a.desc || "",
	                            img_url: a.imgUrl || "",
	                            link: a.link || location.href
	                        }, a)
	                    }
	                }, a)
	            }, startRecord: function (a) {
	                c("startRecord", {}, a)
	            }, stopRecord: function (a) {
	                c("stopRecord", {}, a)
	            }, onVoiceRecordEnd: function (a) {
	                d("onVoiceRecordEnd", a)
	            }, playVoice: function (a) {
	                c("playVoice", {localId: a.localId}, a)
	            }, pauseVoice: function (a) {
	                c("pauseVoice", {localId: a.localId}, a)
	            }, stopVoice: function (a) {
	                c("stopVoice", {localId: a.localId}, a)
	            }, onVoicePlayEnd: function (a) {
	                d("onVoicePlayEnd", a)
	            }, uploadVoice: function (a) {
	                c("uploadVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
	            }, downloadVoice: function (a) {
	                c("downloadVoice", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
	            }, translateVoice: function (a) {
	                c("translateVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
	            }, chooseImage: function (a) {
	                c("chooseImage", {
	                    scene: "1|2",
	                    count: a.count || 9,
	                    sizeType: a.sizeType || ["original", "compressed"],
	                    sourceType: a.sourceType || ["album", "camera"]
	                }, function () {
	                    return a._complete = function (a) {
	                        if (y) {
	                            var b = a.localIds;
	                            b && (a.localIds = JSON.parse(b))
	                        }
	                    }, a
	                }())
	            }, getLocation: function (a) {
	            }, previewImage: function (a) {
	                c(p.previewImage, {current: a.current, urls: a.urls}, a)
	            }, uploadImage: function (a) {
	                c("uploadImage", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
	            }, downloadImage: function (a) {
	                c("downloadImage", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a)
	            }, getLocalImgData: function (a) {
	                G === !1 ? (G = !0, c("getLocalImgData", {localId: a.localId}, function () {
	                    return a._complete = function (a) {
	                        if (G = !1, H.length > 0) {
	                            var b = H.shift();
	                            wx.getLocalImgData(b)
	                        }
	                    }, a
	                }())) : H.push(a)
	            }, getNetworkType: function (a) {
	                var b = function (a) {
	                    var b = a.errMsg;
	                    a.errMsg = "getNetworkType:ok";
	                    var c = a.subtype;
	                    if (delete a.subtype, c)a.networkType = c; else {
	                        var d = b.indexOf(":"), e = b.substring(d + 1);
	                        switch (e) {
	                            case"wifi":
	                            case"edge":
	                            case"wwan":
	                                a.networkType = e;
	                                break;
	                            default:
	                                a.errMsg = "getNetworkType:fail"
	                        }
	                    }
	                    return a
	                };
	                c("getNetworkType", {}, function () {
	                    return a._complete = function (a) {
	                        a = b(a)
	                    }, a
	                }())
	            }, openLocation: function (a) {
	                c("openLocation", {
	                    latitude: a.latitude,
	                    longitude: a.longitude,
	                    name: a.name || "",
	                    address: a.address || "",
	                    scale: a.scale || 28,
	                    infoUrl: a.infoUrl || ""
	                }, a)
	            }, getLocation: function (a) {
	                a = a || {}, c(p.getLocation, {type: a.type || "wgs84"}, function () {
	                    return a._complete = function (a) {
	                        delete a.type
	                    }, a
	                }())
	            }, hideOptionMenu: function (a) {
	                c("hideOptionMenu", {}, a)
	            }, showOptionMenu: function (a) {
	                c("showOptionMenu", {}, a)
	            }, closeWindow: function (a) {
	                a = a || {}, c("closeWindow", {}, a)
	            }, hideMenuItems: function (a) {
	                c("hideMenuItems", {menuList: a.menuList}, a)
	            }, showMenuItems: function (a) {
	                c("showMenuItems", {menuList: a.menuList}, a)
	            }, hideAllNonBaseMenuItem: function (a) {
	                c("hideAllNonBaseMenuItem", {}, a)
	            }, showAllNonBaseMenuItem: function (a) {
	                c("showAllNonBaseMenuItem", {}, a)
	            }, scanQRCode: function (a) {
	                a = a || {}, c("scanQRCode", {
	                    needResult: a.needResult || 0,
	                    scanType: a.scanType || ["qrCode", "barCode"]
	                }, function () {
	                    return a._complete = function (a) {
	                        if (z) {
	                            var b = a.resultStr;
	                            if (b) {
	                                var c = JSON.parse(b);
	                                a.resultStr = c && c.scan_code && c.scan_code.scan_result
	                            }
	                        }
	                    }, a
	                }())
	            }, openAddress: function (a) {
	                c(p.openAddress, {}, function () {
	                    return a._complete = function (a) {
	                        a = g(a)
	                    }, a
	                }())
	            }, openProductSpecificView: function (a) {
	                c(p.openProductSpecificView, {pid: a.productId, view_type: a.viewType || 0, ext_info: a.extInfo}, a)
	            }, addCard: function (a) {
	                for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) {
	                    var g = b[e], h = {card_id: g.cardId, card_ext: g.cardExt};
	                    d.push(h)
	                }
	                c(p.addCard, {card_list: d}, function () {
	                    return a._complete = function (a) {
	                        var b = a.card_list;
	                        if (b) {
	                            b = JSON.parse(b);
	                            for (var c = 0, d = b.length; d > c; ++c) {
	                                var e = b[c];
	                                e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ
	                            }
	                            a.cardList = b, delete a.card_list
	                        }
	                    }, a
	                }())
	            }, chooseCard: function (a) {
	                c("chooseCard", {
	                    app_id: D.appId,
	                    location_id: a.shopId || "",
	                    sign_type: a.signType || "SHA1",
	                    card_id: a.cardId || "",
	                    card_type: a.cardType || "",
	                    card_sign: a.cardSign,
	                    time_stamp: a.timestamp + "",
	                    nonce_str: a.nonceStr
	                }, function () {
	                    return a._complete = function (a) {
	                        a.cardList = a.choose_card_info, delete a.choose_card_info
	                    }, a
	                }())
	            }, openCard: function (a) {
	                for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) {
	                    var g = b[e], h = {card_id: g.cardId, code: g.code};
	                    d.push(h)
	                }
	                c(p.openCard, {card_list: d}, a)
	            }, consumeAndShareCard: function (a) {
	                c(p.consumeAndShareCard, {consumedCardId: a.cardId, consumedCode: a.code}, a)
	            }, chooseWXPay: function (a) {
	                c(p.chooseWXPay, f(a), a)
	            }, openEnterpriseRedPacket: function (a) {
	                c(p.openEnterpriseRedPacket, f(a), a)
	            }, startSearchBeacons: function (a) {
	                c(p.startSearchBeacons, {ticket: a.ticket}, a)
	            }, stopSearchBeacons: function (a) {
	                c(p.stopSearchBeacons, {}, a)
	            }, onSearchBeacons: function (a) {
	                d(p.onSearchBeacons, a)
	            }, openEnterpriseChat: function (a) {
	                c("openEnterpriseChat", {useridlist: a.userIds, chatname: a.groupName}, a)
	            }
	        }, J = 1, K = {};
	        return r.addEventListener("error", function (a) {
	            if (!y) {
	                var b = a.target, c = b.tagName, d = b.src;
	                if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
	                    var e = -1 != d.indexOf("wxlocalresource://");
	                    if (e) {
	                        a.preventDefault(), a.stopPropagation();
	                        var f = b["wx-id"];
	                        if (f || (f = J++, b["wx-id"] = f), K[f])return;
	                        K[f] = !0, wx.getLocalImgData({
	                            localId: d, success: function (a) {
	                                b.src = a.localData
	                            }
	                        })
	                    }
	                }
	            }
	        }, !0), r.addEventListener("load", function (a) {
	            if (!y) {
	                var b = a.target, c = b.tagName;
	                b.src;
	                if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
	                    var d = b["wx-id"];
	                    d && (K[d] = !1)
	                }
	            }
	        }, !0), b && (a.wx = a.jWeixin = I), I
	    }
	});

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	'use strict';

	var PROD_HOST_LIST = ['als.cdn.lifeapp.pingan.com.cn', 'gray1-als.cdn.lifeapp.pingan.com.cn', 'mili-shop.lifeapp.pingan.com.cn', 'elis-ecocdn.pingan.com.cn'];
	var Util = {
	    env: function env() {
	        if (PROD_HOST_LIST.indexOf(window.location.host) >= 0) {
	            return 'prod';
	        }
	        return 'test';
	    },
	    isInWeiXin: function isInWeiXin() {
	        return !!window.navigator.userAgent.match(/MicroMessenger/i);
	    },
	    getUrlParams: function getUrlParams() {
	        var urlParams = window.location.search ? window.location.search.substring(1).split('&') : [];
	        var result = {};
	        urlParams.forEach(function (urlParam) {
	            var urlParamArr = urlParam.split('=');
	            result[urlParamArr[0]] = decodeURIComponent(urlParamArr[1]);
	        });
	        return result;
	    },
	    updateQueryStringParameter: function updateQueryStringParameter(uri, key, value) {
	        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
	        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
	        if (uri.match(re)) {
	            return uri.replace(re, '$1' + key + '=' + value + '$2');
	        }
	        return '' + uri + separator + key + '=' + value;
	    },
	    updateLinkQuery: function updateLinkQuery(arr) {
	        var opt = arr;
	        opt.link = opt.link || window.location.href;
	        var params = Util.getUrlParams();
	        var keys = ['s_sign', 's_uid', 's_no', 's_pid', 's_id'];

	        var classify = function classify(key) {
	            var val = void 0;
	            switch (key) {
	                case 's_no':
	                    {
	                        var no = parseInt(params.s_no, 10);
	                        if (!isNaN(no)) {
	                            val = no + 1;
	                        }
	                        break;
	                    }

	                case 's_pid':
	                    if (params.s_pid) {
	                        val = params.s_id;
	                    }
	                    break;

	                case 's_id':
	                    {
	                        var openId = PALifeWX.getOpenId();
	                        if (openId) {
	                            val = openId;
	                        }
	                        break;
	                    }

	                default:
	                    if (params[key]) {
	                        val = params[key];
	                    }
	                    break;
	            }
	            return val;
	        };
	        if (params.s_sign && params.s_uid) {
	            keys.map(function (key) {
	                var val = classify(key);
	                if (typeof val !== 'undefined') {
	                    opt.link = Util.updateQueryStringParameter(opt.link, key, val);
	                }
	                return true;
	            });
	        }
	    }
	};
	module.exports = Util;

/***/ })
/******/ ])
});
;