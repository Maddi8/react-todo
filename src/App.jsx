import { useState, useEffect, useRef } from "react"
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

class Todo {
  constructor(title) {
    this.title = title
    this.created = Date.now()
    this.completed = false
  }
}

function App() {
  // Todos is initialized with localStorage items if they exist
  const [todos, setTodos] = useState(localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [])

  // Id is used to keep track of which todo is being edited
  const [activeId, setActiveId] = useState(null)
  
  const [title, setTitle] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Updates the current time every second
  // Focus on the input of the active todo when activeId changes
  useEffect(() => {

    focusInput(activeId)

    setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
  }, [activeId])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  };

  // Initialize an array of refs
  const inputRefs = useRef([]);

  const focusInput = (id) => {
    if (inputRefs.current[id]) {
      inputRefs.current[id].focus();
    }
  };


  const submit = () => {
    if (activeId !== null) {
      todos[activeId].title = title || todos[activeId].title
      setTitle("")
      setActiveId(null)
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }

  const newTodo = () => {
    const newTodos = [...todos]
    newTodos.push(new Todo(title))
    setTodos([...todos, new Todo("New Todo")])
    setActiveId(todos.length)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const tick = (id) => {
    const newTodos = [...todos]
    newTodos[id].completed = !newTodos[id].completed
    setTodos(newTodos)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const deleteTodo = (id) => {
    const newTodos = [...todos]
    newTodos.splice(id, 1)
    setTodos(newTodos)
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  return (
    <div className="flex flex-col w-full h-screen mx-auto px-20 py-10 lg:py-0 items-center">
      <h1 className="text-3xl font-semibold mt-4">React Todo App</h1>
      <a href="https://github.com/Maddi8/react-todo" className="mb-2 hover:text-[#433bff] transition-all">Made by Maddi8</a>
      <section className="min-w-80 w-full max-w-[40rem]">
        <section className="inline-flex justify-center items-center w-full">
          <button onClick={newTodo} type="button" className="w-fit px-4 py-2 rounded-md mr-auto bg-[#433bff] hover:bg-[#a03bff] duration-500 transition-all text-white font-semibold">Add Item</button>
          <time className="ml-auto">{currentTime}</time>
        </section>
        <ul className={`w-full min-h-32 max-h-[40rem] flex flex-col p-4 rounded-md bg-[#dedcff] my-2 transition-all ${todos.length === 0 ? "opacity-0" : "opacity-100"} overflow-auto`}>
          {todos.map((todo, id) => (
            <li key={id} className="inline-flex bg-[#fbfbfe] my-4 py-4 px-2 rounded-md items-center transition-all">
              <section className="inline-flex items-center mx-2">
                <input type="checkbox" id={id} checked={todo.completed} onChange={() => tick(id)} className="text-[#433bff] w-4 h-4 mr-2" />
                <section className={`flex flex-col ${todos[id].completed && "line-through opacity-60"}`}>
                  <section className="inline-flex items-center w-full">
                    {/* Show the title of the todo if it is not being edited */}
                    {activeId !== id && <h2 onClick={() => setActiveId(id)}>{todo.title}</h2>}
                    {activeId === id && <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={handleKeyPress} id={id} placeholder={todo.title} onBlur={submit} ref={(el) => (inputRefs.current[id] = el)} className={`w-full border border-slate-300 rounded-md bg-[#fbfbfe]`} />}
                  </section>
                  <time>{new Date(todo.created).toLocaleString()}</time>
                </section>
              </section>
              <section className="inline-flex items-center ml-auto">
                <button type="button" className="w-fit" onClick={() => setActiveId(id)}><MdEdit className="mr-4 w-6 h-6" /></button>
                <button type="button" className="w-fit" onClick={() => deleteTodo(id)}><FaTrash className="mx-2 w-6 h-6" /></button>
              </section>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
