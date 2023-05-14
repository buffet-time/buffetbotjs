import {
	ApplicationCommandOptionType,
	type ChatInputCommandInteraction,
	VoiceChannel
} from 'discord.js'
import type { Command } from '../types/typings'
import {
	pausePlayer,
	unpausePlayer,
	stopPlayer,
	playYoutubeVideo,
	joinVoice,
	leaveChannel,
	addVideoToQueue,
	validateUrlOrId
} from '../audioPlayer'

export { audioCommand }

const audioCommand: Command = {
	name: 'audio',
	description: 'Play audio into voice channel',
	options: [
		{
			name: 'join',
			description: 'Join the given voice channel',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'channel',
					description: 'the voice channel to play in',
					type: ApplicationCommandOptionType.Channel,
					required: true
				}
			]
		},
		{
			name: 'leave',
			description: 'Leaves voice channel in the server',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'play',
			description: 'Play audio from a YouTube video',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'video',
					description: 'YouTube video ID or url',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'queue',
			description: 'Add video to bot queue',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'video',
					description: 'YouTube video ID or url',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'pause',
			description: 'Pause the audio.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'resume',
			description: 'Resume the audio.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'stop',
			description: 'Stop the audio.',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	async execute(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'join': {
				const voiceChannel = interaction.options.getChannel('channel')
				if (!(voiceChannel instanceof VoiceChannel)) {
					return {
						content: 'Error(1): You have to select a valid voice channel.'
					}
				}

				return joinVoice(voiceChannel)
			}
			case 'leave': {
				if (!interaction.guild?.id) {
					return { content: 'Error(4): invalid GuildID in leave command' }
				}

				leaveChannel(interaction.guild.id)
				return { content: 'Left voice channel.' }
			}
			case 'play': {
				const video = interaction.options.getString('video')

				if (!video) {
					return {
						content: 'Error(2): Passed invalid video.'
					}
				}

				const youtubeId = validateUrlOrId(video.trim())

				if (typeof youtubeId !== 'string') {
					// return error response if we dont get back a string
					return youtubeId
				}

				playYoutubeVideo(youtubeId)

				return { content: 'Audio playing (or soon)' }
			}
			case 'queue': {
				const video = interaction.options.getString('video')

				if (!video) {
					return {
						content: 'Error(2): Passed invalid video.'
					}
				}

				const youtubeId = validateUrlOrId(video.trim())

				if (typeof youtubeId !== 'string') {
					// return error response if we dont get back a string
					return youtubeId
				}

				addVideoToQueue(youtubeId)

				return {
					content: 'Audio being added to queue'
				}
			}
			case 'pause': {
				pausePlayer()
				return { content: 'Paused audio.' }
			}
			case 'resume': {
				unpausePlayer()
				return { content: 'Resume audio.' }
			}
			case 'stop': {
				stopPlayer()
				return { content: 'Stopped audio.' }
			}
			default: {
				return {
					content: 'Incorrect invocation of audio command'
				}
			}
		}
	}
}
