import "../style/About.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import aboutHeroImage from '../assets/about-hero.png'
import { Link } from 'react-router-dom'


function About() {
    const features = [
        {
            title: "Lightning Fast",
            text: "Most deliveries completed within 45 minutes within the same area."
        },
        {
            title: "Real-Time Tracking",
            text: "Watch your order move on a live map from pickup to your doorstep."
        },
        {
            title: "Safe & Secure",
            text: "All riders are verified and your packages are insured during transit."
        },
        {
            title: "Easy Payments",
            text: "Pay with card, bank transfer or wallet. Powered by Paystack."
        },
        {
            title: "24/7 Support",
            text: "Our support team is always available to help you with any issue."
        },
        {
            title: "Affordable Prices",
            text: "Transparent pricing starting from ₦3,000. No hidden charges ever."
        }
    ]

    const values = [
        {
            title: "Trust",
            text: "We build confidence through transparency and reliability."
        },
        {
            title: "Excellence",
            text: "We continuously improve our services to exceed expectations."
        },
        {
            title: "Customer First",
            text: "Our customers are at the heart of every decision we make."
        },
        {
            title: "Innovation",
            text: "We embrace technology and continuous improvement to create smarter, faster, and more convenient delivery solutions."
        },
        {
            title: "Transparency",
            text: "At Famhak Express, we believe trust is built through openness and honesty."
        },
        {
            title: "Speed",
            text: "At Famhak Express, we understand that time is valuable. That's why speed is at the heart of everything we do."
        }
    ]

    return (
        <>
            <Navbar />

            {/* Hero */}
<section
  className="about-hero"
  style={{
    backgroundImage: `url(${aboutHeroImage})`,
  }}
>
  <div className="overlay"></div>

  <div className="hero-content">
    <h1>
      ABOUT <br />
      FAMHAK EXPRESS
    </h1>

    <p>
      Famhak Express is a reliable delivery platform built to
      make package transportation simple, fast, and secure.
      We connect customers with trusted riders to ensure
      deliveries reach their destination safely and on time.
    </p>

    <div className="hero-buttons">
      <Link
        to="/register"
        className="btn main-btn"
      >
        Get Started
      </Link>

      <Link
        to="/contact"
        className="btn learn-btn"
      >
        Learn More
      </Link>
    </div>
  </div>
</section>
           

            {/* Our Story */}
            <section className="py-5">
                <div className="container">

                    <h2 className="section-title">
                        How We Started
                    </h2>

                    <p className="story-text">
                        Famhak Express was founded with a clear vision:
                        to transform the way people move packages from one
                        location to another. We noticed that many individuals
                        and businesses often faced challenges such as delayed
                        deliveries, unreliable service providers, lack of
                        package tracking, and high delivery costs.

                        These everyday frustrations inspired us to create a
                        platform that people could genuinely trust. What
                        started as an idea quickly grew into a mission to
                        bridge the gap between customers and reliable delivery
                        services.

                        By combining modern technology with a customer-first
                        approach, we built a system that makes booking,
                        tracking, and managing deliveries simple and convenient.
                        Our platform connects customers with verified riders,
                        ensuring that every package is handled professionally
                        from pickup to final delivery.

                        At Famhak Express, we believe that every package carries
                        value whether it's an important business document, a gift
                        for a loved one, or products that help businesses serve
                        their customers.

                        Today, we continue to innovate and improve our services,
                        driven by our passion for excellence and our dedication
                        to customer satisfaction.
                    </p>

                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-5 bg-light">
                <div className="container">

                    <h2 className="section-title">
                        Why Choose Famhak Express
                    </h2>

                    <p className="text-center mb-5">
                        We are built for Nigerians, by Nigerians
                    </p>

                    <div className="row g-4">
                        {features.map((feature, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <div className="feature-card">
                                    <h5>{feature.title}</h5>
                                    <p>{feature.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Core Values */}
            <section className="py-5">
                <div className="container">

                    <h2 className="section-title">
                        Our Core Values
                    </h2>

                    <div className="row g-4">

                        {values.map((value, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <div className="feature-card">
                                    <h5>{value.title}</h5>
                                    <p>{value.text}</p>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container text-center">

                    <h2>
                        Ready to Send a Package?
                    </h2>

                    <p>
                        Join thousands of customers who trust Famhak Express
                        for their delivery needs. Book your delivery today
                        and experience convenience like never before.
                    </p>

                    <div className="mt-4">
                      <Link
                      to="/contact"
                      className="btn btn-orange me-3">
                        Contact Us
                      </Link>
                        

                       <Link
                       to='/customer/place-order'
                       className="btn btn-orange">
                        Book a Delivery
                       </Link>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    )
}

export default About