import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Chart from 'chart.js';
import { Time } from '@angular/common';

export interface BrainReading {
  channel_values: string[];
  recorded_at: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'brain-hunt';
  @ViewChild('chart') canvas: ElementRef;
  chart: Chart.Chart;
  readings: BrainReading[];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.http.get('http://localhost:3000/reading_sessions').subscribe((reading_sessions) => {
      this.http.get(`http://localhost:3000/reading_sessions/${reading_sessions[0].id}/brain_samples`)
        .subscribe((res) => {
          this.readings = res['brain_samples'] as BrainReading[];
          this.buildChart();
        })
    })
  }

  buildChart() {
    let datasets = new Array(this.readings[0].channel_values.length);
    const labels = [];
    const base = this.readings[0].recorded_at;
    this.readings.forEach((i) => {
      labels.push(Math.round((i.recorded_at - base) * 100.0) / 100.0);
      i.channel_values.forEach((c, index) => {
        if (!datasets[index]) {datasets[index] = []}
        datasets[index].push(Number.parseFloat(c));
      })
    })
    datasets = datasets.map((data, index) => {
      return {
        label: `Channel ${index + 1}`,
        data: data,
        borderColor: `rgba(${index*50}, 43, 37, 1)`,
        backgroundColorColor: `rgba(${index*50}, 43, 37, 1)`
      }
    });
    
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Seconds'
            }
          }]
        }
      }
    });
  }
}
