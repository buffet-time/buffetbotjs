import { Message } from 'discord.js'
import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { emailCommand }

const emailCommand: Command = {
	name: 'email',
	async execute(message: Message, args: string[]) {
		const subjectAndMessage = message.content.match(/'([^']+)'/g)
		if (
			args.length < 3 ||
			!subjectAndMessage ||
			subjectAndMessage.length !== 2
		) {
			return { content: 'Incorrect invocation of Email command.' }
		}

		const emailTo = args[0],
			emailSubject = subjectAndMessage[0].replaceAll(`'`, ''),
			emailMessage = subjectAndMessage[1].replaceAll(`'`, '')

		let emailStatus
		try {
			await nodeFetch(
				`http://localhost:3000/Email?to=${emailTo}&subject=${emailSubject}&message=${emailMessage}`
			)
			emailStatus = 'good'
		} catch (error) {
			emailStatus = `error: ${error}`
		}

		if (emailStatus === 'good') {
			return { content: 'Email sent succesfully.' }
		} else {
			return { content: 'Error sending email.' }
		}
	}
}
