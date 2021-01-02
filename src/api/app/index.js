const AppService = require('../../services/app')
const { handleAppApiErr } = require('./handleErr')

//

const postApp = async (req, res, next) => {
	try {
		const { appName } = req.params
		await AppService.createApp(appName)
		res.status(201).send()
	} catch (err) {
		const { appName } = req.params
		handleAppApiErr({err, method: 'post', res, appName})
	}
}

const getApps = async (req, res, next) => {
	try {
		const appNames = await AppService.readApps()
		res.status(200).json({appNames})
	} catch (err) {
		handleAppApiErr({err, method: 'get', res})
	}
}

const deleteApp = async (req, res, next) => {
	try {
		const { appName } = req.params
		await AppService.deleteApp(appName)
		res.status(204).send()
	} catch (err) {
		const { appName } = req.params
		handleAppApiErr({err, method: 'delete', res, appName})
	}
}

////

const serveAppApi = (router) => {
	router.post('/api/app/:appName', postApp)
	router.get('/api/apps', getApps)
	router.delete('/api/app/:appName', deleteApp)
}

module.exports = serveAppApi
