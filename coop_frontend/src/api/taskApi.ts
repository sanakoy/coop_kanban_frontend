import axios from "axios";

const env = import.meta.env as any;
const baseURL = env.VITE_API_BASE_URL as string;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async getTasks() {
    const response = await apiClient.get("/task");
    console.log(response);
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
