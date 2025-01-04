import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const ToDoPage = () => {

    const [list, setList] = useState([]);
    const [task, setTask] = useState('');
    const [user, setUser] = useState('sampleUserJS');
    const [hover, setHover] = useState(null);
    const login = useRef(true);


    const createUser = async () => {
        if (user.length < 2) {
            alert('Username is too short')
            return
        }
        try {
            const res = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
                method: 'POST'
            })
            const registration = await res.json()
            if (!res.ok) {
                throw new Error(registration.detail)
            }
            alert(`Username ${user} registered correctly, you may begin adding tasks`)
            await updateRender();
        } catch (error) {
            alert(error)
            console.error('Problem registering user, server responded with:', error);
            throw error;
        }
    }

    const logIn = async () => {
        if (user.length < 2) {
            alert('Username is too short')
            return
        }
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user}`)
            const todoList = await response.json();
            if (!response.ok) {
                throw new Error(todoList.detail)
            }
            alert('Login successful')
            setList(todoList.todos)
        } catch (error) {
            alert(error)
            console.error('Problem login, server responded with:', error)
        }

    }

    const logOut = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            setUser('')
            alert(`Logout successful and task list cleared`)
            setList([])
        } catch (error) {
            console.error('Problem login out, server responded with:', error)
        }

    }

    const updateRender = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${user}`)
            const todoList = await response.json();
            if (!response.ok) {
                throw new Error(todoList.detail)
            }
            setList(todoList.todos)
        } catch (error) {
            alert('Create an user or login first before adding tasks')
            console.error('Problem updating, server responded with:', error)
            throw error;
        }
    }

    const addTask = async (event) => {
        if (event.key === 'Enter' && task !== '') {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ 'label': task, 'is_done': false }),
                })
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                setTask('')
                await updateRender();
            } catch (error) {
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
            await updateRender();
        } catch (error) {
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
            await updateRender();
        } catch (error) {
            console.error('Problem updating task, server responded with:', error)
        }
    }

    useEffect(() => {
        const firstLogIn = async () => {
            try {
                const res = await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
                    method: 'POST'
                })
                if (!res.ok) {
                    throw new Error(res.statusText)
                }
                await updateRender();
            } catch {
                console.error('User already exists, attempting to retrieve information')
                try {
                    await updateRender();
                } catch {
                    console.error('Creating user and updating render failed, problem with server')

                }
            }
        }
        if (login.current) {
            firstLogIn();
        }
        login.current = false;
    }, [])

    return (
        <div className="page">
            <div className="d-flex my-3 login align-items-center justify-content-around">
                <input className="form-control fs-5 ms-3" type="text" placeholder="Type your username" value={user} onChange={(e) => { setUser(e.target.value) }} />
                <div className="d-flex mx-3 justify-content-between align-items-center w-100">
                    <button type="button" className="btn btn-success fw-bold mx-2" onClick={createUser}>Create User</button>
                    <button type="button" className="btn btn-primary fw-bold mx-2" onClick={logIn}>Login User</button>
                    <button type="button" className="btn btn-danger fw-bold mx-2" onClick={logOut}>Delete User</button>
                </div>
            </div>
            <h1 className="title">To Do List</h1>
            <input className="form-control py-3 input-bar b-0 my-4" type="text" placeholder="Type your next task..." disabled={user === '' ? true : false} value={task} onKeyDown={(e) => addTask(e).then(updateRender)} onChange={(e) => { setTask(e.target.value) }} />
            <div className="task-list">
                <ul className="list-group list-group-flush list-items">
                    {list.map((item) => {
                        return (
                            <li className="list-group-item align-middle d-flex justify-content-start"
                                key={item.id}
                                onMouseEnter={() => {
                                    setHover(item.id)
                                }}
                                onMouseLeave={() => { setHover(null) }}>
                                <input className="form-check-input me-5" type="checkbox"
                                    checked={item.is_done}
                                    value=""
                                    id="flexCheckDefault"
                                    onChange={() => markedDone(item)} />
                                <div className={`task ${item.is_done ? 'task-done' : ''}`}>
                                    {item.label}</div>
                                <FontAwesomeIcon icon={faTrash} className={`delete ${hover === item.id ? 'delete-show' : ''}`}
                                    onClick={() => deleteTask(item.id)} /></li>
                        )
                    })}
                </ul>
            </div>
            <div className="task-counter">{`${list.filter(item => !item.is_done).length} ${list.filter(item => !item.is_done).length === 1 ? 'item' : 'items'} left`}</div>
        </div>
    );
};

export default ToDoPage;
