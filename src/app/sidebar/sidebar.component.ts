import { Component, EventEmitter, Injectable, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Graphviz from 'd3-graphviz'
import { contactStore } from '../contact-store';
import {tabstore} from '../tabstore'
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIconRegistry,MatIconModule} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; 

var titledbidLocal=[];
var dot;
var dotSrcLines;
var mode="delete2";
var snackbar:MatSnackBar;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


@Injectable()
export class SidebarComponent implements OnInit {
  @Input() dotSrcLinesInput: string;
  @Output() emitDotSrcLines = new EventEmitter<string> ();
  @Input() DiagramTabDataInput;
  @Output() DiagramTabData = new EventEmitter<Object[]> ();
  @Output() titledbid = new EventEmitter<Object[]>();
  @Input() titledbidInput=[];
  @Input() selectedTabInput1:number ;
  @Output() selectedTabOutput1 = new EventEmitter<number>();

 titledbidLocal2=[];
 titledbidLocalMaster=[];
 selectedVal;
 search;

  src1:String[];
  selectedTab=0;
  pathwayDiagramData:Object[] = [{label:"Untitled",src:[]},{label:"Untitled",src:[] }];



  _ = d3Graphviz.graphviz;
  scale = 0.8; 
  isChecked:boolean;


  constructor() {
    
    makeRequest1("GET", 'https://s3.amazonaws.com/download.reactome.org/81/mpbiopath/pathway_list.tsv',0).then(function(response){ 
    let splitted = String(response).split("\n");
      console.log("INIT????");
      for(let i=1;i<splitted.length-1;i++){
        var split2 = splitted[i].split("\t");
        titledbidLocal.push({ id: split2[0], name:  split2[1]});    
   
      }
      console.log(titledbidLocal);
    }
    )
    this.titledbidInput=titledbidLocal;
    this.titledbidLocal2=titledbidLocal;
    this.titledbidLocalMaster=titledbidLocal;
    console.log("TWO");
    console.log(this.titledbidInput);
  }
  

  ngOnInit(): void {

}
ngAfterViewInit() {


}
  setDiagramTabData(data:Object[]){
    this.pathwayDiagramData =data;
    console.log("???");

  }


