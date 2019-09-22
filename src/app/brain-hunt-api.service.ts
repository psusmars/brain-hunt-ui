import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';



export interface BrainHuntResponse {
  links: {[key: string]: string};
}

export interface SimplifiedBrainSample {
  channel_values: number[];
  recorded_at: number;
}

export interface BrainSamplesResponse extends BrainHuntResponse {
  brain_samples: SimplifiedBrainSample[];
  reading_session: ReadingSession;
}

export interface ReadingSession {
  id: string;
  number_of_channels: number;
  sample_rate: number;
  notes: string;
  name: string;
  metadata?: {
    recorded_at: Date,
    last_recorded_at: Date,
    brain_sample_count: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class BrainHuntApiService {
  readonly baseUrl = "http://localhost:3000/"
  constructor(private http: HttpClient) {

  }

  getReadingSessions() : Observable<ReadingSession[]> {
    return this.http.get<ReadingSession[]>(
      `${this.baseUrl}reading_sessions`
    ).pipe(map((readingSessions: ReadingSession[]) => {
      return readingSessions.map((readingSession: ReadingSession) => {
        readingSession.metadata.recorded_at = new Date(readingSession.metadata.recorded_at as any);
        readingSession.metadata.last_recorded_at = new Date(readingSession.metadata.last_recorded_at as any);
        return readingSession;
      })
    }));
  }

  getBrainSamples(reading_session_id: string | number) : Observable<BrainSamplesResponse> {
    return this.http.get<BrainSamplesResponse>(
      `${this.baseUrl}reading_sessions/${reading_session_id}/brain_samples`
    );
  }
}
