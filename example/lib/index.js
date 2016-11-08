"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var a = function a(x) {
	return x + 2;
};

var b = fnode("div", {
	"a": "5"
}, ["Hello!"]);

var b2 = fnode("div", {
	"a": "5"
}, ["\n\t\t", fnode("span", {}, ["Hello!"]), "\n\t"]);

var c = fnode("input", {}, []);

var d = hnode(Component, {
	"some-prop": "asd"
});

var e = hnode(Component, {
	"some-prop": "asd",
	"children": ["asd"]
});

var f = hnode(List, {
	"items": [1]
});

var g = function g(_ref) {
	var items = _ref.items;
	return fnode("ol", {}, ["\n\t\t", items, "\n\t"]);
};

var h = hnode(Component, _extends({
	"a": "5"
}, props));

var i = hnode(Component, {
	"a": x
});

var j = hnode(Component, {
	"children": [props.children, props.after, [1, 2, 3]]
});

exports.default = a;