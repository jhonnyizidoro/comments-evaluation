const fs = require('fs')

const sanitize = words => {
	return words.map(word => {
		word = word.toLowerCase()
		word = word.replace(/[-°!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/gm, ' ')
		word = word.replace(/[ ]{2,}/gm, ' ')
		word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		word = word.replace(/ $/gm, '')
		return word
	})
}

const getMetaData = comments => {
	const commentsMetaData = []
	const positiveWords = sanitize(fs.readFileSync('positive-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/))
	const negativeWords = sanitize(fs.readFileSync('negative-words.txt', {encoding: 'UTF-8'}).split(/\r?\n/))
	comments.forEach(comment => {
		const commentAsArray = comment.split(' ')
		const positiveWordsMatches = []
		const negativeWordsMatches = []
		commentAsArray.forEach(commentWord => {
			if (positiveWords.includes(commentWord)) {
				positiveWordsMatches.push(commentWord)
			}
			if (negativeWords.includes(commentWord)) {
				negativeWordsMatches.push(commentWord)
			}
		})
		commentsMetaData.push({
			comment,
			letters_count: comment.length,
			word_count: commentAsArray.length,
			positive_words: positiveWordsMatches,
			negative_words: negativeWordsMatches
		})
	})
	return commentsMetaData
}

const getComments = () => {

}