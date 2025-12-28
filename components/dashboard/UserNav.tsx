"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Settings,
  Calendar as CalendarIcon,
  LogOut,
  User,
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { WorkingDaysDialog } from "./WorkingDaysDialog";

export function UserNav() {
  const { theme, setTheme } = useTheme();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex items-start gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full bg-routine-card border border-routine-border"
          >
            <User />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                Manage your routine
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* 1. DARK MODE SWITCH */}
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="text-sm">Dark Mode</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            {/* 2. SETTINGS (WEEKDAYS) */}
            {/* Replace the old Settings DropdownMenuItem with this */}
            <div className="">
              <WorkingDaysDialog />
            </div>

            {/* 3. HOLIDAYS DRAWER */}
            <Drawer>
              <DrawerTrigger asChild>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Add Holidays</span>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Set Holidays</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* 4. LOGOUT */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
