import React from "react";
import OperatorLayout from "../components/OperatorLayout";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import {Card, CardContent} from "@/components/ui/card";
import {ClipboardList, CheckCircle2, TrendingUp} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const BAR_COLORS = [
  "#3b82f6", // 1st - blue
  "#22c55e", // 2nd - green
  "#f59e0b", // 3rd - amber
  "#ef4444", // 4th - red
  "#8b5cf6", // 5th - purple
];

const Analytics = () => {
  const {enquiries} = useOperatorStore();

  const total = enquiries.length;

  const completed = enquiries.filter((e) => e.status === "Completed").length;

  const pending = enquiries.filter((e) => e.status !== "Completed").length;

  const rescheduled = enquiries.filter((e) =>
    e.statusHistory?.some((s) => s.status === "Site Visit Rescheduled"),
  ).length;

  const successRate = total ? ((completed / total) * 100).toFixed(1) : "0";

  const workItems = enquiries.flatMap(
    (e) => e.workItems?.map((w: any) => w) || [],
  );

  // Group by productName
  const productMap: Record<string, number> = {};

  workItems.forEach((item) => {
    const name = item.productName || item.name || "Unknown";

    productMap[name] = (productMap[name] || 0) + (item.quantity || 1);
  });

  // Convert to sorted array
  const topProducts = Object.entries(productMap)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  const topProductsWithColors = topProducts.map((item, index) => ({
    ...item,
    color: BAR_COLORS[index] || "#999",
  }));

  const productivityScore = completed * 10 - rescheduled * 5;

  const legend = [
    {label: "Completed", color: "#22c55e"},
    {label: "Pending", color: "#f59e0b"},
    {label: "Rescheduled", color: "#ef4444"},
  ];

  const pieData = [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Rescheduled",
      value: rescheduled,
    },
  ];

  const monthlyMap: Record<string, number> = {};

  enquiries.forEach((task) => {
    if (!task.siteVisit?.scheduledDate) return;

    const month = new Date(task.siteVisit.scheduledDate).toLocaleString(
      "default",
      {
        month: "short",
      },
    );

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({
    month,
    tasks: count,
  }));

  return (
    <OperatorLayout title="Analytics">
      <div className="space-y-4">
        {/* Summary Cards */}

        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>

                  <h2 className="text-2xl font-bold">{total}</h2>
                </div>

                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>

                  <h2 className="text-2xl font-bold text-green-600">
                    {completed}
                  </h2>
                </div>

                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Score */}

        <Card className="shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Productivity Score
                </p>

                <h2 className="text-4xl font-bold">{productivityScore}</h2>

                <p className="text-xs text-muted-foreground mt-1">
                  Based on completed and rescheduled tasks
                </p>
              </div>

              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}

        <Card className="shadow-md">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Success Rate</p>

            <h2 className="text-4xl font-bold mt-2">{successRate}%</h2>
          </CardContent>
        </Card>

        {/* Status Pie Chart */}

        <Card className="shadow-md">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Task Status Distribution</h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 text-sm">
              {legend.map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{backgroundColor: l.color}}
                  />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Worked */}

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Top Products Worked</h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topProductsWithColors}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={60}
                    tick={{fontSize: 12}}
                  />

                  <Tooltip />
                  <Bar dataKey="count" barSize={18}>
                    {topProductsWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}

        <Card className="shadow-md">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Monthly Task Trend</h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </OperatorLayout>
  );
};

export default Analytics;
