import { useAppDispatch } from "hooks/useAppDispatch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PlayerItem from "shared/PlayerItem";
import { selectStorageUrl, selectStories, setStories } from "stores/season";
import { getStories, likeStory } from "stores/season/async-actions";
import styles from './Stories.module.css'
import { Avatar, Badge, Button, Modal, Skeleton, Tooltip, Typography } from 'antd';
import 'stories-react/dist/index.css';
import Stories from 'stories-react';
import { isMobile } from "react-device-detect";
import ReplayViewer from "./ReplayViewer";
import * as THREE from "three";
import ReplayService from "services/ReplayService";
import { convertDate } from "shared/DateConverter";
import { useNavigate } from "react-router-dom";
import { cloneDeep, orderBy } from "lodash";
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { selectCurrentUser } from "stores/auth";

const { Text, Title } = Typography;

const StoriesComponent = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const stories = useSelector(selectStories);
    const storageUrl = useSelector(selectStorageUrl);
    const currentUser = useSelector(selectCurrentUser);

    const [storiesOpen, setStoriesOpen] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
    const [scene, setScene] = useState<THREE.Scene>();
    const [watchedStories, setWatchedStories] = useState<string[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
    const [startTick, setStartTick] = useState<number>(0);
    const [currentTick, setCurrentTick] = useState<number>(0);
    const [play, setPlay] = useState<boolean>(false);
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getStories());
        ReplayService.getDefaultScene().then((scene) => {
            setScene(scene);
        })
    }, []);

    useEffect(() => {
        if (currentTick === startTick + 296) {
            next();
        }
    }, [currentTick, startTick]);

    useEffect(() => {
        setPlay(false);
        setCurrentTick(0);
        setStartTick(0);
        setLoadingIndex(currentStoryIndex)
    }, [currentStoryIndex, selectedPlayer]);

    useEffect(() => {
        const player = stories.find(x => x.playerId === selectedPlayer);
        let liked = false;
        if (player && currentUser) {
            liked = player.goals[currentStoryIndex].likes.findIndex(x => x.id === currentUser.id) !== -1
        }
        setIsLiked(liked);
    }, [stories, currentStoryIndex, selectedPlayer]);

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

    const onReady = (tick: number, storyId: string) => {
        setStartTick(tick);
        setPlay(true);
        setLoadingIndex(null)

        if (!watchedStories.includes(storyId)) {
            const temp = cloneDeep(watchedStories)
            temp.push(storyId);
            setWatchedStories(temp)
        }
    }

    const likeDislike = (id: string) => {
        if (currentUser) {
            dispatch(likeStory({
                id: id
            }))
            const playerIndex = stories.findIndex(x => x.playerId === selectedPlayer);
            const tempStores = cloneDeep(stories);
            if (isLiked) {
                tempStores[playerIndex].goals[currentStoryIndex].likes = tempStores[playerIndex].goals[currentStoryIndex].likes.filter(x => x.id !== currentUser.id)

                setIsLiked(false);
            } else {
                tempStores[playerIndex].goals[currentStoryIndex].likes.push({
                    id: currentUser.id,
                    name: currentUser.name
                });

                setIsLiked(true);
            }
            setStories(tempStores)
        } else {
            navigate("/login");
        }

    }

    const replayComponent = useMemo(() => {
        const player = stories.find(x => x.playerId === selectedPlayer);
        if (player) {
            return (
                <div>
                    <div className={styles.storyAvatar}>
                        <PlayerItem id={player.playerId} name={player.name} />
                    </div>
                    <div className={styles.storyDate}>
                        <Text type="secondary">{convertDate(player.goals[currentStoryIndex].date)}</Text>
                    </div>
                    <div className={styles.storyActions}>
                        <Button type="text" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" onClick={() => navigate("replay?id=" + player.goals[currentStoryIndex].replayId + "&t=" + (player.goals[currentStoryIndex].packet))}>
                            <g id="Interface / External_Link">
                                <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>} />
                    </div>
                    <div className={styles.storyLike}>
                        <Badge size="small" offset={[-8, 8]} count={player.goals[currentStoryIndex].likes.length}>
                            <Button size="large" type="text" icon={isLiked ? <HeartFilled style={{ color: "#FF7276" }} /> : <HeartOutlined />} onClick={() => likeDislike(player.goals[currentStoryIndex].id)} />
                        </Badge>
                    </div>
                    <ReplayViewer
                        externalId={player.goals[currentStoryIndex].id}
                        externalPlayerName={player.name}
                        pause={!play}
                        onReady={onReady}
                        onTickChanged={setCurrentTick}
                        externalScene={scene}
                    />
                </div>
            );
        }
    }, [stories, currentUser, currentStoryIndex, selectedPlayer, isLiked, play, onReady, setCurrentTick])

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

    const orderedStories = useMemo(() => {
        const os = orderBy(stories, (item) => {
            let unwatchedFound = false;
            item.goals.forEach(story => {
                if (!watchedStories.includes(story.id)) {
                    unwatchedFound = true;
                }
            })

            return !unwatchedFound
        })

        return os
    }, [stories, watchedStories])

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

    const currentPlayer = useMemo(() => {
        return orderedStories.find(x => x.playerId === selectedPlayer)

    }, [selectedPlayer, orderedStories])

    const next = () => {
        const currentIndex = stories.findIndex(x => x.playerId === selectedPlayer);
        if (currentStoryIndex !== stories[currentIndex].goals.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
            if (stories[currentIndex + 1]) {
                setSelectedPlayer(stories[currentIndex + 1].playerId)
                setCurrentStoryIndex(0);
            } else {
                setStoriesOpen(false)
            }
        }
    }

    const prev = () => {
        const currentIndex = stories.findIndex(x => x.playerId === selectedPlayer);
        if (currentStoryIndex !== 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        } else {
            if (stories[currentIndex - 1]) {
                setSelectedPlayer(stories[currentIndex - 1].playerId)
                setCurrentStoryIndex(0);
            }
        }
    }

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
                <div className={styles.storyReplay} style={{ width: size.x, height: size.y }}>
                    {replayComponent}
                    {loadingIndex &&
                        <div className={styles.storyLoading} style={{ width: size.x, height: size.y }}>
                            <Skeleton.Node active style={{ width: size.x, height: size.y }}>
                                <span />
                            </Skeleton.Node>
                        </div>
                    }
                </div>
                <div className={styles.storyReplayOverlay} />
                <div className={styles.storyReplayLeft} onClick={prev} />
                <div className={styles.storyReplayRight} onClick={next} />
                <div className={styles.storyTimeline}>
                    {currentPlayer && currentPlayer.goals.map((goal, index) => {
                        const percent = ((currentTick - startTick) / 296 * 100);
                        const watched = watchedStories.includes(goal.id);
                        let background = "rgba(255, 255, 255, 0.12)";
                        if (loadingIndex === index) {
                            return <Skeleton.Node active className={styles.storyTimelineItemLoading} >
                                <span />
                            </Skeleton.Node>
                        } else if (currentStoryIndex === index) {
                            background = "linear-gradient(90deg, white " + percent + "%, rgba(255, 255, 255, 0.12) " + percent + "%, rgba(255, 255, 255, 0.12) 100%)";
                        } else if (watched) {
                            background = "white"
                        }
                        return <div className={styles.storyTimelineItem} style={{ background: background }} />
                    })}
                </div>
            </Modal>
        </div>
    )
}

export default StoriesComponent;
