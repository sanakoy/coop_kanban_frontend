import { defineStore } from "pinia";
import taskApi from "@/api/taskApi";
import { ITask } from "@/types/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as ITask[],
  }),
  actions: {
    async fetchTasks() {
      this.tasks = await taskApi.getTasks();
    },

    async createTask(taskData: {
      title: string;
      description: string;
      status: string;
    }) {
      await taskApi.createTask(taskData);
    },
    async removeTask(id: string) {
      await taskApi.deleteTask(id);
    },
    async updateTask(
      id: string,
      taskData: { title: string; description?: string; status: string }
    ) {
      await taskApi.updateTask(id, taskData);
    },
  },
});
