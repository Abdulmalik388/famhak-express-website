import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { blogAPI } from '../services/blogApi'
import heroImage from '../assets/blog-hero.png'
import '../style/Blog.css'

function Blog() {
  const [posts, setPosts] = useState([])
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        const [listResult, featuredResult] = await Promise.allSettled([
          blogAPI.list(),
          blogAPI.featured(),
        ])

        if (listResult.status === 'fulfilled') {
          setPosts(listResult.value.data)
        } else {
          throw new Error('Unable to load blog posts')
        }

        if (featuredResult.status === 'fulfilled') {
          setFeatured(featuredResult.value.data)
        } else {
          setFeatured(null)
        }
      } catch (err) {
        setError('Unable to load the blog at this time. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const latestPosts = posts.slice(0, 4)
  const insightCards = [
    {
      title: 'Practical Delivery Tips',
      description: 'Explore simple ways to improve dispatch planning, rider coordination, and customer updates.',
      badge: 'Guides',
    },
    {
      title: 'Fresh Logistics Insights',
      description: 'Stay informed with stories that make shipping, tracking, and customer service easier.',
      badge: 'Stories',
    },
    {
      title: 'Business Growth Ideas',
      description: 'Learn how better logistics support speed, trust, and growth for modern businesses.',
      badge: 'Growth',
    },
  ]

  const whyFollowCards = [
    {
      title: 'Expert Advice',
      description: 'Get practical guidance from logistics professionals and specialists who know what works.',
      icon: '✦',
    },
    {
      title: 'Industry Updates',
      description: 'Stay informed with the latest delivery trends, tools, and service tips that matter.',
      icon: '◌',
    },
    {
      title: 'Business Growth Tips',
      description: 'Learn how better delivery systems can help you save time, build trust, and grow faster.',
      icon: '↗',
    },
  ]

  return (
    <div className="blog-page">
      <Navbar />

      {/* Hero */}
      <section
        className="blog-hero py-5 text-white "
        style={{
          backgroundImage: ` url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mt-5">
          <div className="row align-items-center">
            <div className="col-lg-8 text-center">
              <h3 className="mb-2 text-white">Insights, Tips & Delivery Stories</h3>
              <h1 className="display-5  text-white">Stay updated with the latest logistics trends</h1>
              <p className=" mt-3 text-white">Stay updated with the latest logistics trends, delivery tips, business shipping guides, and stories from transportation and courier services.</p>
              <div className="mt-4">
                <Link to="#latest-articles" className="btn btn-explore me-3">Explore Articles</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {insightCards.map((card) => (
            <div key={card.title} className="col-md-4">
              <div className="highlight-card h-100">
                <span className="highlight-card-badge">{card.badge}</span>
                <h5>{card.title}</h5>
                <p>{card.description}</p>
                <Link to="#latest-articles" className="btn btn-highlight">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      <section className="container featured-article py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Featured Article</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading blog posts...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : featured ? (
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h4 className="fw-bold">{featured.title}</h4>
              <p className="text-muted small">{new Date(featured.published_at).toLocaleDateString()} • By {featured.author}</p>
              <p className="mt-3">{featured.excerpt}</p>
              <div className="mt-3">
                <Link to={`/blog/${featured.slug}`} className="btn btn-read">Read More</Link>
              </div>
            </div>
            <div className="col-lg-4 featured-image-column">
              {featured.image_url ? (
                <img src={featured.image_url} alt={featured.title} className="img-fluid rounded-3 shadow-sm featured-image" />
              ) : (
                <div className="featured-image-placeholder">No image</div>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-secondary">No featured article is available yet.</div>
        )}
      </section>

      {/* Latest Articles */}
      <section id="latest-articles" className="container latest-articles py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Latest Articles</h2>
          <p className="text-muted">Explore our newest articles designed to help individuals and businesses improve their shipping, logistics, and delivery experience.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading latest articles...</div>
        ) : error ? null : posts.length ? (
          <div className="row g-4">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="col-md-4">
                <div className="card article-card h-100 border-0">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="card-img-top" style={{height: '220px', objectFit: 'cover'}} />
                  ) : (
                    <div className="article-image-placeholder" style={{height: '220px'}}>No image</div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-muted small">{post.excerpt}</p>
                    <div className="mt-3">
                      <Link to={`/blog/${post.slug}`} className="btn btn-excerpt">Read More →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-secondary text-center">No articles available yet. Check back soon.</div>
        )}
      </section>

      {/* Why Follow */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <h3 className="fw-bold section-title">Why Follow the Famhak Blog?</h3>
          <p className="section-subtitle">Helpful ideas and practical updates for customers, businesses, and delivery teams.</p>
        </div>
        <div className="row g-4">
          {whyFollowCards.map((card) => (
            <div key={card.title} className="col-md-4">
              <div className="why-follow-card h-100">
                <div className="why-follow-icon">{card.icon}</div>
                <h6 className="fw-bold">{card.title}</h6>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="blog-cta py-5 mt-5">
        <div className="container">
          <div className="cta-card text-center">
            <h2 className="fw-bold">Ready to Experience Better Deliveries?</h2>
            <p>Whether you're sending a package or growing a business, Famhak Express is here to make delivery simple, reliable, and stress-free.</p>
            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-getstarted">Get Started</Link>
              <Link to="/contact" className="btn btn-contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Blog
     