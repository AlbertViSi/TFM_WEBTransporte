import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NodeService } from '../../../../core/services/node.service';
import { OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SubnodeFormComponent } from '../subnode-form/subnode-form.component';
import { DeleteSubnodeComponent } from '../delete-subnode/delete-subnode.component';
import { ReassignSubnodeComponent } from '../reassign-subnode/reassign-subnode.component';

@Component({
  selector: 'app-allnodes.component',
  imports: [
    CommonModule,
    SubnodeFormComponent,
    DeleteSubnodeComponent,
    ReassignSubnodeComponent
  ],
  templateUrl: './allnodes.component.html',
  styleUrl: './allnodes.component.scss',
})
export class AllNodesComponent implements OnInit {

  mainNodes: any[] = [];
  subnodes: any[] = [];

  expandedNodes: Set<number> = new Set();

  constructor(
    private nodesService: NodeService,
    private cd: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadNodes();
  }

  loadNodes() {
    this.nodesService.getMainNodes().subscribe(main => {
      this.mainNodes = main;

      this.nodesService.getSubnodes().subscribe(sub => {
        this.subnodes = sub;
        this.cd.detectChanges();
      });
    });
  }

  toggle(nodeId: number) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  getSubnodesByParent(parentId: number) {
    return this.subnodes.filter(s => s.parent_node_id === parentId);
  }

  isExpanded(id: number) {
    return this.expandedNodes.has(id);
  }

  goBack() {
    this.location.back();
  }
}