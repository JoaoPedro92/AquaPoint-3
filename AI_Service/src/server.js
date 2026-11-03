import { grpc, AquapointClassifier } from './proto.js'
import { loadModel, isModelLoaded, predictAquapoint, MODEL_VERSION } from './model/bebedouroModel.js'

const PORT = process.env.PORT || 50051
// Tamanho máximo de uma mensagem (o gRPC usa 4 MB por omissão; fotos de telemóvel podem passar disso)
const MAX_MESSAGE_MB = Number(process.env.MAX_MESSAGE_MB ?? 10)

const handlers = {
  Health(_call, callback) {
    callback(null, { ready: isModelLoaded(), modelVersion: MODEL_VERSION })
  },

  async Classify(call, callback) {
    const image = call.request.image

    if (!image || image.length === 0) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, details: 'Imagem vazia' })
    }
    // Se o modelo ainda estiver a arrancar, o backend trata UNAVAILABLE como "IA em baixo"
    if (!isModelLoaded()) {
      return callback({ code: grpc.status.UNAVAILABLE, details: 'Modelo ainda não carregado' })
    }

    try {
      const { prob, isBebedouro } = await predictAquapoint(image)
      callback(null, { prob, isBebedouro, modelVersion: MODEL_VERSION })
    } catch (err) {
      // O sharp falha quando o ficheiro não é uma imagem válida
      console.error('Erro ao classificar imagem:', err.message)
      callback({ code: grpc.status.INVALID_ARGUMENT, details: 'Não foi possível ler a imagem' })
    }
  },
}

await loadModel()

const server = new grpc.Server({
  'grpc.max_receive_message_length': MAX_MESSAGE_MB * 1024 * 1024,
})
server.addService(AquapointClassifier.service, handlers)
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) {
    console.error('Não foi possível arrancar o servidor gRPC:', err)
    process.exit(1)
  }
  console.log(`ai-service (gRPC) a correr na porta ${PORT}`)
})

// Encerrar processo a processo quando o Docker manda parar o container
for (const sinal of ['SIGINT', 'SIGTERM']) {
  process.on(sinal, () => server.tryShutdown(() => process.exit(0)))
}
