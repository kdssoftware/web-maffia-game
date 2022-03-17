import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@lib/redux/store'
import { fetchPurchase } from '@lib/redux/features/CurrentEnhancement/CurrentEnhancementApi'
import type { CurrentEnhancement as CurrentEnhancement} from '@models/CurrentEnhancement'

export interface CurrentEnhancementState {
    value: CurrentEnhancement|null
    status: 'idle' | 'loading' | 'failed'
  }

const initialState: CurrentEnhancementState = {
    value: null,
    status: 'idle',
}

export const purchase = createAsyncThunk(
    'CurrentEnhancement/purchase',
    async (args:{enhancementRefId : string, amount: number }) => {
      const response = await fetchPurchase(args.enhancementRefId, args.amount)
      return response
    }
  )

export const CurrentEnhancementSlice = createSlice({
    name: 'currentEnhancement',
    initialState,
    reducers: {
        empty: (state) => {
          state.value = null
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(purchase.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(purchase.fulfilled, (state, action) => {
          state.status = 'idle'
          state.value = action.payload
        })
    },
  })
  export const { empty} = CurrentEnhancementSlice.actions
export const selectCurrentEnhancement = (state: AppState) => state.currentEnhancement.value
export default CurrentEnhancementSlice.reducer
