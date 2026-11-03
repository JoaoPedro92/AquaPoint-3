// Script de teste: envia uma imagem ao ai-service e mostra o resultado
// Uso: npm run classify -- caminho/para/foto.jpg
import fs from 'node:fs/promises'
import { grpc, AquapointClassifier } from './proto.js'

const ficheiro = process.argv[2]
if (!ficheiro) {
  console.error('Uso: npm run classify -- caminho/para/foto.jpg')
  process.exit(1)
}

const PORT = process.env.PORT || 50051
const client = new AquapointClassifier(`localhost:${PORT}`, grpc.credentials.createInsecure(), {
  'grpc.max_send_message_length': 10 * 1024 * 1024,
})
const image = await fs.readFile(ficheiro)
const deadline = new Date(Date.now() + 3000)

client.Classify({ image }, { deadline }, (err, res) => {
  if (err) {
    console.error(`Erro gRPC ${grpc.status[err.code]}: ${err.details}`)
    process.exit(1)
  }
  console.log(`${ficheiro}: prob=${res.prob.toFixed(4)} isBebedouro=${res.isBebedouro} (${res.modelVersion})`)
  process.exit(0)
})
