import app from "./app.js";
import { initRealtime } from "./realtime.js";

const PORT = process.env.PORT || 3000;

// app.listen() devolve o servidor HTTP do Node. O Socket.IO "pendura-se" nesse
// mesmo servidor: os pedidos normais vão para o Express e os pedidos para
// /socket.io/ (incluindo o upgrade para WebSocket) vão para o Socket.IO.
const server = app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`));

await initRealtime(server);
