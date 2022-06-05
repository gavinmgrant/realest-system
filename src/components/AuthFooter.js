import React from "react";
import Link from "next/link";

function AuthFooter(props) {
  return (
    <div className="AuthFooter has-text-centered mt-3 px-3">
      {props.type === "signup" && (
        <>
          {props.showAgreement && (
            <div className="mb-3">
              By signing up, you are agreeing to our{" "}
              <Link href={props.termsPath}>
                <a className="has-text-link">Terms of Service</a>
              </Link>{" "}
              and{" "}
              <Link href={props.privacyPolicyPath}>
                <a className="has-text-link">Privacy Policy</a>
              </Link>
              .
            </div>
          )}

          {props.signinText}
          <Link href={props.signinPath}>
            <a className="has-text-link ml-2">{props.signinAction}</a>
          </Link>
        </>
      )}

      {props.type === "signin" && (
        <>
          <Link href={props.signupPath}>
            <a className="has-text-link">{props.signupAction}</a>
          </Link>

          {props.forgotPassAction && (
            <Link href={props.forgotPassPath}>
              <a className="has-text-link ml-3">{props.forgotPassAction}</a>
            </Link>
          )}
        </>
      )}

      {props.type === "forgotpass" && (
        <>
          {props.signinText}
          <Link href={props.signinPath}>
            <a className="has-text-link ml-2">{props.signinAction}</a>
          </Link>
        </>
      )}
    </div>
  );
}

export default AuthFooter;
