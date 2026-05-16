import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NodeService } from '../../../../core/services/node.service';

@Component({
  selector: 'app-delete-subnode',
  standalone: true,
  templateUrl: './delete-subnode.component.html',
  styleUrl: './delete-subnode.component.scss',
})
export class DeleteSubnodeComponent {

  @Input() subnodeId!: number;

  @Output() deleted = new EventEmitter<void>();

  constructor(
    private nodeService: NodeService,
  ) {}

  delete() {
    if (!confirm('¿Eliminar subnodo?')) return;

    this.nodeService.deleteSubnode(this.subnodeId)
      .subscribe({
        next: () => {
          alert('Subnodo eliminado');
          this.deleted.emit()
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.error || 'Error eliminando');
        }
      });
  }
}