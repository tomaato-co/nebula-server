
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

const handleAppApiErr = ({err, method, res, appName}) => {
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

module.exports = { APP_API_ERR, handleAppApiErr }
