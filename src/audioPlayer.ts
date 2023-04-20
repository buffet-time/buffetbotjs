import {
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	joinVoiceChannel,
	getVoiceConnection
} from '@discordjs/voice'
import type { VoiceChannel } from 'discord.js'
import ffmpeg from 'fluent-ffmpeg'
import ytdl from 'ytdl-core'
// import fs from 'node:fs/promises'
// import path from 'node:path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// for refernce
// https://github.com/fent/node-ytdl-core/blob/master/example/convert_to_mp3.js

const tempDirectory = `${__dirname}/assets/temp`

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause
	}
})

player.on('error', (error) => {
	console.error(`Error: ${error.message}`)
})

// async function emptyTempFolder() {
// 	for (const file of await fs.readdir(tempDirectory)) {
// 		await fs.unlink(path.join(tempDirectory, file))
// 	}
// }

function saveYoutubeVideoToMp3(videoId: string) {
	// prevents collisions (given the small usage UUID/ Guid is not needed)
	const start = Date.now()

	const stream = ytdl(videoId, {
		quality: 'highestaudio'
	})

	const filename = `${tempDirectory}/${start}-${videoId}.ogg`
	ffmpeg(stream).audioBitrate(128).save(filename)

	return filename
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

// function playVideo()

export function playYoutubeVideo(id: string) {
	let youtubeUrl = ''
	if (ytdl.validateID(id)) {
		// Valid youtube video ID passed
		youtubeUrl = `http://www.youtube.com/watch?v=${id}`
	} else if (ytdl.validateURL(id)) {
		// Valid youtube video URL passed
		youtubeUrl = id
	} else {
		return { content: 'Error(3): Passed invalid video' }
	}

	const filename = saveYoutubeVideoToMp3(youtubeUrl)
	const audioResource = createAudioResource(filename)

	player.play(audioResource)
	return {}
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
