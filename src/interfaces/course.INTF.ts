export interface ICourse {
    id: number;
    title: string;
    description: string;
    instructor?: number;
    category: string;
    level: string;
    price?: number; // Optional, in case the course is free
    duration?: string; // Optional
    startDate?: Date; // Optional
    endDate?: Date; // Optional
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  