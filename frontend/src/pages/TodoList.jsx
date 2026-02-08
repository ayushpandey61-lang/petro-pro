import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const TodoList = () => {
  const { t } = useTranslation();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t('add_new_task') || 'Add new task...'}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addTodo)}
          className="flex-1"
        />
        <Button onClick={addTodo}>
          <Plus className="h-4 w-4 mr-2" />
          {t('add') || 'Add'}
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            {editingId === todo.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                  className="flex-1"
                />
                <Button size="sm" onClick={saveEdit}>
                  {t('save') || 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  {t('cancel') || 'Cancel'}
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEdit(todo.id, todo.text)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {t('no_tasks_yet') || 'No tasks yet. Add one above!'}
        </p>
      )}
    </div>
  );
};

export default TodoList;