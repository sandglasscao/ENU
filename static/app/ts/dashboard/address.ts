import {AddressCode} from '../metadata/addresscode'

export class Address {
    id: number;
    no: number;
    address: string;
    block: AddressCode;
    district: AddressCode;
    city: AddressCode;
    province: AddressCode;
    country: AddressCode;
}