import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeService } from '../../../../core/services/node.service';

@Component({
  selector: 'app-subnode-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subnode-form.component.html',
  styleUrl: './subnode-form.component.scss',
})
export class SubnodeFormComponent {

  @Input() nodes: any[] = []; // nodos principales

  @Output() created = new EventEmitter<void>();

  name = '';
  locations = '';
  parent_node_id: number | null = null;

  constructor(
    private nodeService: NodeService,
  ) {}

  create() {
    if (!this.name || !this.locations || !this.parent_node_id) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.nodeService.createSubnode({
      name: this.name,
      location: this.locations,
      parent_node_id: this.parent_node_id
    }).subscribe(() => {

      // reset
      this.name = '';
      this.locations = '';
      this.parent_node_id = null;

      alert('Subnodo creado');
      this.created.emit()

    });
  }

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}