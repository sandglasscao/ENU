import {User} from '../user'
import {Individual} from './individual'
import {Enterprise} from './enterprise'
import {Orgnization} from './orgnization'
import {Address} from './address'

export class Profile {
    user: User;
    email: string;
    usertype: number;
    cell: string;
    name: string;
    name2: string;
    idtype: number;
    idname: string;
    idno: string;
    address: Address;
    individual: Individual;
    enterprise: Enterprise;
    orgnization: Orgnization;
}