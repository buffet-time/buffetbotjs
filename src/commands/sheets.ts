/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	type Command,
	type MediaChannels,
	MediaTypeInfoObject,
	Release
} from '../types/typings'
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { siteEndpoint } from '../assets/endpoints'
import {
	currentPeople,
	mediaSpreadsheetUsers
} from '../assets/spreadsheetUsers'
import { ProperFetch } from '../properFetch'

export {
	getNumberOfRows,
	getRowByIndex,
	sheetsCommand,
	getSheetsRowMessage,
	rowIsFilledOut
}
const sheetsCommand: Command = {
	name: 'sheets',
	description:
		'Spits out the row you specify if you have media spreadsheets setup for the server',
	options: [
		{
			name: 'row',
			description: 'Which row to retrieve',
			type: ApplicationCommandOptionType.Integer,
			required: true
		},
		{
			name: 'sheettype',
			description:
				'The media type of the spreadsheet you want to retrieve from',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: 'Music', value: 'Music' },
				{ name: 'Games', value: 'Games' },
				{ name: 'Movies', value: 'Movies' },
				{ name: 'TV', value: 'tv' }
			]
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		const rowNum = interaction.options.getInteger('row')
		if (!rowNum) {
			return { content: 'Must pass a number for the row variable.' }
		}

		const sheetType = interaction.options.getString(
			'sheettype'
		) as MediaChannels
		if (!sheetType) {
			return {
				content: 'Must pass one of the valid options for sheetType variable.'
			}
		}

		const massagedRowNum = rowNum - 2

		let row: string[] | undefined
		let name = ''
		let mediaInfo: MediaTypeInfoObject | undefined
		let notMusic = false

		if (
			mediaSpreadsheetUsers.some((person) => {
				if (interaction.user.id === person.userId) {
					mediaInfo = person[sheetType]
					name = person.personsName
					return true
				}
				return false
			})
		) {
			row = await getRowByIndex(massagedRowNum, mediaInfo!.id, mediaInfo!.range)

			if (row && sheetType !== 'Music') {
				notMusic = true
			}

			if (row && rowIsFilledOut(row, notMusic)) {
				return { content: `${name}: ${getSheetsRowMessage(sheetType, row)}` }
			}

			return { content: 'Specified row is not filled out' }
		}

		return {
			content: `Command can only be used by: ${currentPeople}. If you want to access talk to Buffet`
		}
	}
}

async function getNumberOfRows(
	id: string,
	range: string
): Promise<number | undefined> {
	try {
		// TODO: cleanup hardcoded ports
		return (await await ProperFetch(
			`${siteEndpoint}/Sheets?id=${id}&range=${range}&rows=true&nonmusic=true`
		)) as number
	} catch (error) {
		console.log(error)
		return undefined
	}
}

async function getRowByIndex(
	index: number,
	id: string,
	range: string
): Promise<string[] | undefined> {
	try {
		return (await await ProperFetch(
			`${siteEndpoint}/Sheets?id=${id}&range=${range}&index=${index}`
		)) as string[]
	} catch (error) {
		console.log(error)
		return undefined
	}
}

function getSheetsRowMessage(type: MediaChannels, row: string[]): string {
	switch (type) {
		case 'Music': {
			return `${row[Release.artist].trim()} - ${row[
				Release.name
			].trim()} (${row[Release.year].trim()} ${row[Release.type].trim()}) ${row[
				Release.score
			].trim()}/10 ~ ${row[Release.comments].trim()}`
		}
		case 'Games': {
			return `${row[0]} (${row[3]} - ${row[1]}) ${row[2]}/10 ~ ${row[4]}`
		}
		case 'Movies':
		case 'TV': {
			return `${row[0]} (${row[2]}) ${row[1]}/10 ~ ${row[3]}`
		}
	}
}

function rowIsFilledOut(
	row: string[] | undefined,
	nonMusic?: boolean
): boolean {
	if (nonMusic) {
		if (row && row[0] && row[1] && row[2] && row[3] && row[4]) {
			return true
		}
		return false
	}

	if (
		row &&
		row[Release.score] &&
		row[Release.comments] &&
		row[Release.artist] &&
		row[Release.name] &&
		row[Release.type] &&
		row[Release.year] &&
		row[Release.genre]
	) {
		return true
	}
	return false
}
