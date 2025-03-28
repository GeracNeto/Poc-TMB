import { useState, useEffect } from "react";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const SIGNAL_HUB = "http://localhost:5000/order-hub";

export const useSignalR = () => {
  const [orderUpdate, setOrderUpdate] = useState(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(SIGNAL_HUB, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

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
