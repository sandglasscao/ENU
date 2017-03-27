import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {MetadataService}  from '../metadata/metadata.service';
import {AddressService} from './address.service';
import {ProfileService}  from './profile.service';
import {AddressCode} from '../metadata/addresscode';
import {Address} from './address';
import {Profile} from './profile';
import {WizardService} from  '../wizard/wizard.service';

@Component({
    templateUrl: 'static/app/templates/dashboard/address.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        AddressService,
        MetadataService,
        ProfileService,
        WizardService
    ],
    // pipes: [AddressNamePipe]
})
export class AddressComponent implements OnInit {
    countries = [];
    provinces = [];
    cities = [];
    districts = [];
    blocks = [];
    addresses = [];
    //addressLength = 0;
    nextAddressNo: number;
    defaultAddress: number;
    currentCountry: AddressCode;
    currentProvince: AddressCode;
    currentCity: AddressCode;
    currentDistrict: AddressCode;

    model = new Address();

    isShowMsg = false;
    message = "";
    error = "";

    constructor(private addressService: AddressService,
                private metadataService: MetadataService,
                private profileService: ProfileService,
                private router: Router,
                private wizardService: WizardService) {
    }

    cancel() {
        this.foreward();
    }

    ngOnInit() {
        this.metadataService
            .getCountries()
            .then(countries => {
                this.countries = countries;
                // console.log('countris: '+JSON.stringify(this.countries))
            })
            .catch(error => this.error = error); // TODO: Display error message


        this.addressService
            .listAddresses()
            .then(addresses => {
                this.addresses = addresses;
                var max = 0;
                for (var item in addresses)  max = (max < addresses[item].no) ? addresses[item].no : max;
                this.nextAddressNo = max + 1;
            })
            .catch(error => this.error = error); // TODO: Display error message

        this.getDefaultAddr();
    }

    onSubmit() {
        this.model.no = this.nextAddressNo;
        this.addressService
            .addAddress(this.model)
            .then(address => {
                //console.log('new address :' + JSON.stringify(address));
                this.addresses.push(address);
                if (this.addresses.length == 1) {
                    this.defaultAddress = address.id;
                    this.setDefault(this.model);
                }
                this.nextAddressNo = address.no + 1;
                this.model = new Address();
                this.foreward();
            })
            .catch(error => this.error = error); // TODO: Display error message
    }


    rmaddress(address: Address) {
        this.addressService
            .delAddress(address.id)
            .then(res => this.addresses = res.ok ? this.addresses.filter(item => item.id != address.id) : this.addresses)
            .catch(error => this.error = error); // TODO: Display error message
    }

    selectCity(city) {
        //console.log('selected city:' + city);
        /*var code = '';
         for (var i = 0; i < this.cities.length; i++) {
         if (this.cities[i].id == city) {
         code = this.cities[i].code;
         break;
         }
         }*/
        let code = this.cities.filter(item => item.id == city)[0].code;
        this.metadataService
            .getDistricts(code)
            .then(districts => {
                this.districts = districts;
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    selectCountry(country) {
        /*var code = '';
         for (var i = 0; i < this.countries.length; i++) {
         var pro = this.countries[i];
         //console.log(pro.id);
         if (pro.id == country) {
         code = pro.code;
         break;
         }
         }*/
        let code = this.countries.filter(item => item.id == country)[0].code;
        this.metadataService
            .getProvinces(code)
            .then(provinces => {
                this.provinces = provinces;
                // console.log('provinces: '+JSON.stringify(this.provinces))
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    selectDistrict(district) {
        /*var code = '';
         for (var i = 0; i < this.districts.length; i++) {
         if (this.districts[i].id == district) {
         code = this.districts[i].code;
         break;
         }
         }*/
        let code = this.districts.filter(item => item.id == district)[0].code;
        this.metadataService
            .getBlocks(code)
            .then(blocks => this.blocks = blocks)
            .catch(error => this.error = error); // TODO: Display error message
    }

    selectProvince(province) {
        //console.log('province:' + province);
        /*var code = '';
         for (var i = 0; i < this.provinces.length; i++) {
         var pro = this.provinces[i];
         //console.log(pro.id);
         if (pro.id == province) {
         code = pro.code;
         break;
         }
         }*/
        let code = this.provinces.filter(item => item.id == province)[0].code;
        this.metadataService
            .getCities(code)
            .then(cities => {
                this.cities = cities;
            })
            .catch(error => this.error = error); // TODO: Display error message


    }

    /*
     private getAddressName(addresses, id) {
     for (var i = 0; i < addresses.length; i++) {
     var pro = addresses[i];
     if (pro.id == id) {
     return pro.description;
     }
     }

     }*/

    private foreward() {
        this.router.navigate([this.wizardService.nextStep(this.router.url)]);
    }

    private getDefaultAddr() {
        this.profileService.retrieveProfile(sessionStorage.getItem("weidcode"))
            .then(profile => this.defaultAddress = profile.address ? profile.address.id : null)
            .catch(error => console.log(error));
    }

    private setDefault(address: Address) {
        let profile = new Profile();
        profile.address = address;

        this.profileService.updateProfile(profile)
            .then(profile => {
                this.isShowMsg = true;
                this.message = "设置默认地址成功！";
                this.defaultAddress = profile.address.id;
            })
            .catch(error => console.log(error))
    }
}