import React from 'react'
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SI_ICONS, SI_COLORS } from '../constants/config'

const HomeScreen = ({ navigation }) => {
    const ModuleItem = ({ iconName, title, subtitle, onPress }) => {
        return (
            <TouchableOpacity style={styles.siModule} onPress={onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        marginRight: 20,
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        backgroundColor: SI_COLORS.color3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 1

                    }}>
                        <Icon name={iconName} size={30} color={SI_COLORS.homeIconColor2} />
                    </View>
                    <View>
                        <Text style={styles.siModuleLine1}>{title}</Text>
                        <Text style={styles.siModuleLine2}>{subtitle}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.page}>
            <StatusBar backgroundColor={SI_COLORS.backgroundColor2} />
            <View style={{ backgroundColor: SI_COLORS.backgroundColor2 }}>
                <Image source={require('../assets/sermonindex-top.png')} style={styles.logo} />
            </View>
            <View>
                <ModuleItem
                    iconName={SI_ICONS.speaker}
                    title='Speaker'
                    subtitle='List Sermons by Speaker'
                    onPress={() => navigation.navigate('Speakers')}
                />
                <ModuleItem
                    iconName={SI_ICONS.topic}
                    title='Topics'
                    subtitle='List Sermons by Topics'
                    onPress={() => navigation.navigate('Topics')}
                />
                <ModuleItem
                    iconName={SI_ICONS.scripture}
                    title='Scripture'
                    subtitle='List Sermons by Scripture'
                    onPress={() => navigation.navigate('Scriptures')}
                />
            </View>
        </View >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingVertical: 30,
        backgroundColor: SI_COLORS.backgroundColor2
    },
    logo: {
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 10,
        // marginTop: 30,
        resizeMode: 'cover'
    },
    infoText: {
        fontSize: 18,
        fontWeight: '400',
        alignSelf: 'center',
        marginTop: -30
    },
    siModule: {
        marginTop: 20,
        height: 120,
        width: '70%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.2)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgb(100, 100, 0)',
        backgroundColor: SI_COLORS.backgroundColor2,
        elevation: 7,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 14, width: 14 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 12, //IOS        
    },
    siModuleLine1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: SI_COLORS.color2
    },
    siModuleLine2: {
        fontSize: 16,
        color: SI_COLORS.color2
    }

})
