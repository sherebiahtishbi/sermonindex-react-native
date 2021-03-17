import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.page}>
            <Image source={require('../assets/sermonindex.jpg')} style={styles.logo} />
            <Text style={styles.infoText}>Promoting Genuine Biblical Revival</Text>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Speakers')
            }}>
                <View style={styles.siModule}>
                    <Icon name='user' size={50} />
                    <Text style={styles.siModuleLine1}>Speakers</Text>
                    <Text>List Sermons by Speakers</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Topics')
            }}>
                <View style={styles.siModule}>
                    <Icon name='file' size={50} />
                    <Text style={styles.siModuleLine1}>Topics</Text>
                    <Text>List Sermons by Topics</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Scriptures')
            }}>
                <View style={styles.siModule}>
                    <Icon name='book' size={50} />
                    <Text style={styles.siModuleLine1}>Scripture</Text>
                    <Text>List Sermons by Scripture</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    page: {
        paddingTop: 70,
        flex: 1,
        backgroundColor: 'rgb(112, 111, 48)'
    },
    logo: {
        height: 200,
        width: 200,
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: -30
    },
    infoText: {
        fontSize: 18,
        fontWeight: '400',
        alignSelf: 'center',
        marginTop: -30
    },
    siModule: {
        marginTop: 20,
        height: 130,
        width: '70%',
        padding: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(100, 100, 0)',
        elevation: 2,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 4, width: 4 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 2, //IOS        
    },
    siModuleLine1: {
        fontSize: 24,
        paddingTop: 5
    }
})
