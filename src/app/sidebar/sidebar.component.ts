import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
import {tabstore} from '../tabstore'
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  store = contactStore;
  store2 = tabstore;

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
  getText(idx){
    var store = this.store;
    var store2 = this.store2;
    var attributer = this.attributer;

    // read text from URL location
    var finaldotnosep = []

    var request = new XMLHttpRequest();
    request.open('GET', 'https://s3.amazonaws.com/download.reactome.org/81/mpbiopath/pathway_list.tsv', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
              let splitted = String(request.responseText).split("\n");
              var line = -1
              for(let i=1;i<splitted.length-1;i++){
                var split2 = splitted[i].split("\t");
                var pos = split2[0];
                if(pos==idx){
                  line = i;
                }
              }
              var request2 = new XMLHttpRequest();
              var split2 = splitted[line].split("\t");

              console.log(split2[3])
            request2.open('GET', split2[3], true);
            request2.send(null);
            request2.onreadystatechange = function () {
        if (request2.readyState === 4 && request2.status === 200) {
            var type = request2.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
              let dotLines = String(request2.responseText).split("\n");
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
                store.setDot(dots,store2.tabnum);
                console.log(dots);
                d3.select("#graph").graphviz().attributer(attributer).zoomScaleExtent([.0001,1000]).renderDot(store.dot[store2.tabnum]); 
                
              }             
              }
            }
          }
        }
        
      }

    }
  

  printhi(){
    console.log("HI");
  }
  

}
