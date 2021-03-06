/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FileSystem from 'fs/promises'
import { google as Google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { authorize } from '../shared/googleApis.js'
import { Release } from '../typings.js'
import { Message } from 'discord.js'
import { Command } from '../typings.js'
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

// If modifying these scopes, delete token.json.
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const tokenPath = './src/config/sheetsToken.json'
const credentialsPath = './src/config/sheetsCredentials.json'
let authClient: OAuth2Client

try {
	const content = await FileSystem.readFile(credentialsPath, 'utf-8')
	authClient = await authorize({
		credentials: JSON.parse(content),
		scopes,
		tokenPath
	})
} catch (error) {
	throw error('No sheetsCredentials.json, check readme.md')
}

const sheets = Google.sheets({ version: 'v4', auth: authClient })

async function getNumberOfRows(
	spreadsheetId: string,
	range: string
): Promise<number> {
	return new Promise((resolve) => {
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: spreadsheetId,
				range: range
			},
			(_err, res) => {
				if (res && res.data.values) {
					const sheetsArray = res.data.values

					let n = sheetsArray.length - 1
					while (n > 0) {
						const row = sheetsArray[n]
						if (rowIsFilledOut(row)) {
							resolve(n + 1)
						}
						n--
					}
				} else {
					console.log('Res or Res Values was undefined in getNumberOfRows.')
				}
			}
		)
	})
}

async function getRowByIndex(
	index: number,
	spreadsheetId: string,
	range: string
): Promise<string[]> {
	return new Promise((resolve) => {
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: spreadsheetId,
				range: range
			},
			(_err, res) => {
				if (res && res.data.values) {
					resolve(res.data.values[index])
				}
				console.log('Res or Res values not defined in getRowByIndex')
				resolve([])
			}
		)
	})
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
