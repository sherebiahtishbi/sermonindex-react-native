import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const TopicsScreen = ({ navigation }) => {
    const [topics, setTopics] = useState([]);
    var [filteredTopics, setFilteredTopics] = useState([])

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
            <Input
                placeholder='Search Topic'
                leftIcon={{ type: 'font-awesome', name: 'search' }}
                inputStyle={styles.searchBox}
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
                                    <Icon name='file' size={30} />
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
    topicBox: {
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
    topicTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: '400'
    },
    topicList: {
        padding: 10
    },
    awaiting: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

