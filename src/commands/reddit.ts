import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			const returnedObject = (await (
				await nodeFetch(`http://localhost:3001/Reddit/Top/Femboy`)
			).json()) as { url: string }

			return {
				files: [returnedObject.url]
			}
		} catch (error) {
			return { content: `Error: ${error}` }
		}
	}
}
