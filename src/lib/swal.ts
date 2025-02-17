import Swal from "sweetalert2";

export type AlertInformation = {
    isSuccess: boolean;
    title: string;
    text: string;
}

export function swalAlert(info: AlertInformation) {
    Swal.fire({
        icon: info.isSuccess ? 'success': 'error',
        title: info.title,
        text: info.text,
        confirmButtonColor: info.isSuccess ? '#3085d6': '#d33',
        confirmButtonText: info.isSuccess ? 'OK' : 'Try Again'
    });
}