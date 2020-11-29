const express = require('express')
const serveStaticSiteApi = require('./static-site')

const genApi = () => {
	const router = express.Router()
	serveStaticSiteApi(router)
	return router
}

module.exports = genApi

