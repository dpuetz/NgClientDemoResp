import { Component, OnInit, ViewChild } from '@angular/core';
import { IPurchase } from './ipurchase'
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProductSaveService } from './product-save.service';


@Component({
  templateUrl: './purchase-main.component.html',
})

export class PurchaseMainComponent  implements OnInit {

    @ViewChild(NgForm) purchaseForm: NgForm;

    purchase: IPurchase;
    a2eOptions: any = {format: 'M/D/YYYY'};

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
            data => 
            { 
                this.purchase = data['purchase'];

                // if (this.purchaseForm) {    //probably not needed here, because they can't add a new purchase without going back to the website-detail component.
                //     this.purchaseForm.reset();  //also, not needed on more than one child form, just the one.
                // }
            }
        );//subscribe

    } //ngOnInit
    
} //class