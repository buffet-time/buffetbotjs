import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'
import { siteEndpoint } from '../assets/endpoints.js'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			const returnedObject = (await (
				await nodeFetch(`${siteEndpoint}/Reddit/Top/Femboy`)
			).json()) as { url: string }

			return {
				files: [returnedObject.url]
			}
		} catch (error) {
			return { content: `Error in /femboy command: ${error}` }
		}
	}
}
