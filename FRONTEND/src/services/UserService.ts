import { api } from "../api/client";
import type { User } from "../dto/User";

class UserService {
    private readonly path = "/users";

    async login(email: string, password: string): Promise<User> {
        const { data } = await api.post<User>(`${this.path}/login`, { email, password });
        return data;
    }  
    async register(user: Omit<User, "id"> & { password: string }): Promise<User> {
        const { data } = await api.post<User>(`${this.path}/register`, user);
        return data;
    }

}
export const userService = new UserService();
