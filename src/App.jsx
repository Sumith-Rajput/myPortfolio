import { BrowserRouter as Router, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { useState, useEffect } from 'react'
import { getPersonalInfo, getSkills, getExperience, getProjects, getProfessionalInfo } from './services/api'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}

function Home() {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personal, skillsData] = await Promise.all([
          getPersonalInfo(),
          getSkills()
        ])
        setPersonalInfo(personal)
        setSkills(skillsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to default data
        setPersonalInfo({
          name: 'Sumith Rajput',
          title: 'Integration Engineer',
          bio: 'Specialized in MuleSoft, AWS, Azure Integration Services & Modern API Design',
          photo: '/profile-photo.jpg'
        })
        setSkills(['AWS', 'MuleSoft', 'OpenAI', 'React', 'Node.js', 'API Design', 'Cloud Architecture'])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-gray-400">Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-50"></div>
                <img
                  src={personalInfo?.photo || '/profile-photo.jpg'}
                  alt={personalInfo?.name || 'Profile'}
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-indigo-500/50 shadow-2xl"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Hi, I'm <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{personalInfo?.name || 'Sumith Rajput'}</span>
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl mb-4">{personalInfo?.title || 'Integration Engineer'}</p>
            <p className="text-gray-400 text-lg mb-8">{personalInfo?.bio || 'Specialized in MuleSoft, AWS, Azure Integration Services & Modern API Design'}</p>
            <div className="flex gap-4 justify-center">
              <Link to="/projects">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg">
                  View Projects
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white px-8 py-3 rounded-lg text-lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Technologies & Tools</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}

