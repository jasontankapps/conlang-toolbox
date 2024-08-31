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
import DJInput from './dj/DJInput';
import DJGroups from './dj/DJGroups';
import DJOutput from './dj/DJOutput';
import DJinfo from './dj/DJinfo';


const DJ: FC<PageData> = (props) => {
	const tabs = useMemo(() => appPagesObject.dj.filter(obj => !obj.hidden).map(obj => {
		const { title, tabTitle, url, tab, icon, Icon } = obj;
		return (
			<IonTabButton tab={tab!} href={url} key={"djTab-" + tab}>
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
				<Route path="/dj/overview" render={() => <DJinfo {...props} /> } exact={true} />
				<Route path="/dj/input" render={() => <DJInput {...props} /> } exact={true} />
				<Route path="/dj/groups" render={() => <DJGroups {...props} />} exact={true} />
				<Route path="/dj/output" render={() => <DJOutput {...props} />} exact={true} />
			</IonRouterOutlet>
			<IonTabBar slot="bottom">
				{tabs}
			</IonTabBar>
		</IonTabs>
	);
};

export default DJ;
