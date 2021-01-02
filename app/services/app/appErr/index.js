
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
			`App service error - ${name}\n` +
			`Message:  ${message}\n` +
			varsString
		)
	},
	...vars,
})

module.exports = { APP_SERV_ERR, appErr } 
