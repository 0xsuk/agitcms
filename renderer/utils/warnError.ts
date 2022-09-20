import { APIError } from "@shared/types/api";

export const warnError = (err: APIError) => {
  if (err.message) {
    alert(err.message);
  } else {
    alert("Error occured. See the browser console");
  }
  console.warn(err);
};
