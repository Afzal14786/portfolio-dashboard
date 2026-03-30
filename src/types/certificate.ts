export interface Certificate {
  _id: string;
  courseName: string;
  instituteName: string;
  teacherName?: string;
  teacherImage?: string;
  skills: string[];
  certificateImage: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCertificatePayload {
  courseName: string;
  instituteName: string;
  teacherName?: string;
  skills?: string[];
  certificateImage?: File;
  teacherImage?: File;
}

export type UpdateCertificatePayload = Partial<CreateCertificatePayload>;