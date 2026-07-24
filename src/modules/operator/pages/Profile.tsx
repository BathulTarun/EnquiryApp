import React from "react";
import {UserManager} from "@/services/userManager";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import OperatorLayout from "../components/OperatorLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {TokenManager} from "@/services/tokenManager.service";
import {useOperatorStore} from "@/stores/OperatorStore/operatorStore";
import {useNavigate} from "react-router";
import {User, ShieldCheck, LogOut, ChevronRight, Badge} from "lucide-react";

const Profile = () => {
  const userName = UserManager.getUserName();

  const {clearStore} = useOperatorStore();

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const {enquiries} = useOperatorStore();

  const totalTasks = enquiries.length;

  const completedTasks = enquiries.filter(
    (e) => e.status === "Completed",
  ).length;

  const rescheduledTasks = enquiries.filter((e) =>
    e.statusHistory?.some((s) => s.status === "Site Visit Rescheduled"),
  ).length;

  const successRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const navigate = useNavigate();
  const handleLogout = () => {
    TokenManager.clearToken();
    UserManager.clearUserName();
    clearStore();

    navigate("/");
  };

  return (
    <OperatorLayout title="Profile">
      <div className="space-y-3 mt-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-muted-foreground">Operator</p>
            </div>

            <ShieldCheck className="h-5 w-5 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>

            <Badge>Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />

                <p className="font-medium">Performance Summary</p>
              </div>

              <Badge>This Month</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-bold">{totalTasks}</p>

                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-bold text-green-600">
                  {completedTasks}
                </p>

                <p className="text-xs text-muted-foreground">Completed</p>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-lg font-bold text-red-500">
                  {rescheduledTasks}
                </p>

                <p className="text-xs text-muted-foreground">Rescheduled</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-700 font-medium">
                Success Rate: {successRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-muted/50 transition"
          onClick={() => setShowLogoutDialog(true)}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-500" />

              <div>
                <p className="font-medium text-red-500">Logout</p>

                <p className="text-sm text-muted-foreground">
                  Sign out securely
                </p>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </OperatorLayout>
  );
};

export default Profile;
