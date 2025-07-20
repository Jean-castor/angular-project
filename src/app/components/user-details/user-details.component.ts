import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {User} from '../../models';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

export class UserDetailsComponent implements OnInit {
    user: User | null = null;
    loading = false;
    error: string | null = null;

    constructor(
      private route: ActivatedRoute,
      private userService: UserService
    ) { }

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const id = params['id'];
        if(id){
          this.loadUser(id);
        }
      });
    }

    private loadUser(id: number): void {
      this.loading = true;
      this.error = null;

      this.userService.getUserById(id).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar detalhes do usuário';
          this.loading = false;
          console.error('Erro:', error);
        }
      });
    }

}

