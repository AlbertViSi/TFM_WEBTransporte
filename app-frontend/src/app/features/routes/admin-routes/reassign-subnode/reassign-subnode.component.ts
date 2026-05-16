import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeService } from '../../../../core/services/node.service';

@Component({
  selector: 'app-reassign-subnode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reassign-subnode.component.html',
  styleUrl: './reassign-subnode.component.scss',
})

export class ReassignSubnodeComponent {

  @Input() subnodeId!: number;
  @Input() mainNodes: any[] = [];

  @Output() reassigned = new EventEmitter<void>();

  newParentId!: number;
  showForm = false;

  constructor(
    private nodeService: NodeService
  ) {}

  toggle() {
    this.showForm = !this.showForm;
  }

  reassign() {

    if (!this.newParentId) {
      alert('Selecciona un nodo destino');
      return;
    }

    this.nodeService
      .reassignSubnode(this.subnodeId, {
        new_parent_id: this.newParentId
      })
      .subscribe({
        next: () => {
          alert('Subnodo reasignado');
          this.showForm = false;
          this.reassigned.emit()
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.error || 'Error reasignando');
        }
      });
  }
}