import {combineReducers} from 'redux'
import * as actions from '../actions/actions'

const initialState = {
  productDetails: {
    type: "",
    quantity: 0,
    pricePerUnit: "",
    total: ""
  },
  rules: []
}

const getLetterInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_PRODUCT_DETAILS:
      return { ...state, productDetails: action.payload };
    case actions.GET_RULES:
      return { ...state, rules: [...state.rules, action.payload] };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
   getLetterInputReducer
})

export default rootReducer;
