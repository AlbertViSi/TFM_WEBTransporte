import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NodeService } from '../../../../core/services/node.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RoutesService } from '../../../../core/services/routes.service';
import { SubnodeFormComponent } from '../subnode-form/subnode-form.component';
import { DeleteSubnodeComponent } from '../delete-subnode/delete-subnode.component';
import { ReassignSubnodeComponent } from '../reassign-subnode/reassign-subnode.component';
import { LogisticsEditComponent } from '../logistics-edit/logistics-edit.component';

@Component({
  selector: 'app-routenodes.component',
  imports: [
    CommonModule,
    SubnodeFormComponent,
    DeleteSubnodeComponent,
    ReassignSubnodeComponent,
    LogisticsEditComponent
  ],
  templateUrl: './routenodes.component.html',
  styleUrl: './routenodes.component.scss',
})

export class RouteNodesComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private routesService: RoutesService,
    private cd: ChangeDetectorRef,
    private location: Location
  ) {}

  nodes: any[] = [];
  subnodes: any[] = [];
  routedata: any=null;
  routeName= '';

  routeId!: number;

  get mainNodes() {
    return this.nodes.filter(n => n.node_type === 'main');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('route_id');
    if (!id) return;
    this.routeId = Number(id);
    this.loadRouteData();
    //console.log(this.routeId)
    this.load();
  }

  

  load() {
    this.nodeService.getNodesByRoute(this.routeId)
      .subscribe(nodes => {
        this.nodes = nodes;
        this.nodeService.getSubnodes()
          .subscribe(sub => {

            this.subnodes = sub;
            this.cd.detectChanges();

          });
      });
  }

  loadRouteData() {
    this.routesService
      .getRouteDetail(this.routeId)
      .subscribe((data: any) => {
        this.routedata = data.route; //No esta en uso pero se guardan los datos de la ruta por si es necesario
        this.routeName = data.route.name;
        this.cd.detectChanges();
      });
  }

  getSubnodes(nodeId: number) {
    return this.subnodes.filter(s => s.parent_node_id === nodeId);
  }

  goBack() {
    this.location.back();
  }

  expandedNodes: number[] = [];
  
  toggle(nodeId: number) {
    if (this.expandedNodes.includes(nodeId)) {
      this.expandedNodes = this.expandedNodes.filter(id => id !== nodeId);
    } else {
      this.expandedNodes.push(nodeId);
    }
  }

  isExpanded(nodeId: number): boolean {
    return this.expandedNodes.includes(nodeId);
  }
}