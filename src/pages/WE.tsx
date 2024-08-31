import React, { useMemo, FC } from 'react';
import { Route } from 'react-router-dom';
import {
	IonIcon,
	IonLabel,
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonRouterOutlet
} from '@ionic/react';

import { PageData } from '../store/types';

import { appPagesObject } from '../components/appPagesInfo';
import WECharGroups from "./we/WEcharactergroups";
import WETransforms from "./we/WEtransforms";
import WESounds from "./we/WEsounds";
import WEInput from "./we/WEinput";
import WEOutput from "./we/WEoutput";
import WEinfo from './we/WEinfo';


const WE: FC<PageData> = (props) => {
	const tabs = useMemo(() => appPagesObject.we.filter(obj => !obj.hidden).map(obj => {
		const { title, tabTitle, url, tab, icon, Icon } = obj;
		return (
			<IonTabButton tab={tab!} href={url} key={"wgTab-" + tab}>
				{icon ? <IonIcon icon={icon} /> : Icon ? <Icon /> : <></>}
				<IonLabel>{tabTitle || title}</IonLabel>
			</IonTabButton>
		);
	}), []);
	return (
		<IonTabs>
			<IonRouterOutlet placeholder>
				{/*
					Using the render method prop cuts down the number of renders your components will have due to route changes.
					Use the component prop when your component depends on the RouterComponentProps passed in automatically.
				*/}
				<Route path="/we/overview" render={() => <WEinfo {...props} />} exact={true} />
				<Route path="/we/input" render={() => <WEInput {...props} />} exact={true} />
				<Route path="/we/charGroups" render={() => <WECharGroups {...props} />} exact={true} />
				<Route path="/we/transformations" render={() => <WETransforms {...props} />} exact={true} />
				<Route path="/we/soundchanges" render={() => <WESounds {...props} />} exact={true} />
				<Route path="/we/output" render={() => <WEOutput {...props} />} exact={true} />
			</IonRouterOutlet>
			<IonTabBar slot="bottom">
				{tabs}
			</IonTabBar>
		</IonTabs>
	);
};

export default WE;
