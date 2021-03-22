import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SI_ICONS, SI_COLORS } from '../constants/config'


const SpeakersScreen = ({ navigation }) => {
    const [speakers, setSpeakers] = useState([]);
    var [filterdSpeakers, setFilterdSpeakers] = useState([])

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
        async function getData() {
            fetch("http://api.sermonindex.net/audio/speaker/_sermonindex.json")
                .then(response => response.json())
                .then(json => {
                    // console.log(json)
                    const listdata = Object.entries(json)
                    // console.log(listdata)
                    setSpeakers(listdata)
                    setFilterdSpeakers(listdata)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        getData();

    }, [])

    function formatName(name) {
        var words = name.split("_");
        var speakername = '';
        for (var index = 0; index < words.length; index++) {
            speakername += words[index][0].toUpperCase();
            speakername +=
                (words[index].length > 1) ? words[index].substring(1) : ' ';
            speakername += " ";
        }
        return speakername.trimStart();
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor={SI_COLORS.backgroundColor2} />
            {/* <Text style={styles.infoText}>Tap on the speaker to list all the sermons by that speaker.</Text> */}
            <View style={{ backgroundColor: SI_COLORS.color4, borderRadius: 10, marginHorizontal: 10, height: 50 }}>
                <Input
                    placeholder='Search Speaker'
                    placeholderTextColor={SI_COLORS.homeIconColor1}
                    leftIcon={{ type: 'font-awesome', name: 'search', color: SI_COLORS.homeIconColor1 }}
                    inputStyle={styles.searchBox}
                    inputContainerStyle={{ borderBottomWidth: 0, }}
                    onChangeText={text => {
                        if (text.length > 0) {
                            filterdSpeakers = [];
                            speakers.forEach(speaker => {
                                if (speaker[0].toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                                    if (speaker[0].indexOf('book') < 0) {
                                        filterdSpeakers.push(speaker)
                                    }
                                }
                            })
                            setFilterdSpeakers(filterdSpeakers)
                        } else {
                            setFilterdSpeakers(speakers)
                        }
                    }}
                />
            </View>
            <ScrollView style={styles.speakerList}>
                {
                    (filterdSpeakers != undefined && filterdSpeakers.length > 0) ?
                        filterdSpeakers.map((speaker, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate(
                                    'Sermons',
                                    { title: formatName(speaker[0]), apiUrl: speaker[1], sermonCategory: 'Speaker' })
                            }}>
                                <View style={styles.speakerBox} >
                                    <Icon name={SI_ICONS.speaker} size={25} color={SI_COLORS.color4} />
                                    <Text style={styles.speakerTitle}> {formatName(speaker[0])}</Text>
                                </View>
                            </TouchableOpacity>
                        )) :
                        <View style={styles.awaiting}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>Loading Speakers....</Text>
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default SpeakersScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        // backgroundColor: '#71702b'
        backgroundColor: SI_COLORS.backgroundColor2
    },
    searchBox: {
        color: SI_COLORS.homeIconColor1,
        borderBottomWidth: 0,
    },
    infoText: {
        fontSize: 16,
        fontWeight: '400',
        alignSelf: 'center',
        padding: 10
    },
    speakerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        padding: 10,
        borderTopWidth: .1,
        borderBottomWidth: .6,
        borderRightWidth: .3,
        borderRadius: 10,
        borderColor: SI_COLORS.color4,
        backgroundColor: SI_COLORS.backgroundColor2,
        flex: 1
    },
    speakerTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: 20,
        fontSize: 18,
        fontWeight: '400',
        color: SI_COLORS.color2
    },
    speakerList: {
        padding: 10
    },
    awaiting: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

