import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import useProjectApi from '../hooks/useProjectApi';
import useAuthApi from '../hooks/useAuthApi';
import { Button, Spinner } from '../components/ui';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 0;
`;

const SearchAndFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-bg-hover);
  }

  svg {
    font-size: 0.9rem;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ProjectCard = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectPreview = styled.div`
  height: 160px;
  background-color: var(--color-bg-secondary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProjectInfo = styled.div`
  padding: 1rem;
`;

const ProjectTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--color-text-primary);
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`;

const ProjectActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const CreateNewCard = styled(ProjectCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-hover);
    border-color: var(--color-primary);
  }
`;

const CreateIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #ffffff;
  margin-bottom: 1rem;
  
  svg {
    font-size: 1.5rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  margin-top: 2rem;

  h3 {
    margin: 1rem 0 0.5rem;
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }
`;

const Dashboard = () => {
  const { projects, loading, error, fetchProjects } = useProjectApi();
  const { user } = useAuthApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const filteredProjects = projects
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);

    return sortDirection === 'asc' 
      ? dateA - dateB 
      : dateB - dateA;
  });

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Spinner size="large" />
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <EmptyState>
          <h3>Error Loading Projects</h3>
          <p>{error || 'An error occurred while loading your projects. Please try again.'}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </EmptyState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>My Projects</Title>
        <Link to="/projects/new">
          <Button primary icon={<FaPlus />}>New Project</Button>
        </Link>
      </DashboardHeader>

      <SearchAndFilter>
        <SearchBar>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchBar>
        <FilterContainer>
          <FilterButton onClick={toggleSortDirection}>
            {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
          </FilterButton>
          <FilterButton>
            <FaFilter />
            Filter
          </FilterButton>
        </FilterContainer>
      </SearchAndFilter>

      {(!projects || projects.length === 0) ? (
        <EmptyState>
          <h3>No Projects Yet</h3>
          <p>Create your first website project to get started</p>
          <Link to="/projects/new">
            <Button primary icon={<FaPlus />}>Create New Project</Button>
          </Link>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id}>
              <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <ProjectPreview>
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    <div style={{ opacity: 0.5 }}>No Preview</div>
                  )}
                </ProjectPreview>
                <ProjectInfo>
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <ProjectMeta>
                    <span>Updated {new Date(project.updated_at || project.created_at).toLocaleDateString()}</span>
                  </ProjectMeta>
                  <ProjectActions>
                    <Button small>View Details</Button>
                    <Link to={`/editor/${project.id}`}>
                      <Button small primary>Edit</Button>
                    </Link>
                  </ProjectActions>
                </ProjectInfo>
              </Link>
            </ProjectCard>
          ))}
          
          <Link to="/projects/new" style={{ textDecoration: 'none' }}>
            <CreateNewCard>
              <CreateIcon>
                <FaPlus />
              </CreateIcon>
              <h3>Create New Project</h3>
            </CreateNewCard>
          </Link>
        </ProjectsGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 