import { Action } from "@shared/types/api";
const endpoint = "http://localhost:5000";
const method = "POST";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const readConfig = async () => {
  const res = await fetch(endpoint, {
    method,
    headers,
    body: JSON.stringify({
      action: Action.readConfig,
    }),
  });

  console.log({ res: res });
};
