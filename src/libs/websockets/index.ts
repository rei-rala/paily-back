import { getCriptoPrices } from '../services/criptoPrices'
type ioType = import("socket.io").Server;

export const criptoPricesWebSockets = (ioServer: ioType) => {
  setInterval(() => {
    getCriptoPrices()
      .then((data: any) => {
        ioServer.local.emit("criptoPrices", data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, 2000);

  ioServer.on("connection", async (socket) => {
    console.log(`Socket conectado: ${socket.id}`);
    getCriptoPrices()
      .then((data: any) => {
        console.log(data);
        socket.emit("criptoPrices", ...data);
      })
      .catch((error) => {
        socket.emit("criptoPrices", []);
        console.log(error);
      });
  });
};
