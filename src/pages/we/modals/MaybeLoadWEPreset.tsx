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
	IonFooter,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { closeCircleSharp } from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { ModalProperties, StateObject, WEPresetObject } from '../../../store/types';
import { loadStateWE } from '../../../store/weSlice';
import WEPresets from '../../../store/wePresets';
import useTranslator from '../../../store/translationHooks';

import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

const commons = [ "Cancel", "LoadPreset", "confirmLoad" ];

const MaybeLoadPresetModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const tClearThings = useMemo(() => t("clearAllThingsMsg"), [t]);
	const [ tCancel, tLoadPreset, tConfLoad ] = useI18Memo(commons);

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const maybeLoadPreset = useCallback((presetTitle: string, object: WEPresetObject) => {
		const handler = () => {
			const copy = {...object};
			copy.characterGroups = object.characterGroups.map(group => {
				const { title, ...etc } = group;
				return {
					...etc,
					title: t(title)
				};
			});
			copy.transforms = object.transforms.map(group => {
				const { description, ...etc } = group;
				return {
					...etc,
					description: description && t(description)
				};
			});
			dispatch(loadStateWE(copy));
			toaster({
				message: tc("titleLoaded", { title: presetTitle }),
				duration: 2500,
				position: "top",
				toast
			});
			setIsOpen(false);
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tc("loadTitleQ", { title: presetTitle }),
				message: tClearThings,
				cssClass: "danger",
				submit: tConfLoad,
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, setIsOpen, tClearThings, tConfLoad, t, tc, toast]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const presets = useMemo(() => WEPresets.map((pair, i) => {
		const [title, object] = pair;
		const presetTitle = t(title);
		return (
			<IonItem
				key={`${i}:wePreset:${title}`}
				button={true}
				onClick={() => maybeLoadPreset(presetTitle, object)}
			>
				<IonLabel>{presetTitle}</IonLabel>
			</IonItem>
		);
	}), [maybeLoadPreset, t]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tLoadPreset} closeModal={closer} />
			<IonContent>
				<IonList lines="none" className="buttonFilled">
					{presets}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="danger"
						slot="end"
						onClick={closer}
					>
						<IonIcon icon={closeCircleSharp} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default MaybeLoadPresetModal;
