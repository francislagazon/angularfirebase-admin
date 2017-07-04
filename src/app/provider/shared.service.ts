import { Injectable } from '@angular/core';
import { ERROR } from './../../firebase-backend/functions/model/error/error';

export interface IAlert {
    type?: string;
    message: string;
    active?: boolean
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
 
        return {
            currentPage: currentPage,
            startIndex: startIndex,
            endIndex: endIndex
        };
    }

    errorWrap( error : string) {
        /* Remove underscore  */
        let message = ERROR[error].replace( '_' , ' ' );
        if ( message ) {
            let e = {
                message: message.charAt(0).toUpperCase() + message.slice(1),
                type: 'danger'
            }
            return e;
        }
        else return { message: "Error does not exists", type: "danger" };

    }
}
