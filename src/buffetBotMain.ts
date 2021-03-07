import { Client, Collection, Message, TextChannel } from 'discord.js'
import { Command, Release, Reminder } from './typings.js'
import Config from './config/config.js'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders.js'
import { acronymCommand } from './commands/acronym.js'
import { helpCommand, kissCommand } from './commands/simple.js'
import { emailCommand } from './commands/email.js'
import { getNumberOfRows, getRowByIndex } from './commands/sheets.js'

const client = new Client()
const commands: Collection<string, Command> = new Collection()
const buffetSpreadsheetId = '18V5oypFBW3Bu_tHxfTL-iSbb9ALYrCJlMwLhpPmp72M'
const zachSpreadsheetId = '1gOQsBnd11bU-DkNUlAWoDub6t7eqKhUjy92M5kh2_TQ'
const buffetRange = 'Main!A2:G'
const zachRange = 'Sheet1!A2:G'

let musicChannel: TextChannel
let allReminders: Reminder[]
let buffetSheetLength = 0
let zachSheetLength = 0

export function updateReminders(reminders: Reminder[]): void {
	allReminders = reminders
}

client.once('ready', async () => {
	musicChannel = client.channels.cache.get('301931813947965440') as TextChannel
	allReminders = await getAllReminders()
	buffetSheetLength = await getNumberOfRows(buffetSpreadsheetId, buffetRange)
	zachSheetLength = await getNumberOfRows(zachSpreadsheetId, zachRange, true)
	const arrayOfCommandObjects = [
		remindersCommand,
		acronymCommand,
		helpCommand,
		emailCommand,
		kissCommand
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

	setInterval(async () => {
		const buffetTempLength = await getNumberOfRows(
			buffetSpreadsheetId,
			buffetRange
		)
		if (buffetTempLength !== buffetSheetLength) {
			const row = await getRowByIndex(
				buffetTempLength - 1,
				buffetSpreadsheetId,
				buffetRange
			)
			if (
				row[Release.score] &&
				row[Release.comments] &&
				row[Release.artist] &&
				row[Release.name] &&
				row[Release.type] &&
				row[Release.year] &&
				row[Release.genre]
			) {
				musicChannel.send(
					`Buffet: ${row[Release.artist].trim()} - ${row[
						Release.name
					].trim()} (${row[Release.year].trim()} ${row[
						Release.type
					].trim()}) ${row[Release.score].trim()}/10 ~ ${row[
						Release.comments
					].trim()}`
				)
				buffetSheetLength = buffetTempLength
			}
		}
		const zachTempLength = await getNumberOfRows(
			zachSpreadsheetId,
			zachRange,
			true
		)
		if (zachTempLength !== zachSheetLength) {
			const row = await getRowByIndex(
				zachTempLength - 1,
				zachSpreadsheetId,
				zachRange
			)
			if (
				row[Release.score] &&
				row[Release.comments] &&
				row[Release.artist] &&
				row[Release.name] &&
				row[Release.type] &&
				row[Release.year] &&
				row[Release.genre]
			) {
				musicChannel.send(
					`Zach: ${row[Release.artist].trim()} - ${row[
						Release.name
					].trim()} (${row[Release.year].trim()} ${row[
						Release.type
					].trim()}) ${row[Release.score].trim()}/10 ~ ${row[
						Release.comments
					].trim()}`
				)
				zachSheetLength = zachTempLength
			}
		}
	}, 300000) // 5 minutes

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
