import * as tf from '@tensorflow/tfjs'
import sharp from 'sharp'
import fs from 'node:fs/promises'

const LIMIAR = 0.7
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

// Chamar uma vez no arranque do servidor
export async function loadModel() {
  const ficheiro = new URL('./pesos_bebedouro.json', import.meta.url)
  const weights = JSON.parse(await fs.readFile(ficheiro, 'utf8'))
  model = createModel()
  let i = 0
  for (const layer of model.layers) {
    const n = layer.weights.length          // conv: 2, batchnorm: 4, dense: 2, outras: 0
    if (n > 0) {
      layer.setWeights(weights.slice(i, i + n).map((p) => tf.tensor(p.data, p.shape)))
    }
    i += n
  }
  console.log('Modelo de bebedouros carregado')
}

// Recebe a imagem (Buffer) e diz se é bebedouro
export async function predictFountain(buffer) {
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