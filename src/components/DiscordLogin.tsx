import { useAppDispatch } from "hooks/useAppDispatch";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser, loginWithDiscord, setDiscordByToken } from "stores/auth/async-actions";
import { useSelector } from "react-redux";
import { selectIsAuth } from "stores/auth";

const DiscordLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        const token = window.location.hash.split('&').find(x => x.startsWith("access_token"))
        if (token) {
            const parsedToken = token.replace("access_token=", "");
            if (isAuth) {
                dispatch(setDiscordByToken({
                    token: parsedToken
                })).unwrap().then(() => {
                    dispatch(getCurrentUser());
                    navigate("/profile")
                })
            }
            else {
                dispatch(loginWithDiscord({
                    token: parsedToken
                }))
            }
        }
    }, [isAuth])

    return (
        <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LoadingOutlined style={{ fontSize: 64 }} />
        </div>
    )
}

export default DiscordLogin;