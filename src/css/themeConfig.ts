import { isMobile } from "react-device-detect"
import { theme as AntdTheme, ThemeConfig } from 'antd';
export const getTheme = (dark: boolean) => {
    return {
        token: {
            sizeStep: 4,
            fontSize: 14,
            borderRadius: 16,
            boxShadow: "4px 4px 8px 0px rgba(34, 60, 80, 0.2)",
            fontFamily: "custom-font"
        },
        components: {
            Avatar: {
                borderRadius: 0
            },
            Card: {
                colorBorder: "transparent"
            }
        },
        algorithm: [(dark ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm)],
    } as ThemeConfig
}