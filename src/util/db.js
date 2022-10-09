/** @format */

import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "react-query";
import supabase from "./supabase";

// React Query client
const client = new QueryClient();

/**** USERS ****/

// Fetch user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery(
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    ["user", { uid }],
    // Query function that fetches data
    () =>
      supabase
        .from("users")
        .select(`*, customers ( * )`)
        .eq("id", uid)
        .single()
        .then(handle),
    // Only call query function if we have a `uid`
    { enabled: !!uid }
  );
}

// Update an existing user
export async function updateUser(uid, data) {
  const response = await supabase
    .from("users")
    .update(data)
    .eq("id", uid)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["user", { uid }]);
  return response;
}

/**** PROPERTIES ****/

// Fetch property data
export function useProperty(id) {
  return useQuery(
    ["property", { id }],
    () =>
      supabase.from("properties").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch property data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getProperty(id) {
  return supabase
    .from("properties")
    .select()
    .eq("id", id)
    .single()
    .then(handle);
}

// Fetch all properties by user
export function usePropertiesByUser(user_id) {
  return useQuery(
    ["properties", { user_id }],
    () =>
      supabase
        .from("properties")
        .select()
        .eq("user_id", user_id)
        .order("address", { ascending: false })
        .then(handle),
    { enabled: !!user_id }
  );
}

// Create a new property
export async function createProperty(data) {
  const response = await supabase
    .from("properties")
    .insert([data])
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["properties"]);
  return response;
}

// Update an property
export async function updateProperty(id, data) {
  const response = await supabase
    .from("properties")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["property", { id }]),
    client.invalidateQueries(["properties"]),
  ]);
  return response;
}

// Delete an property
export async function deleteProperty(id) {
  const response = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["property", { id }]),
    client.invalidateQueries(["properties"]),
  ]);
  return response;
}

/*** UNITS ****/

// Fetch unit data
export function useUnit(id) {
  return useQuery(
    ["unit", { id }],
    () => supabase.from("units").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch all units by user
export function useUnitsByUser(user_id) {
  return useQuery(
    ["units", { user_id }],
    () =>
      supabase
        .from("units")
        .select()
        .eq("user_id", user_id)
        .then(handle),
    { enabled: !!user_id }
  );
}

// Fetch units by property and user, if no property_id return null
export function useUnitsByProperty(property_id, user_id) {  
  return useQuery(
    ["units", { property_id, user_id }],
    () =>
      supabase
        .from("units")
        .select()
        .eq("property_id", property_id)
        .eq("user_id", user_id)
        .then(handle),
    { enabled: !!property_id }
  );
}

// Create a unit
export async function createUnit(data) {
  const response = await supabase.from("units").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["units"]);
  return response;
}

// Update a unit
export async function updateUnit(id, data) {
  const response = await supabase
    .from("units")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["units"]);
  return response;
}

// Delete a unit
export async function deleteUnit(id) {
  const response = await supabase
    .from("units")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["units"]);
  return response;
}

/**** ITEMS ****/

// Fetch item data
export function useItem(id) {
  return useQuery(
    ["item", { id }],
    () => supabase.from("items").select().eq("id", id).single().then(handle),
    { enabled: !!id }
  );
}

// Fetch item data (non-hook)
// Useful if you need to fetch data from outside of a component
export function getItem(id) {
  return supabase.from("items").select().eq("id", id).single().then(handle);
}

// Fetch all items by owner
export function useItemsByOwner(owner) {
  return useQuery(
    ["items", { owner }],
    () =>
      supabase
        .from("items")
        .select()
        .eq("owner", owner)
        .order("created_at", { ascending: false })
        .then(handle),
    { enabled: !!owner }
  );
}

// Create a new item
export async function createItem(data) {
  const response = await supabase.from("items").insert([data]).then(handle);
  // Invalidate and refetch queries that could have old data
  await client.invalidateQueries(["items"]);
  return response;
}

// Update an item
export async function updateItem(id, data) {
  const response = await supabase
    .from("items")
    .update(data)
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["item", { id }]),
    client.invalidateQueries(["items"]),
  ]);
  return response;
}

// Delete an item
export async function deleteItem(id) {
  const response = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .then(handle);
  // Invalidate and refetch queries that could have old data
  await Promise.all([
    client.invalidateQueries(["item", { id }]),
    client.invalidateQueries(["items"]),
  ]);
  return response;
}

/**** HELPERS ****/

// Get response data or throw error if there is one
function handle(response) {
  if (response.error) throw response.error;
  return response.data;
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
