import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const prerender = true;

export const load: PageServerLoad = async ({ locals }: any) => { 
	if(locals.user) {
	  throw redirect(303, "/")
	}
  }