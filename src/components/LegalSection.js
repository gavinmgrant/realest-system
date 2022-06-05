import React from "react";
import Link from "next/link";
import Section from "components/Section";
import LegalTerms from "components/LegalTerms";
import LegalPrivacy from "components/LegalPrivacy";

function LegalSection(props) {
  const validSections = {
    "terms-of-service": true,
    "privacy-policy": true,
  };

  const section = validSections[props.section]
    ? props.section
    : "terms-of-service";

  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div
        className={
          "LegalSection__tabs tabs is-toggle is-centered" +
          (props.parentColor === "white" ? " active-tab-text-white" : "")
        }
      >
        <ul>
          <li
            className={
              "" + (section === "terms-of-service" ? " is-active" : "")
            }
          >
            <Link href="/legal/terms-of-service">
              <a>Terms of Service</a>
            </Link>
          </li>
          <li
            className={"" + (section === "privacy-policy" ? " is-active" : "")}
          >
            <Link href="/legal/privacy-policy">
              <a>Privacy Policy</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="container mt-5">
        {section === "terms-of-service" && <LegalTerms />}

        {section === "privacy-policy" && <LegalPrivacy />}
      </div>
    </Section>
  );
}

export default LegalSection;
