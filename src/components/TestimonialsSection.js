import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import CenteredColumns from "components/CenteredColumns";
import Avatar from "components/Avatar";

function TestimonialsSection(props) {
  const items = [
    {
      avatar: "https://uploads.divjoy.com/pravatar-150x-5.jpeg",
      name: "Sarah Kline",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
      company: "Company",
    },
    {
      avatar: "https://uploads.divjoy.com/pravatar-150x-48.jpeg",
      name: "Shawna Murray",
      role: "Software Engineer",
      bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum consequatur numquam aliquam tenetur ad amet inventore hic beatae, quas accusantium perferendis sapiente explicabo, corporis totam!",
      company: "Company",
    },
    {
      avatar: "https://uploads.divjoy.com/pravatar-150x-12.jpeg",
      name: "Blake Elder",
      role: "Designer",
      bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum consequatur numquam aliquam tenetur ad amet inventore hic beatae.",
      company: "Company",
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
            <div className="column is-flex" key={index}>
              <div className="TestimonialsSection__card card is-flex">
                <div className="TestimonialsSection__card-content card-content has-text-centered is-flex">
                  <div className="TestimonialsSection__avatar-wrapper">
                    <Avatar image={item.avatar} size={96} alt={item.name} />
                  </div>
                  <p className="TestimonialsSection__quote">"{item.bio}"</p>
                  <div className="TestimonialsSection__info">
                    <div className="has-text-weight-bold">{item.name}</div>
                    <div className="TestimonialsSection__company link is-size-7">
                      {item.company}
                    </div>
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

export default TestimonialsSection;
