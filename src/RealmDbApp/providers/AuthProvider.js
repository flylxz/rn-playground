import React, {
  useContext,
  useState,
  createContext,
  useRef,
  useEffect,
} from 'react';
import Realm from 'realm';
import { app } from '../db/RealmApp';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  const realmRef = useRef(null);

  useEffect(() => {
    if (!user) {
      console.warn('No user logged in');
      return;
    }

    const config = {
      sync: {
        user,
        partitionValue: `user=${user.id}`,
      },
    };
    try {
      Realm.open(config).then(userRealm => {
        realmRef.current = userRealm;
      });
    } catch (err) {
      console.warn('err', err);
    }

    return () => {
      const userRealm = realmRef.current;
      if (userRealm) {
        userRealm.close();
        realmRef.current = null;
      }
    };
  }, [user]);

  const signIn = async (email, password) => {
    const creds = await Realm.Credentials.emailPassword(email, password);
    console.log('--------creds: ', creds);
    const newUser = await app
      .logIn(creds)
      .catch(err => console.warn('login error: ', err));
    setUser(newUser);
  };

  const signUp = async (email, password) => {
    await app.emailPasswordAuth
      .registerUser({ email, password })
      .catch(err => console.warn('register error: ', err));
  };

  const signOut = () => {
    if (!user) {
      console.warn("Not logged in, can't log out");
      return;
    }
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return auth;
};

export { AuthProvider, useAuth };
