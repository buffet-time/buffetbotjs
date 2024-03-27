/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import FileSystem from 'fs/promises'
import IsEqual from 'lodash.isequal'
import { updateReminders } from '../main'
import type { Command, Reminder } from '../types/typings'

export { remindersCommand }
const remindersFilePath = 'reminders.json'

const remindersCommand: Command = {
	name: 'reminders',
	description:
		'Command to make, edit, delete, etc reminders for yourself or others.',
	options: [
		{
			name: 'add',
			description: 'Add Reminders sub command',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'amount',
					description: 'The number of minutes/ seconds/ etc',
					type: ApplicationCommandOptionType.Integer,
					required: true
				},
				{
					name: 'timetype',
					description: 'asdf',
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'seconds', value: 'seconds' },
						{ name: 'minutes', value: 'minutes' },
						{ name: 'hours', value: 'hours' },
						{ name: 'days', value: 'days' },
						{ name: 'weeks', value: 'weeks' },
						{ name: 'months', value: 'months' },
						{ name: 'years', value: 'years' }
					],
					required: true
				},
				{
					name: 'channel',
					description: 'Which reminder number to remove',
					type: ApplicationCommandOptionType.Channel,
					required: true
				},
				{
					name: 'message',
					description: 'Which reminder number to remove',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'remove',
			description: 'Remove Reminders sub command',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'reminder',
					description: 'Which reminder number to remove',
					type: ApplicationCommandOptionType.Integer,
					required: true
				}
			]
		},
		{
			name: 'view',
			description: 'View Reminders sub command',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'reminder',
					description: 'Which reminder to view',
					type: ApplicationCommandOptionType.Integer,
					required: false
				}
			]
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				updateReminders(await getAllReminders())
				return { content: await addReminder(interaction) }
			}
			case 'remove': {
				const reminderInt = interaction.options.getInteger('reminder')
				if (!reminderInt)
					return {
						content: 'Error in Reminders: 52'
					}

				updateReminders(await getAllReminders())
				return {
					content: await removeReminder(interaction.user.id, reminderInt)
				}
			}
			case 'view': {
				return {
					content: await viewReminders(interaction)
				}
			}
			default: {
				return {
					content: 'Incorrect invocation of the !reminders command.'
				}
			}
		}
	}
}

// TODO: clean up incorrect command passing to catch more
// handles the !reminders add command
async function addReminder(
	interaction: ChatInputCommandInteraction
): Promise<string> {
	try {
		const messageText = interaction.options.getString('message'),
			messageTimeType = interaction.options.getString('timetype'),
			messageTimeAmount = interaction.options.getInteger('amount'),
			messageAuthor = interaction.user.id,
			channelId = interaction.options.getChannel('channel')?.id
		if (!messageText || !messageTimeType || !messageTimeAmount || !channelId)
			return 'Error 31 in Reminders'

		const timestamp = getTime(messageTimeAmount, messageTimeType)
		const newReminder: Reminder = {
			reminderNumber: 1,
			time: timestamp,
			user: messageAuthor,
			message: messageText,
			channel: channelId
		}
		let remindersJson: Reminder[]
		if (!newReminder?.time || !newReminder.channel || timestamp === 0) {
			return 'Incorrect invocation of the add reminders command. See !help'
		}

		try {
			const parsedData: Reminder[] = JSON.parse(
					await FileSystem.readFile(remindersFilePath, 'utf8')
				),
				availableReminderNumber = getAvailableReminderNumber(
					parsedData,
					messageAuthor
				)
			if (availableReminderNumber) {
				newReminder.reminderNumber = availableReminderNumber
				parsedData.push(newReminder)
				remindersJson = parsedData
			} else remindersJson = [newReminder]
		} catch (error) {
			return 'Error 2 in addReminder().'
		}

		await FileSystem.writeFile(
			remindersFilePath,
			JSON.stringify(remindersJson, null, 2)
		)
		return 'Reminder added.'
	} catch (error) {
		return 'Error 1 in addReminder().'
	}
}

