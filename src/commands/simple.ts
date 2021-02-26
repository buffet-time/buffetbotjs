/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js'
import { Command } from '../typings.js'

export { helpCommand, kissCommand }

const helpCommand: Command = {
	name: 'help',
	execute(_message: Message, _args: string[]) {
		const messageToSend =
			`**Current commands**:\n!acronym [insert word here]\n` +
			`!reminders add [number] [minute/ minutes, ..., year/years] [#channel] ['message in single quotes'] \n` +
			`!reminders remove [number to remove] \n` +
			`!reminders view [number to view or the word all] \n` +
			`!email [example@blah.com] ['subject inside of single quotes'] ['body of the email in single quotes']` +
			`**Current modifiers**:\n**-d** deletes your message that invoked the command\n` +
			`**-o** omits the output from the bot\n` +
			`**Example:** !acronym meme -d`
		return messageToSend
	}
}

const kissCommand: Command = {
	name: 'kiss',
	execute(message: Message, args: string[]) {
		return `${message.author} kissed ${args[0]}\nhttps://bit.ly/2ZQvEp0`
	}
}
