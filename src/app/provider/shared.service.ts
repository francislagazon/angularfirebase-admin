import { Injectable } from '@angular/core';
import * as _ from 'underscore';

export interface IAlert {
    type: string;
    message: string;
    active: boolean
}

@Injectable()
export class SharedService {

    getPager(totalItems: number, currentPage: number = 1, pageSize: number) {

        let totalPages = Math.ceil(totalItems / pageSize);
 
        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        let pages = _.range(startPage, endPage + 1);
 
        return {
            currentPage: currentPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
