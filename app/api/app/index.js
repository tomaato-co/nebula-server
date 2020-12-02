const { 
	APP_SERV_ERR,
	createApp, 
	readApps, 
	deleteApp: deleteAppOperation 
} = require('../../services/app')

//

const APP_API_ERR = {
	// Client Err
	ALREADY_EXISTS: 'ALREADY_EXISTS',
	DOES_NOT_EXIST: 'DOES_NOT_EXIST',
	// Server Err
	APP_CREATION_FAILED: 'APP_CREATION_FAILED',
	APP_START_FAILED: 'APP_START_FAILED',
	APP_LOOKUP_FAILED: 'APP_LOOKUP_FAILED',
	APP_STOP_FAILED: 'APP_STOP_FAILED',
	APP_REMOVAL_FAILED: 'APP_REMOVAL_FAILED',
}

const handleErr = ({err, method, res, appName}) => {
	console.error(err.toString())
	switch (err.name) {
		// CLIENT ERRORS
		case APP_SERV_ERR.ALREADY_EXISTS: 
			res.status(409).json({
				err: {
					reason: APP_API_ERR.ALREADY_EXISTS,
					message: (
						`App with name '${appName}' already exists.`
					)
				}
			})
			break
		case APP_SERV_ERR.DOES_NOT_EXIST:
			res.status(404).json({
				err: {
					reason: APP_API_ERR.DOES_NOT_EXIST,
					message: (
						`App with name '${appName}' does not exist.`
					)
				}
			})
			break
		// SERVER ERRORS
		case APP_SERV_ERR.IO_ERROR: 
			const reasons = {
				post: APP_API_ERR.APP_CREATION_FAILED,
				get: APP_API_ERR.APP_LOOKUP_FAILED,
				delete: APP_API_ERR.APP_REMOVAL_FAILED,
			}
			res.status(500).json({
				err: {
					reason: reasons[method],
					message: 'IO error occured.'
				}
			})
			break
		case APP_SERV_ERR.TEMPLATE_PROCESSING_FAILED:
			res.status(500).json({
				err: {
					reason: APP_API_ERR.APP_CREATION_FAILED,
					message: 'Template processing failed.'
				}
			})
			break
		case APP_SERV_ERR.DOCKER_COMPOSE_FAILED:
			res.status(500).json({
				err: {
					reason: APP_API_ERR.APP_START_FAILED,
					message: 'Container could not start.'
				}
			})
			break
		case APP_SERV_ERR.DOCKER_STOP_FAILED:
			res.status(500).json({
				err: {
					reason: APP_API_ERR.APP_STOP_FAILED,
					message: 'Container failed to stop.'
				}
			})
			break
		case APP_SERV_ERR.DOCKER_REMOVE_FAILED:
			res.status(500).json({
				err: {
					reason: APP_API_ERR.APP_REMOVAL_FAILED,
					message: 'Failed to remove container.'
				}
			})
			break
	}
}

//

const postApp = async (req, res, next) => {
	try {
		const { appName } = req.params
		await createApp(appName)
		res.status(201).send()
	} catch (err) {
		const { appName } = req.params
		handleErr({err, method: 'post', res, appName})
	}
}

const getApps = async (req, res, next) => {
	try {
		const appNames = await readApps()
		res.status(200).json({appNames})
	} catch (err) {
		handleErr({err, method: 'get', res})
	}
}

const deleteApp = async (req, res, next) => {
	try {
		const { appName } = req.params
		await deleteAppOperation(appName)
		res.status(204).send()
	} catch (err) {
		const { appName } = req.params
		handleErr({err, method: 'delete', res, appName})
	}
}

//

const serveAppApi = (router) => {
	router.post('/api/app/:appName', postApp)
	router.get('/api/apps', getApps)
	router.delete('/api/apps', deleteApp)
}

module.exports = serveAppApi
