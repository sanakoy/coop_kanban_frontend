import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/kanban/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async getTasks() {
    const response = await apiClient.get("/task");
    return response.data;
  },
  async createTask(taskData: {
    title: string;
    description: string;
    status: string;
  }) {
    return await apiClient.post("/task", taskData);
  },
  async deleteTask(id: string) {
    return await apiClient.delete(`/task/${id}`);
  },
  async updateTask(
    id: string,
    taskData: {
      title: string;
      description?: string;
      status: string;
    }
  ) {
    return await apiClient.patch(`/task/${id}`, taskData);
  },
};
