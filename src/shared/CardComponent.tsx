import { useMemo } from 'react';
import styles from './CardComponent.module.css'

export enum EdgeType {
    LeftTop,
    RightTop,
    LeftBottom,
    RightBottom
}

interface IProps {
    children?: React.ReactNode;
    edges?: EdgeType[];
}

const CardComponent = (props: IProps) => {
    const classes = useMemo(() => {
        let classesString = "";

        if (props.edges) {
            if (props.edges.includes(EdgeType.LeftTop)) {
                classesString += styles.leftTop + " ";
            }
            if (props.edges.includes(EdgeType.LeftBottom)) {
                classesString += styles.leftBottom + " ";
            }
            if (props.edges.includes(EdgeType.RightTop)) {
                classesString += styles.rightTop + " ";
            }
            if (props.edges.includes(EdgeType.RightBottom)) {
                classesString += styles.rightBottom + " ";
            }
        }

        return classesString;
    }, [props.edges]);

    return (
        <>
            <div className={styles.content + " " + classes}>{props.children}</div>
        </>
    )
}

export default CardComponent;