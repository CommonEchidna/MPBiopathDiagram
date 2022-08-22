import { Component, Injectable, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
import {tabstore} from '../tabstore'
import {MatSnackBar} from '@angular/material/snack-bar';
import { PathwayDiagramComponent } from '../pathway-diagram/pathway-diagram.component';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';


cytoscape.use(klay);
var mode="snackbar";
var dotSrcLines;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
@Injectable()
export class DashboardComponent implements OnInit {
  cytoscapeGraphMain: Object[]=[{label:"Untitled",src:[],cytoSrc:[]},{label:"Untitled",src:[] ,cytoSrc:[]}];
  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 
  store = contactStore;
  store2 = tabstore;
  selectedTab = tabstore.tabnum;
  titledbid:Object[];
  cytoMode:string="cytoscape";

  constructor() { }

  ngOnInit(): void {
  }
  render(){
    if(this.cytoMode=="graphviz"){
      var dot = this.cytoscapeGraphMain[this.selectedTab]['src'].join("");
      console.log(dot);
      if(dot.length>0){
        d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot(dot);

      }
      else{
        d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot("digraph {}");

      }
      console.log("CONSIDEERED");

    } else {
        console.log("DONE1234");
        var defaults = {
          animate: true, // whether to show the layout as it's running
          refresh: 1, // number of ticks per frame; higher is faster but more jerky
          maxSimulationTime: 4000, // max length in ms to run the layout
          ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
          fit: true, // on every layout reposition of nodes, fit the viewport
          padding: 30, // padding around the simulation
          boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
          nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
        
          // layout event callbacks
          ready: function(){}, // on layoutready
          stop: function(){}, // on layoutstop
        
          // positioning options
          randomize: false, // use random node positions at beginning of layout
          avoidOverlap: true, // if true, prevents overlap of node bounding boxes
          handleDisconnected: true, // if true, avoids disconnected components from overlapping
          convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
          nodeSpacing: function( node ){ return 10; }, // extra spacing around nodes
          flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
          alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
          gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
          centerGraph: true, // adjusts the node positions initially to center the graph (pass false if you want to start the layout from the current position)
        
          // different methods of specifying edge length
          // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
          edgeLength: undefined, // sets edge length directly in simulation
          edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
          edgeJaccardLength: undefined, // jaccard edge length in simulation
        
          // iterations of cola algorithm; uses default values on undefined
          unconstrIter: undefined, // unconstrained initial layout iterations
          userConstIter: undefined, // initial layout iterations with user-specified constraints
          allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
        };
        console.log("STARTING");
        var cy = cytoscape({

          container: document.getElementById('graph'), // container to render in
        
          elements: this.cytoscapeGraphMain[this.selectedTab]['cytoSrc'],

          layout: {name:'klay'},
        
          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'background-color': '#ADD8E6',
                'width':'200',
                'height':'100',
                'label': 'data(id2)',
                'shape': 'data(reaction)',
                'text-halign':'center',
                'text-valign':'center',
                'border-width': 4,
                'border-color':'black'
              }
            },
        
            {
              selector: 'edge',
              style: {
                'width': '3',
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'data(neg)',
                'curve-style': 'bezier'
              }
            }
          ],
        
        
        });
        cy.unbind('click');
cy.bind('click', 'node', function(node) {
  console.log(node.target.data());
  var react;
  if(node.target.data().reaction=="ellipse"){
    react = "not-reaction"
  }else{
    react = "reaction";
  }
  document.getElementById("edittext").textContent="id: " + node.target.data().id + " label: " + node.target.data().id2+" reaction type: " + react;
});
  }

  }
  setCytoscapeMode(data){
    console.log("SETTING MODE");
    this.cytoMode=data;
    this.render()
  }

  settitledbid(data){
    this.titledbid = data;
  }
  setCytoscape(data:Object[]){
    console.log(data)

    this.cytoscapeGraphMain = data;
    this.render();
  }
  setselectedTab(data){

    this.selectedTab=data;
    this.render();
  }
}

function interactive(dotSrc){
  if(mode=="delete"){
    interactiveDelete(dotSrc);
  } else if(mode=="snackbar"){
    interactiveSnackBar(dotSrc);
  } else {
  }

}

function interactiveSnackBar(dotSrc){

  var nodes = d3.selectAll('.node,.edge');
  nodes
      .on("click", function () {
          var title = d3.select(this).selectAll('title').text().trim();
          var text = d3.select(this).selectAll('text').text();
          var id = d3.select(this).attr('id');
          var class1 = d3.select(this).attr('class');
          var dotElement = title.replace('->',' -> ');
          var x = document.getElementById("snackbar");

          x.textContent = id.split("?").join(" ");
          x.setAttribute('href',"https://reactome.org/content/query?q="+String(id.split("?")[1]).slice(14))
          x.className = "show";


          setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);

        });
}

function interactiveDelete(dotSrc) {
  var nodes = d3.selectAll('.node,.edge');
  nodes
      .on("click", function () {
          var title = d3.select(this).selectAll('title').text().trim();
          var text = d3.select(this).selectAll('text').text();
          var id = d3.select(this).attr('id');
          var class1 = d3.select(this).attr('class');
          var dotElement = title.replace('->',' -> ');
          console.log('Element id="%s" class="%s" title="%s" text="%s" dotElement="%s"', id, class1, title, text, dotElement);
          console.log('Finding and deleting references to %s "%s" from the DOT source', class1, dotElement);
          for (let i = 0; i < dotSrcLines.length;) {
              if (dotSrcLines[i].indexOf(dotElement) >= 0) {
                  console.log('Deleting line %d: %s', i, dotSrcLines[i]);
                  dotSrcLines.splice(i, 1);
              } else {
                  i++;
              }
          }
          dotSrc = dotSrcLines.join('\n');
          this.render(dotSrc);
      });
}
function attributer(datum, index, nodes) {
  var selection = d3.select(this);
  if (datum.tag == "svg") {
      datum.attributes = {
          ...datum.attributes,
          width: '100%',
          height: '100%',
      };
      // svg is constructed by hpcc-js/wasm, which uses pt instead of px, so need to convert
      const px2pt = 3 / 4;

      // get graph dimensions in px. These can be grabbed from the viewBox of the svg
      // that hpcc-js/wasm generates
      const graphWidth = datum.attributes.viewBox.split(' ')[2] / px2pt;
      const graphHeight = datum.attributes.viewBox.split(' ')[3] / px2pt;

      const viewBox = `${0} ${0} ${graphWidth * px2pt} ${graphHeight * px2pt}`;
      selection.attr('viewBox', viewBox);
      datum.attributes.viewBox = viewBox;
  }
}

