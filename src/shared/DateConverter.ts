import { format } from "timeago.js"

export const convertDate = (date: Date) => {
    return format(date)
}