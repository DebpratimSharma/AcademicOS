"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {UserNav} from "./UserNav";

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
    <div className="flex item-start justify-between">
      {/* Left side of header */}
      <div className="flex-col">
        <div className="flex items-center">
          <Image className="h-auto w-auto" src="/icon.png" width={40} height={40} alt="logo" />
          <span className="font-semibold text-muted-foreground text-md ml-1 italic">
            AcademicOS
          </span>
        </div>
        <div className="flex text-3xl italic font-bold ml-1">
          <span>Hello, </span>
          <span>&nbsp;{userName}</span>
        </div>
        <p className="text-muted-foreground pt-1 ml-1">{formattedDate}</p>
      </div>
      {/* Right side of header: icon */}
      <UserNav />

    </div>
  );
};

export default Header;
