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
var localAlldots=[];
var titledbidLocal=[];
var dot;
var dotSrcLines;
var mode="delete2";
var snackbar:MatSnackBar;
var localCyto: Object;
var localCytoGraph =[{label:"Untitled",src:[],cytoSrc:[]},{label:"Untitled",src:[] ,cytoSrc:[]}];


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
  @Input() cytoscapeGraph:Object[] =[{label:"Untitled",src:[],cytoSrc:[]},{label:"Untitled",src:[] ,cytoSrc:[]}];
  @Output() cytoscapeOutput = new EventEmitter<Object[]>();
  @Input() cytoMode:string;
  @Output() cytoscapeModeOutput = new EventEmitter<string>();


 titledbidLocal2=[];
 titledbidLocalMaster=[];
 selectedVal="dbid";
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
      for(let i=1;i<splitted.length-1;i++){
        var split2 = splitted[i].split("\t");
        titledbidLocal.push({ id: split2[0], name:  split2[1]});    
   
      }
    }
    )
    this.titledbidInput=titledbidLocal;
    this.titledbidLocal2=titledbidLocal;
    this.titledbidLocalMaster=titledbidLocal;

  }
  

  ngOnInit(): void {

}
ngAfterViewInit() {


}
  setDiagramTabData(data:Object[]){
    this.pathwayDiagramData =data;

  }

  getTextCytoscape(item){
    
    var idx = item.id;
    var title=item.name;
    const myPromise = new Promise((resolve,reject) => {
      var finaldotnosep = [];
      makeRequest1("GET", 'https://s3.amazonaws.com/download.reactome.org/81/mpbiopath/pathway_list.tsv',idx).then(function(response){    
              let splitted = String(response).split("\n");
              var line = -1
              for(let i=1;i<splitted.length-1;i++){

                var split2 = splitted[i].split("\t");
                var pos = split2[0];
                if(pos==idx){
                  line = i;
                }
              }
              var split2 = splitted[line].split("\t");

            makeRequest1('GET', split2[3], idx).then(function(response2){
                var result = getTextBoth(response2,idx);
  
                resolve(result);

              })
            }
      )
          })
          myPromise.then((result)=>this.getText2Cyto(result[0],result[1],title));
        }

      getText2Cyto(localCyto,dotSrcLines,name){
        localCytoGraph[this.selectedTabInput1]={label:name,src:dotSrcLines,cytoSrc:localCyto};
        this.cytoscapeGraph=localCytoGraph;
        console.log(this.cytoscapeGraph)
        this.cytoscapeOutput.emit(this.cytoscapeGraph);
        console.log("HERE?")
      }
          interactiveSnackBar(val){


            var x = document.getElementById("snackbar");
            x.textContent = "dbid: "+String(val.id);
            var x2=document.getElementById("edittext");
            x2.textContent =String(val.name);
            x.className = "show";  
            x2.className="show";
  }
  setNewTitle(){
    var x2=document.getElementById("edittext").textContent;
    var x1 = document.getElementById("snackbar").textContent.slice(5);
    console.log(x1);
    console.log("HI");
  }
  onValChange(val: string) {
    this.selectedVal = val;
  }

  interactiveSearch2(data){
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
    }
    this.titledbidLocal2=newlist;

  
  
  


}
    

  
myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  console.log("DONE");
}
  onFileUpload(event): void {
    var name = (<String>(<HTMLInputElement>document.getElementById("file1")).files[0].name);

    const myPromise = new Promise((resolve,reject) => {
    var finaldotnosep = [];


    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      var result= getTextBoth(fileReader.result.toString(),this.selectedTabInput1)
      localCyto=result[0]
      finaldotnosep =result[1]
      resolve([localCyto,finaldotnosep])
      }
      fileReader.readAsText(event.target.files[0]);
    });
    myPromise.then((result)=>this.getText2Cyto(result[0],result[1],name));
    titledbidLocal.push({ id: 1000000000+(titledbidLocal.length), name:  name});    

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
function getTextBoth(response2,idx){
  var finaldotnosep=[];

  var nodes=[];
  var edges=[];
  var nodeList=[];
  let dotLines = String(response2).split("\n");
  var finaldot = ["digraph {"];
    for(let i=1;i<dotLines.length-1;i++){
      var parts = dotLines[i].split("\t");
      var strpartz = String(parts[2]);
      var strpartf = String(parts[6]); 
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
      if(strpartz.length>20){
        strpartz = strpartz.slice(0,18)+"...";
      }
      if(strpartf.length>20){
        strpartf = strpartf.slice(0,18)+"...";
      }
      var tool1 = "\""+"name = "+strpartz+ " reactome id = " + String(parts[0]) + " entity type = "+String(parts[3])+"\"";
      var tool2 = "\""+"name = "+strpartf+ " reactome id = " + String(parts[4]) + " entity type = "+String(parts[7])+"\"";
      strpartz = "\""+strpartz + "\"";
      strpartf  = "\""+strpartf + "\"";
      
      if(nodeList.includes(String(parts[0]))==false){
        nodeList.push(String(parts[0]))
        console.log(String(parts[0]));                  
        if(parts[3]=="Reaction"){
          nodes.push({data:{id: String(parts[0]),id2:strpartz.slice(1,strpartz.length-1),reaction:"diamond"}})
          finaldot.push('    ' +  "\""+String(parts[0])+"\"" + ' [label=' + strpartz + " style=filled fillcolor=lightblue "+ ' id='+"\""+String(parts[0])+"\""+ ' tooltip='+tool1+' color=\"black\" shape= diamond '+ ']');
      }
      else{
        nodes.push({data:{id: String(parts[0]),id2:strpartz.slice(1,strpartz.length-1),reaction:"ellipse"}});
        finaldot.push('    ' +  "\""+String(parts[0])+"\"" + ' [label=' + strpartz + " style=filled fillcolor=lightblue "+' id='+"\""+String(parts[4])+"\""+ ' color=\"black\" tooltip='+tool1+ ']');


      }
    }
    if(nodeList.includes(String(parts[4]))==false){
      nodeList.push(String(parts[4]))

      console.log(String(parts[4]));

      if(parts[7]=="Reaction"){
        nodes.push({data:{id: String(parts[4]),id2:strpartf.slice(1,strpartf.length-1),reaction:"diamond"}});
        finaldot.push('    ' +  "\""+String(parts[4])+"\"" + ' [label=' + strpartf + " style=filled fillcolor=lightblue "+' id='+tool2+ ' tooltip='+tool2+' color=\"black\" shape= diamond ' + ']');


      } else {
        nodes.push({data:{id: String(parts[4]),id2:strpartf.slice(1,strpartf.length-1),reaction:"ellipse"}});
        finaldot.push('    ' +  "\""+String(parts[4])+"\"" + ' [label=' + strpartf + " style=filled fillcolor=lightblue" +' id='+tool2+ ' color=\"black\" tooltip='+tool2+ ']');
      }
    }
  }
    for(let i=1;i<dotLines.length-1;i++){
      var parts = dotLines[i].split("\t");
      var strpartz = String(parts[2]);
      var strpartf = String(parts[6]);   
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
      var tool= "\""+"Incoming = "+strpartz+ " Outgoing = " + strpartf + " "+String(parts[8])+ " "+String(parts[9])+"\"";
      var tempNeg;
      var line = " "+  "\""+String(parts[0])+"\"" + "->" +  "\""+String(parts[4])+"\"" +"  ";

      if(parts[8]=="NEG"){
        tempNeg='tee';
        console.log("NEGGGGG")
        line = line + "[arrowhead=tee tooltip="+tool+"]"

      }
      else{
        tempNeg='triangle';
        line = line + "[tooltip="+tool+"]";

      }
      finaldot.push(line);
      var edge = {data:{id:String(parts[0])+String(parts[4]),source:String(parts[0]),target:String(parts[4]),neg:tempNeg}}  
      edges.push(edge);
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
    localCyto = {nodes:nodes,edges:edges};
    dotSrcLines = finaldotnosep;

    return [localCyto, dotSrcLines];
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}