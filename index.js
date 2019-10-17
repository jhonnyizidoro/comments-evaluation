const request = require('request')

const fetchComments = () => new Promise(resolve => {
	request({
		uri: 'https://produto.mercadolivre.com.br/MLB-1285959401-sapatnis-masculino-polo-energy-varias-cores-901-1-cinto-_JM?quantity=1&onAttributesExp=true#reco_item_pos=1&reco_backend=navigation&reco_backend_type=function&reco_client=home_navigation-recommendations&reco_id=7f39553d-2516-4785-9e41-3c2472b8d747&c_id=/home/navigation-recommendations/element&c_element_order=2&c_uid=c4f1294d-ca70-4cc1-9bef-24a3970e1159',
	},  (error, response, body) => {
		const commentsContent = body.match(/(?<=tooltip-full-body">)(.*)(?=<\/div>)/gm).slice(0, 3)
		const commentsTitle = body.match(/(?<=tooltip-title">)(.*)(?=<\/h4>)/gm).slice(0, 3)
		const fullComments = []
		for (let i = 0; i < 3; i++) {
			fullComments.push(`${commentsTitle[i]} ${commentsContent[i]}`)
		}
		resolve(fullComments)
	})
})

const sanitizeComments = comments => {
	return comments.map(comment => comment.replace(/[-°!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/gm, ' ').replace(/[ ]{2,}/gm, ' '))
}

const getComments = async () => {
	let comments = await fetchComments()
	comments = sanitizeComments(comments)
}

getComments()