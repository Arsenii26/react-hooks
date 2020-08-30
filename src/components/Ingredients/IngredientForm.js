import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from "../UI/LoadingIndicator";
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [enteredTitle, setEnteredTitle] = useState(''); // array destructiuring
  const [enteredAmount, setEnteredAmount] = useState(''); // array destructiuring

    console.log('RENDERING INGREDIENT FORM'); // debug

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount}); // update array
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"
            // value={inputState.title}
            value={enteredTitle}
                   // // getting prev state for amount by prevInputState.amount
                   // onChange={event => {
                   //     const newTitle = event.target.value // creating const to force to create new object
                   //     setInputState( prevInputState => (
                   //     {title: newTitle, amount: prevInputState.amount}
                   //     ));}
                   onChange={event => {
                       setEnteredTitle(event.target.value);
                   }
                   }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount"
                   // value={inputState.amount}
                   value={enteredAmount}
                   // onChange={event => {
                   //     const newAmount = event.target.value
                   //     setInputState(prevInputState => (
                   //     {amount: newAmount, title: prevInputState.title}
                   // ));}
                   onChange={event => {
                       setEnteredAmount(event.target.value);
                   }
                   }/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
              {/*{props.loading ? <LoadingIndicator/> : null}*/}
              {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
