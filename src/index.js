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

const jsxExpression = (x, callees) => t.isJSXExpressionContainer(x) || t.is('JSXSpreadChild', x) ? x.expression : transformJSX(x, callees)

const childrenToNodes = (children, callees) => t.arrayExpression(children.map(c => jsxExpression(c, callees)))

const makeHnode = (label, meta, children, callees) => {
	let labelArg = t.identifier(label)

	let metaList = metaToProps(meta)

	if (children.length > 0) {
		let childrenArg = childrenToNodes(children, callees)
		metaList.push(t.objectProperty(t.stringLiteral('children'), childrenArg))
	}

	let metaArg = t.objectExpression(metaList)

	return t.callExpression(callees[0], [labelArg, metaArg])
}

const makeFnode = (label, meta, children, callees) => {
	let labelArg = t.stringLiteral(label)

	let metaArg = t.objectExpression(metaToProps(meta))

	let childrenArg = childrenToNodes(children, callees)

	return t.callExpression(callees[1], [labelArg, metaArg, childrenArg])
}

const transformJSX = (node, callees) => {
	if (t.isJSXText(node)) {
		return t.stringLiteral(node.value)
	} else {
		return transformJSXElement(node, callees)
	}
}

const transformJSXElement = (node, callees) => {
	let jsxOpen = node.openingElement
	let jsxId = jsxOpen.name
	let label = jsxId.name

	if (isCapitalized(label)) {
		return makeHnode(label, jsxOpen.attributes, node.children, callees)
	} else {
		return makeFnode(label, jsxOpen.attributes, node.children, callees)
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
				let [hnodeId = 'hnode', fnodeId = 'fnode'] = state.opts.pragma || []

				state.set('hnodeId', () => stringToIdentifierExpression(hnodeId))
				state.set('fnodeId', () => stringToIdentifierExpression(fnodeId))
			},
			JSXElement: (path, file) => {
				let hnodeId = file.get('hnodeId')()
				let fnodeId = file.get('fnodeId')()

				path.replaceWith(transformJSXElement(path.node, [hnodeId, fnodeId]))
			}
		}
	}
}

export default plugin
