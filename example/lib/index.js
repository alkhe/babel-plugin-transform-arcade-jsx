"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
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

exports.default = a;