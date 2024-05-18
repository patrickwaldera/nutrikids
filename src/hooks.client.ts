import { pb } from '$lib/infra/repositories_impl/pocketbase'
import { UserStore } from '$lib/stores/UserStore'

pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {
	if (pb.authStore.isValid) {
		const user = {
			id: pb.authStore.model?.id,
			name: pb.authStore.model?.name,
			username: pb.authStore.model?.username,
			email: pb.authStore.model?.email,
			role: pb.authStore.model?.role
		}
		UserStore.set(user)
	} else {
		UserStore.set(undefined)
	}
  	document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
}, true)