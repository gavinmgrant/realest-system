import React, { useEffect, useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

function AddressAutocomplete(props) {
  const [isFocus, setIsFocus] = useState(false);
  // React hook for Google Maps Places Autocomplete
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleAddressInput = (e) => {
    setValue(e.target.value);
  };

  const handleAddressSelect = (address) => {
    setValue(address, false);
    clearSuggestions();
    setIsFocus(false);
  };

  useEffect(() => {
    if (!props.address) {
      setValue("");
    } else {
      setValue(props.address);
    }
  }, [props.address]);
  console.log("isFocus", isFocus);
  console.log("status", status);
  console.log("data", data);
  return (
    <div className="field">
      {props.label && (
        <label className="label" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      <div className="control">
        <Combobox onSelect={handleAddressSelect}>
          <ComboboxInput
            name="address"
            value={value}
            onChange={handleAddressInput}
            disabled={!ready}
            placeholder="Please enter an address"
            autoFocus={props.autoFocus}
            error={props.errors.address}
            className={`input is-${props.size}`}
            ref={props.register({
              required: "Please enter an address",
            })}
            onFocus={() => setIsFocus(true)}
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
                isFocus &&
                data.map(({ description }) => (
                  <ComboboxOption key={description} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    </div>
  );
}

export default AddressAutocomplete;
