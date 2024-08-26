import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './baseQuery';
import { jsonToList, jsonToListItem, List, ListWithItem } from '../../types/list';

enum ListApiTags {
	Lists = "Lists"
}

export const listApi = createApi({
	reducerPath: 'listApi',
	baseQuery: createBaseQuery(),
	// tagTypes: [ListApiTags.Lists],
	endpoints: (builder) => ({
		getAllLists: builder.query<List[], void>({
			query: () => ({
				url: `/lists`,
				method: 'GET',
			}),
			// providesTags: [ListApiTags.Lists],
			transformResponse: (response: any) => {
				return response.lists.map((list: any) => jsonToList(list));
			}
		}),
		createList: builder.mutation<List, Partial<List> & Pick<List, 'name'>>({
			query: (body) => ({
				url: `/lists`,
				method: 'POST',
				body,
			}),
			transformResponse: (response: any) => {
				return jsonToList(response.list);
			}
		}),
		getList: builder.query<ListWithItem, number>({
			query: (listID) => ({
				url: `/lists/${listID}`,
				method: 'GET',
			}),
			transformResponse: (response: any) => {
				return {
					...jsonToList(response.list),
					items: response.items.map((item: any) => jsonToListItem(item))
				};
			}
		}),
		updateListName: builder.mutation<void, { listId: number; name: string; }>({
			query: ({ listId, name }) => ({
				url: `/lists/${listId}`,
				method: 'PUT',
				body: { name },
			}),
		}),
		deleteList: builder.mutation<void, number>({
			query: (listID) => ({
				url: `/lists/${listID}`,
				method: 'DELETE',
			}),
		}),
		addToList: builder.mutation<void, { listId: number; problemId: string; }>({
			query: ({ listId, problemId }) => ({
				url: `/lists/${listId}/item`,
				method: 'PUT',
				body: { "problem_id": problemId },
			}),
			// invalidatesTags: [ListApiTags.Lists]
		}),
		deleteFromList: builder.mutation<void, { listId: number; problemId: string; }>({
			query: ({ listId, problemId }) => ({
				url: `/lists/${listId}/item/${problemId}`,
				method: 'DELETE'
			}),
		}),

	}),
});

export const { useCreateListMutation, useGetListQuery } = listApi;