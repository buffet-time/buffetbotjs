import { Client, Intents, TextChannel } from 'discord.js'
import { Reminder } from './typings.js'
import { token } from './config/config.js'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders.js'
import { acronymCommand } from './commands/acronym.js'
import {
	crocCommand,
	kissCommand,
	parentsCommand,
	cheemsCommand,
	macCommand
} from './commands/simple.js'
import { emailCommand } from './commands/email.js'
import {
	getNumberOfRows,
	getRowByIndex,
	getSheetsRowMessage,
	rowIsFilledOut,
	sheetsCommand
} from './commands/sheets.js'
import { femboyCommand } from './commands/reddit.js'

//TODO refactor this so i dont have to manually change every year!
const buffetSpreadsheetId = '1lyFD7uLMT0mRdGkKwvbIm_2pqk2YJU7rtRQVhHq-nwU'
const zachSpreadsheetId = '1gOQsBnd11bU-DkNUlAWoDub6t7eqKhUjy92M5kh2_TQ'
const stoneSpreadsheetId = '1ZAAtds78UsGh2yYfiyDuX7gqL_4ZEtC6_njco6t7F44'
const buffetRange = 'Main!A2:G'
const zachRange = 'Sheet1!A2:G'
const stoneRange = 'Main!A2:G'
export {
	buffetSpreadsheetId,
	zachSpreadsheetId,
	stoneSpreadsheetId,
	buffetRange,
	zachRange,
	stoneRange
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const arrayOfCommandObjects = [
	remindersCommand,
	acronymCommand,
	emailCommand,
	kissCommand,
	parentsCommand,
	sheetsCommand,
	crocCommand,
	cheemsCommand,
	femboyCommand,
	macCommand
]

let musicChannel: TextChannel
let allReminders: Reminder[]
let buffetSheetLength: number | undefined
let zachSheetLength: number | undefined
let stoneSheetLength: number | undefined

export function updateReminders(reminders: Reminder[]): void {
	allReminders = reminders
}

client.on('ready', async () => {
	console.log('Starting up...')
	musicChannel = client.channels.cache.get('301931813947965440') as TextChannel
	allReminders = await getAllReminders()
	buffetSheetLength = await getNumberOfRows(buffetSpreadsheetId, buffetRange)
	zachSheetLength = await getNumberOfRows(zachSpreadsheetId, zachRange)
	stoneSheetLength = await getNumberOfRows(stoneSpreadsheetId, stoneRange)

	// TODO: Create a remove command command that only I can use
	// code block to remove a command.
	// const liveCommands = await client.application?.commands.fetch()
	// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// for (element of liveCommands!) {
	// 	if (element.name === 'help') {
	// 		client.application?.commands.delete(element)
	// 	}
	// }

	for (const command of arrayOfCommandObjects) {
		command.options
			? client.application?.commands.create({
					name: command.name,
					description: command.description,
					options: command.options
			  })
			: client.application?.commands.create({
					name: command.name,
					description: command.description
			  })
	}

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
					if (channelToSendTo?.isText()) {
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
			if (!buffetTempLength) {
				return
			}

			const row = await getRowByIndex(
				buffetTempLength - 1,
				buffetSpreadsheetId,
				buffetRange
			)
			if (row && rowIsFilledOut(row)) {
				musicChannel.send(`Buffet: ${getSheetsRowMessage(row)}`)
				buffetSheetLength = buffetTempLength
			}
		}

		const zachTempLength = await getNumberOfRows(zachSpreadsheetId, zachRange)
		if (zachTempLength !== zachSheetLength) {
			if (!zachTempLength) {
				return
			}

			const row = await getRowByIndex(
				zachTempLength - 1,
				zachSpreadsheetId,
				zachRange
			)
			if (row && rowIsFilledOut(row)) {
				musicChannel.send(`Zach: ${getSheetsRowMessage(row)}`)
				zachSheetLength = zachTempLength
			}
		}

		const stoneTempLength = await getNumberOfRows(
			stoneSpreadsheetId,
			stoneRange
		)
		if (stoneTempLength !== stoneSheetLength) {
			if (!stoneTempLength) {
				return
			}

			const row = await getRowByIndex(
				stoneTempLength - 1,
				stoneSpreadsheetId,
				stoneRange
			)
			if (row && rowIsFilledOut(row)) {
				musicChannel.send(`Stonepaq: ${getSheetsRowMessage(row)}`)
				stoneSheetLength = stoneTempLength
			}
		}
	}, 300000) // 5 minutes

	client.user?.setActivity('When is hotline?')
	console.log('Ready')
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) {
		return
	}

	try {
		const commandToBeExecuted = arrayOfCommandObjects.find((command) =>
			interaction.commandName === command.name ? command : undefined
		)
		if (commandToBeExecuted) {
			const messageToSend = await commandToBeExecuted.execute(interaction)
			messageToSend
				? interaction.reply(messageToSend)
				: interaction.reply('Error Code: 3')
		} else {
			interaction.reply('Error Code: 2')
		}
	} catch (error) {
		interaction.reply(`Error Code 1: ${error}`)
	}
})

client.login(token)
