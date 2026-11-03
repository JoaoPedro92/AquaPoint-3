# AI_Service

Microserviço com comunicação gRPC que diz se uma imagem é um bebedouro ou não.
O modelo é uma CNN (entrada 128x128x3, saída sigmoid) treinada em Keras no Colab
e exportada para TensorFlow.js (`src/model/weights_bebedouro.json`).

O formato está em `proto/bebedouro.proto`. O serviço só é acessível dentro da rede
do Docker (porta 50051); o browser nunca fala com ele diretamente.

## Correr localmente

```bash
npm install
npm start          # arranca em 0.0.0.0:50051
npm run health     # noutro terminal: verifica se o modelo está carregado
npm run classify -- caminho/foto.jpg   # classifica uma imagem
```

Variáveis de ambiente opcionais: `PORT` (50051), `AI_THRESHOLD` (0.7), `AI_MODEL_VERSION` (v1).
