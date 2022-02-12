import { Release } from '../typings.js'
import { CommandInteraction } from 'discord.js'
import { Command } from '../typings.js'
import fetch from 'node-fetch'
import {
	buffetSpreadsheetId,
	zachSpreadsheetId,
	buffetRange,
	zachRange,
	stoneRange,
	stoneSpreadsheetId
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
		if (!rowNum) {
			return { content: 'Must pass a number' }
		}
		const massagedRowNum = rowNum - 2

		let row: string[] | undefined
		let name = ''

		switch (interaction.user.id) {
			case '136494200391729152':
				name = 'Buffet'
				row = await getRowByIndex(
					massagedRowNum,
					buffetSpreadsheetId,
					buffetRange
				)
				break
			case '134862353660379137':
				name = 'Zach'
				row = await getRowByIndex(massagedRowNum, zachSpreadsheetId, zachRange)
				break
			case '130804955014627328':
				name = 'Stonepaq'
				row = await getRowByIndex(
					massagedRowNum,
					stoneSpreadsheetId,
					stoneRange
				)
				break
			default:
				return {
					content:
						'Command can only be used by: Buffet, Zachohlic, and Stonepaq. If you want to access talk to Buffet'
				}
		}

		if (row && rowIsFilledOut(row)) {
			return { content: `${name}: ${getSheetsRowMessage(row)}` }
		} else {
			return { content: 'Specified row is not filled out' }
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
				`http://localhost:3000/Sheets?id=${id}&range=${range}&rows=true`
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
				`http://localhost:3000/Sheets?id=${id}&range=${range}&index=${index}`
			)
		).json()) as string[]
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

function rowIsFilledOut(row: string[] | undefined): boolean {
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
	} else {
		return false
	}
}
