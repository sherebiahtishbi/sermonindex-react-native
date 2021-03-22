import { Dimensions } from 'react-native';

export const SI_COLORS = {
    backgroundColor1: 'rgba(112, 111, 48, 1)',
    backgroundColor2: '#7c7b3a',
    color1: 'rgba(124, 123, 60, 1.0)',
    color2: 'rgba(0, 0, 0, .7)',
    color3: 'rgba(0, 0, 0, .2)',
    color4: 'rgba(0, 0, 0, .5)',
    homeIconColor1: '#acacac',
    homeIconColor2: '#949494',
    minTrackTintColor: '#343434',
    maxTrackTintColor: '#a2a2a2',
    thumbTintColor: '#343434'
};

export const SI_ICONS = {
    home: 'home',
    play: 'play-circle',
    pause: 'pause-circle',
    speaker: 'user',
    topic: 'file',
    scripture: 'book',
    info: 'info-circle',
    close: 'close'
};

export const SI_DEVICE = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

const appSettings = { SI_COLORS, SI_ICONS, SI_DEVICE };

export default appSettings;