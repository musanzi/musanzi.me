import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/ui/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LoaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
