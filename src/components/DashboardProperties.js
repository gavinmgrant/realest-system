import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import TabInvestment from "components/TabInvestment";
import TabRentRoll from "components/TabRentRoll";
import EditUnitModal from "components/EditUnitModal";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser, deleteProperty } from "util/db";
import { toast } from "react-toastify";
import { getPropertyType } from "../util/util";

function DashboardProperties() {
  const router = useRouter();
  const auth = useAuth();

  const {
    data: properties,
    status: propertiesStatus,
    error: propertiesError,
  } = usePropertiesByUser(auth.user.uid);

  const { data: units } = useUnitsByUser(auth.user.uid);

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [compareProperties, setCompareProperties] = useState(false);
  const [creatingProperty, setCreatingProperty] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [updatingPropertyId, setUpdatingPropertyId] = useState(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("investment");
  const propertiesAreEmpty = !properties || properties?.length === 0;

  const isProUser = auth.user.planIsActive && auth.user.planId === "pro";

  const canAddProperty = properties?.length < 1 || isProUser;

  // maximum number of properties allowed with a pro plan
  const PROLIMIT = 20;
  const atPropertyLimit = isProUser && properties?.length === PROLIMIT;

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
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      />

      {propertiesError && (
        <div className="mb-3">
          <FormAlert type="error" message={propertiesError.message} />
        </div>
      )}

      {!creatingProperty && !updatingPropertyId && (
        <div>
          <div className="panel panel-heading has-background-light py-3 px-4 is-flex-tablet is-justify-content-space-between is-align-items-center has-text-center-mobile">
            <h2 className="title is-4 m-0">Properties</h2>
            {selectedProperties.length > 1 &&
              isProUser &&
              !compareProperties && (
                <button
                  className="button"
                  onClick={() => setCompareProperties(!compareProperties)}
                >
                  Compare Properties
                </button>
              )}
            {selectedProperties.length > 0 && !isProUser && (
              <div className="my-1">
                <Link href="/pricing" className="is-size-6">
                  Compare properties with Pro Plan
                </Link>
              </div>
            )}
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
            {currentPropertyId || compareProperties ? (
              <button
                className="button is-primary my-3"
                onClick={() => {
                  setCurrentPropertyId(null);
                  setCompareProperties(false);
                }}
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
                disabled={atPropertyLimit}
              >
                {canAddProperty ? (
                  <>
                    {atPropertyLimit ? `At Property Limit of ${PROLIMIT}` : "Add Property"}
                    {!atPropertyLimit && (
                      <span className="icon is-small ml-2">
                        <i className="fas fa-plus"></i>
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    Upgrade to Add More
                    <span className="icon is-small ml-2">
                      <i className="fas fa-lock"></i>
                    </span>
                  </>
                )}
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
            !compareProperties &&
            properties
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((property, index) => {
                const isSelected = selectedProperties.includes(property.id);
                return (
                  <div
                    className={`card p-4 mb-4 is-flex is-justify-content-space-between ${
                      isSelected && "DashboardProperties__card"
                    }`}
                    key={property.id}
                  >
                    <h3
                      className="title is-size-4-tablet is-size-6 is-5 mb-0 is-clickable py-2 pr-2"
                      onClick={() => {
                        if (isProUser) {
                          if (selectedProperties.includes(property.id)) {
                            setSelectedProperties((prev) =>
                              prev.filter((id) => id !== property.id)
                            );
                          } else {
                            if (selectedProperties.length < 2) {
                              setSelectedProperties((prev) => [
                                ...prev,
                                property.id,
                              ]);
                            }
                          }
                        }
                      }}
                    >
                      {property.address}
                    </h3>
                    <div className="is-flex is-flex-direction-row is-align-items-center">
                      <p
                        className={`tag my-2 ${
                          getPropertyType(units, property.id).color
                        }`}
                      >
                        {getPropertyType(units, property.id).type}
                      </p>
                      {isProUser || index === 0 ? (
                        <button
                          className="button is-primary p-2 ml-3"
                          onClick={() => {
                            setSelectedTab("investment");
                            setCurrentPropertyId(property.id);
                            setSelectedProperties([]);
                            scrollToTop();
                          }}
                        >
                          <span className="is-hidden-mobile pl-2 pr-2">
                            See Property Details
                          </span>
                          <span className="icon is-small m-0">
                            <i className="fas fa-arrow-right"></i>
                          </span>
                        </button>
                      ) : (
                        <button
                          className="button is-danger p-2"
                          onClick={(e) => router.push("/pricing")}
                        >
                          <span className="is-hidden-mobile pl-2 pr-2">
                            Upgrade to Unlock
                          </span>
                          <span className="icon is-small m-0">
                            <i className="fas fa-lock"></i>
                          </span>
                        </button>
                      )}
                    </div>
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

      {compareProperties && (
        <div className="columns mt-3">
          <TabInvestment
            properties={properties}
            currentPropertyId={selectedProperties[0]}
            units={units}
            setUpdatingPropertyId={setUpdatingPropertyId}
            compareProperties={compareProperties}
          />
          <TabInvestment
            properties={properties}
            currentPropertyId={selectedProperties[1]}
            units={units}
            setUpdatingPropertyId={setUpdatingPropertyId}
            compareProperties={compareProperties}
          />
        </div>
      )}
    </>
  );
}

export default DashboardProperties;
