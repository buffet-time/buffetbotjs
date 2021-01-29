/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js'
import { Command } from '../typings.js'

export { helpCommand }

const helpCommand: Command = {
	name: 'help',
	description: 'help',
	async execute(_message: Message, _args: string[]) {
		const messageToSend =
			`**Current commands**:\n!acronym [insert word here]\n` +
			`!reminders add [number] [minute/ minutes, ..., year/years] [#channel] ["message in quotes"] \n` +
			`!reminders remove [number to remove] \n` +
			`!reminders view [number to view or the word all] \n` +
			`**Current modifiers**:\n**-d** deletes your message that invoked the command\n` +
			`**-o** omits the output from the bot\n` +
			`**Example:** !acronym meme -d`
		return messageToSend
	}
}
