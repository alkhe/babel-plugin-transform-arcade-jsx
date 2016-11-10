import * as t from 'babel-types'

const isCapitalized = s => {
	let c = s[0]
	return c === c.toUpperCase()
}

const attributeToProperty = attr => {
	if (t.isJSXSpreadAttribute(attr)) {
		return t.spreadProperty(attr.argument)
	} else {
		let { name: { name }, value } = attr
		return t.objectProperty(
			t.stringLiteral(name),
			t.isJSXExpressionContainer(value) ? value.expression : value
		)
	}
}

const metaToProps = meta => meta.map(attributeToProperty)

const jsxExpression = (x, callee) => t.isJSXExpressionContainer(x) || t.is('JSXSpreadChild', x) ? x.expression : transformJSX(x, callee)

const childrenToNodes = (children, callee) => t.arrayExpression(children.map(c => jsxExpression(c, callee)))

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

const makeHnode = (label, meta, children, callee) => {
	let labelArg = t.identifier(label)

	let metaArg = t.objectExpression(metaToProps(meta))

	let childrenArg = childrenToNodes(children, callee)

	return t.callExpression(callee, [labelArg, metaArg, childrenArg])
}

const makeFnode = (label, meta, children, callee) => {
	let labelArg = t.stringLiteral(label)

	let metaArg = t.objectExpression(metaToProps(meta))

	let childrenArg = childrenToNodes(children, callee)

	return t.callExpression(callee, [labelArg, metaArg, childrenArg])
}

const transformJSX = (node, callee) => {
	if (t.isJSXText(node)) {
		return t.stringLiteral(node.value)
	} else {
		return transformJSXElement(node, callee)
	}
}

const transformJSXElement = (node, callee) => {
	let jsxOpen = node.openingElement
	let jsxId = jsxOpen.name
	let label = jsxId.name

	if (isCapitalized(label)) {
		return makeHnode(label, jsxOpen.attributes, node.children, callee)
	} else {
		return makeFnode(label, jsxOpen.attributes, node.children, callee)
	}
}

const stringToIdentifierExpression = s => s
	.split('.')
	.map(name => t.identifier(name))
	.reduce((object, property) => t.memberExpression(object, property))

const plugin = () => {
	return {
		visitor: {
			Program: (_, state) => {
				state.set('callee', () => stringToIdentifierExpression(state.opts.pragma || 'v'))
			},
			JSXElement: (path, file) => {
				let callee = file.get('callee')()

				path.replaceWith(transformJSXElement(path.node, callee))
			}
		}
	}
}

export default plugin
