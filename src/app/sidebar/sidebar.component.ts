import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  sidebarOptions = [{label: 'Pathway List', route: '/dashboard'}, {label: 'Item1', route: '/'},
  {label: 'Item2', route: '/'}, {label: 'Item3', route: '/'}]

  constructor() { }

  ngOnInit(): void {
  }

}
