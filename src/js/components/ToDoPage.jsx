import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


//create your first component
const ToDoPage = () => {

    const [list, setList] = useState([]);
    const [task, setTask] = useState('');
    const [user, setUser] = useState({ 'name': '', 'id': null });
    const [login, setlogin] = useState(false)
    const [hover, setHover] = useState(null);

    const createUser = async () => {
        if (user.name.length < 2) {
            alert('Username is too short')
            return
        }
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user.name}`, {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const registration = response.json();
            setUser(prev => { return { ...prev, id: registration.id } })
            setlogin(prev => !prev)
            alert(`Username ${user.name} registered correctly, you may begin adding tasks`)
        } catch (error) {
            console.error('Problem registering user, server responded with:', error)
        }
    }

    const logOut = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user.name}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            setUser({ 'name': '', 'id': null })
            alert(`Logout successful and task list cleared`)
            setlogin(prev => !prev)
            setList([])
        } catch (error) {
            console.error('Problem login out, server responded with:', error)
        }

    }

    const updateRender = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user.name}`)
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const todoList = await response.json();
            setList(todoList.todos)
        } catch (error) {
            console.error('Problem updating, server responded with:', error)
        }
    }

    const addTask = async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${user.name}`, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ 'label': task, 'is_done': false }),
                })
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                const taskData = await response.json();
                setTask('')
            } catch (error) {
                alert('Problem adding task, server responded with:', error)
                console.error('Problem adding task, server responded with:', error)
            }
        }
    }

    const deleteTask = async (itemID) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${itemID}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
        } catch (error) {
            alert('Problem deleting task, server responded with:', error)
            console.error('Problem deleting task, server responded with:', error)
        }
    }

    const markedDone = async (item) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ 'label': item.label, 'is_done': !item.is_done }),
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
        } catch (error) {
            alert('Problem updating task, server responded with:', error)
            console.error('Problem updating task, server responded with:', error)
        }
    }

    return (
        <div className="page">
            <div className="d-flex my-3 login align-items-center justify-content-around">
                <input className="form-control fs-5 ms-3" type="text" placeholder="Type your username" disabled={login} value={user.name} onChange={(e) => { setUser(prev => { return { ...prev, 'name': e.target.value } }) }} />
                <div className="d-flex mx-3 justify-content-between align-items-center w-100">
                    <button type="button" className="btn btn-success fw-bold mx-2" disabled={login} onClick={createUser}>Login</button>
                    <button type="button" className="btn btn-danger fw-bold mx-2" disabled={!login} onClick={logOut}>Logout & Clear Data</button>
                </div>
            </div>
            <h1 className="title">To Do List</h1>
            <input className="form-control py-3 input-bar b-0 my-4" type="text" placeholder="Type your next task..." disabled={!login} value={task} onKeyDown={(e) => addTask(e).then(updateRender)} onChange={(e) => { setTask(e.target.value) }} />
            <div className="task-list">
                <ul className="list-group list-group-flush list-items">
                    {list.map((item) => {
                        return (
                            <li className="list-group-item align-middle d-flex justify-content-start" key={item.id} onMouseEnter={() => {
                                setHover(item.id)
                            }} onMouseLeave={() => { setHover(null) }}><input className="form-check-input me-5" type="checkbox" value="" id="flexCheckDefault" onClick={() => markedDone(item).then(updateRender)} /><div className={`task ${item.is_done ? 'task-done' : ''}`}>{item.label}</div> <FontAwesomeIcon icon={faTrash} className={`delete ${hover === item.id ? 'delete-show' : ''}`} onClick={() => deleteTask(item.id).then(updateRender)} /></li>
                        )
                    })}
                </ul>
            </div>
            <div className="task-counter">{`${list.filter(item => !item.is_done).length} ${list.filter(item => !item.is_done).length === 1 ? 'item' : 'items'} left`}</div>
        </div>
    );
};

export default ToDoPage;
