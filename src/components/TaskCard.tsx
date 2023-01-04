import { Draggable } from 'react-beautiful-dnd';
import { toFirstLetterUpperCase } from "../utils/helpers";

const TaskCard = ({ event, index }: any) => {
    return (
        <Draggable key={event.key} draggableId={event.key} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className='flex-col unselectable shadow-xl bg-blue-300 w-full rounded-lg p-4 mt-2'>
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
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
