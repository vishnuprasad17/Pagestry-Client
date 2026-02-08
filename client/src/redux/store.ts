import { configureStore } from'@reduxjs/toolkit';
import cartReducer from'./features/slices/cartSlice';
import authReducer from './features/slices/authSlice';
import adminReducer from './features/slices/adminSlice';
import checkoutReducer from './features/slices/checkoutSlice';
import authApi from './features/auth/authApi';
import bookApi from './features/books/bookApi';
import orderApi from './features/orders/orderApi';
import adminApi,{ adminApiReducer, adminApiMiddleware} from './features/admin/adminApi';
import userApi from './features/user/userApi';
import reviewApi from './features/review/reviewApi';
import categoryApi from './features/categories/categoryApi';
import cartApi from './features/cart/cartApi';
import authorApi from './features/authors/authorApi';
import bannerApi from './features/banners/bannerApi';
import addressApi from './features/address/addressApi';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/* ---------------- Persist configs ---------------- */

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const authPersistConfig = {
  key: 'auth',
  storage,
}

const adminPersistConfig = {
  key: 'admin',
  storage,
}

const checkoutPersistConfig = {
  key: 'checkout',
  storage,
}

/* ---------------- Persisted reducers ---------------- */

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);

/* ---------------- Store ---------------- */

export const store = configureStore({
    reducer: {
        cart: persistedCartReducer,
        auth: persistedAuthReducer,
        admin: persistedAdminReducer,
        checkout: persistedCheckoutReducer,
        [authApi.reducerPath]: authApi.reducer,
        [bookApi.reducerPath]: bookApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [adminApi.reducerPath]: adminApiReducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [authorApi.reducerPath]: authorApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [addressApi.reducerPath]: addressApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(
            authApi.middleware,
            bookApi.middleware,
            orderApi.middleware,
            adminApiMiddleware,
            userApi.middleware,
            reviewApi.middleware,
            categoryApi.middleware,
            cartApi.middleware,
            authorApi.middleware,
            bannerApi.middleware,
            addressApi.middleware
        ),
});

export const persistor = persistStore(store);

/* ---------------- REQUIRED TYPES ---------------- */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;