import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@lib/redux/store'
import { fetchUser } from '@lib/redux/features/Top/TopApi'
import {User} from '@models/User'

export interface UserState {
    value: User|null
    status: 'idle' | 'loading' | 'failed'
  }

const initialState: UserState = {
    value: null,
    status: 'idle',
}

export const fetchTopAsync = createAsyncThunk(
    'Top/fetchUser',
    async (userRefId: string) => {
      const response = await fetchUser(userRefId)
      return response
    }
  )

export const topSlice = createSlice({
    name: 'top',
    initialState,
    reducers: {
        //...
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTopAsync.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(fetchTopAsync.fulfilled, (state, action) => {
          state.status = 'idle'
          state.value = action.payload
        })
    },
  })

export const selectTop = (state: AppState) => state.top.value
export default topSlice.reducer
