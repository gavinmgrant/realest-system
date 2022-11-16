import React, { useState, useEffect } from "react";

function RatesModal(props) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditItemModal__card card">
        <header className="card-header">
          <p className="card-header-title">Current Interest Rates</p>
          <span className="card-header-icon">
            <button
              className="delete"
              aria-label="close"
              onClick={() => props.onDone()}
            >
              Done
            </button>
          </span>
        </header>
        {loading && <p className="is-flex is-flex-direction-row is-justify-content-center m-3 is-absolute">Getting rates.</p>}
        <div className="mnd-rates-widget is-flex is-flex-direction-row is-justify-content-center m-3">
          <iframe
            src="//widgets.mortgagenewsdaily.com/widget/f/rates?t=expanded&sn=false&sc=false&c=336699&u=&cbu=&w=340&h=216"
            onLoad={() => setLoading(false)}
            frameBorder="0"
            scrolling="no"
            style={{
              width: "360px",
              height: loading ? "195px" : "236px",
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default RatesModal;
