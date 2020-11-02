import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private date = this.getYesterdaysDate();
  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.date}.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;

  constructor(private http: HttpClient) { }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let rows = result.split("\n");
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0, 4);
          mainData[country] = [];
          cols.forEach((value, index) => {
            let dateWise: DateWiseData = {
              cases: +value,
              country: country,
              date: new Date(Date.parse(dates[index]))
            };
            mainData[country].push(dateWise);
          });
        });
        return mainData;
      })
    );
  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split("\n");
        rows.splice(0, 1); // remove csv header row
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };

          let temp: GlobalDataSummary = raw[cs.country];

          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }

        });
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }

  getYesterdaysDate(back = 2) {
    let date = new Date();
    date.setDate(date.getDate() - back);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return ((month < 10 ? '0' : '') + month) + '-' + ((day < 10 ? '0' : '') + day) + '-' + year;
  }

}
