const express = require('express')

const FilesCtrl = require('../controllers/files-ctrl')

const router = express.Router()

router.get('/files', FilesCtrl.getFiles)

module.exports = router