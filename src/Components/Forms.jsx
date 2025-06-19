import React, {useState, useEffect} from "react";

function Forms({ addOrUpdateItem, itemToEdit}) {
    const [inputValue, setInputValue] = useState('');

useEffect(() => {
    if (itemToEdit) {
        setInputValue(itemToEdit.value);
    } else {
        setInputValue('');
    }
}, [itemToEdit]);
const handleSubmit = (e) => {
    if(inputValue.trim()){
    e.preventDefault();
        addOrUpdateItem(inputValue);
        setInputValue('');
        
        }
    };
return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => 
                setInputValue(e.target.value)}   
            />
            <button type="submit">{itemToEdit ? "Update" : "Add"}</button>
        </form>
    );
}
export default Forms;