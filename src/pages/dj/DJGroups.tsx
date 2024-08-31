import React, { useCallback, useMemo, useState, FC } from 'react';
import {
	IonContent,
	IonPage,
	IonFab,
	IonFabButton,
	IonButton,
	IonIcon,
	IonList,
	IonItem,
	IonLabel,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
	useIonToast,
	IonReorderGroup,
	IonReorder,
	ItemReorderCustomEvent,
	ItemReorderEventDetail,
	IonItemDivider,
	IonLoading
} from '@ionic/react';
import {
	addOutline,
	trash,
	trashBinOutline,
	caretDown,
	reorderThree,
	helpCircleOutline,
	saveOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import { DJCustomInfo, DJGroup, Declenjugation, PageData, StateObject } from '../../store/types';
import { deleteGroup, reorderGroups } from '../../store/declenjugatorSlice';
import useTranslator from '../../store/translationHooks';

import { $q } from '../../components/DollarSignExports';
import ltr from '../../components/LTR';
import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import log from '../../components/Logging';
import Header from '../../components/Header';
import ModalWrap from '../../components/ModalWrap';
import { DeclenjugatorStorage } from '../../components/PersistentInfo';
import useI18Memo from '../../components/useI18Memo';

import ManageCustomInfo from './modals/CustomInfoDJ';
import ExtraCharactersModal from '../modals/ExtraCharacters';
import AddGroup from './modals/AddGroup';
import AddDeclenjugation from './modals/AddDeclenjugation';
import EditGroup from './modals/EditGroup';
import EditDeclenjugation from './modals/EditDeclenjugation';
import CaseMaker from './modals/CaseMaker';
import { GroupCard } from './DJinfo';

interface GroupingInfo {
	label: string
	groups: DJGroup[]
	type: keyof DJCustomInfo
	doReorder: (ed: ItemReorderEventDetail, type: keyof DJCustomInfo) => void
	editGroup: (type: keyof DJCustomInfo, group: DJGroup) => void
	maybeDeleteGroup: (type: keyof DJCustomInfo, group: DJGroup) => void
	tEdit: string
	tDel: string
}

interface GroupInfo {
	group: DJGroup
	type: keyof DJCustomInfo
	editGroup: (type: keyof DJCustomInfo, group: DJGroup) => void
	maybeDeleteGroup: (type: keyof DJCustomInfo, group: DJGroup) => void
	tEdit: string
	tDel: string
}

interface DeclenjugationInfo {
	dj: Declenjugation
	toggled: boolean
}

const DeclenjugationInstance: FC<DeclenjugationInfo> = (props) => {
	const { dj, toggled } = props;
	const { title, prefix, suffix, regex, useWholeWord } = dj;
	let stem = <></>;
	if(regex) {
		const arrow = (ltr() ? "⟶" : "⟵");
		const [match, replace] = regex;
		stem = <>/<em>{match}</em>/ {arrow} <em>{replace}</em></>;
	} else {
		let rootling = "-";
		prefix && (rootling = prefix + rootling);
		suffix && (rootling = rootling + suffix);
		stem = <em>{rootling}</em>;
	}
	return (
		<IonItem
			className={`toggleable${toggled ? " toggled": ""}`}
		>
			<div className="title"><strong>{title}</strong></div>
			<div className="description"><em>{stem}</em></div>
			{
				useWholeWord ?
					<div className="ww">[W]</div>
				:
					<></>
			}
		</IonItem>
	);
};

const GroupInstance: FC<GroupInfo> = (props) => {
	const [toggled, setToggled] = useState<boolean>(false);
	const { t } = useTranslation('dj');
	const { group, type, editGroup, maybeDeleteGroup, tEdit, tDel } = props;
	const { title, id: mainID, appliesTo, declenjugations } = group;
	const theDescription = useMemo(() => makeDJGroupDescription(group), [group]);
	const application = useMemo(() => appliesTo && t("groupAppliesTo", { appliesTo }), [appliesTo, t]);
	const djInstances = useMemo(() => declenjugations.map((dj) => (
		<DeclenjugationInstance
			dj={dj}
			key={`${mainID}/${dj.id}`}
			toggled={toggled}
		/>
	)), [declenjugations, mainID, toggled]);
	const doEdit = useCallback(() => editGroup(type, group), [editGroup, type, group]);
	const doDelete = useCallback(() => maybeDeleteGroup(type, group), [group, maybeDeleteGroup, type]);
	const doToggle = useCallback(() => setToggled(!toggled), [toggled]);
	return (
		<IonItemSliding className="djGroupMain" disabled={false}>
			<IonItemOptions>
				<IonItemOption
					color="primary"
					onClick={doEdit}
					aria-label={tEdit}
				>
					<IonIcon slot="icon-only" src="svg/edit.svg" />
				</IonItemOption>
				<IonItemOption
					color="danger"
					onClick={doDelete}
					aria-label={tDel}
				>
					<IonIcon slot="icon-only" icon={trash} />
				</IonItemOption>
			</IonItemOptions>
			<IonItem className="innerList">
				<IonList className="hasToggles" lines="none">
					<IonItem className="wrappableInnards">
						<IonReorder slot="start">
							<IonIcon icon={reorderThree} />
						</IonReorder>
						<IonButton
							fill="clear"
							onClick={doToggle}
							className={`djGroup-caret${toggled ? " toggled": ""}`}
						>
							<IonIcon
								slot="icon-only"
								icon={caretDown}
							/>
						</IonButton>
						<IonLabel className="wrappableInnards">
							<div><strong>{title}</strong></div>
							<div className="description">
								<em>
									{theDescription}{application}
								</em>
							</div>
						</IonLabel>
						<IonIcon size="small" slot="end" src="svg/slide-indicator.svg" />
					</IonItem>
					{djInstances}
				</IonList>
			</IonItem>
		</IonItemSliding>
	);
};

const Grouping: FC<GroupingInfo> = (props) => {
	const { groups, type, label, doReorder, editGroup, maybeDeleteGroup, tDel, tEdit } = props;
	const theGroups = useMemo(() => groups.map((group: DJGroup) => (
		<GroupInstance
			key={`${group.id}`}
			group={group}
			type={type}
			editGroup={editGroup}
			maybeDeleteGroup={maybeDeleteGroup}
			tDel={tDel}
			tEdit={tEdit}
		/>
	)), [groups, editGroup, maybeDeleteGroup, tDel, tEdit, type]);
	const onReorder = useCallback((event: ItemReorderCustomEvent) => doReorder(event.detail, type), [doReorder, type]);
	if(groups.length === 0) {
		return <></>;
	}
	return (
		<>
			<IonItemDivider sticky color="secondary">{label}</IonItemDivider>
			<IonReorderGroup
				disabled={false}
				onIonItemReorder={onReorder}
			>
				{theGroups}
			</IonReorderGroup>
		</>
	);
};

function makeDJGroupDescription (group: DJGroup) {
	const { startsWith, endsWith, regex, separator } = group;
	if(regex) {
		const [match, replace] = regex;
		const arrow = (ltr() ? "⟶" : "⟵");
		return `/${match}/ ${arrow} ${replace}`;
	}
	const total = startsWith.map(line => line + "-").concat(endsWith.map(line => "-" + line));
	return total.join(separator);
}

const translations = [
	"ClearAllGroups", "Conjugations", "Declensions", "Groups", "Other",
	"delEntireGroup", "GroupDeleted"
];

const commons = [
	"AddNew", "Delete", "Help", "PleaseWait", "Save", "Edit",
	"areYouSure", "cannotUndo"
];


const DJGroups: FC<PageData> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const [ tAddNew, tDel, tHelp, tWait, tSave, tEdit, tYouSure, tCannotUndo ] = useI18Memo(commons);
	const [ tClear, tConj, tDecl, tGroups, tOther, tDelGroup, tGroupDeleted  ] = useI18Memo(translations, "dj");

	const { modalPropsMaker } = props;
	const dispatch = useDispatch();

	// main modals
	const [isOpenAddGroup, setIsOpenAddGroup] = useState<boolean>(false);
	const [isOpenEditGroup, setIsOpenEditGroup] = useState<boolean>(false);
	const [editingGroup, setEditingGroup] = useState<[keyof DJCustomInfo, DJGroup] | null>(null);
	const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
	// submodal: add declenjugation
	const [addDeclenjugationOpen, setAddDeclenjugationOpen] = useState<boolean>(false);
	const [savedDeclenjugation, setSavedDeclenjugation] = useState<Declenjugation | null>(null);
	// submodal: edit declenjugation
	const [editDeclenjugationOpen, setEditDeclenjugationOpen] = useState<boolean>(false);
	const [incomingDeclenjugation, setIncomingDeclenjugation] = useState<Declenjugation | null>(null);
	const [outgoingDeclenjugation, setOutgoingDeclenjugation] = useState<Declenjugation | null | string>(null);
	// submodal: add and edit declenjugation
	const [caseMakerOpen, setCaseMakerOpen] = useState<boolean>(false);
	const [savedTitle, setSavedTitle] = useState<string>("");
	// other modals
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const [isOpenManageCustom, setIsOpenManageCustom] = useState<boolean>(false);
	const [infoModalTitles, setInfoModalTitles] = useState<string[] | null>(null);
	const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
	// all modals
	const [declenjugationTypeString, setDeclenjugationTypeString] = useState<string>("");

	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { declensions, conjugations, other } = useSelector((state: StateObject) => state.dj);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const allGroups = (declensions.length + conjugations.length + other.length);
	const canTrash = allGroups > 0;

	const addDeclenjugationModalInfo = modalPropsMaker(addDeclenjugationOpen, setAddDeclenjugationOpen);
	const editDeclenjugationModalInfo = modalPropsMaker(editDeclenjugationOpen, setEditDeclenjugationOpen);
	const caseMakerModalInfo = modalPropsMaker(caseMakerOpen, setCaseMakerOpen);

	const editGroup = useCallback((type: keyof DJCustomInfo, group: DJGroup) => {
		const groups = $q<HTMLIonListElement>(".djGroups");
		groups && groups.closeSlidingItems();
		setEditingGroup([type, group]);
		setIsOpenEditGroup(true);
	}, []);
	const maybeDeleteGroup = useCallback((type: keyof DJCustomInfo, group: DJGroup) => {
		const groups = $q<HTMLIonListElement>(".djGroups");
		groups && groups.closeSlidingItems();
		const handler = () => {
			dispatch(deleteGroup([type, group.id]));
			toaster({
				message: tGroupDeleted,
				position: "middle",
				color: "danger",
				duration: 2000,
				toast
			});
		};
		if(!disableConfirms) {
			yesNoAlert({
				header: tYouSure,
				message: tDelGroup,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
			return;
		}
		handler();
	}, [disableConfirms, dispatch, doAlert, tc, tDelGroup, tGroupDeleted, tYouSure, toast]);
	const maybeClearEverything = useCallback(() => {
		const handler = () => {
			dispatch(deleteGroup(null));
			toaster({
				message: t("groupsDeleted", { count: allGroups }),
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
				header: tClear,
				message: `${tYouSure} ${tCannotUndo}`,
				cssClass: "warning",
				submit: tc("confirmDel", { count: allGroups }),
				handler,
				doAlert
			});
		}
	}, [dispatch, t, tc, toast, doAlert, disableConfirms, allGroups, tClear, tYouSure, tCannotUndo]);
	const openCustomInfoModal = useCallback(() => {
		setLoadingOpen(true);
		const titles: string[] = [];
		DeclenjugatorStorage.iterate((value, title) => {
			titles.push(title);
			return; // Blank return keeps the loop going
		}).then(() => {
			setInfoModalTitles(titles);
			setLoadingOpen(false);
			setIsOpenManageCustom(true);
		}).catch((err) => {
			log(dispatch, ["Open Custom Info Modal (dj)", err]);
		});
	}, [dispatch]);
	const headerButtons = useMemo(() => {
		const output = [
			<IonButton
				onClick={() => openCustomInfoModal()}
				key="djGroupsCustomInfoModalButton"
				aria-label={tSave}
			>
				<IonIcon icon={saveOutline} />
			</IonButton>,
			<IonButton key="djGroupsHelpButton" aria-label={tHelp} onClick={() => setIsOpenInfo(true)}>
				<IonIcon icon={helpCircleOutline} />
			</IonButton>
		];
		canTrash && output.unshift(
			<IonButton key="djGroupsClearEverything" aria-label={tDel} onClick={() => maybeClearEverything()}>
				<IonIcon icon={trashBinOutline} />
			</IonButton>
		);
		return output;
	}, [canTrash, maybeClearEverything, openCustomInfoModal, tDel, tHelp, tSave]);


	const doReorder = useCallback((ed: ItemReorderEventDetail, type: keyof DJCustomInfo) => {
		// move things around
		const { from, to } = ed;
		let groups: DJGroup[] = [];
		switch(type) {
			case "declensions":
				groups = declensions;
				break;
			case "conjugations":
				groups = conjugations;
				break;
			case "other":
				groups = other;
		}
		const moved = groups[from];
		const remains = groups.slice(0, from).concat(groups.slice(from + 1));
		groups = remains.slice(0, to).concat(moved, remains.slice(to));
		// save result
		dispatch(reorderGroups({type, groups}));
		ed.complete();
	}, [conjugations, declensions, other, dispatch]);

	const setLoader = useCallback(() => setLoadingOpen(false), []);
	const opener = useCallback(() => setIsOpenAddGroup(true), []);
	return (
		<IonPage>
			<AddGroup
				{...modalPropsMaker(isOpenAddGroup, setIsOpenAddGroup)}
				openECM={setIsOpenECM}

				addDeclenjugationModalInfo={addDeclenjugationModalInfo}
				savedDeclenjugation={savedDeclenjugation}
				setSavedDeclenjugation={setSavedDeclenjugation}
				setDeclenjugationType={setDeclenjugationTypeString}

				editDeclenjugationModalInfo={editDeclenjugationModalInfo}
				setIncomingDeclenjugation={setIncomingDeclenjugation}
				outgoingDeclenjugation={outgoingDeclenjugation}
				setOutgoingDeclenjugation={setOutgoingDeclenjugation}
			/>
			<EditGroup
				{...modalPropsMaker(isOpenEditGroup, setIsOpenEditGroup)}
				openECM={setIsOpenECM}

				editingGroupInfo={editingGroup}

				addDeclenjugationModalInfo={addDeclenjugationModalInfo}
				savedDeclenjugation={savedDeclenjugation}
				setSavedDeclenjugation={setSavedDeclenjugation}
				setDeclenjugationType={setDeclenjugationTypeString}

				editDeclenjugationModalInfo={editDeclenjugationModalInfo}
				setIncomingDeclenjugation={setIncomingDeclenjugation}
				outgoingDeclenjugation={outgoingDeclenjugation}
				setOutgoingDeclenjugation={setOutgoingDeclenjugation}
			/>

			<AddDeclenjugation
				{...addDeclenjugationModalInfo}
				openECM={setIsOpenECM}
				setSavedDeclenjugation={setSavedDeclenjugation}
				caseMakerModalInfo={caseMakerModalInfo}
				savedTitle={savedTitle}
				setSavedTitle={setSavedTitle}
				typeString={declenjugationTypeString}
			/>
			<EditDeclenjugation
				{...editDeclenjugationModalInfo}
				openECM={setIsOpenECM}
				incomingDeclenjugation={incomingDeclenjugation}
				setOutgoingDeclenjugation={setOutgoingDeclenjugation}
				caseMakerModalInfo={caseMakerModalInfo}
				savedTitle={savedTitle}
				setSavedTitle={setSavedTitle}
				typeString={declenjugationTypeString}
			/>
			<CaseMaker
				{...caseMakerModalInfo}
				openECM={setIsOpenECM}
				setSavedTitle={setSavedTitle}
			/>

			<ManageCustomInfo
				{...modalPropsMaker(isOpenManageCustom, setIsOpenManageCustom)}
				openECM={setIsOpenECM}
				titles={infoModalTitles}
				setTitles={setInfoModalTitles}
			/>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<ModalWrap {...modalPropsMaker(isOpenInfo, setIsOpenInfo)}>
				<GroupCard setIsOpenInfo={setIsOpenInfo} />
			</ModalWrap>
			<IonLoading
				cssClass='loadingPage'
				isOpen={loadingOpen}
				onDidDismiss={setLoader}
				message={tWait}
				spinner="bubbles"
				/*duration={300000}*/
				duration={1000}
			/>
			<Header
				title={tGroups}
				endButtons={headerButtons}
			/>
			<IonContent className="hasFabButton">
				<IonList className="djGroups units dragArea" lines="full">
					<Grouping
						groups={declensions}
						label={tDecl}
						type="declensions"
						doReorder={doReorder}
						editGroup={editGroup}
						maybeDeleteGroup={maybeDeleteGroup}
						tDel={tDel}
						tEdit={tEdit}
					/>
					<Grouping
						groups={conjugations}
						label={tConj}
						type="conjugations"
						doReorder={doReorder}
						editGroup={editGroup}
						maybeDeleteGroup={maybeDeleteGroup}
						tDel={tDel}
						tEdit={tEdit}
					/>
					<Grouping
						groups={other}
						label={tOther}
						type="other"
						doReorder={doReorder}
						editGroup={editGroup}
						maybeDeleteGroup={maybeDeleteGroup}
						tDel={tDel}
						tEdit={tEdit}
					/>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="primary"
						title={tAddNew}
						onClick={opener}
					>
						<IonIcon icon={addOutline} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default DJGroups;
