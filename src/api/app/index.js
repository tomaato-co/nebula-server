const AppService = require('../../services/app')
const { handleAppApiError } = require('./handleErr')

//

const postApp = async (req, res, next) => {
	try {
		const { appId } = req.params
		await AppService.createApp(appId)
		res.status(201).send()
	} catch (err) {
		const { appId } = req.params
		handleAppApiError({err, method: 'post', res, appId})
	}
}

const getApps = async (req, res, next) => {
	try {
		const appNames = await AppService.readApps()
		res.status(200).json({appNames})
	} catch (err) {
		handleAppApiError({err, method: 'get', res})
	}
}

const deleteApp = async (req, res, next) => {
	try {
		const { appId } = req.params
		await AppService.deleteApp(appId)
		res.status(204).send()
	} catch (err) {
		const { appId } = req.params
		handleAppApiError({err, method: 'delete', res, appId})
	}
}

////

const serveAppApi = (router) => {
	router.post('/api/app/:appId', postApp)
	router.get('/api/apps', getApps)
	router.delete('/api/app/:appId', deleteApp)
}

module.exports = serveAppApi
