import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaintBrush, FaMobileAlt, FaCode, FaRocket, FaCloudUploadAlt, FaShareAlt, FaArrowRight } from 'react-icons/fa';
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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background: var(--card-bg-color);
  border-radius: 10px;
  padding: 30px;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--card-shadow-hover);
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  font-size: 1.8rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: var(--text-color-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  padding-left: 20px;
  margin-bottom: 20px;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
  color: var(--text-color-secondary);
`;

const CTASection = styled.div`
  text-align: center;
  margin: 80px 0;
  padding: 60px;
  background: var(--bg-light);
  border-radius: 20px;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: var(--text-color-secondary);
  max-width: 700px;
  margin: 0 auto 30px;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background: var(--primary-color);
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 10px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background: var(--primary-dark);
  }
`;

const Features = () => {
  const { isAuthenticated } = useAuthApi();
  const authLink = isAuthenticated ? '/dashboard' : '/register';
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Free Features</PageTitle>
        <PageSubtitle>
          Byldur offers a powerful set of free features to help you build beautiful websites.
          No credit card required, no hidden costs.
        </PageSubtitle>
      </PageHeader>
      
      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaPaintBrush />
          </FeatureIcon>
          <FeatureTitle>Drag & Drop Editor</FeatureTitle>
          <FeatureDescription>
            Build your website visually with our intuitive drag and drop editor, no coding required.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>Intuitive visual interface</FeatureItem>
            <FeatureItem>Extensive component library</FeatureItem>
            <FeatureItem>Real-time preview</FeatureItem>
          </FeatureList>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaMobileAlt />
          </FeatureIcon>
          <FeatureTitle>Responsive Design</FeatureTitle>
          <FeatureDescription>
            Create websites that look great on any device with automatic responsive layout adjustments.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>Mobile-first approach</FeatureItem>
            <FeatureItem>Device-specific previews</FeatureItem>
            <FeatureItem>Responsive breakpoint controls</FeatureItem>
          </FeatureList>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaCode />
          </FeatureIcon>
          <FeatureTitle>HTML/CSS Export</FeatureTitle>
          <FeatureDescription>
            Export your designs as clean, optimized HTML and CSS code that you can use anywhere.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>Clean code generation</FeatureItem>
            <FeatureItem>CSS optimization</FeatureItem>
            <FeatureItem>Asset bundling</FeatureItem>
          </FeatureList>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaRocket />
          </FeatureIcon>
          <FeatureTitle>Free Hosting (Subdomain)</FeatureTitle>
          <FeatureDescription>
            Publish your website instantly with our free hosting on a Byldur subdomain.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>One-click publishing</FeatureItem>
            <FeatureItem>Fast global CDN</FeatureItem>
            <FeatureItem>Free SSL certificate</FeatureItem>
          </FeatureList>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaCloudUploadAlt />
          </FeatureIcon>
          <FeatureTitle>Unlimited Projects</FeatureTitle>
          <FeatureDescription>
            Create as many projects as you want with no artificial limits on your creativity.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>Store multiple websites</FeatureItem>
            <FeatureItem>Project organization tools</FeatureItem>
            <FeatureItem>Version history</FeatureItem>
          </FeatureList>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaShareAlt />
          </FeatureIcon>
          <FeatureTitle>Basic SEO Tools</FeatureTitle>
          <FeatureDescription>
            Get your website found with our built-in SEO optimization tools.
          </FeatureDescription>
          <FeatureList>
            <FeatureItem>Meta tag editor</FeatureItem>
            <FeatureItem>SEO best practices</FeatureItem>
            <FeatureItem>Search engine preview</FeatureItem>
          </FeatureList>
        </FeatureCard>
      </FeatureGrid>
      
      <CTASection>
        <CTATitle>Start Building for Free Today</CTATitle>
        <CTAText>
          Join thousands of users already creating beautiful websites with Byldur&apos;s free tools.
          No credit card required, get started in seconds.
        </CTAText>
        <CTAButton to={authLink}>
          Get Started Now <FaArrowRight />
        </CTAButton>
      </CTASection>
    </PageContainer>
  );
};

export default Features; 