import React, { useCallback, useMemo, useState, FC } from 'react';
import {
	IonLabel,
	IonPage,
	IonContent,
	IonList,
	IonItem,
	IonToggle,
	ToggleCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { PageData, StateObject } from '../store/types';
import { setDisableConfirms } from '../store/settingsSlice';
import useTranslator from '../store/translationHooks';

import Header from '../components/Header';
import ChooseThemeModal from './modals/Theme';
import ExportAllData from './modals/ExportAllData';
import ImportData from './modals/ImportData';
import useI18Memo from '../components/useI18Memo';

const translations =  [
	"ChangeTheme", "DisableConfPrompts",
	"confPromptExplanation",
	"ImportAppInfo", "SortSettings",
	"exportAppInfo"
];

const AppSettings: FC<PageData> = (props) => {
	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenTheme, setIsOpenTheme] = useState<boolean>(false);
	const [isOpenExportAll, setIsOpenExportAll] = useState<boolean>(false);
	const [isOpenImport, setIsOpenImport] = useState<boolean>(false);
	const {
		disableConfirms,
		theme
	} = useSelector((state: StateObject) => state.appSettings);
	const openTheme = useCallback(() => setIsOpenTheme(true), []);
	const openExportAll = useCallback(() => setIsOpenExportAll(true), []);
	const openImport = useCallback(() => setIsOpenImport(true), []);

	const [ t ] = useTranslator('settings');
	const [ tc ] = useTranslator('common');
	const tAppSettings = useMemo(() => tc("AppSettings"), [tc]);
	const tThemeName = useMemo(() => t(theme || "Default"), [t, theme]);
	const [ tChangeTheme, tDisable, tEliminate, tImport, tSortSettings, tExport ] = useI18Memo(translations, 'settings');

	const setConfirms = useCallback((e: ToggleCustomEvent) => dispatch(setDisableConfirms(e.detail.checked)), [dispatch]);

	return (
		<IonPage>
			<ChooseThemeModal {...modalPropsMaker(isOpenTheme, setIsOpenTheme)} />
			<ExportAllData {...modalPropsMaker(isOpenExportAll, setIsOpenExportAll)} />
			<ImportData {...modalPropsMaker(isOpenImport, setIsOpenImport)} />
			<Header title={tAppSettings} />
			<IonContent fullscreen>
				<IonList lines="full">
					<IonItem className="wrappableInnards">
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={disableConfirms}
							onIonChange={setConfirms}
						>
							<h2>{tDisable}</h2>
							<p>{tEliminate}</p>
						</IonToggle>
					</IonItem>
					<IonItem button={true} onClick={openTheme}>
						<IonLabel>{tChangeTheme}</IonLabel>
						<IonLabel slot="end" color="primary">{tThemeName}</IonLabel>
					</IonItem>
					<IonItem button={true} routerLink="/sortSettings" routerDirection="forward">
						<IonLabel>{tSortSettings}</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openExportAll}>
						<IonLabel className="possiblyLargeLabel">
							<h2>{tExport}</h2>
						</IonLabel>
					</IonItem>
					<IonItem button={true} onClick={openImport}>
						<IonLabel className="possiblyLargeLabel">
							<h2>{tImport}</h2>
						</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default AppSettings;