  async getText(item): Promise<any>{
    var idx = item.id;
    var title=item.name;
    const myPromise = new Promise((resolve,reject) => {
      var finaldotnosep = [];
      console.log("1");
      console.log(this.pathwayDiagramData)
      makeRequest1("GET", 'https://s3.amazonaws.com/download.reactome.org/81/mpbiopath/pathway_list.tsv',idx).then(function(response){    
              let splitted = String(response).split("\n");
              
              console.log("START");
              console.log(splitted);
              console.log("\n\n")
              var line = -1
              for(let i=1;i<splitted.length-1;i++){

                var split2 = splitted[i].split("\t");
                var pos = split2[0];
                if(pos==idx){
                  line = i;
                }
              }
              var split2 = splitted[line].split("\t");

              console.log(split2[3]);
            makeRequest1('GET', split2[3], idx).then(function(response2){
              console.log("RESPONSE")
              console.log(response2);
              console.log("\n\n")
  
            
              let dotLines = String(response2).split("\n");
                var finaldot = ["digraph {"];
                for(let i=1;i<dotLines.length-1;i++){
                  var parts = dotLines[i].split("\t");
                  var strpartz = String(parts[2]);
                  var temp = ""
                  for(let i=0;i<strpartz.length;i++){
                    if(strpartz[i]=='"'){
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
                    if(strpartf[i]=='"'){
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
                  var tool1 = "\""+"name = "+strpartz+ "\n reactome id = " + String(parts[0]) + "\n entity type = "+String(parts[3])+"\"";
                var tool2 = "\""+"name = "+strpartf+ "\n reactome id = " + String(parts[4]) + "\n entity type = "+String(parts[7])+"\"";
                var tool1 = "\""+"name = "+strpartz+ "? reactome id = " + String(parts[0]) + "? entity type = "+String(parts[3])+"\"";
                var tool2 = "\""+"name = "+strpartf+ "? reactome id = " + String(parts[4]) + "? entity type = "+String(parts[7])+"\"";
                  strpartz = "\""+strpartz + "\"";
                  strpartf  = "\""+strpartf + "\"";
  
                  
                
  
                  var string = "";
                  if(parts[3]=="Reaction"){
                      finaldot.push('    ' +  "\""+String(parts[0])+"\"" + ' [label=' + strpartz + ' id='+tool1+ ' tooltip='+tool1+' color=\"black\" shape= diamond '+ ']');
                  }
                  else{
                      finaldot.push('    ' +  "\""+String(parts[0])+"\"" + ' [label=' + strpartz + ' id='+tool1+ ' color=\"black\" tooltip='+tool1+ ']');
                  }
                  if(parts[7]=="Reaction"){
                      finaldot.push('    ' +  "\""+String(parts[4])+"\"" + ' [label=' + strpartf + ' id='+tool2+ ' tooltip='+tool2+' color=\"black\" shape= diamond ' + ']');
  
                  } else {
                      finaldot.push('    ' +  "\""+String(parts[4])+"\"" + ' [label=' + strpartf + ' id='+tool2+ ' color=\"black\" tooltip='+tool2+ ']');
                  }
                  if(i==10){
                    console.log("\n\n")
                    console.log(finaldot[i]);
                    console.log("\n\n")

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



                  var line = " "+  "\""+String(parts[0])+"\"" + "->" +  "\""+String(parts[4])+"\"" +"  ";
  
                  if(parts[8]=="NEG"){
                    line = line + "[arrowhead=tee tooltip="+tool+"]"
                  } 
                  else{
                    line = line + "[tooltip="+tool+"]";
                  }
  
                  finaldot.push(line);
                  if(i==10){
                    console.log("\n\n")
                    console.log(line);
                    console.log("\n\n")

                  }
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
                console.log("DONE2");
                resolve("DONE");
              })
            }
      )
          })
          myPromise.then((text)=>this.getText2(text,title));
        }

          getText2(text,title){
            console.log(text);
            console.log(this.pathwayDiagramData);
            console.log(dotSrcLines);
            console.log(title);
            console.log("^^");
            this.selectedTab=this.selectedTabInput1;
            this.pathwayDiagramData[this.selectedTab]['label']=title;
            this.pathwayDiagramData[this.selectedTab]['src']=[];
            for(let i=0;i<dotSrcLines.length;i++){
              this.pathwayDiagramData[this.selectedTab]['src'].push(dotSrcLines[i]);
            }
            console.log(this.pathwayDiagramData);
            console.log("INDICATOR");

            this.DiagramTabData.emit(this.pathwayDiagramData);
            console.log(dotSrcLines)
            this.emitDotSrcLines.emit(dotSrcLines);
            this.titledbid.emit(titledbidLocal);
            console.log(this.selectedTab)
            this.selectedTabOutput1.emit(this.selectedTab);
          }

  
          interactiveSnackBar(val){


            var x = document.getElementById("snackbar");
            x.textContent = "dbid: "+String(val.id);
            x.className = "show";
  
  
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
  
  }
  onValChange(val: string) {
    this.selectedVal = val;
  }

  interactiveSearch2(data){
    console.log(this.search);
    var searchterm2 = this.search;
    var pathways = d3.selectAll('pathwaylist');
    var options = document.getElementById("dbidchecked");
    var newlist = []
    if(this.selectedVal=="dbid"){
      for(let i=0;i<this.titledbidLocalMaster.length;i++) {
        
        if(this.titledbidLocalMaster[i]["id"].indexOf(searchterm2)!=-1){
          newlist.push(this.titledbidLocalMaster[i]);
        }
      }
    }
    else if(this.selectedVal=="title"){
      for(let i=0;i<this.titledbidLocalMaster.length;i++) {
        if(this.titledbidLocalMaster[i]["name"].indexOf(searchterm2)!=-1){
          newlist.push(this.titledbidLocalMaster[i]);
        }
      }
    }
    else {
      console.log("??");
    }
    this.titledbidLocal2=newlist;

  
  
  


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


function makeRequest1(method, url,idx) {
  return new Promise(function (resolve, reject) {
    var finaldotnosep = [];
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function(){
      if(request.status>=200 && request.status<300){
        console.log("WORKED");
        resolve(request.response);
      }
    }
      request.onerror=function(){
        console.log(
          "REJECTED"
        );
        reject(request);
      };
      request.send();

  });
}