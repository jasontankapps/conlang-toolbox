import React, { useState, FC, useCallback, useMemo } from 'react';
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonMenuButton,
	IonButtons,
	IonFab,
	IonFabButton,
	IonTitle,
	IonIcon,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonReorderGroup,
	IonReorder,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import {
	addOutline,
	helpCircleOutline,
	reorderTwo,
	trash,
	globeOutline,
	trashBinOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { PageData, StateObject, WESoundChangeObject } from '../../store/types';
import { deleteSoundChangeWE, rearrangeSoundChangesWE } from '../../store/weSlice';
import useTranslator from '../../store/translationHooks';

import reorganize from '../../components/reorganizer';
import ModalWrap from "../../components/ModalWrap";
import { $q } from '../../components/DollarSignExports';
import ltr from '../../components/LTR';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import useI18Memo from '../../components/useI18Memo';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import AddSoundChangeModal from './modals/AddSoundChange';
import EditSoundChangeModal from './modals/EditSoundChange';
import { SChCard } from "./WEinfo";

interface SoundChangeItemProps {
	change: WESoundChangeObject
	editSoundChange: (x: WESoundChangeObject) => void
	maybeDeleteSoundChange: (x: WESoundChangeObject) => void
	arrow: string
}

const SoundChange: FC<SoundChangeItemProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const tDelete = useMemo(() => tc("Delete"), [tc]);

	const { change, editSoundChange, maybeDeleteSoundChange, arrow } = props;
	const { seek, replace, context, anticontext, description } = change;
	const changer = useCallback(() => editSoundChange(change), [change, editSoundChange]);
	const deleter = useCallback(() => maybeDeleteSoundChange(change), [change, maybeDeleteSoundChange]);
	return (
		<IonItemSliding>
			<IonItemOptions>
				<IonItemOption
					color="primary"
					onClick={changer}
				>
					<IonIcon slot="icon-only" src="svg/edit.svg" />
				</IonItemOption>
				<IonItemOption
					color="danger"
					onClick={deleter}
					aria-label={tDelete}
				>
					<IonIcon slot="icon-only" icon={trash} />
				</IonItemOption>
			</IonItemOptions>
			<IonItem>
				<IonReorder
					className="dragHandle ion-margin-end"
				><IonIcon icon={reorderTwo} className="dragHandle" /></IonReorder>
				<IonLabel className="wrappableInnards">
					<div className="importantElement serifChars">
						<span
							className="seek importantUnit"
						>{seek}</span>
						<span
						className="arrow unimportantUnit"
						>{arrow}</span>
						<span
							className="replace importantUnit"
						>{replace || String.fromCharCode(160)}</span>
						<span
							className="arrow unimportantUnit"
						>/</span>
						<span
							className="replace importantUnit"
						>{context}</span>
						{anticontext ? (
							<span>
								<span
									className="unimportantUnit"
								>!</span>
								<span
									className="replace importantUnit"
								>{anticontext}</span>
							</span>
						) : <></>}
					</div>
					<div className="description">{description}</div>
				</IonLabel>
				<IonIcon
					size="small"
					slot="end"
					src="svg/slide-indicator.svg"
				/>
			</IonItem>
		</IonItemSliding>
	);
};

const commons = [
	"AddNew", "deleteThisCannotUndo", "DeleteEverythingQ", "Delete", "Help"
];

const WESChange: FC<PageData> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const tSChs = useMemo(() => t("SoundChanges"), [t]);
	const [ tAddNew, tYouSure, tClearAll, tDelete, tHelp ] = useI18Memo(commons);
	const tThingDeleted = useMemo(() => t("changesDeleted", { count: 1 }), [t]);

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	const [isOpenAddSoundChange, setIsOpenAddSoundChange] = useState<boolean>(false);
	const [isOpenEditSoundChange, setIsOpenEditSoundChange] = useState<boolean>(false);
	const [editing, setEditing] = useState<null | WESoundChangeObject>(null);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const {disableConfirms} = useSelector((state: StateObject) => state.appSettings);
	const { soundChanges } = useSelector((state: StateObject) => state.we);
	const editSoundChange = useCallback((change: WESoundChangeObject) => {
		const groups = $q<HTMLIonListElement>(".soundChanges");
		groups && groups.closeSlidingItems();
		setEditing(change)
		setIsOpenEditSoundChange(true);
	}, []);
	const arrow = (ltr() ? "⟶" : "⟵");
	const maybeDeleteSoundChange = useCallback((change: WESoundChangeObject) => {
		const groups = $q<HTMLIonListElement>(".soundChanges");
		groups && groups.closeSlidingItems();
		const handler = () => {
			dispatch(deleteSoundChangeWE(change.id));
			toaster({
				message: tThingDeleted,
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			let rule = change.seek + arrow + change.replace + "/" + change.context;
			if(change.anticontext) {
				rule += "/" + change.anticontext;
			}
			yesNoAlert({
				header: rule,
				message: tYouSure,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [arrow, disableConfirms, dispatch, doAlert, toast, tYouSure, tc, tThingDeleted]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		const reorganized = reorganize<WESoundChangeObject>(soundChanges, ed.from, ed.to);
		dispatch(rearrangeSoundChangesWE(reorganized));
		ed.complete();
	}, [dispatch, soundChanges]);
	const maybeClearEverything = useCallback(() => {
		const count = soundChanges.length;
		const handler = () => {
			dispatch(deleteSoundChangeWE(null));
			toaster({
				message: t("changesDeleted", { count }),
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tClearAll,
				message: t("delAllSC"),
				cssClass: "warning",
				submit: tc("confirmDel", { count }),
				handler,
				doAlert
			});
		}
	}, [soundChanges.length, t, tc, doAlert, toast, disableConfirms, dispatch, tClearAll]);
	const soundchangesItems = useMemo(() =>
		soundChanges.map((input: WESoundChangeObject) =>
			<SoundChange
				key={input.id}
				change={input}
				editSoundChange={editSoundChange}
				maybeDeleteSoundChange={maybeDeleteSoundChange}
				arrow={arrow}
			/>
		),
		[arrow, editSoundChange, maybeDeleteSoundChange, soundChanges]
	);

	const doOpenEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const doHelp = useCallback(() => setIsOpenInfo(true), [setIsOpenInfo]);
	const doAddSC = useCallback(() => setIsOpenAddSoundChange(true), []);
	return (
		<IonPage>
			<AddSoundChangeModal
				{...props.modalPropsMaker(isOpenAddSoundChange, setIsOpenAddSoundChange)}
				openECM={setIsOpenECM}
			/>
			<EditSoundChangeModal
				{...props.modalPropsMaker(isOpenEditSoundChange, setIsOpenEditSoundChange)}
				openECM={setIsOpenECM}
				editing={editing}
				setEditing={setEditing}
			/>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<SChCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{tSChs}</IonTitle>
					<IonButtons slot="end">
						{soundChanges.length > 0 ?
							<IonButton onClick={maybeClearEverything} aria-label={tDelete}>
								<IonIcon icon={trashBinOutline} />
							</IonButton>
						:
							<></>
						}
						<IonButton onClick={doOpenEx}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={doHelp} aria-label={tHelp}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="hasFabButton">
				<IonList className="soundChanges units dragArea" lines="none">
					<IonReorderGroup
						disabled={false}
						className="hideWhileAdding"
						onIonItemReorder={doReorder}
					>
						{soundchangesItems}
					</IonReorderGroup>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						title={tAddNew}
						onClick={doAddSC}
					>
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default WESChange;
