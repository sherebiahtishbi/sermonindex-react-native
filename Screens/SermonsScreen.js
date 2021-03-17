import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

const SermonsScreen = ({ navigation, route }) => {
    const [sermons, setSermons] = useState({});
    var [filterdSermons, setFilterdSermons] = useState({})
    var [speakerInfo, setSpeakerInfo] = useState({})

    useEffect(() => {
        async function getData() {
            var url = ''
            var url = 'http://api.sermonindex.net/audio' + route.params.apiUrl
            console.log(url)
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    setSermons(json.sermons)
                    setFilterdSermons(json.sermons)
                    if (route.params.sermonCategory == 'Speaker') {
                        setSpeakerInfo({
                            speakerName: json.name,
                            speakerImage: (json.image != '') ? "https://api.sermonindex.net/audio" + json.image : '',
                            speakerBio: json.description
                        })
                        console.log('SpeakerInfo', speakerInfo.speakerImage)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        getData();

    }, [])

    const getSpeakerImageUrl = async (speakername) => {
        var imageurl = "https://api.sermonindex.net/audio/images/"
        // console.log('Speakername > ', speakername.toString().toLowerCase().replace(/ /g, "_").replace(/\./g, ''))
        imageurl += speakername.toString().toLowerCase().replace(/ /g, "_").replace(/\./g, '') + ".gif"
        console.log('Image Url > ', imageurl)
        return imageurl;
    }

    return (
        <View style={styles.page}>
            <Text style={styles.infoText}>Tap on the sermon to play the Sermon.</Text>
            <Input
                placeholder='Search Sermon'
                leftIcon={{ type: 'font-awesome', name: 'search' }}
                inputStyle={styles.searchBox}
                onChangeText={text => {
                    if (text.length > 0) {
                        filterdSermons = [];
                        sermons.forEach(sermon => {
                            if (sermon.title.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                                if (sermon.format.toLowerCase() == 'mp3') {
                                    filterdSermons.push(sermon)
                                }
                            }
                        })
                        setFilterdSermons(filterdSermons)
                    } else {
                        setFilterdSermons(sermons)
                    }
                }}
            />
            <ScrollView style={styles.speakerList}>
                {
                    (filterdSermons != undefined && filterdSermons.length > 0) ?
                        filterdSermons.map((sermon, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                if (route.params.sermonCategory != 'Speaker') {
                                    getSpeakerImageUrl(sermon.speaker_name)
                                        .then(url => {
                                            console.log('SpeakerInfo > \n', url)
                                            navigation.navigate('Player',
                                                {
                                                    title: sermon.title,
                                                    sermon: sermon,
                                                    speaker: {
                                                        speakerName: sermon.speaker_name,
                                                        speakerImage: url,
                                                        speakerBio: ""
                                                    },
                                                }
                                            )
                                        })
                                        .catch(err => console.log(err))
                                } else {
                                    navigation.navigate('Player',
                                        {
                                            title: sermon.title,
                                            sermon: sermon,
                                            speaker: speakerInfo,
                                        }
                                    )

                                }
                            }}>
                                <View style={styles.sermonBox} >
                                    <Icon name='play-circle' size={30} />
                                    <Text style={styles.speakerTitle}>{sermon.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )) :
                        <View style={styles.awaiting}>
                            <Text style={{ fontSize: 20, fontWeight: '600', flex: .8 }}>Loading Sermons....</Text>
                        </View>
                }
            </ScrollView>
        </View >
    )
}

export default SermonsScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#71702b'
    },
    searchBox: {
        color: 'black',
    },
    infoText: {
        fontSize: 16,
        fontWeight: '400',
        alignSelf: 'center',
        padding: 10
    },
    sermonBox: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        height: 75,
        marginBottom: 5,
        paddingLeft: 15,
        borderWidth: .4,
        borderRadius: 5,
        backgroundColor: '#646400',
    },
    speakerTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: '400'
    },
    speakerList: {
        padding: 10
    },
    awaiting: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})
