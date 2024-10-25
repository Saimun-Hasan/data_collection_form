import { apiSlice } from './ApiSlice';

// Define types for your request and response data
interface RegisterResponse {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    };
    token: string;
}
interface LoginResponse {
    user: {
        id: string;
        email: string;
    };
    token: string;
}

interface LogoutData {
    userId: string;
}

// Define the base URL for the users API
const USERS_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/users'
    : 'https://user-registration-server-one.vercel.app/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegisterResponse, { firstName: string; lastName: string; userName: string; email: string; password: string }>({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, LogoutData>({
            query: (data) => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
} = usersApiSlice;
