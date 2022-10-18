import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Link from "next/link";
import CenteredColumns from "components/CenteredColumns";
// import Contact from "components/Contact";

function ContactSection(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="ContactSection__container container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        />
        <CenteredColumns>
          <div className="column is-flex is-flex-direction-column is-align-items-center">
            <p>We'd love to hear from you! Send us an email:</p>
            <div className="button is-primary m-4">
              <Link href="mailto:hello@realestsystem.com">
                <a>hello@realestsystem.com</a>
              </Link>
            </div>
          </div>
        </CenteredColumns>
        {/* <Contact
          showNameField={props.showNameField}
          buttonText={props.buttonText}
          buttonColor={props.buttonColor}
          buttonInverted={props.buttonInverted}
        /> */}
      </div>
    </Section>
  );
}

export default ContactSection;
