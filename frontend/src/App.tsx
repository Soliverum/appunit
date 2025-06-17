// frontend/src/App.tsx
import React, { useState, useEffect } from 'react'; // <--- Import hooks
import { useTranslation } from 'react-i18next';
import './i18n';
import projectService from './services/projectService'; // <--- Import service
import { Project } from './types/project'; // <--- Import type

function App() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]); // <--- Add state for projects
  const [loading, setLoading] = useState<boolean>(true); // <--- Add state for loading
  const [error, setError] = useState<string | null>(null); // <--- Add state for error

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await projectService.fetchProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        // The error is already logged in projectService,
        // but we can set an error state for the UI here
        setError('Failed to fetch projects.');
        console.error("App.tsx error:", err); // Additional log if needed
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.welcome')}</p>
      <div>
        <button onClick={() => i18n.changeLanguage('es')}>ES</button>
        <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      </div>

      <h2>{t('projects.title', 'Projects')}</h2>
      {loading && <p>{t('loading', 'Loading projects...')}</p>}
      {error && <p style={{ color: 'red' }}>{t('errorFetchingProjects', error)}</p>}
      {!loading && !error && projects.length === 0 && (
        <p>{t('projects.noneFound', 'No projects found.')}</p>
      )}
      {!loading && !error && projects.length > 0 && (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>{project.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;