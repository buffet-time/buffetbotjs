import { Client, Collection, Message } from 'discord.js'
import { Command, Reminder } from './typings.js'
import Config from './config/config.js'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders.js'
import { acronymCommand } from './commands/acronym.js'
import { helpCommand } from './commands/simple.js'
import { emailCommand } from './commands/email.js'

const client = new Client()
const commands: Collection<string, Command> = new Collection()

let allReminders: Reminder[]
export function updateReminders(reminders: Reminder[]): void {
	allReminders = reminders
}

client.once('ready', async () => {
	allReminders = await getAllReminders()
	const arrayOfCommandObjects = [
		remindersCommand,
		acronymCommand,
		helpCommand,
		emailCommand
	]
	arrayOfCommandObjects.forEach((command) => {
		commands.set(command.name, command)
	})

	let currentTime = 1
	let x = 0

	// Reminder Handling
	setInterval(async () => {
		if (allReminders[0]) {
			currentTime = Date.now()
			x = allReminders.length
			while (x--) {
				if (currentTime >= allReminders[x].time) {
					const channelToSendTo = await client.channels.fetch(
						allReminders[x].channel
					)
					if (channelToSendTo.isText()) {
						channelToSendTo.send(
							`<@!${allReminders[x].user}>: ${allReminders[x].message}`
						)
						await removeReminder(
							allReminders[x].user,
							allReminders[x].reminderNumber
						)
						allReminders = await getAllReminders()
					}
				}
			}
		}
	}, 15000) // 15 seconds

	client.user?.setActivity('!help')
	console.log('Ready')
})

client.on('message', async (message: Message) => {
	if (!message.content.startsWith('!') || message.author.bot) {
		if (
			message.content.includes('<@!136494200391729152>') &&
			!message.author.bot &&
			message.author.id !== '136494200391729152'
		) {
			message.channel.send('dont ever @ me again')
		} else {
			return
		}
	}
	const content = message.content
	const args = content.slice(1).trim().split(/ +/)
	const command = args.shift()?.toLowerCase()

	if (!command || !commands.has(command)) {
		return
	}

	try {
		const messageToSend = await commands.get(command)?.execute(message, args)
		const omitModifier = content.includes('-o')
		const deleteModifier = content.includes('-d')

		if (deleteModifier) {
			await message.delete()
		}
		if (omitModifier) {
			return
		}

		// send the messsage
		if (messageToSend) {
			message.channel.send(messageToSend)
		} else {
			message.channel.send('Error sending message.')
		}
	} catch (error) {
		message.channel.send(`Error: ${error}`)
	}
})

client.login(Config.token)
