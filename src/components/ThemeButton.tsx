import { theme, Button } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { selectTheme, setTheme } from "stores/auth";

const ThemeButton = () => {
    const dispatch = useAppDispatch();

    const theme = useSelector(selectTheme);

    const setThemeAction = () => {
        dispatch(setTheme(theme === "light" ? "dark" : "light"));
    }

    const getThemeButton = () => {
        if (theme === "light") {
            return <svg height="24" width="24">
                <image href="/icons/moon.svg" height="24" width="24" />
            </svg>
        } else {
            return <svg height="24" width="24">
                <image href="/icons/sun.svg" height="24" width="24" />
            </svg>
        }
    }

    return (
        <Button type="text" icon={getThemeButton()} onClick={setThemeAction} />
    )
}

export default ThemeButton;