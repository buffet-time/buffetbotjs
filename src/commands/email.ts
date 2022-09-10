import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { Command } from '../typings'
import { botEndpoint } from '../assets/endpoints'

export { emailCommand }

const emailCommand: Command = {
	name: 'email',
	description: 'Send an email but from discord for some reason, idk',
	options: [
		{
			name: 'emailto',
			description: 'Email to send to',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'emailsubject',
			description: 'Email Subject',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'emailmessage',
			description: 'Email Message',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		const emailTo = interaction.options.getString('emailto')
		const emailSubject = interaction.options.getString('emailsubject')
		const emailMessage = interaction.options.getString('emailmessage')

		if (!emailTo || !emailSubject || !emailMessage) {
			return {
				content: 'Error: Email to, subject, or message was not defined.'
			}
		}
		let emailStatus
		try {
			// TODO fix this
			await fetch(
				`${botEndpoint}/Email?to=${emailTo}&subject=${emailSubject}&message=${emailMessage}`
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
