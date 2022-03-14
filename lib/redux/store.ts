import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import topReducer from '@lib/redux/features/Top/TopSlice';
import currentJobReducer from '@lib/redux/features/CurrentJob/CurrentJobSlice';

export function makeStore() {
  return configureStore({
    reducer: { 
      top: topReducer,
      currentJob: currentJobReducer
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store