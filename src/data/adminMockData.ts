import {customers} from "./customer.mock";
import {engineers} from "./engineer.mock";
import {enquiries} from "./enquiry.mock";
import {quotations} from "./quotation.mock";

const now = new Date();
const d = (daysAgo: number) =>
  new Date(now.getTime() - daysAgo * 86400000).toISOString();

export const Engineers = engineers;
export const Customers = customers;
export const Enquiries = enquiries;
export const Quotations = quotations;
