import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
  isLogin = false;

  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  //metoodo para loguearse-> iniciar sesion
  async singin(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLogin = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }
  //Registrarse
  async singup(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLogin = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }
  // logout --> cerrar sesion
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

  // METODO PARA LISTAR TODOS LOS ESTUDIANTES
  getEstudiantes() {
    return this.firestore.collection('estudiantes').snapshotChanges();
  }
  //
  createEstudiantes(estudiante: any) {
    return this.firestore.collection('estudiantes').add(estudiante);
  }

  updateEstudiante(id: any, estudiante: any) {
    return this.firestore.collection('estudiantes').doc(id).update(estudiante);
  }

  deleteEstudiante(id: any) {
    return this.firestore.collection('estudiantes').doc(id).delete();
  }
}
