import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    searchPerson(cpf: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/pessoas/${cpf}`);
    }

    addPerson(person: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/pessoas`, person);
    }

    updatePerson(person: any, id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/pessoas/${id}`, person);
    }

    deletePerson(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/pessoas/${id}`);
    }
}
