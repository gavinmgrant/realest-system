import React, { useState } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import AuthForm from "components/AuthForm";
import AuthSocial from "components/AuthSocial";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleAuth = (user) => {
    router.push(props.afterAuthPath);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  return (
    <>
      {["forgotpass"].includes(props.type) && (
        <div className="box">
          <p>
            We use{" "}
            <a href="https://supabase.com/" target="_blank">
              Supabase
            </a>{" "}
            for authentication. Look for an email from{" "}
            <u>noreply@mail.app.supabase.io</u> to reset your password. This
            email may be in your spam folder.
          </p>
        </div>
      )}

      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      <AuthForm
        type={props.type}
        buttonAction={props.buttonAction}
        onAuth={handleAuth}
        onFormAlert={handleFormAlert}
        buttonColor={props.buttonColor}
        buttonInverted={props.buttonInverted}
      />

      {/* {["signup", "signin"].includes(props.type) && (
        <>
          {props.providers && props.providers.length && (
            <>
              <div className="Auth__social-divider has-text-centered is-size-7">
                OR
              </div>
              <AuthSocial
                buttonAction={props.buttonAction}
                showLastUsed={true}
                providers={props.providers}
                onAuth={handleAuth}
                onError={(message) => {
                  handleFormAlert({
                    type: "error",
                    message: message,
                  });
                }}
              />
            </>
          )}
        </>
      )} */}
    </>
  );
}

export default Auth;
