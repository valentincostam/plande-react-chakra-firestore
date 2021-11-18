import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { createUser, getUser } from './db';
import { auth } from './firebase';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleUser = async (rawUser) => {
    try {
      if (!rawUser) {
        setUser(null);
        return;
      }

      const existingUser = await getUser(rawUser.uid);

      rawUser.role = existingUser?.role;

      const user = await formatUser(rawUser);

      if (!existingUser) {
        const { token, ...userWithoutToken } = user;
        await createUser(userWithoutToken);
      }

      setUser(user);
    } catch (error) {
      setError(error);
      setUser(null);
    }
  };

  const signinWithGoogle = () => {
    return signInWithRedirect(auth, new GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);
      })
      .catch((error) => setError(error));
  };

  const signout = () => {
    return auth.signOut().then(() => {
      handleUser(false);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    error,
    isLoggedIn: user !== null,
    signinWithGoogle,
    signout,
  };
}

const formatUser = async (user) => {
  const token = await user.getIdToken();
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    role: user.role ?? 'student', // TODO: Could I set this default value on the server?
    token,
  };
};
