/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommandInteraction } from 'discord.js'
import FileSystem from 'fs/promises'
import IsEqual from 'lodash.isequal'
import { updateReminders } from '../buffetBotMain.js'
import { Command, Reminder } from '../typings.js'

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
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'amount',
					description: 'The number of minutes/ seconds/ etc',
					type: 'INTEGER',
					required: true
				},
				{
					name: 'timetype',
					description: 'asdf',
					type: 'STRING',
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
					type: 'CHANNEL',
					required: true
				},
				{
					name: 'message',
					description: 'Which reminder number to remove',
					type: 'STRING',
					required: true
				}
			]
		},
		{
			name: 'remove',
			description: 'Remove Reminders sub command',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'reminder',
					description: 'Which reminder number to remove',
					type: 'INTEGER',
					required: true
				}
			]
		},
		{
			name: 'view',
			description: 'View Reminders sub command',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'reminder',
					description: 'Which reminder to view',
					type: 'INTEGER',
					required: true
				}
			]
		}
	],
	async execute(interaction: CommandInteraction) {
		const subCommandName = interaction.options.getSubcommand()

		switch (subCommandName) {
			case 'add': {
				const returnText = await addReminder(interaction)
				updateReminders(await getAllReminders())
				return { content: returnText }
			}
			case 'remove': {
				const returnText = await removeReminder(
					interaction.user.id,
					interaction.options.getInteger('reminder')!
				)
				updateReminders(await getAllReminders())
				return { content: returnText }
			}
			case 'view': {
				const reminderView = await viewReminders(interaction)
				return {
					content: reminderView
				}
			}
			default:
				return {
					content: 'Incorrect invocation of the !reminders command.'
				}
		}
	}
}

// TODO: clean up incorrect command passing to catch more
// handles the !reminders add command
async function addReminder(interaction: CommandInteraction): Promise<string> {
	try {
		const messageText = interaction.options.getString('message')!,
			messageTimeType = interaction.options.getString('timetype')!,
			messageTimeAmount = interaction.options.getInteger('amount')!,
			messageAuthor = interaction.user.id,
			timestamp = getTime(messageTimeAmount, messageTimeType),
			newReminder: Reminder = {
				reminderNumber: 1,
				time: timestamp,
				user: messageAuthor,
				message: messageText,
				channel: interaction.options.getChannel('channel')!.id
			}
		let remindersJson: Reminder[]
		if (
			!newReminder ||
			!newReminder.time ||
			!newReminder.channel ||
			timestamp === 0
		) {
			return 'Incorrect invocation of the add reminders command. See !help'
		}
		try {
			const data = await FileSystem.readFile(remindersFilePath, 'utf8'),
				parsedData: Reminder[] = JSON.parse(data),
				availableReminderNumber = getAvailableReminderNumber(
					parsedData,
					messageAuthor
				)
			if (availableReminderNumber) {
				newReminder.reminderNumber = availableReminderNumber
				parsedData.push(newReminder)
				remindersJson = parsedData
			} else {
				const tempArray = []
				tempArray.push(newReminder)
				remindersJson = tempArray
			}
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
		const data = await FileSystem.readFile(remindersFilePath, 'utf8'),
			parsedData: Reminder[] = JSON.parse(data),
			remindersArray = getRemindersByAuthor(parsedData, messageAuthor),
			objectToRemoveArray = remindersArray.filter((reminder) => {
				return reminder.reminderNumber === reminderNumberToRemove
			})
		if (!objectToRemoveArray[0]) {
			return "The number passed doesn't exist."
		}
		const reminderToRemove = objectToRemoveArray[0],
			indexToRemove = parsedData.findIndex((reminder) => {
				return IsEqual(reminder, reminderToRemove)
			})
		parsedData.splice(indexToRemove, 1)

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
async function viewReminders(interaction: CommandInteraction): Promise<string> {
	try {
		const data = await FileSystem.readFile(remindersFilePath, 'utf8'),
			parsedData: Reminder[] = JSON.parse(data)
		if (parsedData === []) {
			return 'You have no saved reminders.'
		}
		const arrayOfUsers = parsedData.filter((reminder) => {
			return reminder.user === interaction.user.id
		})
		if (!arrayOfUsers[0]) {
			return 'You have no saved reminders.'
		} else if (interaction.options.getInteger('reminder')) {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, interaction.user.id).filter(
					(reminder) => {
						return (
							reminder.reminderNumber ===
							interaction.options.getInteger('reminder')
						)
					}
				)
			).join(`\n`)
		} else {
			return remindersArrayToReturnString(
				getRemindersByAuthor(parsedData, interaction.user.id)
			).join(`\n`)
		}
	} catch (error) {
		return 'Error in viewReminders().'
	}
}

// returns entire array of reminders
export async function getAllReminders(): Promise<Reminder[]> {
	try {
		const data = await FileSystem.readFile(remindersFilePath, 'utf8')
		return JSON.parse(data)
	} catch {
		return []
	}
}

// TODO: handle making sure number doesnt go past max
// Gets the time the reminder should be sent
function getTime(amount: number, type: string) {
	// if (reminderTime > Number.MAX_SAFE_INTEGER || reminderTime === 0) {
	//     return 'fail'
	// }
	const currentTime = Date.now(),
		amountConverted = amount * 1000 // so that adding 1 = adding 1 second not 1 ms
	switch (type) {
		case 'seconds':
			return currentTime + amountConverted
		case 'minutes':
			return currentTime + amountConverted * 60
		case 'hours':
			return currentTime + amountConverted * 3600
		case 'days':
			return currentTime + amountConverted * 86400
		case 'weeks':
			return currentTime + amountConverted * 604800
		case 'months': // 30 days
			return currentTime + amountConverted * 2592000
		case 'years': // 365 days
			return currentTime + amountConverted * 31536000
		default:
			return 0
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
	).map((reminder) => {
		return reminder.reminderNumber
	})
	let n = 1
	const length = reminderNumberArray.length + 2
	while (n < length) {
		if (!reminderNumberArray.includes(n)) {
			return n
		}
		n++
	}
}

// Get all Reminder objects for given user
function getRemindersByAuthor(parsedData: Reminder[], messageAuthor: string) {
	return parsedData.filter((reminder) => {
		return reminder.user === messageAuthor
	})
}

// converts the array of reminders for a user to a Discord friendly message
function remindersArrayToReturnString(remindersArray: Reminder[]) {
	return remindersArray.map((reminder) => {
		const date = new Date(reminder.time)
		return `Reminder ${reminder.reminderNumber}: "${reminder.message}" will be sent on: ${date} in <#${reminder.channel}>`
	})
}
