import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


//create your first component
const ToDoPage = () => {

    const [list, setList] = useState([]);
    const [task, setTask] = useState('');
    const [id, setId] = useState(0);
    const [hover, setHover] = useState(null);

    const genId = () => {
        setId(prev => prev + 1)
        return ((id).toString())
    }
    const addTask = (event) => {
        if (event.key === 'Enter') {
            const taskAdded = { 'text': event.target.value, 'id': genId(), 'done': false }
            setList([...list, taskAdded]);
            setTask('');
        }
    }

    const handleDelete = (itemID) => {
        setList(prev => prev.filter(item => item.id !== itemID))
    }

    const strikeTask = (itemID) => {
        setList(prev =>
            prev.map(item => {
                if (item.id === itemID) {
                    item.done = !item.done;
                }
                return item;
            }))
    }

    useEffect({



    },[])


    return (
        <div className="page">
            <h1 className="title">To Do List</h1>
            <input className="form-control py-3 input-bar b-0 my-4" type="text" placeholder="Type your next task..." value={task} onKeyDown={addTask} onChange={(e) => { setTask(e.target.value) }} />
            <div className="task-list">
                <ul className="list-group list-group-flush list-items">
                    {list.map((item, index) => {
                        return (
                            <li className="list-group-item align-middle d-flex justify-content-start" key={item.id} onMouseEnter={() => {
                                setHover(item.id)
                            }} onMouseLeave={() => { setHover(null) }}><input className="form-check-input me-5" type="checkbox" value="" id="flexCheckDefault" onClick={() => strikeTask(item.id)} /><div className={`task ${item.done ? 'task-done' : ''}`}>{item.text}</div> <FontAwesomeIcon icon={faTrash} className={`delete ${hover === item.id ? 'delete-show' : ''}`} onClick={() => handleDelete(item.id)} /></li>
                        )
                    })}
                </ul>
            </div>
            <div className="task-counter">{`${list.filter(item => !item.done).length} ${list.filter(item => !item.done).length === 1 ? 'item' : 'items'} left`}</div>
        </div>
    );
};

export default ToDoPage;
