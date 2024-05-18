import type { User } from "$lib/core/entities/User";
import { writable } from "svelte/store";

export const UserStore = writable<User | undefined>(undefined)