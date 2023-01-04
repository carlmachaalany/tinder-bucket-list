import { useContext, useRef, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { toFirstLetterUpperCase } from "../utils/helpers";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../utils/firebase";

const TYPES = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

const ManageEvent = ({ setShowModal }: any) => {

    const { currentUser, setCurrentUser } = useContext(UserContext);

    const activityRef = useRef<any>();
    const [category, setCategory] = useState<string>("education");
    const participantsRef = useRef<any>();
    const priceRef = useRef<any>();
    const accessibilityRef = useRef<any>();


    const createEvent = () => {
        if (activityRef.current.value === "") {
            toast.error("Activity field cannot be empty.", {duration: 3000});
            return;
        }
        const newEvent = {
            key: uuidv4(),
            activity: activityRef.current.value,
            type: category,
            participants: parseInt(participantsRef.current.value),
            price: parseInt(priceRef.current.value) / 100,
            accessibility: (parseInt(accessibilityRef.current.value) / 100 - 1) * -1,
        }
        const newUser = {
            ...currentUser,
            bucketList: [...currentUser.bucketList, newEvent]
        }
        toast.promise(updateDoc(doc(firestore, "users", currentUser.userEmail), newUser), {
            loading: "Adding event to bucket list...",
            success: () => {
                setCurrentUser(newUser);
                closeAndResetModal();
                return "Event added to your bucket list!"
            },
            error: (err) => {
                return "Error adding event to bucket list: " + err.message;
            }
        }, {
            success: {
                duration: 3000,
            }
        });
    }

    const closeAndResetModal = () => {
        setShowModal(false);
        activityRef.current.value = "";
        setCategory("education");
        participantsRef.current.value = "1";
        priceRef.current.value = "50";
        accessibilityRef.current.value = "50";
    }

    return (
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-900 opacity-70" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition duration-300 ease-in-out sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <h1 className='text-center text-3xl font-bold pb-2 pt-4 border-b-2'>Create Event</h1>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <label className="font-semibold">Activity</label>
                    <input ref={activityRef} type="text" className="w-full bg-gray-100 p-2 mt-2 mb-3 focus:outline-blue-100" />
                    <div className="w-full flex justify-between my-4">
                        <div className="flex-col grow">
                            <label className="font-semibold">Category</label>
                            <div className="relative mr-16 border bg-gray-100 rounded">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="block p-2 w-full rounded appearance-none focus:outline-none">
                                    {TYPES.map((type: any) => (
                                        <option value={type} key={type}>{toFirstLetterUpperCase(type)}</option>
                                    ))}
                                </select>
                                <div className="flex items-center pointer-events-none absolute inset-y-0 right-0 px-2 text-gray-700">
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <div className="flex-col items-center grow text-center">
                            <label className="font-semibold">Participants</label>
                            <div className="w-24 mx-auto">
                                <div className="flex flex-row h-9 w-full rounded-lg relative bg-transparent mt-1">
                                    <button onClick={() => { if (participantsRef.current.value > 1) participantsRef.current.value = parseInt(participantsRef.current.value) - 1 }} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                                        <span className="m-auto text-2xl font-thin">−</span>
                                    </button>
                                    <input defaultValue={1} ref={participantsRef} className="outline-none text-center w-full bg-gray-300 font-semibold text-md md:text-basecursor-default flex items-center text-gray-700"></input>
                                    <button onClick={() => { participantsRef.current.value = parseInt(participantsRef.current.value) + 1 }} data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                                        <span className="m-auto text-2xl font-thin">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-full flex mt-7">
                        <div className="flex-col items-center grow text-center">
                            <p className="font-medium">Price</p>
                            <input ref={priceRef} className="form-range cursor-pointer w-5/6" type="range"></input>
                        </div>
                        <div className="flex-col items-center grow text-center">
                            <p className="font-medium">Accessibility</p>
                            <input ref={accessibilityRef} className="form-range cursor-pointer w-5/6" type="range"></input>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 px-4 py-3 flex items-center justify-end">
                    <button onClick={closeAndResetModal} type="button" className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2">Cancel</button>
                    <button onClick={createEvent} type="button" className="py-2 px-4 bg-blue-500 text-white rounded mr-2 flex items-center">
                        <><i className="fas fa-plus mr-1" />Create</>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default ManageEvent;