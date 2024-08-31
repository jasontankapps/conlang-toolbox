import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
	createMigrate,
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';

import debounce from '../components/Debounce';
import maybeUpdateTheme from '../components/MaybeUpdateTheme';
import { CustomStorageWE } from '../components/PersistentInfo';
//import packageJson from '../package.json';
import msSlice from './msSlice';
import conceptsSlice from './conceptsSlice';
import settingsSlice from './settingsSlice';
import lexiconSlice from './lexiconSlice';
import wgSlice from './wgSlice';
import weSlice from './weSlice';
import extraCharactersSlice from './extraCharactersSlice';
import sortingSlice from './sortingSlice';
import declenjugatorSlice from './declenjugatorSlice';
import blankAppState from './blankAppState';
import internalsSlice from './internalsSlice';
import { AppSettings, ConceptDisplay, ConceptDisplayObject, ThemeNames } from './types';

//
//
//
// ----- USE THIS to put in temporary changes for testing.
const initialAppState = {...blankAppState};
// ----- END
//
//

// BELOW is where version adjustments can happen
const migrations = {
	1: (state: any) => {
		// change state here and return it
		const newState = {
			...state,
			// Add declenjugator
			dj: {
				input: "",
				declensions: [],
				conjugations: [],
				other: []
			},
			// Add internals
			internals: {
				logs: [],
				lastClean: 0,
				defaultSortLanguage: (state.sortSettings && state.sortSettings.defaultSortLanguage) || "unicode",
				lastViewMS: "msSettings"
			}
		};
		// Delete unused properties
		delete newState.wg.storedCustomInfo;
		delete newState.wg.storedCustomIDs;
		delete newState.we.storedCustomInfo;
		delete newState.we.storedCustomIDs;
		delete newState.ms.storedCustomInfo;
		delete newState.ms.storedCustomIDs;
		delete newState.lexicon.storedCustomInfo;
		delete newState.lexicon.storedCustomIDs;
		// Remove viewState
		delete newState.viewState;
		// Change a property name in WE's custom storage
		CustomStorageWE.keys().then((values: string[]) => {
			values.forEach(key => {
				CustomStorageWE.getItem(key).then((value: any) => {
					if(value) {
						const newValue = {...value};
						if(newValue.soundchanges) {
							newValue.soundChanges = newValue.soundchanges;
							delete newValue.soundchanges;
							CustomStorageWE.setItem(key, newValue);
						}
					}
				});
			});
		});
		return newState;
	},
	2: (state: any) => {
		// Updates Concepts for 0.12.0
		const newState = {...state};
		const display: ConceptDisplayObject = {};
		((state.concepts.display || []) as ConceptDisplay[]).forEach(prop => display[prop] = true);
		newState.concepts.display = display;
		return newState;
	},
	3: (state: any) => {
		// Fix potential bugs with "Solarized Light" becoming "SolarizedLight", etc
		const newState = {...state};
		const appState: AppSettings = {
			...newState.appSettings
		};
		appState.theme = (appState.theme.replace(/ /g, "") as ThemeNames);
		newState.appSettings = appState;
		console.log({...state});
		console.log({...appState});
		console.log({...newState});
		return newState;
	}
}

const reducerConfig = {
	// SLICES here
	appSettings: settingsSlice,
	we: weSlice,
	wg: wgSlice,
	ms: msSlice,
	dj: declenjugatorSlice,
	concepts: conceptsSlice,
	lexicon: lexiconSlice,
	ec: extraCharactersSlice,
	sortSettings: sortingSlice,
	internals: internalsSlice
};
const stateReconciler = (incomingState: any, originalState: any, reducedState: any, config: any) => {
	if(
		incomingState
		&& originalState
		&& incomingState.appSettings
		&& originalState.appSettings
		&& (incomingState.appSettings.theme !== originalState.appSettings.theme)
	) {
		debounce<(x: string, y: string) => void, string>(
			maybeUpdateTheme,
			[
				originalState.appSettings.theme as string || "Default",
				incomingState.appSettings.theme as string || "Default"
			],
			100,
			"rehydrateTheme"
		);
	}
	return autoMergeLevel1(incomingState, originalState, reducedState, config);
};
const persistConfig = {
	key: 'root',
	version: 3,
	storage,
	stateReconciler,
	migrate: createMigrate(migrations, { debug: false })
};
const reducer = combineReducers(reducerConfig);
const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
	reducer: persistedReducer,
	preloadedState: initialAppState,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
					'lexicon/addLexiconItem',
					'lexicon/addItemsToLexiconColumn',
					'lexicon/doEditLexiconItem',
					'lexicon/updateLexiconSort',
					'lexicon/updateLexiconSortDir',
					'lexicon/mergeLexiconItems',
					'lexicon/updateLexiconColumarInfo'
				],
			},
		})
});
const persistor = persistStore(store);
const storeInfo = { store, persistor };

/* THE BELOW IS RECOMMENDED, but I don't know if I need it. Keeping it just in case I want it later.
// Infer the `RootState` and `AppDispatch` types from the store itself

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
*/

export default storeInfo;
