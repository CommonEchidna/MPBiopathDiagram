import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})


export class PathwayDiagramComponent implements OnInit {
  pathwayDiagramData = [
    {button: {label: 'Pathway 1'}, data: null},
    {button: {label: 'Pathway 2'}, data: null},
    {button: {label: 'Pathway 3'}, data: null},
  ]
  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 
  store = contactStore;
  selectedTab = 0;

  constructor() { }

  ngOnInit(): void {
  }

  attributer(datum, index, nodes) {
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
 getText(){
  // read text from URL location
  var request = new XMLHttpRequest();
  request.open('GET', 'link', true);
  request.send(null);
  request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
          var type = request.getResponseHeader('Content-Type');
          if (type.indexOf("text") !== 1) {
              return request.responseText;
          }
      }
  }
}
  onFileUpload(event): void {
    

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      var dotLines = fileReader.result.toString().split("\n");
      var finaldot = ["digraph {"];
      for(let i=1;i<dotLines.length-1;i++){
        var parts = dotLines[i].split("\t");
        var strpartz = String(parts[0]);
        var strpartf = String(parts[4]); 
        if(strpartz.slice(-7,-1)=="_outpu"){
          strpartz = strpartz.slice(0,-7)+"000000";
        }
        if(strpartf.slice(-7,-1)=="_outpu"){
          strpartf = strpartf.slice(0,-7)+"000000";
        }
        var tool1 = String(parts[2]);
        var tool2 = String(parts[6]);
        var string = "";
        var regEx = /^[0-9a-zA-Z]+$/;

        for(let j=0;j<tool1.length;j++){
          if(tool1[j].match(regEx)||tool1[j]==" "){
          string+=tool1[j];
          }
        }
        tool1=string;
        for(let j=0;j<tool2.length;j++){
          if(tool2[j].match(regEx)||tool1[j]==" "){
          string+=tool2[j];
          }
        }
        tool2=string;
        if(parts[3]=="Reaction"){
          finaldot.push('    ' +  strpartz + ' [label="' + strpartz + '" tooltip="'+tool1+'" shape="' + "diamond" + '"]');
        }
        else{
          finaldot.push('    ' +  strpartz + ' [label="' + strpartz + '" tooltip="'+tool1+ '"]');

        }
        if(parts[7]=="Reaction"){
          finaldot.push('    ' +  strpartf + ' [label="' + strpartf +  '" tooltip="'+tool1+ '"]');
        }
      }
      for(let i=1;i<dotLines.length-1;i++){
        var parts = dotLines[i].split("\t");
        var strpartz = String(parts[0]);
        var strpartf = String(parts[4]);
        if(strpartz.slice(-7,-1)=="_outpu"){
          strpartz = strpartz.slice(0,-7)+"000000";
        }
        if(strpartf.slice(-7,-1)=="_outpu"){
          strpartf = strpartf.slice(0,-7)+"000000";
        }

        var line = " "+strpartz + "->" + strpartf+"  ";
        finaldot.push(line);
      }
      finaldot.push("}");

      var finaldotnosep = []
      for(let i=0;i<finaldot.length;i++){
        var string = "";
        for(let j=0;j<finaldot[i].length;j++){
          if(finaldot[i][j]!="_"){
          string+=finaldot[i][j];
          }
        }

        finaldotnosep.push(string);

      }

      var dots = finaldotnosep.join('');
      this.store.setDot(dots,this.selectedTab);
      console.log(dots);
      d3.select("#graph").graphviz().attributer(this.attributer).renderDot(this.store.dot[this.selectedTab]);

      }
    fileReader.readAsText(event.target.files[0]);
  }

  changeGraph(number): void {
    if (this.selectedButton === number) {
      return
    }
    
    this.selectedButton = number;
    this.selectedTab=number-1
    console.log(this.store.dot[this.selectedTab]);
    console.log("\n\n");
    if(this.store.dot[this.selectedTab]!==""){
      d3.select("#graph").graphviz().attributer(this.attributer).renderDot(this.store.dot[this.selectedTab]);
      console.log("HAPPENES"); 
    } else {
      d3.select("#graph").graphviz().attributer(this.attributer).renderDot("digraph {}");

    }
     }
     deletePathway(index): void {
      this.pathwayDiagramData.splice(index, 1);
    d3.select("#graph").graphviz().renderDot('digraph {}');
    }
  
    addPathway(): void {
      const index = this.pathwayDiagramData.length + 1
      this.pathwayDiagramData.push({
        button: {
          label: 'Pathway ' + index
        },
        data: null
        }
      )
    }

}
