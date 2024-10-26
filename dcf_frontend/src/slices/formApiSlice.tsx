import { apiSlice } from './ApiSlice';

// Define types for your request and response data

interface FormSubmissionResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
    };
}

// Define the base URL for the forms API
const FORMS_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/forms'
    : 'https://datacollectionform-production.up.railway.app/api/forms' /* 'https://data-collection-form-server.vercel.app/api/forms' */;

export const formsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        formSubmission: builder.mutation<FormSubmissionResponse, FormData>({
            query: (formData) => ({
                url: `${FORMS_URL}/submit-form`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useFormSubmissionMutation,
} = formsApiSlice;
