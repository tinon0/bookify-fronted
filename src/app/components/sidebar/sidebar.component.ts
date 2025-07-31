import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  userRole: string | undefined;

  constructor(private router: Router, private sessionService: SessionService) {}

  ngOnInit() {
    this.userRole = this.sessionService.get('userRole') || undefined; // Valor por defecto si no está definido
  }
  navigateIfNeeded(targetRoute: string) {
  if (this.router.url === targetRoute) {
    // Ya estamos en la ruta, no hacemos nada
    return;
  }

  this.router.navigate([targetRoute]);
}
}

