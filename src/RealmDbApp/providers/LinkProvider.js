import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  createContext,
} from 'react';
import Realm from 'realm';
import { Link } from '../schema/schema';
import { useAuth } from './AuthProvider';

const LinksContext = createContext(null);

const LinksProvider = ({ children }) => {
  const [links, setLinks] = useState([]);
  const { user } = useAuth();

  const realmRef = useRef(null);

  useEffect(() => {
    if (!user) {
      console.warn('No user? Need to log in!');
      return;
    }

    const OpenRealmBehaviorConfiguration = {
      type: 'openImmediately',
    };

    const config = {
      schema: [Link.schema],
      sync: {
        user,
        partitionValue: `${user.id}`,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };

    Realm.open(config).then(realm => {
      try {
        realmRef.current = realm;
        const syncLinks = realm.objects('Link');
        let sortedLinks = syncLinks.sorted('name');
        setLinks([...sortedLinks]);

        sortedLinks.addListener(() => {
          console.log('Got new data!');
          setLinks([...sortedLinks]);
        });
      } catch (err) {
        console.warn(err);
      }
    });

    return () => {
      closeRealm();
    };
  }, [user]);

  const createLink = (newLinkName, newLinkURL) => {
    try {
      const realm = realmRef.current;
      realm.write(() => {
        realm.create(
          'Link',
          new Link({
            name: newLinkName || 'New Link',
            url: newLinkURL || 'http://',
            partition: user.id,
          }),
        );
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteLink = link => {
    try {
      const realm = realmRef.current;
      realm.write(() => {
        realm.delete(link);
        setLinks([...realm.objects('Link').sorted('name')]);
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const closeRealm = () => {
    try {
      const realm = realmRef.current;
      if (realm) {
        realm.close();
        realmRef.current = null;
        setLinks([]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <LinksContext.Provider
      value={{
        createLink,
        deleteLink,
        closeRealm,
        links,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
};

const useLinks = () => {
  const links = useContext(LinksContext);
  if (!links) {
    throw new Error('useLinks() called outside of a TaskProvider? ');
  }
  return links;
};

export { LinksProvider, useLinks };
