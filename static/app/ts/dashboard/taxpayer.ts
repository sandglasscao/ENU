export class Taxpayer {
    id: number;
    owner: number;
    category: string;
    title: string;
    taxpayerno: string;
    phaddr: string;
    bankacct: string;
    invoicepic: File;
    certified: boolean;
    created: Date;
}