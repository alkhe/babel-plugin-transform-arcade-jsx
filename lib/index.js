'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var isCapitalized = function isCapitalized(s) {
	var c = s[0];
	return c === c.toUpperCase();
};

var metaToProps = function metaToProps(meta) {
	return meta.map(function (prop) {
		var value = prop.value;

		value = t.isJSXExpressionContainer(value) ? value.expression : value;
		return t.objectProperty(t.stringLiteral(prop.name.name), value);
	});
};

var makeHnode = function makeHnode(label, meta, children, callees) {
	var labelArg = t.identifier(label);

	var metaList = metaToProps(meta);

	if (children.length > 0) {
		var childrenArg = t.arrayExpression(children.map(transformJSX));
		metaList.push(t.objectProperty(t.stringLiteral('children'), childrenArg));
	}

	var metaArg = t.objectExpression(metaList);

	return t.callExpression(callees[0], [labelArg, metaArg]);
};

var makeFnode = function makeFnode(label, meta, children, callees) {
	var labelArg = t.stringLiteral(label);

	var metaArg = t.objectExpression(metaToProps(meta));

	var childrenArg = t.arrayExpression(children.map(function (c) {
		return transformJSX(c, callees);
	}));

	return t.callExpression(callees[1], [labelArg, metaArg, childrenArg]);
};

var transformJSX = function transformJSX(node, callees) {
	if (t.isJSXText(node)) {
		return t.stringLiteral(node.value);
	} else {
		return transformJSXElement(node, callees);
	}
};

var transformJSXElement = function transformJSXElement(node, callees) {
	var jsxOpen = node.openingElement;
	var jsxId = jsxOpen.name;
	var label = jsxId.name;

	if (isCapitalized(label)) {
		return makeHnode(label, jsxOpen.attributes, node.children, callees);
	} else {
		return makeFnode(label, jsxOpen.attributes, node.children, callees);
	}
};

var stringToIdentifierExpression = function stringToIdentifierExpression(s) {
	return s.split('.').map(function (name) {
		return t.identifier(name);
	}).reduce(function (object, property) {
		return t.memberExpression(object, property);
	});
};

var plugin = function plugin() {
	return {
		visitor: {
			Program: function Program(_, state) {
				var _ref = state.opts.pragma || [],
				    _ref2 = _slicedToArray(_ref, 2),
				    _ref2$ = _ref2[0],
				    hnodeId = _ref2$ === undefined ? 'hnode' : _ref2$,
				    _ref2$2 = _ref2[1],
				    fnodeId = _ref2$2 === undefined ? 'fnode' : _ref2$2;

				state.set('hnodeId', function () {
					return stringToIdentifierExpression(hnodeId);
				});
				state.set('fnodeId', function () {
					return stringToIdentifierExpression(fnodeId);
				});
			},
			JSXElement: function JSXElement(path, file) {
				var hnodeId = file.get('hnodeId')();
				var fnodeId = file.get('fnodeId')();

				path.replaceWith(transformJSXElement(path.node, [hnodeId, fnodeId]));
			}
		}
	};
};

exports.default = plugin;