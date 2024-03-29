import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // INICIALIZAR PARA INGRESO
  inSignIn = false;
  //ESTE ES PARA PAGINACIÓN
  config: any;
  closeResult = '';
  idFirebaseActualizar: string;
  actualizar: boolean;
  collection = {
    count: 10,
    data: [],
  };
  estudianteForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
  ) {}

  ngOnInit(): void {
    //Método para loguearse
    if (localStorage.getItem('user') !== null) {
      this.inSignIn = true;
    } else {
      this.inSignIn = false;
    }

    this.idFirebaseActualizar = '';
    this.actualizar = false;
    //PAGINACIÓN
    this.config = {
      itemsPerPage: 15,
      currentPage: 1,
      totalItems: this.collection.count,
    };

    this.estudianteForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
    });
    // OBTENER TODOS LOS ETUDIANTES
    this.firebaseServiceService.getEstudiantes().subscribe(
      (resp) => {
        this.collection.data = resp.map((e: any) => {
          return {
            id: e.payload.doc.data().id,
            nombre: e.payload.doc.data().nombre,
            apellido: e.payload.doc.data().apellido,
            idFirebase: e.payload.doc.id,
          };
        });
      },
      (error) => {
        console.error(error);
      }
    );
    // LOS OMITIMOS PORQUE VAMOS A USAR FIREBASE
    // for (let i = 0; i < this.collection.count; i++) {
    //   this.collection.data.push({
    //     id: i,
    //     nombre: ' nombre ' + i,
    //     apellido: ' apellido ' + i,
    //   });
    // }
  }
  //METODO PARA LA PAGINACIÓN
  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.firebaseServiceService.deleteEstudiante(item.idFirebase);
    // ESTE METODO ES SOLO PARA BORRAR DE MEMORIA O DEL ARRAY
    // this.collection.data.pop(item);
  }

  guardarEstudiante(): void {
    this.firebaseServiceService
      .createEstudiantes(this.estudianteForm.value)
      .then((resp) => {
        this.estudianteForm.reset();
        this.modalService.dismissAll();
      })
      .catch((error) => {
        console.error(error);
      });

    // este metodo se quita porque ya no es necesario con firebase
    // this.collection.data.push(this.estudianteForm.value);
  }

  actualizarEstudiante() {
    if (!isNullOrUndefined(this.idFirebaseActualizar)) {
      this.firebaseServiceService
        .updateEstudiante(this.idFirebaseActualizar, this.estudianteForm.value)
        .then((resp) => {
          this.estudianteForm.reset();
          this.modalService.dismissAll();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  openEditar(content, item: any) {
    // llenar el form
    this.actualizar = true;
    this.estudianteForm.setValue({
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido,
    });
    this.idFirebaseActualizar = item.idFirebase;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  // MODAL DIALOG
  open(content) {
    this.actualizar = false;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  // MODAL DIALOG
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // MEtodo de login
  async onSingup(email: string, password: string) {
    await this.firebaseServiceService.singup(email, password);
    if (this.firebaseServiceService.isLogin) {
      this.inSignIn = true;
    }
  }

  async onSingin(email: string, password: string) {
    await this.firebaseServiceService.singin(email, password);
    if (this.firebaseServiceService.isLogin) {
      this.inSignIn = true;
      console.log('si llega');
      console.log(this.inSignIn);
      
    }
  }
  handleLogout() {
    this.inSignIn = false;
  }
}
