import { Ref, ref } from "vue";
const env = import.meta.env as any;
const wsUrl = env.VITE_API_WS_URL as string;

interface WebSocketComposable {
  ws: Ref<WebSocket | null>;
  wsConnect: () => void;
}

export default function useWebSocket(): WebSocketComposable {
  const ws: Ref<WebSocket | null> = ref(null);

  const wsConnect = () => {
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.value.onclose = () => {
      console.log("WebSocket closed");
      ws.value = null;
    };
  };

  return {
    ws,
    wsConnect,
  };
}
