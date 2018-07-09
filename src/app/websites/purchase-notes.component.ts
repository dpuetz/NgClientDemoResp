import { Component,  OnInit, ViewChild } from '@angular/core';
import { IPurchase } from './ipurchase'
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProductSaveService } from './product-save.service';

@Component({
  templateUrl: './purchase-notes.component.html',
})


export class PurchaseNotesComponent  implements OnInit {

    @ViewChild(NgForm) purchaseForm: NgForm;

    purchase: IPurchase;

    get wasSubmittedService():boolean { 
        return this.saveService.wasSubmitted; 
    } 
    set wasSubmittedService(value: boolean) { 
        this.saveService.wasSubmitted = value; 
    }         

    constructor (private route: ActivatedRoute,
                 private saveService: ProductSaveService) {
    }

    ngOnInit(): void {
        this.route.parent.data.subscribe(
            data => {
                        this.purchase = data['purchase'];
                        // if (this.purchaseForm) {            //probably not needed here, because they can't add a new purchase without going back to the website-detail component.
                        //     this.purchaseForm.reset();
                        // }
                    }
        );//subscribe

    }//ngOnInit
    
} //class