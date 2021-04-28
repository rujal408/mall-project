import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers'

const customMiddleWare = (store) => (next) => (action) => typeof action === "function" ? action(store.dispatch) : next(action)
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(reducers, composeEnhancer(applyMiddleware(customMiddleWare)))