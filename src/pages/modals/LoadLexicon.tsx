import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonNote,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonFooter,
	useIonAlert
} from '@ionic/react';
import {
	closeCircleOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { LexiconState, ModalProperties, SetState, StateObject } from '../../store/types';
import { loadStateLex } from '../../store/lexiconSlice';
import useTranslator from '../../store/translationHooks';

import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';

interface SavedLexProperties extends ModalProperties {
	lexInfo: [string, LexiconState][]
	setLexInfo: SetState<[string, LexiconState][]>
}

const translations = [
	"NoSavedLexicons", "loadLexiconConfirm", "LoadLexicon"
];

const commons = [ "Cancel", "Close", "confirmLoad" ];

const LoadLexiconModal: FC<SavedLexProperties> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ t ] = useTranslator('lexicon');
	const [ tCancel, tClose, tConfLoad ] = useI18Memo(commons);
	const [ tNoSaved, tLoadConfirm, tLoadLexicon ] = useI18Memo(translations, "lexicon");

	const { isOpen, setIsOpen, lexInfo, setLexInfo } = props;
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const data = useMemo(() => lexInfo && lexInfo.length > 0 ? lexInfo : [], [lexInfo]);
	const doClose = useCallback(() => {
		setLexInfo([]);
		setIsOpen(false);
	}, [setIsOpen, setLexInfo]);
	const loadThis = useCallback((key: string) => {
		data.every((pair: [string, LexiconState]) => {
			if(pair[0] !== key) {
				// Continue the loop
				return true;
			}
			const handler = () => {
				dispatch(loadStateLex(pair[1]));
				setIsOpen(false);
			};
			if(disableConfirms) {
				handler();
			} else {
				yesNoAlert({
					message: tLoadConfirm,
					cssClass: "warning",
					submit: tConfLoad,
					handler,
					doAlert
				});
			}
			// End loop
			return false;
		});
	}, [data, disableConfirms, dispatch, doAlert, setIsOpen, tLoadConfirm, tConfLoad]);

	const savedLexiconData = useMemo(
		() => (data && data.length > 0 ?
			data.map((pair: [string, LexiconState]) => {
				const key = pair[0];
				const lex = pair[1];
				const time = new Date(lex.lastSave);
				return (
					<IonItem key={key} button={true} onClick={() => loadThis(key)}>
						<IonLabel
							className="ion-text-wrap"
						>
							{t("storedLexItems", { count: lex.lexicon.length, title: lex.title })}
						</IonLabel>
						<IonNote
							className="ion-text-wrap ital"
							slot="end"
						>{tc("SavedAt", { time: time.toLocaleString() })}</IonNote>
					</IonItem>
				);
			})
		:
			<h1>{tNoSaved}</h1>
		),
		[data, loadThis, t, tNoSaved, tc]
	);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tLoadLexicon}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={doClose} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="none" className="buttonFilled">
					{savedLexiconData}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar className={data ? "" : "hide"}>
					<IonButton color="warning" slot="end" onClick={doClose}>
						<IonIcon icon={closeCircleOutline} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default LoadLexiconModal;
