import { promisify } from 'util'
import { exec } from 'child_process'
import { readdir } from 'fs/promises'

import {
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	joinVoiceChannel,
	getVoiceConnection,
	StreamType,
	AudioPlayerStatus
} from '@discordjs/voice'
import type { VoiceChannel } from 'discord.js'
import { updateBotStatus } from './main'

const promiseExec = promisify(exec)
const tmpDirectory = '/home/ubuntu/buffetbotjs/tmp'
const audioQueue: string[] = []
let currentPlayerState:
	| 'Idle'
	| 'Buffering'
	| 'Playing'
	| 'AutoPaused'
	| 'Paused' = 'Idle'

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause
	}
})

player.on('error', (error) => {
	console.error(`Error: ${error.message}`)
})

player.on(AudioPlayerStatus.Idle, () => {
	currentPlayerState = 'Idle'
	if (audioQueue.length > 0) {
		playAudio(audioQueue[0])
		audioQueue.splice(0, 1)
	}
	updateBotStatus('Audio: Idle')
})

player.on(AudioPlayerStatus.Buffering, () => {
	currentPlayerState = 'Buffering'
	updateBotStatus('Audio: Buffering')
})

player.on(AudioPlayerStatus.Playing, () => {
	currentPlayerState = 'Playing'
	updateBotStatus('Audio: Playing')
})

player.on(AudioPlayerStatus.AutoPaused, () => {
	currentPlayerState = 'AutoPaused'
	updateBotStatus('Audio: AutoPaused')
})

player.on(AudioPlayerStatus.Paused, () => {
	currentPlayerState = 'Paused'
	updateBotStatus('Audio: Paused')
})

async function saveYoutubeVideoToOgg(videoId: string) {
	const eventualFilename = `${tmpDirectory}/${videoId}.opus`
	const newMusicFileName = `${videoId}.opus`

	const fileNames = await readdir(tmpDirectory)
	const fileExists = fileNames.find((file) => file === newMusicFileName)

	if (fileExists) {
		// if the ogg already exists skip the rest, its unecessary work!
		return eventualFilename
	}

	// Download video from videoId passed using yt-dlp
	await promiseExec(
		`yt-dlp --extract-audio --paths ${tmpDirectory} --output ${videoId} "https://www.youtube.com/watch?v=${videoId}"`
	)

	return eventualFilename
}

// https://stackoverflow.com/a/9102270/4830093
function getIdFromYouTubeUrl(url: string) {
	const regExp =
		// eslint-disable-next-line no-useless-escape
		/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
	const match = url.match(regExp)
	if (match && match[2].length == 11) {
		return match[2]
	} else {
		return false
	}
}

// Alphanumeric & - & _ & only 11 characters
function looseValidateYouTubeId(youtubeId: string) {
	const regExp = /^[a-zA-Z0-9-_]+$/

	if (youtubeId.match(regExp) && youtubeId.length === 11) {
		return true
	}
	return false
}

export function validateUrlOrId(userInput: string) {
	let youtubeID = ''
	const idFromUrl = getIdFromYouTubeUrl(userInput)
	if (looseValidateYouTubeId(userInput)) {
		// valid youtube id was passed
		youtubeID = userInput
	} else if (idFromUrl) {
		// Valid youtube video URL passed
		youtubeID = idFromUrl
	} else {
		return { content: `Error(3): Passed invalid video: ${userInput}` }
	}
	return youtubeID
}

function playAudio(filename: string) {
	const audioResource = createAudioResource(filename, {
		inputType: StreamType.Opus
	})

	player.play(audioResource)
}

export async function playYoutubeVideo(youtubeId: string) {
	const filename = await saveYoutubeVideoToOgg(youtubeId)
	playAudio(filename)
}

export async function addVideoToQueue(youtubeId: string) {
	const filename = await saveYoutubeVideoToOgg(youtubeId)

	if (currentPlayerState === 'Idle') {
		playAudio(filename)
	} else {
		audioQueue.push(filename)
	}
}

export function joinVoice(voiceChannel: VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		guildId: voiceChannel.guild!.id,
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

export function leaveChannel(guildId: string) {
	const connection = getVoiceConnection(guildId)
	connection?.destroy()
	updateBotStatus('Team Fortress 2')
}

export function stopPlayer() {
	const stop = player.stop()

	if (!stop) {
		console.warn('Player was not stopped correctly.')
	}
}

export function pausePlayer() {
	const pause = player.pause(true)

	if (!pause) {
		console.warn('Player was not paused correctly.')
	}
}

export function unpausePlayer() {
	const unpause = player.unpause()

	if (!unpause) {
		console.warn('Player was not unpaused correctly.')
	}
}
