import { Component, Injectable, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';


cytoscape.use(dagre);
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

  selectedTab = 0;
  titledbid:Object[];
  cytoMode:string="cytoscape";

  constructor() { }

  ngOnInit(): void {
  }

  //Render the graph based on if it is graphviz or cytoscape
  render(){
    if(this.cytoMode=="graphviz"){
      var dot = this.cytoscapeGraphMain[this.selectedTab]['src'].join("");
      if(dot.length>0){
        d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot(dot).on("end",interactive);

      }
      else{
        d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot("digraph {}");

      }
      interactiveSnackBar();

    } else {

      //is cytoscape
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

        };
        var cy = cytoscape({

          container: document.getElementById('graph'), // container to render in
        
          elements: this.cytoscapeGraphMain[this.selectedTab]['cytoSrc'],

          layout: {name:'dagre'},
        
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
                'width': '20',
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'data(neg)',
                'curve-style': 'bezier'
              }
              },
              {   
                selector: 'edge.highlighted',
                style: {
                  'line-color': '#2a6cd6',
                  'target-arrow-color': '#2a6cd6',
                  'opacity': 0.7,
                } 
              },  
          ]
        });
        cy.unbind('click');

        //change shape of output based on if it is a reaction
cy.bind('click', 'node', function(node) {
  var react;
  if(node.target.data().reaction=="ellipse"){
    react = "not-reaction"
  }else{
    react = "reaction";
  }
  document.getElementById("edittext").textContent="id: " + node.target.data().id + " label: " + node.target.data().id2+" reaction type: " + react;
});

//highlight on mouseover (cytoscape only)
cy.on('mouseover', function(e){
  cy.edges("[source = '" + e.target.data().source+"']"+"[target = '" + e.target.data().target+"']").addClass('highlighted');
  cy.edges("[source !='" + e.target.data().source+"']"+",[target != '" + e.target.data().target+"']").removeClass('highlighted');

});
}
  }
  //change modes from graphviz to cytoscape
  setCytoscapeMode(data){
    this.cytoMode=data;
    this.render()
  }
  //set title or dbid for pathway search

  settitledbid(data){
    this.titledbid = data;
  }
    //set the cytoscape graph data

  setCytoscape(data:Object[]){

    this.cytoscapeGraphMain = data;
    this.render();
  }
  //change modes from graphviz to cytoscape
  setselectedTab(data){

    this.selectedTab=data;
    this.render();
  }
}

//debugging code for deleting and snackbar code, delete is not finished
function interactive(dotSrc){
  if(mode=="delete"){
    interactiveDelete(dotSrc);
  } else if(mode=="snackbar"){
    interactiveSnackBar();
  } else {
  }

}
//snackbar for clicking on node
function interactiveSnackBar(){

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


//incomplete function for deleting node on click
function interactiveDelete(dotSrc) {
  var nodes = d3.selectAll('.node,.edge');
  nodes
      .on("click", function () {
          var title = d3.select(this).selectAll('title').text().trim();
          var text = d3.select(this).selectAll('text').text();
          var id = d3.select(this).attr('id');
          var class1 = d3.select(this).attr('class');
          var dotElement = title.replace('->',' -> ');

          for (let i = 0; i < dotSrcLines.length;) {
              if (dotSrcLines[i].indexOf(dotElement) >= 0) {
                  dotSrcLines.splice(i, 1);
              } else {
                  i++;
              }
          }
          dotSrc = dotSrcLines.join('\n');
          this.render(dotSrc);
      });
}

//resize graphviz to fit the whole section
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

