import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://abc-trade-outlet.herokuapp.com/' }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user) => ({
        url: '/api/users/signup',
        method: 'POST',
        body: user
      })
    }),

    signin: builder.mutation({
      query: (user) => ({
        url: '/api/users/signin',
        method: 'POST',
        body: user
      })
    }),

    addNewProduct: builder.mutation({
      query: (product) => ({
        url: '/api/products/add-new-product',
        method: 'POST',
        body: product
      })
    }),

  })
})

export const { useSignupMutation, useSigninMutation, useAddNewProductMutation } = appApi;

export default appApi;