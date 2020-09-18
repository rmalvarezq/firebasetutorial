import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  //ESTE ES PARA PAGINACIÓN
  config: any;
  closeResult = '';
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
    this.firebaseServiceService.getEstudiantes().subscribe(resp => {
        this.collection.data = resp.map((e: any) => {
          return {
            id: e.payload.doc.data().id,
            nombre: e.payload.doc.data().nombre,
            apellido: e.payload.doc.data().apellido,
            idFirebase: e.payload.doc.id
          };
        });
      },
      error => {
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
    this.collection.data.pop(item);
  }

  guardarEstudiante(): void {
    this.firebaseServiceService.createEstudiantes(this.estudianteForm.value).then((resp) => {
        this.estudianteForm.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });

    // este metodo se quita porque ya no es necesario con firebase
    // this.collection.data.push(this.estudianteForm.value);
  }
// MODAL DIALOG
  open(content) {
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
}
