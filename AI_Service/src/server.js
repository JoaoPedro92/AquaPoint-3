import { grpc, AquapointClassifier } from './proto.js'
import { loadModel, isModelLoaded, MODEL_VERSION } from './model/bebedouroModel.js'

const PORT = process.env.PORT || 50051

const handlers = {
  Health(_call, callback) {
    callback(null, { ready: isModelLoaded(), modelVersion: MODEL_VERSION })
  },
}

await loadModel()

const server = new grpc.Server()
server.addService(AquapointClassifier.service, handlers)
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) {
    console.error('Não foi possível arrancar o servidor gRPC:', err)
    process.exit(1)
  }
  console.log(`ai-service (gRPC) a correr na porta ${PORT}`)
})

// Encerrar com calma quando o Docker manda parar o container
for (const sinal of ['SIGINT', 'SIGTERM']) {
  process.on(sinal, () => server.tryShutdown(() => process.exit(0)))
}
