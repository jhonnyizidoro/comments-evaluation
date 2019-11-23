const request = require('request')
const fs = require('fs')

//TODO: Busca os comentários com seus respectivos títulos e retorna um array com esses valores concatenados.
const fetchComments = () => new Promise(resolve => {
	request({
		uri: 'https://produto.mercadolivre.com.br/MLB-1227336288-calcas-masculina-jogger-elastico-exercito-camuflada-_JM?quantity=1&onAttributesExp=true#reco_item_pos=1&reco_backend=navigation_trend&reco_backend_type=function&reco_client=home_navigation-trend-recommendations&reco_id=0d4b0930-7ab7-45e6-a1c0-951c49ef2988&c_id=/home/navigation-trends-recommendations/element&c_element_order=2&c_uid=41c761ad-e300-4e80-a012-d5911ac69394',
	}, (error, response, body) => {
		const commentsTitle = body.match(/(?<=tooltip-full-body">)(.*)(?=<\/div>)/gm).slice(0, 3)
		const commentsBody = body.match(/(?<=tooltip-title">)(.*)(?=<\/h4>)/gm).slice(0, 3)
		resolve(commentsTitle.map((title, index) => `${commentsTitle[index]} ${commentsBody[index]}`))
	})
})

//TODO: Remove os acentos, letras maíscular e caracteres especiais
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

const getComments = async () => {
	let comments = await fetchComments()
	comments = sanitize(comments)
	comments = getMetaData(comments)
	console.log(comments)
}

getComments()