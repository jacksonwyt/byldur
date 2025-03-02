import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTimes, FaCheck, FaSearch, FaTag, FaClipboard } from 'react-icons/fa';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import TemplateSelector from '../components/templates/TemplateSelector';
import TemplatePreview from '../components/templates/TemplatePreview';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`;

const FormSection = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const OptionCard = styled.div`
  flex: 1;
  background-color: var(--color-bg-card);
  border: 1px solid ${props => props.selected ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? '0 0 0 2px rgba(var(--color-primary-rgb), 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-3px);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OptionTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.selected ? 'var(--color-primary)' : 'transparent'};
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'var(--color-border)'};
  color: white;
  transition: all 0.2s ease;
`;

const OptionDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 0;
`;

const TemplatesSection = styled.div`
  margin-top: 2rem;
`;

const TemplatesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NewProject = () => {
  const navigate = useNavigate();
  const { addProject, fetchTemplates, templates, loading, error } = useProjects();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [projectOption, setProjectOption] = useState('blank'); // 'blank' or 'template'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [projectData, setProjectData] = useState({
    name: '',
    description: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  useEffect(() => {
    // Fetch templates if not already loaded
    if (projectOption === 'template' && (!templates || templates.length === 0)) {
      fetchTemplates();
    }
  }, [projectOption, templates, fetchTemplates]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const handleOptionChange = (option) => {
    setProjectOption(option);
    // If switching away from template, clear selection
    if (option !== 'template') {
      setSelectedTemplate(null);
      setPreviewTemplate(null);
    }
  };
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setPreviewTemplate(template);
    
    // Clear template validation error if present
    if (validationErrors.template) {
      setValidationErrors({
        ...validationErrors,
        template: ''
      });
    }
  };
  
  const handleBackToTemplates = () => {
    setPreviewTemplate(null);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!projectData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (projectOption === 'template' && !selectedTemplate) {
      errors.template = 'Please select a template';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    
    // Scroll to the top to show the project details form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Autofill the project name if it's empty
    if (!projectData.name.trim()) {
      setProjectData(prev => ({
        ...prev,
        name: `${template.name} Project`
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProjectData = {
        ...projectData,
        templateId: selectedTemplate?.id || null
      };
      
      const newProject = await addProject(newProjectData);
      
      if (newProject && newProject.id) {
        // Redirect to the editor with the new project
        navigate(`/editor/${newProject.id}`);
      }
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>Create New Project</Title>
        <SubTitle>Start with a blank canvas or choose from our professionally designed templates</SubTitle>
      </Header>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FormTitle>Project Details</FormTitle>
          
          <FormGroup>
            <Label htmlFor="name">Project Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              placeholder="My Awesome Website"
            />
            {validationErrors.name && <ErrorMessage>{validationErrors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description (Optional)</Label>
            <TextArea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Describe your project..."
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <FormTitle>Project Type</FormTitle>
          
          <OptionsContainer>
            <OptionCard 
              selected={projectOption === 'blank'} 
              onClick={() => handleOptionChange('blank')}
            >
              <OptionHeader>
                <OptionTitle>Blank Project</OptionTitle>
                <CheckIcon selected={projectOption === 'blank'}>
                  {projectOption === 'blank' && <FaCheck />}
                </CheckIcon>
              </OptionHeader>
              <OptionDescription>
                Start with a clean slate and build your website from scratch.
              </OptionDescription>
            </OptionCard>
            
            <OptionCard 
              selected={projectOption === 'template'} 
              onClick={() => handleOptionChange('template')}
            >
              <OptionHeader>
                <OptionTitle>Start from Template</OptionTitle>
                <CheckIcon selected={projectOption === 'template'}>
                  {projectOption === 'template' && <FaCheck />}
                </CheckIcon>
              </OptionHeader>
              <OptionDescription>
                Choose from our pre-designed templates to jump-start your project.
              </OptionDescription>
            </OptionCard>
          </OptionsContainer>
          
          {projectOption === 'template' && (
            <TemplatesSection>
              <FormTitle>Choose a Template</FormTitle>
              
              {loading ? (
                <Spinner message="Loading templates..." />
              ) : error ? (
                <div style={{ color: 'var(--color-error)' }}>
                  Failed to load templates: {error}
                </div>
              ) : (
                <TemplatesContainer>
                  {!previewTemplate ? (
                    <TemplateSelector
                      templates={templates || []}
                      selectedTemplateId={selectedTemplate?.id}
                      onSelectTemplate={handleTemplateSelect}
                      loading={loading}
                    />
                  ) : (
                    <TemplatePreview
                      template={previewTemplate}
                      onUse={handleUseTemplate}
                      onBack={handleBackToTemplates}
                      loadingPreview={loadingPreview}
                    />
                  )}
                </TemplatesContainer>
              )}
              
              {validationErrors.template && (
                <ErrorMessage style={{ marginTop: '1rem' }}>
                  {validationErrors.template}
                </ErrorMessage>
              )}
            </TemplatesSection>
          )}
        </FormSection>
        
        <ActionButtons>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="small" /> : 'Create Project'}
          </Button>
        </ActionButtons>
      </form>
    </Container>
  );
};

export default NewProject; 