export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'inprocess';
  techStack: string[];
  codeLink?: string;
  demoLink?: string;
  imageUrl?: string; 
  author_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  status: 'complete' | 'inprocess';
  techStack?: string[];
  codeLink?: string;
  demoLink?: string;
  image?: File;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;