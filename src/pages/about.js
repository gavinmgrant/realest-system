import React from "react";
import Meta from "components/Meta";
import HeroSection2 from "components/HeroSection2";
import TeamBiosSection from "components/TeamBiosSection";

function AboutPage(props) {
  return (
    <>
      <Meta title="About" description="Learn about our company and team" />
      <HeroSection2
        color="primary"
        size="large"
        backgroundImage="https://source.unsplash.com/7lvzopTxjOU/1600x800"
        backgroundImageOpacity={0.2}
        title="Quickly calculate your return on invesment in just a few steps."
        subtitle="We provide you with tools that simplify and systematize your residential rental property workflow. Ultimately, saving you time and money."
      />
      <TeamBiosSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Meet the Team"
        subtitle=""
      />
    </>
  );
}

export default AboutPage;
