import { isMobile } from "react-device-detect"
import { theme as AntdTheme, ThemeConfig } from 'antd';
export const getTheme = (dark: boolean) => {
    return {
        token: {
            sizeStep: 4,
            fontSize: 14,
            borderRadius: 12,
            boxShadow: "4px 4px 8px 0px rgba(34, 60, 80, 0.2)",
            fontFamily: "custom-font",
            colorPrimary: "#17B486",
        },
        components: {
            Avatar: {
                borderRadius: 0
            },
            Card: {
                colorBorder: "transparent",
            },
            Popover: {
                colorBgMask: "rgba(17, 25, 40, 0.75)",
            },
            Tag: {
                colorBorder: "1px solid rgba(255, 255, 255, 0.125)"
            },
        },
        algorithm: [(dark ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm)],
    } as ThemeConfig
}