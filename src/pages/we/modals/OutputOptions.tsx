import React, { useCallback, useMemo, FC } from 'react';
import {
	IonContent,
	IonToolbar,
	IonList,
	IonButton,
	IonItem,
	IonLabel,
	IonModal,
	IonFooter,
	IonRadioGroup,
	IonRadio,
	IonToggle,
	IonSelectOption,
	IonSelect,
	ToggleCustomEvent,
	SelectCustomEvent,
	RadioGroupCustomEvent
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import useTranslator from '../../../store/translationHooks';
import { WEOutputTypes, ModalProperties, StateObject } from '../../../store/types';
import { setCustomSort, setFlag, setOutputWE } from '../../../store/weSlice';
import PermanentInfo from '../../../components/PermanentInfo';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

const translations = [
	"ConvertToLowercase", "InputThenOutput",
	"OutputOnly", "OutputAndSCRules", "OutputThenInput",
	"SortBeforehand"
];

const commons = [ "defaultSort", "Done" ];

const OutputOptionsModal: FC<ModalProperties> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const tOutOpt = useMemo(() => tw("OutputOptions"), [tw]);
	const tMethod = useMemo(() => tc("SortMethod"), [tc]);
	const [ tDefault, tDone ] = useI18Memo(commons);
	const [ tConvert, tInOut, tOut, tOutSC, tOutIn, tSortIn ] = useI18Memo(translations, "we");

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const {
		outputStyle,
		inputLower,
		inputAlpha,
		customSort
	} = useSelector((state: StateObject) => state.we);
	const { customSorts } = useSelector((state: StateObject) => state.sortSettings);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const sortMethods = useMemo(() => customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(sorter => (
		<IonSelectOption
			className="ion-text-wrap ion-text-align-end"
			key={`inputSortChooser:${sorter.id}:${sorter.title}`}
			value={sorter.id}
		>{sorter.title}</IonSelectOption>
	)), [customSorts]);
	const toggleLower = useCallback((e: ToggleCustomEvent) => dispatch(setFlag(["inputLower", e.detail.checked])), [dispatch]);
	const toggleAlpha = useCallback((e: ToggleCustomEvent) => dispatch(setFlag(["inputAlpha", e.detail.checked])), [dispatch]);
	const doSetMethod = useCallback((e: SelectCustomEvent) => dispatch(setCustomSort(e.detail.value)), [dispatch]);
	const setDisplayMethod = useCallback(
		(e: RadioGroupCustomEvent) => dispatch(setOutputWE(e.detail.value as WEOutputTypes)),
		[dispatch]
	);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tOutOpt} closeModal={closer} />
			<IonContent>
				<IonList lines="none">
					<IonItem lines="full">
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={inputLower}
							onIonChange={toggleLower}
						>{tConvert}</IonToggle>
					</IonItem>
					<IonItem lines={inputAlpha ? "none" : undefined}>
						<IonToggle
							enableOnOffLabels
							labelPlacement="start"
							checked={inputAlpha}
							onIonChange={toggleAlpha}
						>{tSortIn}</IonToggle>
					</IonItem>
					<IonItem className={inputAlpha ? "" : "hide"} lines="full">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tMethod}
							value={customSort || null}
							onIonChange={doSetMethod}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value={null}
							>{tDefault}</IonSelectOption>
							{sortMethods}
						</IonSelect>
					</IonItem>
					<IonRadioGroup
						value={outputStyle}
						onIonChange={setDisplayMethod}
					>
						<IonItem className="ion-text-wrap">
							<IonRadio
								value="outputOnly"
								labelPlacement="end"
								justify="start"
							>{tOut}</IonRadio>
						</IonItem>
						<IonItem className="ion-text-wrap">
							<IonRadio
								value="rulesApplied"
								labelPlacement="end"
								justify="start"
							>{tOutSC}</IonRadio>
						</IonItem>
						<IonItem className="ion-text-wrap">
							<IonRadio
								value="inputFirst"
								labelPlacement="end"
								justify="start"
							>{tInOut}</IonRadio>
						</IonItem>
						<IonItem className="ion-text-wrap" lines="full">
							<IonRadio
								value="outputFirst"
								labelPlacement="end"
								justify="start"
							>{tOutIn}</IonRadio>
						</IonItem>
					</IonRadioGroup>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="success"
						slot="end"
						onClick={closer}
					>
						<IonLabel>{tDone}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default OutputOptionsModal;
