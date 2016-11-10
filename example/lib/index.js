"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var a = function a(x) {
	return x + 2;
};

var b = v("div", {
	"a": "5"
}, ["Hello!"]);

var b2 = v("div", {
	"a": "5"
}, ["\n\t\t", v("span", {}, ["Hello!"]), "\n\t"]);

var c = v("input", {}, []);

var d = v(Component, {
	"some-prop": "asd"
}, []);

var e = v(Component, {
	"some-prop": "asd"
}, ["asd"]);

var f = v(List, {
	"items": [1]
}, []);

var g = function g(_ref) {
	var items = _ref.items;
	return v("ol", {}, ["\n\t\t", items, "\n\t"]);
};

var h = v(Component, _extends({
	"a": "5"
}, props), []);

var i = v(Component, {
	"a": x
}, []);

var j = v(Component, {}, [props.children, props.after, [1, 2, 3]]);

exports.default = a;