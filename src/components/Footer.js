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
            <img src={props.logo} alt="Logo" />
          </Link>
        </div>
        <div className="links right">
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
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
        <div className="copyright">
          {props.copyright}
          <Link href="https://www.gavingrant.co/">Gavin Grant</Link>
          <Link href="/legal/terms-of-service">Terms</Link>
          <Link href="/legal/privacy-policy">Privacy</Link>
        </div>
      </div>
    </Section>
  );
}

export default Footer;
