import { ref, onUnmounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';

export function useTaskWebSocket() {
    const socket = ref<WebSocket | null>(null);
    const store = useTaskStore();

    const connect = () => {
        socket.value = new WebSocket('ws://localhost:8000/ws');

        socket.value.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'tasks_updated') {
                store.fetchTasks(); // Автоматическое обновление списка
            }
        };

        socket.value.onclose = () => {
            setTimeout(connect, 5000); // Переподключение при разрыве
        };
    };

    onUnmounted(() => {
        socket.value?.close();
    });

    return { connect };
}