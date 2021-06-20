import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
	tareas.addEventListener('click', (e) => {
		// console.log(e.target.classList);
		if (e.target.classList.contains('fa-check-circle')) {
			//console.log('Actualizando...');
			const icono = e.target;
			// permite ubicarnos en el elemento li
			const idTarea = icono.parentElement.parentElement.dataset.tarea;

			//console.log(idTarea);
			//request hacia /tareas/:id
			const url = `${location.origin}/tareas/${idTarea}`;
			//console.log(url);
			axios.patch(url, { idTarea }).then(function(respuesta) {
				//console.log(respuesta);
				if (respuesta.status === 200) {
					icono.classList.toggle('completo');
					actualizarAvance();
				}
			});
		}
		if (e.target.classList.contains('fa-trash')) {
			const tareaHTML = e.target.parentElement.parentElement,
				idTarea = tareaHTML.dataset.tarea;
			Swal.fire({
				title: 'Deseas borrar esta Tarea',
				text: 'Una tarea eliminada no se puede eliminar',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, Borrar',
				cancelButtonText: 'No, Cancelar',
			}).then((result) => {
				if (result.isConfirmed) {
					// enviar peticion a axios
					const url = `${location.origin}/tareas/${idTarea}`;
					axios
						.delete(url, {
							params: { idTarea },
						})
						.then(function(respuesta) {
							//console.log(respuesta);
							if (respuesta.status === 200) {
								// Eliminar HTML
								tareaHTML.parentElement.removeChild(tareaHTML);
							}
							Swal.fire('Tarea Eliminada', respuesta.data, 'success');
							actualizarAvance();
						})
						.catch(() => {
							Swal.fire({
								icon: 'error',
								title: 'Hubo un error',
								text: 'No se pudo eliminar la tarea',
								// footer: '<a href>Why do I have this issue?</a>'
							});
						});
				}
			});
		}
	});
}
export default tareas;
