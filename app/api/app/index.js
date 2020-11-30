const { createApp, readApps } = require('../../services/app')

//

const postApp = async (req, res, next) => {
	try {
		const { appName } = req.params
		await createApp(appName)
		res.status(201).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({
			err: err.message
		})
	}
}

const getApps = async (req, res, next) => {
	try {
		const appNames = await readApps()
		res.status(200).json({appNames})
	} catch (err) {
		console.error(err)
		res.status(500).json({
			err: err.message
		})
	}
}

//

const serveAppApi = (router) => {
	router.post('/api/app/:appName', postApp)
	router.get('/api/apps', getApps)
}

module.exports = serveAppApi
