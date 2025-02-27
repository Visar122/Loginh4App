import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule] 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, RouterModule] 
})
export class HomeComponent {
  userName: string | null = null;
  userStatus: string | null = null;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = userData.name;
      this.userStatus = userData.status;
    
      console.log('User data:', this.userStatus);
      console.log(localStorage.getItem('user'));

}

  }
  logout() {
    localStorage.removeItem('user');
    this.userStatus = null;
    this.userName = null;

    window.location.reload();
  }
}