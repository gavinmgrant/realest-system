import React from "react";

function PageLoader(props) {
  const { children, ...otherProps } = props;

  return (
    <div className="PageLoader" {...otherProps}>
      {!props.children && <div className="loader is-loading" />}

      {props.children && <>{props.children}</>}
    </div>
  );
}

export default PageLoader;
