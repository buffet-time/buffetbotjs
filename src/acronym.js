import { Words } from '../assets/words.js'

let words = Words

// TODO: make async
export function getAcronym(word) {
	const generatedAcronym = getWordsFromProvidedAcronym(word)
		.toString()
		.replace(/,/g, '  ')
	if (generatedAcronym.length > 2000 || generatedAcronym === 'F') {
		return "Yo gamer, that acronym was too larnge for discord. When's hotline?"
	} else {
		return generatedAcronym
	}
}

function getWordsFromProvidedAcronym(acronym) {
	const acronymArray = acronym.toLowerCase().split('')
	let lengthOfWords = 0
	let wordsArray
	let generatedWord = ''

	return acronymArray.map((letter) => {
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
