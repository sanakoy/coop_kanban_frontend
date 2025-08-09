import { ref } from "vue";

export default function useWebSocket() {
  const ws = ref(null);

  const wsConnect = () => {
    ws.value = new WebSocket("ws://localhost:8000/ws");

    ws.value.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const wsClose = () => {
    ws.value.close();
    console.log("WebSocket closed");
  };

  return {
    ws,
    wsConnect,
    wsClose,
  };
}
