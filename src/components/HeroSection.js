import React from "react";
import Link from "next/link";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";

function HeroSection(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container my-4">
        <div className="columns is-vcentered is-desktop">
          <div className="column is-5-desktop has-text-centered-touch">
            <SectionHeader
              title={props.title}
              subtitle={props.subtitle}
              size={1}
              spaced={true}
            />
            <div className="buttons is-inline-flex">
              <Link
                href={props.buttonPath}
                className={
                  "button is-medium" +
                  (props.buttonColor ? ` is-${props.buttonColor}` : "") +
                  (props.buttonInverted ? " is-inverted" : "")
                }
              >
                {props.buttonText}
              </Link>
            </div>
          </div>
          <div className="column box m-3 p-0">
            <figure className="HeroSection__image image">
              <img src={props.image} alt="Illustration" />
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HeroSection;
