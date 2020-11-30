const express = require('express')
const serveAppApi = require('./app')

const genApi = () => {
	const router = express.Router()
	serveAppApi(router)
	return router
}

module.exports = genApi

