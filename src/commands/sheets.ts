/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FileSystem from 'fs/promises'
import { google as Google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { authorize } from '../shared/googleApis.js'

export { getNumberOfRows, getRowByIndex }

// If modifying these scopes, delete token.json.
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const tokenPath = './src/config/sheetsToken.json'
const credentialsPath = './src/config/sheetsCredentials.json'
const spreadsheetId = '18V5oypFBW3Bu_tHxfTL-iSbb9ALYrCJlMwLhpPmp72M'
const range = 'Main!A2:G'
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

async function getNumberOfRows(): Promise<number> {
	return new Promise((resolve) => {
		sheets.spreadsheets.values.get(
			{
				spreadsheetId: spreadsheetId,
				range: range
			},
			(_err, res) => {
				resolve(res!.data.values!.length)
			}
		)
	})
}

async function getRowByIndex(index: number): Promise<string[]> {
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
