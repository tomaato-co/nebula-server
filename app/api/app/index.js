const { createApp } = require('../../services/app')

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

//

const serveAppApi = (router) => {
	router.post('/api/app/:appName', postApp)
	// router.get('/api', (req, res) => res.send('Hw from router.'))
}

module.exports = serveAppApi

