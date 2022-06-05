import React, { useState } from "react";
import FormAlert from "components/FormAlert";
import EditItemModal from "components/EditItemModal";
import { useAuth } from "util/auth";
import { updateItem, deleteItem, useItemsByOwner } from "util/db";

function DashboardItems(props) {
  const auth = useAuth();

  const {
    data: items,
    status: itemsStatus,
    error: itemsError,
  } = useItemsByOwner(auth.user.uid);

  const [creatingItem, setCreatingItem] = useState(false);

  const [updatingItemId, setUpdatingItemId] = useState(null);

  const itemsAreEmpty = !items || items.length === 0;

  const canUseStar =
    auth.user.planIsActive &&
    (auth.user.planId === "pro" || auth.user.planId === "business");

  const handleStarItem = (item) => {
    if (canUseStar) {
      updateItem(item.id, { featured: !item.featured });
    } else {
      alert("You must upgrade to the pro or business plan to use this feature");
    }
  };

  return (
    <>
      {itemsError && (
        <div className="mb-3">
          <FormAlert type="error" message={itemsError.message} />
        </div>
      )}

      <div className="DashboardItems__panel panel">
        <div className="panel-heading has-background-light py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
          Items
          <button
            className="button is-primary"
            onClick={() => setCreatingItem(true)}
          >
            Add Item
          </button>
        </div>

        {(itemsStatus === "loading" || itemsAreEmpty) && (
          <div className="py-5 px-3">
            {itemsStatus === "loading" && (
              <div className="loader is-loading mx-auto" />
            )}

            {itemsStatus !== "loading" && itemsAreEmpty && (
              <div className="has-text-centered">
                Nothing yet. Click the button to add your first item.
              </div>
            )}
          </div>
        )}

        {itemsStatus !== "loading" && items && items.length > 0 && (
          <>
            {items.map((item, index) => (
              <div
                className={
                  "panel-block p-3 is-flex is-justify-content-space-between" +
                  (item.featured ? " featured" : "")
                }
                key={index}
              >
                {item.name}
                <div>
                  <button
                    className={
                      "button action is-ghost" +
                      (item.featured ? " star-featured" : "")
                    }
                    aria-label="star"
                    onClick={() => handleStarItem(item)}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-star" />
                    </span>
                  </button>
                  <button
                    className="button action is-ghost"
                    aria-label="update"
                    onClick={() => setUpdatingItemId(item.id)}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-edit" />
                    </span>
                  </button>
                  <button
                    className="button action is-ghost"
                    aria-label="delete"
                    onClick={() => deleteItem(item.id)}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-trash" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {creatingItem && <EditItemModal onDone={() => setCreatingItem(false)} />}

      {updatingItemId && (
        <EditItemModal
          id={updatingItemId}
          onDone={() => setUpdatingItemId(null)}
        />
      )}
    </>
  );
}

export default DashboardItems;
