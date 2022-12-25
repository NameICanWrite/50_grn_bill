import { deleteFileFromGoogleDrive, getFileStreamFromGoogleDrive, uploadFileToGoogleDrive } from "../utils/file-upload//googleDrive.utils.js"

export async function getImage(req, res) {
	const fileId = req.params.fileId
	
	try {
		const readStream = await getFileStreamFromGoogleDrive(fileId)
		
		const contentType = readStream.headers['content-type']
		const data = readStream.data
		if (data) {
			res.writeHead(200, {
				'Content-Type' : contentType
			})
			return data.pipe(res)
		}
	} catch (err) {
		return res.status(404).send('not found')
	}
}

	
// export async function saveFileToGoogleDrive(req, res) {
//   console.log(req.files)
//   const image = req.files.image
//   const fileName = `${Date.now()}${req.files.image.name}`

//   await uploadFileToGoogleDrive({ ...image, name: fileName })
 
//   res.send('File saved')
// }

// export async function deleteFileFromGoogleDriveController(req, res) {
// 	const id = req.body.id
// 	await deleteFileFromGoogleDrive(id)
// 	res.status(200).send('file deleted from google drive' + id)
// }