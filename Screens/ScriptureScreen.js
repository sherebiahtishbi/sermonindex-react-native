import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const ScriptureScreen = ({ navigation }) => {
    const [scriptures, setScriptures] = useState([]);
    var [filteredScripture, setFilteredScripture] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity
                        style={{ paddingRight: 10, backgroundColor: '#fff01' }}
                        onPress={() => navigation.navigate("Home")}>
                        <Icon name='home' size={25} />
                    </TouchableOpacity>
                )
            }
        })
    }, [navigation])

    useEffect(() => {
        async function getData() {
            fetch("http://api.sermonindex.net/audio/scripture/_sermonindex.json")
                .then(response => response.json())
                .then(json => {
                    // console.log(json)
                    const listdata = Object.entries(json)
                    // console.log(listdata)
                    setScriptures(listdata)
                    setFilteredScripture(listdata)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        getData();

    }, [])

    function formatName(name) {
        var words = name.split("_");
        var scripture = '';
        for (var index = 0; index < words.length; index++) {
            scripture += words[index][0].toUpperCase();
            scripture +=
                (words[index].length > 1) ? words[index].substring(1) : ' ';
            scripture += " ";
        }
        return scripture.trimStart();
    }

    return (
        <View style={styles.page}>
            <Text style={styles.infoText}>Tap on the scripture to list all the sermons by that scripture.</Text>
            <Input
                placeholder='Search Scripture'
                leftIcon={{ type: 'font-awesome', name: 'search' }}
                inputStyle={styles.searchBox}
                onChangeText={text => {
                    if (text.length > 0) {
                        filteredScripture = [];
                        scriptures.forEach(scripture => {
                            if (scripture[0].toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                                filteredScripture.push(scripture)
                            }
                        })
                        setFilteredScripture(filteredScripture)
                    } else {
                        setFilteredScripture(scriptures)
                    }
                }}
            />
            <ScrollView style={styles.scriptureList}>
                {
                    (filteredScripture != undefined && filteredScripture.length > 0) ?
                        filteredScripture.map((scripture, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate(
                                    'Sermons',
                                    { title: formatName(scripture[0]), apiUrl: scripture[1], sermonCategory: 'Scripture' })
                            }}>
                                <View style={styles.scriptureBox} >
                                    <Icon name='file' size={30} />
                                    <Text style={styles.scriptureTitle}> {formatName(scripture[0])}</Text>
                                </View>
                            </TouchableOpacity>
                        )) :
                        <View style={styles.awaiting}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>Loading Scripture....</Text>
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default ScriptureScreen

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
    scriptureBox: {
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
    scriptureTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: '400'
    },
    scriptureList: {
        padding: 10
    },
    awaiting: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

