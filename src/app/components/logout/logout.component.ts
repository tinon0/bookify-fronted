import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  private sessionService : SessionService = inject(SessionService)
  private router : Router = inject(Router)

  logout() {
    this.sessionService.removeIdClient()
    this.sessionService.delete("userRole")
    this.sessionService.delete("authHeader")
    this.router.navigate(['/login'])
  }
}
