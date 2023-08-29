import { promisify } from 'util'
import { exec } from 'child_process'
import { readdir } from 'fs/promises'

import {
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	StreamType,
	AudioPlayerStatus
} from '@discordjs/voice'
import { updateBotStatus } from '../../main'

const promiseExec = promisify(exec)
// TODO: don't hardcode this!
export const tmpDirectory = '/home/buffet/buffetbotjs/tmp'
export const audioQueue: string[] = []
export let currentPlayerState:
	| 'Idle'
	| 'Buffering'
	| 'Playing'
	| 'AutoPaused'
	| 'Paused' = 'Idle'

// TODO: Make this not localize to file so it can be used in both servers.
export const player = createAudioPlayer({
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

export async function saveYoutubeVideoToOgg(videoId: string) {
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
		`yt-dlp --extract-audio --paths ${tmpDirectory} --output ${videoId} --no-playlist "https://www.youtube.com/watch?v=${videoId}"`
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

export function playAudio(filename: string) {
	const audioResource = createAudioResource(filename, {
		inputType: StreamType.Opus
	})

	player.play(audioResource)
}

export async function downloadPlaylist(playlistUrl: string) {
	const playlistId = new URL(playlistUrl).searchParams.get('list')

	if (!playlistId) {
		return undefined
	}

	await promiseExec(
		`yt-dlp --extract-audio --paths "${tmpDirectory}/${playlistId}" --output '%(playlist_index)s-%(id)s' --compat-options no-youtube-unavailable-videos --yes-playlist "${playlistUrl}"`
	)

	return playlistId
}
