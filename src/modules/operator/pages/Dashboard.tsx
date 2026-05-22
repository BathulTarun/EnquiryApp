import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";

import {EnquiryStatus} from "@/types/enquiry";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  LogOut,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

import {Engineer} from "@/types/engineer";
import {UserManager} from "@/services/userManager";
import {TokenManager} from "@/services/tokenManager.service";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import {useWorkTypeStore} from "@/stores/ProductDetailsStore";
const statusIcon: Record<string, React.ReactNode> = {
  "My Tasks": <ClipboardList className="w-5 h-5" />,
  Upcoming: <Clock className="w-5 h-5" />,
  Completed: <CheckCircle2 className="w-5 h-5" />,
  Pending: <AlertCircle className="w-5 h-5" />,
  Rescheduled: <RotateCcw className="w-5 h-5" />,
};

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  SiteVisitScheduled: "bg-primary/10 text-primary border-primary/20",
  SiteVisitRescheduled: "bg-orange-50 text-orange-600 border-orange-200",
  SiteVisitCompleted: "bg-violet-50 text-violet-600 border-violet-200",
  ReadyForQuotation: "bg-accent/10 text-accent border-accent/20",
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const filterMap: Record<string, (s: EnquiryStatus) => boolean> = {
  "My Tasks": () => true,
  Upcoming: (s) => s === "SiteVisitScheduled",
  Completed: (s) => s === "SiteVisitCompleted" || s === "Completed",
  Pending: (s) => s === "Pending" || s === "ReadyForQuotation",
  Rescheduled: (s) => s === "SiteVisitRescheduled",
};

const cardColors: Record<string, string> = {
  "My Tasks": "bg-primary/10 text-primary",
  Upcoming: "bg-info/10 text-info",
  Completed: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Rescheduled: "bg-destructive/10 text-destructive",
};

const Dashboard: React.FC = () => {
  useEffect(() => {
    const engineer = async () => {
      const res = UserManager.getUser();
      setEngineer(res);
      await preloadWorkTypeData();
    };
    engineer();
  }, []);

  const navigate = useNavigate();

  const {engineerId} = useParams();
  const sections = [
    "Upcoming",
    "Rescheduled",
    "Pending",
    "Completed",
    "My Tasks",
  ];
  const [engineer, setEngineer] = React.useState<Engineer | null>(null);
  const {enquiries, fetchEnquiries, loading} = useOperatorStore();
  const {
    categories,
    subcategories,
    products,
    loadCategories,
    loadSubcategories,
    loadProducts,
  } = useWorkTypeStore();

  const preloadWorkTypeData = async () => {
    // categories
    await loadCategories();

    // get categories from store
    const cats = useWorkTypeStore.getState().categories;

    // load all subcategories
    await Promise.all(
      cats.map((cat) => loadSubcategories(Number(cat.CategoryID))),
    );

    // get updated subcategories
    const allSubcategories = useWorkTypeStore.getState().subcategories;

    // flatten subcategories
    const subList = Object.values(allSubcategories).flat();

    // load all products
    await Promise.all(
      subList.map((sub) => loadProducts(Number(sub.SubCategoryID))),
    );
  };

  useEffect(() => {
    const handleFocus = () => {
      fetchEnquiries(Number(engineerId), true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    fetchEnquiries(Number(engineerId));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-material sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14">
          <div>
            <h1 className="text-lg font-semibold text-card-foreground">
              Welcome,
            </h1>
            <h1 className="text-s text-muted-foreground">{engineer?.name}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              (navigate("/"),
                TokenManager.clearToken(),
                UserManager.clearUser());
            }}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {sections.map((section) => {
            const count = enquiries.filter((t) =>
              filterMap[section](t.status),
            ).length;
            return (
              <button
                key={section}
                onClick={() =>
                  navigate(
                    `/operator/tasks?filter=${encodeURIComponent(section)}&engineerId=${engineerId}`,
                  )
                }
                className="bg-card rounded-lg shadow-material p-2 text-left hover:shadow-material-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${cardColors[section]}`}
                  >
                    {statusIcon[section]}
                  </div>

                  {/* Text */}
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-lg font-bold text-card-foreground">
                      {count}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {section}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Tasks */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Recent Tasks
          </h2>
          <div className="space-y-2">
            {enquiries.slice(0, 5).map((task) => (
              <button
                key={task.id}
                onClick={() =>
                  navigate(`/operator/tasks/${task.id}`, {
                    state: {enquiry: task},
                  })
                }
                className="w-full bg-card rounded-lg shadow-material-sm p-4 text-left hover:shadow-material transition-shadow flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium text-card-foreground">
                      {task.EnquiryNumber || `ENQ-${task.id}`}
                    </p>
                    <Badge
                      variant="outline"
                      className={statusColors[task.status]}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {task.siteVisit?.scheduledDate
                      ?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                    , {task.siteVisit?.scheduledTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
