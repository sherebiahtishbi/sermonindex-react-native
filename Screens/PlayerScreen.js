import React, {
    useState,
    useEffect,
    useLayoutEffect
} from 'react'

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    Modal
} from 'react-native'

import Slider from '@react-native-community/slider';

import {
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native-gesture-handler';

import {
    SI_ICONS,
    SI_COLORS,
    SI_DEVICE
} from '../constants/config'

import Icon from 'react-native-vector-icons/FontAwesome';

import TrackPlayer, {
    TrackPlayerEvents,
    useTrackPlayerEvents,
    useTrackPlayerProgress
} from 'react-native-track-player';
import { Button } from 'react-native';

const PlayerScreen = ({ navigation, route }) => {
    const [playerState, setPlayerState] = useState(null)
    const [speakerImage, setSpeakerImage] = useState('')
    const [infoVisible, setInfoVisible] = useState(false)
    const { position, bufferedPosition, duration } = useTrackPlayerProgress(500, [TrackPlayer.STATE_PLAYING])

    const events = [
        TrackPlayerEvents.PLAYBACK_STATE,
        TrackPlayerEvents.PLAYBACK_ERROR,
        TrackPlayerEvents.PLAYBACK_METADATA_RECEIVED,
    ];

    useTrackPlayerEvents(events, (event) => {
        if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
            console.warn('An error occured while playing the current track.');
        }
        if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
            setPlayerState(event.state);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity
                        style={{ paddingRight: 10, backgroundColor: '#fff01', marginRight: 20 }}
                        onPress={() => navigation.navigate("Home")}>
                        <Icon name={SI_ICONS.home} size={25} color={SI_COLORS.color2} />
                    </TouchableOpacity>
                )
            }
        })
    }, [navigation])

    useEffect(() => {
        TrackPlayer.setupPlayer().then(() => {
            console.log('Player is ready!')
            if (TrackPlayer.getState() == TrackPlayer.STATE_PLAYING) {
                TrackPlayer.stop()
            }
            fetch(route.params.sermon.url, { redirect: 'error' })
                .then(async (res) => {
                    var url = res.url.toString().replace('dl=0', 'dl=1')
                    console.log('Final Url >\n', url)
                    var track = {
                        id: 'current',
                        url: url,
                        title: 'None',
                        artist: 'None'
                    }
                    TrackPlayer.add([track])
                    playStopAudio()
                })
            var speakerimage = (route.params.speaker != undefined) ? route.params.speaker.speakerImage : ""
            fetch(speakerimage, { redirect: 'error' }).then(res => {
                console.log('fetched image > ', res.url.toString())
                res.url.toString().indexOf('github') > 0 ? setSpeakerImage('') : setSpeakerImage(speakerimage)
            }).catch(err => {
                console.log('error fetching image > ', err)
                setSpeakerImage(speakerimage)
            })
        });
        return () => {
            TrackPlayer.destroy()
        }
    }, [])

    const playStopAudio = async () => {
        if (playerState === TrackPlayer.STATE_PLAYING) {
            TrackPlayer.pause()
            console.log('Paused')
        } else {
            TrackPlayer.play()
            console.log('Now Playing')
        }
    }

    const stopAudio = () => { TrackPlayer.stop() }
    const pauseAudio = () => { TrackPlayer.pause() }

    const seekAudio = (value) => {
        console.log('value')
        TrackPlayer.seekTo(value)
    }

    const SpeakerName = () => {
        var speakername = (route.params.speaker != null) ? route.params.speaker.speakerName : ""
        if (speakername != null && speakername != "") {
            return <Text style={styles.speakerTitle}>{speakername}</Text>
        } else {
            return <Text style={styles.speakerTitle}>Now Playing</Text>
        }
    }

    const SpeakerImage = () => {
        if (speakerImage != undefined && speakerImage != "") {
            return <Image
                source={{ uri: speakerImage }}
                style={{ height: 100, width: 100, marginVertical: 20 }}
                defaultSource={require('../assets/sermonindex.jpg')} />
        } else {
            return <Image source={require('../assets/sermonindex.jpg')} style={{ height: 150, width: 150 }} />
        }

    }

    const SermonDescription = () => {
        if (route.params.sermon.description != null && route.params.sermon.description != "") {
            return (
                <Text style={{ fontSize: 16, color: SI_COLORS.color2 }}>{route.params.sermon.description}</Text>
            )
        } else {
            return (
                <Text style={{ fontSize: 16, color: SI_COLORS.color2 }}>
                    Sermon decription not available
                </Text>
            )
        }
    }

    const SermonTitle = () => {
        var titles = route.params.sermon.title.split(')')
        console.log(titles.length)
        if (titles.length == 1) {
            return (<Text style={[styles.sermonTitle]}>{titles[0]}</Text>)
        } else {
            return (
                <View>
                    <Text style={[styles.sermonTitle]}>{titles[0] + ')'}</Text>
                    <Text style={[styles.sermonTitle]}>{titles[1]}</Text>
                </View>
            )
        }
    }

    const PlayIcon = () => {
        switch (playerState) {
            case TrackPlayer.STATE_PLAYING:
                return (<Icon name={SI_ICONS.pause} size={50} color={SI_COLORS.color2} />)
            case TrackPlayer.STATE_PAUSED:
                return (<Icon name={SI_ICONS.play} size={50} color={SI_COLORS.color2} />)
            default:
                return <ActivityIndicator size="large" color="black" />
        }
    }

    const CategoryIcon = () => {
        switch (route.params.mainCategory) {
            case 'Speaker':
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('Speakers')}>
                        <Icon name={SI_ICONS.speaker} size={25} color={SI_COLORS.color2} />
                    </TouchableOpacity>
                )
            case 'Topic':

                return (
                    <TouchableOpacity onPress={() => navigation.navigate('Topics')}>
                        <Icon name={SI_ICONS.topic} size={25} color={SI_COLORS.color2} />
                    </TouchableOpacity>
                )
            case 'Scripture':
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('Scriptures')}>
                        <Icon name={SI_ICONS.scripture} size={25} color={SI_COLORS.color2} />
                    </TouchableOpacity>
                )
            default:
                return (
                    <Icon name={SI_ICONS.speaker} size={30} color={SI_COLORS.color2} />
                )
        }
    }

    const ProgressBar = () => {
        return (
            <View style={styles.progressBarContainer}>
                <Text style={styles.durationText}>{formatTime(position)}</Text>
                <Slider
                    style={styles.slider}
                    maximumValue={0}
                    value={position}
                    maximumValue={duration}
                    minimumTrackTintColor={SI_COLORS.minTrackTintColor}
                    maximumTrackTintColor={SI_COLORS.maxTrackTintColor}
                    thumbTintColor={SI_COLORS.thumbTintColor}
                    onSlidingComplete={(value) => seekAudio(value)}
                />
                <Text style={styles.durationText}>{formatTime(duration)}</Text>
            </View>
        )
    }

    function formatTime(duration) {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor={SI_COLORS.backgroundColor2} />
            <SpeakerName />
            <SermonTitle />
            <SpeakerImage />
            <Text
                style={{ color: SI_COLORS.color2, paddingHorizontal: 10, fontSize: 16 }}>
                {route.params.sermon.topic}
            </Text>
            <Text
                style={{ color: SI_COLORS.color2, paddingHorizontal: 10, fontSize: 16 }}>
                {route.params.sermon.scripture}
            </Text>
            <ProgressBar />
            <View style={styles.playerControl}>
                <CategoryIcon />
                <TouchableOpacity onPress={playStopAudio}>
                    <PlayIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setInfoVisible(true) }}>
                    <Icon name={SI_ICONS.info} size={30} color={SI_COLORS.color2} />
                </TouchableOpacity>
            </View>
            <Modal
                animationType='slide'
                visible={infoVisible}
                transparent={true}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        height: SI_DEVICE.height - 200,
                        width: SI_DEVICE.width - 100,
                        backgroundColor: SI_COLORS.backgroundColor2,
                        borderRadius: 15,
                        alignItems: 'center',
                        padding: 20,
                        borderWidth: 1,
                        borderColor: SI_COLORS.color3,
                        borderRadius: 10,
                        elevation: 8
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: '400', color: SI_COLORS.color2 }}>Sermon Description</Text>
                        <ScrollView
                            style={{ flex: 1, marginVertical: 10 }}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            <SermonDescription />
                        </ScrollView>
                        <Button onPress={() => setInfoVisible(false)} title='x' color={SI_COLORS.color1} />
                    </View>
                </View>
            </Modal>
        </View >
    )
}

export default PlayerScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: SI_COLORS.backgroundColor2,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBox: {
        color: 'black',
    },
    sermonTitle: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 20,
        color: SI_COLORS.color2
    },
    speakerTitle: {
        fontSize: 18,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
        color: SI_COLORS.color2
    },
    noDesc: {
        alignItems: 'center',
        justifyContent: 'center',
        color: SI_COLORS.color2
    },
    emptyDesc: {
        fontSize: 24,
        fontWeight: '400',
        color: SI_COLORS.color2
    },
    sermonDesc: {
        alignItems: 'center',
        // justifyContent: 'center',
        height: 100,
        marginTop: 3,
        padding: 10,
        color: SI_COLORS.color2
    },
    slider: {
        flex: 3,
        // transform: [{scaleX: 1.5 }, { scaleY: 1.5 }]
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'space-around',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 50,
    },
    durationText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        color: SI_COLORS.color2
    },
    playerControl: {
        flex: 1,
        marginTop: 5,
        width: SI_DEVICE.width,
        paddingHorizontal: 40,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
})
