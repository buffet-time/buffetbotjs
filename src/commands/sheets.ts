import { Release } from '../typings.js'
import { Message } from 'discord.js'
import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'
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
	async execute(message: Message, args: string[]) {
		if (args.length !== 1 && !Number(args[0])) {
			return { content: 'Error' }
		}
		if (message.author.id === '136494200391729152') {
			const row = await getRowByIndex(
				Number(args[0]) - 2,
				buffetSpreadsheetId,
				buffetRange
			)
			if (rowIsFilledOut(row)) {
				return { content: `Buffet: ${getSheetsRowMessage(row)}` }
			} else {
				return { content: 'Specified row is not filled out' }
			}
		} else if (message.author.id === '134862353660379137') {
			const row = await getRowByIndex(
				Number(args[0]) - 2,
				zachSpreadsheetId,
				zachRange
			)
			if (rowIsFilledOut(row)) {
				return { content: `Zach: ${getSheetsRowMessage(row)}` }
			} else {
				return { content: 'Specified row is not filled out' }
			}
		} else {
			return { content: 'Command can only be used by Buffet or Zach' }
		}
	}
}

async function getNumberOfRows(id: string, range: string): Promise<number> {
	return (
		await nodeFetch(
			`http://localhost:3000/Sheets?id=${id}&range=${range}&rows=true`
		)
	).json()
}

async function getRowByIndex(
	index: number,
	id: string,
	range: string
): Promise<string[]> {
	return (
		await nodeFetch(
			`http://localhost:3000/Sheets?id=${id}&range=${range}&index=${index}`
		)
	).json()
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
	} else {
		return false
	}
}
