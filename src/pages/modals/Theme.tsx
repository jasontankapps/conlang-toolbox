import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList
} from '@ionic/react';
import {
	checkmarkCircleOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { setTheme } from '../../store/settingsSlice';
import { ThemeNames, ModalProperties, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import Modal from '../../components/Modal';

const themes: ThemeNames[] = [
	"Default",
	"Light",
	"Dark",
	"SolarizedLight",
	"SolarizedDark"
];

const Theme: FC<{
	themeName: ThemeNames,
	theme: ThemeNames,
	changeAppTheme: (x:ThemeNames) => void}
> = ({themeName, theme, changeAppTheme}) => {
	const [ t ] = useTranslator("settings");
	return (
		<IonItem button={true} onClick={() => changeAppTheme(themeName)}>
			<IonLabel>{t(themeName)}</IonLabel>
			{theme === themeName ? (<IonIcon icon={checkmarkCircleOutline} slot="end" />) : ""}
		</IonItem>
	);
};

const ThemeModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator("settings");
	const tChooseTheme = useMemo(() => t("ChooseATheme"), [t]);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const { theme = "Default" } = useSelector((state: StateObject) => state.appSettings);

	const cancel = useCallback(() => { setIsOpen(false); }, [setIsOpen]);
	const changeAppTheme = useCallback((theme: ThemeNames) => {
		dispatch(setTheme(theme));
		cancel();
	}, [dispatch, cancel]);

	return (
		<Modal
			isOpen={isOpen}
			title={tChooseTheme}
			closeFunc={cancel}
			bottomEnd={[{button: "cancel", color: "danger"}]}
		>
			<IonList lines="none" className="buttonFilled">
				{
					themes.map(
						(themeName) =>
							<Theme
								key={themeName}
								theme={theme}
								themeName={themeName}
								changeAppTheme={changeAppTheme}
							/>
					)
				}
			</IonList>
		</Modal>
	);
};

export default ThemeModal;
