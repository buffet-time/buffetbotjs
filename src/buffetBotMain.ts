/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	GatewayIntentBits,
	TextChannel
} from 'discord.js'
import { Reminder } from './typings.js'
import { token } from './config/config.js'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders.js'
import { acronymCommand } from './commands/acronym.js'
import { SimpleCommands } from './commands/simple.js'
import { emailCommand } from './commands/email.js'
import {
	getNumberOfRows,
	getRowByIndex,
	getSheetsRowMessage,
	rowIsFilledOut,
	sheetsCommand
} from './commands/sheets.js'
import { femboyCommand } from './commands/reddit.js'
import { MediaSpreadsheetsInfo } from './spreadsheetInfo.js'

// TODO:
// 1) Do some code cleanup
// 2) Add /stats command to get various stats on a person or
//    the whole server for things like number of messages and shit
//    maybe even a breakdown of channels, and like a leaderboard
// 3) Add /wordcount to get how many times a passed word has been sent in the discord
// 4) Dictionary definition lookup
// 5) Thesaurus synonyms of word
// 6) /commie random commie quotes
// 7) Movie and Game review sheet thing like the music one
// 8) Create a remove command command that only I can use
// 			code block to remove a command.
// 			const liveCommands = await client.application?.commands.fetch()
// 			for (element of liveCommands!) {
// 				if (element.name === 'help') {
// 					client.application?.commands.delete(element)
// 				}
// 			}

//TODO refactor this so i dont have to manually change every year!

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})
const arrayOfCommandObjects = [
	remindersCommand,
	acronymCommand,
	emailCommand,
	sheetsCommand,
	femboyCommand,
	...SimpleCommands
]

let musicChannel: TextChannel
let allReminders: Reminder[]

export function updateReminders(reminders: Reminder[]): void {
	allReminders = reminders
}

client.on('ready', async () => {
	console.log('Starting up...')
	musicChannel = client.channels.cache.get('301931813947965440') as TextChannel
	allReminders = await getAllReminders()

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
					if (channelToSendTo?.type === ChannelType.GuildText) {
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

	const lengthArray: number[] = []
	MediaSpreadsheetsInfo.forEach(() => lengthArray.push(0))

	function musicSheetInterval() {
		// For the music sheets currently
		MediaSpreadsheetsInfo.forEach(async (info, index) => {
			const tempLength = await getNumberOfRows(
				info.music!.id,
				info.music!.range
			)
			if (tempLength !== lengthArray[index]) {
				if (!tempLength) {
					return
				}

				const row = await getRowByIndex(
					tempLength - 1,
					info.music!.id,
					info.music!.range
				)
				if (row && rowIsFilledOut(row)) {
					// Prevents sending the first time the bot starts up
					if (lengthArray[index] !== 0) {
						musicChannel.send(
							`${info.personsName}: ${getSheetsRowMessage(row)}`
						)
					}
					lengthArray[index] = tempLength
				}
			}
		})
	}

	musicSheetInterval()
	// setInterval(musicSheetInterval, 5000) // 5 seconds
	setInterval(musicSheetInterval, 300000) // 5 minutes

	client.user?.setActivity('Team Fortress 2')
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
			const messageToSend = await commandToBeExecuted.execute(
				interaction as ChatInputCommandInteraction
			)
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
