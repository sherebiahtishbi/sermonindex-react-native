import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { Slider } from 'react-native-elements';

import Icon from 'react-native-vector-icons/AntDesign';
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress } from 'react-native-track-player';

const PlayerScreen = ({ navigation, route }) => {
    const [playerState, setPlayerState] = useState(null)
    const [playLength, setPlayLength] = useState(0)
    const [currentPos, setCurrentPos] = useState(0)
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
        if (event.type === TrackPlayerEvents.PLAYBACK_METADATA_RECEIVED) {
            TrackPlayer.getDuration().then(res => {
                console.log('Duration', res)
                setPlayLength(res)
            })
        }
    });

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

    const SpeakerName = () => {
        var speakername = (route.params.speaker != null) ? route.params.speaker.speakerName : ""
        if (speakername != null && speakername != "") {
            return <Text style={styles.speakerTitle}>{speakername}</Text>
        } else {
            return <Text style={styles.speakerTitle}>Now Playing</Text>
        }
    }

    const SpeakerImage = () => {
        var speakerimage = (route.params.speaker != undefined) ? route.params.speaker.speakerImage : ""
        console.log('Speaker Image > ', speakerimage)
        if (speakerimage != undefined && speakerimage != "") {
            return <Image
                source={{ uri: route.params.speaker.speakerImage }}
                style={{ height: 100, width: 100, marginVertical: 20 }}
                defaultSource={require('../assets/sermonindex.jpg')} />
        } else {
            return <Image source={require('../assets/sermonindex.jpg')} style={{ height: 150, width: 150 }} />
        }
    }

    const SermonDescription = ({ sermon }) => {
        if (sermon.description != null && sermon.description != "") {
            return (
                <View style={styles.sermonDesc}>
                    <Text>{route.params.sermon.description}</Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.sermonDesc, styles.noDesc]}>
                    <Text style={styles.emptyDesc}>Sermon description not available</Text>
                </View>
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
        if (playerState === TrackPlayer.STATE_PLAYING) {
            return (<Icon name='pausecircleo' size={60} />)
        } else {
            return (<Icon name='playcircleo' size={60} />)
        }
    }


    const ProgressBar = () => {
        // setCurrentPos(position)
        return (
            <View style={styles.sliderContainer}>
                <Text style={styles.durationText}>{formatTime(position)}</Text>
                <Slider
                    style={styles.slider}
                    maximumValue={0}
                    value={position}
                    maximumValue={duration}
                    minimumTrackTintColor='#343434'
                    maximumTrackTintColor='#a2a2a2'
                    thumbTintColor='#343434' />
                <Text style={styles.durationText}>{formatTime(duration)}</Text>
            </View>
        )
    }

    function formatTime(duration) {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
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
            <SpeakerName />
            <SermonTitle />
            <SpeakerImage />
            <Text>{route.params.sermon.topic}</Text>
            <Text>{route.params.sermon.scripture}</Text>
            <SermonDescription sermon={route.params.sermon} />
            <ProgressBar />
            <View style={styles.playerControl}>
                <TouchableOpacity onPress={playStopAudio}>
                    <PlayIcon />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PlayerScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#71702b',
        alignItems: 'center',
        paddingTop: 30
    },
    searchBox: {
        color: 'black',
    },
    sermonTitle: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    speakerTitle: {
        fontSize: 18,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 10
    },
    noDesc: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyDesc: {
        fontSize: 24,
        fontWeight: '400'
    },
    sermonDesc: {
        alignItems: 'center',
        textAlign: 'center',
        flex: 3,
        width: '95%',
        marginTop: 3,
        padding: 10,
        // backgroundColor: '#74732c',
    },
    slider: {
        flex: 3,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'space-around',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 50,
    },
    durationText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center'
    },
    playerControl: {
        flex: 2,
        alignContent: 'center',
        justifyContent: 'center'
    }
})
