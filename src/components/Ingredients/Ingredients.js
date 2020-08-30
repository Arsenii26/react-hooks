import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';
// import useHttp from "../../hooks/http"; // my custom hook

const ingredientReducer = (currentIngredientState, action) => {
    switch (action.type) {
        case'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredientState, action.ingredient];
        case 'DELETE':
            return currentIngredientState.filter(ing => ing.id !== action.id);
        default:
            throw new Error('Shouldn\'t be there');
    }
};

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null}; // set all states
        case 'RESPONSE':
            return {...curHttpState, loading: false}; // take all state and override with mutches values
        case 'ERROR':
            return {loading: false, error: action.errorMessage };
        case 'CLEAR':
            return {...curHttpState, error: null };
        default:
            throw new Error('Should not be reached!');
    }
}

const Ingredients = () => {

    const[userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const[httpState, dispatchHttp] = useReducer(
        httpReducer, {loading: false, error: null});

    // const [ userIngredients, setUserIngredients] = useState([]);
    // const [ isLoading, setIsLoading] = useState(false);
    // const [ error, setError] = useState();

    // // get all ingredients (same with Search ingredients)
    // useEffect(() => {
    //     fetch('https://react-hooks-update-c15f8.firebaseio.com/ingredients.json')
    //         .then(response => response.json())
    //         .then(responseData => {
    //             const loadedIngredients = [];
    //             for (const key in responseData) {
    //                 loadedIngredients.push({
    //                     id: key,
    //                     title: responseData[key].title,
    //                     amount: responseData[key].amount
    //                 });
    //             }
    //             setUserIngredients(loadedIngredients); // infinite loop
    //     });
    // }, []); //  fixing infinite loop by [] than it will works like componentDidMount (it will run once)

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        // setUserIngredients(filteredIngredients);
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    const addIngredientHandler = useCallback(ingredient => {
        // setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        fetch('https://react-hooks-update-c15f8.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient), // take object and convert to JavaScript format
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            // setIsLoading(false);
            dispatchHttp({type: 'RESPONSE'});
            return response.json();
        }).then(responseData => {
            // // update object with useState()
            // setUserIngredients(prevIngredients => [...prevIngredients,
            //     {id: responseData.name, ...ingredient}]);

            // with useReducer()
            dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
        }); // send request

    }, []);

    const removeIngredientHandler = useCallback(ingredientId => {
        // setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        fetch(`https://react-hooks-update-c15f8.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE',
        }).then(
            response => {
                // setIsLoading(false);
                dispatchHttp({type: 'RESPONSE'});
                // with useState()
                // setUserIngredients(prevIngredients =>
                //     prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
                // with useReducer()
                dispatch({type: 'DELETE', id: ingredientId});
            }
        ).catch(error => {
            // setError("Smth went wrong");
            // setIsLoading(false);

            dispatchHttp({type: 'ERROR', errorMessage: "Smth went wrong"})
        });
    }, []);

    const clearError = useCallback(() => {
        // setError(null);
        dispatch({type: 'CLEAR'});
    }, []);

    const ingredientList = useMemo(() => {
       return (<IngredientList
            ingredients={userIngredients}
            onRemoveItem={removeIngredientHandler}/>
       )
    }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
        {/*clear error*/}
        {/*{error && <ErrorModal onClose>{clearError}</ErrorModal>}*/}
        {httpState.error && <ErrorModal onClose>{httpState.error}</ErrorModal>}



      {/*<IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>*/}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.error}/>


      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {/* Need to add list here! */}
          {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
