 interface ICourse {
    id: number;
    title: string;
    description: string;
    instructor?: number;
    category?: number;
    level: string;
    price?: number; // Optional, in case the course is free
    duration?: string; // Optional
    startDate?: Date; // Optional
    endDate?: Date; // Optional
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface CourseDTO {
    id?:number
    title: string;
    description: string;
    instructorId?: number;
    categoryId?: number;
    level: string;
    price?: number; 
    duration?: string; 
    startDate?: Date; 
    endDate?: Date; 
    isActive: boolean;
  }
  export { ICourse,CourseDTO}
  