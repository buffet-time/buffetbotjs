import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { femboyCommand }

// works
const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			return {
				files: [
					await (
						await nodeFetch(`http://localhost:3000/Reddit/Top/Femboy`)
					).json()
				]
			}
		} catch (error) {
			console.log(`Error in Femboy command: ${error}`)
			return { content: `Error` }
		}
	}
}
