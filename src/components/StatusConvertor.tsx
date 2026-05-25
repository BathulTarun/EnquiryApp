const StatusConvertor = (status: string) => {
  switch (status) {
    case "Pending":
      return "Pending";

    case "SiteVisitScheduled":
      return "Site Visit Scheduled";

    case "SiteVisitRescheduled":
      return "Site Visit Rescheduled";

    case "SiteVisitCompleted":
      return "Site Visit Completed";

    case "ReadyForQuotation":
      return "Ready For Quotation";

    case "Completed":
      return "Completed";

    default:
      return "Status Updating";
  }
};

export default StatusConvertor;
