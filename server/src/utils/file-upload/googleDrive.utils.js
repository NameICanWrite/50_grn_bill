import fs from 'fs'
import { google } from 'googleapis'
import dotenv from 'dotenv'
import { createAuthorizedGoogleClient } from './googleCredentials.utils.js'



export async function getFileStreamFromGoogleDrive(fileId) {
    const auth = createAuthorizedGoogleClient()
    const drive = google.drive({ version: 'v3', auth });

    return await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    )
}

export async function uploadFileToGoogleDrive(file) {
  const auth = createAuthorizedGoogleClient()
  const drive = google.drive({ version: 'v3', auth });
  const fileStream = fs.createReadStream(
    file.path || file.tempFilePath
    )
  const fileMetadata = {
    name: file.name
  };
  const media = {
    mimeType: file.mimetype,
    body: fileStream
  };
  const savedFile = (await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  })).data
  console.log('File saved to google drive. Id:',savedFile.id)
  
  return savedFile
}

export async function deleteFileFromGoogleDrive(fileId) {
  const auth = createAuthorizedGoogleClient()
  const drive = google.drive({ version: 'v3', auth });

  await drive.files.delete({fileId}).catch(err => console.log('Error while deleting file: ',err.message))
  console.log('Deleted file from gdrive. id: ' + fileId);
}