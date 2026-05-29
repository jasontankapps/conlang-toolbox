import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { Route } from 'react-router-dom';
import {
	IonLabel,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonRouterOutlet,
	IonIcon,
	IonActionSheet,
	ActionSheetButton,
	useIonRouter
} from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useLongPress } from '@uidotdev/usehooks';
import { useSelector } from "react-redux";
import { chevronBackCircle, chevronForwardCircle, settingsSharp } from 'ionicons/icons';

import { StateObject } from '../store/types';

import MSinfo from './ms/MSinfo';
import MSPage from './ms/msPage';
import MSSettings from "./ms/msSettings";
import './ms/MS.css';

const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getN = (n: number): string => {
	if(n > 0) {
		let goto = String(n);
		while(goto.length < 2) {
			goto = "0" + goto;
		}
		return goto;
	}
	return "Settings";
};

const makeTab = (n: number, min: number, max: number) => {
	const goto = getN(n);
	return (
		<IonTabButton
			className={n < min || n > max ? "possiblyTooFar" : ""}
			key={`MS-tab-${n}`}
			tab={"Section-" + goto}
			layout="icon-hide"
			href={"/ms/ms" + goto}
		>
			<IonLabel>{
				n > 0 ?
					(<strong>{n}</strong>)
				:
					(<IonIcon className="align-middle" icon={settingsSharp} />)
			}</IonLabel>
		</IonTabButton>
	);
};

const MS: FC = () => {
	const msPage: string = useSelector((state: StateObject) => state.internals.lastViewMS) || "msSettings";
	const [lastPage, setLastPage] = useState<number>(Number(msPage.slice(-2)) || 0);
	// 'center' should not fall more that two places from an edge
	const [center, setCenter] = useState<number>(Math.min(Math.max(lastPage, 2), 8));
	const [min, setMin] = useState<number>(center - 2);
	const [max, setMax] = useState<number>(center + 2);
	const [prevOpen, setPrevOpen] = useState<boolean>(false);
	const [nextOpen, setNextOpen] = useState<boolean>(false);
	const longPressPrev = useLongPress(() => {
		Haptics.impact({ style: ImpactStyle.Light });
		setPrevOpen(true);
	}, {});
	const longPressNext = useLongPress(() => {
		Haptics.impact({ style: ImpactStyle.Light });
		setNextOpen(true);
	}, {});
	const navigator = useIonRouter();
	const modifyTabBar = useCallback((n: number) => {
		// move center to 'n'
		const mod = Math.min(Math.max(n, 2), 8);
		setCenter(mod);
		setMin(mod - 2);
		setMax(mod + 2);
	}, []);
	useEffect(() => {
		// Possibly change tab bar
		const newCenter = Number(msPage.slice(-2)) || 0;
		if(newCenter !== lastPage) {
			// page has changed
			setLastPage(newCenter);
			if(newCenter > max || newCenter < min) {
				// page is outside the current view
				modifyTabBar(newCenter);
			}
		}
	}, [msPage, modifyTabBar, max, min, lastPage]);

	const allTabs = useMemo(() => range.map((n: number) => makeTab(n, min, max)), [min, max]);
	const modUp = useCallback(() => modifyTabBar(center + 2), [center, modifyTabBar]);
	const modDown = useCallback(() => modifyTabBar(center - 2), [center, modifyTabBar]);
	return (
		<IonTabs>
			<IonRouterOutlet>
				{/*
					Using the render method prop cuts down the number of renders your components will have due to route changes.
					Use the component prop when your component depends on the RouterComponentProps passed in automatically.
				*/}
				<Route path="/ms/overview" render={() => <MSinfo />} exact={true} />
				<Route path="/ms/msSettings" render={() => <MSSettings />} exact={true} />
				<Route path="/ms/ms01" render={() => <MSPage page="01" />} exact={true} />
				<Route path="/ms/ms02" render={() => <MSPage page="02" />} exact={true} />
				<Route path="/ms/ms03" render={() => <MSPage page="03" />} exact={true} />
				<Route path="/ms/ms04" render={() => <MSPage page="04" />} exact={true} />
				<Route path="/ms/ms05" render={() => <MSPage page="05" />} exact={true} />
				<Route path="/ms/ms06" render={() => <MSPage page="06" />} exact={true} />
				<Route path="/ms/ms07" render={() => <MSPage page="07" />} exact={true} />
				<Route path="/ms/ms08" render={() => <MSPage page="08" />} exact={true} />
				<Route path="/ms/ms09" render={() => <MSPage page="09" />} exact={true} />
				<Route path="/ms/ms10" render={() => <MSPage page="10" />} exact={true} />
			</IonRouterOutlet>
			<IonTabBar className="iconsOnly" slot="bottom">
				<IonTabButton
					className="moreIndicators"
					tab="more to left"
					layout="label-hide"
					onClick={modDown}
					disabled={center <= 2}
					{...longPressPrev}
				>
					<IonIcon icon={chevronBackCircle} className="align-middle" />
				</IonTabButton>
				{allTabs}
				<IonTabButton
					className="moreIndicators"
					tab="more to right"
					layout="label-hide"
					onClick={modUp}
					disabled={center >= 8}
					{...longPressNext}
				>
					<IonIcon icon={chevronForwardCircle} className="align-middle" />
				</IonTabButton>
			</IonTabBar>
			<IonActionSheet
				className="historySheet pagesPrev"
				isOpen={prevOpen}
				onDidDismiss={() => setPrevOpen(false)}
				buttons={
					range.filter(n => n < min).map(n => ({
						text: n ? `Page ${n}` : "Settings",
						handler: () => {
							Haptics.impact({ style: ImpactStyle.Light });
							navigator.push(`/ms/ms${getN(n)}`);
						}
					} as ActionSheetButton)).concat([{ text: "Cancel", role: "cancel" }])
				}
			/>
			<IonActionSheet
				className="historySheet pagesNext"
				isOpen={nextOpen}
				onDidDismiss={() => setNextOpen(false)}
				buttons={
					range.filter(n => n > max).map(n => ({
						text: `Page ${n}`,
						handler: () => {
							Haptics.impact({ style: ImpactStyle.Light });
							navigator.push(`/ms/ms${getN(n)}`);
						}
					} as ActionSheetButton)).concat([{ text: "Cancel", role: "cancel" }])
				}
			/>
		</IonTabs>
	);
};

export default MS;
