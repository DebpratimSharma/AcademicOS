"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addRegularClass(formData: FormData, activeDay: string, today: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const weightValue = parseInt(formData.get("weight") as string) || 1;

  const { error } = await supabase.from("routines").insert({
    user_id: user.id,
    subject_name: formData.get("subject"),
    day_of_week: activeDay,
    start_time: formData.get("start"),
    end_time: formData.get("end"),
    room_number: formData.get("room"),
    weight: weightValue,
    status: 'active',
    start_date: today,
    end_date: null,
    subject_code: formData.get("subject_code")
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function addSubstituteClass(formData: FormData, dateStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const weightValue = parseInt(formData.get("weight") as string) || 1;

  const { error } = await supabase.from("extra_sessions").insert({
    user_id: user.id,
    subject_name: formData.get("subject"),
    date: dateStr,
    start_time: formData.get("start"),
    end_time: formData.get("end"),
    weight: weightValue,
    actual_weight: weightValue,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateClass(formData: FormData, id: string, isSubstitute: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  let error;
  if (isSubstitute) {
    const result = await supabase
      .from("extra_sessions")
      .update({
        subject_name: formData.get("subject"),
        start_time: formData.get("start"),
        end_time: formData.get("end"),
        weight: parseInt(formData.get("weight") as string),
        actual_weight: parseInt(formData.get("weight") as string),
      })
      .eq("id", id)
      .eq("user_id", user.id);
    error = result.error;
  } else {
    const result = await supabase
      .from("routines")
      .update({
        subject_name: formData.get("subject"),
        start_time: formData.get("start"),
        end_time: formData.get("end"),
        room_number: formData.get("room"),
        weight: parseInt(formData.get("weight") as string),
        subject_code: formData.get("subject_code"),
      })
      .eq("id", id)
      .eq("user_id", user.id);
    error = result.error;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function addHoliday(holidayDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("holidays")
    .insert([
      {
        holiday_date: holidayDate,
        user_id: user.id,
      },
    ]);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteHoliday(holidayDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("holidays")
    .delete()
    .eq("holiday_date", holidayDate)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function archiveRoutine(activeDay: string, yesterday: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("routines")
    .update({ 
      status: "archived", 
      end_date: yesterday 
    })
    .eq("day_of_week", activeDay)
    .eq("status", "active")
    .is("end_date", null)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateWorkingDays(workingDays: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    working_days: workingDays,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function resetAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Delete Extra Sessions
  const { error: extraError } = await supabase
    .from('extra_sessions')
    .delete()
    .eq('user_id', user.id);
  if (extraError) throw extraError;

  // 2. Delete Attendance History
  const { error: attendanceError } = await supabase
    .from('attendance')
    .delete()
    .eq('user_id', user.id);
  if (attendanceError) throw attendanceError;

  // 3. Delete all Routines
  const { error: routineError } = await supabase
    .from('routines')
    .delete()
    .eq('user_id', user.id);
  if (routineError) throw routineError;

  // 4. Delete all Custom Holidays
  const { error: holidayError } = await supabase
    .from('holidays')
    .delete()
    .eq('user_id', user.id);
  if (holidayError) throw holidayError;

  // 5. Reset User Settings
  const { error: settingsError } = await supabase
    .from('user_settings')
    .update({ 
      working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
    })
    .eq('user_id', user.id);
  if (settingsError) throw settingsError;

  revalidatePath("/dashboard");
}

export async function updateAttendance(id: string, status: string, dateStr: string, weight: number, isExtra: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  if (isExtra) {
    const { error } = await supabase
      .from("extra_sessions")
      .update({
        status,
        actual_weight: weight,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("attendance").upsert(
      {
        user_id: user.id,
        routine_id: id,
        status,
        date: dateStr,
        actual_weight: weight,
      },
      { onConflict: "routine_id, date" }
    );
    if (error) throw error;
  }
  revalidatePath("/dashboard");
}

export async function updateWeight(id: string, weight: number, dateStr: string, isExtra: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  if (isExtra) {
    const { error } = await supabase
      .from("extra_sessions")
      .update({ actual_weight: weight })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("attendance").upsert(
      {
        user_id: user.id,
        routine_id: id,
        status: "present",
        date: dateStr,
        actual_weight: weight,
      },
      { onConflict: "routine_id, date" }
    );
    if (error) throw error;
  }
  revalidatePath("/dashboard");
}

export async function deleteClass(id: string, isExtra: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const table = isExtra ? "extra_sessions" : "routines";
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
export async function addManualBaseline(conducted: number, present: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Delete any existing baseline first to prevent duplicates
  await supabase
    .from("extra_sessions")
    .delete()
    .eq("user_id", user.id)
    .eq("subject_name", "Previous Baseline");

  const { error } = await supabase.from("extra_sessions").insert({
    user_id: user.id,
    subject_name: "Previous Baseline",
    date: "2000-01-01",
    start_time: "00:00",
    end_time: "00:01",
    weight: conducted,
    actual_weight: present,
    status: "present"
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
