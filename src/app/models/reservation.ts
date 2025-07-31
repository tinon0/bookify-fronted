export interface Reservation {
    id_reservation: number;
    id_client: number;
    reservation_date: Date;
    return_date: Date;
    status: string;
    is_premium: boolean; 
}