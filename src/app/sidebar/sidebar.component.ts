import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
import {tabstore} from '../tabstore'
import {MatSnackBar} from '@angular/material/snack-bar';


var dot;
var dotSrcLines;
var mode="delete2";
var snackbar:MatSnackBar;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  @Input() dotSrcLinesInput: string;
  @Output() emitDotSrcLines = new EventEmitter<string> ();
  @Input() DiagramTabDataInput;
  @Output() DiagramTabData = new EventEmitter<string[]> ();

  selectedTab=0;
  pathwayDiagramData = [ "", "", ""
  ]



  _ = d3Graphviz.graphviz;
  scale = 0.8; 


  constructor() { }

  ngOnInit(): void {
  }
  setDiagramTabData(data){
    this.pathwayDiagramData =data;

  }
  
  async getText(idx){


    // read text from URL location
    var finaldotnosep = [];

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
                  var strpartz = String(parts[2]);
                  var temp = ""
                  for(let i=0;i<strpartz.length;i++){
                    if(strpartz[i]=="\""){
                      temp+= "'";
                    }
                    else{
                      temp+=strpartz[i];
                    }
                  }
                  strpartz = temp;
                  var strpartf = String(parts[6]); 
                  var temp = ""
                  for(let i=0;i<strpartf.length;i++){
                    if(strpartf[i]=="\""){
                      temp+= "'";
                    }
                    else{
                      temp+=strpartf[i];
                    }
                  }
                  strpartf = temp;
                  if(strpartz.length>30){
                    strpartz = strpartz.slice(0,30)+"...";
                  }
                  if(strpartf.length>30){
                    strpartf = strpartf.slice(0,30)+"...";
                  }
                  strpartz = "\""+strpartz + "\"";
                  strpartf  = "\""+strpartf + "\"";

                  
                var tool1 = "\""+"name = "+String(parts[2])+ "\n reactome id = " + String(parts[0]) + "\n entity type = "+String(parts[3])+"\"";
                var tool2 = "\""+"name = "+String(parts[6])+ "\n reactome id = " + String(parts[4]) + "\n entity type = "+String(parts[7])+"\"";
                var tool1 = "\""+"name = "+String(parts[2])+ "? reactome id = " + String(parts[0]) + "? entity type = "+String(parts[3])+"\"";
                var tool2 = "\""+"name = "+String(parts[6])+ "? reactome id = " + String(parts[4]) + "? entity type = "+String(parts[7])+"\"";

                  var string = "";
                  if(parts[3]=="Reaction"){
                      finaldot.push('    ' +  strpartz + ' [label=' + strpartz + ' id='+tool1+ ' tooltip='+tool1+' color=\"black\" shape= diamond '+ ']');
                  }
                  else{
                      finaldot.push('    ' +  strpartz + ' [label=' + strpartz + ' id='+tool1+ ' color=\"black\" tooltip='+tool1+ ']');
                  }
                  if(parts[7]=="Reaction"){
                      finaldot.push('    ' +  strpartf + ' [label=' + strpartf + ' id='+tool2+ ' tooltip='+tool2+' color=\"black\" shape= diamond ' + ']');

                  } else {
                      finaldot.push('    ' +  strpartf + ' [label=' + strpartf + ' id='+tool2+ ' color=\"black\" tooltip='+tool2+ ']');
                  }
                }
            
                for(let i=1;i<dotLines.length-1;i++){
                  var parts = dotLines[i].split("\t");
                  var strpartz = String(parts[2]);
                  var temp = ""
                  for(let i=0;i<strpartz.length;i++){
                    if(strpartz[i]=="\""){
                      temp+= "'";
                    }
                    else{
                      temp+=strpartz[i];
                    }
                  }
                  strpartz = temp;
                  var strpartf = String(parts[6]);   
                  var temp = ""
                  for(let i=0;i<strpartf.length;i++){
                    if(strpartf[i]=="\""){
                      temp+= "'";
                    }
                    else{
                      temp+=strpartf[i];
                    }
                  }
                  strpartf = temp;
                  temp="";
                  for(let i=0;i<strpartz.length;i++){
                    if(strpartz[i]=="\""){
                      temp+= "'";
                    }
                    else{
                      temp+=strpartz[i];
                    }
                  }
                  strpartz = temp;
                  if(strpartz.length>30){
                    strpartz = strpartz.slice(0,30)+"...";
                  }
                  if(strpartf.length>30){
                    strpartf = strpartf.slice(0,30)+"...";
                  }   
                  var tool= "\""+"Incoming = "+strpartz+ " Outgoing = " + strpartf + " "+String(parts[8])+ " "+String(parts[9])+"\"";

                  strpartz = "\""+strpartz + "\"";
                  strpartf  = "\""+strpartf + "\"";
                  var line = " "+strpartz +"->" + strpartf+"  ";

                  if(parts[8]=="NEG"){
                    line = line + "[arrowhead=tee tooltip="+tool+"]"
                  } 
                  else{
                    line = line + "[tooltip="+tool+"]";
                  }

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
                dotSrcLines = finaldotnosep;
                dot = dotSrcLines.join("");
                console.log(dot);
                console.log("WATIED?");


              }             
              }
            }
          }
        }
        
      }
      await request.onreadystatechange;
      console.log("STEP!");
      console.log(this.pathwayDiagramData);
      console.log(dot);
      this.pathwayDiagramData[this.selectedTab]=dot;
      this.DiagramTabData.emit(this.pathwayDiagramData);
      this.emitDotSrcLines.emit(dotSrcLines);

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
      dotSrcLines = finaldotnosep;

      }
    fileReader.readAsText(event.target.files[0]);
  }

  

}
