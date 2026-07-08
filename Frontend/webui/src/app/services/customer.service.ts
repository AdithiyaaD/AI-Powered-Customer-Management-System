import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  getAll() {
    return this.http.get<Customer[]>('http://localhost:5285/api/customers');
  }
  update(customer: Customer) {
    return this.http.put(
      `${this.apiUrl}/${customer.customerId}`,
      customer
    );
  }
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
