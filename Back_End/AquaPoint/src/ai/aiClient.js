// Cliente gRPC do ai-service (microserviço que diz se uma imagem é um bebedouro)
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { fileURLToPath } from 'node:url'

const PROTO_PATH = fileURLToPath(new URL('../../proto/bebedouro.proto', import.meta.url))
// No Docker é "ai-service:50051"; a correr localmente, o ai-service está em localhost
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'localhost:50051'
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS ?? 3000)

const definition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,   // is_bebedouro -> isBebedouro
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const { AquapointClassifier } = grpc.loadPackageDefinition(definition).aquapoint.ai.v1

// Uma só ligação (HTTP/2) reutilizada por todos os pedidos
const client = new AquapointClassifier(AI_SERVICE_URL, grpc.credentials.createInsecure(), {
  'grpc.max_send_message_length': 10 * 1024 * 1024,
})

/**
 * Pergunta ao ai-service se a imagem é um bebedouro. Nunca lança erro.
 * - IA respondeu:            { available: true, isBebedouro, prob }
 * - imagem ilegível:         { available: true, isBebedouro: false, prob: null }
 * - IA em baixo ou timeout:  { available: false }
 */
export function classifyImage(buffer) {
  return new Promise((resolve) => {
    const deadline = new Date(Date.now() + AI_TIMEOUT_MS)

    client.Classify({ image: buffer }, { deadline }, (err, res) => {
      if (!err) {
        return resolve({ available: true, isBebedouro: res.isBebedouro, prob: res.prob })
      }
      if (err.code === grpc.status.INVALID_ARGUMENT) {
        return resolve({ available: true, isBebedouro: false, prob: null })
      }
      // UNAVAILABLE, DEADLINE_EXCEEDED, etc.
      console.warn(`ai-service indisponível (${grpc.status[err.code]}): ${err.details}`)
      resolve({ available: false })
    })
  })
}
