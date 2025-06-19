import React from "react";

function Item({item, deleteItem, deleteItem}){
    return(
        <li>
        {item.value}
        <button onClick={() => deleteItem(item.id)}>Delete</button>
        <button onClick={() => editItem(item)}>Edit</button>
        </li>
    );
}
export default Item;