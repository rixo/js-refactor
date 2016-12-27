'use babel'

export function lines(text) {
	return text.split(/\n/).map(l => l.length + 1)
}
