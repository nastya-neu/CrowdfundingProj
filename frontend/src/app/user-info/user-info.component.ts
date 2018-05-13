import { Component, OnInit, Input } from '@angular/core';

interface User {
  avatar: String,
  name: String
}

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
