import { Pipe, PipeTransform } from '@angular/core';
import { AddressCode } from '../metadata/addresscode';

@Pipe({name: 'addressname'})
export class AddressNamePipe implements PipeTransform {
  transform(value: number,addresses: AddressCode[]): string {
      for(var i=0; i < addresses.length; i++) {
          var pro = addresses[i];
          if(pro.id == value){
            return pro.description;
          }
      }  
  }
}