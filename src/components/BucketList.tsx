import { updateDoc, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { firestore } from "../utils/firebase";
import { toFirstLetterUpperCase } from "../utils/helpers";
import ManageEvent from "./ManageEvent";

const TYPES = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

const BucketList = () => {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    const filterBucketListByType = (filterType: string) => {
        return currentUser.bucketList.filter((event: any) => event.type == filterType);
    }

    const deleteEvent = (event: any) => {
        const newUser = {
            ...currentUser,
            bucketList: currentUser.bucketList.filter((e: any) => e.key !== event.key)
        }
        toast.promise(updateDoc(doc(firestore, "users", currentUser.userEmail), newUser), {
            loading: "Deleting event...",
            success: () => {
                setCurrentUser(newUser);
                return "Event deleted from your bucket list."
            },
            error: (err) => "Error deleting event from bucket list: " + err.message,
        }, {
            success: {
                duration: 3000,
            }
        });
    }

    const addEventToKanban = (event: any) => {
        const newUser = {
            ...currentUser,
            bucketList: currentUser.bucketList.filter((e: any) => e.key !== event.key),
            kanbanBoard: { ...currentUser.kanbanBoard, "1": { ...currentUser.kanbanBoard["1"], items: [...currentUser.kanbanBoard["1"].items, event] } }
        }
        toast.promise(updateDoc(doc(firestore, "users", currentUser.userEmail), newUser), {
            loading: "Adding event to kanban board...",
            success: () => {
                setCurrentUser(newUser);
                return "Event added to kanban board!"
            },
            error: (err) => "Error adding event to kanban board: " + err.message,
        }, {
            success: {
                duration: 3000,
            }
        });
    }

    return (
        <div className="pt-16 absolute w-full h-full">
            <button onClick={() => setShowModal(true)} className="bg-green-500 absolute right-12 py-2 px-3 mt-6 mb-1 rounded-md shadow-2xl">
                <i className="fa-solid fa-plus h-4 w-4 mr-1 text-white" />
                <span className="font-semibold text-white">Create custom event</span>
            </button>
            {
                currentUser.bucketList.length === 0 ?
                    <div className="py-14 h-full w-full flex justify-center">
                        <h1 className="text-2xl text-center text-slate-200">There are currently no events on your bucket list. <br />
                            Head to swiping to start looking at events!</h1>
                    </div>
                    :
                    <div className="pt-16 pb-14 flex-col overflow-y-scroll space-y-8 h-full">
                        {
                            TYPES.map((filterType: string) => {
                                let filteredList = filterBucketListByType(filterType);
                                return filteredList.length > 0 ? (
                                    <div key={filterType} className="flex-shrink-0">
                                        <div className="w-11/12 flex items-center mx-auto mb-2">
                                            <h2 className='text-3xl text-white font-bold grow-0 px-2'>{toFirstLetterUpperCase(filterType)}</h2>
                                            <div className="bucketlist-line grow rounded-lg" />
                                        </div>
                                        <div className="flex overflow-x-auto space-x-8 px-8">
                                            {
                                                filteredList.map((event: any) =>
                                                    <div key={event.key} className="flex-shrink-0">
                                                        <div className='flex-col unselectable shadow-md bg-blue-300 w-80 min-h-[13rem] rounded-lg p-4'>
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
                                                            <div className='mt-3 flex justify-between'>
                                                                <button onClick={() => deleteEvent(event)} className="bg-red-500 flex items-center px-3 py-1 rounded-lg text-white font-semibold">
                                                                    <i className="fa-solid fa-trash-can text-sm mr-2" />
                                                                    Delete
                                                                </button>
                                                                <button onClick={() => addEventToKanban(event)} className="bg-green-500 flex items-center px-3 py-1 rounded-lg text-white font-semibold">
                                                                    <i className="fa-solid fa-plus h-4 w-4 mr-2" />
                                                                    Add to Kanban
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : <></>
                            })
                        }
                    </div>
            }
            {/* Create event */}
            <div className={"fixed max-h-full overflow-y-auto z-20 top-0 w-full left-0" + (showModal ? '' : ' hidden')}>
                <ManageEvent setShowModal={setShowModal} />
            </div>
        </div>
    );
}

export default BucketList;