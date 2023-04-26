import {
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	joinVoiceChannel,
	getVoiceConnection
} from '@discordjs/voice'
import type { VoiceChannel } from 'discord.js'
// import fs from 'node:fs/promises'
// import path from 'node:path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { promisify } from 'util'
import { exec } from 'child_process'
const promiseExec = promisify(exec)

const __dirname = dirname(fileURLToPath(import.meta.url))
const tmpDirectory = '/home/ubuntu/buffetbotjs/tmp'

// for refernce
// https://github.com/fent/node-ytdl-core/blob/master/example/convert_to_mp3.js

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause
	}
})

player.on('error', (error) => {
	console.error(`Error: ${error.message}`)
})

async function downloadYoutubeUrlToVideo(videoId: string, outputVideo: string) {
	// yt-dlp -o funny_video.flv "https://some/video"
	await promiseExec(
		`yt-dlp -o ${outputVideo} "https://www.youtube.com/watch?v=${videoId}"`
	)
}

async function ffmpegConvertVideoToAudio(
	inputVideo: string,
	outputAudio: string
) {
	// ffmpeg -i 1682540145477-dQw4w9WgXcQ.webm -b:a 128K -vn /home/ubuntu/buffetbotjs/1682540145477-dQw4w9WgXcQ.ogg
	await promiseExec(`ffmpeg -i ${inputVideo} -b:a 128K -vn ${outputAudio}`)
}

async function saveYoutubeVideoToOgg(videoId: string) {
	const baseDirectory = `${tmpDirectory}/${videoId}`
	const videoFile = `${baseDirectory}.webm`
	const musicFile = `${baseDirectory}.ogg`

	// Download video from videoId passed using yt-dlp
	await downloadYoutubeUrlToVideo(videoId, videoFile)

	// convert the webm to ogg with ffmpeg
	await ffmpegConvertVideoToAudio(videoFile, musicFile)

	// remove the video file now that the audio file is done processing
	await promiseExec(`rm -rf ${videoFile}`)

	return musicFile
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

function looseValidateYouTube() {
	//
}

export function playYoutubeVideo(id: string) {
	let youtubeUrl = ''
	if (getIdFromYouTubeUrl(id)) {
		youtubeUrl = id
	} else if (ytdl.validateURL(id)) {
		// Valid youtube video URL passed
		youtubeUrl = id
	} else {
		return { content: `Error(3): Passed invalid video: ${id}` }
	}

	const filename = saveYoutubeVideoToOgg(youtubeUrl)
	const audioResource = createAudioResource(filename)

	player.play(audioResource)
	return {}
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

	return {}
}

export function leaveChannel(guildId: string) {
	const connection = getVoiceConnection(guildId)
	connection?.destroy()
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
