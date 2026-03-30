import api from '../api/api';
import type { Certificate } from '../types/certificate';
import type { Project } from '../types/project';
import type { Skill } from '../types/skill';
import type { Journey } from '../types/journey';

// Define exact backend response wrappers based on your Express controllers
interface ProjectsResponse { success: boolean; projects: Project[]; project?: Project; }
interface CertificatesResponse { success: boolean; certificates: Certificate[]; certificate?: Certificate; }
interface SkillsResponse { success: boolean; skills: Skill[]; skill?: Skill; }
interface JourneyResponse { success: boolean; journey: Journey[]; event?: Journey; }

export const portfolioService = {
  // ================= PROJECTS =================
  getProjects: async (): Promise<ProjectsResponse> => {
    const response = await api.get<ProjectsResponse>('/portfolio/projects');
    return response.data;
  },
  
  createProject: async (formData: FormData): Promise<ProjectsResponse> => {
    const response = await api.post<ProjectsResponse>('/portfolio/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateProject: async (id: string, formData: FormData): Promise<ProjectsResponse> => {
    const response = await api.put<ProjectsResponse>(`/portfolio/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/portfolio/projects/${id}`);
    return response.data;
  },

  // ================= CERTIFICATES =================
  getCertificates: async (): Promise<CertificatesResponse> => {
    const response = await api.get<CertificatesResponse>('/portfolio/certificates');
    return response.data;
  },

  createCertificate: async (formData: FormData): Promise<CertificatesResponse> => {
    const response = await api.post<CertificatesResponse>('/portfolio/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCertificate: async (id: string, formData: FormData): Promise<CertificatesResponse> => {
    const response = await api.put<CertificatesResponse>(`/portfolio/certificates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCertificate: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/portfolio/certificates/${id}`);
    return response.data;
  },
  
  // ================= SKILLS =================
  getSkills: async (): Promise<SkillsResponse> => {
    const response = await api.get<SkillsResponse>('/portfolio/skills');
    return response.data;
  },

  createSkill: async (formData: FormData): Promise<SkillsResponse> => {
    const response = await api.post<SkillsResponse>('/portfolio/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateSkill: async (id: string, formData: FormData): Promise<SkillsResponse> => {
    const response = await api.put<SkillsResponse>(`/portfolio/skills/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteSkill: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/portfolio/skills/${id}`);
    return response.data;
  },
  
  // ================= JOURNEY (TIMELINE) =================
  getJourney: async (): Promise<JourneyResponse> => {
    const response = await api.get<JourneyResponse>('/portfolio/journey');
    return response.data;
  },

  createJourneyEvent: async (data: { year: string; title: string; description: string }): Promise<JourneyResponse> => {
    const response = await api.post<JourneyResponse>('/portfolio/journey', data);
    return response.data;
  },

  updateJourneyEvent: async (id: string, data: { year: string; title: string; description: string }): Promise<JourneyResponse> => {
    const response = await api.put<JourneyResponse>(`/portfolio/journey/${id}`, data);
    return response.data;
  },

  deleteJourneyEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/portfolio/journey/${id}`);
    return response.data;
  }
};