
const replaceVars = (text, properties) => {
	const interpolator = /\$\{(.+?)\}/g
	const replaceVarsIter = (interText = text) => {
		const nextText = interText.replace(
			interpolator,
			(symbol, identifier) => properties[identifier]
		)
		if (nextText === interText) {
			return interText
		}
		return replaceVarsIter(nextText)
	}
	return replaceVarsIter()
}

module.exports = replaceVars
