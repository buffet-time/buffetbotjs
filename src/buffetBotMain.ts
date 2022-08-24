/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	GatewayIntentBits
} from 'discord.js'
import { Reminder } from './typings.js'
import { token } from './config/config.js'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders.js'
import { AdminCommands } from './commands/admin.js'
import { acronymCommand } from './commands/acronym.js'
import { SimpleCommands } from './commands/simple.js'
import { emailCommand } from './commands/email.js'
import { sheetsCommand } from './commands/sheets.js'
import { femboyCommand } from './commands/reddit.js'
import { DictionaryCommands } from './commands/dictionary.js'
import { mediaSpreadsheetUsers } from './spreadsheetUsers.js'
import { getMediaSheetRow, setupMediaSheetsAndChannels } from './mediaSheet.js'

// TODO:
// 1) Add /stats command to get various stats on a person or
//    the whole server for things like number of messages and shit
//    maybe even a breakdown of channels, and like a leaderboard
// 2) Add /wordcount to get how many times a passed word has been sent in the discord

export const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

const arrayOfCommandObjects = [
	remindersCommand,
	acronymCommand,
	emailCommand,
	sheetsCommand,
	femboyCommand,
	...AdminCommands,
	...DictionaryCommands,
	...SimpleCommands
]

// TODO: Refactor

let allReminders: Reminder[]

export function updateReminders(reminders: Reminder[]): void {
	allReminders = reminders
}

client.on('ready', async () => {
	console.log('Starting up...')
	setupMediaSheetsAndChannels(client)

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

	function mediaSheetCheck() {
		// For the music sheets currently
		mediaSpreadsheetUsers.forEach(async (info, index) => {
			if (info.Music) getMediaSheetRow(info, 'Music', index)

			if (info.Games) getMediaSheetRow(info, 'Games', index)

			if (info.Movies) getMediaSheetRow(info, 'Movies', index)

			if (info.TV) getMediaSheetRow(info, 'TV', index)
		})
	}

	mediaSheetCheck()
	// setInterval(mediaSheetCheck, 20000) // 20 seconds
	setInterval(mediaSheetCheck, 120000) // 2 minutes

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
