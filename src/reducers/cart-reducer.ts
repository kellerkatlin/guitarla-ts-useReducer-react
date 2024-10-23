import { db } from "../data/db";
import { CartItem, Guitar } from "../interface";

export interface CartActions {
    type:
        | "add-to-cart"
        | "remove-from-cart"
        | "decrease-quantity"
        | "increase-quantity"
        | "clear-cart";
    payload: {
        item: Guitar;
        id: Guitar["id"];
    };
}

export interface CartState {
    data: Guitar[];
    cart: CartItem[];
}

const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
    data: db,
    cart: initialCart(),
};

const Max_Items = 5;

const Min_Items = 1;

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === "add-to-cart") {
        const itemExists = state.cart.find(
            (guitar) => guitar.id === action.payload.item.id
        );
        let updateCart: CartItem[] = [];
        if (itemExists) {
            updateCart = state.cart.map((item) => {
                if (item.id === action.payload.item.id) {
                    if (item.quantity < Max_Items) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        return item;
                    }
                } else {
                    return item;
                }
            });
        } else {
            const newItem: CartItem = { ...action.payload.item, quantity: 1 };
            updateCart = [...state.cart, newItem];
        }
        return {
            ...state,
            cart: updateCart,
        };
    }

    if (action.type === "remove-from-cart") {
        return {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
    }
    if (action.type === "increase-quantity") {
        const cart = state.cart.map((item) => {
            if (item.id === action.payload.id && item.quantity < Max_Items) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            }
            return item;
        });
        return {
            ...state,
            cart,
        };
    }
    if (action.type === "decrease-quantity") {
        return {
            ...state,
            cart: state.cart.map((item) =>
                item.id === action.payload.id
                    ? {
                          ...item,
                          quantity:
                              item.quantity > Min_Items ? item.quantity - 1 : 1,
                      }
                    : item
            ),
        };
    }
    if (action.type === "clear-cart") {
        return {
            ...state,
            cart: [],
        };
    }
    return state;
};
