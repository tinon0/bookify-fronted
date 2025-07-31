import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { BookCatalogueComponent } from './components/book-catalogue/book-catalogue.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookingCartComponent } from './components/booking-cart/booking-cart.component';
import { AdminViewBooksComponent } from './components/admin-view-books/admin-view-books.component';
import { AdminNotificationsComponent } from './components/admin-notifications/admin-notifications.component';
import { ClientDonateComponent } from './components/client-donate/client-donate.component';
import { ClientReservationsComponent } from './components/client-reservations/client-reservations.component';
import { ClientDonationsComponent } from './components/client-donations/client-donations.component';
import { AdminReservationsComponent } from './components/admin-reservations/admin-reservations.component';
import { AdminClientsComponent } from './components/admin-clients/admin-clients.component';
import { AdminPaymentsComponent } from './components/admin-payments/admin-payments.component';
import { ClientFinesComponent } from './components/client-fines/client-fines.component';
import { AdminDonationsComponent } from './components/admin-donations/admin-donations.component';
import { AdminFinesComponent } from './components/admin-fines/admin-fines.component';
import { ClientViewBooksComponent } from './components/client-view-books/client-view-books.component';
import { NotAuthorinotAuthorizedComponent } from './components/not-authorinot-authorized/not-authorinot-authorized.component';
import { authGuard } from './auth.guard';
import { TermConditionsComponent } from './components/term-conditions/term-conditions.component';
import { DonationSuccessBackurlComponent } from './components/donation-success-backurl/donation-success-backurl.component';
import { DonationFailureBackurlComponent } from './components/donation-failure-backurl/donation-failure-backurl.component';
import { PaymentSuccessBackurlComponent } from './components/payment-success-backurl/payment-success-backurl.component';
import { PaymentFailureBackurlComponent } from './components/payment-failure-backurl/payment-failure-backurl.component';
import { FineSuccessBackurlComponent } from './components/fine-success-backurl/fine-success-backurl.component';
import { FineFailureBackurlComponent } from './components/fine-failure-backurl/fine-failure-backurl.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'createUser',
        component: CreateUserComponent
    },
    {
        path: 'principal',
        component: BookCatalogueComponent
    },
    {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'book-details/:id',
        component: BookDetailComponent
    },
    {
        path: 'booking-cart',
        component: BookingCartComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'books',
        component: ClientViewBooksComponent
    },
    {
        path: 'admin-view-books',
        component: AdminViewBooksComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'admin-notifications',
        component: AdminNotificationsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'client-donate',
        component: ClientDonateComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'my-reservations',
        component: ClientReservationsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'my-donations',
        component: ClientDonationsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'reservations',
        component: AdminReservationsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'clients',
        component: AdminClientsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'payments',
        component: AdminPaymentsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'my-fines',
        component: ClientFinesComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'donations',
        component: AdminDonationsComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'fines',
        component: AdminFinesComponent,
        canActivate: [authGuard],
        data: { allowedRoles: ['ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'notAuthorized',
        component: NotAuthorinotAuthorizedComponent
    },
    {
        path: 'documentation',
        component: TermConditionsComponent
    },
    {
        path: 'donation-success',
        component: DonationSuccessBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'donation-failure',
        component: DonationFailureBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'payment-success',
        component: PaymentSuccessBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'payment-failure',
        component: PaymentFailureBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'fine-success',
        component: FineSuccessBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: 'fine-failure',
        component: FineFailureBackurlComponent,
        // canActivate: [authGuard],
        // data: { allowedRoles: ['CLIENT', 'ADMIN', 'SUPERADMIN'] }
    },
    {
        path: '**',
        redirectTo: '/principal',
        pathMatch: 'full'
    }
    
];
