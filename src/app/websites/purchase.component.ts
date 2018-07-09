import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPurchase, Purchase } from './ipurchase'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WebsiteService } from '../websites/website.service';
import { IMessage, Message } from '../shared/imessage';
import { ProductSaveService } from './product-save.service';

@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})

export class PurchaseComponent implements OnInit, OnDestroy {

    purchase: IPurchase;
    websiteName: string = '';
    websiteId: number = 0;
    wasSubmitted: boolean;
    popup : IMessage;
    navigationSubscription;

    private dataIsValid: {[key: string]: boolean} = {};
   
    get wasSubmittedService():boolean { 
        return this.saveService.wasSubmitted; 
    } 
    set wasSubmittedService(value: boolean) { 
        this.saveService.wasSubmitted = value; 
    }          

    constructor(
                    private route: ActivatedRoute,
                    private router: Router,        
                    private websiteService: WebsiteService,
                    private saveService: ProductSaveService) {    
            this.navigationSubscription = this.router.events.subscribe((e: any) => {
                // If it is a NavigationEnd event, then re-initalise the component
                if (e instanceof NavigationEnd) {
                    this.initializePurchaseDetail();
                }
            });  

         }//constructor


    ngOnInit(): void {
        this.initializePurchaseDetail();        
    } 

    initializePurchaseDetail(): void {

        this.wasSubmittedService = false;

        // [routerLink]="['/websites', website.websiteID, 'purchase', purchase.purchaseID]"
        // [queryParams] = "{websiteName: website.websiteName}">

        //get the queryparam websiteName from queryParams
        this.websiteName = this.route.snapshot.queryParams.websiteName;        

        //get websiteId from required parameters
        this.route.paramMap.subscribe(params => {
            this.websiteId = +params.get('websiteId'); 
        }); //subscribe

        //get purchase from resolved data
        this.route.data.subscribe(data => {
             this.purchase = data['purchase'];
        });       
    } //initializePurchaseDetail


    isValid (path: string): boolean {
        this.validate();
        if (path) {
            return this.dataIsValid[path];
        } else {

            let x = Object.keys(this.dataIsValid).every (d => this.dataIsValid[d] === true);
            return (this.dataIsValid &&
                    Object.keys(this.dataIsValid).every (d => this.dataIsValid[d] == true));
        }    

    }

    validate(): void {

        this.dataIsValid = {};

        //main tab     
        if ( this.purchase.productName && this.purchase.productName.length > 1 )
            this.dataIsValid['main'] = true;
        else
            this.dataIsValid['main'] = false;

        //notes tab
        if (this.purchase.notes)
            this.dataIsValid['notes'] = true;
        else
            this.dataIsValid['notes'] = false;
    }
   
    
    ///////deleting
    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this purchase?', "onComplete", 0);       
    }
    onComplete(event:any):void {
        //if they confirm in the message-component dialog launched by this.deleteIt();
        this.websiteService.deletePurchase(this.purchase.purchaseID, this.websiteId)
        .subscribe(val => 
                    {                                                              
                        if (val) {                                                     
                            //show success msg for 1 sec then route back to websites list
                            this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                            setTimeout (() => {
                                this.router.navigate(['/websites', this.websiteId, 'detail' ]);
                            }, 1000);  
                        } else {
                            this.popup = new Message('alert', 'Sorry, an error occurred while deleting the purchase.', "", 0);    
                        }
                    });//subscribe
    }//onComplete  
     
    //////////saving
    saveIt(): void {

        this.wasSubmittedService = true;

        if (!this.isValid(null)) {
            return;
        }
        
        this.purchase.websiteID = this.websiteId; //website.id might not be there, so add it here for calling the webservice.
          
        this.websiteService.savePurchase(this.purchase)
            .subscribe(savedPurchase => 
                {
                    if (savedPurchase) {
                        //now refresh the purchase with data from service. Probably not necessary.
                        this.purchase = savedPurchase;

                        //We now have to update the component with a reroute reroute back to this component or will might have problems: and the url still says id = 0, and more issues as user keeps adding new websites.
                        //Delay the re-route for a bit so user can see the saved message first.
                        this.popup = new Message('timedAlert', 'Save was successful!', "", 1000);
                        setTimeout (() => {
                           this.router.navigate(['/websites', this.purchase.websiteID, 'purchase', this.purchase.purchaseID]); 
                            // this.router.navigate(['/websites', this.websiteId, 'detail']); 
                        }, 1000);  

                    } else {
                        this.popup = new Message('alert', 'Sorry, an error occurred while saving the purchase.', "", 0);   
                    }

                }); //subscribe          
    }  //saveIt   

     ngOnDestroy() {
            // !important - avoid memory leaks caused by navigationSubscription 
            if (this.navigationSubscription) {  
                this.navigationSubscription.unsubscribe();
            }
     }    


} //class
