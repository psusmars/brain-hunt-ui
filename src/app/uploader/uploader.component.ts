import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrainHuntApiService } from '../brain-hunt-api.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef,
    private brainHunt: BrainHuntApiService) { 
  }

  ngOnInit() {
    this.formGroup = this._fb.group(
      {
        file: this._fb.control(null, [Validators.required]),
        name: this._fb.control(null, [Validators.required])
      }
    )
  }

  onFileChange(event) {
    let reader = new FileReader();
   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.formGroup.controls['name'].setValue(file.name);
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
        
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  public onSubmit() {
    this.brainHunt.createReadingSession(this.formGroup.value).subscribe(
      () => console.log('success')
    );
  }

}
