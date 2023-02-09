import React from "react";

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
          <div className="field">
            <p className="mb-4">
              Warning: This will permanently remove this property and cannot be
              undone.
            </p>
            <div className="control">
              <button
                className="button is-medium is-danger"
                type="submit"
                onClick={() => props.onDelete()}
              >
                Yes, delete this property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
