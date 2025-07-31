import { Reservation } from "./reservation";
import { ReservationDetails } from "./reservationDetails";

export interface ReservationComplete {
    reservation: Reservation;
    reservation_details: ReservationDetails[];
}