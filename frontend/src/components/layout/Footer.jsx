 import { Link } from "react-router-dom";

 {/* FOOTER */}
 function Footer() {
  return (
      <footer style={{ backgroundColor: '#1C1C1E' }} className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3" style={{ color: '#F97316' }}> Famhak Express</h5>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                Fast, reliable and affordable delivery services across Nigeria. Your packages, our priority.
              </p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold text-white mb-3">Company</h6>
              <ul className="list-unstyled text-secondary">
                <li className="mb-2"><a href="/About" className="text-secondary text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="/Contact" className="text-secondary text-decoration-none">Contact</a></li>
                <li className="mb-2"><a href="/Blog" className="text-secondary text-decoration-none">Blog</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold text-white mb-3">Services</h6>
              <ul className="list-unstyled text-secondary">
                <li className="mb-2"><a href="/Register" className="text-secondary text-decoration-none">Send Package</a></li>
                <li className="mb-2"><a href="/Riderform" className="text-secondary text-decoration-none">Become a Rider</a></li>
                <li className="mb-2"><a href="/Register" className="text-secondary text-decoration-none">Business</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold text-white mb-3">Contact Us</h6>
              <ul className="list-unstyled text-secondary">
                <li className="mb-2">famhaklawal2020@gmail.com</li>
                <li className="mb-2">+234 8177318070 </li>
                <li className="mb-2">Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <hr style={{ borderColor: '#333' }} className="my-4" />
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <p className="text-secondary mb-0 small">© 2020 Famhak Express Delivery Services. All rights reserved.</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary text-decoration-none small">Privacy Policy</a>
              <a href="#" className="text-secondary text-decoration-none small">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    )
}

export default Footer