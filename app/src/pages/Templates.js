import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaTimes, FaArrowRight, FaRegCopy } from 'react-icons/fa';
import useAuthApi from '../hooks/useAuthApi';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-color-secondary);
  max-width: 800px;
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  display: flex;
  flex: 1;
  max-width: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-secondary);
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--bg-light);
    border-color: var(--text-color-secondary);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: var(--primary-color-light);
  border-radius: 20px;
  color: var(--primary-color);
  font-size: 0.9rem;
  
  svg {
    cursor: pointer;
    font-size: 0.8rem;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
`;

const TemplateCard = styled.div`
  background: var(--card-bg-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--card-shadow-hover);
  }
`;

const TemplateImage = styled.div`
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center top;
  position: relative;
`;

const TemplateCategory = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const TemplateDetails = styled.div`
  padding: 20px;
`;

const TemplateName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const TemplateDescription = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const TemplateFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const TemplateTag = styled.span`
  background: var(--bg-light);
  color: var(--text-color-secondary);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const TemplateActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UseButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--primary-color);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

const PreviewButton = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  color: var(--text-color);
  padding: 8px 15px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--bg-light);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const PageNumber = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    color: ${props => props.active ? 'white' : 'var(--primary-color)'};
  }
`;

// Sample template data
const templateData = [
  {
    id: 1,
    name: 'Business Pro',
    category: 'Business',
    description: 'A professional template for businesses of all sizes with modern design elements.',
    image: 'https://placehold.co/600x400/2a86e9/FFFFFF/png?text=Business+Template',
    features: ['Responsive', 'Contact Form', 'About Us', 'Services Section'],
    preview: '#'
  },
  {
    id: 2,
    name: 'Portfolio Minimal',
    category: 'Portfolio',
    description: 'Clean and minimal portfolio template for creatives to showcase their work.',
    image: 'https://placehold.co/600x400/e92a7f/FFFFFF/png?text=Portfolio+Template',
    features: ['Gallery', 'Bio Section', 'Project Showcase', 'Contact Info'],
    preview: '#'
  },
  {
    id: 3,
    name: 'E-commerce Basic',
    category: 'E-commerce',
    description: 'Start selling online with this simple yet effective e-commerce template.',
    image: 'https://placehold.co/600x400/2ae970/FFFFFF/png?text=E-commerce+Template',
    features: ['Product Grid', 'Cart Page', 'Product Details', 'Checkout Process'],
    preview: '#'
  },
  {
    id: 4,
    name: 'Blog Standard',
    category: 'Blog',
    description: 'A clean and modern blog template for sharing your thoughts with the world.',
    image: 'https://placehold.co/600x400/e9c62a/FFFFFF/png?text=Blog+Template',
    features: ['Article Layout', 'Comments', 'Categories', 'Author Bio'],
    preview: '#'
  },
  {
    id: 5,
    name: 'Landing Page',
    category: 'Marketing',
    description: 'High-converting landing page template for your products or services.',
    image: 'https://placehold.co/600x400/9e2ae9/FFFFFF/png?text=Landing+Page+Template',
    features: ['Call to Action', 'Features List', 'Testimonials', 'FAQ Section'],
    preview: '#'
  },
  {
    id: 6,
    name: 'Restaurant Menu',
    category: 'Food',
    description: 'Showcase your restaurant\'s menu and attract more customers with this template.',
    image: 'https://placehold.co/600x400/e95d2a/FFFFFF/png?text=Restaurant+Template',
    features: ['Menu Display', 'About Section', 'Location Map', 'Reservations'],
    preview: '#'
  }
];

const categories = ['All', 'Business', 'Portfolio', 'E-commerce', 'Blog', 'Marketing', 'Food'];

const Templates = () => {
  const { isAuthenticated } = useAuthApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(['All']);
  const [activePage, setActivePage] = useState(1);
  
  // Get the proper link based on authentication status
  const getUseTemplateLink = (templateId) => {
    return isAuthenticated ? `/projects/new?template=${templateId}` : '/register';
  };
  
  // Handle filter click
  const handleFilterClick = (category) => {
    if (category === 'All') {
      setActiveFilters(['All']);
    } else {
      const newFilters = [...activeFilters.filter(f => f !== 'All')];
      
      if (newFilters.includes(category)) {
        // Remove the filter if already present
        const updatedFilters = newFilters.filter(f => f !== category);
        setActiveFilters(updatedFilters.length > 0 ? updatedFilters : ['All']);
      } else {
        // Add the filter
        setActiveFilters([...newFilters, category]);
      }
    }
  };
  
  // Remove a specific filter
  const removeFilter = (filter) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters.length > 0 ? newFilters : ['All']);
  };
  
  // Filter templates based on search and category filters
  const filteredTemplates = templateData.filter(template => {
    // Apply search filter
    const matchesSearch = !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = activeFilters.includes('All') || 
      activeFilters.includes(template.category);
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Free Templates</PageTitle>
        <PageSubtitle>
          Jump-start your next project with our collection of free, professionally-designed templates.
          Choose from a variety of templates for different types of websites.
        </PageSubtitle>
      </PageHeader>
      
      <FilterSection>
        <SearchBar>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <FilterContainer>
          {categories.map(category => (
            <FilterButton 
              key={category}
              onClick={() => handleFilterClick(category)}
              style={{
                background: activeFilters.includes(category) ? 'var(--primary-color-light)' : 'var(--bg-color)',
                color: activeFilters.includes(category) ? 'var(--primary-color)' : 'var(--text-color)'
              }}
            >
              <FaFilter /> {category}
            </FilterButton>
          ))}
        </FilterContainer>
      </FilterSection>
      
      {activeFilters.length > 0 && !activeFilters.includes('All') && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{ marginBottom: '10px' }}>Active filters:</p>
          <FilterContainer>
            {activeFilters.map(filter => (
              <FilterTag key={filter}>
                {filter} <FaTimes onClick={() => removeFilter(filter)} />
              </FilterTag>
            ))}
          </FilterContainer>
        </div>
      )}
      
      <TemplateGrid>
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id}>
            <TemplateImage src={template.image}>
              <TemplateCategory>{template.category}</TemplateCategory>
            </TemplateImage>
            <TemplateDetails>
              <TemplateName>{template.name}</TemplateName>
              <TemplateDescription>{template.description}</TemplateDescription>
              <TemplateFeatures>
                {template.features.map((feature, index) => (
                  <TemplateTag key={index}>{feature}</TemplateTag>
                ))}
              </TemplateFeatures>
              <TemplateActions>
                <UseButton to={getUseTemplateLink(template.id)}>
                  <FaRegCopy /> Use Template
                </UseButton>
                <PreviewButton href={template.preview} target="_blank" rel="noopener noreferrer">
                  Preview
                </PreviewButton>
              </TemplateActions>
            </TemplateDetails>
          </TemplateCard>
        ))}
      </TemplateGrid>
      
      <Pagination>
        {[1, 2, 3].map(page => (
          <PageNumber 
            key={page} 
            active={activePage === page}
            onClick={() => setActivePage(page)}
          >
            {page}
          </PageNumber>
        ))}
      </Pagination>
    </PageContainer>
  );
};

export default Templates; 