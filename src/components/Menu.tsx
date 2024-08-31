import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote,
} from '@ionic/react';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
	caretForwardSharp,
	ellipseSharp,
//	cogSharp,
//	volumeHighSharp
} from 'ionicons/icons';

import { SetState } from '../store/types';
import { appMenuInfo, AppPage, MenuSection } from './appPagesInfo';
import './Menu.css';

interface PlainMenuItemProps {
	appPage: AppPage
}
interface SubMenuItemProps extends PlainMenuItemProps {
	isToggled : boolean
}
interface MenuItemProps extends SubMenuItemProps {
	setMenuInfo: SetState<string | false>
}

const ParentOf: FC<MenuItemProps> = (props) => {
	const { appPage, isToggled, setMenuInfo } = props;
	const { parentOf, url, menuIcon, MenuIcon, title } = appPage;
	const location = useLocation();
	const {pathname = "/"} = location;
	const maybeSelected = (url.endsWith("/") ? url === pathname : pathname.startsWith(url)) ? " selected" : "";
	const maybeToggled = (isToggled ? " toggled" : "");
	const className = `mainHeading${maybeSelected}${maybeToggled}`;
	const onClick = useCallback(
		() => setMenuInfo(isToggled ? false : parentOf!),
		[isToggled, parentOf, setMenuInfo]
	);
	const icon = menuIcon ? <IonIcon slot="start" icon={menuIcon} /> : (MenuIcon ? <MenuIcon slot="start" /> : <></>);
	return (
		<IonItem
			className={className}
			lines="none"
			detail={false}
			onClick={onClick}
		>
			{icon}
			<IonLabel>{title}</IonLabel>
			<IonIcon
				className="caret"
				slot="end"
				icon={caretForwardSharp}
			/>
		</IonItem>
	);
};

const HasParent: FC<SubMenuItemProps> = (props)  => {
	const { appPage, isToggled } = props;
	const { url, title } = appPage;
	const location = useLocation();
	const {pathname = "/"} = location;
	const maybeSelected = (url.endsWith("/") ? url === pathname : pathname.startsWith(url)) ? " selected" : "";
	const maybeToggled = (isToggled ? "" : " hidden");
	const className = `subHeading${maybeSelected}${maybeToggled}`;
	return (
		<IonMenuToggle autoHide={false}>
			<IonItem
				className={className}
				routerLink={url}
				routerDirection="forward"
				lines="none"
				detail={false}
			>
				<IonLabel>{title}</IonLabel>
				<IonIcon
					slot="end"
					size="small"
					icon={ellipseSharp}
				/>
			</IonItem>
		</IonMenuToggle>
	);
};

const PlainMenuItem: FC<PlainMenuItemProps> = (props)  => {
	const { appPage } = props;
	const { url, menuIcon, MenuIcon, title } = appPage;
	const location = useLocation();
	const {pathname = "/"} = location;
	const maybeSelected = (url.endsWith("/") ? url === pathname : pathname.startsWith(url)) ? " selected" : "";
	const className = `mainHeading${maybeSelected}`;
	const icon = menuIcon ? <IonIcon slot="start" icon={menuIcon} /> : (MenuIcon ? <MenuIcon slot="start" /> : <></>);
	return (
		<IonMenuToggle autoHide={false}>
			<IonItem
				className={className}
				routerLink={url}
				routerDirection="forward"
				lines="none"
				detail={false}
			>
				{icon}
				<IonLabel>{title}</IonLabel>
			</IonItem>
		</IonMenuToggle>
	);
};

const Menu: FC<{}> = () => {
	const [menuInfo, setMenuInfo] = useState<string | false>(false);
	const allPages = useMemo(() => {
		return appMenuInfo.map((menuSection: MenuSection) => {
			const { header, note } = menuSection;
			const theHeader = header ? <IonListHeader>{header}</IonListHeader> : <></>;
			const aNote = note ? <IonNote>{note}</IonNote> : <></>;
			const pages = menuSection.pages.map((appPage) => {
				const { parentOf, parent, id } = appPage;
				if(parentOf) {
					return <ParentOf key={id} appPage={appPage} isToggled={menuInfo === parentOf} setMenuInfo={setMenuInfo} />;
				} else if(parent) {
					return <HasParent key={id} appPage={appPage} isToggled={menuInfo === parent} />;
				}
				return <PlainMenuItem key={id} appPage={appPage} />;
			});
			return (
				<IonList key={menuSection.id} id={menuSection.id}>
					{theHeader}
					{aNote}
					{pages}
				</IonList>
			);
		})
	}, [menuInfo]);

	return (
		<IonMenu contentId="main" type="overlay" id="mainMenu">
			<IonContent>
				{allPages}
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
