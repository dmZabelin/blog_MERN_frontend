import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('POSTS/fetchPosts', async () => {
	const { data } = await axios.get('/posts');
	return data;
});

export const fetchTags = createAsyncThunk('POSTS/fetchTags', async () => {
	const { data } = await axios.get('/posts/tags');
	return data;
});

export const fetchRemovePosts = createAsyncThunk(
	'POSTS/fetchRemovePosts',
	async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
	posts: {
		items: [],
		status: 'loading',
		sorted: 'new'
	},
	tags: {
		items: [],
		status: 'loading'
	}
};

const postsSlice = createSlice({
	name: 'POSTS',
	initialState,
	reducers: {
		sortedByData: (state) => {
			state.posts.items = state.posts.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			state.posts.sorted = 'new';
		},
		sortedByViews: (state) => {
			state.posts.items = state.posts.items.sort((a, b) => b.viewsCount - a.viewsCount);
			state.posts.sorted = 'views';
		}
	},
	extraReducers: {
		//Get Posts
		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},

		//Get Tags
		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = 'loading';
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = 'loaded';
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error';
		},

		//Delete Post
		[fetchRemovePosts.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
			state.tags.status = 'loading';
		}
	}
});

export const { sortedByData, sortedByViews } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
