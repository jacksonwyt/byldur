import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaMagic, FaPaintBrush, FaMobileAlt, FaRocket, FaCog, FaShieldAlt, FaCheck, FaArrowRight, FaTools, FaPuzzlePiece, FaRegEdit } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

// Styled components for the landing page
const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 80px 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: white;
  color: var(--primary-color);
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Section = styled.section`
  padding: 80px 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: var(--text-primary);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const PricingSection = styled(Section)`
  background: var(--bg-light);
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
`;

const PricingCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &.highlighted {
    border: 2px solid var(--primary-color);
    transform: scale(1.05);
    
    &::before {
      content: "Most Popular";
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
  
  @media (max-width: 768px) {
    &.highlighted {
      transform: scale(1);
    }
  }
`;

const PricingTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: var(--text-primary);
`;

const PricingPrice = styled.div`
  font-size: 3rem;
  margin: 20px 0;
  color: var(--primary-color);
  font-weight: bold;
`;

const PricingPeriod = styled.span`
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: normal;
`;

const PricingDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 20px;
`;

const PricingFeatures = styled.ul`
  margin: 30px 0;
  text-align: left;
  padding-left: 20px;
`;

const PricingFeature = styled.li`
  margin: 10px 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: var(--primary-color);
  }
`;

const PricingButton = styled(Link)`
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

// New components for Get Started section
const GetStartedSection = styled(Section)`
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
`;

const GetStartedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const GetStartedCard = styled(Link)`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    
    h3 {
      color: var(--primary-color);
    }
  }
`;

const StartIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--primary-color);
`;

const StartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-primary);
  transition: color 0.3s ease;
`;

const StartDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 20px;
`;

const Arrow = styled(FaArrowRight)`
  margin-top: auto;
  font-size: 1.2rem;
  color: var(--primary-color);
`;

