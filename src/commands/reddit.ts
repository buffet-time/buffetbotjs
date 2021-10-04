import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	description: 'Posts the latest femboy',
	async execute() {
		try {
			const response = await nodeFetch(
				`http://localhost:3000/Reddit/Top/Femboy`
			)
			return {
				files: [(await response.json()) as string]
			}
		} catch (error) {
			return { content: `Error: ${error}` }
		}
	}
}
