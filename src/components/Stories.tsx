import { useAppDispatch } from "hooks/useAppDispatch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PlayerItem from "shared/PlayerItem";
import { selectStorageUrl, selectStories } from "stores/season";
import { getStories } from "stores/season/async-actions";
import styles from './Stories.module.css'
import { Avatar, Button, Modal, Tooltip, Typography } from 'antd';
import 'stories-react/dist/index.css';
import Stories from 'stories-react';
import { isMobile } from "react-device-detect";
import ReplayViewer from "./ReplayViewer";
import * as THREE from "three";
import ReplayService from "services/ReplayService";
import { convertDate } from "shared/DateConverter";
import { EnterOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { cloneDeep, orderBy } from "lodash";
import { IStoryResponse } from "models/IStoryResponse";

const { Text, Title } = Typography;

const StoriesComponent = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const stories = useSelector(selectStories);
    const storageUrl = useSelector(selectStorageUrl);

    const [storiesOpen, setStoriesOpen] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
    const [scene, setScene] = useState<THREE.Scene>();
    const [clickedBefore, setClickedBefore] = useState<boolean>(false);
    const [watchedStories, setWatchedStories] = useState<string[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);

    useEffect(() => {
        dispatch(getStories());
        ReplayService.getDefaultScene().then((scene) => {
            setScene(scene);
        })
    }, []);

    useEffect(() => {
        if (watchedStories.length !== 0) {
            localStorage.setItem("watchedStories", JSON.stringify(watchedStories))
        }
    }, [watchedStories]);

    useEffect(() => {
        const watched = localStorage.getItem("watchedStories")
        if (watched) {
            const allStoresIds: string[] = [];

            stories.forEach(story => {
                allStoresIds.push(...story.goals.map(x => x.id));
            })

            let watchedTemp = JSON.parse(watched) as string[];
            watchedTemp = watchedTemp.filter(x => allStoresIds.includes(x))
            setWatchedStories(watchedTemp)
        }
    }, [stories]);


    const getAvatarName = (name: string) => {
        return name[0].toUpperCase()
    }

    const openStories = (playerId: number) => {
        setSelectedPlayer(playerId);

        const player = stories.find(x => x.playerId === playerId);
        if (player) {
            let found = false;
            player.goals.forEach((story, index) => {
                if (!watchedStories.includes(story.id) && !found) {
                    setCurrentStoryIndex(index);
                    found = true;
                }
            })

            const storyId = player.goals[0].id;
            if (!watchedStories.includes(storyId)) {
                const temp = cloneDeep(watchedStories)
                temp.push(storyId);
                setWatchedStories(temp)
            }
        }

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
                    <div className={styles.storyDate}>
                        <Text type="secondary">{convertDate(player.goals[props.story.index].date)}</Text>
                    </div>
                    <div className={styles.storyActions}>
                        <Button type="text" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" onClick={() => navigate("replay?id=" + player.goals[props.story.index].replayId + "&t=" + (player.goals[props.story.index].packet))}>
                            <g id="Interface / External_Link">
                                <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>} />
                    </div>
                    <ReplayViewer
                        externalId={player.goals[props.story.index].id}
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
            return player.goals.map(goalId => {
                return {
                    type: "component",
                    duration: 6500,
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
            let found = false;
            stories[currentIndex + 1].goals.forEach((story, index) => {
                if (!watchedStories.includes(story.id) && !found) {
                    setCurrentStoryIndex(index);
                    found = true;
                }
            })

            setSelectedPlayer(stories[currentIndex + 1].playerId)
        } else {
            setStoriesOpen(false)
        }
        setClickedBefore(false);
    }

    const onChangeStory = (index: number) => {
        setCurrentStoryIndex(index);

        const player = stories.find(x => x.playerId === selectedPlayer);
        if (player && index) {
            const storyId = player.goals[index].id;
            if (!watchedStories.includes(storyId)) {
                const temp = cloneDeep(watchedStories)
                temp.push(storyId);
                setWatchedStories(temp)
            }
        }

        const nextEl = document.querySelectorAll('[class^="Actions-styles_right"]')[0];
        if (nextEl && player && player.goals.length - 1 === index) {
            nextEl.addEventListener("click", () => {
                if (!clickedBefore) {
                    setClickedBefore(true);
                } else {
                    nextPlayerStory();
                }
            })
        }
    }

    const storesComponent = useMemo(() => {
        const orderedStories = orderBy(stories, (item) => {
            let unwatchedFound = false;
            item.goals.forEach(story => {
                if (!watchedStories.includes(story.id)) {
                    unwatchedFound = true;
                }
            })

            return !unwatchedFound
        })

        return <>
            {orderedStories.map(x => {
                let unwatchedFound = false;
                x.goals.forEach(story => {
                    if (!watchedStories.includes(story.id)) {
                        unwatchedFound = true;
                    }
                })

                return <Tooltip title={isMobile ? "" : x.name} >
                    <div className={unwatchedFound ? styles.storyAvatarContainer : styles.storyAvatarContainerWatched} onClick={() => openStories(x.playerId)}>
                        <Avatar size={44} src={storageUrl + "images/" + x.playerId + ".png"}>{getAvatarName(x.name)}</Avatar>
                    </div>
                </Tooltip>
            })}
        </>

    }, [stories, watchedStories])

    return (
        <div className={styles.storyContainer}>
            {storesComponent}
            <Modal
                style={isMobile ? { top: 0 } : undefined}
                wrapClassName={isMobile ? "mobile-modal-without-background" : "modal-without-background"}
                open={storiesOpen}
                width={size.x}
                onCancel={() => setStoriesOpen(false)}
                footer={[]}
            >
                <Stories
                    width={size.x + "px"}
                    height={size.y + "px"}
                    isPaused={true}
                    currentIndex={currentStoryIndex}
                    stories={currentStores}
                    onStoryChange={onChangeStory}
                    onAllStoriesEnd={nextPlayerStory}
                />
            </Modal>
        </div>
    )
}

export default StoriesComponent;
