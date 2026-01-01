"use client";
import React from "react";
import Image from "next/image";
import { ChevronDown, Divide } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserNav } from "./UserNav";
import { HolidayDrawer } from "./HolidayDrawer";
import { WorkingDaysDialog } from "./WorkingDaysDialog";
import { Button } from "../ui/button";

// Placeholder for user name, replace with actual user data when available

const Header = () => {
  const [userName, setUserName] = useState<String | null>(null);
  const supabase = createClient();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Google stores the name in user_metadata.full_name
        const name = user.user_metadata?.full_name || "user";
        const first_name = name.split(" ")[0];
        setUserName(first_name);
      }
    };

    fetchUserName();
  }, []);

  return (
    <nav className="flex-col w-full p-5 md:p-10 pb-0 md:pb-0 lg:px-20 ">
      <div className="TopNavbar mb-2 w-full flex items-center justify-between">
        <div className="ImageAndLogo flex gap-2 items-center">
          <Image
            src="/icon.png"
            alt="logo"
            width={40}
            height={40}
            className="h-auto w-auto"
          />
          <span className="italic text-foreground/70 text-xl">Academic OS</span>
        </div>
        <UserNav />
      </div>
      <div className="HeaderSection flex items-center justify-between">
        <div>
          <span className="italic font-bold text-3xl">Hello, {userName}</span>
          <p className="font-thin">{formattedDate}</p>
        </div>
        <div className="hidden md:flex items-baseline gap-5">
          <HolidayDrawer
            customTrigger={
              <Button variant="secondary" className=" text-foreground/70 bg-card px-3 py-2.5 rounded-lg border border-border  cursor-pointer">
                Add holidays
              </Button >
            }
          />

          <WorkingDaysDialog
            customTrigger={
              <Button variant="secondary" className="text-foreground/70 bg-card px-3 py-2.5 rounded-lg border border-border  cursor-pointer">
                Edit Working days
              </Button >
            }
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
