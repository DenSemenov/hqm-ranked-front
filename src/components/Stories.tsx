import { useAppDispatch } from "hooks/useAppDispatch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PlayerItem from "shared/PlayerItem";
import { selectStorageUrl, selectStories } from "stores/season";
import { getStories } from "stores/season/async-actions";
import styles from './Stories.module.css'
import { Avatar, Modal, Tooltip } from 'antd';
import 'stories-react/dist/index.css';
import Stories from 'stories-react';
import { isMobile } from "react-device-detect";
import ReplayViewer from "./ReplayViewer";
import * as THREE from "three";
import ReplayService from "services/ReplayService";

const StoriesComponent = () => {
    const dispatch = useAppDispatch();

    const stories = useSelector(selectStories);
    const storageUrl = useSelector(selectStorageUrl);

    const [storiesOpen, setStoriesOpen] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
    const [scene, setScene] = useState<THREE.Scene>();

    useEffect(() => {
        dispatch(getStories());
        ReplayService.getDefaultScene().then((scene) => {
            setScene(scene);
        })
    }, []);


    const getAvatarName = (name: string) => {
        return name[0].toUpperCase()
    }

    const openStories = (playerId: number) => {
        setSelectedPlayer(playerId);
        setStoriesOpen(true);
    }

    const replayComponent = (props: any) => {
        const player = stories.find(x => x.playerId === selectedPlayer);
        if (player) {
            return (
                <div>
                    <div className={styles.storyAvatar}>
                        <PlayerItem id={player.playerId} name={player.name} />
                    </div>
                    <ReplayViewer
                        externalId={player.goalIds[props.story.index]}
                        onReady={() => props.resume()}
                        onStart={() => props.pause()}
                        pause={props.isPaused}
                        externalScene={scene}
                    />
                </div>
            );
        }
    }

    const currentStores = useMemo(() => {
        const player = stories.find(x => x.playerId === selectedPlayer);
        if (player) {
            return player.goalIds.map(goalId => {
                return {
                    type: "component",
                    duration: 6000,
                    component: (props: any) => replayComponent(props)
                }
            })
        }
    }, [selectedPlayer])

    const size = useMemo(() => {
        if (isMobile) {
            return {
                x: document.body.clientWidth,
                y: document.body.clientHeight
            }
        } else {
            return {
                x: 450,
                y: 700
            }
        }
    }, [isMobile])

    const nextPlayerStory = () => {
        const currentIndex = stories.findIndex(x => x.playerId === selectedPlayer);
        if (currentIndex !== stories.length - 1) {
            setSelectedPlayer(stories[currentIndex + 1].playerId)
        } else {
            setStoriesOpen(false)
        }
    }

    const onChangeStory = (index: number) => {
        const player = stories.find(x => x.playerId === selectedPlayer);
        const nextEl = document.querySelectorAll('[class^="Actions-styles_right"]')[0];
        if (nextEl && player && player.goalIds.length - 1 === index) {
            nextEl.addEventListener("click", () => {
                nextPlayerStory();
            })
        }
    }

    return (
        <div className={styles.storyContainer}>
            {stories.map(x => {
                return <Tooltip title={isMobile ? "" : x.name} >
                    <div className={styles.storyAvatarContainer} onClick={() => openStories(x.playerId)}>
                        <Avatar size={44} src={storageUrl + "images/" + x.playerId + ".png"}>{getAvatarName(x.name)}</Avatar>
                    </div>
                </Tooltip>
            })}
            <Modal
                style={isMobile ? { top: 0 } : undefined}
                wrapClassName={isMobile ? "mobile-modal-without-background" : "modal-without-background"}
                open={storiesOpen}
                width={size.x}
                onCancel={() => setStoriesOpen(false)}
                footer={[]}>
                <Stories
                    width={size.x + "px"}
                    height={size.y + "px"}
                    isPaused={true}
                    stories={currentStores}
                    onStoriesStart={(index: number) => onChangeStory(index)}
                    onAllStoriesEnd={nextPlayerStory}
                />
            </Modal>
        </div>
    )
}

export default StoriesComponent;
