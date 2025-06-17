// frontend/src/services/projectService.ts
import axios from 'axios';
import { Project } from '../types/project'; // Adjust path if Project type is elsewhere

// Determine the API base URL. For development, it's often localhost.
// In a real app, this would come from an environment variable.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';
// Note: REACT_APP_API_URL needs to be configured in frontend's .env file for Create React App

const projectService = {
  fetchProjects: async (): Promise<Project[]> => {
    try {
      const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      // In a real app, handle this error more gracefully (e.g., show a message to the user)
      return []; // Return empty array on error for this example
    }
  },

  // Example for creating a project (not used in App.tsx for this step, but good for illustration)
  /*
  createProject: async (projectData: Omit<Project, '_id'> & { owner_id: string }): Promise<Project> => {
    try {
      const response = await axios.post<Project>(`${API_BASE_URL}/projects`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error; // Re-throw to be handled by the caller
    }
  }
  */
};

export default projectService;
