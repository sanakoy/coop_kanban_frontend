export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string; // или можно использовать union type: 'todo' | 'in_progress' | 'done'
}
