import { RootState } from './index'

const KEY = 'redux'

export function loadState() {
    try {
        const serializedState = localStorage.getItem(KEY)
        if (!serializedState) {
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (e) {
        return undefined
    }
}

export async function saveState(state: RootState) {
    try {
        const serializedState = JSON.stringify({
            auth: state.auth,
        })
        localStorage.setItem(KEY, serializedState)
    } catch (e) {
        // Ignore
    }
}
