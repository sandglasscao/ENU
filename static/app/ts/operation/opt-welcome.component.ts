import { Component,OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES,Router } from '@angular/router';


@Component({
  templateUrl: 'static/app/templates/operation/opt-welcome.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [

  ]
})
export class OptWelcomeComponent  implements OnInit {
  weidcode: string;
  ngOnInit(){
  
    this.weidcode = sessionStorage.getItem('weidcode')
    
  }
}

