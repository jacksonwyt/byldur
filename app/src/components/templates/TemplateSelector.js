import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import TemplateCard from './TemplateCard';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';

const SelectorContainer = styled.div`
  width: 100%;
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 1rem;
    background-color: var(--bg-color);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-light);
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color-dark)' : 'var(--bg-color-hover)'};
  }
`;

const FiltersContainer = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  padding: 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryChip = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--bg-color)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color-dark)' : 'var(--bg-color-hover)'};
  }
`;

const ActiveFiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-color-light);
  color: var(--primary-color-dark);
  border-radius: 1rem;
  font-size: 0.875rem;
  
  svg {
    cursor: pointer;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: var(--bg-color);
  border-radius: 0.25rem;
  border: 1px dashed var(--border-color);
  color: var(--text-color-secondary);
`;

const TemplateSelector = ({ 
  templates = [], 
  selectedTemplateId = null,
  onSelectTemplate,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  
  // Extract unique categories from templates
  const categories = [...new Set(templates.map(template => template.category))].filter(Boolean);
  
  // Apply filters whenever search or categories change
  useEffect(() => {
    let result = [...templates];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(term) || 
        template.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(template => 
        selectedCategories.includes(template.category)
      );
    }
    
    setFilteredTemplates(result);
  }, [templates, searchTerm, selectedCategories]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };
  
  const removeCategory = (category) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };
  
  return (
    <SelectorContainer>
      <SearchFilterBar>
        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchBar>
        
        <FilterButton 
          active={showFilters} 
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filter
        </FilterButton>
      </SearchFilterBar>
      
      <FiltersContainer show={showFilters}>
        <FilterGroup>
          <FilterLabel>Categories</FilterLabel>
          <CategoryFilters>
            {categories.map(category => (
              <CategoryChip
                key={category}
                selected={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </CategoryChip>
            ))}
          </CategoryFilters>
        </FilterGroup>
        
        <FilterButton onClick={clearFilters}>
          Clear Filters
        </FilterButton>
      </FiltersContainer>
      
      {(selectedCategories.length > 0 || searchTerm) && (
        <ActiveFiltersBar>
          {selectedCategories.map(category => (
            <ActiveFilter key={category}>
              {category}
              <FaTimes onClick={() => removeCategory(category)} />
            </ActiveFilter>
          ))}
          
          {searchTerm && (
            <ActiveFilter>
              Search: {searchTerm}
              <FaTimes onClick={() => setSearchTerm('')} />
            </ActiveFilter>
          )}
        </ActiveFiltersBar>
      )}
      
      {loading ? (
        <Spinner message="Loading templates..." />
      ) : filteredTemplates.length > 0 ? (
        <TemplateGrid>
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={selectedTemplateId === template.id}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </TemplateGrid>
      ) : (
        <EmptyState>
          <h3>No templates found</h3>
          <p>Try adjusting your search or filters to find more templates.</p>
        </EmptyState>
      )}
    </SelectorContainer>
  );
};

TemplateSelector.propTypes = {
  templates: PropTypes.array,
  selectedTemplateId: PropTypes.string,
  onSelectTemplate: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default TemplateSelector; 