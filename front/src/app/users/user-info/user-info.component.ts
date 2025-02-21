import { Component, Input } from '@angular/core';
import { getRoleName } from '../../shared/utils/role.utils';
import { SharedModule } from '../../shared/modules/shared.module';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  @Input() user?: User;
  @Input() showRole: boolean = true;

  getRoleName = getRoleName;
}
