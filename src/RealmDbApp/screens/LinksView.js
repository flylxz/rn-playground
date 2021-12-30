import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Linking,
  Pressable,
} from 'react-native';
import { useLinks } from '../providers/LinkProvider';
import { ListItem } from 'react-native-elements';
import { Logout } from '../components/Logout';
import styles from '../styles/stylesheet';
import { useNavigation } from '@react-navigation/native';

export const LinksView = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [linkDescription, setLinkDescription] = useState('');
  const [linkURL, setLinkURL] = useState('');

  const { links, createLink, deleteLink, closeRealm } = useLinks();

  const onClickLink = link => {
    Linking.openURL(link.url).catch(err =>
      console.warn('An error occurred', err),
    );
    setLinkDescription('');
    setLinkURL('');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Log out',
      headerLeft: () => <Logout closeRealm={closeRealm} />,
    });
  }, [navigation]);

  //   useEffect(() => {
  //     console.log('links---------', JSON.stringify(links, null, 2));
  //   });

  return (
    <ScrollView>
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>Create new Link</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <>
          <TextInput
            style={styles.inputStyle}
            onChangeText={setLinkDescription}
            placeholder="Description"
            value={linkDescription}
          />
          <TextInput
            style={styles.inputStyle}
            onChangeText={setLinkURL}
            placeholder="URL"
            value={linkURL}
            autoCapitalize="none"
          />
          <Button
            title="Add Link!"
            color="red"
            onPress={() => {
              createLink(linkDescription, `http://${linkURL}`);
            }}
          />
        </>
      </ListItem.Accordion>

      {links?.map((link, index) => (
        <ListItem.Swipeable
          onPress={() => onClickLink(link)}
          bottomDivider
          key={link.name}
          rightContent={
            <Pressable
              onPress={() => deleteLink(link)}
              style={{
                backgroundColor: 'red',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'black', fontSize: 20 }}>Delete</Text>
            </Pressable>
          }
        >
          <ListItem.Content>
            <ListItem.Title>{link.name}</ListItem.Title>
            <ListItem.Subtitle>{link.url}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      ))}
      {/* {links?.map(link => (
        <View>
          <Text style={{color: 'black'}}>{link.name}</Text>
        </View>
      ))} */}
    </ScrollView>
  );
};
