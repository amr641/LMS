export interface ISubmission {
    id: number;
    userId?: number;  
    courseId?: number;
    user:number;
    submissionDate: Date;
    assignment:number;
    file: string; 
    grade?: number;  
    createdAt: Date;
    updatedAt: Date;
  }
  