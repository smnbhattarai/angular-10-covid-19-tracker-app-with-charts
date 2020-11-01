import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  totalActive = 0;
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data: GlobalDataSummary[];
  countries: string[] = [];
  dateWiseData;
  selectedCountryData: DateWiseData[] = [];
  dataTable = [];
  selectedCountry = 'Afghanistan';
  chart = {
    LineChart: "LineChart",
    height: 600,
    options: {
      animation: {
        duration: 1000,
        easing: 'out'
      }
    }
  };


  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          if (cs.country !== undefined)
            this.countries.push(cs.country);
        });
      }))
    ).subscribe({
      complete: () => {
        this.updateValues("Afghanistan");
        this.updateChart();
      }
    })

  }

  updateValues(country: string) {
    this.data.forEach(cs => {
      if (cs.country === country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountry = country;
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
  }

  updateChart() {
    this.dataTable = [];
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases]);
    });

  }

}
