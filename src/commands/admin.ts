import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { client } from '../buffetBotMain.js'
import { buffetsUserId } from '../spreadsheetUsers.js'
import { Command } from '../typings.js'

const deleteCommand: Command = {
	name: 'delete',
	description: 'Deletes a command ',
	options: [
		{
			name: 'command',
			description: 'command to delete.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.user.id === buffetsUserId) {
			//
			const commandToDelete = interaction.options.getString('command')

			const liveCommands = await client.application?.commands.fetch()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			for (const element of liveCommands!) {
				if (element[1].name === commandToDelete) {
					client.application?.commands.delete(element[1])

					return {
						content: `Passed command deleted.`
					}
				}
			}

			return {
				content: `The command passed doesn't exist.`
			}
		}

		return {
			content: `You're not Buffet.`
		}
	}
}

export const AdminCommands = [deleteCommand]
