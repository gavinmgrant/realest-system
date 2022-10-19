import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import TabInvestment from "components/TabInvestment";
import TabRentRoll from "components/TabRentRoll";
import EditUnitModal from "components/EditUnitModal";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser, deleteProperty } from "util/db";
import { toast } from "react-toastify";

function DashboardProperties() {
  const router = useRouter();
  const auth = useAuth();

  const {
    data: properties,
    status: propertiesStatus,
    error: propertiesError,
  } = usePropertiesByUser(auth.user.uid);

  const { data: units } = useUnitsByUser(auth.user.uid);

  const [creatingProperty, setCreatingProperty] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [updatingPropertyId, setUpdatingPropertyId] = useState(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("investment");
  const propertiesAreEmpty = !properties || properties?.length === 0;

  const isProUser = auth.user.planIsActive && auth.user.planId === "pro";

  const canAddProperty = properties?.length < 1 || isProUser;

  const handleAddProperty = () => {
    if (canAddProperty) {
      setCreatingProperty(true);
    } else {
      router.replace("/pricing");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setCreatingProperty(false);
    setUpdatingPropertyId(null);
    scrollToTop();
  }, [properties]);

  return (
    <>
      {propertiesError && (
        <div className="mb-3">
          <FormAlert type="error" message={propertiesError.message} />
        </div>
      )}

      {!creatingProperty && !updatingPropertyId && (
        <div>
          <div className="panel panel-heading has-background-light py-3 px-4 is-flex-tablet is-justify-content-space-between is-align-items-center has-text-center-mobile">
            <h2 className="title is-4 m-0">Properties</h2>
            {currentPropertyId && (
              <div className="tabs is-toggle m-0 my-3">
                <ul>
                  <li
                    className={selectedTab === "investment" ? "is-active" : ""}
                    onClick={() => setSelectedTab("investment")}
                  >
                    <a>Investment Evaluation</a>
                  </li>
                  <li
                    className={selectedTab === "rent-roll" ? "is-active" : ""}
                    onClick={() => setSelectedTab("rent-roll")}
                  >
                    <a>Rent Roll</a>
                  </li>
                </ul>
              </div>
            )}
            {currentPropertyId ? (
              <button
                className="button is-primary"
                onClick={() => setCurrentPropertyId(null)}
              >
                View All
                <span className="icon ml-2">
                  <i className="fas fa-arrow-left"></i>
                </span>
              </button>
            ) : (
              <button
                className="button is-primary my-3"
                onClick={handleAddProperty}
                disabled={!canAddProperty}
              >
                {canAddProperty ? "Add Property" : "Upgrade to Add More"}
                <span className="icon is-small ml-2">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            )}
          </div>

          {(propertiesStatus === "loading" || propertiesAreEmpty) && (
            <div className="py-5 px-3">
              {propertiesStatus === "loading" && (
                <div className="loader is-loading mx-auto" />
              )}

              {propertiesStatus !== "loading" && propertiesAreEmpty && (
                <div className="has-text-centered">
                  <p>
                    You have no properties. Click the add property button above
                    to make one!
                  </p>
                </div>
              )}
            </div>
          )}

          {properties &&
            !currentPropertyId &&
            properties.map((property) => {
              return (
                <div
                  className="card p-4 mb-4 is-clickable is-flex is-justify-content-space-between"
                  key={property.id}
                  onClick={() => {
                    setSelectedTab("investment");
                    setCurrentPropertyId(property.id);
                  }}
                >
                  <h3 className="title is-size-4-tablet is-size-5 is-5 mb-0">
                    {property.address}
                  </h3>
                  <button className="button is-primary p-2">
                    <span className="is-hidden-mobile pl-2 pr-2">
                      See Property Details
                    </span>
                    <span className="icon is-small m-0">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </button>
                </div>
              );
            })}

          {currentPropertyId && selectedTab === "investment" && (
            <TabInvestment
              properties={properties}
              currentPropertyId={currentPropertyId}
              units={units}
              setUpdatingPropertyId={setUpdatingPropertyId}
            />
          )}

          {currentPropertyId && selectedTab === "rent-roll" && (
            <TabRentRoll
              properties={properties}
              currentPropertyId={currentPropertyId}
              units={units}
              setUpdatingUnitId={setUpdatingUnitId}
            />
          )}
        </div>
      )}

      {creatingProperty && (
        <EditProperty
          onDone={() => {
            setCreatingProperty(false);
            scrollToTop();
          }}
        />
      )}

      {updatingPropertyId && (
        <EditProperty
          id={updatingPropertyId}
          tab={selectedTab}
          onDone={() => {
            setUpdatingPropertyId(null);
            scrollToTop();
          }}
          onDelete={() => {
            setUpdatingPropertyId(null);
            deleteProperty(currentPropertyId);
            setCurrentPropertyId(null);
            toast("Property deleted!");
          }}
        />
      )}

      {creatingUnit && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          onDone={() => {
            setCreatingUnit(false);
          }}
        />
      )}

      {updatingUnitId && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          id={updatingUnitId}
          tab={selectedTab}
          onDone={() => {
            setUpdatingUnitId(null);
          }}
        />
      )}
    </>
  );
}

export default DashboardProperties;
