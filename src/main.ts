/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	GatewayIntentBits
} from 'discord.js'
import type { Reminder } from './types/typings'
import { token } from './config/config'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders'
import { AdminCommands } from './commands/admin'
import { acronymCommand } from './commands/acronym'
import { SimpleCommands } from './commands/simple'
import { emailCommand } from './commands/email'
import { sheetsCommand } from './commands/sheets'
import { femboyCommand } from './commands/reddit'
import { DictionaryCommands } from './commands/dictionary'
import { mediaSpreadsheetUsers } from './assets/spreadsheetUsers'
import { getMediaSheetRow, setupMediaSheetsAndChannels } from './mediaSheet'
import { audioCommand } from './commands/audio'

// TODO:
// -- THESE ARE CURRENTLY NOT POSSIBLE
// 1) Add /stats command to get various stats on a person or
//    the whole server for things like number of messages and shit
//    maybe even a breakdown of channels, and like a leaderboard
// 2) Add /wordcount to get how many times a passed word has been sent in the discord

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates
	]
})

const arrayOfCommandObjects = [
	remindersCommand,
	acronymCommand,
	emailCommand,
	sheetsCommand,
	femboyCommand,
	audioCommand,
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
		if (!allReminders[0]) {
			return
		}

		currentTime = Date.now()
		x = allReminders.length
		while (x--) {
			if (currentTime < allReminders[x].time) {
				return
			}

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
	}, 15000) // 15 seconds

	function mediaSheetCheck() {
		// For the music sheets currently
		mediaSpreadsheetUsers.forEach(async (info, index) => {
			if (info.Music) {
				getMediaSheetRow(info, 'Music', index)
			}

			if (info.Games) {
				getMediaSheetRow(info, 'Games', index)
			}

			if (info.Movies) {
				getMediaSheetRow(info, 'Movies', index)
			}

			if (info.TV) {
				getMediaSheetRow(info, 'TV', index)
			}
		})
	}

	mediaSheetCheck()
	// setInterval(mediaSheetCheck, 20000) // 20 seconds --- testing
	setInterval(mediaSheetCheck, 120000) // 2 minutes

	client.user?.setActivity('Team Fortress 2')
	console.log('Ready')
})

client.on('interactionCreate', async (interaction) => {
	console.log(11)
	if (!interaction.isCommand()) {
		console.log(11.5)
		return
	}

	console.log(12)
	try {
		const commandToBeExecuted = arrayOfCommandObjects.find((command) =>
			interaction.commandName === command.name ? command : undefined
		)
		console.log(13)
		if (commandToBeExecuted) {
			const messageToSend = await commandToBeExecuted.execute(
				interaction as ChatInputCommandInteraction
			)
			console.log(14)
			if (!messageToSend) {
				console.log(14.5)
				return
			}
			console.log(15)
			messageToSend
				? interaction.reply(messageToSend)
				: interaction.reply('Error Code: 3')
		} else {
			console.log(16)
			interaction.reply('Error Code: 2')
		}
	} catch (error) {
		console.log(17)
		interaction.reply(`Error Code 1: ${error}`)
	}
})

client.login(token)