const FreeBanner = styled.div`
  background-color: var(--success-bg-color);
  color: var(--success-color);
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 30px;
  display: inline-block;
`;

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  // Determine where to direct users based on authentication status
  const getStartedLink = isAuthenticated ? '/dashboard' : '/register';
  const dashboardLink = isAuthenticated ? '/dashboard' : '/register';
  const editorLink = isAuthenticated ? '/projects/new' : '/register';
  
  return (
    <>
      <HeroSection id="hero">
        <HeroContent>
          <HeroTitle>Build Websites with AI</HeroTitle>
          <HeroSubtitle>Create beautiful, responsive websites in minutes with Byldur's AI-powered tools. No coding required.</HeroSubtitle>
          <FreeBanner>
            <FaCheck /> All Core Features Available for FREE
          </FreeBanner>
          <ButtonGroup>
            <PrimaryButton to={getStartedLink}>Get Started Now</PrimaryButton>
            <SecondaryButton to={editorLink}>Create a Website</SecondaryButton>
            <SecondaryButton to={dashboardLink}>View Dashboard</SecondaryButton>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      <GetStartedSection id="get-started">
        <SectionTitle>Start Building for Free</SectionTitle>
        <GetStartedGrid>
          <GetStartedCard to={editorLink}>
            <StartIcon>
              <FaRegEdit />
            </StartIcon>
            <StartTitle>New Project</StartTitle>
            <StartDescription>
              Create a new website project from scratch with our easy-to-use editor.
            </StartDescription>
            <Arrow />
          </GetStartedCard>
          
          <GetStartedCard to={dashboardLink}>
            <StartIcon>
              <FaTools />
            </StartIcon>
            <StartTitle>Dashboard</StartTitle>
            <StartDescription>
              Manage your existing projects and access all your website designs.
            </StartDescription>
            <Arrow />
          </GetStartedCard>
          
          <GetStartedCard to={isAuthenticated ? '/dashboard/profile' : '/register'}>
            <StartIcon>
              <FaPuzzlePiece />
            </StartIcon>
            <StartTitle>Templates</StartTitle>
            <StartDescription>
              Browse our collection of free templates to jumpstart your project.
            </StartDescription>
            <Arrow />
          </GetStartedCard>
          
          <GetStartedCard to={isAuthenticated ? '/dashboard/subscription' : '/register?plan=free'}>
            <StartIcon>
              <FaMagic />
            </StartIcon>
            <StartTitle>AI Features</StartTitle>
            <StartDescription>
              Explore our premium AI tools for enhanced website creation.
            </StartDescription>
            <Arrow />
          </GetStartedCard>
        </GetStartedGrid>
      </GetStartedSection>

      <Section id="features">
        <SectionTitle>Why Choose Byldur?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaMagic />
            </FeatureIcon>
            <FeatureTitle>AI-Powered Creation</FeatureTitle>
            <FeatureDescription>
              Generate entire websites, sections, or components with simple text prompts. Our AI understands what you need.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaPaintBrush />
            </FeatureIcon>
            <FeatureTitle>Drag & Drop Editor</FeatureTitle>
            <FeatureDescription>
              Intuitive visual editor lets you customize every aspect of your site without writing a single line of code.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaMobileAlt />
            </FeatureIcon>
            <FeatureTitle>Responsive Design</FeatureTitle>
            <FeatureDescription>
              Every website you create is automatically optimized for all devices, from desktops to smartphones.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaRocket />
            </FeatureIcon>
            <FeatureTitle>Instant Publishing</FeatureTitle>
            <FeatureDescription>
              Take your site live with one click. Fast hosting and seamless updates are included with every plan.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaCog />
            </FeatureIcon>
            <FeatureTitle>Powerful Integrations</FeatureTitle>
            <FeatureDescription>
              Connect with your favorite tools, from payment processors to marketing platforms, in just a few clicks.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureTitle>Built-in SEO Tools</FeatureTitle>
            <FeatureDescription>
              Optimize your site for search engines with our built-in SEO tools and get found by more customers.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      <PricingSection id="pricing">
        <SectionTitle>Simple, Transparent Pricing</SectionTitle>
        <PricingGrid>
          <PricingCard>
            <PricingTitle>Free</PricingTitle>
            <PricingPrice>$0<PricingPeriod>/mo</PricingPeriod></PricingPrice>
            <PricingDescription>All core features for free</PricingDescription>
            <PricingFeatures>
              <PricingFeature><FaCheck /> <strong>Unlimited websites</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>All templates</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>Export HTML/CSS</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>Byldur subdomain</strong></PricingFeature>
              <PricingFeature><FaCheck /> Community support</PricingFeature>
              <PricingFeature><FaCheck /> 50 AI credits/month</PricingFeature>
            </PricingFeatures>
            <PricingButton to={getStartedLink}>Get Started</PricingButton>
          </PricingCard>
          
          <PricingCard className="highlighted">
            <PricingTitle>AI Basic</PricingTitle>
            <PricingPrice>$19<PricingPeriod>/mo</PricingPeriod></PricingPrice>
            <PricingDescription>Enhanced AI capabilities</PricingDescription>
            <PricingFeatures>
              <PricingFeature><FaCheck /> <strong>All Free features</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>1,000 AI credits/month</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>Priority AI processing</strong></PricingFeature>
              <PricingFeature><FaCheck /> Priority support</PricingFeature>
              <PricingFeature><FaCheck /> Custom domain</PricingFeature>
              <PricingFeature><FaCheck /> Advanced AI templates</PricingFeature>
            </PricingFeatures>
            <PricingButton to={isAuthenticated ? '/dashboard/subscription' : '/register?plan=pro'}>
              Upgrade for AI
            </PricingButton>
          </PricingCard>
          
          <PricingCard>
            <PricingTitle>AI Premium</PricingTitle>
            <PricingPrice>$49<PricingPeriod>/mo</PricingPeriod></PricingPrice>
            <PricingDescription>Maximum AI power</PricingDescription>
            <PricingFeatures>
              <PricingFeature><FaCheck /> <strong>All AI Basic features</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>5,000 AI credits/month</strong></PricingFeature>
              <PricingFeature><FaCheck /> <strong>Advanced AI controls</strong></PricingFeature>
              <PricingFeature><FaCheck /> Dedicated support</PricingFeature>
              <PricingFeature><FaCheck /> Multiple domains</PricingFeature>
              <PricingFeature><FaCheck /> Team collaboration</PricingFeature>
              <PricingFeature><FaCheck /> White-label option</PricingFeature>
            </PricingFeatures>
            <PricingButton to={isAuthenticated ? '/dashboard/subscription' : '/register?plan=business'}>
              Upgrade for Premium AI
            </PricingButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>
    </>
  );
};

export default Home; 