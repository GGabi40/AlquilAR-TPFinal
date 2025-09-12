import { Toaster, toast } from 'sonner'

const defaultNotificationConfig = {
  position: "bottom-right",
  duration: 1500
}

export const toastInfo = (message) =>
  toast.info(message, { ...defaultNotificationConfig });

export const toastDescription = (message, descriptionMsg) =>
  toast(message, {
    description: descriptionMsg,
    ...defaultNotificationConfig
  });

export const toastSuccess = (message) =>
  toast.success(message, { ...defaultNotificationConfig });

export const toastError = (message) =>
  toast.error(message, { ...defaultNotificationConfig });

const Notifications = () => (
  <Toaster richColors position="bottom-right" />
);

export default Notifications;
