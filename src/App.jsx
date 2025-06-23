import { useState, useEffect } from 'react'
import Forms from './Components/Forms'
import List from './Components/List'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [itemToEdit, setItemsToEdit] = useState(null)

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  }, [])

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const addOrUpdateItem = (value) => {
    if (itemToEdit) {
      setItems(items.map(item =>
        item.id === itemToEdit.id ? { ...item, value } : item
      ));
      setItemsToEdit(null);
    } else {
      setItems([...items, { id: Date.now(), value }]);
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const editItem = (item) => {
    setItemsToEdit(item);
  };

  return (
    <>
      <div className="App">
        <h1>CRUD con LocalStorage</h1>
        <Forms addOrUpdateItem={addOrUpdateItem} itemToEdit={itemToEdit} />
        <List items={items} deleteItem={deleteItem} editItem={editItem} />
      </div>
    </>
  );
}

export default App;
