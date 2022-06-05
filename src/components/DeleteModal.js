import React from "react";
import { deleteProperty } from "util/db";

function DeleteModal(props) {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditItemModal__card card">
        <header className="card-header">
          <p className="card-header-title">Are you sure?</p>
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
        <div className="card-content">
          <form onSubmit={() => deleteProperty(props.id)}>
            <div className="field">
              <div className="control">
                <button
                  className={
                    "button is-medium is-danger" +
                    (pending ? " is-loading" : "")
                  }
                  type="submit"
                >
                  Yes, delete this property
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
