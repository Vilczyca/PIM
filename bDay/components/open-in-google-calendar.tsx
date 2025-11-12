import * as Linking from 'expo-linking';
import {CalendarRecord} from "@/constants/types";

export const OpenInGoogleCalendar = (record: CalendarRecord | undefined) => {
    if (!record || !record.name || !record.date) return;
    const [day, month, year] = record.date.split("-").map(Number);
    const dateStart = new Date(year, month - 1, day+1).toISOString().substring(0,10).replace(/-/g, '');
    const dateEnd = new Date(year, month - 1, day+2).toISOString().substring(0,10).replace(/-/g, '');

    const eventName = `Birthday of ${record.name}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${dateStart}/${dateEnd}&recur=RRULE:FREQ=YEARLY`;
    Linking.openURL(url);
}