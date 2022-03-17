import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@lib/redux/store'
import { fetchDoJob } from '@lib/redux/features/CurrentJob/CurrentJobApi'
import { CurrentJob } from '@models/CurrentJob'

export interface CurrenJobState {
    value: CurrentJob|null
    status: 'idle' | 'loading' | 'failed'
  }

const initialState: CurrenJobState = {
    value: null,
    status: 'idle',
}

export const doJob = createAsyncThunk(
    'CurrentJob/doJob',
    async (jobRefId: string) => {
      const response = await fetchDoJob(jobRefId)
      return response
    }
  )

export const currentJobSlice = createSlice({
    name: 'currentJob',
    initialState,
    reducers: {
        empty: (state) => {
          state.value = null
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(doJob.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(doJob.fulfilled, (state, action) => {
          state.status = 'idle'
          state.value = action.payload
        })
    },
  })
  export const { empty} = currentJobSlice.actions
export const selectCurrentJob = (state: AppState) => state.currentJob.value
export default currentJobSlice.reducer
