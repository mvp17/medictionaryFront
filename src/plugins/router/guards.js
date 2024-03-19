import { useUserStore } from "../../modules/users/stores/userStore";

export function authGuard () {
    const userStore = useUserStore;
    const isAuth = userStore.getUser.token !== "";
    if (!isAuth) return { name: 'Login'}
}
