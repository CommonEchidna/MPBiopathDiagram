import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz' 
var mode="delete2";
var dotSrcLines;
@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})


export class PathwayDiagramComponent implements OnInit {
  @Input() dotSrcLinesInput: string;
  @Output() dotSrcLinesOutput = new EventEmitter<string> ();
  @Output() DiagramTabData = new EventEmitter<string[]> ();
  @Input() DiagramTabDataInput;


  pathwayDiagramData = [
    "","",""
  ]
  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 

  selectedTab;

  constructor() { }

  ngOnInit(): void {
  }

  sendTabData(){
    console.log("3");
    this.DiagramTabData.emit(this.pathwayDiagramData);
  }

  

  resetGraph(index): void {
    this.pathwayDiagramData = this.DiagramTabDataInput;
    if (this.selectedTab === index) {
      return;
    }

    this.selectedTab = index;
	if (this.pathwayDiagramData[this.selectedTab]) {
		d3.select("#graph").graphviz().renderDot(this.pathwayDiagramData[this.selectedTab]);
	} else {
		d3.select("#graph").graphviz().renderDot('digraph {}');
	}
  this.sendTabData();
  }

  changeGraph(number): void {
    this.pathwayDiagramData = this.DiagramTabDataInput;

    console.log("HI");

    if (this.selectedTab === number) {
      return
    }

    this.selectedTab=number;

    console.log("\n\n");

    if(this.pathwayDiagramData[this.selectedTab]){
      console.log("1");
      d3.select("#graph").graphviz().attributer(attributer).renderDot(this.pathwayDiagramData[this.selectedTab]);
    } else {
      console.log("2");

      d3.select("#graph").graphviz().attributer(attributer).renderDot("digraph {}");

    }
    console.log(this.pathwayDiagramData)
    this.sendTabData();

     }
     deletePathway(index): void {
      this.pathwayDiagramData = this.DiagramTabDataInput;


      this.pathwayDiagramData.splice(index, 1);
    d3.select("#graph").graphviz().renderDot('digraph {}');
    this.sendTabData();

    }
  
    addPathway(): void {
      this.pathwayDiagramData = this.DiagramTabDataInput;


      const index = this.pathwayDiagramData.length + 1
      this.pathwayDiagramData.push("");
      this.sendTabData();

    }
    interactiveSearch(){
      dotSrcLines = this.dotSrcLinesInput;
      var searchterm = document.getElementById("searchbar").textContent;
      var nodes = d3.selectAll('.node,.edge');
              var dotSrcLines2 = [];
    
              for (let i = 0; i < dotSrcLines.length;) {
                if (dotSrcLines[i].indexOf(searchterm) >= 0) {
                    var newLine = dotSrcLines[i].replace('color=\"black\"', 'color=\"red\"')
                    dotSrcLines2.push(newLine)
                    i++;
                } else {
                    dotSrcLines2.push(dotSrcLines[i])
                    i++;
                }
            }
            var dotSrc = dotSrcLines2.join('\n');
              
            this.dotSrcLinesOutput.emit(dotSrc);
    
    
    
    }


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