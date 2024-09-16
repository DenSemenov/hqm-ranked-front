import { format } from "timeago.js"

export const convertDate = (date: Date) => {
    return format(date)
}

export const convertFullDate = (date: Date) => {
    return new Date(date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
}

export const convertFullDateWithDate = (date: Date) => {
    return new Date(date).toLocaleDateString(navigator.language, { hour: '2-digit', minute: '2-digit' });
}

export const getWeekEnd = () => {
    const dateObj = new Date();
    const day = dateObj.getDay();
    const diff = 7 - day;
    const neDate = new Date();
    neDate.setDate(dateObj.getDate() + diff);
    return neDate;
}