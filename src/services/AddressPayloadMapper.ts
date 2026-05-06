import { Address } from "@/types/common";

export const mapAddressToApi = (address: Address, customerId: Number) => {
  return {
    Name: address.label || "Address",

    AddressLine1: address.address1,
    AddressLine2: address.address2 || "",

    LandMark: address.landmark || "",
    LedgerID: customerId,
    City: address.city,
    PostalCode: address.pincode,

    State: address.stateId || 0,   // ⚠️ must be ID
    Country: 1, // or Number(address.countryId) later

    Latitude: address.lat ? String(address.lat) : "",
    Longitude: address.lng ? String(address.lng) : ""
  };
};




export const mapLocationToAddress = (loc: any): Address => ({
  id: loc.LocationID, // backend ID
  address1: loc.AddressLine1,
  address2: loc.AddressLine2 || "",
  customerID:loc.LedgerID,
  city: loc.City,
  state: loc.StateName,
  stateId: loc.StateID,
  pincode: loc.PostalCode,
  landmark: loc.LandMark || "",
  lat: 0, // not provided
  lng: 0,
  verified: true, // since coming from saved data
});