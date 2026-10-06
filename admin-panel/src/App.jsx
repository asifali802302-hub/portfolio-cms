import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')

  const [editingProjectId, setEditingProjectId] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoginLoading(true)
    setLoginError('')

    try {
      const response = await fetch(
        'https://portfolio-cms-backend-i0hq.onrender.com/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Invalid username or password')
      }

      setIsLoggedIn(true)
      setLoginError('')
      loadProjects()
    } catch (error) {
      console.error(error)
      setLoginError('Invalid username or password.')
    } finally {
      setLoginLoading(false)
    }
  }

  const loadProjects = () => {
    setLoading(true)

    fetch('https://portfolio-cms-backend-i0hq.onrender.com/api/projects')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load projects')
        }

        return response.json()
      })
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setMessage('Backend is not connected.')
        setLoading(false)
      })
  }

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setTechnologies('')
    setGithubUrl('')
    setLiveUrl('')
    setEditingProjectId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const project = {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
    }

    const url =
      editingProjectId !== null
        ? `https://portfolio-cms-backend-i0hq.onrender.com/api/projects/${editingProjectId}`
        : 'https://portfolio-cms-backend-i0hq.onrender.com/api/projects'

    const method =
      editingProjectId !== null ? 'PUT' : 'POST'

    setMessage(
      editingProjectId !== null
        ? 'Updating project...'
        : 'Adding project...'
    )

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed')
        }

        return response.json()
      })
      .then((savedProject) => {
        if (editingProjectId !== null) {
          setProjects((currentProjects) =>
            currentProjects.map((project) =>
              project.id === savedProject.id
                ? savedProject
                : project
            )
          )

          setMessage('Project updated successfully!')
        } else {
          setProjects((currentProjects) => [
            ...currentProjects,
            savedProject,
          ])

          setMessage('Project added successfully!')
        }

        clearForm()
      })
      .catch((error) => {
        console.error(error)
        setMessage('Something went wrong.')
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

  const deleteProject = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmDelete) {
      return
    }

    fetch(`https://portfolio-cms-backend-i0hq.onrender.com/api/projects/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Delete failed')
        }

        setProjects((currentProjects) =>
          currentProjects.filter(
            (project) => project.id !== id
          )
        )

        setMessage('Project deleted successfully!')
      })
      .catch((error) => {
        console.error(error)
        setMessage('Failed to delete project.')
      })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
    clearForm()
    setMessage('')
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <h1>Portfolio CMS</h1>

          <p>Admin Login</p>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>

          {loginError && (
            <p className="login-error">
              {loginError}
            </p>
          )}

        </div>

      </div>
    )
  }

  return (
    <div className="admin-app">

      <header className="admin-navbar">

        <div>
          <h1>Portfolio CMS</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="navbar-actions">

          <a
            href="https://portfolio-cms-one-woad.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            View Portfolio
          </a>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="admin-container">

        <section className="dashboard-header">

          <div>
            <h2>Dashboard</h2>

            <p>
              Manage the projects displayed on your portfolio.
            </p>
          </div>

          <div className="project-count">

            <strong>{projects.length}</strong>

            <span>Projects</span>

          </div>

        </section>

        <section className="admin-card">

          <h2>
            {editingProjectId !== null
              ? 'Edit Project'
              : 'Add New Project'}
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Technologies"
              value={technologies}
              onChange={(event) =>
                setTechnologies(event.target.value)
              }
              required
            />

            <input
              type="url"
              placeholder="GitHub URL"
              value={githubUrl}
              onChange={(event) =>
                setGithubUrl(event.target.value)
              }
            />

            <input
              type="url"
              placeholder="Live Project URL"
              value={liveUrl}
              onChange={(event) =>
                setLiveUrl(event.target.value)
              }
            />

            <div className="form-buttons">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingProjectId !== null
                  ? 'Update Project'
                  : 'Add Project'}
              </button>

              {editingProjectId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {message && (
            <p className="admin-message">
              {message}
            </p>
          )}

        </section>

        <section className="admin-card">

          <div className="section-heading">

            <div>

              <h2>Manage Projects</h2>

              <p>
                Projects currently stored in PostgreSQL.
              </p>

            </div>

          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            <div className="admin-projects">

              {projects.map((project) => (

                <div
                  className="admin-project"
                  key={project.id}
                >

                  <div>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <span>
                      {project.technologies}
                    </span>

                  </div>

                  <div className="project-actions">

                    <button
                      type="button"
                      onClick={() =>
                        editProject(project)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProject(project.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      <footer className="admin-footer">

        <p>
          Portfolio CMS Admin Panel © 2026 Md Asif Ali
        </p>

      </footer>

    </div>
  )
}

export default App