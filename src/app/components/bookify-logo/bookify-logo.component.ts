import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookify-logo',
  standalone: true,
  imports: [],
  templateUrl: './bookify-logo.component.html',
  styleUrl: './bookify-logo.component.css'
})
export class BookifyLogoComponent {
  private sessionService : SessionService = inject(SessionService)
  private router : Router = inject(Router)

  click() {
    const role = this.sessionService.get("userRole")
    if (role === "ADMIN") {
      this.router.navigate(['/dashboard'])
    } else {
      this.router.navigate(['/principal'])
    }
  }
}
