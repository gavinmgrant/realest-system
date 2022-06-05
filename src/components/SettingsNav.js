import React from "react";
import Link from "next/link";

function SettingsNav(props) {
  return (
    <div
      className={
        "SettingsNav tabs is-toggle is-centered" +
        (props.parentColor === "white" ? " active-tab-text-white" : "")
      }
    >
      <ul>
        <li
          className={"" + (props.activeKey === "general" ? " is-active" : "")}
        >
          <Link href="/settings/general">
            <a>General</a>
          </Link>
        </li>
        <li
          className={"" + (props.activeKey === "password" ? " is-active" : "")}
        >
          <Link href="/settings/password">
            <a>Password</a>
          </Link>
        </li>
        <li
          className={"" + (props.activeKey === "billing" ? " is-active" : "")}
        >
          <Link href="/settings/billing">
            <a>Billing</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SettingsNav;
