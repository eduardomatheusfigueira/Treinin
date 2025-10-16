import { googleLogout } from '@react-oauth/google';
import Cookies from 'js-cookie';

export const createGoogleCalendarEvent = async (accessToken: string, event: any) => {
    if (!accessToken) return;
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
    if (!res.ok) {
        throw new Error(`Error creating event: ${res.statusText}`);
    }
    return await res.json();
};
