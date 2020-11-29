const fs = require('fs-extra')
const path = require('path')
const run = require('../../util/run')

const createStaticSite = async (sitename) => {
	const templatePath = './templates/static-site'
	const sitePath = `./sites/static/${sitename}`

	// Copy template to './sites/static'
	await fs.copy(templatePath, sitePath)

	// Rename '_docker-compose.yml' -> 'docker-compose.yml'
	const oldDcompPath = path.join(sitePath, '_docker-compase.yml')
	const newDcompPath = path.join(sitePath, 'docker-compose.yml')
	await fs.rename(oldDcompPath, newDcompPath)

	// Run 'docker-compose up -d'
	await run('docker-compose up -d')
}

module.exports = {createStaticSite}

