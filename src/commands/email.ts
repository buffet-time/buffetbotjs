import { CommandInteraction } from 'discord.js'
import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { emailCommand }

const emailCommand: Command = {
	name: 'email',
	description: 'Send an email but from discord for some reason, idk',
	options: [
		{
			name: 'emailto',
			description: 'Email to send to',
			type: 'STRING',
			required: true
		},
		{
			name: 'emailsubject',
			description: 'Email Subject',
			type: 'STRING',
			required: true
		},
		{
			name: 'emailmessage',
			description: 'Email Message',
			type: 'STRING',
			required: true
		}
	],
	async execute(interaction: CommandInteraction) {
		const emailTo = interaction.options.getString('emailto'),
			emailSubject = interaction.options.getString('emailsubject'),
			emailMessage = interaction.options.getString('emailmessage')

		if (!emailTo || !emailSubject || !emailMessage) {
			return {
				content: 'Error: Email to, subject, or message was not defined.'
			}
		}
		let emailStatus
		try {
			// TODO fix this
			await nodeFetch(
				`http://localhost:3001/Email?to=${emailTo}&subject=${emailSubject}&message=${emailMessage}`
			)
			emailStatus = 'good'
		} catch (error) {
			emailStatus = `${error}`
		}

		if (emailStatus === 'good') {
			return { content: 'Email sent succesfully.' }
		} else {
			return { content: `Error sending email: ${emailStatus}` }
		}
	}
}
