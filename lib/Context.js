'use babel'

import {parse} from 'babylon'
import traverse from 'babel-traverse'
import debug from 'debug'
const d = debug('js-refactor')

export default class Context {
	setCode(code, options) {
		this._ast = parse(code, options)
	}
	identify(loc) {
		d('identify', loc)
		let binding
		traverse(this._ast, {
			exit(path) {
				const {start, end, name} = path.node
				if (isRefId(path) && loc >= start && loc <= end) {
					binding = path.scope.getBinding(name)
					this.stop()
					console.log({start})
				}
			}
		})
		if (binding) return binding
	}
}

function isRefId(path) {
	if (path.isReferencedIdentifier()) return true
	if (!path.isIdentifier()) return false
	const p = path.parentPath
	if (p.isImportDefaultSpecifier() || p.isImportNamespaceSpecifier()) return true
	if (p.isImportSpecifier() && p.node.local === path.node) return true
	return false
}
