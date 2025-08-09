<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }} задачи</h3>

      <div class="form-group">
        <label>Заголовок</label>
        <input v-model="localTask.title" type="text" />
      </div>

      <div class="form-group">
        <label>Описание</label>
        <textarea v-model="localTask.description"></textarea>
      </div>

      <div class="form-group">
        <label>Статус</label>
        <select v-model="localTask.status">
          <option
            v-for="(statusRu, statusEng) in statuses"
            :value="statusEng"
            :key="statusEng"
          >
            {{ statusRu }}
          </option>
        </select>
      </div>

      <div class="modal-actions">
        <button @click="save">Сохранить</button>
        <button @click="close">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ITask } from "@/types/task";

const props = defineProps({
  title: String,
  isOpen: Boolean,
  task: {
    type: Object as () => ITask,
    required: true,
  },
  statuses: {
    type: Object as () => Record<string, string>,
    default: () => ["todo", "in_progress", "done"],
  },
});

const emit = defineEmits<{
  (e: "save", task: ITask): void;
  (e: "close"): void;
}>();

const localTask = ref<ITask>({
  id: "",
  title: "",
  description: "",
  status: "todo",
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      localTask.value = { ...newTask };
    }
  },
  { immediate: true }
);

const save = () => {
  emit("save", { ...localTask.value });
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
