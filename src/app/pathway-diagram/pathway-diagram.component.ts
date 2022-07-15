import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import DataFrame from "dataframe-js";

@Component({
  selector: 'app-pathway-diagram',
  templateUrl: './pathway-diagram.component.html',
  styleUrls: ['./pathway-diagram.component.scss']
})
export class PathwayDiagramComponent implements OnInit, AfterViewInit {

  selectedButton = 1;
  _ = d3Graphviz.graphviz;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    d3.select("#graph").graphviz().renderDot('digraph {a -> b -> c -> d -> e -> f}');
  }

  attributer(datum, index, nodes) {
    const scale = 0.8;
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
  
          // new viewBox width and height
          const w = graphWidth / scale;
          const h = graphHeight / scale;
  
          // new viewBox origin to keep the graph centered
          const x = -(w - graphWidth) / 2;
          const y = -(h - graphHeight) / 2;
  
          const viewBox = `${x * px2pt} ${y * px2pt} ${w * px2pt} ${h * px2pt}`;
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
        if(parts[3]=="Reaction"){
          finaldot.push('    ' +  parts[0] + ' [label="' + parts[0] + '" shape="' + "diamond" + '"]');
        }
        if(parts[7]=="Reaction"){
          finaldot.push('    ' +  parts[4] + ' [label="' + parts[4] + '" shape="' + "diamond" + '"]');
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
      console.log(dot);
      d3.select("#graph").graphviz().attributer(this.attributer).renderDot(dot);

      }
    fileReader.readAsText(event.target.files[0]);
  }

  resetGraph(number): void {
    if (this.selectedButton === number) {
      return;
    }

    this.selectedButton = number;
    d3.select("#graph").graphviz().renderDot('digraph {}');
  }

}
