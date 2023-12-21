import React, { useState, useRef } from "react";

export default function Todolist() {
    const [todoInputText, setTodoInputText] = useState("");
    const [todos, setTodos] = useState([
        {
            todo: "Task-1",
            complete: true,
            isDragging: false,
            description: "",
            comments: ""
        },
        {
            todo: "Task-2",
            complete: false,
            isDragging: false,
            description: "",
            comments: ""
        },
        {
            todo: "Task-3",
            complete: false,
            isDragging: false,
            description: "",
            comments: ""
        }
    ]);
    const [openedTodoIndex, setOpenedTodoIndex] = useState(null);

    function handleAddTodo() {
        if (todoInputText.length > 0) {
            setTodos([...todos, { todo: todoInputText, complete: false, isDragging: false, description: "", comments: "" }]);
            setTodoInputText(""); 
        }
    }

    function handleTodoClicks(e, index) {
        switch (e.detail) {
            case 1:
                
                const newArr = todos.map((item, i) =>
                    i === index ? { ...item, complete: !item.complete } : item
                );
                setTodos(newArr);
                break;
            case 2:
                
                setTodos(todos.filter((_, iy) => iy !== index));
                break;
            default:
                break;
        }
    }

    let todoItemDrag = useRef();
    let todoItemDragOver = useRef();

    function D_Start(e, index) {
        todoItemDrag.current = index;
    }

    function D_Enter(e, index) {
        todoItemDragOver.current = index;
        const finalArr = todos.map((item, idx) => ({
            ...item,
            isDragging: idx === index
        }));
        setTodos(finalArr);
    }

    function D_End() {
        const todo_item_main = todos[todoItemDrag.current];
        const reorderedTodos = [...todos];
        reorderedTodos.splice(todoItemDrag.current, 1);
        reorderedTodos.splice(todoItemDragOver.current, 0, todo_item_main);

        const finalArr = reorderedTodos.map(item => ({ ...item, isDragging: false }));
        setTodos(finalArr);

        todoItemDrag.current = null;
        todoItemDragOver.current = null;
    }

    function handleOpenTodoDetails(index) {
        setOpenedTodoIndex(index);
    }

    function handleUpdateTodoDetails(index, description, comments) {
        const updatedTodos = todos.map((todo, todoIndex) =>
            todoIndex === index ? { ...todo, description, comments } : todo
        );
        setTodos(updatedTodos);
        setOpenedTodoIndex(null); 
    }

    return (
        <div className="todo-container">
            <input
                value={todoInputText}
                onChange={e => setTodoInputText(e.target.value)}
                className="input-todo-text"
                type="text"
                placeholder="Enter a task"
            />
            <button onClick={handleAddTodo} className="add-todo-button">Add Task</button>
            <div className="display-todo-container">
                {todos.map((todo, index) => (
                    <React.Fragment key={index}>
                        <h3
                            draggable
                            onDragStart={e => D_Start(e, index)}
                            onDragEnter={e => D_Enter(e, index)}
                            onDragEnd={D_End}
                            style={{ textDecoration: todo.complete ? "line-through" : "none" }}
                            onClick={e => handleTodoClicks(e, index)}
                            className="todo-item-text"
                        >
                            {todo.todo}
                        </h3>
                        {todo.isDragging && <div className="drag-indicator"></div>}
                        <button onClick={() => handleOpenTodoDetails(index)}>Open</button>
                        {openedTodoIndex === index && (
                            <TodoDetails
                                todo={todos[index]}
                                index={index}
                                onUpdate={handleUpdateTodoDetails}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

function TodoDetails({ todo, index, onUpdate }) {
    const [description, setDescription] = useState(todo.description);
    const [comments, setComments] = useState(todo.comments);

    return (
        <div className="todo-details">
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
            />
            <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Comments"
            />
            <button onClick={() => onUpdate(index, description, comments)}>Update</button>
        </div>
    );
}
