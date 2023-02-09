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
              <Link href={props.termsPath} className="has-text-link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={props.privacyPolicyPath} className="has-text-link">
                Privacy Policy
              </Link>
              .
            </div>
          )}

          {props.signinText}
          <Link href={props.signinPath} className="has-text-link ml-2">
            {props.signinAction}
          </Link>
        </>
      )}

      {props.type === "signin" && (
        <>
          <Link href={props.signupPath} className="has-text-link">
            {props.signupAction}
          </Link>

          {props.forgotPassAction && (
            <Link href={props.forgotPassPath} className="has-text-link ml-3">
              {props.forgotPassAction}
            </Link>
          )}
        </>
      )}

      {props.type === "forgotpass" && (
        <>
          {props.signinText}
          <Link href={props.signinPath} className="has-text-link ml-2">
            {props.signinAction}
          </Link>
        </>
      )}
    </div>
  );
}

export default AuthFooter;
