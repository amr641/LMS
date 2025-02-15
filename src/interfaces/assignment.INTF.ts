 interface IAssignment {
    id?: number;
    title?: string;
    description: string;
    course:number
    dueDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
 interface AssignmentDTO {
    title?: string;
    description?: string;
    course?:number
    dueDate?: Date;
  }
  export {IAssignment,AssignmentDTO}
  