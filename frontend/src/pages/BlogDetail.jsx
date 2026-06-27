import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { blogAPI } from '../services/blogApi'
import heroImage from '../assets/blog-hero.png'
import '../style/Blog.css'

function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await blogAPI.detail(slug)
        setPost(res.data)
      } catch (err) {
        setError('Unable to load article')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <div className="py-5 text-center">Loading...</div>
  if (error) return <div className="py-5 text-center text-danger">{error}</div>
  if (!post) return null

  return (
    <div>
      <Navbar />

      <section
        className="blog-hero py-5 text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mt-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9">
              <h1 className="fw-bold mb-3">{post.title}</h1>
              <p className="text-white-50 mb-0">{new Date(post.published_at).toLocaleDateString()} • By {post.author}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{background: '#f8f9fa'}}>
        <div className="container">
          <div className="mb-4">
            <h1 className="fw-bold">{post.title}</h1>
            <p className="text-muted small">{new Date(post.published_at).toLocaleDateString()} • By {post.author}</p>
          </div>
          {post.image_url && (
            <div className="mb-4">
              <img src={post.image_url} alt={post.title} className="img-fluid rounded-3" />
            </div>
          )}

          <article className="lead" style={{whiteSpace: 'pre-line'}}>
            {post.content}
          </article>

          <div className="mt-4">
            <Link to="/blog" className="btn btn-outline-secondary">← Back to Blog</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogDetail
