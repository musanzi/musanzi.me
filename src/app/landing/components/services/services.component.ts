import { Component } from '@angular/core';
import { SERVICES } from '../../data/services.data';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-services',
  imports: [LucideAngularModule],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  services = SERVICES;
}