function About() {
  const [experience, setExperience] = useState([])
  const [expertise, setExpertise] = useState([])
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, profData, personal] = await Promise.all([
          getExperience(),
          getProfessionalInfo(),
          getPersonalInfo()
        ])
        setExperience(expData)
        setExpertise(profData.expertise || [])
        setPersonalInfo(personal)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to default data
        setExperience([
          {
            role: 'Senior Integration Architect',
            company: 'Company Name',
            period: '2020 - Present',
            description: 'Leading cloud-native integration projects and API design initiatives.'
          },
          {
            role: 'Solutions Architect',
            company: 'Previous Company',
            period: '2018 - 2020',
            description: 'Designed and implemented enterprise integration solutions.'
          }
        ])
        setExpertise([
          { category: 'Integration', items: ['MuleSoft', 'AWS API Gateway', 'REST/SOAP APIs', 'Event-Driven Architecture'] },
          { category: 'Cloud', items: ['AWS Lambda', 'S3', 'DynamoDB', 'CloudFormation', 'ECS'] },
          { category: 'Development', items: ['React', 'Node.js', 'Python', 'Java', 'TypeScript'] },
          { category: 'AI/ML', items: ['OpenAI API', 'LangChain', 'Vector Databases', 'Prompt Engineering'] }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-400">Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {personalInfo?.bio || 'I design cloud-native integration architectures leveraging AWS, MuleSoft, and modern APIs. Passionate about scalable design, automation, and simplifying digital ecosystems.'}
          </p>
        </motion.div>

        {/* Expertise */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {expertise.map((exp, i) => (
            <motion.div
              key={exp.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-400">{exp.category}</h3>
                  <ul className="space-y-2">
                    {exp.items.map((item) => (
                      <li key={item} className="text-gray-300 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-6">Experience</h3>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-l-2 border-indigo-500 pl-6 pb-6"
              >
                <h4 className="text-xl font-semibold mb-1">{exp.role}</h4>
                <p className="text-indigo-400 mb-2">{exp.company} • {exp.period}</p>
                <p className="text-gray-400">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to default data
        setProjects([
          {
            title: 'Salon Web App',
            description: 'Full-stack salon management app with admin and customer portals. Features real-time booking, payment processing, and analytics dashboard.',
            tech: ['React', 'Node.js', 'AWS Lambda', 'Cognito', 'DynamoDB'],
            link: '#',
            github: '#'
          },
          {
            title: 'Integration Platform',
            description: 'MuleSoft + AWS hybrid integration for retail systems. Connects SAP, Salesforce, and custom APIs with event-driven architecture.',
            tech: ['MuleSoft', 'AWS API Gateway', 'SAP', 'Salesforce', 'EventBridge'],
            link: '#',
            github: '#'
          },
          {
            title: 'AI Resume Optimizer',
            description: 'Resume analyzer powered by OpenAI APIs. Provides ATS optimization suggestions and keyword matching.',
            tech: ['React', 'OpenAI API', 'Vercel', 'TypeScript'],
            link: '#',
            github: '#'
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto text-center py-16">
          <p className="text-gray-400">Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-400">A showcase of my recent work and contributions</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-indigo-400">{p.title}</h3>
                  <p className="text-gray-400 mb-4 flex-grow">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tech.map((t) => (
                      <span key={t} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
                      Live Demo →
                    </a>
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 text-sm">
                      GitHub →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personal = await getPersonalInfo()
        setPersonalInfo(personal)
      } catch (error) {
        console.error('Error fetching personal info:', error)
        // Fallback to default data
        setPersonalInfo({
          socialLinks: [
            { name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', icon: '💼' },
            { name: 'GitHub', url: 'https://github.com/yourusername', icon: '💻' },
            { name: 'Email', url: 'mailto:your.email@example.com', icon: '✉️' },
            { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: '🐦' }
          ],
          availability: {
            status: 'available',
            message: 'Currently available for new projects',
            responseTime: 'Usually within 24 hours'
          }
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-400">Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  const socialLinks = personalInfo?.socialLinks || []

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-400 text-lg">Open for consulting, collaboration, or full-time roles</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="5"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    {submitted ? 'Message Sent! ✓' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                <div className="space-y-3">
                  {socialLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 hover:border-indigo-500 border border-gray-700 transition group"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-gray-300 group-hover:text-indigo-400 transition">{link.name}</span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Availability</h3>
                <p className="text-gray-400 mb-2">
                  <span className="text-green-400">●</span> {personalInfo?.availability?.message || 'Currently available for new projects'}
                </p>
                <p className="text-gray-400 text-sm">
                  Response time: {personalInfo?.availability?.responseTime || 'Usually within 24 hours'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default function PortfolioApp() {
  const location = useLocation()
  const [personalInfo, setPersonalInfo] = useState(null)

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const personal = await getPersonalInfo()
        setPersonalInfo(personal)
      } catch (error) {
        console.error('Error fetching personal info:', error)
        setPersonalInfo({
          name: 'Sumith Rajput',
          socialLinks: []
        })
      }
    }
    fetchPersonalInfo()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold text-indigo-400">
              Portfolio
            </Link>
            <div className="flex gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-indigo-400 transition ${isActive ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `hover:text-indigo-400 transition ${isActive ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `hover:text-indigo-400 transition ${isActive ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `hover:text-indigo-400 transition ${isActive ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">About</h3>
              <p className="text-gray-400 text-sm">
                {personalInfo?.bio || 'Specialized in MuleSoft, AWS, Azure Integration Services & Modern API Design'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition text-sm">
                  Home
                </Link>
                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition text-sm">
                  About
                </Link>
                <Link to="/projects" className="text-gray-400 hover:text-indigo-400 transition text-sm">
                  Projects
                </Link>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition text-sm">
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Connect</h3>
              <div className="flex flex-col gap-2">
                {personalInfo?.socialLinks?.map((link, i) => {
                  const href = link.name === 'Email' && !link.url.startsWith('mailto:') 
                    ? `mailto:${link.url}` 
                    : link.url
                  return (
                    <a
                      key={i}
                      href={href}
                      target={href.startsWith('mailto:') || href.startsWith('#') ? '_self' : '_blank'}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="text-gray-400 hover:text-indigo-400 transition text-sm flex items-center gap-2"
                    >
                      <span>{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-gray-600">
                © {new Date().getFullYear()} {personalInfo?.name || 'Sumith Rajput'}. All rights reserved.
              </p>
              <p className="text-gray-500">
                Built with React, Framer Motion & Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AppWrapper() {
  return (
    <Router>
      <PortfolioApp />
    </Router>
  )
}

