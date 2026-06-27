import { Link } from 'react-router-dom'
import "../style/Landing.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import heroImage from "../assets/hero.png";
import deliveryVideo from "../assets/delivery.mp4";
import customer1 from "../assets/testimonials/customer1.png";
import customer2 from "../assets/testimonials/customer2.png";
import customer3 from "../assets/testimonials/customer3.png";

import { useRef, useState } from "react";

function Landing() {

const videoRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);

const toggleVideo = () => {
  if (!videoRef.current) return;

  if (isPlaying) {
    videoRef.current.pause();
    setIsPlaying(false);
  } else {
    videoRef.current.play();
    setIsPlaying(true);
  }
};

  return (
    <div>

    <>
     <Navbar />

      {/* Hero */}
<section
  className="hero"
  style={{
    backgroundImage: `url(${heroImage})`,
  }}
>
  <div className="overlay"></div>

  <div className="hero-content">
    <h1>
      FAST & RELIABLE <br />
      DELIVERY SERVICES
    </h1>

    <p>
      We offer one of the best logistics and delivery services
      around the world. Fast, secure and trusted by thousands
      of customers.
    </p>
    

    <div className="hero-buttons">
       <Link
    to="/Register"
   className="btn main-btn"
  >
    Get Started
  </Link>

       <Link
    to="About"
   className="btn learn-btn"
  >
    Learn More
  </Link>
    </div>
  </div>
</section>

      {/* Video Section */}
     <section className="video-section">
  <div className="container">
    <div className="video-card">

      <video
        ref={videoRef}
        src={deliveryVideo}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        className="play-btn"
        onClick={toggleVideo}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

    </div>
  </div>
</section>
    </>
  
      {/* HOW IT WORKS */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-2 fw-normal" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>Simple Process</span>
            <h2 className="fw-bold" style={{ fontSize: '2.2rem' }}>How Famhak Express Works</h2>
            <p className="text-muted">Get your package delivered in 3 easy steps</p>
          </div>
          <div className="row g-4">
            {[
              { step: '01', title: 'Book Your Delivery', desc: 'Enter your pickup and dropoff address, describe your package and get an instant price. Takes less than 2 minutes.' },
              { step: '02', title: 'Rider Picks Up', desc: 'A verified rider near you accepts your order and heads to the pickup location immediately.' },
              { step: '03',  title: 'Package Delivered', desc: 'Your package is delivered safely to the destination. You get notified every step of the way.' },
            ].map((item) => (
              <div key={item.step} className="col-md-4 simple-process-section">
                <div className="card border-0 h-100 p-4 text-center shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="mb-3" style={{ fontSize: '3rem' }}>{item.icon}</div>
                  <span className="fw-bold mb-2 d-block" style={{ color: '#F97316', fontSize: '13px' }}>STEP {item.step}</span>
                  <h5 className="fw-bold mb-3">{item.title}</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="container py-4 ">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-2 fw-normal" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>Why Us</span>
            <h2 className="fw-bold" style={{ fontSize: '2.2rem' }}>Why Choose Famhak Express</h2>
            <p className="text-muted">We are built for Nigerians, by Nigerians</p>
          </div>
          <div className="row g-4 ">
            {[
              {  title: 'Lightning Fast', desc: 'Most deliveries completed within 45 minutes within the same area.' },
              {  title: 'Real-Time Tracking', desc: 'Watch your rider move on a live map from pickup to your doorstep.' },
              {  title: 'Safe & Secure', desc: 'All riders are verified and your packages are insured during transit.' },
              {  title: 'Easy Payments', desc: 'Pay with card, bank transfer or wallet. Powered by Paystack.' },
              {  title: '24/7 Support', desc: 'Our support team is always available to help you with any issue.' },
              {  title: 'Affordable Prices', desc: 'Transparent pricing starting from ₦3,000. No hidden charges ever.' },
            ].map((item) => (
              <div key={item.title} className="col-md-4 col-sm-6 whyus-section">
                <div className="d-flex gap-3 p-3 bg-white rounded-3 shadow-sm h-100">
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <h6 className="fw-bold mb-1">{item.title}</h6>
                    <p className="text-muted mb-0 small" style={{ lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* ABOUT US */}
<section className="py-5 bg-white">
  <div className="container py-5">

    <div className="row align-items-center">

      {/* Left Side */}
      <div className="col-lg-6 mb-4 mb-lg-0  ">

        <span
          className="badge px-3 py-2 mb-3 fw-normal"
          style={{
            backgroundColor: "#FFF7ED",
            color: "#F97316",
          }}
        >
          About Us
        </span>

        <h2
          className="fw-bold mb-4"
          style={{ fontSize: "2.0rem" }}
        >
          Delivering Excellence Across Every Mile
        </h2>

        <p
          className="text-muted mb-4"
          style={{
            lineHeight: "1.9",
            fontSize: "1rem",
          }}
        >
          At FAMHAK Express, we are committed to providing
          fast, secure, and reliable logistics solutions for
          individuals and businesses. Our mission is to make
          delivery services simple, affordable, and efficient
          while ensuring every package reaches its destination
          safely and on time.
        </p>

        <p
          className="text-muted mb-4"
          style={{
            lineHeight: "1.9",
            fontSize: "1rem",
          }}
        >
          With a growing network of delivery partners and
          advanced tracking systems, we help customers move
          goods confidently across cities and beyond.
        </p>
<Link to="/About">
        <button
          className="btn px-4 py-2 fw-semibold read-more-btn"
          style={{
            backgroundColor: "#F97316",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          Read More
        </button>
</Link>
      </div>

      {/* Right Side */}
   <div className="col-lg-6">

  <div
    className="about-video-card shadow-lg"
    style={{
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
    }}
  >

    <video
      src={deliveryVideo}
      controls
      style={{
        width: "100%",
        display: "block",
        borderRadius: "20px",
      }}
    />

    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        background: "rgba(0,0,0,.65)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "12px",
        marginBottom: "70px",
      }}
    >
      
       
      
      <h6 className="mb-1 fw-bold">
        Trusted Logistics Partner
      </h6>

      <small>
        Fast, secure and reliable delivery services.
      </small>
      
    </div>

  </div>

</div>

    </div>

  </div>
</section>

      {/* TESTIMONIAL SECTION */}
<section className="testimonial-section py-5">
  <div className="container">

    <div className="text-center mb-5">
      <h2 className="fw-bold">
        What Our Customers Say
      </h2>

      <p className="text-muted">
        Trusted by businesses and individuals for fast,
        secure, and reliable delivery services.
      </p>
    </div>

    <div className="row g-4">

      {/* Testimonial 1 */}
      <div className="col-lg-4 col-md-6">
        <div className="testimonial-card">

          <div className="d-flex align-items-center mb-4">
            <img
             src={customer1}
              alt="customer 1"
              className="testimonial-img"
            />

            <div className="ms-3">
              <p className="mb-1">
                <strong>Name:</strong> Sarah Johnson
              </p>

              <p className="mb-0">
                <strong>Role:</strong> Small Business Owner
              </p>
            </div>
          </div>

          <p>
            <strong>Review:</strong> FAMHAK Express has
            completely changed how I handle deliveries.
            My customers receive their orders on time,
            and the tracking system gives me peace of
            mind.
          </p>

        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="col-lg-4 col-md-6">
        <div className="testimonial-card">

          <div className="d-flex align-items-center mb-4">
            <img
              src={customer2}
              alt="customer 2"
              className="testimonial-img"
            />

            <div className="ms-3">
              <p className="mb-1">
                <strong>Name:</strong> Michael Adeyemi
              </p>

              <p className="mb-0">
                <strong>Role:</strong> Online Store Owner
              </p>
            </div>
          </div>

          <p>
            <strong>Review:</strong> Their delivery service
            is fast, reliable, and affordable. I've used
            several logistics companies before, but
            FAMHAK stands out for its professionalism.
          </p>

        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="col-lg-4 col-md-6 mx-md-auto">
        <div className="testimonial-card">

          <div className="d-flex align-items-center mb-4">
            <img
              src={customer3}
              alt="customer 3"
              className="testimonial-img"
            />

            <div className="ms-3">
              <p className="mb-1">
                <strong>Name:</strong> Musa Aliko
              </p>

              <p className="mb-0">
                <strong>Role:</strong> Regular Customer
              </p>
            </div>
          </div>

          <p>
            <strong>Review:</strong> I needed an urgent
            package delivered across town, and FAMHAK
            got it there safely and on time. Highly
            recommended.
          </p>

        </div>
      </div>

    </div>
  </div>
</section>
<div className="mt-5">
     <Footer />
     </div>

    </div>
  )
}

export default Landing