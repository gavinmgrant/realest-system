import React from "react";
import Link from "next/link";
import Section from "components/Section";

function Footer(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
      className="footer"
    >
      <div className="FooterComponent__container container">
        <div className="brand left">
          <Link href="/">
            <a>
              <img src={props.logo} alt="Logo" />
            </a>
          </Link>
        </div>
        <div className="links right">
          <Link href="/pricing">
            <a>Pricing</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/faq">
            <a>FAQ</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </div>
        <div className="social right">
          <a
            href="https://twitter.com/realestsystem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <i className="fab fa-twitter fa-lg" />
            </span>
          </a>
          <a
            href="https://instagram.com/realestsystem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <i className="fab fa-instagram fa-lg" />
            </span>
          </a>
        </div>
        <div className="copyright left">
          {props.copyright}
          <Link href="/legal/terms-of-service">
            <a>Terms</a>
          </Link>
          <Link href="/legal/privacy-policy">
            <a>Privacy</a>
          </Link>
        </div>
      </div>
    </Section>
  );
}

export default Footer;
