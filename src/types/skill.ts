export interface Skill {
  _id: string;
  title: string;
  skill_icon: string; 
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillPayload {
  title: string;
  icon?: File;
  tags?: string[];
}

export type UpdateSkillPayload = Partial<CreateSkillPayload>;