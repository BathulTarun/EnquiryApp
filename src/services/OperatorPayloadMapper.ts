import {Engineer} from "@/types/engineer";

export const mapOperatorFromApi = (apiResponse: any): Engineer | null => {
  if (!apiResponse || !apiResponse.Data) return null;

  const data = apiResponse.Data;
  // const operator: Engineer = {
  //   id: data.BasicDetails.CustomerID,
  //   name: data.UserName || "",
  //   phone: data.BasicDetails.MobileFirst || "",
  //   email: data.Email || "",
  //   status: "Available",
  //   // addresses: [address]
  // };

  const operator: Engineer = {
    id: data.AspNetUserId,
    name: data.UserName || "",
    phone: data.Mobile || "",
    email: data.Email || "",
    role: data.Role || "",
    status: "Available",
    // addresses: [address]
  };
  return operator;
};
