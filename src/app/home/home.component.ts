import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Output() isLogout = new EventEmitter<void>();
  constructor(public firebaseService: FirebaseServiceService) {}

  ngOnInit(): void {}

  logout() {
    this.firebaseService.logout();
    this.isLogout.emit();
  }
}
