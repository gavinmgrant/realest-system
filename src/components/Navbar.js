import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "util/auth";

function Navbar(props) {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [auth.user]);

  return (
    <nav
      className={
        "is-fixed-top navbar" +
        (props.color ? ` is-${props.color}` : "") +
        (props.spaced ? " is-spaced" : "")
      }
    >
      <div className="container">
        <div className="navbar-brand">
          <div className="mt-1 ml-2">
            <Link href="/">
              <img
                className="image"
                src={props.logo}
                width="120"
                height="47"
                alt="Realest System Logo"
              />
            </Link>
          </div>
          <div
            className={"navbar-burger burger" + (menuOpen ? " is-active" : "")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={"navbar-menu" + (menuOpen ? " is-active" : "")}>
          <div className="navbar-end">
            {auth.user && (
              <div className="navbar-item has-dropdown is-hoverable">
                <div onClick={() => setMenuOpen(!menuOpen)}>
                  <a className="navbar-link">Account</a>
                </div>
                <div className="navbar-dropdown is-boxed">
                  <div onClick={() => setMenuOpen(!menuOpen)}>
                    <Link href="/dashboard" className="navbar-item">
                      Dashboard
                    </Link>
                  </div>
                  <div onClick={() => setMenuOpen(!menuOpen)}>
                    <Link href="/settings/general" className="navbar-item">
                      Settings
                    </Link>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    href="/auth/signout"
                    className="navbar-item"
                    onClick={(e) => {
                      e.preventDefault();
                      auth.signout();
                    }}
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            )}

            {!auth.user && (
              <>
                <Link href="/auth/signin" className="navbar-item mr-2">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="button is-success ml-2 mr-3">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
