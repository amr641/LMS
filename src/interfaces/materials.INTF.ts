export interface IMaterial {
    id: number;
    title: string;
    description?: string; // Optional description for the material
    file: string; // URL or file path to the material
    course:number;
    createdAt: Date;
    updatedAt: Date;
  }
  