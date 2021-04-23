//SWEETALERT2
import Swal from 'sweetalert2';

export const darkAlert = (dark: boolean) => {
    Swal.fire({
        icon: 'info',
        title: `<p id="design">${!dark ? `Dark` : `Light`}</p>`,
        text: `You enabled ${!dark ? `Dark` : `Light`} Theme!`,
        timer: 2000,
        showConfirmButton: false
    })
}