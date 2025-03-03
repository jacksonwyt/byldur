import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaRobot, FaMagic, FaCode, FaImage, FaFont, FaSpinner, FaCreditCard, 
  FaCopy, FaCheck, FaPlay, FaHistory, FaLightbulb, FaTimes, FaSave } from 'react-icons/fa';
import { Button } from '../ui';
import { useAI } from '../../hooks/useAI';
import useAuthApi from '../../hooks/useAuthApi';
import { useEditor } from '../../hooks/useEditor';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PanelContainer = styled.div`
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg-color);
  border-left: 1px solid var(--border-color);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 1.2rem;
`;

const CreditInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: var(--bg-color);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
`;

const CreditAmount = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.low ? 'var(--warning-color)' : 'var(--text-color)'};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-text-color)' : 'var(--text-color)'};
  border: none;
  border-radius: 0.25rem 0.25rem 0 0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--primary-color-light)'};
  }
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }
`;

const ResponseArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  border: 1px solid var(--border-color);
  position: relative;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const GenerationCost = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-top: 0.5rem;
  font-style: italic;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: white;
  z-index: 10;
  gap: 1rem;
`;

const SpinnerContainer = styled.div`
  animation: spin 1s linear infinite;
  font-size: 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HistoryItem = styled.div`
  padding: 0.75rem;
  background-color: var(--bg-color);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const HistoryPrompt = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistoryDate = styled.div`
  font-size: 0.8rem;
  color: var(--text-color-secondary);
`;

const ResponseActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button`
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--primary-color-light);
    border-color: var(--primary-color);
  }
