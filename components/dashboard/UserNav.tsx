"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
  EllipsisVertical 
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { resetAccount } from "@/app/dashboard/actions";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
const WorkingDaysDialog = dynamic(() => import("./WorkingDaysDialog").then(mod => mod.WorkingDaysDialog), { ssr: false });
const HolidayDrawer = dynamic(() => import("./HolidayDrawer").then(mod => mod.HolidayDrawer), { ssr: false });
const ManualOverrideDialog = dynamic(() => import("./ManualOverrideDialog").then(mod => mod.ManualOverrideDialog), { ssr: false });
import { toast } from "sonner";
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
import { Menu } from 'lucide-react';
import { updateSession } from "@/utils/supabase/proxy";
import { updateTag } from "next/cache";
import { useEffect, useState } from "react";

export function UserNav() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [userID, setUserID] = useState<String | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchUserID = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Google stores the name in user_metadata.full_name
          const userID = user.user_metadata?.email || "UserID";
          
          setUserID(userID);
        }
      };
  
      fetchUserID();
    }, []);
  
  // State for the Reset Alert
  const [showResetAlert, setShowResetAlert] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleFreshStart = async () => {
    setIsResetting(true);
    try {
      await resetAccount();
      toast.success("Account reset to default settings");
      setShowResetAlert(false);
      window.dispatchEvent(new Event("attendanceUpdated"));
    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Failed to clear all data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="flex items-start gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full bg-card border border-border"
            >
              <EllipsisVertical className="md:hidden"/>
              <Menu className="hidden md:flex"/>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="" align="end" forceMount>
            <DropdownMenuLabel className="font-normal flex justify-around">
              <div className="flex flex-col space-y-1 ">
                <p className="text-sm font-medium leading-none">Settings</p>
                <p className="text-xs pr-2 leading-none text-muted-foreground">
                  Using {userID}
                </p>
              </div>
              <div className="flex border-l pl-2 items-center justify-between gap-2 py-1.5">
                <div className="flex items-center gap-2">
                  {!mounted ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </div>
                <Switch
                  checked={mounted && theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                  disabled={!mounted}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup className="md:hidden">
              <WorkingDaysDialog />
              <HolidayDrawer />
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <ManualOverrideDialog />
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="md:hidden" />

            {/* DANGER ZONE */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault(); // Prevent menu from closing immediately
                setShowResetAlert(true);
              }}
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset Account</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-muted-foreground focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ALERT DIALOG FOR RESET */}
      <AlertDialog open={showResetAlert} onOpenChange={setShowResetAlert}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Reset all data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              entire schedule, attendance history, and custom settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Stop dialog from closing automatically to show loading state
                handleFreshStart();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Yes, Delete Everything"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}