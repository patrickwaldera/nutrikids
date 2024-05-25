import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	
	event.locals.token =  event.cookies.get("token") || null;

	const userCookie = event.cookies.get("user") || null;
	const user = userCookie ? JSON.parse(userCookie) : null;
	event.locals.user =  user;

	const response = await resolve(event);
	response.headers.set('Access-Control-Allow-Origin', '*')
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('cache-control', 'no-cache max-age=0, must-revalidate, no-store');
	
	return response;
}