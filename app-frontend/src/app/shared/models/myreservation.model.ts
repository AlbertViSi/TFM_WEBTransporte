export interface MyReservation {
  id: number;
  route_id: number;
  route_name: string;
  origin_name: string;
  destination_name: string;
  departure_date: string;
  total_price: number;
  status: string;
  dni: string;
}
