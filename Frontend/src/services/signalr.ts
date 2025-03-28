import { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const SIGNAL_HUB = "http://localhost:5222/order-hub";

export const useSignalR = () => {
  const [orderUpdate, setOrderUpdate] = useState(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder().withUrl(SIGNAL_HUB).build();

    connection.on("OrderUpdate", (message) => {
      setOrderUpdate(message);
    });

    connection
      .start()
      .then(() => {
        console.log("Conectado ao SignalR");
      })
      .catch((err) => {
        console.error("Erro ao conectar com o SignalR: ", err);
      });

    return () => {
      connection.stop();
    };
  }, []);

  return orderUpdate;
};
