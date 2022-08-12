/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	type MusicSpreadsheetInfo,
	Release,
	type MediaChannels
} from '../typings.js'
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction
} from 'discord.js'
import { Command } from '../typings.js'
import fetch from 'node-fetch'
import { siteEndpoint } from '../assets/endpoints.js'
import { currentPeople, mediaSpreadsheetUsers } from '../spreadsheetUsers.js'

export {
	getNumberOfRows,
	getRowByIndex,
	sheetsCommand,
	getSheetsRowMessage,
	rowIsFilledOut
}
const sheetsCommand: Command = {
	name: 'sheets',
	description: 'For Buffet and Zacoholic to share scores of music',
	options: [
		{
			name: 'row',
			description: 'Which row to retrieve',
			type: ApplicationCommandOptionType.Integer,
			required: true
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		const rowNum = interaction.options.getInteger('row')
		if (!rowNum) {
			return { content: 'Must pass a number' }
		}
		const massagedRowNum = rowNum - 2

		let row: string[] | undefined
		let name = ''
		let music: MusicSpreadsheetInfo | undefined

		if (
			mediaSpreadsheetUsers.some((person) => {
				if (interaction.user.id === person.userId) {
					music = person.Music
					name = person.personsName
					return true
				}
				return false
			})
		) {
			row = await getRowByIndex(massagedRowNum, music!.id, music!.range)

			if (row && rowIsFilledOut(row)) {
				return { content: `${name}: ${getSheetsRowMessage('Music', row)}` }
			} else {
				return { content: 'Specified row is not filled out' }
			}
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
		return (await (
			await fetch(
				`${siteEndpoint}/Sheets?id=${id}&range=${range}&rows=true&nonmusic=true`
			)
		).json()) as number
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
		return (await (
			await fetch(
				`${siteEndpoint}/Sheets?id=${id}&range=${range}&index=${index}`
			)
		).json()) as string[]
	} catch (error) {
		console.log(error)
		return undefined
	}
}

function getSheetsRowMessage(type: MediaChannels, row: string[]): string {
	switch (type) {
		case 'Music':
			return `${row[Release.artist].trim()} - ${row[
				Release.name
			].trim()} (${row[Release.year].trim()} ${row[Release.type].trim()}) ${row[
				Release.score
			].trim()}/10 ~ ${row[Release.comments].trim()}`
		case 'Games':
			return `${row[0]} (${row[3]} - ${row[1]}) ${row[2]}/10 ~ ${row[4]}`
		case 'Movies':
		case 'TV':
			return `${row[0]} (${row[2]}) ${row[1]}/10 ~ ${row[3]}`
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
