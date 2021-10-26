import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			return {
				files: [
					(await (
						await nodeFetch(`http://localhost:3000/Reddit/Top/Femboy`)
					).json()) as string
				]
			}
		} catch (error) {
			return { content: `Error: ${error}` }
		}
	}
}
