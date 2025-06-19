import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [itemToEdit, setItemsToEdit] = useState(null)
  useEffects(() => {
    const storeItems =
  JSON.parse(localStorage.getItem('items')) || [];
  setItems(storedItems);
}, [])

useEffects(() => {
  localStorage.setItem('items', JSON.stringify(items));
}, [items]);
const addOrUpdateItem = (value) => {
  if (itemToEdit) {
    selItems(items.map(item => item=id === itemToEdit.id ? { ...item, value } : item));
    setItemsToEdit(null);
  } else {
    setItems([...items, { id: Date.now(), value }]);
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
        <List items={itemToEdit} deleteItem={deleteItem} editItem={editItem} />
      </div>
    </>
  );
}

export default App;
