import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

export class ToastrUtils {
  static showToast(message: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'PTS',
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  static showErrorToast(error: string) {
    Swal.fire({
        icon: 'error',
        title: 'PTS',
        text: error,
      });
  }
}
