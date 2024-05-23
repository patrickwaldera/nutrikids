import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	
	event.locals.token =  event.cookies.get("token") || null;

	const userCookie = event.cookies.get("user") || null;
	const user = userCookie ? JSON.parse(userCookie) : null;
	event.locals.user =  user;
	
	return resolve(event);
}