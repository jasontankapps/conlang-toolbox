import { AlertButton, AlertInput, AlertOptions } from "@ionic/react"
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions"
import i18n from "../i18n"

interface Alert {
	header?: string
	cssClass?: string
	message: string
	submit: string
	handler: (input: AlertInput) => void
	notDestructive?: boolean
	doAlert: {
		(message: string, buttons?: AlertButton[] | undefined): Promise<void>;
		(options: AlertOptions & HookOverlayOptions): Promise<void>;
	}
}

const yesNoAlert = (props: Alert) => {
	const {
		header,
		cssClass,
		message,
		submit,
		handler,
		notDestructive,
		doAlert
	} = props;
	doAlert({
		header,
		cssClass,
		message,
		buttons: [
			{
				text: i18n.t("Cancel", { ns: 'common' }),
				role: "cancel",
				cssClass: "cancel"
			},
			{
				text: submit,
				cssClass: "submit",
				handler,
				role: notDestructive ? undefined : "destructive"
			}
		]
	});
};

export default yesNoAlert;
