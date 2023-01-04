import React, { useEffect, useState } from 'react';
import './App.css';
import Swiping from './components/Swiping';
import Navbar from './components/Navbar';
import BucketList from './components/BucketList';
import LogIn from './components/LogIn';
import { ActiveTab, UserDTO } from './utils/models';
import { UserContext } from './contexts/UserContext';
import KanbanBoard from './components/KanbanBoard';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from "./utils/firebase";
import { Toaster } from 'react-hot-toast';

function App() {

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.LogIn);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }
      const userRef = firestore.collection('users').doc(user.email);
      userRef.get().then(snapshot => {
        if (snapshot.exists) {
          setCurrentUser(snapshot.data() as any);
        } else {
          const newUser = {
            userEmail: user.email,
            bucketList: [],
            kanbanBoard: {
              ["1"]: {
                title: "To-do",
                items: []
              },
              ["2"]: {
                title: "In Progress",
                items: []
              },
              ["3"]: {
                title: "Done",
                items: []
              }
            }
          }
          userRef.set(newUser).then(() => {
            setCurrentUser(newUser);
          }).catch((error) => {
            console.log(error.message);
          })
        }
      });
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      <div className='App flex-col justify-center items-center'>
        <div id="gradient"></div>
        <Navbar activeTabState={{ activeTab: activeTab, setActiveTab: setActiveTab }} />

        {
          activeTab === ActiveTab.LogIn ? (
            <LogIn />
          ) : activeTab === ActiveTab.Swiping ? (
            <Swiping />
          ) : activeTab === ActiveTab.BucketList ? (
            <BucketList />
          ) : <KanbanBoard />
        }
      </div>
      <Toaster />
    </UserContext.Provider>
  );
}

export default App;