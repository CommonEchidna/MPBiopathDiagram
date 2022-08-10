import { Component, Injectable, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
import {tabstore} from '../tabstore'
import {MatSnackBar} from '@angular/material/snack-bar';
import { PathwayDiagramComponent } from '../pathway-diagram/pathway-diagram.component';
var mode="delete2";
var dotSrcLines;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
@Injectable()
export class DashboardComponent implements OnInit {

  pathwayDiagramData: Object[] = [{label:"Untitled",src:""},{label:"Untitled",src:""}]
  dotSrcLines;
  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 
  store = contactStore;
  store2 = tabstore;
  selectedTab = tabstore.tabnum;
  DiagramTabData: Object[]=[{label:"Untitled",src:""},{label:"BlaUntitlednk",src:""}]
  titledbid:Object[];

  constructor() { }

  ngOnInit(): void {
  }
  render(dotSrc){
    var dot = dotSrc.join('');
    d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot(dot).on("end", interactive);
    console.log(this.DiagramTabData);
    console.log("DAD");
    console.log(this.pathwayDiagramData);
    var dot =dotSrc.join("");
    this.pathwayDiagramData[this.selectedTab]={label:"TEST4",src:dot};
    this.DiagramTabData[this.selectedTab]={label:"TEST4",src:dot};
    console.log(this.DiagramTabData)
    console.log(this.pathwayDiagramData)
  }

  settitledbid(data){
    this.titledbid = data;
  }

  setDotSrcLines(data){
    this.dotSrcLines = data;
    console.log(data);
    this.render(data);
  }
  setDiagramTabData(data:Object[]){
    console.log(data);
    console.log("4");
    this.pathwayDiagramData = data;
    console.log(this.pathwayDiagramData);
    console.log("5");

    this.DiagramTabData = this.pathwayDiagramData;
    console.log("6");
    console.log(this.DiagramTabData)


  }
}
function interactive(dotSrc){
  if(mode=="delete"){
    interactiveDelete(dotSrc);
  } else if(mode=="snackbar"){
    interactiveSnackBar(dotSrc);
  } else {
  console.log("NONE2")
  }

}

function interactiveSnackBar(dotSrc){

  var nodes = d3.selectAll('.node,.edge');
  console.log(nodes);
  nodes
      .on("click", function () {
          var title = d3.select(this).selectAll('title').text().trim();
          var text = d3.select(this).selectAll('text').text();
          var id = d3.select(this).attr('id');
          var class1 = d3.select(this).attr('class');
          var dotElement = title.replace('->',' -> ');
          var x = document.getElementById("snackbar");
          console.log(id);
          console.log(id.split("?")[1])
          x.textContent = id.split("?").join(" ");
          x.setAttribute('href',"https://reactome.org/content/query?q="+String(id.split("?")[1]).slice(14))
          x.className = "show";


          setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);

        });
}

function interactiveDelete(dotSrc) {
  var nodes = d3.selectAll('.node,.edge');
  console.log(nodes);
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

