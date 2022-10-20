import React from "react";
import { copyTextToClipboard } from "util/util";
import { toast } from "react-toastify";

function ShareModal(props) {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditItemModal__card card">
        <header className="card-header">
          <p className="card-header-title">Share read-only property report</p>
          <span className="card-header-icon">
            <button
              className="delete"
              aria-label="close"
              onClick={() => props.onDone()}
            >
              Cancel
            </button>
          </span>
        </header>
        <div className="card-content is-flex-direction-row is-justify-content-space-between">
          <button
            className="button is-medium is-primary mb-3"
            type="button"
            onClick={() => {
              copyTextToClipboard(props.url);
              toast("Link copied to clipboard!");
            }}
          >
            <a>Copy link to clipboard</a>
            <span className="icon is-small ml-2">
              <i className="fas fa-copy"></i>
            </span>
          </button>

          <a
            className="button is-medium is-primary"
            href={`mailto:?subject=Property%20Report%20from%20Realest%20System%20&body=Check%20out%20this%20property%20report%20from%20Realest%20System:%20${props.url}.`}
          >
            Email link
            <span className="icon is-small ml-2">
              <i className="fas fa-envelope"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
