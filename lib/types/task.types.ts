export interface Task {
    id: number;
    title: string;
    level: string;
    description: string;
    color?: string; // Make color optional
  }