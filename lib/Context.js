'use babel'

import {parse}	from 'babylon'
import traverse	from 'babel-traverse'
import * as t from 'babel-types'
import debug	from './debug'
const d = debug('js-refactor:context')

export default class Context {
	setCode(code, options) {
		this._ast = parse(code, options)
	}
	identify(loc) {
		d('identify', loc)
		const touches = path => {
			const {start, end} = path.node
			if (end < loc) {
				path.skip()
			} else if (start > loc) {
				path.stop()
			} else {
				return true
			}
		}
		// https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md
		const visitors = {
			Identifier(path) {
				if (touches(path)) {
					const {scope, node, node:{name}} = path
					const scopeBinding = scope.getBinding(name)
					if (
						scopeBinding && (
							scopeBinding.identifier === node
							|| scopeBinding.referencePaths.some(({node: ref}) => ref === node)
							|| scopeBinding.constantViolations.some(({node: {left: ref}}) => ref === node)
						)
					) {
						binding = scopeBinding
						path.stop()
					}
				}
			},
		}
		let binding
		traverse(this._ast, visitors)
		if (!binding) d('global?')
		return binding
	}
}

function test(path) {
	if (path.isReferencedIdentifier()) return true
	if (path.isBindingIdentifier()) return true

	// for import, do not need now
	// const p = path.parentPath
	// if (p.isImportSpecifier()) return path.node === p.node.local

	// for Method/ArrowFunction, seems babel's bug
	if (path.isIdentifier()) {
		const binding = path.scope.getBinding(path.node.name)
		if (binding && binding.identifier === path.node) {
			d('babel bug', path)
			return true
		}
	}

	// d('WTF', path,
	// 	path.isIdentifier(),
	// 	path.isReferencedIdentifier(),
	// 	path.isBindingIdentifier(),
	// 	path.isImportSpecifier(),
	// 	path.isFunction(),
	// 	path.scope.getBinding(path.node.name)
	// )
	return false
}
