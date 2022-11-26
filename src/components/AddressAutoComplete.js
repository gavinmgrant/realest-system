import React from "react";
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
  };

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
            value={value || props.address}
            onChange={handleAddressInput}
            disabled={!ready}
            placeholder="Please enter an address"
            autoFocus={props.autoFocus}
            error={props.errors?.address}
            className={`input is-${props.size}`}
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
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
