import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { fileURLToPath } from 'node:url'

const PROTO_PATH = fileURLToPath(new URL('../proto/bebedouro.proto', import.meta.url))

const definition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,   // is_bebedouro -> isBebedouro
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

export const { AquapointClassifier } = grpc.loadPackageDefinition(definition).aquapoint.ai.v1
export { grpc }
