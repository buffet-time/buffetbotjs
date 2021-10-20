import { Release } from '../typings.js'
import { CommandInteraction } from 'discord.js'
import { Command } from '../typings.js'
import fetch from 'node-fetch'
import {
	buffetSpreadsheetId,
	zachSpreadsheetId,
	buffetRange,
	zachRange
} from '../buffetBotMain.js'

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
			type: 'INTEGER',
			required: true
		}
	],
	async execute(interaction: CommandInteraction) {
		const rowNum = interaction.options.getInteger('row')
		if (!rowNum) return { content: 'Must pass a number' }

		if (interaction.user.id === '136494200391729152') {
			const row = await getRowByIndex(
				rowNum - 2,
				buffetSpreadsheetId,
				buffetRange
			)
			if (row && rowIsFilledOut(row)) {
				return { content: `Buffet: ${getSheetsRowMessage(row)}` }
			} else {
				return { content: 'Specified row is not filled out' }
			}
		} else if (interaction.user.id === '134862353660379137') {
			const row = await getRowByIndex(rowNum - 2, zachSpreadsheetId, zachRange)
			if (row && rowIsFilledOut(row)) {
				return { content: `Zach: ${getSheetsRowMessage(row)}` }
			} else {
				return { content: 'Specified row is not filled out' }
			}
		} else {
			return { content: 'Command can only be used by Buffet or Zach' }
		}
	}
}

async function getNumberOfRows(
	id: string,
	range: string
): Promise<number | undefined> {
	try {
		const response = await fetch(
			`http://localhost:3000/Sheets?id=${id}&range=${range}&rows=true`
		)
		return (await response.json()) as number
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
		const response = await fetch(
			`http://localhost:3000/Sheets?id=${id}&range=${range}&index=${index}`
		)
		return (await response.json()) as string[]
	} catch (error) {
		console.log(error)
		return undefined
	}
}

function getSheetsRowMessage(row: string[]): string {
	return `${row[Release.artist].trim()} - ${row[Release.name].trim()} (${row[
		Release.year
	].trim()} ${row[Release.type].trim()}) ${row[
		Release.score
	].trim()}/10 ~ ${row[Release.comments].trim()}`
}

function rowIsFilledOut(row: string[]): boolean {
	if (
		row[Release.score] &&
		row[Release.comments] &&
		row[Release.artist] &&
		row[Release.name] &&
		row[Release.type] &&
		row[Release.year] &&
		row[Release.genre]
	) {
		return true
	} else return false
}
