/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../typings.js'
import nodeFetch from 'node-fetch'

export { femboyCommand }

const femboyCommand: Command = {
	name: 'femboy',
	async execute() {
		try {
			return {
				options: {
					files: [
						await (
							await nodeFetch(`http://localhost:3000/Reddit/Top/Femboy`)
						).json()
					]
				}
			}
		} catch (error) {
			console.log(`Error in Femboy command: ${error}`)
			return { content: `Error` }
		}
	}
}
