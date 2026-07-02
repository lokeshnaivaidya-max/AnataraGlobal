import HeroSection from '../components/about/HeroSection'
import WhoWeAre from '../components/about/WhoWeAre'
import VisionMission from '../components/about/VisionMission'
import PhilosophySection from '../components/about/PhilosophySection'
import GrowthFramework from '../components/about/GrowthFramework'
import ServicesSection from '../components/about/ServicesSection'
import FutureRoadmap from '../components/about/FutureRoadmap'
import ResourcesSection from '../components/about/ResourcesSection'
import BrandClosingCTA from '../components/about/BrandClosingCTA'
import ContactSection from '../components/about/ContactSection'

export default function About() {
  return (
    <>
      <HeroSection />
      <WhoWeAre />
      <VisionMission />
      <PhilosophySection />
      <GrowthFramework />
      <ServicesSection />
      <FutureRoadmap />
      <ResourcesSection />
      <BrandClosingCTA />
      <ContactSection />
    </>
  )
}