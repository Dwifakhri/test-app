import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './result.component.html',
})
export class ResultComponent {}
