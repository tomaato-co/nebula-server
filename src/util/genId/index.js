
/**
 * Creates a five character random ID.
 */
const genId = () => {
	const random = Math.random()
	const randomString = random.toString(36).substr(2)
	const alphaNumeric = randomString.replace(/[^0-z]+/g, '')
	const fiveCharacters = alphaNumeric.substr(0, 5)
	const id = fiveCharacters
	return id
}

module.exports = genId