// handles the !reminders remove command
export async function removeReminder(
	messageAuthor: string,
	reminderNumberToRemove: number
): Promise<string> {
	try {
		const parsedData: Reminder[] = JSON.parse(
			await FileSystem.readFile(remindersFilePath, 'utf8')
		)
		const objectToRemoveArray = getRemindersByAuthor(
			parsedData,
			messageAuthor
		).filter((reminder) => reminder.reminderNumber === reminderNumberToRemove)

		if (!objectToRemoveArray[0]) {
			return "The number passed doesn't exist."
		}

		parsedData.splice(
			parsedData.findIndex((reminder) =>
				IsEqual(reminder, objectToRemoveArray[0])
			),
			1
		)

		await FileSystem.writeFile(
			remindersFilePath,
			JSON.stringify(parsedData, null, 2)
		)

		return 'Removed specified reminder.'
	} catch (error) {
		return 'Error in removeReminder().'
	}
}

// handles the !reminders view command
async function viewReminders(
	interaction: ChatInputCommandInteraction
): Promise<string> {
	try {
		const parsedData: Reminder[] = JSON.parse(
			await FileSystem.readFile(remindersFilePath, 'utf8')
		)
		if (
			!parsedData?.filter(
				(reminder) => reminder.user === interaction.user.id
			)[0]
		) {
			return 'You have no saved reminders.'
		}

		return remindersArrayToReturnString(
			interaction.options.getInteger('reminder')
				? getRemindersByAuthor(parsedData, interaction.user.id).filter(
						(reminder) =>
							reminder.reminderNumber ===
							interaction.options.getInteger('reminder')
					)
				: getRemindersByAuthor(parsedData, interaction.user.id)
		).join(`\n`)
	} catch (error) {
		return 'Error in viewReminders().'
	}
}

// returns entire array of reminders
export async function getAllReminders(): Promise<Reminder[]> {
	try {
		return JSON.parse(await FileSystem.readFile(remindersFilePath, 'utf8'))
	} catch {
		return []
	}
}

// TODO: handle making sure number doesnt go past max
// Gets the time the reminder should be sent
function getTime(amount: number, type: string) {
	// so that adding 1 = adding 1 second not 1 ms
	const seconds = amount * 1000
	const timestamp = Date.now()

	switch (type) {
		case 'seconds': {
			return timestamp + seconds
		}
		case 'minutes': {
			return timestamp + seconds * 60
		}
		case 'hours': {
			return timestamp + seconds * 3600
		}
		case 'days': {
			return timestamp + seconds * 86400
		}
		case 'weeks': {
			return timestamp + seconds * 604800
		}
		case 'months': {
			// 30 days
			return timestamp + seconds * 2592000
		}
		case 'years': {
			// 365 days
			return timestamp + seconds * 31536000
		}
		default: {
			console.error('Error in getTime(): ', seconds, timestamp, amount, type)
			return 0
		}
	}
}

// finds the lowest available number to set the reminderNumber as for the given user
function getAvailableReminderNumber(
	parsedData: Reminder[],
	messageAuthor: string
) {
	const reminderNumberArray = getRemindersByAuthor(
		parsedData,
		messageAuthor
	).map((reminder) => reminder.reminderNumber)
	for (let n = 1; n < reminderNumberArray.length + 2; n++) {
		if (!reminderNumberArray.includes(n)) {
			return n
		}
	}

	return reminderNumberArray.length + 1
}

// Get all Reminder objects for given user
function getRemindersByAuthor(parsedData: Reminder[], messageAuthor: string) {
	return parsedData.filter((reminder) => reminder.user === messageAuthor)
}

// converts the array of reminders for a user to a Discord friendly message
function remindersArrayToReturnString(remindersArray: Reminder[]) {
	return remindersArray.map(
		(reminder) =>
			`Reminder ${reminder.reminderNumber}: "${
				reminder.message
			}" will be sent on: ${String(new Date(reminder.time))} in <#${
				reminder.channel
			}>`
	)
}
