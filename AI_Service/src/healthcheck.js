// Usado pelo healthcheck do Docker: output/devolve com process.exit(0) se o modelo estiver carregado
import { grpc, AquapointClassifier } from './proto.js'

const PORT = process.env.PORT || 50051
const client = new AquapointClassifier(`localhost:${PORT}`, grpc.credentials.createInsecure())
const deadline = new Date(Date.now() + 2000)

client.Health({}, { deadline }, (err, res) => {
  if (err || !res.ready) {
    console.error('não está pronto', err?.message ?? '')
    process.exit(1)
  }
  console.log(`ok (${res.modelVersion})`)
  process.exit(0)
})
