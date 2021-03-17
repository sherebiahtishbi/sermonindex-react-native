import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const SpeakersScreen = ({ navigation }) => {
    const [speakers, setSpeakers] = useState([]);
    var [filterdSpeakers, setFilterdSpeakers] = useState([])

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
            <Text style={styles.infoText}>Tap on the speaker to list all the sermons by that speaker.</Text>
            <Input
                placeholder='Search Speaker'
                leftIcon={{ type: 'font-awesome', name: 'search' }}
                inputStyle={styles.searchBox}
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
                                    <Icon name='user' size={30} />
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
    speakerShadow: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5
    },
    speakerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
        marginTop: 3,
        padding: 10,
        borderWidth: .4,
        // borderColor: 'black',
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

