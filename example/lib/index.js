'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var a = function a(x) {
  return x + 2;
};

var b = fnode(div, {
  'a': '5'
}, ['Hello!']);

var c = fnode(input, {}, []);

var d = hnode(Component, {
  'some-prop': 'asd'
});

var e = hnode(Component, {
  'some-prop': 'asd',
  'children': ['asd']
});

exports.default = a;