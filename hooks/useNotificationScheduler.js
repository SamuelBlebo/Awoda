import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { LEAD_TIME_DAYS, shiftDateByDays, timeStringToDate } from "../lib/date";

// Cancels and reschedules every local notification whenever the people
// list or settings change. Simplest robust strategy for a list this small —
// avoids tracking per-person notification identifiers.
export function useNotificationScheduler(people, settings) {
  useEffect(() => {
    let cancelled = false;

    async function reschedule() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") return;

      await Notifications.cancelAllScheduledNotificationsAsync();
      if (cancelled) return;

      const reminderTime = timeStringToDate(settings.reminderTime);
      const hour = reminderTime.getHours();
      const minute = reminderTime.getMinutes();

      for (const person of people) {
        const leadTimeKey = person.leadTime ?? settings.leadTime;
        const leadDays = LEAD_TIME_DAYS[leadTimeKey] ?? 0;
        const { month, day } = shiftDateByDays(person.month, person.day, leadDays);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Awoda",
            body:
              leadDays === 0
                ? `It's ${person.name}'s birthday today!`
                : `${person.name}'s birthday is coming up in ${leadDays} day${leadDays === 1 ? "" : "s"}.`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            month, day, hour, minute,
            repeats: true,
          },
        });
      }
    }

    reschedule();
    return () => { cancelled = true; };
  }, [people, settings]);
}
