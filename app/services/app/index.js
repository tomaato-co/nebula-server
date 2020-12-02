const fs = require('fs-extra')
const path = require('path')
const { mapInSequence } = require('../../util/asyncOps')
const replaceVars = require('../../util/replaceVars')
const run = require('../../util/run')
const serviceErr = require('../../util/serviceErr')

//

const APP_SERV_ERR = {
	// Client Err
	ALREADY_EXISTS: 'ALREADY_EXISTS',
	DOES_NOT_EXIST: 'DOES_NOT_EXIST',
	// Server Err
	IO_ERROR: 'IO_ERROR',
	TEMPLATE_PROCESSING_FAILED: 'TEMPLATE_PROCESSING_FAILED',
	DOCKER_COMPOSE_FAILED: 'DOCKER_COMPOSE_FAILED',
	DOCKER_STOP_FAILED: 'DOCKER_STOP_FAILED',
	DOCKER_REMOVE_FAILED: 'DOCKER_REMOVE_FAILED',
}

const appErr = ({name, message, ...vars}) => serviceErr({
	service: 'App',
	name, 
	message, 
	toString: () => {
		let varsString = ""
		for (const key in vars) {
			const val = vars[key]
			varsString = varsString + (
				`  ${key}=${val}`
			)
		}
		return (
			`${service} service error - ${name}\n` +
			`Message:  ${message}\n` +
			varsString
		)
	},
	...vars,
})

//

const createApp = async (appName) => {
	// Ensure app does not exist.
	const appNames = await readApps()
	if (appNames.includes(appName)) {
		throw appErr({
			name: APP_SERV_ERR.ALREADY_EXISTS,
			message: 'App with given name already exists.',
			appName
		})
	}

	const templatePath = './templates/app'
	const appPath = `./apps/${appName}`

	// Copy template to './apps'
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
			console.error(err)
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
}

const readApps = async () => {
	// Read filenames under apps folder.
	const getFilenames = async () => {
		try {
			await fs.readdir('./apps')
		} catch (err) {
			console.error(err.message)
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not read files in apps folder.'
			})
		}	
	}
	const filenames = await getFilenames()

	// Filter filenames to only those that are folders.
	const getFolders = () => {
		try {
			const allFilesInfo = await mapInSequence(
				filenames, 
				(filename) => {
					const filepath = path.join('./apps', filename)
					const stat = await fs.stat(filepath)
					return { filename, stat }
				}
			)
			const foldersInfo = allFilesInfo.filter(
				({ stat }) => stat.isDirectory()
			)
			const folders = foldersInfo.map(
				({ filename }) => filename
			)
			return folders
		} catch (err) {
			throw appErr({
				name: APP_SERV_ERR.IO_ERROR,
				message: 'Could not filter folders within apps folder.'
			})
		}
	}
	const folders = getFolders()

	// Return folder names as app names.
	const appNames = folders
	return appNames
}

const updateApp = async (appName, newName) => {

}

const deleteApp = async (appName) => {
	// CHeck app exists.
	const appNames = await readApps()
	if (!appNames.includes(appName)) {
		throw appErr({
			name: APP_SERV_ERR.DOES_NOT_EXIST,
			message: 'App does not exist.',
			appName
		})
	}

	// Stop docker container.
	try {
		await run(`docker stop ${appName}`)
	} catch (err) {
		console.error(err.message)
		throw appErr({
			name: APP_SERV_ERR.DOCKER_STOP_FAILED,
			message: 'Could not stop docker container.',
			appName
		})
	}

	// Delete docker container.
	try {
		await run(`docker rm ${appName}`)
	} catch (err) {
		console.error(err.message)
		throw appErr({
			name: APP_SERV_ERR.DOCKER_REMOVE_FAILED,
			message: 'Could not remove docker container.',
			appName
		})
	}

	// Delete app folder.
	try {
		await fs.remove(`./apps/${appName}`)
	} catch (err) {
		console.error(err.message)
		throw appErr({
			name: APP_SERV_ERR.IO_ERROR,
			message: 'Could not remove app folder',
			appName
		})
	}
}

module.exports = {
	APP_SERV_ERR,
	createApp,
	readApps,
	deleteApp
}
