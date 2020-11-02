import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  statDate: string;
  totalActive = 0;
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  datatable = [];
  globalData: GlobalDataSummary[];
  tableData: GlobalDataSummary[];
  filteredData: GlobalDataSummary[];
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out'
      },
      is3D: true
    }
  };
  

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: (result) => {
          this.globalData = result;

          let dt = result;
          dt.pop();
          this.tableData = this.filteredData = dt;

          result.forEach(cs => {
            if(!Number.isNaN(cs.confirmed)) {
              this.totalActive += cs.active;
              this.totalConfirmed += cs.confirmed;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          });

          this.initChart("confirmed");
        }
      }
    );

      this.statDate = this.dataService.getYesterdaysDate();

  }

  initChart(caseType: string) {
    this.datatable = [];
    //this.datatable.push(["Country", "Cases"]);

    this.globalData.forEach(cs => {
      let value: number;

      if(caseType === 'confirmed') {
        if(cs.confirmed > 170000) {
          value = cs.confirmed;
          this.datatable.push([cs.country, value]);
        }
      }
        
      if(caseType === 'active') {
        if(cs.active > 170000) {
          value = cs.active;
          this.datatable.push([cs.country, value]);
        }
      }
        
      if(caseType === 'recovered') {
        if(cs.recovered > 170000) {
          value = cs.recovered;
          this.datatable.push([cs.country, value]);
        }
      }
        
      if(caseType === 'deaths') {
        if(cs.deaths > 1000) {
          value = cs.deaths;
          this.datatable.push([cs.country, value]);
        }
      }
        
    });

  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }

  filterTable(query) {
    let q = (query.value).toLowerCase();

    this.filteredData = (q) ?
      this.globalData.filter(c => c.country.toLowerCase().includes(q)) : this.globalData;
  }

}
