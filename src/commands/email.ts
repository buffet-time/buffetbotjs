import { Message } from 'discord.js'
import { Command } from '../typings.js'
import { google as Google } from 'googleapis'
import { default as Readline } from 'readline'
import FileSystem from 'fs/promises'
import { OAuth2Client } from 'google-auth-library'

export { emailCommand }

const scopes = ['https://www.googleapis.com/auth/gmail.send']
const tokenPath = './src/config/token.json'
const credentialsPath = './src/config/credentials.json'
let authClient: OAuth2Client

try {
	const content = await FileSystem.readFile(credentialsPath, 'utf-8')
	authClient = await authorize(JSON.parse(content))
} catch (error) {
	throw error('No credentials.json, check readme.md')
}

const emailCommand: Command = {
	name: 'email',
	async execute(message: Message, args: string[]) {
		const subjectAndBody = message.content.match(/'([^']+)'/g)
		if (args.length < 3 || !subjectAndBody || subjectAndBody.length !== 2) {
			return 'Incorrect invocation of Email command.'
		}
		const emailStatus = sendEmail(
			args[0],
			subjectAndBody[0].replaceAll(`'`, ''),
			subjectAndBody[1].replaceAll(`'`, ''),
			authClient
		)
		if (emailStatus === 'good') {
			return 'Email sent succesfully.'
		} else {
			return 'Error sending email.'
		}
	}
}

// Create an OAuth2 client with the given credentials
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authorize(credentials: any) {
	const { client_secret, client_id, redirect_uris } = credentials.installed
	const oAuth2Client = new Google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	)

	// Check if we have previously stored a token.
	try {
		const token = await FileSystem.readFile(tokenPath, 'utf-8')
		oAuth2Client.setCredentials(JSON.parse(token))
	} catch (error) {
		await getNewToken(oAuth2Client)
	}
	return oAuth2Client
}

// Get and store new token after prompting for user authorization
async function getNewToken(oAuth2Client: OAuth2Client): Promise<void> {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	})
	console.log('Authorize this app by visiting this url:', authUrl)
	const readline = Readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	return new Promise((resolve) =>
		readline.question('Enter the code from that page here: ', (code) => {
			readline.close()
			resolve(
				new Promise((resolve) =>
					oAuth2Client.getToken(code, async (err, token) => {
						if (err || !token) {
							return console.error('Error retrieving access token', err)
						}
						oAuth2Client.setCredentials(token)
						try {
							await FileSystem.writeFile(
								tokenPath,
								JSON.stringify(token, null, 2)
							)
						} catch (error) {
							// console.log(error)
						}
						resolve()
					})
				)
			)
		})
	)
}

function sendEmail(
	to: string,
	subject: string,
	message: string,
	auth: OAuth2Client
) {
	try {
		Google.gmail({ version: 'v1', auth }).users.messages.send({
			auth: auth,
			userId: 'buffetsbot@gmail.com',
			requestBody: {
				raw: makeBody(to, 'buffetsbot@gmail.com', subject, message)
			}
		})
		return 'good'
	} catch (error) {
		return 'error'
	}
}

function makeBody(to: string, from: string, subject: string, message: string) {
	const stringArray = [
		'Content-Type: text/plain; charset="UTF-8"\n',
		'MIME-Version: 1.0\n',
		'Content-Transfer-Encoding: 7bit\n',
		'to: ',
		to,
		'\n',
		'from: ',
		from,
		'\n',
		'subject: ',
		subject,
		'\n\n',
		message
	].join('')

	const returnString = Buffer.from(stringArray)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')

	return returnString
}
