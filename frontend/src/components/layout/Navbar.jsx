import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAbout = location.pathname.startsWith("/about");
  const isBlog = location.pathname.startsWith("/blog");
  const isContact = location.pathname.startsWith("/contact");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? "navbar-scrolled" : "custom-nav"
      }`}
    >
      <div className="container">

        {/* Logo */}
  <Link className="navbar-brand famhak-logo" to="/">
  <div className="logo-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <div className="logo-content">
    <h3>FAMHAK</h3>
    <p>we deliver in peace</p>
  </div>
</Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div
          className="collapse navbar-collapse text-center"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isAbout ? "nav-link-about" : ""}`} to="/about">
                ABOUT
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isContact ? "nav-link-contact" : ""}`} to="/contact">
                CONTACT
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isBlog ? "nav-link-blog" : ""}`} to="/blog">
                BLOG
              </Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
            <Link
              to="/login"
              className="btn btn-outline-light"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="btn signup-btn"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;