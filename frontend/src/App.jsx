import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backendMessage, setBackendMessage] = useState('Connecting to backend...')
  const [loading, setLoading] = useState(true)

  const [projects, setProjects] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')

  const [message, setMessage] = useState('')
  const [editingProjectId, setEditingProjectId] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend request failed')
        }

        return response.text()
      })
      .then((data) => {
        setBackendMessage(data)
        setLoading(false)
      })
      .catch(() => {
        setBackendMessage('Backend is not connected')
        setLoading(false)
      })

    loadProjects()
  }, [])

  const loadProjects = () => {
    fetch('http://localhost:8080/api/projects')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Projects request failed')
        }

        return response.json()
      })
      .then((data) => {
        setProjects(data)
      })
      .catch((error) => {
        console.error('Error loading projects:', error)
      })
  }
  const addProject = (event) => {
  event.preventDefault()

  setMessage('Adding project...')

  const project = {
    title: title,
    description: description,
    technologies: technologies,
    githubUrl: githubUrl,
    liveUrl: liveUrl,
  }

  fetch('http://localhost:8080/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add project')
      }

      return response.json()
    })
    .then((data) => {
      setProjects((currentProjects) => [
        ...currentProjects,
        data,
      ])

      setTitle('')
      setDescription('')
      setTechnologies('')
      setGithubUrl('')
      setLiveUrl('')

      setMessage('Project added successfully!')
    })
    .catch((error) => {
      console.error('Error adding project:', error)
      setMessage('Failed to add project.')
    })
}
  const deleteProject = (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this project?'
  )

  if (!confirmDelete) {
    return
  }

  fetch(`http://localhost:8080/api/projects/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id)
      )

      setMessage('Project deleted successfully!')
    })
    .catch((error) => {
      console.error('Error deleting project:', error)
      setMessage('Failed to delete project.')
    })
}
    const editProject = (project) => {
  setEditingProjectId(project.id)

  setTitle(project.title)
  setDescription(project.description)
  setTechnologies(project.technologies)
  setGithubUrl(project.githubUrl || '')
  setLiveUrl(project.liveUrl || '')

  setMessage('Editing project...')
}
const cancelEdit = () => {
  setEditingProjectId(null)

  setTitle('')
  setDescription('')
  setTechnologies('')
  setGithubUrl('')
  setLiveUrl('')

  setMessage('')
}

const updateProject = (event) => {
  event.preventDefault()

  if (editingProjectId === null) {
    return
  }

  setMessage('Updating project...')

  const project = {
    title: title,
    description: description,
    technologies: technologies,
    githubUrl: githubUrl,
    liveUrl: liveUrl,
  }

  fetch(`http://localhost:8080/api/projects/${editingProjectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      return response.json()
    })
    .then((updatedProject) => {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id
            ? updatedProject
            : project
        )
      )

      setTitle('')
      setDescription('')
      setTechnologies('')
      setGithubUrl('')
      setLiveUrl('')
      setEditingProjectId(null)

      setMessage('Project updated successfully!')
    })
    .catch((error) => {
      console.error('Error updating project:', error)
      setMessage('Failed to update project.')
    })
}

  return (
    <div className="app">

      <header className="navbar">
        <h2>My Portfolio</h2>

        <nav>
          <a href="#home">Home</a>
<a href="#about">About</a>
<a href="#skills">Skills</a>
<a href="#education">Education</a>
<a href="#projects">Projects</a>
<a href="#contact">Contact</a>
        </nav>
      </header>


      <main>

        <section id="home" className="hero-section">
          <div>
            <p className="welcome">WELCOME TO MY PORTFOLIO</p>

            <h1>
              Hi, I'm <span>Md Asif Ali</span>
            </h1>

            <p className="description">
              Information Science Engineering student and aspiring Java Full
              Stack Developer.
            </p>

            <div className="buttons">
              <a href="#projects" className="primary-button">
                View My Projects
              </a>

              <a href="#contact" className="secondary-button">
                Contact Me
              </a>
            </div>
          </div>
        </section>


        <section id="about" className="section">
  <h2>About Me</h2>

  <p>
    I am Md Asif Ali, an Information Science Engineering student
    at East Point College of Engineering. I am interested in Java,
    Spring Boot, React, PostgreSQL and full-stack web development.
    I am currently building practical projects to improve my
    development skills and grow as a Java Full Stack Developer.
  </p>

  <div className="about-details">
    <div>
      <strong>Education</strong>
      <span>B.E. Information Science Engineering</span>
    </div>

    <div>
      <strong>College</strong>
      <span>East Point College of Engineering</span>
    </div>

    <div>
      <strong>Status</strong>
      <span>Student</span>
    </div>
  </div>
</section>
<section id="skills" className="section">
  <h2>My Skills</h2>

  <div className="skills-grid">
    <div className="skill-card">
      <h3>Java</h3>
      <p>Core Java and object-oriented programming.</p>
    </div>

    <div className="skill-card">
      <h3>Spring Boot</h3>
      <p>Backend development and REST APIs.</p>
    </div>

    <div className="skill-card">
      <h3>React</h3>
      <p>Building interactive frontend applications.</p>
    </div>

    <div className="skill-card">
      <h3>PostgreSQL</h3>
      <p>Database design and data management.</p>
    </div>

    <div className="skill-card">
      <h3>HTML & CSS</h3>
      <p>Creating responsive and modern web pages.</p>
    </div>

    <div className="skill-card">
      <h3>JavaScript</h3>
      <p>Frontend logic and web application functionality.</p>
    </div>
  </div>
</section>

<section id="education" className="section">
  <h2>Education & Career</h2>

  <div className="education-card">
    <h3>B.E. Information Science Engineering</h3>

    <p>
      East Point College of Engineering
    </p>

    <p>
      Currently pursuing my engineering degree and developing
      practical skills in Java, Spring Boot, React and PostgreSQL.
    </p>

    <div className="career-goal">
      <strong>Career Goal:</strong>
      <span>Java Full Stack Developer</span>
    </div>
  </div>
</section>


        {/* CMS FORM */}

        <section className="section cms-section">

          <h2>Project CMS</h2>

          <p>Add a new project to your portfolio.</p>

          <form
  onSubmit={editingProjectId !== null ? updateProject : addProject}
  className="project-form"
>

            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Technologies (Example: Java, Spring Boot, React)"
              value={technologies}
              onChange={(event) => setTechnologies(event.target.value)}
              required
            />

            <input
              type="url"
              placeholder="GitHub URL"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
            />

            <input
              type="url"
              placeholder="Live Project URL"
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
            />

            <button type="submit">
  {editingProjectId !== null ? 'Update Project' : 'Add Project'}
</button>

{editingProjectId !== null && (
  <button
    type="button"
    onClick={cancelEdit}
  >
    Cancel Edit
  </button>
)}

          </form>

          {message && (
            <p className="cms-message">
              {message}
            </p>
          )}

        </section>


        <section id="projects" className="section">

          <h2>My Projects</h2>

          <div className="projects">

            {projects.length === 0 ? (
              <p>No projects added yet.</p>
            ) : (

              projects.map((project) => (

                <div className="project-card" key={project.id}>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <p>
                    <strong>Technologies:</strong>{' '}
                    {project.technologies}
                  </p>

                  <div>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    )}

                    {' '}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Project
                      </a>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                    >
                      Edit
                    </button> 

                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                    >
                     Delete
                   </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>


        <section id="contact" className="section">
  <h2>Contact Me</h2>

  <p>
    I am open to learning opportunities, internships,
    collaborations and software development projects.
  </p>

  <div className="contact-details">
    <a href="mailto:asifali802302@gmail.com">
      asifali802302@gmail.com
    </a>
  </div>
</section>


        <section className="backend-section">

          <h2>Backend Connection</h2>

          {loading ? (
            <p>Connecting...</p>
          ) : (
            <p
              className={
                backendMessage.includes('connected')
                  ? 'success'
                  : 'error'
              }
            >
              {backendMessage}
            </p>
          )}

        </section>

      </main>


      <footer>
        <p>© 2026 Md Asif Ali. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App