import {
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	GatewayIntentBits
} from 'discord.js'
import type { Reminder } from './types/typings'
import { discordToken } from './config/config'
import {
	removeReminder,
	getAllReminders,
	remindersCommand
} from './commands/reminders'
import { AdminCommands } from './commands/admin'
import { acronymCommand } from './commands/acronym'
import { SimpleCommands } from './commands/simple'
import { sheetsCommand } from './commands/sheets'
import { DictionaryCommands } from './commands/dictionary'
import { mediaSpreadsheetUsers } from './assets/spreadsheetUsers'
import { getMediaSheetRow, setupMediaSheetsAndChannels } from './mediaSheet'
import { audioCommand } from './commands/audio/audio'
import { getCurrentDate } from './helpers'

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

export function updateBotStatus(newStatus: string) {
	client.user?.setActivity(newStatus)
}

const arrayOfCommandObjects = [
	remindersCommand,
	acronymCommand,
	sheetsCommand,
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

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on('ready', async () => {
	console.log(`Starting up... ~ ${getCurrentDate()}`)
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

	function mediaSheetCheck() {
		mediaSpreadsheetUsers.forEach((info, index) => {
			if (info.Music) {
				void getMediaSheetRow(info, 'Music', index)
			}

			if (info.Games) {
				void getMediaSheetRow(info, 'Games', index)
			}

			if (info.Movies) {
				void getMediaSheetRow(info, 'Movies', index)
			}

			if (info.TV) {
				void getMediaSheetRow(info, 'TV', index)
			}
		})
	}

	mediaSheetCheck()
	setInterval(mediaSheetCheck, 120000) // 2 minutes

	client.user?.setActivity('Team Fortress 2')
	console.log(`Ready ~ ${getCurrentDate()}`)

	async function remindersStuff() {
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
				await channelToSendTo.send(
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

	// check every 10 minutes
	setInterval(() => {
		void remindersStuff
	}, 600000)
})

function isObjectEmpty(object: any) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	return Object.keys(object).length === 0 && object.constructor === Object
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
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
			if (isObjectEmpty(messageToSend)) {
				return
			}
			messageToSend
				? await interaction.reply(messageToSend)
				: await interaction.reply('Error Code: 3')
		} else {
			await interaction.reply('Error Code: 2')
		}
	} catch (error: any) {
		await interaction.reply(`Error Code 1: ${error}`)
	}
})

await client.login(discordToken)
