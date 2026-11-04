import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Account,
  Category,
  OverviewData,
  Transaction,
  Transfer,
  User,
} from './types';

const getToken = () => localStorage.getItem('accessToken');

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Accounts', 'Transactions', 'Categories', 'Transfers', 'Statistics'],
  endpoints: (builder) => ({
    register: builder.mutation<{ accessToken: string; refreshToken: string; user: User }, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<{ accessToken: string; refreshToken: string; user: User }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<{ accessToken: string; refreshToken: string; user: User }, { refreshToken?: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getAccounts: builder.query<Account[], void>({
      query: () => '/accounts',
      providesTags: ['Accounts'],
    }),
    createAccount: builder.mutation<Account, Partial<Account>>({
      query: (body) => ({
        url: '/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Accounts'],
    }),
    updateAccount: builder.mutation<Account, { id: string; body: Partial<Account> }>({
      query: ({ id, body }) => ({
        url: `/accounts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Accounts'],
    }),
    deleteAccount: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Accounts'],
    }),
    getTransactions: builder.query<Transaction[], Record<string, string>>({
      query: (params = {}) => ({
        url: '/transactions',
        params,
      }),
      providesTags: ['Transactions'],
    }),
    createTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: (body) => ({
        url: '/transactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transactions', 'Statistics'],
    }),
    updateTransaction: builder.mutation<Transaction, { id: string; body: Partial<Transaction> }>({
      query: ({ id, body }) => ({
        url: `/transactions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Transactions', 'Statistics'],
    }),
    deleteTransaction: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transactions', 'Statistics'],
    }),
    getCategories: builder.query<Category[], { type?: string }>({
      query: (params = {}) => ({
        url: '/categories',
        params,
      }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<Category, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
    getTransfers: builder.query<Transfer[], void>({
      query: () => '/transfers',
      providesTags: ['Transfers'],
    }),
    createTransfer: builder.mutation<Transfer, Partial<Transfer>>({
      query: (body) => ({
        url: '/transfers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transfers', 'Statistics'],
    }),
    getOverview: builder.query<OverviewData, void>({
      query: () => '/statistics/overview',
      providesTags: ['Statistics'],
    }),
    getIncomeExpense: builder.query<Array<{ month: string; income: number; expense: number }>, void>({
      query: () => '/statistics/income-expense',
      providesTags: ['Statistics'],
    }),
    getCategoryStats: builder.query<Array<{ name: string; value: number }>, void>({
      query: () => '/statistics/categories',
      providesTags: ['Statistics'],
    }),
    getBalanceHistory: builder.query<Array<{ month: string; balance: number }>, void>({
      query: () => '/statistics/balance-history',
      providesTags: ['Statistics'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetTransfersQuery,
  useCreateTransferMutation,
  useGetOverviewQuery,
  useGetIncomeExpenseQuery,
  useGetCategoryStatsQuery,
  useGetBalanceHistoryQuery,
} = api;
