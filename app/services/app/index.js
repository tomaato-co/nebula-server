const fs = require('fs-extra')
const path = require('path')
const replaceVars = require('../../util/replaceVars')
const run = require('../../util/run')

const createApp = async (appName) => {
	const templatePath = './templates/app'
	const appPath = `./apps/${appName}`

	// Copy template to './apps'
	await fs.copy(templatePath, appPath)

	// Read docker-compose.templ.yml
	const dcompTemplPath = path.join(appPath, 'docker-compose.templ.yml')
	const dcompTemplate = (await fs.readFile(dcompTemplPath)).toString()

	// Read HTML template.
	const htmlTemplPath = path.join(appPath, 'public', 'index.templ.html')
	const htmlTemplate = (await fs.readFile(htmlTemplPath)).toString()

	// Replace template variables with values.
	const properties = {
		appName
	}

	// - 1. docker-compose.templ.yml
	const dcompContent = replaceVars(dcompTemplate, properties)
	
	// - 2. index.templ.html
	const htmlContent = replaceVars(htmlTemplate, properties)

	// Write docker-compose.yml
	const dcompPath = path.join(appPath, 'docker-compose.yml')
	await fs.writeFile(dcompPath, dcompContent)

	// Delete docker-compose.templ.yml
	await fs.remove(dcompTemplPath)

	// Write index.html
	const htmlPath = path.join(appPath, 'public', 'index.html')
	await fs.writeFile(htmlPath, htmlContent)

	// Delete index.templ.html
	await fs.remove(htmlTemplPath)

	// Run 'docker-compose up -d' to create & start app.
	await run('docker-compose up -d', { cwd: appPath })
}

module.exports = {createApp}

