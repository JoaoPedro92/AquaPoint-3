import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'AquaPoint API',
    description: 'Documentação da API AquaPoint'
  },
  host: 'localhost:3000'
}

const outputFile = './src/swagger.json'
const routes = ['./src/app.js']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc)