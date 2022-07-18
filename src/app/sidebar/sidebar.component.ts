import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  sidebarOptions = [{label: '', route: '68875'}, {label: '69242', route: '/'},
  {label: '69620', route: '/'}, {label: '195721', route: '/'}, {label: '453274', route: '/'},
  {label: '453279', route: '/'}, {label: '1227986', route: '/'}, {label: '1257604', route: '/'},
  {label: '3700989', route: '/'}, {label: '5673001', route: '/'}, {label: '5693567', route: '/'}]

  constructor() { }

  ngOnInit(): void {
  }

}
