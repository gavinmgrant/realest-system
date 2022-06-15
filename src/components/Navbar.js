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
        "navbar" +
        (props.color ? ` is-${props.color}` : "") +
        (props.spaced ? " is-spaced" : "")
      }
    >
      <div className="container">
        <div className="navbar-brand">
          <div className="mt-1 ml-2">
            <Link href="/">
              <a>
                <img
                  className="image"
                  src={props.logo}
                  width="120"
                  height="47"
                  alt="Realest System Logo"
                />
              </a>
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
                    <Link href="/dashboard">
                      <a className="navbar-item">Dashboard</a>
                    </Link>
                  </div>
                  <div onClick={() => setMenuOpen(!menuOpen)}>
                    <Link href="/settings/general">
                      <a className="navbar-item">Settings</a>
                    </Link>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link href="/auth/signout">
                    <a
                      className="navbar-item"
                      onClick={(e) => {
                        e.preventDefault();
                        auth.signout();
                      }}
                    >
                      Sign out
                    </a>
                  </Link>
                </div>
              </div>
            )}

            {!auth.user && (
              <Link href="/auth/signin">
                <a className="navbar-item">Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
