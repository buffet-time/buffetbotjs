/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FileSystem from 'fs/promises'
import { google as Google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { authorize } from '../shared/googleApis.js'
import { Release } from '../typings.js'

export { getNumberOfRows, getRowByIndex }

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
	range: string,
	zach?: boolean // to support different method of checking
): Promise<number> {
	return new Promise((resolve) => {
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: spreadsheetId,
				range: range
			},
			(_err, res) => {
				const sheetsArray = res!.data.values!
				if (zach) {
					let n = sheetsArray.length - 1
					while (n > 0) {
						const row = sheetsArray[n]
						if (
							row[Release.score] &&
							row[Release.comments] &&
							row[Release.artist] &&
							row[Release.name] &&
							row[Release.type] &&
							row[Release.year] &&
							row[Release.genre]
						) {
							resolve(n + 1)
						}
						n--
					}
				}
				resolve(sheetsArray.length)
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
				resolve(res!.data.values![index])
			}
		)
	})
}
