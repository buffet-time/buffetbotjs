import { Message } from 'discord.js'
import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { emailCommand }

const emailCommand: Command = {
	name: 'email',
	async execute(message: Message, args: string[]) {
		const subjectAndBody = message.content.match(/'([^']+)'/g)
		if (args.length < 3 || !subjectAndBody || subjectAndBody.length !== 2) {
			return { content: 'Incorrect invocation of Email command.' }
		}
		const emailStatus = await sendEmail(
			args[0],
			subjectAndBody[0].replaceAll(`'`, ''),
			subjectAndBody[1].replaceAll(`'`, '')
		)
		if (emailStatus === 'good') {
			return { content: 'Email sent succesfully.' }
		} else {
			return { content: 'Error sending email.' }
		}
	}
}

async function sendEmail(to: string, subject: string, message: string) {
	try {
		await nodeFetch(
			`http://localhost:3000/Email?to=${to}&subject=${subject}&message=${message}`
		)
		return 'good'
	} catch (error) {
		return `error: ${error}`
	}
}
