import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { client } from '../main'
import { buffetsUserId } from '../assets/spreadsheetUsers'
import type { Command } from '../types/typings'

const deleteCommand: Command = {
	name: 'delete',
	description: 'Deletes a command: for buffet',
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

const liveCommand: Command = {
	name: 'live',
	description: 'Checks live commands: for buffet',
	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.user.id === buffetsUserId) {
			const liveCommands = await client.application?.commands.fetch()

			const commandNameArray: string[] = []
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			liveCommands?.forEach((command) => {
				commandNameArray.push(command.name)
			})

			return {
				content: `${commandNameArray.toString()}`
			}
		}

		return {
			content: `You're not Buffet.`
		}
	}
}
export const AdminCommands = [deleteCommand, liveCommand]
