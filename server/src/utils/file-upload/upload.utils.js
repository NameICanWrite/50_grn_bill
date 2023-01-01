const allowedFileSize = 20

export function verifyImageFiles(req, res, next) {
	if (!Object.keys(req.files).length > 0) return res.status(400).send('You didn\t upload any file')
	for (const prop in req.files) {
		if (!req.files[prop].mimetype.startsWith('image')) return res.status(400).send('The file is not an image')
		if (req.files[prop].size > allowedFileSize * 1024 * 1024) return res.status(400).send(`Please upload files smaller than ${allowedFileSize} MB`)
	}
		
	next()
}