import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, Linking, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';

// creating custom view in react native gifted chat
const LocationView = ( location: any ) => {
  const openMaps = () => {
    const url: any = Platform.select({
      ios: `http://maps.apple.com/?ll=${location.latitude},${location.longitude}`,
      android: `http://maps.google.com/?q=${location.latitude},${location.longitude}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error('An error occurred', err);
      });
  };
  return (
    <TouchableOpacity
      onPress={openMaps}
      style={{ backgroundColor: 'gray', width: 250, height: 250 }}>
      <MapView
        style={{ height: 250, width: 250 }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: location.latitude/23,
          longitudeDelta: location.longitude/23,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        mapType={'terrain'}
      />
    </TouchableOpacity>
  );
};

export function Example() {
  const [messages, setMessages] = useState<any[]>([]);

  const renderBubble = (props: any) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return <LocationView location={currentMessage.location} />;
    }
    return <Bubble {...props} />;
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
        },
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: any[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      renderBubble={renderBubble}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default Example;