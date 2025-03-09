import React, { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject, getProjectById } from '../api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjects();
      setProjects(projects);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectIdFromUrl) {
      getProjectById(projectIdFromUrl).then(setProjectDetails);
    }
  }, [projectIdFromUrl]);

  const handleAddProject = async () => {
    if (!newProjectTitle.trim()) return;
    const project = { title: newProjectTitle, description: newProjectDescription };
    const addedProject = await addProject(project);
    setProjects([...projects, { ...project, id: addedProject.id }]);
    setNewProjectTitle('');
    setNewProjectDescription('');
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProjectTitle(project.title);
    setNewProjectDescription(project.description);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    const updatedProject = { ...editingProject, title: newProjectTitle, description: newProjectDescription };
    await updateProject(updatedProject.id, updatedProject);
    setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
    setEditingProject(null);
    setNewProjectTitle('');
    setNewProjectDescription('');
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const handleProjectClick = (project) => {
    navigate(`/board?projectId=${project.id}`);
  };

  return (
    <div className="projects-page">
      <h2>{projectDetails ? projectDetails.title : "Projects"}</h2>
      <div className="project-form">
        <input
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="Project title"
        />
        <textarea
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Project description"
        />
        {editingProject ? (
          <button onClick={handleUpdateProject}>Update Project</button>
        ) : (
          <button onClick={handleAddProject}>Add Project</button>
        )}
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => handleProjectClick(project)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <button onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}>Edit</button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;