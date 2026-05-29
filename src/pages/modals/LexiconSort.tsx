import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonReorderGroup,
	IonReorder,
	IonItemDivider
} from '@ionic/react';
import {
	reorderTwo,
	checkmarkCircle
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import useTranslator from '../../store/translationHooks';
import { ModalProperties, SorterFunc, StateObject } from '../../store/types';
import { updateLexiconSort } from '../../store/lexiconSlice';
import reorganize from '../../components/reorganizer';
import useI18Memo from '../../components/useI18Memo';
import Modal from '../../components/Modal';

interface EditSortModal extends ModalProperties {
	sorter: SorterFunc
}

const translations = [ "LexiconSorting", "sortLexDescription" ];

const LexiconSortModal: FC<EditSortModal> = (props) => {
	const [ t ] = useTranslator('lexicon');
	const [ tLexSorting, tSortLexDesc ] = useI18Memo(translations, "lexicon");
	const tSaveChanges = useMemo(() => t("SaveChanges"), [t]);

	const { isOpen, setIsOpen, sorter } = props;
	const dispatch = useDispatch();
	const {
		columns,
		sortPattern,
	} = useSelector((state: StateObject) => state.lexicon);
	const [sorting, setSorting] = useState<number[]>(sortPattern);
	useEffect(() => {
		setSorting(sortPattern);
	}, [sortPattern]);

	const doneSorting = useCallback(() => {
		dispatch(updateLexiconSort([sorting, sorter]));
		setIsOpen(false);
	}, [dispatch, setIsOpen, sorter, sorting]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		const sortOrder = reorganize<number>(sorting, ed.from, ed.to);
		setSorting(sortOrder);
		ed.complete();
	}, [sorting]);
	const sortPatterns = useMemo(() => sorting.map((cNum: number, i: number) => {
		if(!columns[cNum]) {
			// in case things aren't updating
			return <React.Fragment key={`missingColumn:${i}`}></React.Fragment>;
		}
		const {id, label} = columns[cNum];
		return (
			<IonReorder key={`${id}:modal:sortOrder`}>
				<IonItem lines="full">
					<IonIcon icon={reorderTwo} slot="start" />
					<IonLabel className={i ? "" : "bold"}>{label}</IonLabel>
					{i ? <></> : <IonIcon icon={checkmarkCircle} slot="end" />}
				</IonItem>
			</IonReorder>
		);
	}), [columns, sorting]);
	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	return (
		<Modal
			isOpen={isOpen}
			title={tLexSorting}
			closeFunc={closer}
			enclosed={closer}
			contentProps={{id: "editLexiconItemOrder"}}
			bottomEnd={[{key: tSaveChanges, isText: true, icon: "save", action: doneSorting}]}
		>
			<IonList lines="full">
				<IonItem>
					<IonLabel className="ion-text-wrap">{tSortLexDesc}</IonLabel>
				</IonItem>
				<IonItemDivider>{tLexSorting}</IonItemDivider>
				<IonReorderGroup disabled={false} onIonReorderEnd={doReorder}>
					{sortPatterns}
				</IonReorderGroup>
			</IonList>
		</Modal>
	);
};

export default LexiconSortModal;
