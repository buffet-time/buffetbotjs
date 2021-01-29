import { Words } from '../assets/words.js'

let words = Words

export function getAcronym(word: string) {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	} else {
		return generatedAcronym
	}
}

// takes the word and returns an array of random words
// starting with each given letter
function getWordsFromProvidedAcronym(acronym: string): string[] {
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0
	let wordsArray: string[]
	let generatedWord = ''

	return acronymArray.map((letter: string) => {
		if (lengthOfWords > 2000) {
			return 'F'
		} else {
			wordsArray = words[letter]
			generatedWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]
			lengthOfWords += generatedWord.length + 1
			return generatedWord
		}
	})
}
