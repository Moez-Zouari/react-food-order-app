import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  // Ajouter un Item
  if (action.type === "ADD") {
    // Calculer le montant total
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // Verifier si le produit existe deja dans la carte ou pas
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // Obtenir l'element de carte existant
    const existingCartItem = state.items[existingCartItemIndex];

    let updatedItems;

    // Midifier la quantité de l'item
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };

      // Recupérer les items de la carte
      updatedItems = [...state.items];
      // Mettre a jour la carte avec les nouveau données de l'item ajouter
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // S'il nexiste pas , ajouter le nouveau item  a la carte pour la premiére fois
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  // Delete Item
  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];
    // Calculer le montant total
    const updatedTotalAmount = state.totalAmount - existingItem.price;

    let updatedItems;
    // Filter un nouveau tableau en ecrassant l'item depuis la carte
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    }
    // Conserver l'item dans la carte mais minimiser la quatité par 1
    else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      // Recuperer les items de la carte
      updatedItems = [...state.items];
      // Mettre a jour la carte avec l'itema diminuer
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
