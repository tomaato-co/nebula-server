const fs = require('fs-extra')
const path = require('path')
const replaceVars = require('../../util/replaceVars')
const run = require('../../util/run')

const createStaticSite = async (sitename) => {
	const templatePath = './templates/static-site'
	const sitePath = `./sites/static/${sitename}`

	// Copy template to './sites/static'
	await fs.copy(templatePath, sitePath)

	// Read _docker-compose.yml (template)
	const dcompTempPath = path.join(sitePath, '_docker-compose.yml')
	const dcompTemplate = (await fs.readFile(dcompTempPath)).toString()

	// Read HTML template.
	const htmlPath = path.join(sitePath, 'public', 'index.html')
	const htmlTemplate = (await fs.readFile(htmlPath)).toString()

	// Replace template variables with values.
	const properties = {
		sitename
	}

	// - 1. docker-compose template.
	const dcompContent = replaceVars(dcompTemplate, properties)
	
	// - 2. index.html template.
	const htmlContent = replaceVars(htmlTemplate, properties)

	// Write docker-compose.yml
	const dcompPath = path.join(sitePath, 'docker-compose.yml')
	await fs.writeFile(dcompPath, dcompContent)

	// Delete _docker-compose.yml (template)
	await fs.remove(dcompTempPath)

	// Overwrite index.html
	await fs.writeFile(htmlPath, htmlContent)

	// Run 'docker-compose up -d'
	await run('docker-compose up -d', { cwd: sitePath })
}

module.exports = {createStaticSite}

