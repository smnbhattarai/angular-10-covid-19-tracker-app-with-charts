import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalActive') totalActive;
  @Input('totalConfirmed') totalConfirmed;
  @Input('totalDeaths') totalDeaths;
  @Input('totalRecovered') totalRecovered;

  constructor() { }

  ngOnInit(): void {
  }

}
