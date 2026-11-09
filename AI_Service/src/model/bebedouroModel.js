import * as tf from '@tensorflow/tfjs'
import sharp from 'sharp'
import fs from 'node:fs/promises'

// Abaixo deste valor a imagem é considerada bebedouro (classe 0 no treino)
export const LIMIAR = Number(process.env.AI_THRESHOLD ?? 0.7)
export const MODEL_VERSION = process.env.AI_MODEL_VERSION ?? 'v1'

let model = null

export function isModelLoaded() {
  return model !== null
}

// Chamar uma vez no arranque do serviço.
// O modelo completo (arquitetura + pesos) está em ./bebedouro/ no formato do TensorFlow.js:
// model.json (camadas e configuração) e weights.bin (os 242 369 pesos treinados)
export async function loadModel() {
  const pasta = new URL('./bebedouro/', import.meta.url)
  const json = JSON.parse(await fs.readFile(new URL('model.json', pasta), 'utf8'))
  const pesos = await fs.readFile(new URL('weights.bin', pasta))

  // O @tensorflow/tfjs puro não lê ficheiros com file://, por isso passamos o conteúdo já lido
  model = await tf.loadLayersModel(tf.io.fromMemory({
    modelTopology: json.modelTopology,
    weightSpecs: json.weightsManifest[0].weights,
    weightData: pesos.buffer.slice(pesos.byteOffset, pesos.byteOffset + pesos.byteLength),
  }))
  console.log(`Modelo de bebedouros carregado (${MODEL_VERSION}, limiar ${LIMIAR})`)
}

// Recebe a imagem (Buffer) e diz se é bebedouro
export async function predictAquapoint(buffer) {
  if (!model) throw new Error('Modelo ainda não carregado')

  // sharp só abre a imagem (tamanho original), sem redimensionar
  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true })

  return tf.tidy(() => {
    const original = tf.tensor3d(new Uint8Array(data), [info.height, info.width, 3], 'float32')
    // redimensionar como o Keras: bilinear, half-pixel centers, sem antialias
    const x = tf.image.resizeBilinear(original, [128, 128], false, true)
      .div(255)
      .expandDims(0)
    const prob = model.predict(x).dataSync()[0]
    return { prob, isBebedouro: prob <= LIMIAR }
  })
}
