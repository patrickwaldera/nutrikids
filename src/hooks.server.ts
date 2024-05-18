import { createInstance } from '$lib/infra/repositories_impl/pocketbase'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const pb = createInstance()

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
	  event.locals.pb = pb

	  const user = {
		id: pb.authStore.model?.id,
		name: pb.authStore.model?.name,
		username: pb.authStore.model?.username,
		email: pb.authStore.model?.email,
		role: pb.authStore.model?.role
	  }
	
	  event.locals.user = user
    }
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear()
  }

  const response = await resolve(event)

  response.headers.set(
    'set-cookie',
    pb.authStore.exportToCookie({ httpOnly: false })
  )

  return response
}