import { Message } from 'discord.js'
import { Command } from '../typings.js'
import { google as Google } from 'googleapis'
import { authorize } from '../shared/googleApis.js'
import FileSystem from 'fs/promises'
import { OAuth2Client } from 'google-auth-library'

export { emailCommand }

const scopes = ['https://www.googleapis.com/auth/gmail.send']
const tokenPath = './src/config/emailToken.json'
const credentialsPath = './src/config/emailCredentials.json'
let authClient: OAuth2Client

try {
	const content = await FileSystem.readFile(credentialsPath, 'utf-8')
	authClient = await authorize({
		credentials: JSON.parse(content),
		scopes,
		tokenPath
	})
} catch (error) {
	throw error('No emailCredentials.json, check readme.md')
}

const emailCommand: Command = {
	name: 'email',
	execute(message: Message, args: string[]) {
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
