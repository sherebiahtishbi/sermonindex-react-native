import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SI_ICONS, SI_COLORS } from '../constants/config'

const TopicsScreen = ({ navigation }) => {
    const [topics, setTopics] = useState([]);
    var [filteredTopics, setFilteredTopics] = useState([])

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
            fetch("https://api.sermonindex.net/audio/topic/_sermonindex.json")
                .then(response => response.json())
                .then(json => {
                    // console.log(json)
                    const listdata = Object.entries(json)
                    // console.log(listdata)
                    setTopics(listdata)
                    setFilteredTopics(listdata)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        getData();

    }, [])

    function formatName(name) {
        var words = name.split("_");
        var topicname = '';
        for (var index = 0; index < words.length; index++) {
            topicname += words[index][0].toUpperCase();
            topicname +=
                (words[index].length > 1) ? words[index].substring(1) : ' ';
            topicname += " ";
        }
        return topicname.trimStart();
    }

    return (
        <View style={styles.page}>
            <Text style={styles.infoText}>Tap on the topic to list all the sermons by that topic.</Text>
            <View style={{ backgroundColor: SI_COLORS.color4, borderRadius: 10, marginHorizontal: 10, height: 50 }}>
                <Input
                    placeholder='Search Topic'
                    placeholderTextColor={SI_COLORS.homeIconColor1}
                    leftIcon={{ type: 'font-awesome', name: 'search', color: SI_COLORS.homeIconColor1 }}
                    inputStyle={styles.searchBox}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    onChangeText={text => {
                        if (text.length > 0) {
                            filteredTopics = [];
                            topics.forEach(topic => {
                                if (topic[0].toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                                    filteredTopics.push(topic)
                                }
                            })
                            setFilteredTopics(filteredTopics)
                        } else {
                            setFilteredTopics(topics)
                        }
                    }}
                />
            </View>
            <ScrollView style={styles.topicList}>
                {
                    (filteredTopics != undefined && filteredTopics.length > 0) ?
                        filteredTopics.map((topic, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate(
                                    'Sermons',
                                    { title: formatName(topic[0]), apiUrl: topic[1], sermonCategory: 'Topic' })
                            }}>
                                <View style={styles.topicBox} >
                                    <Icon name={SI_ICONS.topic} size={25} color={SI_COLORS.color4} />
                                    <Text style={styles.topicTitle}> {formatName(topic[0])}</Text>
                                </View>
                            </TouchableOpacity>
                        )) :
                        <View style={styles.awaiting}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>Loading Topics....</Text>
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default TopicsScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: SI_COLORS.backgroundColor2
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
    topicBox: {
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
    topicTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: '400',
        color: SI_COLORS.color2
    },
    topicList: {
        padding: 10
    },
    awaiting: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

