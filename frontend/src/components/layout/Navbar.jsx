import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);

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
        <Link className="navbar-brand  fw-bold" to="/">
          FAMHAK
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
              <Link className="nav-link" to="About">
                ABOUT
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="Contact">
                CONTACT
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="Blog">
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