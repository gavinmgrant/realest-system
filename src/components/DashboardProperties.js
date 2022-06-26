import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import TabInvestment from "components/TabInvestment";
import TabRentRoll from "components/TabRentRoll";
import EditUnitModal from "components/EditUnitModal";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser, deleteProperty } from "util/db";

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

  const isProUser =
    auth.user.planIsActive &&
    (auth.user.planId === "pro" || auth.user.planId === "business");

  const canAddProperty = properties?.length < 3 || isProUser;

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

  useEffect(() => {}, units);

  return (
    <>
      {propertiesError && (
        <div className="mb-3">
          <FormAlert type="error" message={propertiesError.message} />
        </div>
      )}

      {!creatingProperty && !updatingPropertyId && (
        <div>
          <div className="panel panel-heading has-background-light py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
            <h2 className="title is-4 m-0">Properties</h2>
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
              <button className="button is-primary" onClick={handleAddProperty}>
                {canAddProperty ? "Add Property" : "Upgrade to Add"}
                <span className="icon is-small ml-2">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            )}
          </div>

          {currentPropertyId && (
            <div className="tabs is-toggle is-centered mb-4 is-flex-tablet">
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
                  className="card p-3 mb-4 is-clickable"
                  key={property.id}
                  onClick={() => {
                    setSelectedTab("investment");
                    setCurrentPropertyId(property.id);
                  }}
                >
                  <h3 className="title is-5 mb-0">{property.address}</h3>
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
          }}
        />
      )}

      {creatingUnit && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          onDone={() => setCreatingUnit(false)}
        />
      )}

      {updatingUnitId && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          id={updatingUnitId}
          tab={selectedTab}
          onDone={() => setUpdatingUnitId(null)}
        />
      )}
    </>
  );
}

export default DashboardProperties;
