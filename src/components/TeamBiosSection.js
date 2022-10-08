import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import CenteredColumns from "components/CenteredColumns";
import Avatar from "components/Avatar";

function TeamBiosSection(props) {
  const items = [
    {
      avatar: "/images/mark.jpg",
      name: "Mark Mendez",
      role: "Co-founder",
      bio: "Mark has been purchasing income properties since 2009, became a Realtor in 2015, and has since helped many investors purchase their own income properties. Currently, he owns and manages 15 residential units. He has been sharing his knowledge – and mistakes – on Instagram. Mark is an active real estate agent for Compass in Santa Monica, CA.",
    },
    {
      avatar: "/images/gavin.jpg",
      name: "Gavin Grant",
      role: "Co-founder",
      bio: "Gavin has owned a rental property and pivoted from a career in architecture to web development. He built his first website in 2011 when he and Mark partnered to create a blog called Tesón Life, where they shared business advice learned through research and real-life experience. Gavin is a developer building web apps with modern web development frameworks.",
    },
  ];

  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        />
        <CenteredColumns>
          {items.map((item, index) => (
            <div
              className="column is-half-tablet is-one-third-desktop is-flex"
              key={index}
            >
              <div className="TeamBiosSection__card card is-flex">
                <div className="TeamBiosSection__card-content card-content is-flex has-text-centered">
                  <div className="TeamBiosSection__avatar-wrapper">
                    <Avatar image={item.avatar} size={128} alt={item.name} />
                  </div>
                  <div className="TeamBiosSection__details">
                    <p className="is-size-5">{item.name}</p>
                    <p className="is-size-7 is-uppercase has-text-weight-semibold">
                      {item.role}
                    </p>
                    <p className="TeamBiosSection__bio">{item.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CenteredColumns>
      </div>
    </Section>
  );
}

export default TeamBiosSection;
