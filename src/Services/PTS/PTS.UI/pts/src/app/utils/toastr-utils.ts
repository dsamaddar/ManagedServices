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

  static showConfirmDelete(message: string){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }
}
