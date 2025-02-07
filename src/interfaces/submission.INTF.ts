 interface ISubmission {
    id: number;
    student:number;
    submissionDate: Date;
    assignment:number;
    file: string; 
    grade?: number;  
    createdAt: Date;
    updatedAt: Date;
  }
  
 interface SubmissionDTO {
    student?:number;
    submissionDate?: Date;
    assignment?:number;
    file?: string; 
    grade?: number;  
  }
  
  export{ISubmission,SubmissionDTO}