`;

const NotificationBox = styled.div`
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.type === 'success' ? 'var(--success-bg)' : props.type === 'error' ? 'var(--error-bg)' : 'var(--info-bg)'};
  color: ${props => props.type === 'success' ? 'var(--success-color)' : props.type === 'error' ? 'var(--error-color)' : 'var(--info-color)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AIAssistantPanel = () => {
  const [activeTab, setActiveTab] = useState('component');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [options, setOptions] = useState({
    responsive: true,
    includeStyles: true,
    semanticHtml: true
  });
  const [selectedComponentType, setSelectedComponentType] = useState('section');
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { generating, credits, generateComponent, generateWebsite, getSuggestions, usageHistory } = useAI();
  const { isAuthenticated, user } = useAuthApi();
  const { editor } = useEditor();
  const navigate = useNavigate();
  const responseRef = useRef(null);
  
  // Check if user has active subscription for AI
  const hasAIAccess = user?.subscription?.status === 'active';
  
  // Load prompt history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse prompt history', e);
      }
    }
  }, []);
  
  // Save prompt history to local storage
  useEffect(() => {
    if (promptHistory.length > 0) {
      localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    }
  }, [promptHistory]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Set local generating state to match context state
  useEffect(() => {
    setIsGenerating(generating);
  }, [generating]);
  
  const getCost = () => {
    switch(activeTab) {
      case 'component':
        return 1;
      case 'page':
        return 5;
      case 'suggestions':
        return 2;
      default:
        return 1;
    }
  };
  
  const saveToHistory = (newPrompt, newResponse, tabType) => {
    const historyItem = {
      id: Date.now(),
      prompt: newPrompt,
      response: newResponse,
      type: tabType,
      date: new Date().toISOString(),
      options: { ...options }
    };
    
    setPromptHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep only 10 most recent items
  };
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setNotification({ type: 'error', message: 'Please enter a prompt' });
      return;
    }
    
    if (!hasAIAccess) {
      setNotification({ type: 'error', message: 'AI features require a subscription' });
      return;
    }
    
    if (credits < getCost()) {
      setNotification({ type: 'error', message: 'Not enough AI credits' });
      return;
    }
    
    try {
      setIsGenerating(true);
      setResponse('');
      
      let result;
      
      switch(activeTab) {
        case 'component':
          result = await generateComponent(prompt, selectedComponentType, options);
          break;
        case 'page':
          result = await generateWebsite(prompt, options);
          break;
        case 'suggestions':
          result = await getSuggestions(prompt, options);
          break;
        default:
          throw new Error('Invalid tab selection');
      }
      
      setResponse(result.content);
      saveToHistory(prompt, result.content, activeTab);
      setNotification({ type: 'success', message: 'Content generated successfully!' });
    } catch (error) {
      setResponse('');
      setNotification({ 
        type: 'error', 
        message: error.message || 'Failed to generate content'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleBuyCredits = () => {
    navigate('/dashboard/subscription');
  };
  
  const copyToClipboard = () => {
    if (!response) return;
    
    navigator.clipboard.writeText(response)
      .then(() => {
        setCopied(true);
        setNotification({ type: 'success', message: 'Copied to clipboard!' });
      })
      .catch(() => {
        setNotification({ type: 'error', message: 'Failed to copy to clipboard' });
      });
  };
  
  const applyToEditor = () => {
    if (!editor || !response) {
      setNotification({ type: 'error', message: 'Editor not available or no content to apply' });
      return;
    }
    
    try {
      // For HTML components
      if (activeTab === 'component' || activeTab === 'page') {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = response;
        
        // Add the component to the editor
        const component = editor.addComponents(response)[0];
        
        if (component) {
          // Select the added component
          editor.select(component);
          setNotification({ type: 'success', message: 'Applied to editor successfully!' });
        } else {
          throw new Error('Failed to add component to editor');
        }
      } 
      // For suggestions, just show a notification
      else if (activeTab === 'suggestions') {
        setNotification({ type: 'info', message: 'Suggestions cannot be directly applied. Please implement them manually.' });
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: `Failed to apply to editor: ${error.message || 'Unknown error'}`
      });
    }
  };
  
  const loadHistoryItem = (item) => {
    setActiveTab(item.type);
    setPrompt(item.prompt);
    setResponse(item.response);
    setOptions(item.options || options);
    setShowHistory(false);
  };
  
  // Extract code blocks from the response based on markdown-style code blocks
  const extractCodeBlocks = (text) => {
    if (!text) return [];
    
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'html',
        code: match[2]
      });
    }
    
    return blocks;
  };
  
  const renderResponse = () => {
    if (!response) return null;
    
    const codeBlocks = extractCodeBlocks(response);
    
    if (codeBlocks.length === 0) {
      // If no code blocks found, render as plain text
      return <div>{response}</div>;
    }
    
    // Replace the code blocks with placeholders
    let parts = [];
    let lastIndex = 0;
    
    codeBlocks.forEach((block, index) => {
      const fullMatch = `\`\`\`${block.language}\n${block.code}\`\`\``;
      const matchIndex = response.indexOf(fullMatch, lastIndex);
      
      if (matchIndex > lastIndex) {
        // Add text before code block
        parts.push(<div key={`text-${index}`}>{response.substring(lastIndex, matchIndex)}</div>);
      }
      
      // Add syntax highlighted code block
      parts.push(
        <SyntaxHighlighter
          key={`code-${index}`}
          language={block.language || 'html'}
          style={tomorrow}
          wrapLines={true}
          showLineNumbers={true}
        >
          {block.code}
        </SyntaxHighlighter>
      );
      
      lastIndex = matchIndex + fullMatch.length;
    });
    
    // Add remaining text after last code block
    if (lastIndex < response.length) {
      parts.push(<div key="text-last">{response.substring(lastIndex)}</div>);
    }
    
    return parts;
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <FaRobot /> AI Assistant
      </PanelHeader>
      
      {notification && (
        <NotificationBox type={notification.type}>
          <div>{notification.message}</div>
          <FaTimes style={{ cursor: 'pointer' }} onClick={() => setNotification(null)} />
        </NotificationBox>
      )}
      
      {!hasAIAccess ? (
        <div style={{ padding: '1rem' }}>
          <h3>AI Features Require a Subscription</h3>
          <p>
            AI-powered features require an active subscription plan. 
            Subscribe now to access AI components, page generation, and design suggestions.
          </p>
          <button 
            onClick={() => navigate('/dashboard/subscription?required=true&aiOnly=true')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            View Subscription Plans
          </button>
        </div>
      ) : (
        <>
          <CreditInfo>
            <div>AI Credits</div>
            <CreditAmount low={credits < 5}>
              {credits} <FaCreditCard />
            </CreditAmount>
          </CreditInfo>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'component'} 
              onClick={() => setActiveTab('component')}
            >
              <FaCode /> Component
            </Tab>
            <Tab 
              active={activeTab === 'page'} 
              onClick={() => setActiveTab('page')}
            >
              <FaMagic /> Full Page
            </Tab>
            <Tab 
              active={activeTab === 'suggestions'} 
              onClick={() => setActiveTab('suggestions')}
            >
              <FaLightbulb /> Suggestions
            </Tab>
            <Tab 
              active={showHistory}
              onClick={() => setShowHistory(!showHistory)}
            >
              <FaHistory /> History
            </Tab>
          </TabsContainer>
          
          {!showHistory ? (
            <>
              {activeTab === 'component' && (
                <div>
                  <select 
                    value={selectedComponentType}
                    onChange={(e) => setSelectedComponentType(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    <option value="section">Section</option>
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                    <option value="navigation">Navigation</option>
                    <option value="card">Card</option>
                    <option value="gallery">Gallery</option>
                    <option value="form">Form</option>
                    <option value="hero">Hero</option>
                    <option value="features">Features Section</option>
                    <option value="testimonials">Testimonials</option>
                    <option value="pricing">Pricing Table</option>
                    <option value="faq">FAQ</option>
                    <option value="cta">Call to Action</option>
                  </select>
                </div>
              )}
              
              <OptionsContainer>
                <OptionLabel>
                  <Checkbox
                    type="checkbox"
                    name="responsive"
                    checked={options.responsive}
                    onChange={handleOptionChange}
                  />
                  Make it responsive
                </OptionLabel>
                
                <OptionLabel>
                  <Checkbox
                    type="checkbox"
                    name="includeStyles"
                    checked={options.includeStyles}
                    onChange={handleOptionChange}
                  />
                  Include CSS styles
                </OptionLabel>
                
                <OptionLabel>
                  <Checkbox
                    type="checkbox"
                    name="semanticHtml"
                    checked={options.semanticHtml}
                    onChange={handleOptionChange}
                  />
                  Use semantic HTML
                </OptionLabel>
              </OptionsContainer>
              
              <InputArea>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'component'
                      ? `Describe the ${selectedComponentType} you want to create...`
                      : activeTab === 'page'
                      ? 'Describe the page you want to build...'
                      : 'Ask for suggestions to improve your design...'
                  }
                />
                <GenerationCost>Cost: {getCost()} credit{getCost() > 1 ? 's' : ''}</GenerationCost>
              </InputArea>
              
              <ResponseArea ref={responseRef}>
                {renderResponse()}
                
                {response && !isGenerating && (
                  <ResponseActions>
                    <ActionButton title="Copy to clipboard" onClick={copyToClipboard}>
                      {copied ? <FaCheck /> : <FaCopy />}
                    </ActionButton>
                    <ActionButton title="Apply to editor" onClick={applyToEditor}>
                      <FaPlay />
                    </ActionButton>
                    <ActionButton title="Save to file" onClick={() => setNotification({ type: 'info', message: 'Save to file feature coming soon' })}>
                      <FaSave />
                    </ActionButton>
                  </ResponseActions>
                )}
                
                {isGenerating && (
                  <LoadingOverlay>
                    <SpinnerContainer>
                      <FaSpinner />
                    </SpinnerContainer>
                    <div>Generating AI content...</div>
                    <div>This may take up to 30 seconds</div>
                  </LoadingOverlay>
                )}
              </ResponseArea>
            </>
          ) : (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <h3 style={{ marginBottom: '1rem' }}>Prompt History</h3>
              
              {promptHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
                  No prompt history yet. Generate some content first!
                </div>
              ) : (
                promptHistory.map(item => (
                  <HistoryItem key={item.id} onClick={() => loadHistoryItem(item)}>
                    <HistoryPrompt>{item.prompt}</HistoryPrompt>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ 
                        backgroundColor: 'var(--primary-color-light)', 
                        padding: '0.1rem 0.5rem', 
                        borderRadius: '0.25rem',
                        fontSize: '0.8rem'
                      }}>
                        {item.type}
                      </span>
                      <HistoryDate>{new Date(item.date).toLocaleString()}</HistoryDate>
                    </div>
                  </HistoryItem>
                ))
              )}
              
              {promptHistory.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Button 
                    variant="danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your prompt history?')) {
                        setPromptHistory([]);
                        localStorage.removeItem('promptHistory');
                      }
                    }}
                  >
                    Clear History
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <ActionButtons>
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating || credits < getCost()}
              style={{ minWidth: '120px' }}
            >
              {isGenerating ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </Button>
            
            <Button variant="secondary" onClick={() => setPrompt('')} disabled={!prompt || isGenerating}>
              Clear
            </Button>
            
            <Button variant="outline" onClick={handleBuyCredits}>
              Buy Credits
            </Button>
          </ActionButtons>
        </>
      )}
    </PanelContainer>
  );
};

export default AIAssistantPanel; 