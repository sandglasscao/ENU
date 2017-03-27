import {GrossCheck} from './gross-check';
import {DetailCheck} from './detail-check';

export class Freight {
    sender_weidcode: string;
    sender_cell: string;
    sender_address: string;
    recipient_weidcode: string;
    recipient_cell: string;
    recipient_address: string;
    paymode: string;
    paycard: string;
    hasCheck: boolean;
    gross_check: GrossCheck;
    detail_check: DetailCheck;
    manifest: string;
    count: number;
    volume: number;
    weight: number;
    delivery_method: string;
    shipper_weidcode: string;
    mark: string;

}