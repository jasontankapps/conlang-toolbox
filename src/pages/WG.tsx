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
import WGCharGroups from "./wg/WGcharactergroups";
import WGTransforms from "./wg/WGtransforms";
import WGSyllables from "./wg/WGsyllables";
import WGOutput from "./wg/WGoutput";
import WGSettings from "./wg/WGsettings";
import WGinfo from './wg/WGinfo';


const WG: FC<PageData> = (props) => {
	const tabs = useMemo(() => appPagesObject.wg.filter(obj => !obj.hidden).map(obj => {
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
				<Route path="/wg/overview" render={() => <WGinfo {...props} />} exact={true} />
				<Route path="/wg/charGroups" render={() => <WGCharGroups {...props} /> } exact={true} />
				<Route path="/wg/syllables" render={() => <WGSyllables {...props} />} exact={true} />
				<Route path="/wg/transforms" render={() => <WGTransforms {...props} />} exact={true} />
				<Route path="/wg/output" render={() => <WGOutput {...props} />} exact={true} />
				<Route path="/wg/settings" render={() => <WGSettings {...props} />} exact={true} />
			</IonRouterOutlet>
			<IonTabBar slot="bottom">
				{tabs}
			</IonTabBar>
		</IonTabs>
	);
};

export default WG;
