import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import PageLoader from "@/components/PageLoader";
import {EnquiryStatus} from "@/types/enquiry";
import {Card, CardContent} from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  LogOut,
  Calendar,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

import {Engineer} from "@/types/engineer";
import {UserManager} from "@/services/userManager";
import {TokenManager} from "@/services/tokenManager.service";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import {useWorkTypeStore} from "@/stores/ProductDetailsStore";
import {useProductStore} from "@/stores/productStore";
import getVisitDateStatus from "@/components/VisitDateConvertor";
import {toast} from "sonner";
import {statusColors} from "../utils/task.constants";
import {filterMap} from "../utils/task.constants";
import {cardColors} from "../utils/task.constants";
import {preloadWorkTypeData} from "@/stores/ProductPreload";
const statusIcon: Record<string, React.ReactNode> = {
  Today: <Calendar className="w-5 h-5" />,
  Tomorrow: <Calendar className="w-5 h-5" />,
  Overdue: <AlertCircle className="w-5 h-5" />,
  "My Tasks": <ClipboardList className="w-5 h-5" />,
  Upcoming: <Clock className="w-5 h-5" />,
  Completed: <CheckCircle2 className="w-5 h-5" />,
  Pending: <AlertCircle className="w-5 h-5" />,
  Rescheduled: <RotateCcw className="w-5 h-5" />,
};

const Dashboard: React.FC = () => {
  useEffect(() => {
    const engineer = async () => {
      const res = UserManager.getUserName();
      setEngineerName(res);
      // await preloadWorkTypeDataDetails();
    };
    engineer();
  }, []);

  // useEffect(() => {
  //   preloadWorkTypeData();
  // }, []);
  const navigate = useNavigate();

  const {engineerId} = useParams();
  const token = TokenManager.getToken();
  const sections = [
    "Today",
    "Tomorrow",
    "Overdue",
    "Upcoming",
    "Rescheduled",
    "Pending",
    "Completed",
    "My Tasks",
  ];
  const [engineerName, setEngineerName] = React.useState<String | null>(null);
  const {enquiries, fetchEnquiries, loading, clearStore} = useOperatorStore();
  const {clearProducts} = useProductStore();
  const {
    categories,
    subcategories,
    products,
    loadCategories,
    loadSubcategories,
    loadProducts,
    clearWorkTypes,
  } = useWorkTypeStore();

  useEffect(() => {
    loadCategories();
  }, []);

  // const preloadWorkTypeDataDetails = async () => {
  //   if (loading) {
  //     // categories
  //     await loadCategories();

  //     // get categories from store
  //     const cats = useWorkTypeStore.getState().categories;

  //     // load all subcategories
  //     await Promise.all(
  //       cats.map((cat) => loadSubcategories(Number(cat.CategoryID))),
  //     );

  //     // get updated subcategories
  //     const allSubcategories = useWorkTypeStore.getState().subcategories;

  //     // flatten subcategories
  //     const subList = Object.values(allSubcategories).flat();

  //     // load all products
  //     await Promise.all(
  //       subList.map((sub) => loadProducts(Number(sub.SubCategoryID))),
  //     );
  //   } else {
  //     console.log("No Tasks No Api calling");
  //   }
  // };

  useEffect(() => {
    const handleFocus = () => {
      fetchEnquiries(token, true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    fetchEnquiries(token);
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
            <h1 className="text-s text-muted-foreground">{engineerName}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              (navigate("/"),
                TokenManager.clearToken(),
                UserManager.clearUserName());
              clearStore();
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
            const count =
              enquiries?.filter((t) => filterMap[section](t.status, t))
                .length || 0;

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
                <div className="flex items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${cardColors[section]}`}
                  >
                    {statusIcon[section]}
                  </div>

                  <div className="flex items-center gap-1 min-w-0">
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
            {loading ? (
              // Skeleton Loader
              Array.from({length: 5}).map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-card rounded-lg shadow-material-sm p-4 animate-pulse"
                >
                  <div className="flex justify-between mb-3">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>

                  <div className="h-3 w-40 bg-muted rounded mb-2" />
                  <div className="h-3 w-full bg-muted rounded" />
                </div>
              ))
            ) : enquiries?.length > 0 ? (
              [...enquiries]
                .filter((t) => t.status !== "Completed")
                .sort(
                  (a, b) =>
                    new Date(a.siteVisit?.scheduledDate || "").getTime() -
                    new Date(b.siteVisit?.scheduledDate || "").getTime(),
                )
                .slice(0, 5)
                .map((task) => (
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

                      <div className="flex items-center gap-2 text-card-foreground">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">
                          {task.siteVisit?.scheduledDate
                            ?.split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
                        </span>
                        <Badge
                          variant="outline"
                          className={`border-0 h-4 ${getVisitDateStatus(task).badge}`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${getVisitDateStatus(task).dot}`}
                          />

                          <p
                            className={`pl-2  ${getVisitDateStatus(task).color}`}
                          >
                            {getVisitDateStatus(task).text}
                          </p>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-card-foreground">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">
                          {task.siteVisit.scheduledTime}
                        </span>
                      </div>

                      <p className="text-xs italic leading-relaxed text-muted-foreground">
                        "{task.description}"
                      </p>
                    </div>
                  </button>
                ))
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No tasks assigned yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
