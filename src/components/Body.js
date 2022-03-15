import ItemList from './ItemList'

const Body = ( { items, handleCheck, handleDelete } ) => {

  return (
    <div>
      {items.length ? (
       <ItemList
       items = {items}
       handleCheck = {handleCheck}
       handleDelete = {handleDelete}
       />
       ) : (
       <h1>No items to display</h1> 
       )}
    </div>
  )
}

export default Body