import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import DashboardProperties from "./DashboardProperties";
import { useAuth } from "util/auth";

function DashboardSection(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Section color={props.color} size={props.size}>
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        />

        {router.query.paid && auth.user.planIsActive && (
          <article className="DashboardSection__paid-message message is-success mx-auto mb-5">
            <div className="message-body">
              You are now subscribed to the Pro Plan!
              <span className="ml-2" role="img" aria-label="party">
                🥳
              </span>
            </div>
          </article>
        )}

        <DashboardProperties />

        <div className="card p-4 mb-4">
          <div>
            You are signed in as <strong>{auth.user.email}</strong>.
          </div>

          {/* {auth.user.stripeSubscriptionId && (
            <>
              <div>
                You are subscribed to the{" "}
                <strong>{auth.user.planId} plan</strong>.
              </div>
              <div>
                Your plan status is{" "}
                <strong>{auth.user.stripeSubscriptionStatus}</strong>.
              </div>
            </>
          )} */}

          <div>
            You can change your account info{` `}
            {/* {auth.user.stripeSubscriptionId && <>and plan{` `}</>} */}
            in{` `}
            <Link href="/settings/general" className="has-text-link">
              <strong>settings</strong>
            </Link>
            .
          </div>

          {/* {!auth.user.stripeSubscriptionId && (
            <div>
              You can signup for a plan in{` `}
              <Link href="/pricing" className="has-text-link">
                <strong>pricing</strong>
              </Link>
              .
            </div>
          )} */}
        </div>
      </div>
    </Section>
  );
}

export default DashboardSection;
