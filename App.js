import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from './Screens/HomeScreen'
import SpeakersScreen from './Screens/SpeakersScreen'
import TopicsScreen from './Screens/TopicsScreen'
import ScriptureScreen from './Screens/ScriptureScreen'
import SermonsScreen from './Screens/SermonsScreen'
import PlayerScreen from './Screens/PlayerScreen'
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenStack = createStackNavigator()

const globalScreenstyle = {
  headerStyle: { backgroundColor: 'rgba(112, 111, 48, 1)' },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

export default function App() {
  return (
    <NavigationContainer>
      <screenStack.Navigator screenOptions={globalScreenstyle}>
        <screenStack.Screen name="Home" component={HomeScreen} options={{ title: "SermonIndex", headerShown: false }} />
        <screenStack.Screen name="Speakers" component={SpeakersScreen} options={{ title: "Speakers" }} />
        <screenStack.Screen name="Topics" component={TopicsScreen} options={{ title: "Topics" }} />
        <screenStack.Screen name="Scriptures" component={ScriptureScreen} options={{ title: "Scripture" }} />
        <screenStack.Screen name="Sermons" component={SermonsScreen} options={({ route }) => ({ title: route.params.title })} />
        <screenStack.Screen name="Player"
          component={PlayerScreen}
          options={({ navigation, route }) => ({ title: route.params.title })}
        />
      </screenStack.Navigator>
    </NavigationContainer>
  );
}