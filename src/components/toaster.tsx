import { ToastButton, UseIonToastResult } from "@ionic/react"
import i18n from "../i18n"

interface Toast {
	color?: string
	message: string
	buttons?: ToastButton[]
	duration?: number
	position?: "top" | "middle" | "bottom"
	toast: UseIonToastResult
}

const toaster = (props: Toast) => {
	const {
		color = "primary",
		message,
		duration = 5000,
		toast,
		position,
		buttons = [
			{
				text: i18n.t("Ok", { ns: 'common' }),
				role: 'cancel'
			}
		]
	} = props;
	const [ doToast, undoToast ] = toast;
	undoToast().then(() => doToast({
		message,
		duration,
		position,
		color,
		buttons
	}));
};

export default toaster;
