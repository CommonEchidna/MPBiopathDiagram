import {AfterViewInit, Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz' 
var mode="delete2";
var dotSrcLines;

@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})

@Injectable()
export class PathwayDiagramComponent implements OnInit {
  @Input() dotSrcLinesInput: Object[];
  @Output() dotSrcLinesOutput = new EventEmitter<Object[]> ();
  @Output() DiagramTabData = new EventEmitter<Object[]> ();
  @Input() pathwayDiagramData: Object[];
  @Input() selectedTabInput:number ;
  @Output() selectedTabOutput = new EventEmitter<number>();
  @Output() titledbid = new EventEmitter<Object[]>();
  @Input() titledbidInput=[];
  titledbidLocal=[];
  search;




  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 

  selectedTab;

  constructor() {
    this.pathwayDiagramData= [{label:"Untitled",src:[]},{label:"Untitled",src:[] }];

   }

  ngOnInit(): void {
  }

  sendTabData(){
    this.DiagramTabData.emit(this.pathwayDiagramData);
  }

  

  resetGraph(index): void {
    if (this.selectedTab === index) {
      return;
    }

    this.selectedTab = index;
    console.log(this.pathwayDiagramData[this.selectedTab]['src'])
	if (this.pathwayDiagramData[this.selectedTab]['src'].length>0) {
		d3.select("#graph").graphviz().renderDot(this.pathwayDiagramData[this.selectedTab]);
	} else {
		d3.select("#graph").graphviz().renderDot('digraph {}');
	}
  this.sendTabData();
  }

  changeGraph(number): void {

    console.log("HI");

    if (this.selectedTab === number) {
      return
    }

    this.selectedTab=number;

    console.log("\n\n");
    console.log(this.pathwayDiagramData[this.selectedTab]["src"].length>0)
    if(this.pathwayDiagramData[this.selectedTab]["src"].length>0){
      console.log("1");
      d3.select("#graph").graphviz().attributer(attributer).renderDot(this.pathwayDiagramData[this.selectedTab]["src"]);
    } else {
      console.log("2");

      d3.select("#graph").graphviz().attributer(attributer).renderDot("digraph {}");

    }
    console.log(this.pathwayDiagramData)
    this.selectedTabOutput.emit(this.selectedTab);

    this.sendTabData();
    console.log("DONENENENENE");

     }
     deletePathway(index): void {


      this.pathwayDiagramData.splice(index, 1);
    d3.select("#graph").graphviz().renderDot('digraph {}');

    this.sendTabData();

    }
    
  
    addPathway(): void {
      console.log(this.pathwayDiagramData)


      const index = this.pathwayDiagramData.length + 1
      this.pathwayDiagramData.push({label:"Untitled", src:""});
      this.sendTabData();

    }
    interactiveSearch(){
      console.log(this.selectedTabInput)
      var searchterm = this.search;
      var nodes = d3.selectAll('.node,.edge');
      var dotSrcLines2 = [];
      console.log(dotSrcLines);
    
      for (let i = 0; i < dotSrcLines.length;i++) {
        if (dotSrcLines[i].indexOf(searchterm) >= 0) {
          console.log(searchterm)
          console.log("{{");
            var newLine = dotSrcLines[i].replace('color=\"black\"', 'color=\"red\"')
            dotSrcLines2.push(newLine)
        } else {
            dotSrcLines2.push(dotSrcLines[i])
          }
      }
      console.log(dotSrcLines2);
     
              
      this.dotSrcLinesOutput.emit(dotSrcLines2);
      console.log(this.selectedTab);
    
    
    
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