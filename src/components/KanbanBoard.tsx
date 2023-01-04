import { updateDoc, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { firestore } from "../utils/firebase";
import { fromColumnToBgColor } from "../utils/helpers";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {

    const { currentUser, setCurrentUser } = useContext(UserContext);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = currentUser.kanbanBoard[source.droppableId];
            const destColumn = currentUser.kanbanBoard[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            const newUser = {
                ...currentUser,
                kanbanBoard: {
                    ...currentUser.kanbanBoard,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems,
                    },
                    [destination.droppableId]: {
                        ...destColumn,
                        items: destItems,
                    },
                }
            }
            setCurrentUser(newUser);
            toast.promise(updateDoc(doc(firestore, "users", currentUser.userEmail), newUser), {
                loading: "Updating kanban board...",
                success: () =>  {
                    return "Kanban board updated!"
                },
                error: (err) => "Error updating kanban board: " + err.message,
            }, {
                success: {
                    duration: 3000,
                }
            });
        } else {
            const column = currentUser.kanbanBoard[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            const newUser = {
                ...currentUser,
                kanbanBoard: {
                    ...currentUser.kanbanBoard,
                    [source.droppableId]: {
                        ...column,
                        items: copiedItems,
                    },
                }
            }
            setCurrentUser(newUser);
            updateDoc(doc(firestore, "users", currentUser.userEmail), newUser)
            .then().catch(() => toast.error("Error updating kanban board"))
        }
    };

    return (
        <div className="pt-16 absolute w-full h-full">
            <DragDropContext
                onDragEnd={(result: any) => onDragEnd(result)}
            >
                <div className='p-5 overflow-x-auto overflow-y-scroll h-full w-full'>
                    <div className='flex'>
                        {Object.entries(currentUser.kanbanBoard).map(([columnId, column]: any, index) => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided: any, snapshot: any) => (
                                    <div className='flex-col items-center bg-transparent border-x px-3 mr-5 min-w-[17rem] w-80'
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h1 className={`${fromColumnToBgColor(column.title)} rounded-3xl text-center py-2 font-bold text-white`}>{column.title}</h1>
                                        {column.items.map((event: any, index: any) => (
                                            <TaskCard key={event.key} event={event} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

export default KanbanBoard;