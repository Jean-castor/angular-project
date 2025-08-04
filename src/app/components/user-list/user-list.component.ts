import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserPage } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  page = 0;
  size = 6;
  totalPages = 0;
  loading = false;
  error: string | null = null;

  // Propriedades para o modal
  showDeleteModal = false;

  // Alterando o tipo para armazenar o usuário completo
  userToDelete: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 0): void {
    this.loading = true;
    this.error = null;

    // Evita requisição de página negativa
    if(page < 0){
      this.error = 'Página não pode ser negativa';
      this.loading = false;
      return;
    }

    // Evita múltiplas chamadas enquanto uma já está em andamento
    if(this.loading){
      console.warn("Requisição de usuários em andamento...")
    }

    this.userService.getUsers(page, this.size).subscribe({
      next: (userPage: UserPage) => {
        this.users = userPage.content;
        this.page = userPage.number;
        this.totalPages = userPage.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (this.userToDelete?.userId) {
      this.userService.deleteUser(this.userToDelete.userId).subscribe({
        next: () => {
          this.loadUsers();
          this.closeDeleteModal();
        },
        error: (error) => {
          this.error = 'Erro ao excluir usuário';
          console.error('Erro ao excluir usuário:', error);
          this.closeDeleteModal();
        }
      });
    }
  }
}
