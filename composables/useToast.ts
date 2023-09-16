import { useToast as toast } from "vue-toast-notification";

const $toast = toast();

let toastOption: any = { position: "top", duration: 5000 };

export const useToast = () => {
  return {
    success: (message: string) => $toast.success(message, toastOption),
    error: (message: string) => $toast.error(message, toastOption),
    warning: (message: string) => $toast.warning(message, toastOption),
    info: (message: string) => $toast.info(message, toastOption),
    default: (message: string) => $toast.default(message, toastOption),
  };
};
