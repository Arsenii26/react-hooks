import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    const [enteredFilter, setEnteredFilter] = useState('');
    
    // object distructuring
    const { onLoadIngredients } = props;

    // create ref to DOM property
    const inputRef = useRef(); // to make request NOT EVERY 1 MS BUT WITH TIMER

    // search field get all ingredients
    useEffect(() => {
        const timer = setTimeout(() => {
            if (enteredFilter === inputRef.current.value) { // enteredFilter will has value 500 ms ago
                // if value not changed
                const query =
                    enteredFilter.length === 0 ?
                        '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                fetch('https://react-hooks-update-c15f8.firebaseio.com/ingredients.json' + query)
                    .then(response => response.json())
                    .then(responseData => {
                        const loadedIngredients = [];
                        for (const key in responseData) {
                            loadedIngredients.push({
                                id: key,
                                title: responseData[key].title,
                                amount: responseData[key].amount
                            });
                        }
                        onLoadIngredients(loadedIngredients); // prevent infinite loop by filteredIngredientsHandler() from Ingredients.js
                    });
            }

        }, 500); // not make request every ms
        return () => {
            clearTimeout(timer); // CLEAN TIMER HERE
        }; // clean up timer!!! with old effect
    }, [enteredFilter, onLoadIngredients, inputRef]); // run this effect only if onLoadIngredients changed!!!!!!! cuz object destructuring

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
              ref={inputRef}
              type="text"
                 value={enteredFilter}
                 onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
