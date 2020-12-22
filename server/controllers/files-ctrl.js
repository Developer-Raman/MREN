const Files = require('../models/files-model')

const getFiles = async (req, res) => {
    await Files.find({}, (err, files) => {
        if(err) {
            return res.status(400).json({ success: false, error: err})
        }
        if(!files.length) {
            return res.status(404).json({success: false, error: "Files not found"})
        }
        return res.status(200).json({success: true, data: files})
    }).catch(err => console.log(err))
}

module.exports = {
    getFiles
}