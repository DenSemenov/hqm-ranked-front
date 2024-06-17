import { format } from "timeago.js"

export const convertDate = (date: Date) => {
    return format(date)
}

export const convertFullDate = (date: Date) => {
    return new Date(date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
}