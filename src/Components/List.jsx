import React from "react";
import Item from "./Item";

function List({ items, deleteItem, editItem }) {
    return(
        <ul>
        {items.map((item)(
            <Item 
                key={item.id} 
                item={item} 
                deleteItem={deleteItem} 
                editItem={editItem} 
            />
        ))}
        </ul>
    );
}
export default List;