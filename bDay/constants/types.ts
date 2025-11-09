export interface CalendarRecord {
    name: string | null;
    date: string | null;
    description?: string;
    email?: string;
    phone?: number;
    [key: string]: any,
}