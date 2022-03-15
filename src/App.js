import Header from './components/Header'
import AddItem from './components/AddItem'
import Body from './components/Body'
import Footer from './components/Footer'
import SearchItem from './components/SearchItem'
import { useState, useEffect } from 'react'
import apiRequest from './apiRequest'

function App() {

  const API_URL = 'http://localhost:3500/items'

  const[items, setItems] = useState( [] );

  const[newItem, setNewItem] = useState('')

  const [search, setSearch] = useState('')

  const [fetchError, setFetchError] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {

      const fetchItems = async () => {
        try{
          const response = await fetch(API_URL);
          if(!response.ok) throw Error('Did not recieve expected Data');
          const listItems = await response.json()
          setItems(listItems)
          console.log(listItems) 
          setFetchError(null)
        }
        catch(err){
          setFetchError(err.message)
          console.log(err.stack)
        } finally {
          setIsLoading(false)
        }
      }
      (async () => await fetchItems())();
  }, [ ])

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id +1 : 1;
    const myNewItem = { id, item, checked: false};
    const listItems = [... items, myNewItem];
    setItems(listItems)

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    
    const result = await apiRequest(API_URL, postOptions)
    if (result) setFetchError(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return; //return here means exiting the function completely as no new item has been added
    addItem(newItem);
    setNewItem('') //resetting the text box as empty
  }

  const handleCheck = async (id) => {
    const listItems = items.map( (item) => item.id === id ? {...item, checked: !item.checked} : item);
    setItems(listItems)

    const myItem = listItems.filter( (item) => item.id === id )
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    };
    const reqUrl= `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems)

    const deleteOptions = { method: 'DELETE' };
    const reqUrl= `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions );
    if (result) setFetchError(result);
  }

  return(
    <div className='App'>
    
    <Header title = 'Title'/>
      
    <AddItem 
      newItem = {newItem}
      setNewItem = {setNewItem}
      handleSubmit = {handleSubmit}
    />

    <SearchItem
      search={search}
      setSearch={setSearch}
    />
    <main>
      {isLoading && <p>Loading Items....</p>}
      {fetchError && <p style={{color: 'red'}} >{`Error: ${fetchError}`}</p>}
      {!fetchError && !isLoading && <Body
        items = {items.filter(item => ((item.item).toLowerCase()).includes(search.toLocaleLowerCase()))}
        handleCheck = {handleCheck}
        handleDelete = {handleDelete}
        />}
    </main>
    <Footer  />
    </div>
  );
}

export default App;
