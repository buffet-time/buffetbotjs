/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Client, TextChannel } from 'discord.js'
import {
	getNumberOfRows,
	getRowByIndex,
	getSheetsRowMessage
} from './commands/sheets'
import { mediaSpreadsheetUsers } from './assets/spreadsheetUsers'
import type {
	MediaChannels,
	MediaSpreadsheetsUsers,
	SpreadsheetLengths
} from './types/typings'

const musicChannelId = '301931813947965440'
const gamesChannelId = '918879745716924446'
const moviesAndTvChannelId = '699099158702718996'

const spreadsheetLengths: SpreadsheetLengths = []

let musicChannel: TextChannel
let gamesChannel: TextChannel
let moviesAndTvChannel: TextChannel

function setupMediaSheetsAndChannels(client: Client<boolean>) {
	mediaSpreadsheetUsers.forEach(() =>
		spreadsheetLengths.push({ Games: 0, Movies: 0, Music: 0, TV: 0 })
	)

	musicChannel = client.channels.cache.get(musicChannelId) as TextChannel
	gamesChannel = client.channels.cache.get(gamesChannelId) as TextChannel
	moviesAndTvChannel = client.channels.cache.get(
		moviesAndTvChannelId
	) as TextChannel
}

async function getMediaSheetRow(
	spreadsheetInfo: MediaSpreadsheetsUsers,
	channel: MediaChannels,
	index: number
) {
	if (!spreadsheetInfo[channel]) return

	const tempLength = await getNumberOfRows(
		spreadsheetInfo[channel]!.id,
		spreadsheetInfo[channel]!.range
	)

	if (tempLength !== spreadsheetLengths[index][channel]) {
		if (!tempLength) {
			return
		}

		const row = await getRowByIndex(
			tempLength - 1,
			spreadsheetInfo[channel]!.id,
			spreadsheetInfo[channel]!.range
		)

		// if (row && rowIsFilledOut(row)) {
		// implement a new rowIsFilledOut()
		if (row) {
			// Prevents sending the first time the bot starts up
			if (spreadsheetLengths[index][channel] === 0) {
				spreadsheetLengths[index][channel] = tempLength
				return
			}

			switch (channel) {
				case 'Games':
					gamesChannel.send(
						`${spreadsheetInfo.personsName}: ${getSheetsRowMessage(
							'Games',
							row
						)}`
					)
					break
				case 'Music':
					musicChannel.send(
						`${spreadsheetInfo.personsName}: ${getSheetsRowMessage(
							'Music',
							row
						)}`
					)
					break
				case 'Movies':
					moviesAndTvChannel.send(
						`${spreadsheetInfo.personsName}: Movie - ${getSheetsRowMessage(
							'Movies',
							row
						)}`
					)
					break
				case 'TV':
					moviesAndTvChannel.send(
						`${spreadsheetInfo.personsName}: TV - ${getSheetsRowMessage(
							'TV',
							row
						)}`
					)
					break
			}

			spreadsheetLengths[index][channel] = tempLength
			return
		}
	}
}

export { getMediaSheetRow, setupMediaSheetsAndChannels }
