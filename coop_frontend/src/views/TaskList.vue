<template>
  <div>
    <div class="navbar">
      <h1>Список задач</h1>
      <button @click="createTask">Создать</button>
    </div>
    <div class="kanban-container">
      <div
        v-for="status in statuses"
        :key="status"
        class="task-card"
        :class="`task-card--${status}`"
      >
        <h3>{{ getStatusName(status) }}</h3>
        <draggable
          :list="tasksByStatus[status]"
          group="tasks"
          item-key="id"
          @end="onDragEnd"
          class="draggable-container"
        >
          <template #item="{ element: task }">
            <div class="task">
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <div class="task-actions" style="position: relative">
                  <button class="dots-button" @click.stop="toggleMenu(task.id)">
                    ⋮
                  </button>
                  <div
                    v-if="activeMenu === task.id"
                    class="dropdown-menu"
                    v-click-outside="closeMenu"
                  >
                    <button @click="editTask(task)">Редактировать</button>
                    <button @click="deleteTask(task.id)">Удалить</button>
                  </div>
                </div>
              </div>
              <p>{{ task.description }}</p>
              <span class="task-status">{{ getStatusName(task.status) }}</span>
            </div>
          </template>
        </draggable>
        <!-- <div v-for="task in tasks" :key="task.id">
          <div v-if="task.status === status" class="task">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <div class="task-actions" style="position: relative">
                <button class="dots-button" @click.stop="toggleMenu(task.id)">
                  ⋮
                </button>
                <div
                  v-if="activeMenu === task.id"
                  class="dropdown-menu"
                  v-click-outside="closeMenu"
                >
                  <button @click="editTask(task)">Редактировать</button>
                  <button @click="deleteTask(task.id)">Удалить</button>
                </div>
              </div>
            </div>
            <p>{{ task.description }}</p>
            <span>Статус: {{ task.status }}</span>
          </div>
        </div> -->
      </div>
    </div>
    <TaskEditModal
      :title="'Редактирование'"
      v-if="isEditModalOpen"
      :is-open="isEditModalOpen"
      :task="editingTask"
      :statuses="statuses"
      @save="saveEditedTask"
      @close="closeEditModal"
    />
    <TaskEditModal
      :title="'Создание'"
      v-if="isCreateModalOpen"
      :is-open="isCreateModalOpen"
      :task="editingTask"
      :statuses="statuses"
      @save="saveCreatedTask"
      @close="closeCreateModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import { ITask } from "@/types/task";
import { onMounted, computed, ref } from "vue";
import TaskEditModal from "../components/TaskModal.vue";
import draggable from "vuedraggable";
const taskStore = useTaskStore();
const tasks = computed(() => taskStore.tasks);
const statuses = ["todo", "in_progress", "done"];

const activeMenu = ref<string | null>(null);
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const editingTask = ref<ITask>({
  id: "",
  title: "",
  description: "",
  status: "todo",
});

const closeEditModal = () => {
  isEditModalOpen.value = false;
};
const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

const saveEditedTask = async (updatedTask: any) => {
  try {
    await taskStore.updateTask(updatedTask.id, updatedTask);
    closeEditModal();
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
  }
};
const saveCreatedTask = async (createdTask: any) => {
  try {
    await taskStore.createTask(createdTask);
    closeCreateModal();
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
  }
};

const toggleMenu = (taskId: string) => {
  activeMenu.value = activeMenu.value === taskId ? null : taskId;
};

const closeMenu = () => {
  activeMenu.value = null;
};

const editTask = (task: any) => {
  editingTask.value = { ...task };
  isEditModalOpen.value = true;
  closeMenu();
};
const createTask = (task: any) => {
  // editingTask.value = { ...task };
  isCreateModalOpen.value = true;
};

const deleteTask = async (id: string) => {
  await taskStore.removeTask(id);
  closeMenu();
};

onMounted(async () => {
  await taskStore.fetchTasks();
});

const tasksByStatus = computed(() => {
  const grouped: Record<string, ITask[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  tasks.value.forEach((task) => {
    grouped[task.status].push(task);
  });
  return grouped;
});
const onDragEnd = async (event: any) => {
  if (!event.to) return;

  const task = event.item._underlying_vm_;
  const newStatus = event.to
    .closest(".task-card")
    .classList[1].replace("task-card--", "");

  if (task.status !== newStatus) {
    try {
      // Создаем копию задачи с новым статусом
      const updatedTask = { ...task, status: newStatus };

      // Оптимистичное обновление - меняем статус прямо в элементе
      task.status = newStatus;

      // Обновляем на сервере
      await taskStore.updateTask(task.id, updatedTask);

      // Принудительно обновляем список задач
      taskStore.fetchTasks(); // или альтернативный способ обновления
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      // Возвращаем исходный статус при ошибке
      task.status = event.item._underlying_vm_.status;
    }
  }
};

const getStatusName = (status: string) => {
  const names: Record<string, string> = {
    todo: "Нужно выполнить",
    in_progress: "В процессе",
    done: "Выполнено",
  };
  return names[status] || status;
};
</script>

<style scoped>
.task-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 33%;
}

.task-card--todo {
  background: rgb(248, 149, 149);
}

.task-card--in_progress {
  background: rgb(255, 255, 158);
}

.task-card--done {
  background: #94ef83;
}

.kanban-container {
  display: flex;
  flex-direction: row;
}

.task {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: aliceblue;
  margin: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dots-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.dropdown-menu button {
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background: #f5f5f5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 0 1em;
}

.draggable-container {
  min-height: 100px;
  padding: 10px;
  transition: all 0.3s;
}

.task {
  cursor: grab;
  margin-bottom: 8px;
  transition: transform 0.2s;
}

.task:active {
  cursor: grabbing;
  transform: scale(1.02);
}
</style>
