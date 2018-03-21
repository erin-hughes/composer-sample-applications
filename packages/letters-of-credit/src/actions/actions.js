export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const GET_RULES = 'GET_RULES';

export function getProductDeatils(productDetails) {
   return {
      type: GET_PRODUCT_DETAILS,
      payload: productDetails
   };
}

export function getRules(rules) {
   return {
      type: GET_RULES,
      payload: rules
   };
}
