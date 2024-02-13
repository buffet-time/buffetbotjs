import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import type { VoiceChannel } from 'discord.js'
import { readdir } from 'fs/promises'
import { updateBotStatus } from '../../main'
import {
	player,
	saveYoutubeVideoToOgg,
	currentPlayerState,
	playAudio,
	downloadPlaylist,
	audioQueue,
	tmpDirectory
} from './audioPlayer'

export function skipAudio() {
	const stop = player.stop()

	if (!stop) {
		console.warn('Player was not stopped correctly.')
	}
}
export function leaveChannel(guildId: string) {
	const connection = getVoiceConnection(guildId)
	connection?.destroy()
	updateBotStatus('Team Fortress 2')
}

export function pausePlayer() {
	const pause = player.pause(true)

	if (!pause) {
		console.warn('Player was not paused correctly.')
	}
}

export function resumePlayer() {
	const unpause = player.unpause()

	if (!unpause) {
		console.warn('Player was not unpaused correctly.')
	}
}

export function joinVoice(voiceChannel: VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		guildId: voiceChannel.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator
	})

	const subscription = connection?.subscribe(player)

	if (!subscription) {
		return {
			content:
				'Error(6): The bot must be in the voice channel first before playing a video!'
		}
	}

	return { content: `Joined ${voiceChannel.name}` }
}

export async function addVideoToQueue(youtubeId: string) {
	const filename = await saveYoutubeVideoToOgg(youtubeId)

	if (currentPlayerState === 'Idle') {
		playAudio(filename)
	} else {
		audioQueue.push(filename)
	}
}

export async function addPlaylistToQueue(youtubePlaylist: string) {
	const playlistId = await downloadPlaylist(youtubePlaylist)

	if (!playlistId) {
		return console.warn('Error downloading playlist.')
	}

	const files = await readdir(`${tmpDirectory}/${playlistId}`)
	try {
		files.forEach((file) => {
			audioQueue.push(`${tmpDirectory}/${playlistId}/${file}`)
		})
	} catch (error) {
		return console.warn('Error reading directory!')
	}

	if (currentPlayerState === 'Idle') {
		playAudio(audioQueue[0])
		audioQueue.splice(0, 1)
	}
}

export function clearQueue() {
	audioQueue.forEach(() => audioQueue.pop())
}
