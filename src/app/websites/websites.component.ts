import { Component, OnInit, OnDestroy } from '@angular/core';
import { Website } from './iwebsite'
import { WebsiteService } from './website.service';
import { ISearch } from './isearch';
import { IMessage, Message } from '../shared/imessage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './websites.component.html'
})

export class WebsitesComponent implements OnInit, OnDestroy {

    websites: Website[];
    search: ISearch;
    recordsReturned: number = 0;
    popup : IMessage;
    subIsBill: Subscription;
    subIsPreferred: Subscription;
    searchForm: FormGroup;

    constructor( private websiteService: WebsiteService,
                 private fb: FormBuilder  ) { }

    ngOnInit() {


        this.search = {searchWord:'', isBill:true, isPreferred:false};

        this.searchForm = this.fb.group({
            searchWord: this.search.searchWord,
            isBill: this.search.isBill,
            isPreferred: this.search.isPreferred
        });

        const isBillControl = this.searchForm.get('isBill');
        this.subIsBill = isBillControl.valueChanges
                .pipe(debounceTime(100))
                .subscribe(() => {

                            this.doCheckSearch();
                        }
        );
        const isPreferredControl = this.searchForm.get('isPreferred');
        this.subIsPreferred = isPreferredControl.valueChanges
                .pipe(debounceTime(100))
                .subscribe(() =>
                            this.doCheckSearch()
                ); //subscribe

        this.getWebsites();
    }

    onComplete(event:any): void {}

    doSearch(): void
    {
        this.getWebsites();
    }
    doCheckSearch(): void
    {
        //update display on form
        this.searchForm.patchValue({
            searchWord: ''
        });
        this.getWebsites();
    }

    getWebsites():void {
        let searchParams = Object.assign({}, this.search, this.searchForm.value);
        this.websiteService.getWebsites(searchParams)
            .subscribe(websites =>
            {
                if (websites) {
                    this.websites = websites;
                    this.recordsReturned = websites.length;
                } else {
                    this.getError();
                }
            }); //subscribe
    }

    getError():void {
        console.log("err");
        this.popup = new Message('alert', 'Sorry, an error has occurred while getting the data.', "", 0);
    }
     ngOnDestroy() {
            if (this.subIsBill) {
                this.subIsBill.unsubscribe();
            }
            if (this.subIsPreferred) {
                this.subIsPreferred.unsubscribe();
            }
     } //ngOnDestroy

} //class
