'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var isCapitalized = function isCapitalized(s) {
	var c = s[0];
	return c === c.toUpperCase();
};

var attributeToProperty = function attributeToProperty(attr) {
	if (t.isJSXSpreadAttribute(attr)) {
		return t.spreadProperty(attr.argument);
	} else {
		var name = attr.name.name,
		    value = attr.value;

		return t.objectProperty(t.stringLiteral(name), t.isJSXExpressionContainer(value) ? value.expression : value);
	}
};

var metaToProps = function metaToProps(meta) {
	return meta.map(attributeToProperty);
};

var jsxExpression = function jsxExpression(x, callee) {
	return t.isJSXExpressionContainer(x) || t.is('JSXSpreadChild', x) ? x.expression : transformJSX(x, callee);
};

var childrenToNodes = function childrenToNodes(children, callee) {
	return t.arrayExpression(children.map(function (c) {
		return jsxExpression(c, callee);
	}));
};

/* children as prop API
const makeHnode = (label, meta, children, callee) => {
	let labelArg = t.identifier(label)

	let metaList = metaToProps(meta)

	if (children.length > 0) {
		let childrenArg = childrenToNodes(children, callee)
		metaList.push(t.objectProperty(t.stringLiteral('children'), childrenArg))
	}

	let metaArg = t.objectExpression(metaList)

	return t.callExpression(callee, [labelArg, metaArg])
}
*/

var makeHnode = function makeHnode(label, meta, children, callee) {
	var labelArg = t.identifier(label);

	var metaArg = t.objectExpression(metaToProps(meta));

	var childrenArg = childrenToNodes(children, callee);

	return t.callExpression(callee, [labelArg, metaArg, childrenArg]);
};

var makeFnode = function makeFnode(label, meta, children, callee) {
	var labelArg = t.stringLiteral(label);

	var metaArg = t.objectExpression(metaToProps(meta));

	var childrenArg = childrenToNodes(children, callee);

	return t.callExpression(callee, [labelArg, metaArg, childrenArg]);
};

var transformJSX = function transformJSX(node, callee) {
	if (t.isJSXText(node)) {
		return t.stringLiteral(node.value);
	} else {
		return transformJSXElement(node, callee);
	}
};

var transformJSXElement = function transformJSXElement(node, callee) {
	var jsxOpen = node.openingElement;
	var jsxId = jsxOpen.name;
	var label = jsxId.name;

	if (isCapitalized(label)) {
		return makeHnode(label, jsxOpen.attributes, node.children, callee);
	} else {
		return makeFnode(label, jsxOpen.attributes, node.children, callee);
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
				state.set('callee', function () {
					return stringToIdentifierExpression(state.opts.pragma || 'v');
				});
			},
			JSXElement: function JSXElement(path, file) {
				var callee = file.get('callee')();

				path.replaceWith(transformJSXElement(path.node, callee));
			}
		}
	};
};

exports.default = plugin;