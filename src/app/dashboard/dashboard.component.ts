import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { BrainHuntApiService, SimplifiedBrainSample, ReadingSession, BrainSamplesResponse } from '../brain-hunt-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'brain-hunt';
  @ViewChild('chart', {static: false}) canvas: ElementRef;
  chart: Chart.Chart;
  readingSessions: ReadingSession[];
  readings: SimplifiedBrainSample[];
  private _selectedReadingSession: ReadingSession;
  public get selectedReadingSession(): ReadingSession {
    return this._selectedReadingSession;
  }
  public set selectedReadingSession(value: ReadingSession) {
    this._selectedReadingSession = value;
  }

  constructor(private brainHuntApiService: BrainHuntApiService) { }

  ngOnInit() {
    this.brainHuntApiService.getReadingSessions().subscribe((result) => {
      this.readingSessions = result;
    });
  }

  loadBrainSamples() {
    this.brainHuntApiService.getBrainSamples(this.selectedReadingSession.id).subscribe((brainSampleR: BrainSamplesResponse) => {
      this.readings = brainSampleR.brain_samples;
      this.buildChart();
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
        datasets[index].push(c);
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
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  recordingDuration() {
    const metadata = this.selectedReadingSession.metadata;
    return (metadata.last_recorded_at.getTime() - metadata.recorded_at.getTime())/1000;
  }
}
