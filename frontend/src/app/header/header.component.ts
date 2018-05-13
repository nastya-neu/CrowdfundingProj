import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userInfo;
  constructor() { }

  ngOnInit() {
  }

  getUser() {
    this.userInfo = {
      avatar: "/assets/images/default-user.png",
      name: "Ivan Petrov" 
    }
  }
}
