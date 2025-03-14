import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components for content pages
const ContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 90;
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
`;

const ContentBackdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: -1;
`;

const ContentCard = styled(motion.div)`
  max-width: 1000px;
  width: 90%;
  max-height: 80vh;
  background-color: #121212;
  border-radius: 15px;
  padding: 40px;
  color: white;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 25px;
    max-height: 75vh;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ContentHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.color};
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const ContentSubheader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.8;
  color: ${props => props.color};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
`;

const ContentText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.2rem;
  }
`;

const ContentFeatures = styled.ul`
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.8rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    margin: 1.2rem 0;
    padding-left: 1.2rem;
    
    li {
      margin-bottom: 0.6rem;
    }
  }
`;

const CTAButton = styled(motion.button)`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  svg {
    margin-left: 8px;
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    margin-top: 1.2rem;
  }
`;

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const contentVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300,
      delay: 0.1
    } 
  },
  exit: { 
    y: 50, 
    opacity: 0,
    transition: { duration: 0.2 } 
  }
};

// Content for each service
const serviceContent = {
  Education: {
    title: "Education",
    subheader: "Learn with our curated courses",
    description: "Access premium educational content crafted by industry experts. Our education platform offers courses ranging from beginner to advanced levels in various disciplines.",
    features: [
      "Interactive learning experiences",
      "Personalized learning paths",
      "Real-time progress tracking",
      "Community support and mentorship",
      "Certification upon completion"
    ],
    cta: "Explore Courses"
  },
  Write: {
    title: "Write",
    subheader: "Express your ideas with powerful tools",
    description: "Our writing tools help you create compelling content with ease. Whether you're drafting a blog post, essay, or novel, our platform provides the perfect environment for creativity.",
    features: [
      "Distraction-free writing environment",
      "Advanced grammar and style suggestions",
      "Cloud synchronization across devices",
      "Collaborative editing features",
      "Publishing tools and integrations"
    ],
    cta: "Start Writing"
  },
  Games: {
    title: "Games",
    subheader: "Immersive gaming experiences",
    description: "Dive into our collection of games designed to entertain and challenge. From casual puzzle games to immersive adventures, there's something for everyone.",
    features: [
      "High-quality graphics and gameplay",
      "Cross-platform compatibility",
      "Regular updates with new content",
      "Multiplayer capabilities",
      "Achievement tracking and leaderboards"
    ],
    cta: "Play Now"
  },
  Create: {
    title: "Create",
    subheader: "Bring your ideas to life",
    description: "Our creative tools empower you to design, build, and innovate. With intuitive interfaces and powerful features, turn your vision into reality.",
    features: [
      "Professional-grade design tools",
      "Extensive template library",
      "Asset management system",
      "Version control and history",
      "Export in multiple formats"
    ],
    cta: "Start Creating"
  },
  AI: {
    title: "AI",
    subheader: "Harness the power of artificial intelligence",
    description: "Our AI solutions help automate tasks, generate insights, and enhance your workflows. Leverage cutting-edge technology to solve complex problems.",
    features: [
      "Text and image generation",
      "Natural language processing",
      "Data analysis and visualization",
      "Predictive modeling",
      "Custom AI integrations"
    ],
    cta: "Explore AI Tools"
  },
  Design: {
    title: "Design",
    subheader: "Craft beautiful experiences",
    description: "Our design platform provides everything you need to create stunning visuals and user interfaces. From wireframing to final production, we've got you covered.",
    features: [
      "Vector and raster editing tools",
      "Prototyping and interaction design",
      "Design system management",
      "Collaboration features",
      "Design-to-code conversion"
    ],
    cta: "Design Something"
  },
  Products: {
    title: "Products",
    subheader: "Digital tools that simplify your life",
    description: "Browse our collection of digital products designed to enhance your productivity and creativity. From calculators to specialized tools, find the perfect solution for your needs.",
    features: [
      "Calc: Sleek command-line style calculator ($5)",
      "Intuitive user interfaces",
      "No subscriptions - one-time purchases",
      "Regular updates and improvements",
      "Cross-platform compatibility"
    ],
    cta: "Buy Now"
  }
};

// Content Pages component
const ContentPages = ({ 
  isOpen, 
  onClose, 
  activeService,
  services
}) => {
  if (!activeService) return null;
  
  const service = services.find(s => s.name === activeService);
  const content = serviceContent[activeService];
  
  if (!service || !content) return null;
  
  return (
    <ContentContainer isOpen={isOpen}>
      <AnimatePresence>
        {isOpen && (
          <>
            <ContentBackdrop 
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            />
            <ContentCard
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CloseButton 
                onClick={onClose}
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </CloseButton>
              
              <ContentHeader color={service.color}>
                {content.title}
              </ContentHeader>
              
              <ContentSubheader color={service.color}>
                {content.subheader}
              </ContentSubheader>
              
              <ContentText>
                {content.description}
              </ContentText>
              
              <ContentFeatures>
                {content.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ContentFeatures>
              
              <CTAButton 
                color={service.color}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeService === 'Products') {
                    // Open the calculator product page
                    window.open('/products/calc.html', '_blank');
                  }
                }}
              >
                {content.cta}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </CTAButton>
            </ContentCard>
          </>
        )}
      </AnimatePresence>
    </ContentContainer>
  );
};

export default ContentPages; 