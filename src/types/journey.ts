export interface Journey {
  _id: string;
  year: string;
  title: string;
  description: string;
  user_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJourneyPayload {
  year: string;
  title: string;
  description: string;
}

export type UpdateJourneyPayload = Partial<CreateJourneyPayload>;