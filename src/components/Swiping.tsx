import React, { useContext, useEffect, useState } from 'react';
import { BoredApi } from '../utils/boredapi';
import TinderCard from 'react-tinder-card'
import { toFirstLetterUpperCase } from '../utils/helpers';
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from '../utils/firebase';
import { UserContext } from '../contexts/UserContext';

const Swiping = () => {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [events, setEvents] = useState<any[]>([]);
    const [lastDirection, setLastDirection] = useState();
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        populateRandomEvents();
    }, []);

    const populateRandomEvents = async () => {
        let event = await BoredApi.getRandomEvent();
        while ((currentUser.bucketList.filter((e: any) => e.key === event.key)).length > 0) {
            event = await BoredApi.getRandomEvent();
        }
        let event2 = await BoredApi.getRandomEvent();
        while ((currentUser.bucketList.filter((e: any) => e.key === event2.key)).length > 0) {
            event2 = await BoredApi.getRandomEvent();
        }
        setEvents([event, event2]);
    }

    const addRandomEvent = async () => {
        let newEvent = await BoredApi.getRandomEvent();
        while ((currentUser.bucketList.filter((e: any) => e.key === newEvent.key)).length > 0) {
            newEvent = await BoredApi.getRandomEvent();
        }
        const newEvents = [...events];
        newEvents.splice(1, 1);
        newEvents.unshift(newEvent);
        setEvents(newEvents);
    }

    const onSwipe = (direction: any, event: any) => {
        if (direction === "right") {
            addToBucketList(event);
            setTodos([...todos, event]);
        }
        addRandomEvent();
        setLastDirection(direction)
    }

    const addToBucketList = (event: any) => {
        const newUser = {
            ...currentUser,
            bucketList: [...currentUser.bucketList, event]
        }
        updateDoc(doc(firestore, "users", currentUser.userEmail), newUser).then(() => {
            setCurrentUser(newUser);
        }, (err: any) => {
            console.log("error: ", err.message);
        });
    }

    return (
        <div className='mt-24'>
            <p onClick={() => console.log(events)} className='mx-auto w-[fit-content]'>Tinder Todo App</p>
            <div className='relative my-10 flex justify-center items-center'>
                {events.map((event) =>
                    <TinderCard className='absolute h-full' key={event.key} onSwipe={(dir) => onSwipe(dir, event)}>
                        <div className='flex-col unselectable shadow-xl bg-blue-300 w-80 min-h-[13rem] rounded-lg p-4'>
                            <h3 className='text-center pb-1 font-bold border-b-2 border-b-slate-300'>{event.activity}</h3>
                            <div className='mb-2 mt-3 px-2 flex justify-between'>
                                <p>Type: {toFirstLetterUpperCase(event.type)}</p>
                                <p>Participants: {event.participants}</p>
                            </div>
                            <p className='text-center'>Price</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${event.price * 100}%` }}></div>
                            </div>
                            <p className='text-center mt-2'>Accessibility</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(event.accessibility - 1) * -100}%` }}></div>
                            </div>
                        </div>
                    </TinderCard>
                )}
            </div>
            {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}
            <div>
                todos: {todos.map(todo => todo.activity)}
            </div>
        </div>
    );
}

export default Swiping;