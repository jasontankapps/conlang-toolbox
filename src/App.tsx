import React, { useEffect, useState, memo, useMemo, lazy, Suspense } from 'react';
import {
	Route
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { compare } from 'compare-versions';
import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	useIonAlert,
	useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as Capacitor, BackButtonListenerEvent } from '@capacitor/app';
import { LanguageCode } from 'iso-639-1';
import { useTranslation } from 'react-i18next';

// Polyfill for Intl.PluralRules
import 'intl-pluralrules';

import { setDefaultSortLanguage } from './store/internalsSlice';
import { SetBooleanState, StateObject } from './store/types';
import maybeCleanState from './store/cleaning';

import Menu from './components/Menu';

import About from "./pages/About";
import Settings from "./pages/AppSettings";
import SortSettings from './pages/SortSettings';
import Info from './pages/AppInfo';
import Loading from './pages/Loading';

import doUpdate095 from './updaters/UpdateTo095';
import doUpdate0100 from './updaters/UpdateTo0100';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
/* My theming */
import './theme/App.css';

import { StateStorage } from './components/PersistentInfo';
import modalPropertiesFunc from './components/ModalProperties';
import yesNoAlert from './components/yesNoAlert';
import getLanguage from './components/getLanguage';

export const MainOutlet = memo(() => {
	const [modals, setModals] = useState<SetBooleanState[]>([]);
	const [doAlert] = useIonAlert();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const modalPropsMaker = useMemo(() => modalPropertiesFunc(modals, setModals), [modals, setModals]);
	const defaultProps = {
		modalPropsMaker
	};
	useEffect(() => {
		getLanguage().then(result => {
			if(result) {
				dispatch(setDefaultSortLanguage(result.slice(0, 2) as LanguageCode));
			}
		});
	}, [dispatch]);
	const navigator = useIonRouter();
	useEffect((): (() => void) => {
		// NOTE: Back Button will automatically go back in history for us.
		return Capacitor.addListener('backButton', (ev: BackButtonListenerEvent) => {
			if(modals.length) {
				// Close an open modal
//				dispatch(addToLog("Attempting to close modal."));
				// Get last modal
				const [last, ...rest] = modals;
				// Save remaining modals
				setModals(rest);
				// Close last modal
				last(false);
/*			} else if (pages.length > 0) {
				dispatch(addToLog("Navigating backward?"));
				// go back
				history.go(-1);
				console.log("!back");
			} else {*/
			} else if (!navigator.canGoBack()) {
				// Are we trying to exit the app?
				yesNoAlert({
					header: t("ExitAppQHead"),
					message: t("ExitAppQ"),
					cssClass: "warning",
					submit: t("YesExit"),
					handler: Capacitor.exitApp,
					doAlert
				});
			}
		}).remove;
	}, [modals, navigator, dispatch, doAlert, t]);
	return (
		<IonRouterOutlet placeholder>
			<Route path="/wg" component={() => <WG {...defaultProps} />} />
			<Route path="/we" component={() => <WE {...defaultProps} />} />
			<Route path="/dj" component={() => <DJ {...defaultProps} />} />
			<Route path="/lex" component={() => <Lexicon {...defaultProps} />} />
			<Route path="/ms" component={() => <MS {...defaultProps} />} />
			<Route path="/appinfo" exact component={() => <Info {...defaultProps} />} />
			<Route path="/settings" component={() => <Settings {...defaultProps} />} />
			<Route path="/sortSettings" component={() => <SortSettings {...defaultProps} />} />
			<Route path="/wordlists" component={() => <ConceptsPage {...defaultProps} />} />
			<Route path="/" exact component={() => <About {...defaultProps} />} />
		</IonRouterOutlet>
	);
});

const MS = lazy(() => import("./pages/MS"));
const WG = lazy(() => import("./pages/WG"));
const WE = lazy(() => import("./pages/WE"));
const DJ = lazy(() => import("./pages/Declenjugator"));
const Lexicon = lazy(() => import("./pages/Lex"));
const ConceptsPage = lazy(() => import("./pages/Concepts"));

const App = memo(() => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { lastClean } = useSelector((state: StateObject) => state.internals)
	// useEffect should keep this from firing except once per session
	useEffect(() => {
		// 0.9.5 and older
		StateStorage.getItem("lastState").then((storedState: any) => {
			if(storedState !== null) {
				if(storedState && (typeof storedState) === "object") {
					if (compare(storedState.currentVersion, "0.9.5", "<")) {
						storedState = doUpdate095(storedState);
					}
					doUpdate0100(storedState, dispatch);
					// We're not doing global state again.
					StateStorage.removeItem("lastState");
				}
			}
		});
	}, [dispatch]);
	// Clean state if needed
	useEffect(() => {
		maybeCleanState(dispatch, lastClean);
	}, [dispatch, lastClean]);
	const [modals, setModals] = useState<SetBooleanState[]>([]);
	const [doAlert] = useIonAlert();
	const modalPropsMaker = useMemo(() => modalPropertiesFunc(modals, setModals), [modals, setModals]);
	const defaultProps = {
		modalPropsMaker
	};
	// Check for default sort language
	useEffect(() => {
		getLanguage().then(result => {
			if(result) {
				dispatch(setDefaultSortLanguage(result.slice(0, 2) as LanguageCode));
			}
		});
	}, [dispatch]);
	const navigator = useIonRouter();
	// Listen for back button
	useEffect((): (() => void) => {
		// NOTE: Back Button will automatically go back in history for us.
		return Capacitor.addListener('backButton', (ev: BackButtonListenerEvent) => {
			if(modals.length) {
				// Close an open modal
//				dispatch(addToLog("Attempting to close modal."));
				// Get last modal
				const [last, ...rest] = modals;
				// Save remaining modals
				setModals(rest);
				// Close last modal
				last(false);
/*			} else if (pages.length > 0) {
				dispatch(addToLog("Navigating backward?"));
				// go back
				history.go(-1);
				console.log("!back");
			} else {*/
			} else if (!navigator.canGoBack()) {
				// Are we trying to exit the app?
				yesNoAlert({
					header: t("ExitAppQHead"),
					message: t("ExitAppQ"),
					cssClass: "warning",
					submit: t("YesExit"),
					handler: Capacitor.exitApp,
					doAlert
				});
			}
		}).remove;
	}, [modals, navigator, dispatch, doAlert, t]);
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main" when="xl">
					<Menu />
					<IonRouterOutlet id="main" placeholder>
						<Route path="/wg" render={() => <Suspense fallback={<Loading />}><WG {...defaultProps} /></Suspense>} />
						<Route path="/we" render={() => <Suspense fallback={<Loading />}><WE {...defaultProps} /></Suspense>} />
						<Route path="/dj" render={() => <Suspense fallback={<Loading />}><DJ {...defaultProps} /></Suspense>} />
						<Route path="/lex" render={
							() => <Suspense fallback={<Loading />}><Lexicon {...defaultProps} /></Suspense>
						} />
						<Route path="/ms" render={() => <Suspense fallback={<Loading />}><MS {...defaultProps} /></Suspense>} />
						<Route path="/appinfo" exact render={() => <Info {...defaultProps} />} />
						<Route path="/settings" exact render={() => <Settings {...defaultProps} />} />
						<Route path="/sortSettings" exact render={() => <SortSettings {...defaultProps} />} />
						<Route path="/wordlists" exact render={
							() => <Suspense fallback={<Loading />}><ConceptsPage {...defaultProps} /></Suspense>
						} />
						<Route path="/" exact render={() => <About {...defaultProps} />} />
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	);
});

export default App;
