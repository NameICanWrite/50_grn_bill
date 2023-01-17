import fs, { readFileSync } from 'fs'
import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)



export function createAuthorizedGoogleClient() {
	const client = new google.auth.JWT(
		key.client_email,
		null,
		key.private_key,
		["https://www.googleapis.com/auth/drive"],
		null
	);
	
	client.authorize((err) => {
		if (err) {
			console.log(err);
		}
	});

	return client
}

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the given callback function.
//  */
// export function createAuthorizedOAuth2Client() {
// 	const oAuth2Client = createOAuth2Client()
//   const token = JSON.parse(process.env.GOOGLE_ACCESS_TOKEN)

//   oAuth2Client.setCredentials(token);
  
// 	return oAuth2Client
// }

// function createOAuth2Client() {
// 	  const client_secret = process.env.GOOGLE_CLIENT_SECRET
// 	  const client_id = process.env.GOOGLE_CLIENT_ID
// 	  const redirect_uris = ['http://localhost:3000']


// 	  const oAuth2Client = new google.auth.OAuth2(
// 	    client_id, client_secret, redirect_uris[0]);
// 		return oAuth2Client
// }



//run manually generateAuthUrl and then getAccessToken to refresh credentials
// export function generateAuthUrl() {
// 	const oAuth2Client = createOAuth2Client()
// 	const SCOPES = ['https://www.googleapis.com/auth/drive']
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
// 	console.log('Get "code" parameter from the redirect url and paste it into the GOOGLE_AUTH_CODE environment variable')
// }
// export async function getAccessToken() {
// 	const oAuth2Client = createOAuth2Client()
// 	const token = await oAuth2Client.getToken(process.env.GOOGLE_AUTH_CODE)
// 	console.log('paste this token to GOOGLE_ACCESS_TOKEN environment variable')
//   console.log(JSON.stringify(token))
// }




