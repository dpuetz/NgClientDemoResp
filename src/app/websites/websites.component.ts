import { Component, OnInit } from '@angular/core';
import { Website } from './iwebsite'
import { WebsiteService } from './website.service';
import { ISearch } from './isearch';
import { IMessage, Message } from '../shared/imessage';


@Component({
    templateUrl: './websites.component.html',
    styleUrls: ['./websites.component.css']
})

export class WebsitesComponent implements OnInit {

    websites: Website[];
    search: ISearch;
    recordsReturned: number = 0;
    popup : IMessage;

    constructor( private websiteService: WebsiteService ) { }

    ngOnInit() {
        this.search = {searchWord:'', isBill:false, isPreferred:false};
        this.getWebsites();
    }

    onComplete(event:any): void {}

    doSearch(): void
    {
        this.getWebsites();
    }
    doCheckSearch(): void
    {
        this.search.searchWord = '';
        this.getWebsites();
    }

    getWebsites():void {
        let searchParams: ISearch = {searchWord: this.search.searchWord,
                          isBill: this.search.isBill,
                          isPreferred: this.search.isPreferred};
        this.websiteService.getWebsites(searchParams)
            .subscribe(websites =>
            {
                if (websites) {
                    this.websites = websites;
                    this.recordsReturned = websites.length;
                } else {
                    this.getError();
                }
            },
                error => this.getError()
            ); //subscribe
    }

    getError():void {
        console.log("err");
        this.popup = new Message('alert', 'Sorry, an error has occurred while getting the data.', "", 0);
    }


} //class

// import { Component, OnInit } from '@angular/core';
// import { Website } from './iwebsite'
// import { WebsiteService } from './website.service';
// import { ISearch } from './isearch';
// import { IMessage, Message } from '../shared/imessage';


// @Component({
//     templateUrl: './websites.component.html',
//     styleUrls: ['./websites.component.css']
// })

// export class WebsitesComponent implements OnInit {

//     websites: Website[];
//     search: ISearch;
//     recordsReturned: number = 0;
//     popup : IMessage;

//     constructor( private websiteService: WebsiteService ) { }

//     ngOnInit() {
//         this.search = {searchWord:'', isBill:false, isPreferred:false};
//         this.getWebsites();
//     }

//     onComplete(event:any): void {}

//     doSearch(): void
//     {
//         this.getWebsites();
//     }
//     doCheckSearch(): void
//     {
//         this.search.searchWord = '';
//         this.getWebsites();
//     }

//     getWebsites():void {
//         let searchParams: ISearch = {searchWord: this.search.searchWord,
//                           isBill: this.search.isBill,
//                           isPreferred: this.search.isPreferred};
//         this.websiteService.getWebsites(searchParams)
//             .subscribe(websites =>
//             {
//                 if (websites) {
//                     this.websites = websites;
//                     this.recordsReturned = websites.length;
//                 } else {
//                     this.getError();
//                 }
//             },
//                 error => this.getError()
//             ); //subscribe
//     }

//     getError():void {
//         console.log("err");
//         this.popup = new Message('alert', 'Sorry, an error has occurred while getting the data.', "", 0);
//     }


// } //class
