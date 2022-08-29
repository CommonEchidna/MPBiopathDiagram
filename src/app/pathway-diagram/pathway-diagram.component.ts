import {AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz' 
import cytoscape from 'cytoscape';

var mode="delete2";
var dotSrcLines;
var localCytoGraph: Object[] =[{label:"Untitled",src:[],cytoSrc:[]},{label:"Untitled",src:[] ,cytoSrc:[]}];


@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})

@Injectable()
export class PathwayDiagramComponent implements OnInit {
  @Input() cytoMode:string="cytoscape";
  searchResult = [];
  searchlen;
  @Output() cytoscapeModeOutput = new EventEmitter<string>();
  @Input() dotSrcLinesInput: string[];
  @Output() dotSrcLinesOutput = new EventEmitter<Object[]> ();
  @Output() DiagramTabData = new EventEmitter<Object[]> ();
  @Input() pathwayDiagramData: Object[];
  @Input() selectedTabInput:number ;
  @Output() selectedTabOutput = new EventEmitter<number>();
  @Output() titledbid = new EventEmitter<Object[]>();
  @Input() titledbidInput=[];

  @Input() cytoscapeGraph: Object[] =[{label:"Untitled",src:[],cytoSrc:[]},{label:"Untitled",src:[],cytoSrc:[] }];
  @Output() cytoscapeOutput = new EventEmitter<Object[]>();
  titledbidLocal=[];
  search;



  selectedGraph=this.cytoscapeGraph;
  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 

  selectedTab=0;

  constructor() {

   }

  ngOnInit(): void {
  }

  sendTabData(){
    this.DiagramTabData.emit(this.pathwayDiagramData);
  }

  resetGraph(): void {
    document.getElementById("graph").innerHTML="";
  }

  changeGraph(number): void {

    if (this.selectedTab === number) {
      return
    }

    this.selectedTab=number;

    this.selectedTabOutput.emit(this.selectedTab);


  }
     deletePathway(index): void {


      this.cytoscapeGraph.splice(index, 1);

      this.resetGraph();
      this.sendTabData();
      this.cytoscapeOutput.emit(this.cytoscapeGraph);

    }
    
  
    addPathway(): void {


      const index = this.cytoscapeGraph.length + 1
      this.cytoscapeGraph.push({label:"Untitled", src:[],cytoSrc:[]});
      this.sendTabData();
      this.cytoscapeOutput.emit(this.cytoscapeGraph);


    }
    myFunction() {
      document.getElementById("myDropdown2").classList.toggle("show");
      console.log(document.getElementById("myDropdown2"));
      console.log("DONE");
    }
    zoomonNode(show){
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
      var cy = cytoscape({

        container: document.getElementById('graph'), // container to render in
      
        elements: this.cytoscapeGraph[this.selectedTab]['cytoSrc'],

        layout: {name:'dagre'},
      
        style: [ // the stylesheet for the graph
          {
            selector: 'node',
            style: {
              'background-color': (ele) => {
              if(ele.data('id2').indexOf(show)!=-1){
                  console.log("GREAT");
                  return 'red';

                }
                else{
                  return '#ADD8E6'
                }
              },
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
          }
        ],
      
      
      })
      console.log(show);
      cy.fit(cy.filter((ele)=>{
        if(show.id==(ele.data('id'))){
          return true
        } else{
          return false;
        }
      }))

    }
    interactiveSearch(){
      this.searchResult=[];
      this.searchlen=0;

      if(this.cytoMode=="graphviz"){
      this.dotSrcLinesInput = this.cytoscapeGraph[this.selectedTab]['src'];
      var searchterm = this.search;
      var nodes = d3.selectAll('.node,.edge');
      var dotSrcLines2 = [];


      for (let i = 0; i < this.dotSrcLinesInput.length;i++) {
        if (this.dotSrcLinesInput[i].indexOf(searchterm) >= 0) {
          this.searchResult.push(this.dotSrcLinesInput[i])
          this.searchlen++;


            var newLine = this.dotSrcLinesInput[i].replace('fillcolor=lightblue', 'fillcolor=red')
            dotSrcLines2.push(newLine)
        } else {
            dotSrcLines2.push(this.dotSrcLinesInput[i])
          }
      }


     
      this.cytoscapeGraph[this.selectedTab]['src'] = dotSrcLines2;
      this.cytoscapeOutput.emit(this.cytoscapeGraph);
    
      } else {
        var searchterm = this.search;
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
        var cy = cytoscape({

          container: document.getElementById('graph'), // container to render in
        
          elements: this.cytoscapeGraph[this.selectedTab]['cytoSrc'],

          layout: {name:'dagre'},
        
          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'background-color': (ele) => {
                  if(ele.data('id2').indexOf(searchterm)!=-1){
                    if(this.searchResult.includes(ele.data('id2'))==false){
                      this.searchlen++;
                      this.searchResult.push({id2:ele.data('id2'),id:ele.data('id')})

                    }
                    console.log("GREAT");
                    return 'red';

                  }
                  else{
                    return '#ADD8E6'
                  }
                },
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
            }
          ],
        
        
        })
      }
      console.log("DONE");

    }

    onModeChange(mode:string){
      this.resetGraph();
      this.cytoMode=mode;
      console.log(mode);
      this.cytoscapeModeOutput.emit(this.cytoMode);
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
  console.log("HIIII");

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