 interface IMaterial {
    id: number;
    title: string;
    description?: string;
    file: string; 
    course?:number;
    createdAt: Date;
    updatedAt: Date;
  }
  
 interface MaterialDTO {
    title: string;
    description?: string; 
    file: string; 
    course?:number;
  }
  export {IMaterial,MaterialDTO}