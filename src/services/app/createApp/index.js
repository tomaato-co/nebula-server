const fs = require('fs-extra')
const path = require('path')
const run = require('../../../util/run')
const appErr = require('../appErr')
const replaceVars = require('../../../util/replaceVars')

const createApp = async (appName) => {
	// Log
	console.log(`Creating app '${appName}'...`)

	// Ensure app does not exist.
	const appNames = await readApps()
	if (appNames.includes(appName)) {
		throw appErr({
			name: APP_SERV_ERR.ALREADY_EXISTS,
			message: 'App with given name already exists.',
			appName
		})
	}

	// Copy template to './apps'
	const templatePath = './templates/app'
	const appPath = `./apps/${appName}`
	try {
		await fs.copy(templatePath, appPath)
	} catch (err) {
		console.error(err.message)
		throw appErr({
			name: APP_SERV_ERR.IO_ERROR,
			message: 'Copying of app template folder failed.',
			appName,
			templatePath,
			appPath
		})
	}

	// Read docker-compose.templ.yml
	const dcompTemplPath = path.join(appPath, 'docker-compose.templ.yml')
	const getDcompTemplate = async () => {
		try {
			return (await fs.readFile(dcompTemplPath)).toString()
		} catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not read docker-compose template.',
				appName,
				dcompTemplPath
			})
		}
	}
	const dcompTemplate = await getDcompTemplate()

	// Read HTML template.
	const htmlTemplPath = path.join(appPath, 'public', 'index.templ.html')
	const getHtmlTemplate = async () => {
		try {
			return (await fs.readFile(htmlTemplPath)).toString()
		} catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not read HTML template.',
				appName,
				htmlTemplPath
			})
		}
	}
	const htmlTemplate = await getHtmlTemplate()

	// Replace template variables with values.
	const properties = {
		appName
	}

	// - 1. docker-compose.templ.yml
	const processDcompTemplate = () => {
		try { return replaceVars(dcompTemplate, properties) }
		catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.TEMPLATE_PROCESSING_FAILED,
				message: 'Could not process docker-compose template.',
				appName
			})
		}
	}
	const dcompContent = processDcompTemplate()
	
	// - 2. index.templ.html
	const processHtmlTemplate = () => {
		try { return replaceVars(htmlTemplate, properties) }
		catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.TEMPLATE_PROCESSING_FAILED,
				message: 'Could not process HTML template.',
				appName
			})
		}
	}
	const htmlContent = processHtmlTemplate()

	// Write docker-compose.yml
	const writeDcompFile = async () => {
		try {
			const dcompPath = path.join(appPath, 'docker-compose.yml')
			await fs.writeFile(dcompPath, dcompContent)
		} catch (err) {
			console.error(err)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not write docker-compose file',
				appName,
				dcompPath
			})
		}
	}
	await writeDcompFile()

	// Delete docker-compose.templ.yml
	const removeDcompTempl = async () => {
		try { await fs.remove(dcompTemplPath) }
		catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not remove docker-compose template.',
				appName,
				dcompTemplPath
			})
		}
	}
	await removeDcompTempl()
	

	// Write index.html
	const writeHtmlFile = async () => {
		try {
			const htmlPath = path.join(appPath, 'public', 'index.html')
			await fs.writeFile(htmlPath, htmlContent)
		} catch (err) {
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not write HTML file.',
				appName,
				htmlPath
			})
		}
	}
	await writeHtmlFile()

	// Delete index.templ.html
	const removeHtmlTempl = async () => {
		try { await fs.remove(htmlTemplPath) }
		catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not remove HTML template.',
				appName,
				htmlTemplPath
			})
		}
	}
	await removeHtmlTempl()

	// Run 'docker-compose up -d' to create & start app.
	const createContainer = async () => {
		try {
			await run('docker-compose up -d', { cwd: appPath })
		} catch (err) {
			console.error(err)
			throw appErr({
				name: APP_SERV_ERR.DOCKER_COMPOSE_FAILED, 
				message: 'Could not create & run docker container.',
				appName,
				appPath
			})
		}
	} 
	await createContainer()
	console.log(`App creation complete. [${appName}]`)
}

module.exports = createApp
