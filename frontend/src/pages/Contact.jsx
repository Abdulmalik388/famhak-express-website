import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import heroImage from "../assets/contact-hero.png";
import "../style/Contact.css";
import toast from "react-hot-toast";
import { contactAPI } from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactAPI.submit(formData);
      toast.success("Message sent successfully. We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to send message. Please try again later.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="contact-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="contact-overlay"></div>

        <div className="contact-hero-content">
          <h1>CONTACT US</h1>

          <p>
            We're here to help. Whether you have questions about a
            delivery, need support, or want to partner with us,
            our team is ready to assist you.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn main-btn">
              Get Started
            </Link>

            <Link to="/about" className="btn learn-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">Contact Information</h2>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="info-card">
                <h5>📍 Our Office</h5>

                <p className="fw-bold mb-2">Lagos, Nigeria</p>

                <p>
                  We operate across multiple locations and are
                  committed to providing fast, reliable, and secure
                  delivery services.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-card">
                <h5>📞 Phone Number</h5>

                <p className="fw-bold mb-2">+234 8177318070</p>

                <p>Speak directly with our support team during business hours.</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-card">
                <h5>📧 Email Address</h5>

                <p className="fw-bold mb-2">famhaklawal2020@gmail.com</p>

                <p>
                  Send us your questions, feedback, or business
                  inquiries and we'll respond as quickly as possible.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-card">
                <h5>🕒 Working Hours</h5>

                <p>Monday – Saturday: 8:00 AM – 6:00 PM</p>

                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Send Us a Message</h2>
            <p>Get In Touch</p>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label>Message</label>
                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control custom-input"
                ></textarea>
              </div>

              <button type="submit" className="btn send-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;