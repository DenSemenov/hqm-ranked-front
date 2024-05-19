import { isMobile } from "react-device-detect"
import { theme as AntdTheme } from 'antd';
export const getTheme = (dark: boolean) => {
    return {
        token: {
            sizeStep: 4,
            fontSize: 14,
            borderRadius: 8,
            wireframe: false,
        },
        components: {
            Table: {
                borderRadius: 0,
                headerBorderRadius: 0,
            },
            Card: {
                borderRadius: isMobile ? 0 : 8,
                borderRadiusOuter: isMobile ? 0 : 8,
                borderRadiusSM: isMobile ? 0 : 8,
                borderRadiusXS: isMobile ? 0 : 8,
                borderRadiusLG: isMobile ? 0 : 8,
            },
            Button: {
                colorBorder: "transparent",
                boxShadow: "none"
            },
            Select: {
                colorBorder: "transparent"
            },
            Input: {
                colorBorder: "transparent"
            },
        },
        algorithm: [(dark ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm), AntdTheme.compactAlgorithm],
    }
}