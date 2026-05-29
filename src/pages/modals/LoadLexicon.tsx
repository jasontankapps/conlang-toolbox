import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonNote,
	IonList,
	useIonAlert
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { LexiconState, ModalProperties, SetState, StateObject } from '../../store/types';
import { loadStateLex } from '../../store/lexiconSlice';
import useTranslator from '../../store/translationHooks';

import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import Modal from '../../components/Modal';

interface SavedLexProperties extends ModalProperties {
	lexInfo: [string, LexiconState][]
	setLexInfo: SetState<[string, LexiconState][]>
}

const translations = [
	"NoSavedLexicons", "loadLexiconConfirm", "LoadLexicon"
];

const commons = [ "confirmLoad" ];

const LoadableLexicon: FC<{pair: [string, LexiconState], loadThis: (x: string) => void}> = ({pair, loadThis}) => {
	const key = pair[0];
	const lex = pair[1];
	const [ tc ] = useTranslator('common');
	const [ t ] = useTranslator('lexicon');
	const time = new Date(lex.lastSave);
	return (
		<IonItem button={true} onClick={() => loadThis(key)}>
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
};

const LoadLexiconModal: FC<SavedLexProperties> = (props) => {
	const [ tConfLoad ] = useI18Memo(commons);
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

	return (
		<Modal
			isOpen={isOpen}
			title={tLoadLexicon}
			closeFunc={doClose}
			bottomEnd={[{button: "cancel"}]}
		>
			<IonList lines="none" className="buttonFilled">
				{(data && data.length > 0) ?
					data.map(pair => <LoadableLexicon key={`load-lex-${pair[0]}`} loadThis={loadThis} pair={pair} />)
				:
					<h1>{tNoSaved}</h1>
				}
			</IonList>
		</Modal>
	);
};

export default LoadLexiconModal;
