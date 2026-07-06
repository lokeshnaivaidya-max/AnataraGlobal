import HeroSection from '../components/about/HeroSection'
import WhoWeAre from '../components/about/WhoWeAre'
import VisionMission from '../components/about/VisionMission'
import PhilosophySection from '../components/about/PhilosophySection'
import GrowthFramework from '../components/about/GrowthFramework'
import ServicesSection from '../components/about/ServicesSection'
import FutureRoadmap from '../components/about/FutureRoadmap'
import ResourcesSection from '../components/about/ResourcesSection'

export default function About() {
  return (
    <div style={{ backgroundColor: '#FFF8F2' }}>
      <HeroSection />
      <WhoWeAre />
      <VisionMission />
      <PhilosophySection />
      <GrowthFramework />
      <ServicesSection />
      <FutureRoadmap />
      <ResourcesSection />
    </div>
  )
}
