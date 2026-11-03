// Cliente gRPC do ai-service (microserviço que diz se uma imagem é um bebedouro)
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { fileURLToPath } from 'node:url'

const PROTO_PATH = fileURLToPath(new URL('../../proto/bebedouro.proto', import.meta.url))
// No Docker é "ai-service:50051"; a correr localmente, o ai-service está em localhost
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'localhost:50051'
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS ?? 3000)

// "dns:///" faz o cliente pedir ao DNS do Docker TODOS os IPs do ai-service
// (um por réplica), em vez de usar só o primeiro
const target = AI_SERVICE_URL.includes(':///') ? AI_SERVICE_URL : `dns:///${AI_SERVICE_URL}`

// Configuração do canal gRPC:
// - round_robin: abre ligação a todas as réplicas e distribui os pedidos por elas;
//   se uma réplica cair, deixa de a usar e manda tudo para as outras
// - retryPolicy: se um pedido falhar com UNAVAILABLE (réplica a cair nesse instante),
//   repete uma vez noutra réplica antes de desistir
const serviceConfig = {
  loadBalancingConfig: [{ round_robin: {} }],
  methodConfig: [{
    name: [{ service: 'aquapoint.ai.v1.AquapointClassifier' }],
    retryPolicy: {
      maxAttempts: 2,
      initialBackoff: '0.1s',
      maxBackoff: '0.5s',
      backoffMultiplier: 2,
      retryableStatusCodes: ['UNAVAILABLE'],
    },
  }],
}

const definition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,   // is_bebedouro -> isBebedouro
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const { AquapointClassifier } = grpc.loadPackageDefinition(definition).aquapoint.ai.v1

// Um só canal (ligações HTTP/2 persistentes a cada réplica) reutilizado por todos os pedidos
const client = new AquapointClassifier(target, grpc.credentials.createInsecure(), {
  'grpc.service_config': JSON.stringify(serviceConfig),
  'grpc.max_send_message_length': 10 * 1024 * 1024,
  // Volta a perguntar ao DNS no máximo de 5 em 5 s, para detetar réplicas novas ou recriadas
  'grpc.dns_min_time_between_resolutions_ms': 5000,
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
      // UNAVAILABLE (todas as réplicas em baixo), DEADLINE_EXCEEDED, etc.
      console.warn(`ai-service indisponível (${grpc.status[err.code]}): ${err.details}`)
      resolve({ available: false })
    })
  })
}
