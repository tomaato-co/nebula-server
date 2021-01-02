const fs = require('fs-extra')
const run = require('../../../util/run')
const appErr = require('../appErr')

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

module.exports = deleteApp