import React, { useEffect, useState } from 'react';
import { getTodos } from '../../api';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { TodoFilter } from '../TodoFilter';
import { TodoModal } from '../TodoModal';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos().then(fetchedTodos => {
      setTodos(fetchedTodos);
      setLoading(false);
    });
  }, []);

  const filteredTodos = todos.filter(todoItem => {
    const matchesQuery = query
      ? todoItem.title.toLowerCase().includes(query.toLowerCase().trim())
      : true;
    const matchesFilter =
      filter === 'active'
        ? !todoItem.completed
        : filter === 'completed'
          ? todoItem.completed
          : true;

    return matchesQuery && matchesFilter;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <TodoFilter
        filter={filter}
        setFilter={setFilter}
        query={query}
        setQuery={setQuery}
      />
      <table className="table is-narrow is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>
              <span className="icon">
                <i className="fas fa-check" />
              </span>
            </th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {filteredTodos.map(todoItem => (
            <tr
              key={todoItem.id}
              data-cy="todo"
              className={
                selectedTodo === todoItem ? 'has-background-info-light' : ''
              }
            >
              <td className="is-vcentered">{todoItem.id}</td>
              <td className="is-vcentered">
                {todoItem.completed && (
                  <span className="icon" data-cy="iconCompleted">
                    <i className="fas fa-check" />
                  </span>
                )}
              </td>
              <td className="is-vcentered is-expanded">
                <p
                  className={
                    todoItem.completed ? 'has-text-success' : 'has-text-danger'
                  }
                >
                  {todoItem.title}
                </p>
              </td>
              <td className="has-text-right is-vcentered">
                <button
                  data-cy="selectButton"
                  className="button"
                  type="button"
                  onClick={() => setSelectedTodo(todoItem)}
                >
                  <span className="icon">
                    <i
                      className={`far ${selectedTodo === todoItem ? 'fa-eye-slash' : 'fa-eye'}`}
                    />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={() => setSelectedTodo(null)} />
      )}
    </>
  );
};
