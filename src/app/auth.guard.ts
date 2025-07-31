import { inject } from '@angular/core';
import { CanActivateFn, Router } from "@angular/router";
import { SessionService } from './services/session.service';

export const authGuard : CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService)
    const router = inject(Router)

    const allowedRoles = route.data['allowedRoles'] as string[]
    const userRole = sessionService.get('userRole')

    if (!userRole) {
        router.navigate(['/login'])
        return false
    }

    if (userRole && allowedRoles.includes(userRole)) {
        return true
    } else {
        router.navigate(['/notAuthorized'])
        return false
    }
}