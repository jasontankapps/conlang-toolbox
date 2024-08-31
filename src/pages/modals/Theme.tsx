import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonToolbar,
	IonButton,
	IonModal,
	IonFooter
} from '@ionic/react';
import {
	closeCircleSharp,
	checkmarkCircleOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { setTheme } from '../../store/settingsSlice';
import { ThemeNames, ModalProperties, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';
import ModalHeader from '../../components/ModalHeader';

const themes: ThemeNames[] = [
	"Default",
	"Light",
	"Dark",
	"SolarizedLight",
	"SolarizedDark"
];

const ThemeModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator("settings");
	const [ tc ] = useTranslator("common");
	const tChooseTheme = useMemo(() => t("ChooseATheme"), [t]);
	const tCancel = useMemo(() => tc("Cancel"), [tc]);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const { theme = "Default" } = useSelector((state: StateObject) => state.appSettings);

	const cancel = useCallback(() => { setIsOpen(false); }, [setIsOpen]);
	const changeAppTheme = useCallback((theme: ThemeNames) => {
		dispatch(setTheme(theme));
		cancel();
	}, [dispatch, cancel]);
	const themeItems = useMemo(() => themes.map((themeName) => (
		<IonItem key={themeName} button={true} onClick={() => changeAppTheme(themeName)}>
			<IonLabel>{t(themeName)}</IonLabel>
			{theme === themeName ? (<IonIcon icon={checkmarkCircleOutline} slot="end" />) : ""}
		</IonItem>
	)), [changeAppTheme, t, theme]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={cancel}>
			<ModalHeader title={tChooseTheme} closeModal={cancel} />
			<IonContent>
				<IonList lines="none" className="buttonFilled">
					{themeItems}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="danger" slot="end" onClick={cancel}>
						<IonIcon icon={closeCircleSharp} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default ThemeModal;
