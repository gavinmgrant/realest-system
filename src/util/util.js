import supabase from "./supabase";

export function apiRequest(path, method = "GET", data) {
  const session = supabase.auth.session();
  const accessToken = session ? session.access_token : undefined;

  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === "error") {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === "auth/invalid-user-token") {
          supabase.auth.signOut();
        }

        throw new CustomError(response.code, response.message);
      } else {
        return response.data;
      }
    });
}

// Make an API request to any external URL
export function apiRequestExternal(url, method = "GET", data) {
  return fetch(url, {
    method: method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((response) => response.json());
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Format a number to a currency string
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format a number to a percentage string
export function formatPercentage(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format((!amount ? 0 : amount) / 100);
}

// Copy text to clipboard
export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

// Returns the property type based on number of units
export const getPropertyType = (units, id) => {
  let type;
  const numberUnits = units?.filter((unit) => unit.property_id === id).length;

  switch (numberUnits) {
    case 0:
      type = "No units";
      break;
    case 1:
      type = "Single-family";
      break;
    case 2:
      type = "Duplex";
      break;
    case 3:
      type = "Triplex";
      break;
    case 4:
      type = "Quad";
      break;
    default:
      type = "Multi-family";
      break;
  }

  return type;
};
