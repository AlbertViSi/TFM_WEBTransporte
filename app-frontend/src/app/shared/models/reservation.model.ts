export interface Reservation {
  id: number;
  route_id: number;
  total_price: number;
  status: string;
  departure_date: Date;
}
