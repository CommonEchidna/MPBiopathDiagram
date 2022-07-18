import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { observable, autorun } from 'mobx'
@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})


export class PathwayDiagramComponent implements OnInit {

  selectedButton = 1;
  _ = d3Graphviz.graphviz;
  scale = 0.8; 

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

  onFileUpload(event): void {
    

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      var dotLines = fileReader.result.toString().split("\n");
      var finaldot = ["digraph {"];
      for(let i=1;i<dotLines.length-1;i++){
        var parts = dotLines[i].split("\t");
        var strpartz = String(parts[0]);
        var strpartf = String(parts[4]);       
        if(strpartz.slice(-6,-1)==="outpu"){
          strpartz = strpartz.slice(0,-6)+String("000000");
        }
        if(strpartf.slice(-6,-1)==="outpu"){
          strpartf = strpartf.slice(0,-6)+String("000000");
        } 
        if(parts[3]=="Reaction"){
          finaldot.push('    ' +  strpartz + ' [label="' + strpartz + '" shape="' + "diamond" + '"]');
        }
        if(parts[7]=="Reaction"){
          finaldot.push('    ' +  strpartf + ' [label="' + strpartf + '" shape="' + "diamond" + '"]');
        }
      }
      for(let i=1;i<dotLines.length-1;i++){
        var parts = dotLines[i].split("\t");
        var strpartz = String(parts[0]);
        var strpartf = String(parts[4]);
        if(strpartz.slice(-6,-1)==="outpu"){
          strpartz = strpartz.slice(0,-6)+String("000000");
        }
        if(strpartf.slice(-6,-1)==="outpu"){
          strpartf = strpartf.slice(0,-6)+String("000000");
        }
        console.log(line);
        console.log(i);
        console.log("\n");
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

      var dot = finaldotnosep.join('');
      d3.select("#graph").graphviz().attributer(this.attributer).renderDot(dot);

      }
    fileReader.readAsText(event.target.files[0]);
  }

  resetGraph(number): void {
    if (this.selectedButton === number) {
      return;
    }

    this.selectedButton = number;
    d3.select("#graph").graphviz().attributer(this.attributer).renderDot('digraph {}');
  }

}
