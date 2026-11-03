import * as tf from '@tensorflow/tfjs'
import sharp from 'sharp'
import fs from 'node:fs/promises'

// Abaixo deste valor a imagem é considerada bebedouro (classe 0 no treino)
export const LIMIAR = Number(process.env.AI_THRESHOLD ?? 0.7)
export const MODEL_VERSION = process.env.AI_MODEL_VERSION ?? 'v1'

let model = null

// A mesma arquitetura do Colab, camada a camada
function createModel() {
  const m = tf.sequential()
  const convBlock = (filters, primeiro = false) => {
    m.add(tf.layers.conv2d({
      filters: filters, kernelSize: 3, padding: 'same', activation: 'relu',
      ...(primeiro && { inputShape: [128, 128, 3] }),
    }))
    m.add(tf.layers.batchNormalization({ momentum: 0.9 }))
  }
  convBlock(32, true); m.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  convBlock(64);       m.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  convBlock(128);      m.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  convBlock(128)
  m.add(tf.layers.globalAveragePooling2d({}))
  m.add(tf.layers.dropout({ rate: 0.4 }))
  m.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))
  return m
}

export function isModelLoaded() {
  return model !== null
}

// Chamar uma vez no arranque do serviço
export async function loadModel() {
  const ficheiro = new URL('./weights_bebedouro.json', import.meta.url)
  const weights = JSON.parse(await fs.readFile(ficheiro, 'utf8'))
  const m = createModel()
  let i = 0
  for (const layer of m.layers) {
    const n = layer.weights.length          // conv: 2, batchnorm: 4, dense: 2, outras: 0
    if (n > 0) {
      layer.setWeights(weights.slice(i, i + n).map((p) => tf.tensor(p.data, p.shape)))
    }
    i += n
  }
  model = m
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
