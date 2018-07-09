//angular for services
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';




@Injectable()

export class ProductSaveService {
    wasSubmitted: boolean = false;
}//class



