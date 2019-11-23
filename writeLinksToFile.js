const request = require('request')
const fs = require('fs')

//Escrever o arquivo TXT com o link dos produtos
const getProductLinks = page => new Promise(resolve => {
	const uri = 'https://esportes.mercadolivre.com.br/ciclismo/pecas/'
	const productLinks = []
	request(`${uri}_Desde_${page * 50 + 1}`, (error, response, body) => {
		const allLinks = body.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gmi)
		allLinks.forEach(link => {
			if (link.includes('produto.mercadolivre')) {
				productLinks.push(link)
			}
			resolve(productLinks)
		})
	})
})

//Chama a função para escreve o link dor produtos no TXT
const writeProcutLinksToFile = async () => {
	const [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10] = await Promise.all([getProductLinks(1), getProductLinks(2), getProductLinks(3), getProductLinks(4), getProductLinks(5), getProductLinks(6), getProductLinks(7), getProductLinks(8), getProductLinks(9), getProductLinks(10)])
	const allLinks = page1.concat(page2, page3, page4, page5, page6, page7, page8, page9, page10)
	fs.writeFile('./links.txt', allLinks.join('\r\n'), err => console.log(err))
}

writeProcutLinksToFile()