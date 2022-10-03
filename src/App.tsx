import React, { useEffect } from "react";
import { useCallback, useState, useReducer, useRef } from "react";

const Heading = ({ title }: { title: string }) => {
  return <h2>{title}</h2>;
};

const Box = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const initialState = [{ id: 0, done: true, text: "elo" }];

const List: React.FunctionComponent<{
  items: string[];
  onClick?: (item: string) => void;
}> = ({ items, onClick }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onClick?.(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
};

type Payload = {
  text: string;
};

type Todo = {
  id: number;
  done: boolean;
  text: string;
};

type ActionType =
  | {
      type: "ADD_TODO";
      text: string;
    }
  | {
      type: "REMOVE_TODO";
      id: number;
    };

function App() {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    console.log("start fetching");
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPayload(data);
      });
  }, []);

  const onItemClick = useCallback(
    (item: string) => alert(`You have clicked ${item}`),
    []
  );

  const reducer = (state: Todo[], action: ActionType) => {
    console.log(typeof state);
    switch (action.type) {
      case "ADD_TODO":
        return [...state, { id: state.length, done: false, text: action.text }];
      case "REMOVE_TODO":
        return state.filter((todo) => todo.id !== action.id);
      default:
        throw new Error("Unknown action");
    }
  };

  const [todos, dispatch] = useReducer(reducer, initialState);

  console.log(todos);

  const newTodoRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Heading title="Introduction" />
      <Box>Hello there</Box>
      <List items={["siema", "elo"]} onClick={onItemClick} />
      <Box>{JSON.stringify(payload)}</Box>
      <Heading title="Todos" />
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.text}
          <button
            onClick={() => dispatch({ type: "REMOVE_TODO", id: todo.id })}
          >
            Delete todo
          </button>
        </div>
      ))}
      <div>
        <input type="text" ref={newTodoRef} />
        <button
          onClick={() =>
            newTodoRef.current &&
            dispatch({ type: "ADD_TODO", text: newTodoRef.current.value })
          }
        >
          Add todo
        </button>
      </div>
    </div>
  );
}

export default App;
