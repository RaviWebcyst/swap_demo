import cogoToast from "cogo-toast";
import "./Toast.scss";

interface ToastOptions {
  position?:
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  heading: string;
}

class Toaster {
  success(message: string): void {
    let options: ToastOptions = { position: "top-center", heading: "Success" };
    cogoToast.success(message, options);
  }

  error(message: string): void {
    let options: ToastOptions = { position: "top-center", heading: "Error" };
    cogoToast.error(message, options);
  }

  info(message: string): void {
    let options: ToastOptions = { position: "top-center", heading: "Info" };
    cogoToast.info(message, options);
  }
}

export const toast = new Toaster();
